import express from "express";
import axios from "axios";
import prisma from "../lib/prisma.js";
import { runCareerGuideAgent, parseResumeText } from "../agents/careerGuide/agent.js";
import { detectLanguage } from "../agents/careerGuide/languageDetect.js";
import { formatCardForWhatsApp } from "../lib/whatsappCards.js";
import { PDFParse } from "pdf-parse";

const router = express.Router();

/**
 * Helper to escape special XML characters for TwiML
 */
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * GET /api/whatsapp/twilio
 * Quick health check and setup info
 */
router.get("/twilio", (req, res) => {
  res.json({
    status: "online",
    service: "SkillBridge Twilio WhatsApp Webhook",
    instructions: {
      step1: "In Twilio Console -> Messaging -> Try it out -> Send a WhatsApp message",
      step2: "Send 'join <two-words>' from your WhatsApp to the Twilio number (+1 415 523 8886)",
      step3: "In Twilio Sandbox Settings, set 'WHEN A MESSAGE COMES IN' to POST https://<your-domain>/api/whatsapp/twilio",
      step4: "Send any message on WhatsApp to chat with SkillBridge Career Guide!"
    }
  });
});

/**
 * POST /api/whatsapp/simulate
 * Direct simulator endpoint for demo showcasing
 */
router.post("/simulate", async (req, res) => {
  try {
    const { message, language = "auto" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const resolvedLang = language && language !== "auto" ? language : detectLanguage(message);
    const agentResponse = await runCareerGuideAgent({
      message: message.trim(),
      conversationHistory: [],
      userProfile: { fullName: "Hackathon Judge", skills: ["React", "JavaScript", "Python"] },
      language: resolvedLang,
    });

    let reply = agentResponse.textContent || "";
    if (agentResponse.cardPayload) {
      reply += formatCardForWhatsApp(agentResponse.cardPayload);
    }

    res.json({
      reply,
      cardPayload: agentResponse.cardPayload || null,
      language: resolvedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  } catch (err) {
    console.error("[WhatsApp Simulate Error]:", err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

/**
 * POST /api/whatsapp/twilio
 * Incoming Twilio WhatsApp message webhook
 */
router.post("/twilio", async (req, res) => {
  try {
    const rawFrom = req.body.From || ""; // e.g. "whatsapp:+919876543210"
    const fromPhone = rawFrom.replace("whatsapp:", "").replace("+", "").trim();
    const senderName = req.body.ProfileName || "Student";
    const userText = (req.body.Body || "").trim();
    const mediaUrl = req.body.MediaUrl0;
    const mediaType = req.body.MediaContentType0;

    console.log(`\n📨 [Twilio WhatsApp] Incoming from +${fromPhone} (${senderName}): "${userText}"`);

    if (!fromPhone) {
      return res.type("text/xml").send("<Response></Response>");
    }

    // 1. Resolve or create user in Prisma
    const userEmail = `wa_${fromPhone}@skillbridge.app`;
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userEmail },
          { profile: { phone: fromPhone } },
          { profile: { phone: `+${fromPhone}` } },
        ],
      },
      include: { profile: true, cgResumeProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: senderName,
          email: userEmail,
          profile: {
            create: {
              fullName: senderName,
              email: userEmail,
              phone: fromPhone,
              skills: [],
            },
          },
        },
        include: { profile: true, cgResumeProfile: true },
      });
      console.log(`[Twilio WhatsApp] Created new demo user for +${fromPhone}`);
    }

    // 2. Fetch or create active conversation
    let conversation = await prisma.cGConversation.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.cGConversation.create({
        data: {
          userId: user.id,
          title: `WhatsApp Career Guide (+${fromPhone})`,
          language: "auto",
        },
      });
    }

    let finalReply = "";

    // 3. Handle PDF Resume Attachment
    if (mediaUrl && mediaType && mediaType.includes("pdf")) {
      console.log(`[Twilio WhatsApp] User sent PDF Resume: ${mediaUrl}`);

      try {
        const pdfResponse = await axios.get(mediaUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(pdfResponse.data);

        let extractedText = "";
        try {
          const parser = new PDFParse({ data: buffer });
          const parsedPdf = await parser.getText();
          extractedText = parsedPdf.text || "";
        } catch (pdfErr) {
          extractedText = buffer.toString("utf-8");
        }

        if (extractedText && extractedText.trim().length > 50) {
          const parsedProfile = await parseResumeText(extractedText);

          await prisma.cGResumeProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              fullName: parsedProfile.fullName || user.fullName,
              email: parsedProfile.email || user.email,
              phone: parsedProfile.phone || fromPhone,
              skills: parsedProfile.skills || [],
              experience: parsedProfile.experience || [],
              education: parsedProfile.education || [],
              projects: parsedProfile.projects || [],
              achievements: parsedProfile.achievements || [],
              rawText: extractedText.slice(0, 10000),
            },
            update: {
              fullName: parsedProfile.fullName || user.fullName,
              skills: parsedProfile.skills || [],
              experience: parsedProfile.experience || [],
              education: parsedProfile.education || [],
              projects: parsedProfile.projects || [],
              achievements: parsedProfile.achievements || [],
              rawText: extractedText.slice(0, 10000),
            },
          });

          const reviewPrompt =
            "I have uploaded my resume. Please give me an honest review with ATS score, strengths, areas to improve, and recommend top matching roles.";

          const reviewResponse = await runCareerGuideAgent({
            message: reviewPrompt,
            conversationHistory: [],
            userProfile: {
              ...user.profile,
              skills: parsedProfile.skills || [],
              experience: parsedProfile.experience || [],
              education: parsedProfile.education || [],
              projects: parsedProfile.projects || [],
            },
            language: "auto",
          });

          finalReply = reviewResponse.textContent || "Here is your resume evaluation:";
          if (reviewResponse.cardPayload) {
            finalReply += formatCardForWhatsApp(reviewResponse.cardPayload);
          }
        }
      } catch (err) {
        console.error("[Twilio WhatsApp] Error parsing PDF:", err);
        finalReply = "⚠️ I could not process your PDF resume. Please make sure it contains selectable text, or describe your background here!";
      }
    }

    // 4. Handle Standard Text Message
    if (!finalReply && userText) {
      // Save user message to conversation history
      await prisma.cGMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: userText,
        },
      });

      // Load recent 10 messages for continuity
      const recentMessages = await prisma.cGMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const conversationHistory = recentMessages
        .reverse()
        .map((m) => ({ role: m.role, content: m.content || "" }));

      const userProfile =
        user.cgResumeProfile || user.profile || { fullName: senderName, skills: [] };

      const resolvedLang = detectLanguage(userText);

      // Invoke SkillBridge Career Guide Agent
      const agentResponse = await runCareerGuideAgent({
        message: userText,
        conversationHistory,
        userProfile,
        language: resolvedLang,
      });

      finalReply = agentResponse.textContent || "";
      if (agentResponse.cardPayload) {
        finalReply += formatCardForWhatsApp(agentResponse.cardPayload);
      }

      // Save assistant reply to DB
      await prisma.cGMessage.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: finalReply,
          cardPayload: agentResponse.cardPayload || null,
        },
      });

      await prisma.cGConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });
    }

    if (!finalReply) {
      finalReply = "Hello! I am your SkillBridge Career Guide. Ask me any career question or request a learning roadmap in English, Hindi, or Assamese!";
    }

    // 5. Send back TwiML XML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(finalReply)}</Message>
</Response>`;

    res.type("text/xml").send(twiml);

  } catch (error) {
    console.error("[Twilio WhatsApp Error]:", error);
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>⚠️ Sorry, I encountered an issue processing your request. Please try asking again!</Message>
</Response>`;
    res.type("text/xml").send(fallbackTwiml);
  }
});

export default router;
