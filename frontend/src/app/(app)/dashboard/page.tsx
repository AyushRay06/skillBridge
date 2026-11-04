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
  Sparkles,
  Compass,
  PhoneCall,
  User,
  Check,
  Target,
  Upload
} from "@/components/animate-ui/icons";
import { motion } from "framer-motion";
import { FullPageSkeleton } from "@/components/skeletons";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    activeAgents: 0,
    activeRoadmaps: 0,
    profileCompleteness: 0,
  });
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [recentSchedules, setRecentSchedules] = useState<any[]>([]);
  const [latestRoadmap, setLatestRoadmap] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

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

      const [resumesRes, schedulesRes, roadmapsRes, profileRes] = await Promise.all([
        axiosAPI.get("/resume/all").catch(() => ({ data: { resumes: [] } })),
        axiosAPI.get("/autopilot/schedules").catch(() => ({ data: { schedules: [] } })),
        axiosAPI.get("/career-guide/roadmaps").catch(() => ({ data: { roadmaps: [] } })),
        axiosAPI.get("/profile").catch(() => ({ data: { profile: null } })),
      ]);

      const resumes = resumesRes.data.resumes || [];
      const schedules = schedulesRes.data.schedules || [];
      const roadmaps = roadmapsRes.data.roadmaps || [];
      const profile = profileRes.data.profile || null;

      const activeCount = schedules.filter((s: any) => s.isActive).length;
      const totalJobsDiscovered = schedules.reduce((acc: number, s: any) => {
        return acc + (s._count?.discoveredJobs || 0);
      }, 0);

      // Calculate master profile completeness
      let completeness = 0;
      if (profile) {
        const personalFilled = [profile.fullName, profile.email, profile.phone, profile.linkedin].filter(Boolean).length;
        completeness += (personalFilled / 4) * 20;
        if (profile.experience && profile.experience.length > 0) completeness += 25;
        if (profile.projects && profile.projects.length > 0) completeness += 20;
        if (profile.skills && profile.skills.length > 0) completeness += Math.min(20, (profile.skills.length / 5) * 20);
        if (profile.education && profile.education.length > 0) completeness += 15;
        completeness = Math.round(completeness);
      }

      setStats({
        totalResumes: resumes.length,
        totalJobs: totalJobsDiscovered,
        activeAgents: activeCount,
        activeRoadmaps: roadmaps.length,
        profileCompleteness: completeness,
      });

      setRecentResumes(resumes.slice(0, 5));
      setRecentSchedules(schedules.slice(0, 3));
      setLatestRoadmap(roadmaps[0] || null);
      setUserProfile(profile);
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
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header Row with Clear Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[10px] uppercase tracking-wider mb-2 font-semibold">
            <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
            Workspace Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your tailored documents, applications, career guidance, and search agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => router.push("/apply")}
            className="group relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-md shadow-violet-500/20 uppercase tracking-wider transition-all duration-200 active:scale-95 rounded-none cursor-pointer"
          >
            <Zap size={14} className="text-amber-300 group-hover:scale-110 transition-transform" />
            <span>One-Click Apply</span>
          </button>
          <button 
            onClick={() => router.push("/career-guide")}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold bg-card border border-violet-500/30 hover:border-violet-500/60 text-foreground hover:bg-violet-500/5 uppercase tracking-wider transition-all duration-200 active:scale-95 rounded-none shadow-xs cursor-pointer"
          >
            <Compass size={14} className="text-violet-500" />
            <span>Career Guide</span>
            <span className="relative flex h-1.5 w-1.5 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </button>
          <button 
            onClick={() => router.push("/resume")}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold bg-card border border-border hover:border-foreground/40 text-foreground hover:bg-muted/70 uppercase tracking-wider transition-all duration-200 active:scale-95 rounded-none shadow-xs cursor-pointer"
          >
            <Plus size={14} className="text-muted-foreground" />
            <span>New Resume</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Metric Cards with Accent Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Resumes (Warm Amber Accent) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => router.push("/saved-resumes")}
          className="group relative overflow-hidden border border-border/90 bg-card p-5 rounded-none space-y-3 shadow-xs hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider font-medium">Total Resumes</span>
            <div className="w-8 h-8 rounded-xs bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-200">
              <FileText size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {loading ? "..." : stats.totalResumes}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Tailored ATS documents created
          </p>
        </motion.div>

        {/* Metric 2: Jobs Discovered (Vibrant Indigo Accent) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => router.push("/jobs")}
          className="group relative overflow-hidden border border-border/90 bg-card p-5 rounded-none space-y-3 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider font-medium">Jobs Discovered</span>
            <div className="w-8 h-8 rounded-xs bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-200">
              <Briefcase size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {loading ? "..." : stats.totalJobs}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Matching opportunities indexed
          </p>
        </motion.div>

        {/* Metric 3: Active Autopilots (Emerald Accent) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => router.push("/autopilot")}
          className="group relative overflow-hidden border border-border/90 bg-card p-5 rounded-none space-y-3 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider font-medium">Active Autopilots</span>
            <div className="w-8 h-8 rounded-xs bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-200">
              <Activity size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
              {loading ? "..." : stats.activeAgents}
            </div>
            {stats.activeAgents > 0 && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-500 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Background discovery agents running
          </p>
        </motion.div>

        {/* Metric 4: Placement Readiness & Career Guide (Violet Accent) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => router.push("/career-guide")}
          className="group relative overflow-hidden border border-border/90 bg-card p-5 rounded-none space-y-3 shadow-xs hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-500/40 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-80" />
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider font-medium">Placement Readiness</span>
            <div className="w-8 h-8 rounded-xs bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-500 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-200">
              <Compass size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
              82%
            </div>
            <span className="font-mono text-[10px] text-violet-500 font-semibold uppercase">
              {stats.activeRoadmaps} Roadmap{stats.activeRoadmaps !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Career Guide AI & voice channel ready
          </p>
        </motion.div>
      </div>

      {/* Featured Hub: Career Guide AI & Interactive Voice Agent */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="relative border border-border bg-gradient-to-r from-card via-card to-card/90 p-6 sm:p-7 rounded-none shadow-sm overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-emerald-500 to-amber-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Two-Way Voice Agent Active
              </span>
              <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-1.5 py-0.5 bg-background">
                English &amp; हिंदी
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Career Guide AI &amp; Interactive Voice Channel
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Conduct mock interviews, evaluate placement readiness, analyze role skill gaps, and speak directly to your Career Guide in real-time hands-free voice.
              </p>
            </div>

            {/* Quick Prompt Launch Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => router.push("/career-guide?voiceCall=true")}
                className="px-3 py-1.5 text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95 font-semibold"
              >
                <PhoneCall size={12} />
                <span>Start Interactive Voice Call</span>
              </button>
              <button
                onClick={() => router.push("/career-guide?prompt=What roles suit me and what are my skill gaps?")}
                className="px-3 py-1.5 text-xs font-mono border border-border bg-background hover:border-violet-500/40 hover:text-violet-500 hover:bg-muted/40 transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Target size={12} className="text-violet-500" />
                <span>Analyze Skill Gaps</span>
              </button>
              <button
                onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my profile")}
                className="px-3 py-1.5 text-xs font-mono border border-border bg-background hover:border-amber-500/40 hover:text-amber-500 hover:bg-muted/40 transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Compass size={12} className="text-amber-500" />
                <span>Generate Career Roadmap</span>
              </button>
              <button
                onClick={() => router.push("/career-guide?prompt=Review my resume and suggest improvements")}
                className="px-3 py-1.5 text-xs font-mono border border-border bg-background hover:border-indigo-500/40 hover:text-indigo-500 hover:bg-muted/40 transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileText size={12} className="text-indigo-500" />
                <span>Review Resume with AI</span>
              </button>
            </div>
          </div>

          {/* Right CTAs */}
          <div className="flex sm:flex-col gap-2.5 shrink-0 self-start lg:self-center">
            <button
              onClick={() => router.push("/career-guide?voiceCall=true")}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-none flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Voice Call</span>
            </button>
            <button
              onClick={() => router.push("/career-guide")}
              className="px-5 py-2.5 border border-violet-500/40 bg-card hover:bg-violet-500/10 text-foreground font-mono text-xs uppercase tracking-wider font-semibold rounded-none flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Compass size={14} className="text-violet-500" />
              <span>Open Chat</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        
        {/* Left Column: Recent Resumes & Active Roadmaps (2/3 width) */}
        <div className="lg:col-span-2 space-y-7">
          
          {/* Active Career Roadmap Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="border border-border/80 bg-card rounded-none shadow-xs overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-xs bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Compass size={13} />
                </div>
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-foreground">
                  Active Career Roadmap
                </h2>
              </div>
              <button 
                onClick={() => router.push("/career-guide")}
                className="text-xs font-mono text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                All roadmaps ({stats.activeRoadmaps}) <ChevronRight size={13} />
              </button>
            </div>

            {latestRoadmap ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{latestRoadmap.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Target Role: <span className="text-foreground font-semibold">{latestRoadmap.targetRole || "Career Goal"}</span>
                    </p>
                  </div>
                  {latestRoadmap.estimatedWeeks && (
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground w-fit">
                      ~{latestRoadmap.estimatedWeeks} WEEKS
                    </span>
                  )}
                </div>

                {/* Steps progress */}
                {latestRoadmap.steps && latestRoadmap.steps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Curriculum Milestones</span>
                      <span>
                        {latestRoadmap.steps.filter((s: any) => s.status === "done").length} / {latestRoadmap.steps.length} Completed
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted border border-border overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (latestRoadmap.steps.filter((s: any) => s.status === "done").length /
                              latestRoadmap.steps.length) * 100
                          )}%`
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {latestRoadmap.steps.slice(0, 3).map((step: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 bg-background border border-border/70 text-xs">
                          <span className={cn(
                            "w-5 h-5 border flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                            step.status === "done" 
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" 
                              : "border-border text-muted-foreground"
                          )}>
                            {step.status === "done" ? <Check size={11} /> : step.stepNumber}
                          </span>
                          <span className="truncate text-foreground font-medium flex-1">{step.title}</span>
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0 uppercase">
                            {step.status === "done" ? "DONE" : step.status === "in_progress" ? "IN PROGRESS" : "UPCOMING"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => router.push(`/career-guide?roadmap=${latestRoadmap.id}`)}
                  className="w-full py-2 bg-muted/40 hover:bg-muted border border-border font-mono text-xs uppercase tracking-wider text-foreground transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue Learning Path</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
                  <Compass size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">No active learning roadmap yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Ask Career Guide to generate a step-by-step milestone path tailored to your target engineering role.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my dream role")}
                  className="px-4 py-2 border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-xs uppercase tracking-wider hover:bg-violet-500/20 transition-all rounded-none inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} />
                  Generate Roadmap
                </button>
              </div>
            )}
          </motion.div>

          {/* Recent Resumes Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="border border-border/80 bg-card rounded-none shadow-xs overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-xs bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
                  <FileText size={13} />
                </div>
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-foreground">
                  Recent Resumes
                </h2>
              </div>
              <button 
                onClick={() => router.push("/saved-resumes")}
                className="text-xs font-mono text-muted-foreground hover:text-violet-500 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                View all ({stats.totalResumes}) <ChevronRight size={13} />
              </button>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                <div className="h-14 bg-muted/40 border border-border animate-pulse" />
                <div className="h-14 bg-muted/40 border border-border animate-pulse" />
              </div>
            ) : recentResumes.length > 0 ? (
              <div className="divide-y divide-border/70">
                {recentResumes.map((resume) => (
                  <div 
                    key={resume.id}
                    onClick={() => router.push("/saved-resumes")}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-violet-500/[0.03] transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 border border-border/80 bg-background flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-violet-500 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-200">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-violet-500 transition-colors">
                          {resume.title || "Untitled Resume"}
                        </h3>
                        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mt-0.5">
                          <Clock size={11} />
                          <span>Updated {formatDate(resume.updatedAt || resume.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-muted-foreground group-hover:text-violet-500 hidden sm:inline transition-colors">
                        View
                      </span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <div className="w-10 h-10 border border-border bg-card flex items-center justify-center mx-auto text-muted-foreground">
                  <FileText size={18} />
                </div>
                <p className="text-xs font-semibold text-foreground">No resumes created yet</p>
                <button 
                  onClick={() => router.push("/resume")}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-sm shadow-violet-500/20 active:scale-95 rounded-none cursor-pointer"
                >
                  Create Resume
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Master Profile & Autopilots (1/3 width) */}
        <div className="lg:col-span-1 space-y-7">
          
          {/* Master Profile Health & Importer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="border border-border/80 bg-card rounded-none shadow-xs p-5 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />

            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-xs bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
                  <User size={13} />
                </div>
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-foreground">
                  Master Profile
                </h2>
              </div>
              <button 
                onClick={() => router.push("/profile")}
                className="text-xs font-mono text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Edit <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-muted-foreground uppercase">Completeness</span>
                <span className="font-mono text-base font-bold text-foreground">
                  {stats.profileCompleteness}%
                </span>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-2 bg-muted border border-border flex p-0.5">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${stats.profileCompleteness}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className={cn(stats.profileCompleteness >= 80 ? "text-emerald-500" : "text-muted-foreground")} />
                <span>
                  {stats.profileCompleteness >= 80 
                    ? "Ready for high-precision tailoring"
                    : "Add more details to increase match precision"}
                </span>
              </div>

              {/* Profile stats badges */}
              {userProfile && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/60">
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground">
                    {Array.isArray(userProfile.skills) ? userProfile.skills.length : 0} Skills
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground">
                    {Array.isArray(userProfile.experience) ? userProfile.experience.length : 0} Jobs
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground">
                    {Array.isArray(userProfile.projects) ? userProfile.projects.length : 0} Projects
                  </span>
                </div>
              )}

              {/* 1-Click Action to Import / Update */}
              <button
                onClick={() => router.push("/profile")}
                className="w-full py-2 border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 text-foreground text-xs font-mono uppercase tracking-wider transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Upload size={12} className="text-emerald-500" />
                <span>Import from Resume</span>
              </button>
            </div>
          </motion.div>

          {/* Autopilot Agents Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="border border-border/80 bg-card rounded-none flex flex-col shadow-xs"
          >
            <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-xs bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Activity size={13} />
                </div>
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-foreground">
                  Autopilot Agents
                </h2>
              </div>
              <button 
                onClick={() => router.push("/autopilot")}
                className="text-xs font-mono text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Manage <ChevronRight size={13} />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              {recentSchedules.length > 0 ? (
                <div className="space-y-2.5">
                  {recentSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 border border-border/70 hover:border-violet-500/30 bg-background/70 hover:bg-background transition-all duration-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate">{schedule.name}</span>
                        <span className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded-xs font-semibold",
                          schedule.isActive 
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "border border-border bg-muted/60 text-muted-foreground"
                        )}>
                          {schedule.isActive ? "ACTIVE" : "PAUSED"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-mono text-[11px]">
                        {schedule.targetRoles.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <Activity size={22} className="mx-auto text-muted-foreground opacity-40" />
                  <p className="text-xs text-muted-foreground">No autopilot agents created yet.</p>
                </div>
              )}

              <button
                onClick={() => router.push("/autopilot")}
                className="w-full py-2 border border-border hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-500 text-foreground text-xs font-mono uppercase tracking-wider transition-all duration-200 rounded-none flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Configure Autopilot</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
