"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Copy,
  Check,
} from "@/components/animate-ui/icons";
import { Badge } from "@/components/ui/badge";
import { MockInterviewQuestionData } from "@/types/careerGuide";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface MockInterviewCardProps {
  data: MockInterviewQuestionData;
  parentContent?: string;
  onAnswer?: (answer: string) => void;
}

interface ParsedQuestionSection {
  type: "text" | "code";
  content: string;
  lang?: string;
}

function cleanOptionText(opt: string): string {
  return opt.replace(/^\s*([A-D]\)|\([A-D]\)|[1-4]\.)\s+/i, "").trim();
}

function parseQuestionSections(
  rawQuestion: string,
  hasSeparateOptions: boolean
): ParsedQuestionSection[] {
  if (!rawQuestion) return [];

  // Strip duplicate option listings if separate options are provided
  let cleaned = rawQuestion;
  if (hasSeparateOptions) {
    cleaned = cleaned
      .split("\n")
      .filter((line) => !/^\s*([A-D]\)|\([A-D]\)|[1-4]\.)\s+/i.test(line))
      .join("\n");
  }

  // Strip trailing "Please reply with your answer..." instructions
  cleaned = cleaned
    .split("\n")
    .filter(
      (line) =>
        !/^\s*(please\s+reply\s+with|choose\s+your\s+answer|select\s+the\s+correct)/i.test(
          line
        )
    )
    .join("\n")
    .trim();

  // Extract code blocks and text segments
  const sections: ParsedQuestionSection[] = [];
  const codeRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      const text = cleaned.slice(lastIndex, match.index).trim();
      if (text) {
        sections.push({ type: "text", content: text });
      }
    }

    const lang = match[1]?.trim() || "";
    const code = match[2]?.trim() || "";
    if (code) {
      sections.push({ type: "code", content: code, lang });
    }

    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    const text = cleaned.slice(lastIndex).trim();
    if (text) {
      sections.push({ type: "text", content: text });
    }
  }

  if (sections.length === 0 && cleaned) {
    sections.push({ type: "text", content: cleaned });
  }

  return sections;
}

export function MockInterviewCard({ data, parentContent, onAnswer }: MockInterviewCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [longAnswerText, setLongAnswerText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  if (!data) return null;

  // Extract options if LLM placed them in data.question instead of data.options
  let effectiveOptions =
    data.options && Array.isArray(data.options) && data.options.length > 0 ? [...data.options] : [];

  if (effectiveOptions.length === 0 && data.question) {
    const lines = data.question.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([A-D]\)|\([A-D]\)|[1-4]\.)\s*(.+)/i);
      if (match) {
        effectiveOptions.push(match[0].trim());
      }
    }
  }

  // Fallback extraction from parent message text if options were outputted in chat text
  if (effectiveOptions.length === 0 && parentContent) {
    const lines = parentContent.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([A-D]\)|\([A-D]\)|[1-4]\.)\s*(.+)/i);
      if (match) {
        effectiveOptions.push(match[0].trim());
      }
    }
  }

  const topic = data.topic || data.role || "Technical Practice";
  const totalQuestions = data.totalQuestions || 5;
  const hasOptions = effectiveOptions.length > 0;
  let questionType =
    data.questionType ||
    (hasOptions
      ? effectiveOptions.length === 2 &&
        effectiveOptions.every((o) => /^(true|false)$/i.test(cleanOptionText(o)))
        ? "true_false"
        : "mcq"
      : "long_answer");

  // Fallback: If marked as MCQ but no options were found anywhere, supply fallback choices
  if (questionType === "mcq" && effectiveOptions.length === 0) {
    effectiveOptions = ["A", "B", "C", "D"];
  }

  // Clean raw question if it accidentally prepended previous feedback
  let rawQuestion = data.question || "";
  if (data.feedbackOnPrevious && rawQuestion.startsWith(data.feedbackOnPrevious)) {
    rawQuestion = rawQuestion.slice(data.feedbackOnPrevious.length).trim();
  }
  rawQuestion = rawQuestion
    .replace(/^(That answer is (?:in)?correct|Correct!|Incorrect|Your previous answer was[^\n]+)\.?\s*/i, "")
    .trim();

  const sections = parseQuestionSections(rawQuestion, hasOptions);

  const handleSelectOption = (opt: string) => {
    if (hasSubmitted) return;
    setSelectedOption(opt);
    setHasSubmitted(true);
    onAnswer?.(opt);
  };

  const handleLongAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!longAnswerText.trim() || hasSubmitted) return;
    setHasSubmitted(true);
    onAnswer?.(longAnswerText.trim());
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const typeLabel =
    questionType === "mcq"
      ? "Multiple Choice"
      : questionType === "true_false"
      ? "True / False"
      : "Open Response";

  return (
    <div className="w-full rounded-none border border-border bg-card p-4 space-y-3.5 font-sans shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquareQuote className="w-4 h-4 text-foreground shrink-0" />
          <span className="font-heading text-sm font-semibold text-foreground truncate">
            Mock Interview Practice
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant="outline"
            className="font-mono text-[10px] rounded-none px-2 py-0.5"
          >
            {topic}
          </Badge>
          <span className="font-mono text-[10px] bg-muted px-2 py-0.5 border border-border text-foreground font-semibold">
            Q{data.questionNumber}/{totalQuestions}
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground border border-border/60 px-1.5 py-0.5">
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Feedback on previous answer if present */}
      {data.feedbackOnPrevious && (
        <div className="p-3 border border-border bg-muted/30 text-xs text-foreground leading-relaxed rounded-none space-y-1">
          <span className="font-mono text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
            Feedback on your previous answer:
          </span>
          <p className="text-foreground leading-snug">{data.feedbackOnPrevious}</p>
        </div>
      )}

      {/* Question container */}
      <div className="p-3.5 bg-background border border-border space-y-2.5 rounded-none">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          <span>Question {data.questionNumber}</span>
          <span className="sm:hidden">{typeLabel}</span>
        </div>

        {/* Structured sections (prompt text and syntax code blocks) */}
        <div className="space-y-2">
          {sections.map((sec, idx) => {
            if (sec.type === "code") {
              const isCopied = copiedCodeIdx === idx;
              return (
                <div
                  key={idx}
                  className="my-2 border border-border bg-muted/30 font-mono text-xs overflow-hidden rounded-none"
                >
                  <div className="px-3 py-1 bg-muted/60 border-b border-border/70 text-[10px] text-muted-foreground uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>{sec.lang || "code"}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(sec.content, idx)}
                      className="hover:text-foreground text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer select-none"
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-foreground" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto leading-relaxed text-foreground font-mono text-xs whitespace-pre">
                    <code>{sec.content}</code>
                  </pre>
                </div>
              );
            }

            return (
              <p
                key={idx}
                className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap"
              >
                {sec.content}
              </p>
            );
          })}
        </div>
      </div>

      {/* Interactive Options Area */}
      {questionType === "mcq" && effectiveOptions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Choose your answer:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {effectiveOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const displayLabel = String.fromCharCode(65 + idx);
              const cleanedText = cleanOptionText(opt);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(opt)}
                  className={cn(
                    "w-full text-left p-2.5 text-xs border rounded-none transition-all flex items-start gap-2.5 cursor-pointer select-none",
                    isSelected
                      ? "border-foreground bg-foreground/10 text-foreground font-medium"
                      : "border-border/80 bg-background hover:bg-muted/70 hover:border-foreground/30 text-foreground",
                    hasSubmitted && !isSelected && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-none border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-muted/40 text-foreground"
                    )}
                  >
                    {displayLabel}
                  </span>
                  <span className="flex-1 leading-snug pt-0.5">{cleanedText}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* True / False Interactive buttons */}
      {questionType === "true_false" && (
        <div className="space-y-1.5 pt-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Select True or False:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["True", "False"].map((choice) => {
              const isSelected = selectedOption === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(choice)}
                  className={cn(
                    "py-2.5 px-4 text-xs font-mono font-medium border rounded-none transition-all text-center cursor-pointer select-none",
                    isSelected
                      ? "border-foreground bg-foreground/10 text-foreground font-bold"
                      : "border-border/80 bg-background hover:bg-muted/70 hover:border-foreground/30 text-foreground",
                    hasSubmitted && !isSelected && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Long Answer / Open Response input field */}
      {questionType === "long_answer" && (
        <form onSubmit={handleLongAnswerSubmit} className="space-y-2 pt-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Type your response:
          </div>
          <textarea
            rows={3}
            disabled={hasSubmitted}
            value={longAnswerText}
            onChange={(e) => setLongAnswerText(e.target.value)}
            placeholder="Write your explanation or approach here, or type directly in the chat below..."
            className="w-full text-xs p-2.5 bg-background border border-border focus:border-foreground outline-hidden resize-none text-foreground placeholder:text-muted-foreground/60 leading-relaxed rounded-none font-sans"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!longAnswerText.trim() || hasSubmitted}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none font-mono"
              )}
            >
              <span>{hasSubmitted ? "Submitted" : "Submit Answer"}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      )}

      {/* Expandable Hint */}
      {data.hint && (
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{showHint ? "Hide Hint" : "Need a hint?"}</span>
            {showHint ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {showHint && (
            <div className="p-2.5 bg-muted/40 border border-border text-xs text-foreground leading-relaxed rounded-none">
              {data.hint}
            </div>
          )}
        </div>
      )}

      {/* Footer prompt */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-mono text-[10px]">
          <Sparkles className="w-3 h-3 text-foreground" />
          {hasSubmitted
            ? "Answer recorded! Evaluating response..."
            : "Click a choice above or send your answer in the chat below."}
        </span>
      </div>
    </div>
  );
}
