import express from "express";
import {
  getProfile,
  updateProfile,
  importProfileFromResume,
} from "../controller/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", protectRoute, getProfile);
router.post("/", protectRoute, createRateLimiter("profileUpdate"), updateProfile);
router.post("/import/:resumeId", protectRoute, createRateLimiter("profileUpdate"), importProfileFromResume);

export default router;
