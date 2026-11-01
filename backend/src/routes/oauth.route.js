import express from "express";
import passport from "../lib/passport.js";
import { handleOAuthCallback } from "../controller/oauth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// ─── Google OAuth 2.0 ─────────────────────────────────────────

// Initiate Google login — redirects user to Google's consent screen
router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

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
router.get(
  "/github",
  authLimiter,
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

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
