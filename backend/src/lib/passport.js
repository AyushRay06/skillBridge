import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { findOrCreateOAuthUser } from "../controller/oauth.controller.js";

/**
 * Initialize Passport strategies.
 * Must be called AFTER dotenv.config() so env vars are available.
 */
export function initializePassport() {
  // ─── Google OAuth 2.0 Strategy ────────────────────────────────
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser(
              {
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value,
              },
              "google"
            );
            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
    console.log("✓ Google OAuth strategy initialized");
  } else {
    console.warn("⚠ Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
  }

  // ─── GitHub OAuth 2.0 Strategy ────────────────────────────────
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
          scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.[0]?.value || `${profile.username}@github.noreply.com`;

            const user = await findOrCreateOAuthUser(
              {
                id: String(profile.id),
                email,
                name: profile.displayName || profile.username,
                avatar: profile.photos?.[0]?.value,
              },
              "github"
            );
            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
    console.log("✓ GitHub OAuth strategy initialized");
  } else {
    console.warn("⚠ GitHub OAuth not configured (missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)");
  }
}

export default passport;
