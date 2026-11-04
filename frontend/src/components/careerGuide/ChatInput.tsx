"use client";

import { useRef, useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import {
  Send,
  Paperclip,
  Globe,
  Mic,
  MicOff,
  FileSearch,
  Compass,
  Milestone,
  MessageSquareQuote,
  Briefcase,
  Sparkles,
  AnimateIcon,
  Check,
} from "@/components/animate-ui/icons";
import { Languages } from "lucide-react";
import { getSpeechRecognition } from "@/lib/speechVoice";
import {
  transliterateAssameseWord,
  transliterateAssameseSentence,
} from "@/lib/assameseTransliteration";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface ChatInputProps {
  onSend: (msg: string) => void;
  onUpload: (file: File) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  disabled: boolean;
}

const LANGUAGES = [
  { value: "auto", label: "Auto", icon: "🌐" },
  { value: "en", label: "English", icon: "🇬🇧" },
  { value: "hi", label: "हिंदी", icon: "🇮🇳" },
  { value: "as", label: "অসমীয়া", icon: "🇮🇳" },
];

export function ChatInput({
  onSend,
  onUpload,
  language,
  onLanguageChange,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [phoneticEnabled, setPhoneticEnabled] = useState(true);
  const [hasLatinText, setHasLatinText] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isAssamese = language === "as";

  // Auto-resize textarea
  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    setHasLatinText(/[a-zA-Z]{2,}/.test(el.value));
  };

  useEffect(() => {
    resize();
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    resize();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Phonetic transliteration on Space or Enter when Assamese is active or phonetic mode is enabled
    if (isAssamese && phoneticEnabled && (e.key === " " || e.key === "Enter")) {
      const el = textareaRef.current;
      if (el) {
        const cursorPos = el.selectionStart;
        const textBeforeCursor = el.value.slice(0, cursorPos);
        const match = textBeforeCursor.match(/([a-zA-Z0-9_-]+)$/);
        if (match) {
          const lastWord = match[1];
          const transliterated = transliterateAssameseWord(lastWord);
          if (transliterated !== lastWord) {
            e.preventDefault();
            const startOfWord = cursorPos - lastWord.length;
            const newText =
              el.value.slice(0, startOfWord) +
              transliterated +
              (e.key === " " ? " " : "") +
              el.value.slice(cursorPos);
            el.value = newText;
            const newCursor = startOfWord + transliterated.length + (e.key === " " ? 1 : 0);
            el.selectionStart = newCursor;
            el.selectionEnd = newCursor;
            resize();
            if (e.key === "Enter" && !e.shiftKey) {
              submit();
            }
            return;
          }
        }
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleConvertAllToAssamese = () => {
    const el = textareaRef.current;
    if (!el || !el.value.trim()) return;
    const converted = transliterateAssameseSentence(el.value);
    el.value = converted;
    resize();
    toast.success("অসমীয়ালৈ ৰূপান্তৰ কৰা হ’ল!");
  };

  const submit = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    const el = textareaRef.current;
    if (!el) return;
    const msg = el.value.trim();
    if (!msg || disabled) return;
    el.value = "";
    el.style.height = "auto";
    setHasLatinText(false);
    onSend(msg);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }
    onUpload(file);
    e.target.value = "";
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    const SpeechRec = getSpeechRecognition();
    if (!SpeechRec) {
      alert(
        "Speech Recognition is not supported by your browser. Please use Chrome, Edge, or Safari for free voice input."
      );
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === "hi" ? "hi-IN" : language === "as" ? "as-IN" : "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (textareaRef.current) {
          textareaRef.current.value = transcript;
          resize();
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start voice listening:", err);
      setIsListening(false);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.value === language) ?? LANGUAGES[0];

  return (
    <div className="border border-border/80 bg-card/95 backdrop-blur-md rounded-none shadow-sm hover:shadow-md focus-within:border-foreground/40 transition-all">
      {/* Assamese Typing Guidance Banner */}
      {isAssamese && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border/60 text-[11px] font-sans">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <span className="font-semibold text-foreground">অসমীয়া ইনপুট:</span>
            <span className="hidden sm:inline">ইংৰাজীত লিখক (Space চাপিলে অসমীয়া লিপি হ’ব) বা পোনপটীয়াকৈ লিখক</span>
            <span className="sm:hidden">ইংৰাজী লিখিলে অসমীয়া লিপি হ’ব</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasLatinText && (
              <button
                type="button"
                onClick={handleConvertAllToAssamese}
                className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
                title="Convert English typed words to Assamese script"
              >
                <Languages className="w-3 h-3" />
                <span>ৰূপান্তৰ কৰক</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPhoneticEnabled((prev) => !prev)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-mono border transition-colors cursor-pointer flex items-center gap-1",
                phoneticEnabled
                  ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
              title="Toggle automatic Spacebar transliteration"
            >
              {phoneticEnabled && <Check className="w-2.5 h-2.5" />}
              <span>ফনেটিক: {phoneticEnabled ? "সক্ৰিয়" : "বন্ধ"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={
          isListening
            ? isAssamese
              ? "কথা শুনি থকা হৈছে... (বন্ধ কৰিবলৈ পুনৰ Voice ত ক্লিক কৰক)"
              : "Listening to your voice... (Click Voice again to stop)"
            : isAssamese
            ? "আপোনাৰ প্ৰশ্ন লিখক (যেনে: namaskar moi developer hoboloi bisaru)..."
            : language === "hi"
            ? "अपना संदेश लिखें या बोलें..."
            : "Type a message or use voice input..."
        }
        className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50 leading-relaxed"
        style={{ minHeight: "44px", maxHeight: "160px" }}
      />

      {/* Bottom toolbar */}
      <div className="flex items-center gap-1.5 px-3 pb-2.5">
        {/* File upload */}
        <AnimateIcon animateOnHover asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="Upload resume (PDF or TXT, max 5MB)"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Paperclip size={16} className="w-4 h-4" />
          </Button>
        </AnimateIcon>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Voice agent mic button */}
        <AnimateIcon animateOnHover asChild>
          <Button
            type="button"
            size="sm"
            onClick={toggleVoiceListening}
            disabled={disabled}
            title={
              isListening
                ? "Listening — Click to stop voice input"
                : isAssamese
                ? "অসমীয়াত কথা পাতক (Speech Recognition)"
                : "Click to speak with Voice Agent (English / Hindi / Assamese)"
            }
            variant={isListening ? "default" : "outline"}
            className={cn(
              "h-8 gap-1.5 font-mono text-[11px] transition-all cursor-pointer",
              isListening
                ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-sm animate-pulse"
                : "text-muted-foreground hover:text-foreground border-border"
            )}
          >
            {isListening ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <MicOff size={14} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">
                  {isAssamese ? "শুনি থকা হৈছে..." : "Listening..."}
                </span>
              </>
            ) : (
              <>
                <Mic size={14} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAssamese ? "কওক (Voice)" : "Voice"}</span>
              </>
            )}
          </Button>
        </AnimateIcon>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              title="Select language"
            >
              <Globe size={14} className="w-3.5 h-3.5" animateOnHover />
              <span className="hidden sm:inline">{currentLang.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="rounded-none border border-border bg-popover p-1 w-36 shadow-md"
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => onLanguageChange(lang.value)}
                className={`flex items-center gap-2 rounded-none text-xs font-mono cursor-pointer py-1.5 ${
                  language === lang.value ? "bg-muted font-semibold text-foreground" : ""
                }`}
              >
                <span>{lang.icon}</span>
                <span>{lang.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick prompt shortcuts directly in the toolbar (Language-aware) */}
        <div className="hidden md:flex items-center gap-1.5 ml-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onSend(
                isAssamese
                  ? "মোৰ ৰিজ্যুমে পৰীক্ষা কৰক"
                  : language === "hi"
                  ? "मेरा रेज़्यूमे चेक करें"
                  : "Review my resume"
              )
            }
            disabled={disabled}
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-none border border-border/40 hover:border-border transition-colors gap-1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <FileSearch size={13} className="w-3 h-3 text-emerald-500" />
            <span>
              {isAssamese
                ? "ৰিজ্যুমে পৰীক্ষা"
                : language === "hi"
                ? "रेज़्यूमे समीक्षा"
                : "Review my resume"}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onSend(
                isAssamese
                  ? "মোৰ বাবে কোনটো পদ উপযুক্ত?"
                  : language === "hi"
                  ? "मेरे लिए कौन सा रोल सही है?"
                  : "What role suits me"
              )
            }
            disabled={disabled}
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-none border border-border/40 hover:border-border transition-colors gap-1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Compass size={13} className="w-3 h-3 text-violet-500" />
            <span>
              {isAssamese
                ? "উপযুক্ত পদ"
                : language === "hi"
                ? "उपयुक्त रोल"
                : "What role suits me"}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onSend(
                isAssamese
                  ? "এটা ৰোডমেপ বনাওক"
                  : language === "hi"
                  ? "एक रोडमैप बनाएं"
                  : "Make me a roadmap"
              )
            }
            disabled={disabled}
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-none border border-border/40 hover:border-border transition-colors gap-1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Milestone size={13} className="w-3 h-3 text-amber-500" />
            <span>
              {isAssamese
                ? "ৰোডমেপ বনাওক"
                : language === "hi"
                ? "रोडमैप बनाएं"
                : "Make me a roadmap"}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onSend(
                isAssamese
                  ? "চাকৰি সন্ধান কৰক"
                  : language === "hi"
                  ? "नौकरी खोजें"
                  : "Find me a job"
              )
            }
            disabled={disabled}
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-none border border-border/40 hover:border-border transition-colors gap-1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Briefcase size={13} className="w-3 h-3 text-teal-500" />
            <span>
              {isAssamese
                ? "চাকৰি সন্ধান"
                : language === "hi"
                ? "नौकरी खोजें"
                : "Find me a job"}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onSend(
                isAssamese
                  ? "মক সাক্ষাৎকাৰ"
                  : language === "hi"
                  ? "मॉक इंटरव्यू"
                  : "Mock interview"
              )
            }
            disabled={disabled}
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-none border border-border/40 hover:border-border transition-colors gap-1 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <MessageSquareQuote size={13} className="w-3 h-3 text-sky-500" />
            <span>
              {isAssamese
                ? "মক সাক্ষাৎকাৰ"
                : language === "hi"
                ? "मॉक इंटरव्यू"
                : "Mock interview"}
            </span>
          </Button>
        </div>

        {/* Mobile dropdown for quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="md:hidden h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground gap-1 border border-border/50 ml-1 cursor-pointer"
              title="Quick actions"
            >
              <Sparkles size={13} className="w-3 h-3 text-violet-500" />
              <span>{isAssamese ? "কাৰ্য্য" : "Prompts"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="rounded-none border border-border bg-popover p-1 w-52 shadow-lg"
          >
            <DropdownMenuItem
              onClick={() =>
                onSend(
                  isAssamese
                    ? "মোৰ ৰিজ্যুমে পৰীক্ষা কৰক"
                    : language === "hi"
                    ? "मेरा रेज़्यूमे चेक करें"
                    : "Review my resume"
                )
              }
              className="text-xs font-mono py-1.5 cursor-pointer flex items-center gap-2"
            >
              <FileSearch size={13} className="w-3 h-3 text-emerald-500" />
              {isAssamese ? "ৰিজ্যুমে পৰীক্ষা" : "Review my resume"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSend(
                  isAssamese
                    ? "মোৰ বাবে কোনটো পদ উপযুক্ত?"
                    : language === "hi"
                    ? "मेरे लिए कौन सा रोल सही है?"
                    : "What role suits me"
                )
              }
              className="text-xs font-mono py-1.5 cursor-pointer flex items-center gap-2"
            >
              <Compass size={13} className="w-3 h-3 text-violet-500" />
              {isAssamese ? "উপযুক্ত পদ সন্ধান" : "What role suits me"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSend(
                  isAssamese
                    ? "এটা ৰোডমেপ বনাওক"
                    : language === "hi"
                    ? "एक रोडमैप बनाएं"
                    : "Make me a roadmap"
                )
              }
              className="text-xs font-mono py-1.5 cursor-pointer flex items-center gap-2"
            >
              <Milestone size={13} className="w-3 h-3 text-amber-500" />
              {isAssamese ? "ৰোডমেপ তৈয়াৰ" : "Make me a roadmap"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSend(
                  isAssamese
                    ? "চাকৰি সন্ধান কৰক"
                    : language === "hi"
                    ? "नौकरी खोजें"
                    : "Find me a job"
                )
              }
              className="text-xs font-mono py-1.5 cursor-pointer flex items-center gap-2"
            >
              <Briefcase size={13} className="w-3 h-3 text-teal-500" />
              {isAssamese ? "চাকৰি সন্ধান" : "Find me a job"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSend(
                  isAssamese
                    ? "মক সাক্ষাৎকাৰ"
                    : language === "hi"
                    ? "मॉक इंटरव्यू"
                    : "Mock interview"
                )
              }
              className="text-xs font-mono py-1.5 cursor-pointer flex items-center gap-2"
            >
              <MessageSquareQuote size={13} className="w-3 h-3 text-sky-500" />
              {isAssamese ? "মক সাক্ষাৎকাৰ" : "Mock interview"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {/* Send button */}
        <AnimateIcon animateOnHover asChild>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={submit}
            disabled={disabled}
            className="h-8 gap-1.5 font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            <Send size={14} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </AnimateIcon>
      </div>
    </div>
  );
}
