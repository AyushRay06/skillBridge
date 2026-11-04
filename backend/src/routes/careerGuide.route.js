import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import {
  chat,
  chatStream,
  uploadResume,
  getConversations,
  getConversation,
  deleteConversation,
  getRoadmaps,
  getRoadmap,
  saveRoadmap,
  updateRoadmapStep,
  deleteRoadmap,
  saveSavedJob,
  getSavedJobs,
  deleteSavedJob,
} from "../controller/careerGuide.controller.js";

const router = express.Router();

// Multer memory storage — limits file size to 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf");
    const isTxt = file.mimetype === "text/plain" || file.originalname.endsWith(".txt");
    if (isPdf || isTxt) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and text files (.pdf, .txt) are supported"), false);
    }
  },
});

// Chat endpoint (with cost-control rate limiter)
router.post("/chat", protectRoute, createRateLimiter("careerGuideChat"), chat);
router.post("/chat/stream", protectRoute, createRateLimiter("careerGuideChat"), chatStream);

// Upload resume endpoint
router.post("/upload-resume", protectRoute, upload.single("resume"), uploadResume);

// Conversations management
router.get("/conversations", protectRoute, getConversations);
router.get("/conversations/:id", protectRoute, getConversation);
router.delete("/conversations/:id", protectRoute, deleteConversation);

// Roadmaps management
router.get("/roadmaps", protectRoute, getRoadmaps);
router.get("/roadmaps/:id", protectRoute, getRoadmap);
router.post("/roadmaps", protectRoute, saveRoadmap);
router.patch("/roadmaps/:id/steps/:stepId", protectRoute, updateRoadmapStep);
router.delete("/roadmaps/:id", protectRoute, deleteRoadmap);

// Saved Jobs management (Saved separately from Autopilot search)
router.get("/saved-jobs", protectRoute, getSavedJobs);
router.post("/saved-jobs", protectRoute, saveSavedJob);
router.delete("/saved-jobs/:id", protectRoute, deleteSavedJob);
router.post("/save-job", protectRoute, saveSavedJob);

export default router;

