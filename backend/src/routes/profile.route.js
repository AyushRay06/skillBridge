import express from "express";
import multer from "multer";
import {
  getProfile,
  updateProfile,
  importProfileFromResume,
  uploadAndImportProfile,
} from "../controller/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

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

router.get("/", protectRoute, getProfile);
router.post("/", protectRoute, createRateLimiter("profileUpdate"), updateProfile);
router.post("/import/:resumeId", protectRoute, createRateLimiter("profileUpdate"), importProfileFromResume);
router.post(
  "/upload-resume",
  protectRoute,
  createRateLimiter("profileUpdate"),
  upload.single("resume"),
  uploadAndImportProfile
);

export default router;
