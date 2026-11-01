import express from "express";
import {
  runOneClickApply,
  getApplication,
  getAllApplications,
  deleteApplication,
  compileApplicationResumeToPdf,
} from "../controller/apply.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/one-click", protectRoute, createRateLimiter("oneClickApply"), runOneClickApply);
router.get("/all", protectRoute, getAllApplications);
router.get("/:id", protectRoute, getApplication);
router.get("/:id/pdf", protectRoute, compileApplicationResumeToPdf);
router.delete("/:id", protectRoute, deleteApplication);

export default router;
