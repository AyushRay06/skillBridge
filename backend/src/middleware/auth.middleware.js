import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized - No token provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decode.userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        provider: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Auto-downgrade to "free" if subscription period has lapsed
    if (
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) < new Date() &&
      user.subscriptionPlan !== "free"
    ) {
      user.subscriptionPlan = "free";
      prisma.user
        .update({
          where: { id: user.id },
          data: { subscriptionPlan: "free" },
        })
        .catch((err) =>
          console.error("[Auth] Error auto-downgrading expired subscription:", err.message)
        );
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    return res.status(401).json({ msg: "Unauthorized - Invalid token" });
  }
};
