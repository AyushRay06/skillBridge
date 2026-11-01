"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { axiosAPI } from "@/lib/axiosInterface";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  Briefcase, 
  FileText, 
  Plus, 
  ChevronRight,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { FullPageSkeleton } from "@/components/skeletons";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    activeAgents: 0
  });
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [recentSchedules, setRecentSchedules] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [resumesRes, schedulesRes] = await Promise.all([
        axiosAPI.get("/resume/all").catch(() => ({ data: { resumes: [] } })),
        axiosAPI.get("/autopilot/schedules").catch(() => ({ data: { schedules: [] } })),
      ]);

      const resumes = resumesRes.data.resumes || [];
      const schedules = schedulesRes.data.schedules || [];

      const activeCount = schedules.filter((s: any) => s.isActive).length;
      const totalJobsDiscovered = schedules.reduce((acc: number, s: any) => {
        return acc + (s._count?.discoveredJobs || 0);
      }, 0);

      setStats({
        totalResumes: resumes.length,
        totalJobs: totalJobsDiscovered,
        activeAgents: activeCount
      });

      setRecentResumes(resumes.slice(0, 6));
      setRecentSchedules(schedules.slice(0, 4));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) return <FullPageSkeleton />;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Top Header Row with Clear Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your resumes, applications, and automated search agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/apply")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-black text-white hover:bg-neutral-800 border border-black dark:border-neutral-700 uppercase tracking-wider transition-colors rounded-none"
          >
            <Zap size={14} /> One-Click Apply
          </button>
          <button 
            onClick={() => router.push("/resume")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wider transition-colors rounded-none"
          >
            <Plus size={14} /> New Resume
          </button>
        </div>
      </div>

      {/* 3 Spacious Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Total Resumes</span>
            <FileText size={16} />
          </div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {loading ? "..." : stats.totalResumes}
          </div>
          <p className="text-xs text-muted-foreground">Tailored resumes created</p>
        </div>

        <div className="border border-border bg-card p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Jobs Discovered</span>
            <Briefcase size={16} />
          </div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {loading ? "..." : stats.totalJobs}
          </div>
          <p className="text-xs text-muted-foreground">Matching opportunities indexed</p>
        </div>

        <div className="border border-border bg-card p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Active Autopilots</span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {loading ? "..." : stats.activeAgents}
          </div>
          <p className="text-xs text-muted-foreground">Background search agents running</p>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Resumes (2/3 width) */}
        <div className="lg:col-span-2 border border-border bg-card rounded-none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-foreground" />
              <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
                Recent Resumes
              </h2>
            </div>
            <button 
              onClick={() => router.push("/saved-resumes")}
              className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              View all ({stats.totalResumes}) <ChevronRight size={13} />
            </button>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              <div className="h-12 bg-muted/40 border border-border animate-pulse" />
              <div className="h-12 bg-muted/40 border border-border animate-pulse" />
              <div className="h-12 bg-muted/40 border border-border animate-pulse" />
            </div>
          ) : recentResumes.length > 0 ? (
            <div className="divide-y divide-border">
              {recentResumes.map((resume) => (
                <div 
                  key={resume.id}
                  onClick={() => router.push("/saved-resumes")}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 border border-border bg-background flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                      <FileText size={14} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate group-hover:underline">
                        {resume.title || "Untitled Resume"}
                      </h3>
                      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mt-0.5">
                        <Clock size={11} />
                        <span>Created {formatDate(resume.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground hidden sm:inline">
                      View
                    </span>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <FileText size={28} className="mx-auto text-muted-foreground opacity-40" />
              <p className="text-sm font-semibold text-foreground">No resumes created yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Create your first resume with our step-by-step builder or tailor one directly for a job.
              </p>
              <button 
                onClick={() => router.push("/resume")}
                className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors rounded-none mt-2"
              >
                Create Resume
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Autopilot Agents Summary (1/3 width) */}
        <div className="lg:col-span-1 border border-border bg-card rounded-none flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity size={16} className="text-emerald-500" />
              <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
                Autopilot Agents
              </h2>
            </div>
            <button 
              onClick={() => router.push("/autopilot")}
              className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              Manage <ChevronRight size={13} />
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {recentSchedules.length > 0 ? (
              <div className="space-y-3">
                {recentSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-3 border border-border bg-background space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground truncate">{schedule.name}</span>
                      <span className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5",
                        schedule.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                      )}>
                        {schedule.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {schedule.targetRoles.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Activity size={24} className="mx-auto text-muted-foreground opacity-40" />
                <p className="text-xs text-muted-foreground">No autopilot agents created yet.</p>
              </div>
            )}

            <button
              onClick={() => router.push("/autopilot")}
              className="w-full py-2.5 border border-border hover:border-foreground/40 bg-background text-foreground text-xs font-mono uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2"
            >
              Configure Autopilot <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
