import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.put("/updateProfile", protectRoute, updateProfile);

// Session validation — frontend calls this on mount to check if JWT cookie is valid
router.get("/me", protectRoute, (req, res) => {
  res.json(req.user);
});

export default router;
