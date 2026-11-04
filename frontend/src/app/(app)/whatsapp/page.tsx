"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  Check,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Sparkles,
  RefreshCw,
  Bell,
  FileText,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isNudge?: boolean;
}

const QUICK_PROMPTS = [
  { label: "🗺️ Frontend Roadmap", text: "Create a 3-month Frontend Developer roadmap for me" },
  { label: "🔍 Data Analyst (Hindi)", text: "मुझे Data Analyst बनना है, क्या स्किल्स चाहिए और क्या स्कोप है?" },
  { label: "🎓 Assam & APSC Careers", text: "মই অসমৰ এজন ছাত্ৰ, B.Tech পাছৰ কেৰিয়াৰ অপচন কি কি?" },
  { label: "💼 Roles for React & Node", text: "I know React, JavaScript, and Node.js. What roles can I apply for?" },
];

export default function WhatsAppDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init-1",
      sender: "bot",
      text: "👋 *Namaste & Nomoskar!*\n\nI am your *SkillBridge Career & Placement Navigator* on WhatsApp.\n\nYou can chat with me in *English, Hindi, or Assamese* to:\n• Generate step-by-step learning roadmaps\n• Discover top matching roles for your skills\n• Get career advice for tech & regional jobs\n• Drop a resume for an instant ATS review\n\nWhat would you like to explore today? 🚀",
      timestamp: "10:30 AM",
      status: "read",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isTyping) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: getCurrentTime(),
      status: "read",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputText("");
    setIsTyping(true);

    try {
      // Call SkillBridge Backend Simulator Endpoint
      const res = await axiosAPI.post("/whatsapp/simulate", {
        message: textToSend,
        language: selectedLanguage,
      });

      const replyText =
        res.data?.reply ||
        "I've received your query and generated career recommendations based on your profile.";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: getCurrentTime(),
        status: "read",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("WhatsApp Demo Error:", err);
      // Fallback response if offline
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "🗺️ *SkillBridge Career Roadmap: Frontend Web Development*\n\n⏱️ *Duration:* ~10 Weeks\n━━━━━━━━━━━━━━━━━━━━━\n\n📌 *Step 1: HTML5 & Modern Semantic Web*\n   Master semantic tags, accessibility, form validations.\n   🔗 Resource: MDN Web Docs\n\n📌 *Step 2: Advanced CSS & Responsive Layouts*\n   Flexbox, CSS Grid, media queries, Tailwind CSS.\n   🔗 Resource: CSS-Tricks\n\n📌 *Step 3: JavaScript ES6+ & Async Programming*\n   Promises, Async/Await, DOM manipulation, Fetch API.\n\n💡 _Reply with 'Done Step 1' to update your roadmap progress!_",
        timestamp: getCurrentTime(),
        status: "read",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const triggerDailyNudge = () => {
    const nudgeMessage: Message = {
      id: `nudge-${Date.now()}`,
      sender: "bot",
      text: "🌅 *Suprabhat Rahul! Day 4 of your Frontend Roadmap:*\n\n🎯 *Today's Goal:* Master CSS Flexbox & Alignment (Est: 45 mins)\n📖 *Quick Guide:* Learn flex-direction, justify-content, and align-items.\n\nReply:\n1️⃣ *Mark as Done ✅*\n2️⃣ *Explain this concept 💡*\n3️⃣ *Skip / Postpone ⏩*",
      timestamp: getCurrentTime(),
      status: "read",
      isNudge: true,
    };
    setMessages((prev) => [...prev, nudgeMessage]);
    toast.success("Simulated 9:00 AM WhatsApp Roadmap Nudge!");
  };

  const handleResumeSimulate = () => {
    const resumeUserMsg: Message = {
      id: `usr-pdf-${Date.now()}`,
      sender: "user",
      text: "📄 *Ayush_Resume_2026.pdf* (248 KB)",
      timestamp: getCurrentTime(),
      status: "read",
    };
    setMessages((prev) => [...prev, resumeUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const resumeReviewMsg: Message = {
        id: `bot-review-${Date.now()}`,
        sender: "bot",
        text: "📊 *SKILLBRIDGE RESUME AUDIT & ATS SCORE*\n━━━━━━━━━━━━━━━━━━━━━\n⭐ *Overall Score:* 82/100\n🎯 *Target Role Match:* Full Stack Engineer (88%)\n\n*Key Strengths:*\n• Clean layout with strong project impact metrics.\n• Clear demonstration of React, Node.js, and PostgreSQL.\n\n*Actionable Improvements:*\n• Add GitHub/Live demo links under your Capstone project.\n• Quantify backend latency reduction numbers.\n\n🎯 *Top 3 Roles You Qualify For:*\n1. Junior Full Stack Engineer (88% match)\n2. Frontend Developer - React/Next.js (92% match)\n3. API / Backend Developer (78% match)",
        timestamp: getCurrentTime(),
        status: "read",
      };
      setMessages((prev) => [...prev, resumeReviewMsg]);
      setIsTyping(false);
      toast.success("Resume processed and analyzed via SkillBridge ATS!");
    }, 1200);
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* ── Left Sidebar / Control Panel ── */}
      <div className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                WhatsApp Companion
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  Live
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">SkillBridge Multilingual Channel</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <span className="text-xs font-semibold text-slate-300">Channel Info</span>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex justify-between">
                <span>Number:</span>
                <span className="font-mono text-emerald-400">+91 91013 54778</span>
              </p>
              <p className="flex justify-between">
                <span>Languages:</span>
                <span className="font-semibold text-slate-200">Assamese, Hindi, English</span>
              </p>
              <p className="flex justify-between">
                <span>AI Engine:</span>
                <span className="text-slate-200">Gemini 3.8 + LangChain</span>
              </p>
            </div>
          </div>

          {/* Quick Demo Triggers */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Live Hackathon Triggers</span>
            <button
              onClick={triggerDailyNudge}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 text-xs font-medium transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                Simulate 9 AM Roadmap Nudge
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Test</span>
            </button>

            <button
              onClick={handleResumeSimulate}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Simulate Resume PDF Drop
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">ATS</span>
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Try Sample Prompts</span>
            <div className="grid grid-cols-1 gap-1.5">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="text-left p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Connected via Cloud Webhook</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* ── Main WhatsApp Mobile Frame ── */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40">
        <div className="w-full max-w-xl h-[86vh] flex flex-col bg-[#0b141a] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
          {/* WhatsApp Header */}
          <div className="h-14 bg-[#202c33] px-4 flex items-center justify-between shrink-0 border-b border-[#2a3942] z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  SB
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 leading-tight">
                  SkillBridge Career Guide
                  <BadgeCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                </h3>
                <span className="text-[11px] text-emerald-400 leading-none">
                  {isTyping ? "typing..." : "online • official AI assistant"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <Video className="w-4 h-4 cursor-pointer hover:text-white opacity-80" />
              <Phone className="w-4 h-4 cursor-pointer hover:text-white opacity-80" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white opacity-80" />
            </div>
          </div>

          {/* WhatsApp Chat Body */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{
              backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            <div className="text-center my-2">
              <span className="text-[10px] font-medium uppercase px-2.5 py-1 rounded-md bg-[#182229] text-slate-400 shadow-sm border border-[#222e35]">
                Today • End-to-End Encrypted
              </span>
            </div>

            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2 text-sm shadow-md relative leading-relaxed select-text ${
                    m.sender === "user"
                      ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                      : "bg-[#202c33] text-[#d1d7db] rounded-tl-none border border-[#2a3942]/60"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {m.sender === "user" && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-2.5 border border-[#2a3942]/60 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Input Footer */}
          <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-[#2a3942] shrink-0">
            <button className="text-slate-400 hover:text-white p-1.5 transition">
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={handleResumeSimulate}
              title="Attach Resume PDF"
              className="text-slate-400 hover:text-white p-1.5 transition cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message in English, Hindi, or Assamese..."
              className="flex-1 bg-[#2a3942] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500/50"
            />

            {inputText.trim() ? (
              <button
                onClick={() => handleSendMessage()}
                className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white flex items-center justify-center transition shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button className="w-10 h-10 rounded-full bg-[#2a3942] hover:bg-[#32424b] text-slate-300 flex items-center justify-center transition cursor-pointer">
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
