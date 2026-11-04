"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Briefcase, MapPin, Building2, Save, Check, Loader2, ArrowRight } from "@/components/animate-ui/icons";
import { Badge } from "@/components/ui/badge";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface JobItem {
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  url?: string | null;
  source?: string;
}

interface JobMatchesCardProps {
  data: {
    role: string;
    jobs: JobItem[];
  };
}

export function JobMatchesCard({ data }: JobMatchesCardProps) {
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [savingJobs, setSavingJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check which jobs are already saved on mount
    axiosAPI
      .get("/career-guide/saved-jobs")
      .then((res) => {
        const jobs = res.data.jobs || [];
        const map: Record<string, boolean> = {};
        jobs.forEach((j: any) => {
          if (j.url) map[j.url] = true;
          map[`${j.company}-${j.title}`] = true;
        });
        setSavedJobs((prev) => ({ ...prev, ...map }));
      })
      .catch(() => {});
  }, []);

  if (!data || !data.jobs) return null;

  const handleSaveJob = async (job: JobItem, key: string) => {
    try {
      setSavingJobs((prev) => ({ ...prev, [key]: true }));
      const res = await axiosAPI.post("/career-guide/saved-jobs", {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        url: job.url,
        source: job.source,
      });

      setSavedJobs((prev) => ({
        ...prev,
        [key]: true,
        ...(job.url ? { [job.url]: true } : {}),
        [`${job.company}-${job.title}`]: true,
      }));

      if (res.data?.alreadySaved) {
        toast.success("Job is already in your Saved Jobs list!");
      } else {
        toast.success("Job saved! View it under Saved Jobs in the sidebar.");
      }
    } catch (err: any) {
      console.error("Save job error:", err);
      toast.error(err.response?.data?.msg || "Failed to save job");
    } finally {
      setSavingJobs((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="w-full max-w-xl rounded-none border border-border bg-card p-4 space-y-3 font-sans shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-foreground shrink-0" />
          <span className="font-heading text-sm font-semibold text-foreground">
            Live Job Openings
          </span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] rounded-none">
          {data.role}
        </Badge>
      </div>

      {/* Job list */}
      <div className="space-y-2">
        {data.jobs.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 text-center font-mono">
            No active listings found right now. Check back soon!
          </p>
        ) : (
          data.jobs.map((job, idx) => {
            const jobKey = job.url || `${job.company}-${job.title}-${idx}`;
            const isSaved = !!savedJobs[jobKey];
            const isSaving = !!savingJobs[jobKey];

            return (
              <div
                key={jobKey}
                className="p-3 border border-border/70 hover:border-foreground/30 transition-all bg-background/50 flex flex-col gap-2 hover:shadow-xs rounded-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                      {job.title}
                    </span>
                  </div>

                  {/* Actions cluster: Save & Apply */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSaveJob(job, jobKey)}
                      disabled={isSaved || isSaving}
                      className={cn(
                        "flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded-none border transition-colors cursor-pointer select-none",
                        isSaved
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold cursor-default"
                          : "border-border/80 bg-background hover:bg-muted text-foreground hover:border-foreground/40"
                      )}
                      title={isSaved ? "Saved to your Jobs feed" : "Save this job to your Jobs feed"}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 animate-spin text-muted-foreground" />
                          <span>Saving...</span>
                        </>
                      ) : isSaved ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-2.5 h-2.5 text-muted-foreground" />
                          <span>Save</span>
                        </>
                      )}
                    </button>

                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 border border-border/80 bg-background hover:bg-muted hover:border-foreground/40 text-foreground transition-colors shrink-0 font-medium select-none"
                        title="Apply on company / job website"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-muted-foreground/70" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground/70" /> {job.location}
                  </span>
                  {job.salary && (
                    <span className="text-emerald-500 font-semibold">{job.salary}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint & quick link */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground select-none">
        <span className="flex items-center gap-1.5">
          <Save className="w-3 h-3 text-emerald-500" />
          <span>Saved chat jobs are kept separately under <strong>Saved Jobs</strong> in your sidebar.</span>
        </span>
        <Link
          href="/saved-jobs"
          className="inline-flex items-center gap-1 text-foreground hover:text-emerald-500 font-semibold tracking-wider uppercase transition-colors shrink-0"
        >
          <span>Open Saved Jobs</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

