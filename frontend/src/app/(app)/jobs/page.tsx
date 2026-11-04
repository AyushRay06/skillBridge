"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "@/components/animate-ui/icons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs shadow-emerald-500/10";
    if (score >= 60) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shadow-xs shadow-indigo-500/10";
    if (score >= 40) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-xs shadow-amber-500/10";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "discovered":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">DISCOVERED</span>;
      case "qualified":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">QUALIFIED</span>;
      case "applied":
        return <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">AUTO-APPLIED</span>;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        
        {/* Header Bar with CAD Framing */}
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative border border-border bg-card/80 backdrop-blur-xs p-5 sm:p-6 rounded-none shadow-xs"
        >
          <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Discovered Jobs
                </h1>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  LIVE FEED
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Opportunities matched by your autopilot search criteria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/saved-jobs"
                className="text-xs font-mono border border-border/80 hover:border-foreground/40 bg-background/80 hover:bg-muted px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                title="View jobs saved from Career Guide chat"
              >
                <span>Saved from Chat</span>
                <span className="text-[10px] text-violet-500 font-bold">&rarr;</span>
              </Link>
              <div className="text-xs font-mono text-muted-foreground border border-border/80 bg-background/80 px-3 py-1.5">
                <span className="font-bold text-foreground">{totalJobs}</span> roles found
              </div>
            </div>
          </div>
        </motion.div>

        {loading && page === 1 ? (
          <JobFeedSkeleton count={5} />
        ) : jobs.length === 0 ? (
          <div className="relative border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 rounded-none shadow-sm">
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

            <div className="w-12 h-12 border border-violet-500/30 bg-violet-500/10 flex items-center justify-center mx-auto text-violet-500">
              <Search size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">No discovered jobs found</h3>
              <p className="text-muted-foreground text-xs font-mono max-w-sm mx-auto">
                Trigger an autopilot schedule to begin scanning Remotive and JSearch.
              </p>
            </div>
            <button
              onClick={() => router.push("/autopilot")}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 rounded-none shadow-sm shadow-violet-500/20 active:scale-95"
            >
              <Sparkles size={13} />
              Open Autopilot
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className={cn(
                    "relative border bg-card transition-all duration-200 rounded-none overflow-hidden",
                    isExpanded 
                      ? "border-violet-500/40 shadow-md shadow-violet-500/5" 
                      : "border-border hover:border-violet-500/30 hover:shadow-sm"
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
                      
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mt-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {job.title}
                      </h3>
                      
                      <p className="text-xs font-mono text-muted-foreground">
                        <span className="text-foreground font-semibold">{job.company}</span>
                        <span className="mx-1.5 text-muted-foreground/60">&bull;</span>
                        <span>{job.location || "Remote / Unspecified"}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground pt-0.5">
                        <Calendar size={11} className="text-amber-500/70" />
                        <span>INDEXED: {formatDate(job.createdAt).toUpperCase()}</span>
                        {job.schedule?.name && (
                          <>
                            <span>&bull;</span>
                            <span className="text-violet-500/80">AGENT: {job.schedule.name.toUpperCase()}</span>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer rounded-none active:scale-95"
                        >
                          <FileText size={13} className="text-violet-500" />
                          Documents
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGenerateDocuments(job); }}
                          className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all cursor-pointer rounded-none flex items-center gap-1.5 font-semibold shadow-xs shadow-violet-500/20 active:scale-95"
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
                          className="p-1.5 bg-background hover:bg-muted border border-border hover:border-violet-500/40 text-muted-foreground hover:text-foreground transition-all rounded-none cursor-pointer"
                          title="Open Original Job Link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-colors rounded-none cursor-pointer"
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
                      
                      <button className="p-1.5 hover:bg-muted text-muted-foreground border border-transparent hover:border-border transition-colors rounded-none cursor-pointer">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Detail Expansion View */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/10 p-5 space-y-4">
                      {job.matchReason && (
                        <div className="p-4 bg-background border border-violet-500/20 space-y-1.5 rounded-none relative">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/50 to-indigo-500/50" />
                          <div className="font-mono text-[10px] uppercase tracking-wider text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1.5">
                            <Sparkles size={12} />
                            MATCH ASSESSMENT
                          </div>
                          <p className="text-foreground text-xs font-mono leading-relaxed whitespace-pre-line">
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
                </motion.div>
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
          </motion.div>
        )}
      </div>
  );
}
