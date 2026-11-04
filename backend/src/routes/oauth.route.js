import express from "express";
import passport from "../lib/passport.js";
import { handleOAuthCallback } from "../controller/oauth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// ─── Google OAuth 2.0 ─────────────────────────────────────────

// Initiate Google login — redirects user to Google's consent screen
router.get("/google", authLimiter, (req, res, next) => {
  const returnTo = req.query.return_to || req.headers.referer || process.env.FRONTEND_URL || "http://localhost:3000";
  let safeOrigin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  try {
    const parsed = new URL(returnTo);
    safeOrigin = parsed.origin;
  } catch (e) {}

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: Buffer.from(JSON.stringify({ returnTo: safeOrigin })).toString("base64"),
  })(req, res, next);
});

// Google callback — Google redirects here after user consents
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`,
  }),
  handleOAuthCallback
);

// ─── GitHub OAuth 2.0 ─────────────────────────────────────────

// Initiate GitHub login — redirects user to GitHub's consent screen
router.get("/github", authLimiter, (req, res, next) => {
  const returnTo = req.query.return_to || req.headers.referer || process.env.FRONTEND_URL || "http://localhost:3000";
  let safeOrigin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  try {
    const parsed = new URL(returnTo);
    safeOrigin = parsed.origin;
  } catch (e) {}

  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
    state: Buffer.from(JSON.stringify({ returnTo: safeOrigin })).toString("base64"),
  })(req, res, next);
});

// GitHub callback — GitHub redirects here after user consents
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=github_auth_failed`,
  }),
  handleOAuthCallback
);

export default router;
