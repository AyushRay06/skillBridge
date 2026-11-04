"use client";

import Link from "next/link";
import { Check, ChevronRight, FileText, Target, Briefcase } from "@/components/animate-ui/icons";
import { ResumeReviewData } from "@/types/careerGuide";

interface ResumeReviewCardProps {
  data: ResumeReviewData;
}

function RatingBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-7 text-right shrink-0">
        {value}/{max}
      </span>
    </div>
  );
}

const BREAKDOWN_LABELS: Record<string, string> = {
  clarity: "Clarity & Readability",
  skills: "Technical Skills Depth",
  projectImpact: "Project Impact & Metrics",
  structure: "Layout & Section Structure",
  atsFriendliness: "ATS Friendliness",
  roleRelevance: "Target Role Relevance",
  keywordMatch: "JD Keyword Coverage",
  experienceFit: "Experience Alignment",
};

export function ResumeReviewCard({ data }: ResumeReviewCardProps) {
  if (!data) return null;

  const reviewType = data.reviewType || (data.targetRole ? "job_role" : data.matchPercentage ? "job_description" : "general");
  const rating = data.overallRating ?? 0;
  const matchPct = data.matchPercentage;

  return (
    <div className="rounded-lg border border-border bg-card text-foreground overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-border/60">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                {reviewType === "job_role" ? (
                  <>
                    <Target className="w-3 h-3" />
                    Role-Specific Review
                  </>
                ) : reviewType === "job_description" ? (
                  <>
                    <Briefcase className="w-3 h-3" />
                    Job Description Match Audit
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3" />
                    General Resume Review
                  </>
                )}
              </span>

              {data.targetRole && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-border bg-muted/40 text-foreground">
                  {data.targetRole}
                </span>
              )}
            </div>

            <h3 className="text-base font-medium text-foreground tracking-tight">
              {reviewType === "job_role" && data.targetRole
                ? `Evaluation for ${data.targetRole}`
                : reviewType === "job_description"
                ? "Keyword & ATS Fit Analysis"
                : "Resume Performance Review"}
            </h3>
          </div>

          {/* Overall Rating Badge */}
          <div className="text-right">
            {matchPct != null ? (
              <div className="flex flex-col items-end">
                <span className="font-mono text-xl font-bold text-foreground">
                  {matchPct}%
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  JD Match Score · {rating}/10 Quality
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <div className="font-mono text-xl font-bold text-foreground">
                  {rating}
                  <span className="text-xs text-muted-foreground font-normal">/10</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Overall Score
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Executive Summary */}
        {data.summary && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            {data.summary}
          </p>
        )}
      </div>

      <div className="p-5 space-y-5 text-xs">
        {/* ── Mode 2: Role Skills Analysis (Matched vs Missing) ── */}
        {reviewType === "job_role" && (
          <div className="space-y-3">
            {data.matchedSkills && data.matchedSkills.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Matched Skills for this Role
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-border bg-muted/30 text-foreground text-xs font-mono"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.missingSkills && data.missingSkills.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Missing Skills to Add for {data.targetRole || "Role"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-dashed border-border text-muted-foreground text-xs font-mono"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Mode 3: Job Description Keywords Audit ── */}
        {reviewType === "job_description" && (
          <div className="space-y-3">
            {data.matchedKeywords && data.matchedKeywords.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Keywords Found in Resume
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-border bg-muted/30 text-foreground text-xs font-mono"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.missingKeywords && data.missingKeywords.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Missing JD Keywords (Add for ATS optimization)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-dashed border-border text-muted-foreground text-xs font-mono"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Dimension Breakdown ── */}
        {data.breakdown && Object.keys(data.breakdown).length > 0 && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Evaluation Breakdown
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {Object.entries(data.breakdown)
                .filter(([_, val]) => typeof val === "number" && val > 0)
                .map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {BREAKDOWN_LABELS[key] ?? key}
                    </div>
                    <RatingBar value={val!} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Key Standout Strengths ── */}
        {data.strengths && data.strengths.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Key Strengths
            </div>
            <ul className="space-y-1.5">
              {data.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Actionable Scope of Improvement ── */}
        {(() => {
          const suggestions = Array.isArray(data.suggestions)
            ? data.suggestions
            : typeof data.suggestions === "string"
            ? [data.suggestions]
            : [];
          if (suggestions.length === 0) return null;

          return (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Actionable Scope of Improvement
              </div>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* ── Footer ── */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Ready to apply these improvements?</span>
          <Link
            href="/resume"
            className="text-foreground hover:underline transition-all font-medium"
          >
            Create / Tailor Resume →
          </Link>
        </div>
      </div>
    </div>
  );
}
