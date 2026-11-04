import express from "express";
import {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
  triggerRun,
  triggerRunDirect,
  getDiscoveredJobs,
  deleteDiscoveredJob,
  saveJob,
} from "../controller/autopilot.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// All autopilot routes require authentication
router.use(protectRoute);

// ── Schedule CRUD ────────────────────────────────────────────────────────────
router.post("/schedules", createSchedule);
router.get("/schedules", getSchedules);
router.get("/schedules/:id", getSchedule);
router.patch("/schedules/:id", updateSchedule);
router.patch("/schedules/:id/toggle", toggleSchedule);
router.delete("/schedules/:id", deleteSchedule);

// ── Trigger a manual run ─────────────────────────────────────────────────────
router.post("/schedules/:id/run", createRateLimiter("autopilotRun"), triggerRun);

// ── Run now (direct, bypasses Inngest — for testing & on-demand) ──────────────
router.post("/schedules/:id/run-now", createRateLimiter("autopilotRun"), triggerRunDirect);

// ── Discovered jobs feed (across all schedules) ───────────────────────────────
router.get("/jobs", getDiscoveredJobs);
router.post("/jobs/save", saveJob);
router.delete("/jobs/:id", deleteDiscoveredJob);

export default router;
