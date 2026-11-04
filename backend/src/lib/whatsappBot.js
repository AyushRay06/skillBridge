/**
 * SkillBridge - WhatsApp Career Guide Bot
 *
 * Uses whatsapp-web.js to run a direct WhatsApp bot via QR-code scan.
 * Zero API keys, zero subscription cost, and perfect for academic showcases/demos.
 *
 * Integrates directly with:
 * - SkillBridge Career Guide Agent (Gemini + LangChain)
 * - Resume PDF parsing & ATS scoring
 * - Multilingual support (Assamese, Hindi, English)
 * - Persistent session via LocalAuth
 */

import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import prisma from "./prisma.js";
import { runCareerGuideAgent, parseResumeText } from "../agents/careerGuide/agent.js";
import { detectLanguage } from "../agents/careerGuide/languageDetect.js";
import { formatCardForWhatsApp } from "./whatsappCards.js";
import { PDFParse } from "pdf-parse";

let client = null;
let botStatus = "initializing"; // "initializing" | "qr_ready" | "connected" | "disconnected"
let latestQr = null;

export function getBotStatus() {
  return { status: botStatus, hasQr: !!latestQr, qrString: latestQr };
}

export function initWhatsAppBot() {
  if (client) {
    console.log("[WhatsApp] Bot client already initialized.");
    return client;
  }

  console.log("--------------------------------------------------");
  console.log("🚀 [WhatsApp] Starting SkillBridge WhatsApp Bot...");
  console.log("--------------------------------------------------");

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./.wwebjs_auth" }),
    // Modern Desktop User-Agent prevents WhatsApp Web from rejecting with "Couldn't link device"
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/{version}.html",
      strict: false,
    },
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
  });

  // Event: QR Code generated (requires phone scan)
  client.on("qr", (qr) => {
    botStatus = "qr_ready";
    latestQr = qr;
    console.log("\n=======================================================");
    console.log("📱 SCAN THIS QR CODE WITH WHATSAPP ON YOUR PHONE:");
    console.log("   (Open WhatsApp -> Linked Devices -> Link a Device)");
    console.log("   OR open http://localhost:5000/api/whatsapp/qr in browser");
    console.log("=======================================================\n");
    qrcode.generate(qr, { small: true });
    console.log("\nWaiting for device to connect... (QR expires in ~20 seconds)\n");
  });

  // Event: Authenticated
  client.on("authenticated", () => {
    console.log("\n🔐 [WhatsApp] Authentication SUCCESSFUL! Synchronizing chats...\n");
  });

  // Event: Session Ready
  client.on("ready", () => {
    botStatus = "connected";
    latestQr = null;
    console.log("\n=======================================================");
    console.log("✅ [WhatsApp] SkillBridge Bot is ONLINE and connected!");
    console.log("   Ready to accept career guidance chats & resumes.");
    console.log("=======================================================\n");
  });

  // Event: Authentication failure
  client.on("auth_failure", (msg) => {
    botStatus = "disconnected";
    client = null;
    console.error("❌ [WhatsApp] Auth failure:", msg);
    console.error("   → Delete .wwebjs_auth folder and restart the server to get a fresh QR.");
  });

  // Event: Disconnected — defer destroy so Puppeteer finishes its current cycle
  client.on("disconnected", (reason) => {
    botStatus = "disconnected";
    console.warn("⚠️  [WhatsApp] Bot disconnected:", reason);
    // Use setImmediate so Puppeteer's current execution context finishes
    // before we tear down the browser — prevents "Execution context was destroyed" crash
    setImmediate(() => {
      if (client) {
        client.destroy().catch(() => {});
        client = null;
      }
    });
  });

  // Event: Incoming Message Handler
  client.on("message", async (msg) => {
    // Ignore status updates, system broadcasts, or group messages
    if (msg.from.includes("@broadcast") || msg.isGroupMsg) return;

    const fromPhone = msg.from.replace("@c.us", "");
    const senderName = msg._data?.notifyName || "Student";

    console.log(`\n📨 [WhatsApp] Incoming from +${fromPhone} (${senderName})`);

    let chat = null;
    try {
      chat = await msg.getChat();
      await chat.sendStateTyping();
    } catch (e) {
      // Non-fatal if chat typing fails
    }

    try {
      // 1. Resolve or create user in Prisma DB
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
        console.log(`[WhatsApp] Created new demo user for +${fromPhone}`);
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

      // 3. Handle PDF Resume Attachment
      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        if (media && media.mimetype && media.mimetype.includes("pdf")) {
          console.log(`[WhatsApp] User uploaded PDF Resume: ${media.filename || "resume.pdf"}`);
          await msg.reply("📄 *Received your Resume PDF!* Analyzing skills, structure, and ATS score... Please give me a few seconds.");

          try {
            const buffer = Buffer.from(media.data, "base64");
            let extractedText = "";

            try {
              const parser = new PDFParse({ data: buffer });
              const parsedPdf = await parser.getText();
              extractedText = parsedPdf.text || "";
            } catch (pdfErr) {
              extractedText = buffer.toString("utf-8");
            }

            if (extractedText && extractedText.trim().length > 50) {
              // Parse structured resume
              const parsedProfile = await parseResumeText(extractedText);

              // Update CGResumeProfile
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

              // Also update UserProfile skills
              if (parsedProfile.skills?.length) {
                await prisma.userProfile.updateMany({
                  where: { userId: user.id },
                  data: { skills: parsedProfile.skills },
                });
              }

              // Ask Agent to review the newly parsed resume
              const reviewPrompt = "I have uploaded my resume. Please give me an honest review with ATS score, strengths, areas to improve, and recommend top matching roles.";
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

              let reply = reviewResponse.textContent || "Here is your resume evaluation:";
              if (reviewResponse.cardPayload) {
                reply += formatCardForWhatsApp(reviewResponse.cardPayload);
              }

              // Save to conversation history
              await prisma.cGMessage.create({
                data: {
                  conversationId: conversation.id,
                  role: "assistant",
                  content: reply,
                  cardPayload: reviewResponse.cardPayload || null,
                },
              });

              if (chat) await chat.clearState();
              await msg.reply(reply);
              return;
            }
          } catch (resumeErr) {
            console.error("[WhatsApp] Resume parsing failed:", resumeErr);
            await msg.reply("⚠️ I had trouble reading the text from your PDF. Please ensure it's not a scanned image, or feel free to type your skills here!");
            if (chat) await chat.clearState();
            return;
          }
        }
      }

      // 4. Handle Standard Text Message
      const userText = msg.body?.trim();
      if (!userText) {
        if (chat) await chat.clearState();
        return;
      }

      // Save user message to conversation history
      await prisma.cGMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: userText,
        },
      });

      // Load recent 10 messages for conversation continuity
      const recentMessages = await prisma.cGMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const conversationHistory = recentMessages
        .reverse()
        .map((m) => ({ role: m.role, content: m.content || "" }));

      // Fetch user profile (skills, target roles, experience)
      const userProfile = user.cgResumeProfile || user.profile || { fullName: senderName, skills: [] };

      // Language detection
      const resolvedLang = detectLanguage(userText);

      // 5. Invoke SkillBridge Career Guide Agent
      const agentResponse = await runCareerGuideAgent({
        message: userText,
        conversationHistory,
        userProfile,
        language: resolvedLang,
      });

      // 6. Format reply text and structured cards
      let finalReply = agentResponse.textContent || "";
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

      // Update conversation timestamp
      await prisma.cGConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      // 7. Clear typing and send WhatsApp message
      if (chat) await chat.clearState();
      await msg.reply(finalReply);

    } catch (err) {
      console.error("[WhatsApp] Error processing message:", err);
      if (chat) await chat.clearState();
      await msg.reply("⚠️ Sorry, I encountered an issue while generating advice. Please ask again!");
    }
  });

  // Start the WhatsApp Client
  client.initialize().catch((err) => {
    console.error("❌ [WhatsApp] Failed to initialize client:", err);
    botStatus = "disconnected";
  });

  // Catch Puppeteer "Execution context was destroyed" and similar unhandled
  // rejections from whatsapp-web.js internals so they don't crash the process.
  process.on("unhandledRejection", (reason) => {
    const msg = String(reason);
    if (
      msg.includes("Execution context was destroyed") ||
      msg.includes("Target closed") ||
      msg.includes("Session closed")
    ) {
      console.warn("[WhatsApp] Suppressed Puppeteer internal rejection:", msg.slice(0, 120));
      return; // non-fatal — bot reconnects on next message
    }
    // For everything else, still log but don't crash
    console.error("[UnhandledRejection]", reason);
  });

  return client;
}

