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

      // Compute dynamic placement readiness
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
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-7 space-y-7 max-w-7xl mx-auto">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CLEAN MODERN HEADER & ACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your resumes, active job applications, and placement readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            type="button"
            onClick={() => router.push("/apply")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all rounded-md shadow-xs cursor-pointer active:scale-98"
          >
            <Zap size={14} />
            <span>One-Click Apply</span>
          </button>

          <button 
            type="button"
            onClick={() => router.push("/resume")}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all rounded-md cursor-pointer active:scale-98"
          >
            <Plus size={14} className="text-muted-foreground" />
            <span>New Resume</span>
          </button>

          <button 
            type="button"
            onClick={() => router.push("/career-guide")}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all rounded-md cursor-pointer active:scale-98"
          >
            <Compass size={14} className="text-emerald-500" />
            <span>Career Guide</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FOUR CLEAN METRIC CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 01: Tailored Resumes */}
        <div 
          onClick={() => router.push("/saved-resumes")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Resumes</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <FileText size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono mb-1">
            {loading ? "..." : stats.totalResumes}
          </div>
          <p className="text-xs text-muted-foreground">Tailored ATS documents created</p>
        </div>

        {/* Metric 02: Jobs Discovered */}
        <div 
          onClick={() => router.push("/jobs")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Jobs Discovered</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <Briefcase size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono mb-1">
            {loading ? "..." : stats.totalJobs}
          </div>
          <p className="text-xs text-muted-foreground">Matching opportunities indexed</p>
        </div>

        {/* Metric 03: Active Autopilots */}
        <div 
          onClick={() => router.push("/autopilot")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Autopilots</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <Activity size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {loading ? "..." : stats.activeAgents}
            </div>
            {stats.activeAgents > 0 && (
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Background search agents running</p>
        </div>

        {/* Metric 04: Placement Readiness */}
        <div 
          onClick={() => router.push("/career-guide")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Placement Readiness</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <GraduationCap size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {loading ? "..." : `${stats.placementReadiness}%`}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono uppercase">
              Tier 1 Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.activeRoadmaps} Career Roadmap{stats.activeRoadmaps !== 1 ? "s" : ""} active
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN TWO-COLUMN WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column (8 cols): Career Guide, Roadmaps & Resumes */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* Career Guide & Voice Advisory Hub */}
          <div className="border border-border/80 bg-card rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-500" />
                  <span>Career Guide &amp; Voice Advisory</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bilingual career consulting, placement readiness audits, and real-time mock interviews.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Voice Call Ready</span>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => router.push("/career-guide?prompt=What roles suit me and what are my skill gaps?")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Target size={12} className="text-muted-foreground" />
                <span>Analyze Skill Gaps</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my profile")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Compass size={12} className="text-muted-foreground" />
                <span>Generate Career Roadmap</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/career-guide?prompt=Review my resume and suggest improvements")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={12} className="text-muted-foreground" />
                <span>ATS Resume Review</span>
              </button>
            </div>

            {/* Actions Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/career-guide?voiceCall=true")}
                className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <PhoneCall size={13} />
                <span>Start Voice Call</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/career-guide")}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <span>Open Advisory Chat</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Active Learning Roadmap */}
          <div className="border border-border/80 bg-card rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider">
                <Target size={14} className="text-emerald-500" />
                <span>Active Learning Roadmap</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/career-guide")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>All roadmaps ({stats.activeRoadmaps})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {latestRoadmap ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{latestRoadmap.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Target Role: <span className="text-foreground font-medium">{latestRoadmap.targetRole || "Engineering Role"}</span>
                    </p>
                  </div>
                  {latestRoadmap.estimatedWeeks && (
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground rounded-md w-fit">
                      ~{latestRoadmap.estimatedWeeks} Weeks
                    </span>
                  )}
                </div>

                {latestRoadmap.steps && latestRoadmap.steps.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Curriculum Milestones</span>
                      <span className="text-foreground font-medium font-mono text-[11px]">
                        {latestRoadmap.steps.filter((s: any) => s.status === "done").length} / {latestRoadmap.steps.length} Completed
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                        style={{
                          width: `${Math.round(
                            (latestRoadmap.steps.filter((s: any) => s.status === "done").length /
                              latestRoadmap.steps.length) * 100
                          )}%`
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs">
                      {latestRoadmap.steps.slice(0, 3).map((step: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background border border-border/70 rounded-md">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                              step.status === "done" 
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {step.status === "done" ? <Check size={11} /> : step.stepNumber}
                            </span>
                            <span className="truncate text-foreground font-medium">{step.title}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono shrink-0 pl-2">
                            {step.status === "done" ? "Done" : step.status === "in_progress" ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => router.push(`/career-guide?roadmap=${latestRoadmap.id}`)}
                  className="w-full py-2 border border-border bg-muted/30 hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue Curriculum Path</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2.5 text-xs">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Compass size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">No active roadmap saved</p>
                  <p className="text-muted-foreground text-xs">
                    Synthesize a step-by-step learning roadmap tailored to your target role.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my dream role")}
                  className="px-3.5 py-1.5 bg-foreground text-background text-xs font-semibold rounded-md hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer mt-1"
                >
                  <Sparkles size={12} />
                  <span>Generate Roadmap</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Resumes */}
          <div className="border border-border/80 bg-card rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider">
                <FileText size={14} className="text-emerald-500" />
                <span>Recent Resumes</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/saved-resumes")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View all ({stats.totalResumes})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {loading ? (
              <div className="p-5 space-y-2">
                <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
                <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
              </div>
            ) : recentResumes.length > 0 ? (
              <div className="divide-y divide-border/60">
                {recentResumes.map((resume) => (
                  <div 
                    key={resume.id}
                    onClick={() => router.push("/saved-resumes")}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm text-foreground truncate">
                          {resume.title || "Untitled Resume"}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <Clock size={11} />
                          <span>Updated {formatDate(resume.updatedAt || resume.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground group-hover:text-foreground">
                      <span className="hidden sm:inline">Inspect</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 text-xs">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <FileText size={18} />
                </div>
                <p className="font-semibold text-foreground">No resumes created yet</p>
                <button 
                  type="button"
                  onClick={() => router.push("/resume")}
                  className="px-3.5 py-1.5 bg-foreground text-background text-xs font-semibold rounded-md hover:bg-foreground/90 transition-colors cursor-pointer mt-1"
                >
                  Create Resume
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Profile, Autopilots & WhatsApp */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* Master Profile Health Card */}
          <div className="border border-border/80 bg-card rounded-lg p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-foreground">
                <User size={14} className="text-emerald-500" />
                <span>Master Profile</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/profile")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Edit</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Completeness</span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {stats.profileCompleteness}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${stats.profileCompleteness}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className={cn(stats.profileCompleteness >= 80 ? "text-emerald-500" : "text-muted-foreground")} />
                <span>
                  {stats.profileCompleteness >= 80 
                    ? "Ready for high-precision tailoring"
                    : "Complete profile to improve match scoring"}
                </span>
              </div>

              {userProfile && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/60 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {Array.isArray(userProfile.skills) ? userProfile.skills.length : 0} Skills
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {Array.isArray(userProfile.experience) ? userProfile.experience.length : 0} Jobs
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {Array.isArray(userProfile.projects) ? userProfile.projects.length : 0} Projects
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Upload size={12} />
                <span>Import from Resume</span>
              </button>
            </div>
          </div>

          {/* Autopilot Agent Queues */}
          <div className="border border-border/80 bg-card rounded-lg p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-foreground">
                <Activity size={14} className="text-emerald-500" />
                <span>Autopilot Agents</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/autopilot")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Manage</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {recentSchedules.length > 0 ? (
                <div className="space-y-2">
                  {recentSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-2.5 border border-border/70 rounded-md bg-background text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground truncate">{schedule.name}</span>
                        <span className={cn(
                          "text-[9.5px] px-1.5 py-0.5 rounded-sm font-semibold font-mono",
                          schedule.isActive 
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "border border-border bg-muted text-muted-foreground"
                        )}>
                          {schedule.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {schedule.targetRoles.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 space-y-1 text-xs">
                  <Activity size={18} className="mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">No autopilot queues created yet.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/autopilot")}
                className="w-full py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Configure Autopilots</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* SkillBridge WhatsApp Alerts */}
          <div className="border border-border/80 bg-card rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-foreground">
                <MessageSquare size={14} className="text-emerald-500" />
                <span>WhatsApp Alerts</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold font-mono">
                Live
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Get daily placement practice questions, roadmap milestone updates, and job alerts directly on WhatsApp.
            </p>

            <button
              type="button"
              onClick={() => router.push("/whatsapp")}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
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
