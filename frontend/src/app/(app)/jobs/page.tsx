"use client";

import { useEffect, useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { 
  Briefcase, 
  Trash2, 
  Search, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Sparkles,
  FileText,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { JobFeedSkeleton } from "@/components/skeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const fetchJobs = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await axiosAPI.get(`/autopilot/jobs`, {
        params: { page: pageNum, limit: 20 }
      });
      setJobs(res.data.jobs);
      setTotalJobs(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      toast.error("Failed to fetch jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {

    try {
      await axiosAPI.delete(`/autopilot/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      fetchJobs(page); // refresh list
    } catch (err: any) {
      toast.error("Failed to delete job");
      console.error(err);
    }
  };

  const handleGenerateDocuments = (job: any) => {
    if (job.applicationId) {
      router.push(`/apply?id=${job.applicationId}`); 
    } else {
      localStorage.setItem("prefilledJobDesc", job.description);
      toast.success("Loaded job description into One-Click Apply!");
      router.push(`/apply`);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-muted text-muted-foreground border-border";
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    if (score >= 40) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "discovered":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">DISCOVERED</span>;
      case "qualified":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">QUALIFIED</span>;
      case "applied":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">AUTO-APPLIED</span>;
      case "below_threshold":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-border bg-muted text-muted-foreground">LOW SCORE</span>;
      case "skipped":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">SKIPPED</span>;
      default:
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-border bg-muted text-foreground">{status.toUpperCase()}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        
        {/* Header Bar with CAD Framing */}
        <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Discovered Jobs
              </h1>
              <p className="text-muted-foreground text-xs">
                Opportunities matched by your autopilot search criteria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-muted-foreground">
                <span className="font-bold text-foreground">{totalJobs}</span> roles found
              </div>
            </div>
          </div>
        </div>

        {loading && page === 1 ? (
          <JobFeedSkeleton count={5} />
        ) : jobs.length === 0 ? (
          <div className="relative border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 rounded-none">
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

            <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
              <Search size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">No discovered jobs found</h3>
              <p className="text-muted-foreground text-xs font-mono max-w-sm mx-auto">
                Trigger an autopilot schedule to begin scanning Remotive and JSearch.
              </p>
            </div>
            <button
              onClick={() => router.push("/autopilot")}
              className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 rounded-none"
            >
              <Sparkles size={13} />
              Open Autopilot
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={cn(
                    "relative border bg-card transition-colors rounded-none",
                    isExpanded ? "border-foreground/40" : "border-border hover:border-foreground/30"
                  )}
                >
                  {/* Summary Row */}
                  <div
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-muted/10 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-none font-semibold",
                          getScoreColor(job.matchScore)
                        )}>
                          {job.matchScore !== null ? `${job.matchScore}% MATCH` : "EVALUATION PENDING"}
                        </span>
                        {getStatusBadge(job.status)}
                        <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-1.5 py-0.5 bg-background">
                          {job.source || "WEB"}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mt-1 group-hover:underline">
                        {job.title}
                      </h3>
                      
                      <p className="text-xs font-mono text-muted-foreground">
                        <span className="text-foreground font-semibold">{job.company}</span>
                        <span className="mx-1.5 text-muted-foreground/60">&bull;</span>
                        <span>{job.location || "Remote / Unspecified"}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground pt-0.5">
                        <Calendar size={11} />
                        <span>INDEXED: {formatDate(job.createdAt).toUpperCase()}</span>
                        {job.schedule?.name && (
                          <>
                            <span>&bull;</span>
                            <span>AGENT: {job.schedule.name.toUpperCase()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                      {job.status === "below_threshold" ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-2.5 py-1 border border-border bg-muted/30 text-muted-foreground font-mono text-[11px]"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>LOW MATCH ({job.matchScore ?? 0}%)</span>
                        </div>
                      ) : job.applicationId ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGenerateDocuments(job); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer rounded-none"
                        >
                          <FileText size={13} />
                          Documents
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGenerateDocuments(job); }}
                          className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer rounded-none flex items-center gap-1.5 font-semibold"
                        >
                          <Sparkles size={13} />
                          Tailor & Apply
                        </button>
                      )}
                      
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-background hover:bg-muted border border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-colors rounded-none"
                          title="Open Original Job Link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-colors rounded-none"
                            title="Delete Job"
                          >
                            <Trash2 size={13} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()} className="rounded-none border border-border bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-bold">Delete this job record?</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs">
                              This action permanently removes this record from your indexed feed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="rounded-none border border-border">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                              className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs uppercase"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <button className="p-1.5 hover:bg-muted text-muted-foreground border border-transparent hover:border-border transition-colors rounded-none">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Detail Expansion View */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/10 p-5 space-y-4">
                      {job.matchReason && (
                        <div className="p-4 bg-background border border-border space-y-1.5 rounded-none">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1.5">
                            <Sparkles size={12} />
                            MATCH ASSESSMENT
                          </div>
                          <p className="text-muted-foreground text-xs font-mono leading-relaxed whitespace-pre-line">
                            {job.matchReason}
                          </p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          JOB DESCRIPTION EXTRACT
                        </div>
                        <div className="p-4 bg-background border border-border max-h-[260px] overflow-y-auto font-mono text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line rounded-none">
                          {job.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase disabled:opacity-30 transition-colors cursor-pointer select-none rounded-none"
                >
                  PREV
                </button>
                <span className="font-mono text-xs text-muted-foreground">
                  PAGE {page} OF {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3.5 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase disabled:opacity-30 transition-colors cursor-pointer select-none rounded-none"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
  );
}
