"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Target,
} from "@/components/animate-ui/icons";
import { Badge } from "@/components/ui/badge";
import { MockInterviewEvaluationData } from "@/types/careerGuide";
import { cn } from "@/lib/utils";

interface MockInterviewEvaluationCardProps {
  data: MockInterviewEvaluationData;
  onRetry?: (topic: string) => void;
  onNewTopic?: () => void;
}

export function MockInterviewEvaluationCard({
  data,
  onRetry,
  onNewTopic,
}: MockInterviewEvaluationCardProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  if (!data) return null;

  const toggleExpand = (qNum: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
  };

  const percentage = Math.min(100, Math.max(0, data.percentage ?? Math.round((data.score / (data.totalQuestions || 1)) * 100)));

  return (
    <div className="w-full rounded-none border border-border bg-card p-4 space-y-4 font-sans shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border pb-3 gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-foreground shrink-0" />
            <span className="font-heading text-sm font-semibold text-foreground">
              Mock Interview Evaluation
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {data.topic} • {data.totalQuestions} Questions Completed
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-foreground">
              {data.score}/{data.totalQuestions}
            </span>
            <span className="font-mono text-xs text-muted-foreground">({percentage}%)</span>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-[10px] rounded-none px-2 py-0.5 uppercase tracking-wider"
          >
            {data.grade || (percentage >= 75 ? "Advanced" : percentage >= 50 ? "Proficient" : "Needs Practice")}
          </Badge>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-muted rounded-none overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Executive Feedback */}
      {data.overallFeedback && (
        <div className="p-3 bg-muted/30 border border-border text-xs text-foreground leading-relaxed">
          <p>{data.overallFeedback}</p>
        </div>
      )}

      {/* Strengths & Improvements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Strengths */}
        {data.strengths && data.strengths.length > 0 && (
          <div className="p-3 bg-background border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Strengths Observed</span>
            </div>
            <ul className="space-y-1.5 text-xs text-foreground">
              {data.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {data.improvements && data.improvements.length > 0 && (
          <div className="p-3 bg-background border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Target className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Areas to Improve</span>
            </div>
            <ul className="space-y-1.5 text-xs text-foreground">
              {data.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Question-by-Question Detailed Breakdown */}
      {data.questions && data.questions.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Question Breakdown & Corrections</span>
            <span>{data.questions.length} questions</span>
          </div>

          <div className="space-y-2">
            {data.questions.map((q) => {
              const isExpanded = expandedQuestions[q.questionNumber] ?? true;
              const isCorrect = q.isCorrect === true;
              const isPartial = q.isCorrect === "partial";

              return (
                <div
                  key={q.questionNumber}
                  className="border border-border/80 bg-background rounded-none transition-all"
                >
                  {/* Accordion header */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(q.questionNumber)}
                    className="w-full p-2.5 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-muted/40 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                      ) : isPartial ? (
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="font-mono text-xs font-semibold text-foreground">
                        Q{q.questionNumber}
                      </span>
                      <span className="text-xs text-foreground truncate max-w-[240px] sm:max-w-[340px]">
                        {q.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={cn(
                          "font-mono text-[10px] px-1.5 py-0.5 border",
                          isCorrect
                            ? "border-foreground/40 bg-foreground/10 text-foreground font-medium"
                            : isPartial
                            ? "border-border bg-muted/60 text-foreground"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {isCorrect ? "Correct" : isPartial ? "Partial" : "Incorrect"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-2.5 text-xs">
                      {/* Full question text */}
                      <p className="font-medium text-foreground leading-relaxed pt-1">
                        {q.question}
                      </p>

                      {/* User's answer & Correct answer comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 border border-border/60 bg-muted/20 space-y-0.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                            Your Answer:
                          </span>
                          <p className="text-foreground leading-snug">{q.userAnswer || "No answer provided"}</p>
                        </div>
                        <div className="p-2 border border-border/60 bg-muted/40 space-y-0.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                            Ideal / Correct Answer:
                          </span>
                          <p className="text-foreground leading-snug font-medium">{q.correctAnswer}</p>
                        </div>
                      </div>

                      {/* What went wrong */}
                      {q.whatWentWrong && (
                        <div className="p-2.5 border border-border bg-muted/20 space-y-1">
                          <span className="font-mono text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                            What you got wrong:
                          </span>
                          <p className="text-foreground text-[11px] leading-relaxed">
                            {q.whatWentWrong}
                          </p>
                        </div>
                      )}

                      {/* How to improve */}
                      {q.howToImprove && (
                        <div className="p-2.5 border border-border bg-background space-y-1">
                          <div className="flex items-center gap-1 font-mono text-[10px] text-foreground font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-foreground shrink-0" />
                            <span>How to improve next time:</span>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {q.howToImprove}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-mono">
          Ready for another round?
        </span>
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(data.topic)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer select-none rounded-none"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Practice Again</span>
            </button>
          )}
          {onNewTopic && (
            <button
              type="button"
              onClick={onNewTopic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer select-none rounded-none"
            >
              <span>Other Topic</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
