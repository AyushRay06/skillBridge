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
import { getCached, setCache } from "@/lib/clientCache";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";
import { LandingLanguageToggle } from "@/components/LandingLanguageToggle";
import { DASHBOARD_TRANSLATIONS } from "@/lib/dashboardTranslations";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { lang } = useLandingLanguage();
  const dt = DASHBOARD_TRANSLATIONS[lang] || DASHBOARD_TRANSLATIONS.en;
  const [mounted, setMounted] = useState(false);

  const [stats, setStats] = useState(() => {
    const cached = getCached<any>("dashboard_cache", 180_000);
    return cached?.stats || {
      totalResumes: 0,
      totalJobs: 0,
      activeAgents: 0,
      activeRoadmaps: 0,
      profileCompleteness: 0,
      placementReadiness: 84,
    };
  });
  const [recentResumes, setRecentResumes] = useState<any[]>(() => {
    const cached = getCached<any>("dashboard_cache", 180_000);
    return cached?.recentResumes || [];
  });
  const [recentSchedules, setRecentSchedules] = useState<any[]>(() => {
    const cached = getCached<any>("dashboard_cache", 180_000);
    return cached?.recentSchedules || [];
  });
  const [latestRoadmap, setLatestRoadmap] = useState<any | null>(() => {
    const cached = getCached<any>("dashboard_cache", 180_000);
    return cached?.latestRoadmap || null;
  });
  const [userProfile, setUserProfile] = useState<any | null>(() => {
    const cached = getCached<any>("dashboard_cache", 180_000);
    return cached?.userProfile || null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return !getCached<any>("dashboard_cache", 180_000);
  });

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
      if (!getCached("dashboard_cache", 180_000)) {
        setLoading(true);
      }

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

      const calculatedStats = {
        totalResumes: resumes.length,
        totalJobs: totalJobsDiscovered,
        activeAgents: activeCount,
        activeRoadmaps: roadmaps.length,
        profileCompleteness: completeness,
        placementReadiness: readiness,
      };

      const slicedResumes = resumes.slice(0, 5);
      const slicedSchedules = schedules.slice(0, 3);
      const topRoadmap = roadmaps[0] || null;

      setStats(calculatedStats);
      setRecentResumes(slicedResumes);
      setRecentSchedules(slicedSchedules);
      setLatestRoadmap(topRoadmap);
      setUserProfile(profile);

      setCache("dashboard_cache", {
        stats: calculatedStats,
        recentResumes: slicedResumes,
        recentSchedules: slicedSchedules,
        latestRoadmap: topRoadmap,
        userProfile: profile,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) return <FullPageSkeleton />;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === "as" ? "as-IN" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-7 space-y-7 max-w-7xl mx-auto">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CLEAN MODERN HEADER & ACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {dt.header.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {dt.header.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <LandingLanguageToggle variant="pill" className="rounded-md h-8 text-xs border-border bg-card" />

          <button 
            type="button"
            onClick={() => router.push("/apply")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all rounded-md shadow-xs cursor-pointer active:scale-98"
          >
            <Zap size={14} />
            <span>{dt.header.oneClickApply}</span>
          </button>

          <button 
            type="button"
            onClick={() => router.push("/resume")}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all rounded-md cursor-pointer active:scale-98"
          >
            <Plus size={14} className="text-muted-foreground" />
            <span>{dt.header.newResume}</span>
          </button>

          <button 
            type="button"
            onClick={() => router.push("/career-guide")}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all rounded-md cursor-pointer active:scale-98"
          >
            <Compass size={14} className="text-emerald-500" />
            <span>{dt.header.careerGuide}</span>
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
            <span className="text-xs font-medium uppercase tracking-wider">{dt.metrics.totalResumes}</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <FileText size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono mb-1">
            {loading ? "..." : stats.totalResumes}
          </div>
          <p className="text-xs text-muted-foreground">{dt.metrics.totalResumesDesc}</p>
        </div>

        {/* Metric 02: Jobs Discovered */}
        <div 
          onClick={() => router.push("/jobs")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{dt.metrics.jobsDiscovered}</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <Briefcase size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono mb-1">
            {loading ? "..." : stats.totalJobs}
          </div>
          <p className="text-xs text-muted-foreground">{dt.metrics.jobsDiscoveredDesc}</p>
        </div>

        {/* Metric 03: Active Autopilots */}
        <div 
          onClick={() => router.push("/autopilot")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{dt.metrics.activeAutopilots}</span>
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
                {dt.metrics.live}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{dt.metrics.activeAutopilotsDesc}</p>
        </div>

        {/* Metric 04: Placement Readiness */}
        <div 
          onClick={() => router.push("/career-guide")}
          className="border border-border/70 bg-card p-5 rounded-lg hover:border-border hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{dt.metrics.placementReadiness}</span>
            <div className="w-8 h-8 rounded-md bg-muted/70 flex items-center justify-center text-foreground group-hover:text-foreground transition-colors">
              <GraduationCap size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {loading ? "..." : `${stats.placementReadiness}%`}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono uppercase">
              {dt.metrics.tier1Ready}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {dt.metrics.roadmapsActive(stats.activeRoadmaps)}
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
                  <span>{dt.careerGuideHub.title}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dt.careerGuideHub.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{dt.careerGuideHub.voiceReady}</span>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => router.push(lang === "as" ? "/career-guide?prompt=মোৰ বাবে কি কি পদ উপযুক্ত আৰু মোৰ দক্ষতাৰ ব্যৱধান কি কি?" : "/career-guide?prompt=What roles suit me and what are my skill gaps?")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Target size={12} className="text-muted-foreground" />
                <span>{dt.careerGuideHub.prompts.skillGaps}</span>
              </button>
              <button
                type="button"
                onClick={() => router.push(lang === "as" ? "/career-guide?prompt=মোৰ প্ৰফাইলৰ বাবে এটা ধাপে ধাপে কেৰিয়াৰ ৰোডমেপ বনাওক" : "/career-guide?prompt=Make me a step-by-step career roadmap for my profile")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Compass size={12} className="text-muted-foreground" />
                <span>{dt.careerGuideHub.prompts.roadmap}</span>
              </button>
              <button
                type="button"
                onClick={() => router.push(lang === "as" ? "/career-guide?prompt=মোৰ ৰিজ্যুমে পৰীক্ষা কৰক আৰু পৰামৰ্শ দিয়ক" : "/career-guide?prompt=Review my resume and suggest improvements")}
                className="px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={12} className="text-muted-foreground" />
                <span>{dt.careerGuideHub.prompts.resumeReview}</span>
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
                <span>{dt.careerGuideHub.startVoiceCall}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/career-guide")}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <span>{dt.careerGuideHub.openChat}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Active Learning Roadmap */}
          <div className="border border-border/80 bg-card rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider">
                <Target size={14} className="text-emerald-500" />
                <span>{dt.roadmap.sectionTitle}</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/career-guide")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{dt.roadmap.allRoadmaps(stats.activeRoadmaps)}</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {latestRoadmap ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{latestRoadmap.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {dt.roadmap.targetRoleLabel}: <span className="text-foreground font-medium">{latestRoadmap.targetRole || dt.roadmap.defaultRole}</span>
                    </p>
                  </div>
                  {latestRoadmap.estimatedWeeks && (
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-background text-muted-foreground rounded-md w-fit">
                      {dt.roadmap.weeks(latestRoadmap.estimatedWeeks)}
                    </span>
                  )}
                </div>

                {latestRoadmap.steps && latestRoadmap.steps.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{dt.roadmap.curriculumMilestones}</span>
                      <span className="text-foreground font-medium font-mono text-[11px]">
                        {dt.roadmap.completedCount(
                          latestRoadmap.steps.filter((s: any) => s.status === "done").length,
                          latestRoadmap.steps.length
                        )}
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
                            {step.status === "done" ? dt.roadmap.stepStatus.done : step.status === "in_progress" ? dt.roadmap.stepStatus.inProgress : dt.roadmap.stepStatus.upcoming}
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
                  <span>{dt.roadmap.continuePath}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2.5 text-xs">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Compass size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{dt.roadmap.emptyTitle}</p>
                  <p className="text-muted-foreground text-xs">
                    {dt.roadmap.emptyDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/career-guide?prompt=Make me a step-by-step career roadmap for my dream role")}
                  className="px-3.5 py-1.5 bg-foreground text-background text-xs font-semibold rounded-md hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer mt-1"
                >
                  <Sparkles size={12} />
                  <span>{dt.roadmap.generateRoadmap}</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Resumes */}
          <div className="border border-border/80 bg-card rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider">
                <FileText size={14} className="text-emerald-500" />
                <span>{dt.recentResumes.sectionTitle}</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/saved-resumes")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{dt.recentResumes.viewAll(stats.totalResumes)}</span>
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
                          {resume.title || dt.recentResumes.untitled}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <Clock size={11} />
                          <span>{dt.recentResumes.updated(formatDate(resume.updatedAt || resume.createdAt))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground group-hover:text-foreground">
                      <span className="hidden sm:inline">{dt.recentResumes.inspect}</span>
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
                <p className="font-semibold text-foreground">{dt.recentResumes.emptyTitle}</p>
                <button 
                  type="button"
                  onClick={() => router.push("/resume")}
                  className="px-3.5 py-1.5 bg-foreground text-background text-xs font-semibold rounded-md hover:bg-foreground/90 transition-colors cursor-pointer mt-1"
                >
                  {dt.recentResumes.createResume}
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
                <span>{dt.profile.sectionTitle}</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/profile")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{dt.profile.edit}</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">{dt.profile.completeness}</span>
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
                    ? dt.profile.readyHint
                    : dt.profile.incompleteHint}
                </span>
              </div>

              {userProfile && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/60 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {dt.profile.skillsCount(Array.isArray(userProfile.skills) ? userProfile.skills.length : 0)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {dt.profile.jobsCount(Array.isArray(userProfile.experience) ? userProfile.experience.length : 0)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-[11px]">
                    {dt.profile.projectsCount(Array.isArray(userProfile.projects) ? userProfile.projects.length : 0)}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Upload size={12} />
                <span>{dt.profile.importFromResume}</span>
              </button>
            </div>
          </div>

          {/* Autopilot Agent Queues */}
          <div className="border border-border/80 bg-card rounded-lg p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-foreground">
                <Activity size={14} className="text-emerald-500" />
                <span>{dt.autopilot.sectionTitle}</span>
              </div>
              <button 
                type="button"
                onClick={() => router.push("/autopilot")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{dt.autopilot.manage}</span>
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
                          {schedule.isActive ? dt.autopilot.active : dt.autopilot.paused}
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
                  <p className="text-muted-foreground">{dt.autopilot.emptyDesc}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/autopilot")}
                className="w-full py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{dt.autopilot.configure}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* SkillBridge WhatsApp Alerts */}
          <div className="border border-border/80 bg-card rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-foreground">
                <MessageSquare size={14} className="text-emerald-500" />
                <span>{dt.whatsapp.sectionTitle}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold font-mono">
                {dt.whatsapp.liveBadge}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {dt.whatsapp.desc}
            </p>

            <button
              type="button"
              onClick={() => router.push("/whatsapp")}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>{dt.whatsapp.connect}</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
