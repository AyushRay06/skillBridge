import prisma from "../lib/prisma.js";
import { runCareerGuideAgent, runCareerGuideAgentStream, parseResumeText } from "../agents/careerGuide/agent.js";
import { detectLanguage } from "../agents/careerGuide/languageDetect.js";
import { PDFParse } from "pdf-parse";

/**
 * Career Guide Controller
 */

// Helper to resolve user profile across CGResumeProfile and Master UserProfile
async function getUserProfileWithFallback(userId) {
  let profile = await prisma.cGResumeProfile.findUnique({
    where: { userId },
  });

  // If no CGResumeProfile exists or it lacks skills, fallback to Master UserProfile
  if (!profile || (!profile.fullName && (!profile.skills || (Array.isArray(profile.skills) && profile.skills.length === 0)))) {
    const masterProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    if (masterProfile) {
      profile = {
        fullName: masterProfile.fullName,
        email: masterProfile.email,
        phone: masterProfile.phone,
        skills: masterProfile.skills || [],
        experience: masterProfile.experience || [],
        projects: masterProfile.projects || [],
        education: masterProfile.education || [],
        achievements: masterProfile.achievements || [],
      };
    }
  }

  // Also check if user has target roles from active autopilot schedules
  const schedule = await prisma.jobSchedule.findFirst({
    where: { userId, isActive: true },
  });
  if (schedule && Array.isArray(schedule.targetRoles) && schedule.targetRoles.length > 0) {
    if (!profile) {
      profile = {
        fullName: "Candidate",
        skills: [],
        targetRoles: schedule.targetRoles,
      };
    } else {
      profile.targetRoles = schedule.targetRoles;
    }
  }

  return profile;
}

// ─── POST /api/career-guide/chat ──────────────────────────────────────────────
export const chat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, message, language } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ msg: "Message content is required" });
    }

    let conversation;
    if (conversationId) {
      conversation = await prisma.cGConversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }
    } else {
      // Create a new conversation
      conversation = await prisma.cGConversation.create({
        data: {
          userId,
          title: message.trim().slice(0, 60),
          language: language || "auto",
        },
      });
    }

    // Determine language: if explicitly chosen (not "auto"), use it, else detect from message
    const resolvedLang =
      language && language !== "auto" ? language : detectLanguage(message);

    // Save the user's message
    await prisma.cGMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message.trim(),
      },
    });

    // Load recent history (last 30 messages to preserve full mock interview context)
    const recentMessages = await prisma.cGMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    // Reverse to chronological order and enrich with card context if present
    const conversationHistory = recentMessages
      .reverse()
      .map((m) => {
        let content = m.content || "";
        if (m.cardPayload?.type === "mock_interview" && m.cardPayload.data) {
          const d = m.cardPayload.data;
          content += `\n[MOCK INTERVIEW ACTIVE QUESTION]: Question ${d.questionNumber} of ${d.totalQuestions || 5} on "${d.topic || d.role}".\nQuestion prompt: ${d.question}${d.options?.length ? `\nOptions: ${d.options.join(" | ")}` : ""}`;
        }
        return { role: m.role, content: content.trim() };
      });

    // Fetch user's profile context (from CGResumeProfile, Master UserProfile, or active schedules)
    const userProfile = await getUserProfileWithFallback(userId);

    // Run the Career Guide Agent
    const { textContent, cardPayload } = await runCareerGuideAgent({
      message: message.trim(),
      conversationHistory,
      userProfile,
      language: resolvedLang,
    });

    // Save assistant message
    const assistantMsg = await prisma.cGMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: textContent,
        cardPayload: cardPayload || null,
      },
    });

    // Update conversation updatedAt
    await prisma.cGConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    res.json({
      conversationId: conversation.id,
      messageId: assistantMsg.id,
      reply: textContent,
      message: textContent,
      cardPayload: cardPayload || null,
    });
  } catch (error) {
    console.error("[CareerGuide Controller] chat error:", error);
    res.status(500).json({
      msg: "An error occurred while processing your request. Please try again.",
      error: error.message,
    });
  }
};

// ─── POST /api/career-guide/chat/stream ───────────────────────────────────────
export const chatStream = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, message, language } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ msg: "Message content is required" });
    }

    let conversation;
    if (conversationId) {
      conversation = await prisma.cGConversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }
    } else {
      conversation = await prisma.cGConversation.create({
        data: {
          userId,
          title: message.trim().slice(0, 60),
          language: language || "auto",
        },
      });
    }

    // Determine language
    const resolvedLang =
      language && language !== "auto" ? language : detectLanguage(message);

    // Save the user's message
    await prisma.cGMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message.trim(),
      },
    });

    // Load recent history (last 30 messages to preserve full mock interview context)
    const recentMessages = await prisma.cGMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const conversationHistory = recentMessages
      .reverse()
      .map((m) => {
        let content = m.content || "";
        if (m.cardPayload?.type === "mock_interview" && m.cardPayload.data) {
          const d = m.cardPayload.data;
          content += `\n[MOCK INTERVIEW ACTIVE QUESTION]: Question ${d.questionNumber} of ${d.totalQuestions || 5} on "${d.topic || d.role}".\nQuestion prompt: ${d.question}${d.options?.length ? `\nOptions: ${d.options.join(" | ")}` : ""}`;
        }
        return { role: m.role, content: content.trim() };
      });

    // Fetch user's profile context (from CGResumeProfile, Master UserProfile, or active schedules)
    const userProfile = await getUserProfileWithFallback(userId);

    // Setup Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    // 1. Initial event with conversationId
    sendEvent("init", { conversationId: conversation.id });

    let fullText = "";
    let capturedCard = null;

    // Run the streaming Career Guide Agent
    const { textContent, cardPayload } = await runCareerGuideAgentStream({
      message: message.trim(),
      conversationHistory,
      userProfile,
      language: resolvedLang,
      onChunk: (chunkText) => {
        fullText += chunkText;
        sendEvent("chunk", { text: chunkText });
      },
      onCard: (card) => {
        capturedCard = card;
        sendEvent("card", { cardPayload: card });
      },
    });

    const finalContent = fullText || textContent || "";
    const finalPayload = capturedCard || cardPayload || null;

    // Save assistant message in database
    const assistantMsg = await prisma.cGMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: finalContent,
        cardPayload: finalPayload,
      },
    });

    // Update conversation updatedAt
    await prisma.cGConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // Send done event
    sendEvent("done", {
      messageId: assistantMsg.id,
      conversationId: conversation.id,
      reply: finalContent,
      cardPayload: finalPayload,
    });

    res.end();
  } catch (error) {
    console.error("[CareerGuide Controller] chatStream error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        msg: "An error occurred while streaming response",
        error: error.message,
      });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ msg: error.message })}\n\n`);
      res.end();
    }
  }
};

// ─── POST /api/career-guide/upload-resume ─────────────────────────────────────
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const { conversationId } = req.body;

    if (!file) {
      return res.status(400).json({ msg: "No resume file provided" });
    }

    let text = "";
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      try {
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        text = result.text || "";
      } catch (pdfErr) {
        console.warn("[CareerGuide] PDF parsing error, falling back to string:", pdfErr.message);
        text = file.buffer.toString("utf-8");
      }
    } else {
      text = file.buffer.toString("utf-8");
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ msg: "Could not extract text from the uploaded file" });
    }

    // Do NOT log full resume text — only log length for privacy
    console.log(`[CG] Resume uploaded for user ${userId}, length: ${text.length} chars`);

    // Parse structured profile using LLM
    const parsed = await parseResumeText(text);

    if (!parsed) {
      return res.status(422).json({ msg: "Could not parse structured details from resume" });
    }

    // Upsert into CGResumeProfile
    const profile = await prisma.cGResumeProfile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: parsed.fullName || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        projects: parsed.projects || [],
        achievements: parsed.achievements || [],
        rawText: text.slice(0, 10000),
      },
      update: {
        fullName: parsed.fullName || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        projects: parsed.projects || [],
        achievements: parsed.achievements || [],
        rawText: text.slice(0, 10000),
      },
    });

    // Associate with conversation if supplied or create new
    let convId = conversationId;
    if (convId) {
      const conv = await prisma.cGConversation.findFirst({
        where: { id: convId, userId },
      });
      if (!conv) convId = null;
    }

    if (!convId) {
      const newConv = await prisma.cGConversation.create({
        data: {
          userId,
          title: `Resume Analysis: ${parsed.fullName || "Uploaded"}`,
        },
      });
      convId = newConv.id;
    }

    // Save assistant summary message
    await prisma.cGMessage.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: "I have analysed your resume. Here is a summary of your profile:",
        cardPayload: {
          type: "resume_summary",
          data: profile,
        },
      },
    });

    res.json({
      message: "Resume uploaded and analysed successfully!",
      conversationId: convId,
      cardPayload: {
        type: "resume_summary",
        data: profile,
      },
      resumeSummary: profile,
    });
  } catch (error) {
    console.error("[CareerGuide Controller] uploadResume error:", error);
    res.status(500).json({
      msg: "Failed to upload or parse resume",
      error: error.message,
    });
  }
};

// ─── GET /api/career-guide/conversations ──────────────────────────────────────
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await prisma.cGConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
    res.json({ conversations });
  } catch (error) {
    console.error("[CareerGuide Controller] getConversations error:", error);
    res.status(500).json({ msg: "Failed to fetch conversations" });
  }
};

// ─── GET /api/career-guide/conversations/:id ──────────────────────────────────
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await prisma.cGConversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    res.json({
      conversation,
      ...conversation,
    });
  } catch (error) {
    console.error("[CareerGuide Controller] getConversation error:", error);
    res.status(500).json({ msg: "Failed to fetch conversation" });
  }
};

// ─── DELETE /api/career-guide/conversations/:id ───────────────────────────────
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await prisma.cGConversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    await prisma.cGConversation.delete({ where: { id } });
    res.json({ msg: "Conversation deleted" });
  } catch (error) {
    console.error("[CareerGuide Controller] deleteConversation error:", error);
    res.status(500).json({ msg: "Failed to delete conversation" });
  }
};

// ─── GET /api/career-guide/roadmaps ───────────────────────────────────────────
export const getRoadmaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmaps = await prisma.cGRoadmap.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });
    res.json({ roadmaps });
  } catch (error) {
    console.error("[CareerGuide Controller] getRoadmaps error:", error);
    res.status(500).json({ msg: "Failed to fetch roadmaps" });
  }
};

// ─── GET /api/career-guide/roadmaps/:id ───────────────────────────────────────
export const getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const roadmap = await prisma.cGRoadmap.findFirst({
      where: { id, userId },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    if (!roadmap) {
      return res.status(404).json({ msg: "Roadmap not found" });
    }

    res.json({ roadmap });
  } catch (error) {
    console.error("[CareerGuide Controller] getRoadmap error:", error);
    res.status(500).json({ msg: "Failed to fetch roadmap" });
  }
};

// ─── POST /api/career-guide/roadmaps ──────────────────────────────────────────
export const saveRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, targetRole, targetSkill, estimatedWeeks, steps, language } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const roadmap = await prisma.cGRoadmap.create({
      data: {
        userId,
        title,
        targetRole: targetRole || null,
        targetSkill: targetSkill || null,
        estimatedWeeks: estimatedWeeks ? Number(estimatedWeeks) : null,
        language: language || "en",
        steps: {
          create: (steps || []).map((s, idx) => ({
            stepNumber: s.stepNumber || idx + 1,
            title: s.title || `Step ${idx + 1}`,
            whatToLearn: s.whatToLearn || "",
            whyItMatters: s.whyItMatters || "",
            resources: s.resources || [],
            estimatedDays: s.estimatedDays ? Number(s.estimatedDays) : null,
            status: s.status || "not_started",
          })),
        },
      },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    res.status(201).json({ roadmap });
  } catch (error) {
    console.error("[CareerGuide Controller] saveRoadmap error:", error);
    res.status(500).json({ msg: "Failed to save roadmap" });
  }
};

// ─── PATCH /api/career-guide/roadmaps/:id/steps/:stepId ───────────────────────
export const updateRoadmapStep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, stepId } = req.params;
    const { status } = req.body;

    // Verify roadmap ownership
    const roadmap = await prisma.cGRoadmap.findFirst({
      where: { id, userId },
    });
    if (!roadmap) {
      return res.status(404).json({ msg: "Roadmap not found" });
    }

    // Check if stepId is a numeric stepNumber (e.g. "1", "2") or a cuid
    let step;
    const numericStep = parseInt(stepId, 10);
    if (!isNaN(numericStep) && String(numericStep) === String(stepId).trim()) {
      const existing = await prisma.cGRoadmapStep.findFirst({
        where: { roadmapId: id, stepNumber: numericStep },
      });
      if (existing) {
        step = await prisma.cGRoadmapStep.update({
          where: { id: existing.id },
          data: { status },
        });
      }
    }

    if (!step) {
      step = await prisma.cGRoadmapStep.update({
        where: { id: stepId },
        data: { status },
      });
    }

    res.json({ step });
  } catch (error) {
    console.error("[CareerGuide Controller] updateRoadmapStep error:", error);
    res.status(500).json({ msg: "Failed to update step status" });
  }
};

// ─── DELETE /api/career-guide/roadmaps/:id ────────────────────────────────────
export const deleteRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const roadmap = await prisma.cGRoadmap.findFirst({
      where: { id, userId },
    });
    if (!roadmap) {
      return res.status(404).json({ msg: "Roadmap not found" });
    }

    await prisma.cGRoadmap.delete({ where: { id } });
    res.json({ msg: "Roadmap deleted" });
  } catch (error) {
    console.error("[CareerGuide Controller] deleteRoadmap error:", error);
    res.status(500).json({ msg: "Failed to delete roadmap" });
  }
};

const CHAT_SAVED_SCHEDULE_NAME = "Career Guide Saved Jobs";

// ─── POST /api/career-guide/saved-jobs ────────────────────────────────────────
export const saveSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, company, location, salary, url, source, description, matchScore } = req.body;

    if (!title || !company) {
      return res.status(400).json({ msg: "Job title and company are required." });
    }

    // Find or create dedicated schedule for chat saved jobs
    let schedule = await prisma.jobSchedule.findFirst({
      where: {
        userId,
        name: CHAT_SAVED_SCHEDULE_NAME,
      },
    });

    if (!schedule) {
      schedule = await prisma.jobSchedule.create({
        data: {
          userId,
          name: CHAT_SAVED_SCHEDULE_NAME,
          targetRoles: [title],
          locations: ["Remote", "Various"],
          workType: "any",
          experienceLevel: "any",
          postAge: "7d",
          cronExpression: "0 0 1 1 *",
          isActive: false,
        },
      });
    }

    // Check if job already saved for this user
    const existing = await prisma.discoveredJob.findFirst({
      where: {
        schedule: { userId },
        source: "chat_saved",
        ...(url ? { url } : { title, company }),
      },
    });

    if (existing) {
      return res.status(200).json({
        msg: "Job is already in your Saved Jobs.",
        job: existing,
        alreadySaved: true,
      });
    }

    const job = await prisma.discoveredJob.create({
      data: {
        scheduleId: schedule.id,
        title,
        company,
        location: location || "Remote / Various",
        salary: salary || null,
        url: url || null,
        source: "chat_saved",
        description: description || `${title} at ${company}. Saved from Career Guide chat.`,
        matchScore: matchScore || 95,
        status: "saved_from_chat",
      },
    });

    return res.status(201).json({
      msg: "Job saved successfully to Saved Jobs.",
      job,
      alreadySaved: false,
    });
  } catch (error) {
    console.error("[CareerGuide Controller] saveSavedJob error:", error);
    return res.status(500).json({ msg: "Failed to save job." });
  }
};

// ─── GET /api/career-guide/saved-jobs ─────────────────────────────────────────
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await prisma.discoveredJob.findMany({
      where: {
        schedule: { userId },
        source: "chat_saved",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        salary: true,
        url: true,
        source: true,
        description: true,
        matchScore: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ jobs, total: jobs.length });
  } catch (error) {
    console.error("[CareerGuide Controller] getSavedJobs error:", error);
    return res.status(500).json({ msg: "Failed to fetch saved jobs." });
  }
};

// ─── DELETE /api/career-guide/saved-jobs/:id ──────────────────────────────────
export const deleteSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const job = await prisma.discoveredJob.findFirst({
      where: {
        id,
        schedule: { userId },
        source: "chat_saved",
      },
    });

    if (!job) {
      return res.status(404).json({ msg: "Saved job not found or unauthorized." });
    }

    await prisma.discoveredJob.delete({ where: { id } });

    return res.status(200).json({ msg: "Job removed from saved jobs." });
  } catch (error) {
    console.error("[CareerGuide Controller] deleteSavedJob error:", error);
    return res.status(500).json({ msg: "Failed to delete saved job." });
  }
};

