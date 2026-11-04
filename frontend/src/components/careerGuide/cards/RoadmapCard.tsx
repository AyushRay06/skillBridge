"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink } from "@/components/animate-ui/icons";
import { RoadmapData } from "@/types/careerGuide";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";

interface RoadmapStep {
  stepNumber: number;
  title: string;
  whatToLearn: string;
  whyItMatters: string;
  resources: { label: string; url: string }[];
  status?: string;
}

interface RoadmapCardProps {
  data: RoadmapData;
  savedRoadmapId?: string;
  onSave?: () => Promise<any> | void;
  onUpdateStep?: (stepId: string, status: string, roadmapId?: string) => void;
}

function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "docs";
  }
}

export function RoadmapCard({ data, savedRoadmapId, onSave, onUpdateStep }: RoadmapCardProps) {
  const [steps, setSteps] = useState<RoadmapStep[]>(() => {
    return (data?.steps || []).map((s, idx) => ({
      ...s,
      stepNumber: s.stepNumber || idx + 1,
      status: s.status || "not_started",
    }));
  });

  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | undefined>(
    data?.id || savedRoadmapId
  );
  const [saved, setSaved] = useState(!!(data?.id || savedRoadmapId));
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // first step open

  useEffect(() => {
    if (data?.steps && data.steps.length > 0) {
      setSteps(
        data.steps.map((s, idx) => ({
          ...s,
          stepNumber: s.stepNumber || idx + 1,
          status: s.status || "not_started",
        }))
      );
    }
    if (data?.id) {
      setCurrentRoadmapId(data.id);
      setSaved(true);
    }
  }, [data]);

  if (!data) return null;

  const totalSteps = steps.length;
  const doneCount = steps.filter((s) => s.status === "done").length;
  const inProgressCount = steps.filter((s) => s.status === "in_progress").length;
  const progressPct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  const handleCycleStatus = async (stepNumber: number) => {
    const currentStep = steps.find((s) => s.stepNumber === stepNumber);
    const currentStatus = currentStep?.status || "not_started";
    const nextStatus =
      currentStatus === "not_started"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "done"
        : "not_started";

    // Update state immediately
    setSteps((prev) =>
      prev.map((s) => (s.stepNumber === stepNumber ? { ...s, status: nextStatus } : s))
    );

    // Sync to backend if saved
    if (currentRoadmapId) {
      try {
        if (onUpdateStep) {
          onUpdateStep(String(stepNumber), nextStatus, currentRoadmapId);
        } else {
          await axiosAPI.patch(
            `/career-guide/roadmaps/${currentRoadmapId}/steps/${stepNumber}`,
            { status: nextStatus }
          );
        }
      } catch (err) {
        console.error("Failed to update step progress:", err);
      }
    }
  };

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const payloadToSave: RoadmapData = {
        ...data,
        steps,
      };

      if (onSave) {
        const result: any = await onSave();
        if (result?.id) {
          setCurrentRoadmapId(result.id);
        }
      } else {
        const res = await axiosAPI.post("/career-guide/roadmaps", payloadToSave);
        if (res.data?.roadmap?.id) {
          setCurrentRoadmapId(res.data.roadmap.id);
        }
        toast.success("Roadmap saved");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skillbridge:roadmap-updated"));
        }
      }
      setSaved(true);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card text-foreground overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-border/60">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            {data.targetRole && (
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                {data.targetRole}
              </div>
            )}
            <h3 className="text-base font-medium text-foreground tracking-tight">
              {data.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
              saved
                ? "border-border/60 text-muted-foreground bg-muted/20 cursor-default"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {saved ? "Saved" : saving ? "Saving..." : "Save Roadmap"}
          </button>
        </div>

        {/* Minimal Progress Line */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>
              {doneCount} of {totalSteps} completed
              {inProgressCount > 0 && ` (${inProgressCount} in progress)`}
            </span>
            <span className="text-foreground font-medium">{progressPct}%</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Clean Timeline Steps ── */}
      <div className="p-5 space-y-1">
        {steps.map((step, idx) => {
          const status = step.status || "not_started";
          const isExpanded = expandedIndex === idx;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.stepNumber} className="relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border/60" />
              )}

              <div className="flex items-start gap-3.5 pb-5">
                {/* Status Toggle Node */}
                <button
                  type="button"
                  onClick={() => handleCycleStatus(step.stepNumber)}
                  title={`Click to change status: ${
                    status === "done"
                      ? "Mark To Do"
                      : status === "in_progress"
                      ? "Mark Done"
                      : "Mark In Progress"
                  }`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono transition-all cursor-pointer relative z-10 border ${
                    status === "done"
                      ? "bg-foreground text-background border-foreground font-bold"
                      : status === "in_progress"
                      ? "bg-background text-foreground border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {status === "done" ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : status === "in_progress" ? (
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                  ) : (
                    step.stepNumber
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="text-left font-medium text-sm text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2 cursor-pointer min-w-0"
                    >
                      <span className="truncate">{step.title}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCycleStatus(step.stepNumber)}
                      className="text-[10px] font-mono text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors"
                    >
                      {status === "done"
                        ? "Completed"
                        : status === "in_progress"
                        ? "In Progress"
                        : "To Do"}
                    </button>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="mt-2.5 space-y-3 text-xs text-muted-foreground leading-relaxed pr-2">
                      {step.whatToLearn && <p>{step.whatToLearn}</p>}

                      {step.whyItMatters && (
                        <p className="text-[11px] text-muted-foreground/80 italic border-l-2 border-border pl-2.5 py-0.5">
                          {step.whyItMatters}
                        </p>
                      )}

                      {/* Documentation links */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="pt-1.5 flex flex-wrap gap-2">
                          {step.resources.map((r, i) => (
                            <a
                              key={i}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-muted/20 hover:bg-muted hover:text-foreground transition-colors text-xs text-muted-foreground"
                            >
                              <span>{r.label}</span>
                              <span className="font-mono text-[10px] opacity-60">
                                ({extractDomain(r.url)})
                              </span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
