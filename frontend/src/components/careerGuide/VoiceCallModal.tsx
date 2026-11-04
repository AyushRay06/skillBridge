"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  PhoneOff, Mic, MicOff, Volume2, Sparkles, Send, Radio
} from "@/components/animate-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { axiosAPI } from "@/lib/axiosInterface";
import { getSpeechRecognition, speakText, stopSpeaking } from "@/lib/speechVoice";
import { CGMessage } from "@/types/careerGuide";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import toast from "react-hot-toast";

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
  onConversationCreated?: (newId: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onNewMessage: (msg: CGMessage) => void;
}

type CallState = "connecting" | "listening" | "thinking" | "speaking" | "muted";

export function VoiceCallModal({
  isOpen,
  onClose,
  conversationId,
  onConversationCreated,
  language,
  onLanguageChange,
  onNewMessage,
}: VoiceCallModalProps) {
  const [callState, setCallState] = useState<CallState>("connecting");
  const [transcript, setTranscript] = useState("");
  const [lastAgentReply, setLastAgentReply] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [activeLang, setActiveLang] = useState(language === "hi" ? "hi" : "en");

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCallActiveRef = useRef(false);
  const accumulatedSpeechRef = useRef("");
  const stateRef = useRef<CallState>("connecting");

  // Keep stateRef in sync for callbacks
  useEffect(() => {
    stateRef.current = callState;
  }, [callState]);

  // Sync internal activeLang with parent language
  useEffect(() => {
    if (language === "hi" || language === "en") {
      setActiveLang(language);
    }
  }, [language]);

  // Clean shutdown of speech and mic
  const cleanupCall = useCallback(() => {
    isCallActiveRef.current = false;
    stopSpeaking();
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  }, []);

  // Send collected user speech to AI
  const sendVoiceQuery = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || !isCallActiveRef.current) return;

    // 1. Immediately kill microphone to avoid hearing own echo
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setCallState("thinking");
    setTranscript("");
    accumulatedSpeechRef.current = "";

    // 2. Add user message to conversation
    const userMsg: CGMessage = {
      id: `call-user-${Date.now()}`,
      role: "user",
      content: cleanText,
      createdAt: new Date().toISOString(),
    };
    onNewMessage(userMsg);

    try {
      const res = await axiosAPI.post("/career-guide/chat", {
        conversationId,
        message: cleanText,
        language: activeLang,
      });

      const data = res.data;
      if (data.conversationId && onConversationCreated && data.conversationId !== conversationId) {
        onConversationCreated(data.conversationId);
      }

      const replyText = data.reply ?? data.message ?? "";

      const assistantMsg: CGMessage = {
        id: data.messageId ?? `call-ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        cardPayload: data.cardPayload ?? null,
        createdAt: new Date().toISOString(),
      };
      onNewMessage(assistantMsg);

      if (!isCallActiveRef.current) return;

      setLastAgentReply(replyText);
      setCallState("speaking");

      // 3. Speak AI response (with isVoiceCall = true for crisp conversational length)
      speakText(
        replyText,
        activeLang,
        () => {
          // When AI finishes speaking, wait 350ms to clear speaker reverb, then start listening
          if (isCallActiveRef.current && !isMuted) {
            setTimeout(() => {
              if (isCallActiveRef.current) {
                startListeningLoop();
              }
            }, 350);
          }
        },
        () => {
          if (isCallActiveRef.current && !isMuted) {
            setTimeout(() => {
              if (isCallActiveRef.current) {
                startListeningLoop();
              }
            }, 350);
          }
        },
        true
      );
    } catch (err: any) {
      console.error("Voice chat error:", err);
      if (!isCallActiveRef.current) return;
      toast.error("Could not process voice message");
      setTimeout(() => {
        if (isCallActiveRef.current) {
          startListeningLoop();
        }
      }, 500);
    }
  }, [conversationId, activeLang, onConversationCreated, onNewMessage, isMuted]);

  // Start fresh listening loop
  const startListeningLoop = useCallback(() => {
    if (!isCallActiveRef.current || isMuted) return;

    // Safety: ensure no speech synthesis is still talking
    stopSpeaking();

    const SpeechRec = getSpeechRecognition();
    if (!SpeechRec) {
      toast.error("Speech Recognition is not supported in this browser. Use Chrome, Edge, or Safari.");
      setCallState("connecting");
      return;
    }

    // Stop and dereference any previous instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    accumulatedSpeechRef.current = "";
    setTranscript("");
    setCallState("listening");

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = activeLang === "hi" ? "hi-IN" : "en-US";

      rec.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript + " ";
          } else {
            interim += item[0].transcript;
          }
        }

        const combined = (final + interim).trim();
        if (combined) {
          setTranscript(combined);
          accumulatedSpeechRef.current = combined;

          // Clear previous timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Auto-send after 1.4 seconds of silence
          silenceTimerRef.current = setTimeout(() => {
            const queryToSend = accumulatedSpeechRef.current.trim();
            if (queryToSend && isCallActiveRef.current && stateRef.current === "listening") {
              sendVoiceQuery(queryToSend);
            }
          }, 1400);
        }
      };

      rec.onerror = (e: any) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          toast.error("Microphone permission denied.");
          setIsMuted(true);
          setCallState("muted");
        }
      };

      rec.onend = () => {
        // If we were listening and it ended prematurely (browser timeout), create a clean fresh instance
        if (isCallActiveRef.current && stateRef.current === "listening" && !isMuted) {
          setTimeout(() => {
            if (isCallActiveRef.current && stateRef.current === "listening" && !isMuted) {
              startListeningLoop();
            }
          }, 200);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
    }
  }, [activeLang, isMuted, sendVoiceQuery]);

  // Interrupt AI and take turn
  const handleInterruptOrSend = () => {
    if (callState === "speaking") {
      stopSpeaking();
      startListeningLoop();
    } else if (callState === "listening" && transcript.trim()) {
      sendVoiceQuery(transcript.trim());
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListeningLoop();
    } else {
      setIsMuted(true);
      setCallState("muted");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    }
  };

  // Switch Language during call
  const handleSwitchLanguage = (lang: string) => {
    setActiveLang(lang);
    onLanguageChange(lang);
    toast.success(`Voice set to ${lang === "hi" ? "Hindi (हिंदी)" : "English"}`);
    if (callState === "listening") {
      setTimeout(() => startListeningLoop(), 150);
    }
  };

  // Lifecycle on modal open
  useEffect(() => {
    if (isOpen) {
      isCallActiveRef.current = true;
      setIsMuted(false);
      setCallState("connecting");

      const greeting =
        activeLang === "hi"
          ? "नमस्ते! मैं आपका करियर गाइड हूँ। आप क्या चर्चा करना चाहते हैं?"
          : "Hello! I am your Career Guide. What would you like to discuss today?";

      setLastAgentReply(greeting);

      const timer = setTimeout(() => {
        if (!isCallActiveRef.current) return;
        setCallState("speaking");
        speakText(
          greeting,
          activeLang,
          () => {
            if (isCallActiveRef.current) {
              setTimeout(() => {
                if (isCallActiveRef.current) startListeningLoop();
              }, 300);
            }
          },
          () => {
            if (isCallActiveRef.current) {
              setTimeout(() => {
                if (isCallActiveRef.current) startListeningLoop();
              }, 300);
            }
          },
          true
        );
      }, 400);

      return () => {
        clearTimeout(timer);
        cleanupCall();
      };
    } else {
      cleanupCall();
    }
  }, [isOpen, activeLang, cleanupCall, startListeningLoop]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-lg bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                callState === "listening" ? "bg-emerald-400" : callState === "speaking" ? "bg-primary" : "bg-muted-foreground"
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                callState === "listening" ? "bg-emerald-500" : callState === "speaking" ? "bg-primary" : "bg-muted-foreground"
              }`} />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Voice Session
            </span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 font-mono uppercase">
              {callState}
            </Badge>
          </div>

          {/* Language Switch */}
          <div className="flex items-center border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => handleSwitchLanguage("en")}
              className={`px-2 py-0.5 font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                activeLang === "en" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage("hi")}
              className={`px-2 py-0.5 font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                activeLang === "hi" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Main Stage */}
        <div className="p-8 flex flex-col items-center justify-center space-y-6 min-h-[300px] bg-card relative select-none">
          
          {/* Minimalist Soundwave Frequency Bars */}
          <div 
            onClick={handleInterruptOrSend}
            className="flex items-center justify-center gap-1.5 h-24 px-8 py-4 rounded-none border border-border bg-background/60 hover:bg-muted/30 transition-all cursor-pointer group"
            title={
              callState === "speaking" 
                ? "Click to interrupt AI and talk" 
                : callState === "listening" && transcript 
                ? "Click to send now" 
                : "Voice Activity"
            }
          >
            {[
              { base: 14, activeH: [14, 38, 20, 48, 14], delay: 0 },
              { base: 22, activeH: [22, 54, 28, 62, 22], delay: 0.1 },
              { base: 36, activeH: [36, 72, 42, 80, 36], delay: 0.2 },
              { base: 24, activeH: [24, 60, 32, 68, 24], delay: 0.15 },
              { base: 16, activeH: [16, 44, 22, 50, 16], delay: 0.25 },
            ].map((bar, i) => (
              <motion.div
                key={i}
                animate={
                  callState === "speaking"
                    ? { height: bar.activeH }
                    : callState === "listening"
                    ? { height: [bar.base, bar.base + 18, bar.base] }
                    : callState === "thinking"
                    ? { height: [12, 28, 12] }
                    : { height: 10 }
                }
                transition={{
                  duration: callState === "speaking" ? 1.1 : callState === "listening" ? 1.4 : 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bar.delay,
                }}
                className={`w-2 transition-colors rounded-none ${
                  callState === "speaking"
                    ? "bg-foreground"
                    : callState === "listening"
                    ? "bg-emerald-500"
                    : callState === "thinking"
                    ? "bg-amber-500"
                    : "bg-muted-foreground/40"
                }`}
                style={{ height: `${bar.base}px` }}
              />
            ))}
          </div>

          {/* Status Label */}
          <div className="text-center space-y-1">
            <div className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
              {callState === "listening" && "Listening... (Speak naturally)"}
              {callState === "speaking" && "Career Guide is answering..."}
              {callState === "thinking" && "Processing your query..."}
              {callState === "muted" && "Microphone Muted"}
              {callState === "connecting" && "Initializing voice..."}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {callState === "speaking"
                ? "Tap Interrupt to take the floor"
                : callState === "listening"
                ? "Pause when done or click send"
                : "Full-duplex conversation"}
            </p>
          </div>

          {/* Transcript / Subtitles Box */}
          <div className="w-full max-w-md p-3.5 bg-muted/40 border border-border min-h-[72px] max-h-[110px] overflow-y-auto font-mono text-xs leading-relaxed text-center shadow-xs">
            {callState === "listening" && transcript && (
              <p className="text-foreground">
                <span className="text-emerald-500 font-semibold mr-1.5 font-mono">You:</span>
                "{transcript}"
              </p>
            )}
            {callState === "speaking" && lastAgentReply && (
              <p className="text-foreground line-clamp-3">
                <span className="text-primary font-semibold mr-1.5 font-mono">AI:</span>
                "{lastAgentReply}"
              </p>
            )}
            {callState === "thinking" && (
              <p className="text-muted-foreground font-mono">
                Formulating recommendation...
              </p>
            )}
            {!transcript && callState === "listening" && (
              <p className="text-muted-foreground/60 italic font-mono">
                Speak now in {activeLang === "hi" ? "Hindi (हिंदी)" : "English"}...
              </p>
            )}
          </div>

          {/* Contextual Action Button */}
          {callState === "speaking" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleInterruptOrSend}
              className="font-mono text-xs uppercase tracking-wider gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" />
              Tap to Interrupt & Speak
            </Button>
          )}

          {callState === "listening" && transcript.trim() && (
            <Button
              variant="default"
              size="sm"
              onClick={handleInterruptOrSend}
              className="font-mono text-xs uppercase tracking-wider gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Speech Now
            </Button>
          )}
        </div>

        {/* Footer Call Controls */}
        <div className="px-6 py-3.5 border-t border-border bg-card flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="font-mono text-xs uppercase tracking-wider gap-2"
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5 text-amber-500" /> : <Mic className="w-3.5 h-3.5 text-emerald-500" />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              cleanupCall();
              onClose();
            }}
            className="font-mono text-xs uppercase tracking-wider gap-2"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End Call
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
