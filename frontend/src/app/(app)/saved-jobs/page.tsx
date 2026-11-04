"use client";

import { useEffect, useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import {
  Briefcase,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Loader2,
} from "@/components/animate-ui/icons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  salary?: string | null;
  url?: string | null;
  source: string;
  description: string;
  matchScore?: number | null;
  status: string;
  createdAt: string;
}

export default function SavedJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosAPI.get("/career-guide/saved-jobs");
      setJobs(res.data.jobs || []);
    } catch (err: any) {
      console.error("Error fetching saved jobs:", err);
      toast.error(err.response?.data?.msg || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axiosAPI.delete(`/career-guide/saved-jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job removed from saved jobs");
    } catch (err: any) {
      console.error("Error deleting saved job:", err);
      toast.error(err.response?.data?.msg || "Failed to remove job");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.location && job.location.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6 max-w-6xl mx-auto selection:bg-foreground selection:text-background">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Saved Jobs
            </h1>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-none">
              CHAT BOOKMARKS
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Opportunities saved from your AI Career Guide chat conversations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/career-guide")}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-all rounded-none inline-flex items-center gap-1.5 font-semibold cursor-pointer select-none active:scale-95"
          >
            <Compass size={13} />
            <span>Open Career Guide</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {jobs.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or location..."
              className="w-full bg-background border border-border pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 rounded-none font-mono focus:outline-none focus:border-foreground/40"
            />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
            Showing {filteredJobs.length} of {jobs.length} saved
          </span>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center space-y-3 border border-border bg-card rounded-none">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          <p className="font-mono text-xs text-muted-foreground">Loading saved jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="relative border border-border bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 rounded-none shadow-xs">
          <div className="w-12 h-12 border border-violet-500/30 bg-violet-500/10 flex items-center justify-center mx-auto text-violet-500">
            <Briefcase size={20} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">No saved jobs yet</h3>
            <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto leading-relaxed">
              When the AI Career Guide finds live job listings in chat, click the <strong>Save</strong> button on any job card to bookmark it here.
            </p>
          </div>
          <button
            onClick={() => router.push("/career-guide")}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 rounded-none shadow-sm active:scale-95 cursor-pointer font-semibold"
          >
            <Sparkles size={13} />
            <span>Search Jobs with AI</span>
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center rounded-none font-mono text-xs text-muted-foreground">
          No saved jobs match "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 sm:p-5 border border-border/80 hover:border-foreground/30 bg-card transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-none shadow-xs"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-none">
                    SAVED CHAT JOB
                  </span>
                  {job.salary && (
                    <span className="font-mono text-[10px] text-emerald-500 font-semibold border border-border px-1.5 py-0.5 bg-background">
                      {job.salary}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs font-mono text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-foreground font-semibold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {job.company}
                  </span>
                  <span className="text-muted-foreground/40">&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    {job.location || "Remote / Various"}
                  </span>
                </p>

                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground pt-0.5">
                  <Calendar size={11} className="text-muted-foreground/70" />
                  <span>SAVED ON: {formatDate(job.createdAt).toUpperCase()}</span>
                </div>
              </div>

              {/* Actions cluster */}
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-all rounded-none inline-flex items-center gap-1.5 font-semibold cursor-pointer select-none"
                    title="Apply on company / external portal"
                  >
                    <span>Apply</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                <button
                  onClick={() => router.push(`/apply`)}
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-border hover:border-foreground/40 bg-background hover:bg-muted text-foreground transition-all rounded-none inline-flex items-center gap-1.5 cursor-pointer select-none"
                  title="Generate tailored resume & cover letter"
                >
                  <Sparkles size={12} className="text-violet-500" />
                  <span>Tailor</span>
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-colors rounded-none cursor-pointer"
                      title="Remove from saved jobs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-none border border-border bg-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold text-sm">
                        Remove saved job?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs">
                        This will remove <strong>{job.title}</strong> at <strong>{job.company}</strong> from your saved jobs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-none border border-border text-xs">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(job.id)}
                        className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

