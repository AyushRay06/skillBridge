import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";

const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");

/**
 * Find an existing user by OAuth provider ID or email, or create a new one.
 * Implements account linking: if the email matches an existing local account,
 * the OAuth provider is linked to that account.
 */
export const findOrCreateOAuthUser = async (profile, provider) => {
  // 1. Check if a user already exists with this exact OAuth provider + ID
  const existingOAuthUser = await prisma.user.findFirst({
    where: {
      provider,
      providerId: profile.id,
    },
  });

  if (existingOAuthUser) {
    // Update avatar in case it changed
    if (profile.avatar && profile.avatar !== existingOAuthUser.avatar) {
      return await prisma.user.update({
        where: { id: existingOAuthUser.id },
        data: { avatar: profile.avatar },
      });
    }
    return existingOAuthUser;
  }

  // 2. Check if a user with this email already exists (account linking)
  const existingEmailUser = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (existingEmailUser) {
    // Link the OAuth provider to the existing account
    return await prisma.user.update({
      where: { id: existingEmailUser.id },
      data: {
        provider,
        providerId: profile.id,
        avatar: profile.avatar || existingEmailUser.avatar,
      },
    });
  }

  // 3. Create a brand new user (no password — OAuth only)
  return await prisma.user.create({
    data: {
      fullName: profile.name,
      email: profile.email,
      provider,
      providerId: profile.id,
      avatar: profile.avatar,
      // password remains null — this is an OAuth-only account
    },
  });
};

/**
 * Handle successful OAuth callback.
 * Generates a JWT cookie (same as email/password login) and redirects to frontend.
 */
export const handleOAuthCallback = (req, res) => {
  // Determine target frontend URL dynamically from state or env
  let targetFrontend = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  if (req.query.state) {
    try {
      const decoded = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf-8"));
      if (decoded.returnTo) {
        targetFrontend = decoded.returnTo.replace(/\/+$/, "");
      }
    } catch (e) {}
  }

  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${targetFrontend}/login?error=oauth_failed`);
    }

    // Generate the JWT cookie used by login
    const token = generateToken(user.id, res);

    // Redirect to frontend dashboard on the originating domain with token param
    res.redirect(`${targetFrontend}/dashboard?token=${token}`);
  } catch (error) {
    console.log("Error in OAuth callback:", error.message);
    res.redirect(`${targetFrontend}/login?error=oauth_failed`);
  }
};
