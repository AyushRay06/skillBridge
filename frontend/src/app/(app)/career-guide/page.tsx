"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";
import { Plus, Compass, Trash2, Clock, Sparkles, Volume2, VolumeX, PhoneCall, PanelLeft, Copy, Check, AnimateIcon } from "@/components/animate-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { speakText, stopSpeaking } from "@/lib/speechVoice";

import { CGMessage, CGConversation, CardPayload, RoadmapData } from "@/types/careerGuide";
import { ChatInput } from "@/components/careerGuide/ChatInput";
import { QuickReplies } from "@/components/careerGuide/QuickReplies";
import { VoiceCallModal } from "@/components/careerGuide/VoiceCallModal";
import { ModelSelector } from "@/components/careerGuide/ModelSelector";
import { ResumeSummaryCard } from "@/components/careerGuide/cards/ResumeSummaryCard";
import { RoleRecommendationsCard } from "@/components/careerGuide/cards/RoleRecommendationsCard";
import { SkillGapCard } from "@/components/careerGuide/cards/SkillGapCard";
import { ResumeReviewCard } from "@/components/careerGuide/cards/ResumeReviewCard";
import { RoadmapCard } from "@/components/careerGuide/cards/RoadmapCard";
import { JobMatchesCard } from "@/components/careerGuide/cards/JobMatchesCard";
import { MockInterviewCard } from "@/components/careerGuide/cards/MockInterviewCard";
import { MockInterviewEvaluationCard } from "@/components/careerGuide/cards/MockInterviewEvaluationCard";
import { PandaLogo } from "@/components/PandaLogo";
import { FormattedMessage } from "@/components/careerGuide/FormattedMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Helpers ─────────────────────────────────────────────────────

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function cleanMessageContent(content: string, cardPayload?: any): string {
  if (!content) return "";
  if (cardPayload?.type === "mock_interview") {
    const qNum = cardPayload.data?.questionNumber || 1;
    const totalQ = cardPayload.data?.totalQuestions || 5;
    const topic = cardPayload.data?.topic || "Technical";

    // Extract strictly the first 1-sentence friendly lead-in line
    const lines = content.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    for (const line of lines) {
      if (
        line.startsWith("```") ||
        line.startsWith("`") ||
        /^[A-D]\)/i.test(line) ||
        /^\([A-D]\)/i.test(line) ||
        line.toLowerCase().startsWith("hint:") ||
        line.toLowerCase().startsWith("please reply") ||
        line.toLowerCase().startsWith("choose your") ||
        line.toLowerCase().startsWith("what will be") ||
        line.toLowerCase().startsWith("what is") ||
        line.toLowerCase().startsWith("which of") ||
        line.toLowerCase().startsWith("explain ")
      ) {
        break;
      }
      if (
        line.toLowerCase().includes("question") ||
        line.includes("প্ৰশ্ন") ||
        line.includes("प्रश्न") ||
        line.endsWith(":")
      ) {
        return line;
      }
    }
    return `Here is Question ${qNum} of ${totalQ} for your ${topic} mock interview:`;
  }
  return content;
}

// ── Typing indicator ─────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ── Card renderer ────────────────────────────────────────────────
function CardRenderer({
  payload,
  parentContent,
  onAction,
}: {
  payload: CardPayload;
  parentContent?: string;
  onAction: (msg: string) => void;
}) {
  const handleSaveRoadmap = async (data: RoadmapData) => {
    try {
      const res = await axiosAPI.post("/career-guide/roadmaps", data);
      toast.success("Roadmap saved to My Roadmaps!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("skillbridge:roadmap-updated"));
      }
      return res.data?.roadmap;
    } catch {
      toast.error("Failed to save roadmap");
      return null;
    }
  };

  const handleUpdateStep = async (stepId: string, status: string, roadmapId?: string) => {
    if (!roadmapId) return;
    try {
      await axiosAPI.patch(`/career-guide/roadmaps/${roadmapId}/steps/${stepId}`, { status });
      toast.success(`Step status updated`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("skillbridge:roadmap-updated"));
      }
    } catch {
      toast.error("Failed to update step");
    }
  };

  switch (payload.type) {
    case "resume_summary":
      return <ResumeSummaryCard data={payload.data} />;
    case "role_recommendations":
      return (
        <RoleRecommendationsCard
          data={payload.data}
          onSkillGap={(role) => onAction(`Show me the skill gap for ${role}`)}
          onMakeRoadmap={(role) => onAction(`Make me a roadmap for ${role}`)}
          onFindJobs={(role) => onAction(`Find jobs for ${role}`)}
        />
      );
    case "skill_gap":
      return (
        <SkillGapCard
          data={payload.data}
          onMakeRoadmap={(role) => onAction(`Make me a roadmap for ${role}`)}
        />
      );
    case "resume_review":
      return <ResumeReviewCard data={payload.data} />;
    case "roadmap":
      return (
        <RoadmapCard
          data={payload.data}
          savedRoadmapId={payload.data?.id}
          onSave={() => handleSaveRoadmap(payload.data)}
          onUpdateStep={(stepId, status, rId) => handleUpdateStep(stepId, status, rId || payload.data?.id)}
        />
      );
    case "job_matches":
      return <JobMatchesCard data={payload.data} />;
    case "mock_interview":
      return (
        <MockInterviewCard
          data={payload.data}
          parentContent={parentContent}
          onAnswer={(answer) => onAction(answer)}
        />
      );
    case "mock_interview_evaluation":
      return (
        <MockInterviewEvaluationCard
          data={payload.data}
          onRetry={(topic) => onAction(`Start a new mock interview on ${topic}`)}
          onNewTopic={() => onAction("Mock interview")}
        />
      );
    default:
      return null;
  }
}

// ── Message bubble ───────────────────────────────────────────────
function MessageBubble({
  msg,
  onAction,
  onSpeak,
  isSpeaking,
  isStreaming,
}: {
  msg: CGMessage;
  onAction: (text: string) => void;
  onSpeak?: (text: string, id: string) => void;
  isSpeaking?: boolean;
  isStreaming?: boolean;
}) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!msg.content) return;
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex justify-end w-full"
      >
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-muted/90 text-foreground border border-border/80 px-4 py-2.5 shadow-2xs">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
          <div className="mt-1 font-mono text-[9px] text-muted-foreground/60 text-right">
            {formatTime(msg.createdAt)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-start gap-3 w-full group"
    >
      {/* Assistant avatar */}
      <div className="w-7 h-7 flex items-center justify-center shrink-0 select-none mt-0.5">
        <PandaLogo className="w-7 h-7" />
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {(msg.content || isStreaming) && (
          <div className="text-sm leading-relaxed text-foreground">
            {isStreaming && !msg.content ? (
              <TypingIndicator />
            ) : (
              <div>
                <FormattedMessage content={cleanMessageContent(msg.content, msg.cardPayload)} />
                {isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-violet-500 animate-pulse align-middle" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Payload */}
        {msg.cardPayload && (
          <div className="pt-2 w-full">
            <CardRenderer payload={msg.cardPayload} parentContent={msg.content} onAction={onAction} />
          </div>
        )}

        {/* Action toolbar (Copy, Read aloud, Timestamp) */}
        {!isStreaming && msg.content && (
          <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted-foreground/70">
            <span>{formatTime(msg.createdAt)}</span>
            <span className="text-muted-foreground/30">•</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer p-1 rounded-xs hover:bg-muted"
              title="Copy response"
            >
              {copied ? <Check size={11} className="w-3 h-3 text-emerald-500" /> : <Copy size={11} className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            {onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(msg.content, msg.id)}
                className={`inline-flex items-center gap-1 transition-colors cursor-pointer p-1 rounded-xs hover:bg-muted ${
                  isSpeaking ? "text-destructive font-semibold" : "hover:text-foreground"
                }`}
                title={isSpeaking ? "Stop speaking" : "Read aloud"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={11} className="w-3 h-3 text-destructive" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={11} className="w-3 h-3" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function CareerGuidePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<CGMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<CGConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [convLoading, setConvLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadDoneRef = useRef(false);
  const lastLoadedRoadmapRef = useRef<string | null>(null);

  // Synchronize active conversation ID with state, URL query (?c=), and localStorage
  const updateActiveConversationId = useCallback((id: string | null) => {
    setConversationId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      // Clean up roadmap parameter so it doesn't persist or re-trigger roadmap previews
      url.searchParams.delete("roadmap");
      url.searchParams.delete("voiceCall");
      if (id) {
        localStorage.setItem("skillbridge_active_cg_conv", id);
        url.searchParams.set("c", id);
      } else {
        localStorage.removeItem("skillbridge_active_cg_conv");
        url.searchParams.delete("c");
        url.searchParams.delete("conversationId");
      }
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // Stop any active speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = (text: string, id: string) => {
    if (speakingMsgId === id) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }
    setSpeakingMsgId(id);
    speakText(
      text,
      language,
      () => setSpeakingMsgId(null),
      () => setSpeakingMsgId(null)
    );
  };

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Load conversations list
  useEffect(() => {
    if (!isAuthenticated) return;
    loadConversations();
  }, [isAuthenticated]);

  // Restore active conversation on initial load or refresh
  useEffect(() => {
    if (!isAuthenticated) return;
    if (initialLoadDoneRef.current) return;

    const roadmapId = searchParams.get("roadmap");
    if (roadmapId) {
      initialLoadDoneRef.current = true;
      return; // roadmap synthetic preview takes precedence
    }

    const urlConvId = searchParams.get("c") || searchParams.get("conversationId");
    const storedConvId = typeof window !== "undefined" ? localStorage.getItem("skillbridge_active_cg_conv") : null;
    const targetId = urlConvId || storedConvId;

    if (targetId) {
      initialLoadDoneRef.current = true;
      loadConversation(targetId);
    }
  }, [isAuthenticated, searchParams]);

  // Handle ?roadmap= query param (safeguarded against loops and stuck queries)
  useEffect(() => {
    const roadmapId = searchParams.get("roadmap");
    if (!roadmapId || !isAuthenticated) {
      lastLoadedRoadmapRef.current = null;
      return;
    }

    // Only load if not already loaded for this specific roadmapId
    if (lastLoadedRoadmapRef.current === roadmapId) {
      return;
    }

    lastLoadedRoadmapRef.current = roadmapId;
    loadRoadmap(roadmapId);
  }, [searchParams, isAuthenticated]);

  // Handle ?voiceCall=true query param
  useEffect(() => {
    if (searchParams.get("voiceCall") === "true" && isAuthenticated) {
      setIsVoiceCallOpen(true);
    }
  }, [searchParams, isAuthenticated]);

  // Handle ?prompt= query param
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && isAuthenticated && messages.length === 0 && !loading) {
      sendMessage(prompt);
    }
  }, [searchParams, isAuthenticated, messages.length, loading]);

  const loadConversations = async () => {
    try {
      const res = await axiosAPI.get("/career-guide/conversations");
      setConversations(res.data.conversations ?? res.data ?? []);
    } catch {
      // silently fail
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setConvLoading(true);
      lastLoadedRoadmapRef.current = null;

      // Clean roadmap query param from URL so it doesn't hijack the conversation
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("roadmap");
        url.searchParams.delete("voiceCall");
        window.history.replaceState(null, "", url.toString());
      }

      const res = await axiosAPI.get(`/career-guide/conversations/${id}`);
      const conv = res.data.conversation ?? res.data;
      updateActiveConversationId(id);
      setMessages(conv.messages ?? []);
      setLanguage(conv.language ?? "auto");
    } catch (err: any) {
      if (err.response?.status === 404) {
        updateActiveConversationId(null);
      } else {
        toast.error("Failed to load conversation");
      }
    } finally {
      setConvLoading(false);
    }
  };

  const loadRoadmap = async (id: string) => {
    try {
      setConvLoading(true);
      const res = await axiosAPI.get(`/career-guide/roadmaps/${id}`);
      const rm = res.data.roadmap ?? res.data;
      if (!rm) return;
      const syntheticMsg: CGMessage = {
        id: `roadmap-${id}`,
        role: "assistant",
        content: `Here's your saved roadmap: **${rm.title}**`,
        cardPayload: { type: "roadmap", data: rm },
        createdAt: rm.createdAt || new Date().toISOString(),
      };
      setConversationId(null);
      setMessages([syntheticMsg]);
    } catch {
      // silently fail
    } finally {
      setConvLoading(false);
    }
  };

  const startNewChat = () => {
    lastLoadedRoadmapRef.current = null;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("roadmap");
      url.searchParams.delete("voiceCall");
      url.searchParams.delete("c");
      url.searchParams.delete("conversationId");
      window.history.replaceState(null, "", url.pathname);
    }
    updateActiveConversationId(null);
    setMessages([]);
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axiosAPI.delete(`/career-guide/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        startNewChat();
      } else {
        if (typeof window !== "undefined" && localStorage.getItem("skillbridge_active_cg_conv") === id) {
          localStorage.removeItem("skillbridge_active_cg_conv");
        }
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    lastLoadedRoadmapRef.current = null;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("roadmap")) {
        url.searchParams.delete("roadmap");
        window.history.replaceState(null, "", url.toString());
      }
    }

    const userMsg: CGMessage = {
      id: `tmp-user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const assistantTempId = `stream-ai-${Date.now()}`;
    const initialAssistantMsg: CGMessage = {
      id: assistantTempId,
      role: "assistant",
      content: "",
      cardPayload: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setLoading(true);
    setStreamingMsgId(assistantTempId);

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const cleanBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${cleanBase}/career-guide/chat/stream`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          conversationId,
          message: text,
          language,
        }),
      });

      if (!response.ok) {
        let errMessage = "Something went wrong. Please try again.";
        try {
          const errData = await response.json();
          if (errData?.msg) errMessage = errData.msg;
        } catch {}
        throw new Error(errMessage);
      }

      if (!response.body) {
        throw new Error("No streaming body received from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let finalReplyText = "";
      let finalCardPayload: CardPayload | null = null;
      let finalMessageId = assistantTempId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const lines = block.split("\n");
          let eventType = "message";
          let dataStr = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            if (eventType === "init" && data.conversationId) {
              updateActiveConversationId(data.conversationId);
              loadConversations();
            } else if (eventType === "chunk" && data.text) {
              finalReplyText += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantTempId ? { ...m, content: m.content + data.text } : m
                )
              );
            } else if (eventType === "card" && data.cardPayload) {
              finalCardPayload = data.cardPayload;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantTempId ? { ...m, cardPayload: data.cardPayload } : m
                )
              );
            } else if (eventType === "done") {
              if (data.messageId) finalMessageId = data.messageId;
              if (data.reply) finalReplyText = data.reply;
              if (data.cardPayload) finalCardPayload = data.cardPayload;
              if (data.conversationId) {
                updateActiveConversationId(data.conversationId);
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantTempId
                    ? {
                        ...m,
                        id: finalMessageId,
                        content: finalReplyText || m.content,
                        cardPayload: finalCardPayload || m.cardPayload,
                      }
                    : m
                )
              );

              // If voice mode is on and not inside a voice call, speak response once stream ends
              if (voiceMode && finalReplyText && !isVoiceCallOpen) {
                handleSpeak(finalReplyText, finalMessageId);
              }
            } else if (eventType === "error") {
              toast.error(data.msg || "Stream error");
            }
          } catch (jsonErr) {
            console.warn("Failed to parse SSE data:", dataStr, jsonErr);
          }
        }
      }
    } catch (err: any) {
      const errMsg = err.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
      // Remove placeholder message only if no content arrived
      setMessages((prev) =>
        prev.filter((m) => m.id !== assistantTempId || m.content.length > 0)
      );
    } finally {
      setLoading(false);
      setStreamingMsgId(null);
    }
  };

  const uploadResume = async (file: File) => {
    if (isUploading) return;
    setIsUploading(true);
    const toastId = toast.loading("Uploading resume…");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axiosAPI.post("/career-guide/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      toast.success("Resume uploaded!", { id: toastId });

      const assistantMsg: CGMessage = {
        id: `tmp-upload-${Date.now()}`,
        role: "assistant",
        content: data.message ?? "I've analysed your resume. Here's what I found:",
        cardPayload: data.cardPayload ?? (data.resumeSummary ? { type: "resume_summary", data: data.resumeSummary } : null),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (voiceMode && assistantMsg.content && !isVoiceCallOpen) {
        handleSpeak(assistantMsg.content, assistantMsg.id);
      }

      if (data.conversationId) {
        updateActiveConversationId(data.conversationId);
        loadConversations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="flex flex-1 h-full min-h-0 w-full overflow-hidden">
      {/* ── Sidebar: Conversation History ─── */}
      <aside
        className={`${
          showHistorySidebar ? "hidden md:flex" : "hidden"
        } flex-col w-72 sm:w-80 border-r border-border bg-sidebar shrink-0 h-full transition-all duration-200 select-none`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar/50">
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
            Previous Chats
          </span>
          <AnimateIcon animateOnHover asChild>
            <button
              onClick={startNewChat}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40 hover:border-border transition-colors rounded-none flex items-center gap-1.5 font-mono text-[11px] cursor-pointer"
              title="New Chat"
            >
              <Plus size={14} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </AnimateIcon>
        </div>

        <div className="flex-1 overflow-y-auto py-2 divide-y divide-border/30">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground font-mono">No previous chats yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                role="button"
                tabIndex={0}
                onClick={() => loadConversation(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    loadConversation(conv.id);
                  }
                }}
                className={`w-full text-left flex items-center justify-between gap-2.5 px-4 py-3 transition-colors group cursor-pointer border-l-2 ${
                  conversationId === conv.id 
                    ? "bg-muted/80 text-foreground font-semibold border-foreground" 
                    : "border-transparent hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs sm:text-[13px] leading-snug">{conv.title ?? "Untitled Conversation"}</div>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-muted-foreground">
                    <Clock size={11} className="w-3 h-3 text-muted-foreground/70" />
                    <span>{formatDate(conv.updatedAt)}</span>
                  </div>
                </div>
                <AnimateIcon animateOnHover asChild>
                  <button
                    type="button"
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-none cursor-pointer"
                    title="Delete Conversation"
                  >
                    <Trash2 size={14} className="w-3.5 h-3.5" />
                  </button>
                </AnimateIcon>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Main chat area ─── */}
      <div className="flex flex-col flex-1 min-w-0 h-full min-h-0 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/60 backdrop-blur-xs shrink-0 h-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistorySidebar((prev) => !prev)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40 hover:border-border transition-colors rounded-none hidden md:flex items-center justify-center cursor-pointer"
              title={showHistorySidebar ? "Hide previous chats" : "Show previous chats"}
              aria-label="Toggle previous chats"
            >
              <PanelLeft size={14} animateOnHover className="w-3.5 h-3.5" />
            </button>
            <ModelSelector />
          </div>
          <div className="flex items-center gap-2">
            {/* Interactive Voice Call Button */}
            <AnimateIcon animateOnHover asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopSpeaking();
                  setIsVoiceCallOpen(true);
                }}
                className="h-8 font-mono text-xs uppercase tracking-wider gap-1.5 cursor-pointer"
                title="Start interactive voice conversation"
              >
                <PhoneCall size={13} className="w-3.5 h-3.5 text-foreground" />
                <span>Voice Call</span>
              </Button>
            </AnimateIcon>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        >
          <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 pt-4 pb-8 space-y-5">
            {convLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/2 ml-auto" />
              </div>
            ) : isEmpty ? (
              /* Empty / welcome state */
              <div className="flex flex-col items-center justify-center min-h-[380px] py-6 text-center space-y-6">
                <div className="space-y-2 max-w-lg mx-auto">
                  <div className="flex items-center justify-center mx-auto select-none py-1">
                    <PandaLogo className="w-14 h-14 sm:w-16 sm:h-16" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
                    How can I help your career today?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Personalized AI career mentor — ask anything about tailoring resumes, recommended career paths, skill roadmaps, or interview practice.
                  </p>
                </div>
                <QuickReplies language={language} onSelect={sendMessage} variant="grid" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    onAction={sendMessage} 
                    onSpeak={handleSpeak}
                    isSpeaking={speakingMsgId === msg.id}
                    isStreaming={streamingMsgId === msg.id}
                  />
                ))}
                {loading && !streamingMsgId && (
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 select-none mt-0.5">
                      <PandaLogo className="w-7 h-7" />
                    </div>
                    <div className="p-2.5 bg-muted/40 rounded-xl">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input bar */}
        <div className="px-3 sm:px-4 pb-3 pt-1 shrink-0 z-10 bg-transparent">
          <div className="max-w-6xl mx-auto w-full">
            <ChatInput
              onSend={sendMessage}
              onUpload={uploadResume}
              language={language}
              onLanguageChange={setLanguage}
              disabled={loading || isUploading}
            />
            <p className="mt-1 text-center font-mono text-[9px] text-muted-foreground/50">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Two-Way Voice Call Modal */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        conversationId={conversationId}
        onConversationCreated={(newId) => {
          updateActiveConversationId(newId);
          loadConversations();
        }}
        language={language}
        onLanguageChange={setLanguage}
        onNewMessage={(msg) => {
          setMessages((prev) => [...prev, msg]);
        }}
      />
    </div>
  );
}
