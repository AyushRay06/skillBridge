/**
 * Rate Limit Configuration
 *
 * Single source of truth for all rate limits across the application.
 * Maps (category, subscription plan) → (max requests, time window).
 *
 * Categories:
 *   - auth / oauth:        Security (DDoS, brute force) — keyed by IP
 *   - resumeCreate:        Cost control (1 Gemini call) — keyed by user ID
 *   - oneClickApply:       Cost control (5 Gemini calls) — keyed by user ID
 *   - autopilotRun:        Cost control (25+ Gemini + external API calls) — keyed by user ID
 *   - profileUpdate:       Spam prevention — keyed by user ID
 *   - globalApi:           DDoS safety net — keyed by IP
 */

// ── Bypass list — these emails skip ALL user-based rate limits ────────────────
// Used for developer/admin testing. IP-based limits (auth, global) still apply.
export const RATE_LIMIT_BYPASS_EMAILS = [
  "ayush.rayyy@gmail.com",
];

export const RATE_LIMIT_CONFIG = {
  // ── Security — per-IP, identical across all plans ──────────────────────────
  auth: {
    free:  { max: 999999, window: "1 m"  },
    pro:   { max: 999999, window: "1 m"  },
    elite: { max: 999999, window: "1 m"  },
  },
  oauth: {
    free:  { max: 999999, window: "15 m" },
    pro:   { max: 999999, window: "15 m" },
    elite: { max: 999999, window: "15 m" },
  },

  // ── Cost control — per-user, tiered by subscription plan ───────────────────
  resumeCreate: {
    free:  { max: 999999, window: "24 h" },
    pro:   { max: 999999, window: "24 h" },
    elite: { max: 999999, window: "24 h" },
  },
  oneClickApply: {
    free:  { max: 999999, window: "72 h" },
    pro:   { max: 999999, window: "24 h" },
    elite: { max: 999999, window: "24 h" },
  },
  autopilotRun: {
    free:  { max: 999999, window: "24 h" },  // Unblocked for demo / hackathon
    pro:   { max: 999999, window: "24 h" },
    elite: { max: 999999, window: "24 h" },
  },
  careerGuideChat: {
    free:  { max: 999999, window: "24 h" },
    pro:   { max: 999999, window: "24 h" },
    elite: { max: 999999, window: "24 h" },
  },

  // ── Spam prevention — per-user, same across all plans ──────────────────────
  profileUpdate: {
    free:  { max: 999999, window: "1 h"  },
    pro:   { max: 999999, window: "1 h"  },
    elite: { max: 999999, window: "1 h"  },
  },

  // ── DDoS safety net — per-IP, global ───────────────────────────────────────
  globalApi: {
    free:  { max: 999999, window: "1 m"  },
    pro:   { max: 999999, window: "1 m"  },
    elite: { max: 999999, window: "1 m"  },
  },
};

/**
 * Human-readable 429 error messages per category.
 *
 * Placeholders:
 *   {max}       — the limit that was exceeded
 *   {window}    — the time window (e.g. "24 h", "72 h")
 *   {resetTime} — seconds until the window resets (injected at runtime)
 */
export const RATE_LIMIT_MESSAGES = {
  auth: {
    title: "Too many login attempts",
    message: "You've exceeded the login attempt limit ({max} per minute). Please try again in {resetTime}.",
    suggestion: null,
  },
  oauth: {
    title: "Too many authentication attempts",
    message: "Too many authentication requests. Please try again in {resetTime}.",
    suggestion: null,
  },
  resumeCreate: {
    title: "Resume creation limit reached",
    message: "You've reached your daily resume creation limit ({max}/day on your current plan). Resets in {resetTime}.",
    suggestion: "Try using One-Click Apply to generate a tailored resume from a job description, or upgrade your plan for higher limits.",
    upgradeCta: "Upgrade to Pro for 10 resumes/day or Elite for 100/day.",
  },
  oneClickApply: {
    title: "One-Click Apply limit reached",
    message: "You've used your One-Click Apply limit ({max} every {window} on your current plan). Resets in {resetTime}.",
    suggestion: "You can still create resumes manually while you wait, or upgrade your plan for higher limits.",
    upgradeCta: "Upgrade to Pro for 5/day or Elite for 100/day.",
  },
  autopilotRun: {
    title: "Job Autopilot limit reached",
    message: "You've reached your daily Job Autopilot limit ({max}/day on your current plan). Resets in {resetTime}.",
    suggestion: "Try One-Click Apply for individual job applications while you wait, or upgrade for more autopilot runs.",
    upgradeCta: "Upgrade to Pro for 2 runs/day or Elite for 10/day.",
    blockedMessage: "Job Autopilot is available on Pro and Elite plans. Upgrade to unlock automated job search and applications.",
  },
  profileUpdate: {
    title: "Too many profile updates",
    message: "You've made too many profile updates ({max}/hour). Please try again in {resetTime}.",
    suggestion: null,
  },
  globalApi: {
    title: "Rate limit exceeded",
    message: "Too many requests. Please slow down and try again in a few seconds.",
    suggestion: null,
  },
};
