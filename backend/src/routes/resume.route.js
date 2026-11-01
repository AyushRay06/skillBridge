import express from "express";
import {
  createResume,
  getResume,
  getAllUserResumes,
  deleteResume,
} from "../controller/resume.controller.js";
import { compileLatexToPdf } from "../controller/compile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create", protectRoute, createRateLimiter("resumeCreate"), createResume);
router.get("/all", protectRoute, getAllUserResumes); // Get all user resumes
router.get("/:id", protectRoute, getResume);
router.get("/:id/pdf", protectRoute, compileLatexToPdf); // Compile LaTeX to PDF
router.delete("/:id", protectRoute, deleteResume);

export default router;
