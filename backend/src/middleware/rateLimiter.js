import { Ratelimit } from "@upstash/ratelimit";
import redis from "../lib/redis.js";
import { RATE_LIMIT_CONFIG, RATE_LIMIT_MESSAGES, RATE_LIMIT_BYPASS_EMAILS } from "./rateLimitConfig.js";

// ─── Hackathon Showcase Mode ──────────────────────────────────────────────────
// Set to true by default to bypass all rate limits and feature gating.
// Can be re-enabled after the hackathon by setting DISABLE_RATE_LIMITING=false in .env.
export const DISABLE_RATE_LIMITING = process.env.DISABLE_RATE_LIMITING !== "false";

// ─── Pre-create all Ratelimit instances at startup (if enabled) ───────────────
// (category × plan) = 7 categories × 3 plans = 21 instances
// Cached so we don't create new instances per request.

const rateLimitInstances = {};

if (!DISABLE_RATE_LIMITING) {
  try {
    for (const [category, plans] of Object.entries(RATE_LIMIT_CONFIG)) {
      rateLimitInstances[category] = {};
      for (const [plan, { max, window }] of Object.entries(plans)) {
        // Skip creating instance for max=0 (feature blocked)
        if (max === 0) {
          rateLimitInstances[category][plan] = null;
          continue;
        }
        rateLimitInstances[category][plan] = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(max, window),
          prefix: `ratelimit:${category}:${plan}`,
        });
      }
    }
  } catch (err) {
    console.warn("[RateLimit] Failed to initialize Upstash rate limiters:", err.message);
  }
} else {
  console.log("[RateLimit] 🚀 Rate limiting is DISABLED for Hackathon Showcase Mode. All features unlocked.");
}

// ─── Helper: format seconds into human-readable string ───────────────────────
function formatResetTime(resetTimestamp) {
  const now = Date.now();
  const diffMs = Math.max(0, resetTimestamp - now);
  const diffSeconds = Math.ceil(diffMs / 1000);

  if (diffSeconds < 60) return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""}`;
  if (diffSeconds < 3600) {
    const mins = Math.ceil(diffSeconds / 60);
    return `${mins} minute${mins !== 1 ? "s" : ""}`;
  }
  const hours = Math.ceil(diffSeconds / 3600);
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

// ─── Helper: build 429 error response ────────────────────────────────────────
function build429Response(category, plan, limit, remaining, reset) {
  const msgConfig = RATE_LIMIT_MESSAGES[category];
  const planConfig = RATE_LIMIT_CONFIG[category][plan];
  const resetTime = formatResetTime(reset);
  const retryAfterSeconds = Math.ceil(Math.max(0, reset - Date.now()) / 1000);

  // Replace placeholders in message
  const message = msgConfig.message
    .replace("{max}", planConfig.max)
    .replace("{window}", planConfig.window)
    .replace("{resetTime}", resetTime);

  const response = {
    error: msgConfig.title,
    message,
    plan,
    limit,
    remaining: 0,
    retryAfter: retryAfterSeconds,
    resetAt: new Date(reset).toISOString(),
  };

  // Add suggestion if available
  if (msgConfig.suggestion) {
    response.suggestion = msgConfig.suggestion;
  }

  // Add upgrade CTA for free/pro users
  if (msgConfig.upgradeCta && plan !== "elite") {
    response.upgrade = msgConfig.upgradeCta;
  }

  return { response, retryAfterSeconds };
}

// ─── IP-based limiters (auth, oauth, global) ─────────────────────────────────
// These don't need user context — they use the client's IP address.

/**
 * Auth rate limiter — 5 req/min per IP
 * Used on: POST /api/auth/signup, POST /api/auth/login
 */
export const authLimiter = async (req, res, next) => {
  if (DISABLE_RATE_LIMITING) {
    res.set("X-RateLimit-Limit", "999999");
    res.set("X-RateLimit-Remaining", "999999");
    res.set("X-RateLimit-Reset", (Date.now() + 86400000).toString());
    return next();
  }

  try {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const instance = rateLimitInstances.auth?.free; // Same limit for all plans
    if (!instance) return next();

    const { success, limit, remaining, reset } = await instance.limit(key);

    res.set("X-RateLimit-Limit", limit.toString());
    res.set("X-RateLimit-Remaining", remaining.toString());
    res.set("X-RateLimit-Reset", reset.toString());

    if (!success) {
      const { response, retryAfterSeconds } = build429Response("auth", "free", limit, remaining, reset);
      res.set("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json(response);
    }
    next();
  } catch (error) {
    console.warn("[RateLimit] Auth limiter error (fail-open):", error.message);
    next(); // Fail open
  }
};

/**
 * Global IP rate limiter — 120 req/min per IP
 * Used as first middleware on ALL routes (DDoS safety net)
 */
export const globalIpLimiter = async (req, res, next) => {
  if (DISABLE_RATE_LIMITING) {
    res.set("X-RateLimit-Limit", "999999");
    res.set("X-RateLimit-Remaining", "999999");
    res.set("X-RateLimit-Reset", (Date.now() + 86400000).toString());
    return next();
  }

  try {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const instance = rateLimitInstances.globalApi?.free; // Same limit for all plans
    if (!instance) return next();

    const { success, limit, remaining, reset } = await instance.limit(key);

    res.set("X-RateLimit-Limit", limit.toString());
    res.set("X-RateLimit-Remaining", remaining.toString());
    res.set("X-RateLimit-Reset", reset.toString());

    if (!success) {
      const { response, retryAfterSeconds } = build429Response("globalApi", "free", limit, remaining, reset);
      res.set("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json(response);
    }
    next();
  } catch (error) {
    console.warn("[RateLimit] Global IP limiter error (fail-open):", error.message);
    next(); // Fail open
  }
};

// ─── User-based tiered limiter factory ───────────────────────────────────────
// These require protectRoute to have run first (sets req.user).

/**
 * Creates a rate-limiting middleware for a specific category.
 * Reads `req.user.subscriptionPlan` to determine the limit tier.
 *
 * @param {string} category — one of: "resumeCreate", "oneClickApply", "autopilotRun", "profileUpdate", "careerGuideChat"
 * @returns {Function} Express middleware
 *
 * Usage in routes:
 *   router.post("/create", protectRoute, createRateLimiter("resumeCreate"), createResume);
 */
export function createRateLimiter(category) {
  return async (req, res, next) => {
    // If rate limiting is disabled, set unlimited headers and pass through immediately
    if (DISABLE_RATE_LIMITING) {
      res.set("X-RateLimit-Limit", "999999");
      res.set("X-RateLimit-Remaining", "999999");
      res.set("X-RateLimit-Reset", (Date.now() + 86400000).toString());
      return next();
    }

    try {
      // ── Bypass for whitelisted dev/admin emails ─────────────────────────
      const userEmail = req.user?.email;
      if (userEmail && RATE_LIMIT_BYPASS_EMAILS.includes(userEmail)) {
        return next();
      }

      const plan = req.user?.subscriptionPlan || "free";
      const key = req.user?.id || req.ip;

      // ── Handle blocked features (max = 0) ──────────────────────────────
      if (RATE_LIMIT_CONFIG[category]?.[plan]?.max === 0) {
        const msgConfig = RATE_LIMIT_MESSAGES[category] || {};
        return res.status(403).json({
          error: msgConfig.title || "Feature Unavailable",
          message: msgConfig.blockedMessage || `This feature is not available on the ${plan} plan.`,
          plan,
          upgrade: msgConfig.upgradeCta || "Upgrade your plan to access this feature.",
          isBlocked: true,
        });
      }

      const instance = rateLimitInstances[category]?.[plan];
      if (!instance) {
        return next();
      }

      const { success, limit, remaining, reset } = await instance.limit(key);

      res.set("X-RateLimit-Limit", limit.toString());
      res.set("X-RateLimit-Remaining", remaining.toString());
      res.set("X-RateLimit-Reset", reset.toString());

      if (!success) {
        const { response, retryAfterSeconds } = build429Response(category, plan, limit, remaining, reset);
        res.set("Retry-After", retryAfterSeconds.toString());
        return res.status(429).json(response);
      }
      next();
    } catch (error) {
      console.warn(`[RateLimit] ${category} limiter error (fail-open):`, error.message);
      next(); // Fail open
    }
  };
}
