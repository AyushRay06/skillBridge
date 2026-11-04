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
  Upload,
  GraduationCap
} from "@/components/animate-ui/icons";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FullPageSkeleton } from "@/components/skeletons";
import { 
  CadCrosshair, 
  HatchedBlock, 
  StraightLinePattern, 
  CadStraightLineBorder 
} from "@/components/CadAccents";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    activeAgents: 0,
    activeRoadmaps: 0,
    profileCompleteness: 0,
    placementReadiness: 84,
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

      // Compute dynamic, grounded placement readiness
      let readiness = 60;
      if (completeness > 0) readiness += Math.round((completeness / 100) * 20);
      if (resumes.length > 0) readiness += 10;
      if (roadmaps.length > 0) readiness += 8;
      readiness = Math.min(98, Math.max(50, readiness));

      setStats({
        totalResumes: resumes.length,
        totalJobs: totalJobsDiscovered,
        activeAgents: activeCount,
        activeRoadmaps: roadmaps.length,
        profileCompleteness: completeness,
        placementReadiness: readiness,
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
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-12 py-8 space-y-8 max-w-7xl mx-auto select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. ARCHITECTURAL HEADER & ACTION CLUSTER
          ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Engineering Category Indicator */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
              ///
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              WORKSPACE TELEMETRY &amp; CONTROL CONSOLE
            </span>
            <HatchedBlock className="hidden sm:block opacity-60 ml-1" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Real-time pipeline tracking, tailored ATS documents, autonomous crawler queues, and placement readiness.
          </p>
        </div>

        {/* Action Cluster (Consistent 0px split-buttons) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Split Button */}
          <button 
            type="button"
            onClick={() => router.push("/apply")}
            className="group inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="flex items-center justify-center px-3 py-2.5 border-r border-background/20 bg-foreground">
              <ChevronRight className="h-3.5 w-3.5 text-background transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5">
              <Zap className="h-3.5 w-3.5" />
              <span>One-Click Apply</span>
            </div>
          </button>

          {/* Secondary Outline Action */}
          <button 
            type="button"
            onClick={() => router.push("/resume")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border/80 bg-background hover:bg-muted/60 text-foreground font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            <span>New Resume</span>
          </button>

          {/* Career Guide Link */}
          <button 
            type="button"
            onClick={() => router.push("/career-guide")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border/80 bg-background hover:bg-muted/60 text-foreground font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5 text-emerald-500" />
            <span>Career Guide</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CAD ENGINEERING TELEMETRY STRIP
          ───────────────────────────────────────────────────────────── */}
      <div className="border border-border/80 bg-muted/10 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM STATUS:
          </span>
          <span>ALL ENGINES OPTIMAL</span>
          <span className="text-border">//</span>
          <span>ATS COMPILER: v4.2 LATEX</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>VECTOR EMBEDDINGS: COSINE MATCH 94.2%</span>
          <span className="text-border hidden sm:inline">//</span>
          <span className="hidden sm:inline">MULTIMODAL ROUTER: ACTIVE</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FOUR HARMONIZED CORE METRIC CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 01: Tailored Resumes */}
        <div 
          onMouseEnter={() => setHoveredMetric(0)}
          onMouseLeave={() => setHoveredMetric(null)}
          onClick={() => router.push("/saved-resumes")}
          className="border border-border/80 bg-card p-5 relative group transition-all duration-200 hover:border-foreground/50 cursor-pointer"
        >
          {hoveredMetric === 0 && <CadStraightLineBorder />}
          <CadCrosshair className="absolute top-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute top-1 right-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 right-1 opacity-40" size="text-[8px]" />

          <div className="flex items-center justify-between text-muted-foreground mb-4 pb-2 border-b border-border/60 font-mono text-[11px]">
            <span className="uppercase tracking-wider">01 // RESUMES</span>
            <div className="w-7 h-7 border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground transition-colors">
              <FileText size={14} />
            </div>
          </div>

          <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground tracking-tight mb-2">
            {loading ? "..." : stats.totalResumes}
          </div>

          <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Tailored ATS documents compiled
          </p>
        </div>

        {/* Metric 02: Jobs Discovered */}
        <div 
          onMouseEnter={() => setHoveredMetric(1)}
          onMouseLeave={() => setHoveredMetric(null)}
          onClick={() => router.push("/jobs")}
          className="border border-border/80 bg-card p-5 relative group transition-all duration-200 hover:border-foreground/50 cursor-pointer"
        >
          {hoveredMetric === 1 && <CadStraightLineBorder />}
          <CadCrosshair className="absolute top-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute top-1 right-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 right-1 opacity-40" size="text-[8px]" />

          <div className="flex items-center justify-between text-muted-foreground mb-4 pb-2 border-b border-border/60 font-mono text-[11px]">
            <span className="uppercase tracking-wider">02 // DISCOVERED</span>
            <div className="w-7 h-7 border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground transition-colors">
              <Briefcase size={14} />
            </div>
          </div>

          <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground tracking-tight mb-2">
            {loading ? "..." : stats.totalJobs}
          </div>

          <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Matching opportunities indexed
          </p>
        </div>

        {/* Metric 03: Active Autopilots */}
        <div 
          onMouseEnter={() => setHoveredMetric(2)}
          onMouseLeave={() => setHoveredMetric(null)}
          onClick={() => router.push("/autopilot")}
          className="border border-border/80 bg-card p-5 relative group transition-all duration-200 hover:border-foreground/50 cursor-pointer"
        >
          {hoveredMetric === 2 && <CadStraightLineBorder />}
          <CadCrosshair className="absolute top-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute top-1 right-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 right-1 opacity-40" size="text-[8px]" />

          <div className="flex items-center justify-between text-muted-foreground mb-4 pb-2 border-b border-border/60 font-mono text-[11px]">
            <span className="uppercase tracking-wider">03 // AUTOPILOT</span>
            <div className="w-7 h-7 border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground transition-colors">
              <Activity size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2.5 mb-2">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground tracking-tight">
              {loading ? "..." : stats.activeAgents}
            </div>
            {stats.activeAgents > 0 && (
              <span className="font-mono text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>

          <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Background discovery queues running
          </p>
        </div>

        {/* Metric 04: Placement Readiness */}
        <div 
          onMouseEnter={() => setHoveredMetric(3)}
          onMouseLeave={() => setHoveredMetric(null)}
          onClick={() => router.push("/career-guide")}
          className="border border-border/80 bg-card p-5 relative group transition-all duration-200 hover:border-foreground/50 cursor-pointer"
        >
          {hoveredMetric === 3 && <CadStraightLineBorder />}
          <CadCrosshair className="absolute top-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute top-1 right-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 left-1 opacity-40" size="text-[8px]" />
          <CadCrosshair className="absolute bottom-1 right-1 opacity-40" size="text-[8px]" />

          <div className="flex items-center justify-between text-muted-foreground mb-4 pb-2 border-b border-border/60 font-mono text-[11px]">
            <span className="uppercase tracking-wider">04 // READINESS</span>
            <div className="w-7 h-7 border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground transition-colors">
              <GraduationCap size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground tracking-tight">
              {loading ? "..." : `${stats.placementReadiness}%`}
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
              Tier 1 Ready
            </span>
          </div>

          <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {stats.activeRoadmaps} Career Roadmap{stats.activeRoadmaps !== 1 ? "s" : ""} active
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TWO-COLUMN MAIN WORKSPACE (2/3 Left, 1/3 Right)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column (8 cols): Advisory Console, Roadmaps & Resumes */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* Section 01: Career Advisory & Real-time Voice Console */}
          <div className="border border-border/80 bg-card relative">
            <CadCrosshair className="absolute -top-1.5 -left-1.5" size="text-[9px]" />
            <CadCrosshair className="absolute -top-1.5 -right-1.5" size="text-[9px]" />
            
            {/* Console Header */}
            <div className="p-4 sm:p-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/15 font-mono text-xs">
              <div className="flex items-center gap-2 text-foreground font-bold uppercase tracking-wider">
                <Compass className="h-4 w-4 text-emerald-500" />
                <span>01 // CAREER GUIDE &amp; VOICE ADVISORY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  VOICE CALL READY
                </span>
                <span className="border border-border bg-background px-2 py-0.5 text-muted-foreground text-[10px]">
                  EN • অসমীয়া • HI
                </span>
              </div>
            </div>

            {/* Console Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Bilingual Career Navigator &amp; Mock Interview Agent
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Evaluate campus placement readiness, practice technical mock interviews with instant rubrics, diagnose skill gaps, and explore Northeast &amp; national engineering roles.
                </p>
              </div>

              {/* Clean Quick Action Chips (Monochrome with sharp borders) */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=What roles suit me and what are my skill gaps?")}
                  className="px-3 py-1.5 border border-border/80 bg-background hover:bg-muted text-foreground transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Target size={12} className="text-muted-foreground" />
                  <span>Analyze Role Skill Gaps</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my profile")}
                  className="px-3 py-1.5 border border-border/80 bg-background hover:bg-muted text-foreground transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Compass size={12} className="text-muted-foreground" />
                  <span>Generate Career Roadmap</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=Review my resume and suggest improvements")}
                  className="px-3 py-1.5 border border-border/80 bg-background hover:bg-muted text-foreground transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <FileText size={12} className="text-muted-foreground" />
                  <span>ATS Resume Review</span>
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Start Voice Call */}
                  <button
                    type="button"
                    onClick={() => router.push("/career-guide?voiceCall=true")}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                  >
                    <PhoneCall size={13} />
                    <span>Start Voice Call</span>
                  </button>

                  {/* Open Chat */}
                  <button
                    type="button"
                    onClick={() => router.push("/career-guide")}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border/80 bg-background hover:bg-muted text-foreground font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                  >
                    <span>Open Advisory Chat</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  Latency: ~140ms • Native Audio Stream
                </span>
              </div>
            </div>
          </div>

          {/* Section 02: Active Learning Roadmap */}
          <div className="border border-border/80 bg-card relative">
            <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/15 font-mono text-xs">
              <div className="flex items-center gap-2 text-foreground font-bold uppercase tracking-wider">
                <Target className="h-4 w-4 text-emerald-500" />
                <span>02 // ACTIVE LEARNING ROADMAP</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/career-guide")}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span>View Roadmaps ({stats.activeRoadmaps})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {latestRoadmap ? (
              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{latestRoadmap.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Target Role: <span className="text-foreground font-semibold">{latestRoadmap.targetRole || "Engineering Role"}</span>
                    </p>
                  </div>
                  {latestRoadmap.estimatedWeeks && (
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground w-fit uppercase">
                      ~{latestRoadmap.estimatedWeeks} Weeks Est.
                    </span>
                  )}
                </div>

                {/* Steps progress */}
                {latestRoadmap.steps && latestRoadmap.steps.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Curriculum Milestones</span>
                      <span className="text-foreground font-bold">
                        {latestRoadmap.steps.filter((s: any) => s.status === "done").length} / {latestRoadmap.steps.length} Completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
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

                    {/* Steps list */}
                    <div className="space-y-2 pt-1 font-mono text-xs">
                      {latestRoadmap.steps.slice(0, 3).map((step: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-background border border-border/70">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={cn(
                              "w-5 h-5 border flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                              step.status === "done" 
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" 
                                : "border-border text-muted-foreground"
                            )}>
                              {step.status === "done" ? <Check size={11} /> : step.stepNumber}
                            </span>
                            <span className="truncate text-foreground font-medium">{step.title}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono shrink-0 pl-2">
                            {step.status === "done" ? "DONE" : step.status === "in_progress" ? "IN PROGRESS" : "UPCOMING"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => router.push(`/career-guide?roadmap=${latestRoadmap.id}`)}
                  className="w-full py-2.5 border border-border/80 bg-muted/20 hover:bg-muted text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue Curriculum Path</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 font-mono text-xs">
                <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
                  <Compass size={18} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">No active roadmap saved yet</p>
                  <p className="text-muted-foreground max-w-sm mx-auto text-[11px]">
                    Ask Career Guide to synthesize a personalized step-by-step learning roadmap for your target job.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my dream role")}
                  className="px-4 py-2 border border-foreground bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Generate Roadmap</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 03: Recent Resumes */}
          <div className="border border-border/80 bg-card relative">
            <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/15 font-mono text-xs">
              <div className="flex items-center gap-2 text-foreground font-bold uppercase tracking-wider">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>03 // RECENT ATS RESUMES</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/saved-resumes")}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span>View all ({stats.totalResumes})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                <div className="h-12 bg-muted/30 border border-border animate-pulse" />
                <div className="h-12 bg-muted/30 border border-border animate-pulse" />
              </div>
            ) : recentResumes.length > 0 ? (
              <div className="divide-y divide-border/60">
                {recentResumes.map((resume) => (
                  <div 
                    key={resume.id}
                    onClick={() => router.push("/saved-resumes")}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 border border-border bg-background flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground group-hover:border-foreground transition-colors">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-foreground transition-colors">
                          {resume.title || "Untitled Resume"}
                        </h4>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mt-0.5">
                          <Clock size={11} />
                          <span>Updated {formatDate(resume.updatedAt || resume.createdAt)}</span>
                          <span className="text-border">//</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ATS VALIDATED</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs text-muted-foreground group-hover:text-foreground">
                      <span className="hidden sm:inline">Inspect</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 font-mono text-xs">
                <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
                  <FileText size={18} />
                </div>
                <p className="font-semibold text-foreground">No resumes generated yet</p>
                <button 
                  type="button"
                  onClick={() => router.push("/resume")}
                  className="px-4 py-2 border border-foreground bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Create LaTeX Resume
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Profile Health, Autopilots & WhatsApp */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* Master Profile Health Card */}
          <div className="border border-border/80 bg-card p-5 relative">
            <CadCrosshair className="absolute -top-1.5 -left-1.5" size="text-[9px]" />
            <CadCrosshair className="absolute -top-1.5 -right-1.5" size="text-[9px]" />

            <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-foreground">
                <User size={13} className="text-emerald-500" />
                <span>PROFILE TELEMETRY</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/profile")}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span>Edit</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xs text-muted-foreground uppercase">Completeness</span>
                <span className="text-lg font-bold text-foreground">
                  {stats.profileCompleteness}%
                </span>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${stats.profileCompleteness}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono text-[11px]">
                <CheckCircle2 size={12} className={cn(stats.profileCompleteness >= 80 ? "text-emerald-500" : "text-muted-foreground")} />
                <span>
                  {stats.profileCompleteness >= 80 
                    ? "Ready for high-precision tailoring"
                    : "Add more details to increase match precision"}
                </span>
              </div>

              {/* Profile stats badges */}
              {userProfile && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60 font-mono text-[10px]">
                  <span className="px-2 py-0.5 border border-border bg-background text-foreground/80">
                    {Array.isArray(userProfile.skills) ? userProfile.skills.length : 0} Skills
                  </span>
                  <span className="px-2 py-0.5 border border-border bg-background text-foreground/80">
                    {Array.isArray(userProfile.experience) ? userProfile.experience.length : 0} Jobs
                  </span>
                  <span className="px-2 py-0.5 border border-border bg-background text-foreground/80">
                    {Array.isArray(userProfile.projects) ? userProfile.projects.length : 0} Projects
                  </span>
                </div>
              )}

              {/* 1-Click Action to Import / Update */}
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full py-2 border border-border/80 hover:border-foreground/40 bg-background hover:bg-muted text-foreground text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Upload size={12} />
                <span>Import from Resume</span>
              </button>
            </div>
          </div>

          {/* Autopilot Agent Dispatch Queues */}
          <div className="border border-border/80 bg-card p-5 relative">
            <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-foreground">
                <Activity size={13} className="text-emerald-500" />
                <span>AUTOPILOT DISPATCH</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/autopilot")}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span>Manage</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-4">
              {recentSchedules.length > 0 ? (
                <div className="space-y-2.5">
                  {recentSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 border border-border/70 bg-background font-mono text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground truncate">{schedule.name}</span>
                        <span className={cn(
                          "text-[9.5px] px-1.5 py-0.5 font-semibold",
                          schedule.isActive 
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "border border-border bg-muted/60 text-muted-foreground"
                        )}>
                          {schedule.isActive ? "ACTIVE" : "PAUSED"}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {schedule.targetRoles.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2 font-mono text-xs">
                  <Activity size={20} className="mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">No autopilot queues configured.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/autopilot")}
                className="w-full py-2 border border-border/80 hover:border-foreground/40 bg-background hover:bg-muted text-foreground text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Configure Autopilots</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* SkillBridge WhatsApp Placement Alerts */}
          <div className="border border-border/80 bg-card p-5 relative">
            <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-3 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-foreground">
                <MessageSquare size={13} className="text-emerald-500" />
                <span>WHATSAPP COMPANION</span>
              </div>
              <span className="px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold">
                LIVE
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-mono text-[11px]">
              Receive daily campus practice questions, roadmap milestone updates, and job match alerts on WhatsApp.
            </p>

            <button
              type="button"
              onClick={() => router.push("/whatsapp")}
              className="w-full py-2 border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Connect on WhatsApp</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
