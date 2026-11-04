"use client";

import { useEffect, useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Award,
  Activity,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Trash2,
  Plus,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  X,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
  Terminal,
} from "@/components/animate-ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { FullPageSkeleton, ScheduleGridSkeleton, JobFeedSkeleton } from "@/components/skeletons";
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
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { AutopilotRunOverlay } from "@/components/AutopilotRunOverlay";

interface JobSchedule {
  id: string;
  name: string;
  isActive: boolean;
  cronExpression: string;
  timezone: string;
  targetRoles: string[];
  locations: string[];
  workType: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  postAge: string;
  minMatchScore: number;
  maxApplications: number;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  totalRuns: number;
  totalApplied: number;
  createdAt: string;
  _count?: {
    discoveredJobs: number;
  };
}

interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  url: string | null;
  source: string;
  matchScore: number | null;
  matchReason: string | null;
  status: string;
  postedAt: string | null;
  createdAt: string;
  applicationId: string | null;
  scheduleId: string;
  schedule: {
    name: string;
  };
  description: string;
}

export default function AutopilotDashboard() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"schedules" | "jobs">("schedules");
  
  // Data states
  const [schedules, setSchedules] = useState<JobSchedule[]>([]);
  const [discoveredJobs, setDiscoveredJobs] = useState<DiscoveredJob[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [triggeringScheduleId, setTriggeringScheduleId] = useState<string | null>(null);
  
  // Discovered Jobs pagination and filter states
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [filterScheduleId, setFilterScheduleId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Modal / Form states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<JobSchedule | null>(null);
  
  // Overlay states
  const [overlayState, setOverlayState] = useState<{
    isOpen: boolean;
    scheduleId: string | null;
    scheduleName: string;
    initialLastRunAt: string | null;
  }>({
    isOpen: false,
    scheduleId: null,
    scheduleName: "",
    initialLastRunAt: null,
  });
  
  // Form input states
  const [formName, setFormName] = useState("");
  const [formTargetRolesText, setFormTargetRolesText] = useState("");
  const [formLocationsText, setFormLocationsText] = useState("");
  const [formWorkType, setFormWorkType] = useState("any");
  const [formExperienceLevel, setFormExperienceLevel] = useState("any");
  const [formSalaryMin, setFormSalaryMin] = useState("");
  const [formPostAge, setFormPostAge] = useState("24h");
  const [formMinMatchScore, setFormMinMatchScore] = useState(60);
  const [formMaxApplications, setFormMaxApplications] = useState(5);
  const [formCronPreset, setFormCronPreset] = useState("daily");
  const [formCustomCron, setFormCustomCron] = useState("0 8 * * *");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [shouldRunAfterCreate, setShouldRunAfterCreate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      setCheckingProfile(true);
      const response = await axiosAPI.get("/profile");
      if (response.data.profile) {
        setHasProfile(true);
        fetchSchedules();
      } else {
        setHasProfile(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasProfile(false);
      } else {
        toast.error("Failed to check user profile status.");
        console.error("Profile check error:", error);
      }
    } finally {
      setCheckingProfile(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const response = await axiosAPI.get("/autopilot/schedules");
      setSchedules(response.data.schedules);
    } catch (error: any) {
      toast.error("Failed to fetch autopilot schedules.");
      console.error("Fetch schedules error:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchDiscoveredJobs = async (page = 1, schedId = filterScheduleId, status = filterStatus) => {
    try {
      setLoadingJobs(true);
      const response = await axiosAPI.get("/autopilot/jobs", {
        params: {
          page,
          limit: 15,
          scheduleId: schedId || undefined,
          status: status || undefined,
        },
      });
      setDiscoveredJobs(response.data.jobs);
      setTotalJobsCount(response.data.total);
      setJobsPage(response.data.page);
      setJobsTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error("Failed to fetch discovered jobs.");
      console.error("Fetch jobs error:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (hasProfile) {
      if (activeTab === "jobs") {
        fetchDiscoveredJobs(1);
      } else {
        fetchSchedules();
      }
    }
  }, [activeTab, filterScheduleId, filterStatus]);

  const handleToggleSchedule = async (id: string, currentActive: boolean) => {
    try {
      const response = await axiosAPI.patch(`/autopilot/schedules/${id}/toggle`);
      setSchedules(schedules.map(s => s.id === id ? { ...s, isActive: response.data.schedule.isActive } : s));
      toast.success(response.data.msg);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to update schedule status.");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await axiosAPI.delete(`/autopilot/schedules/${scheduleId}`);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
      toast.success("Schedule deleted successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to delete schedule.");
    }
  };

  const handleManualTrigger = async (id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    try {
      setTriggeringScheduleId(id);
      await axiosAPI.post(`/autopilot/schedules/${id}/run-now`);

      setOverlayState({
        isOpen: true,
        scheduleId: id,
        scheduleName: schedule.name,
        initialLastRunAt: schedule.lastRunAt,
      });

      setSchedules(schedules.map(s => s.id === id ? { 
        ...s, 
        lastRunStatus: "running",
        totalRuns: s.totalRuns + 1
      } : s));
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 403 && data?.isBlocked) {
        toast.error(data.message || "This feature is not available on your current plan.", { duration: 6000 });
        if (data.upgrade) {
          toast(data.upgrade, { icon: "⬆️", duration: 8000 });
        }
      } else if (status === 429) {
        toast.error(data?.message || "You've reached your usage limit. Please try again later.", { duration: 6000 });
        if (data?.suggestion) {
          toast(data.suggestion, { icon: "💡", duration: 8000 });
        }
        if (data?.upgrade) {
          toast(data.upgrade, { icon: "⬆️", duration: 8000 });
        }
      } else {
        toast.error(data?.msg || data?.message || "Failed to trigger autopilot run.");
      }
    } finally {
      setTriggeringScheduleId(null);
    }
  };

  const handleOverlayComplete = () => {
    setOverlayState(prev => ({ ...prev, isOpen: false }));
    toast.success("Autopilot pipeline finished successfully!");
    setActiveTab("jobs");
    setFilterScheduleId(overlayState.scheduleId || "");
  };
  
  const handleOverlayDismiss = () => {
    setOverlayState(prev => ({ ...prev, isOpen: false }));
    toast.success("Pipeline running in background. You can check back later.");
  };

  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setFormName("My Job Autopilot");
    setFormTargetRolesText("Software Engineer, React Developer");
    setFormLocationsText("Remote");
    setFormWorkType("remote");
    setFormExperienceLevel("mid");
    setFormSalaryMin("");
    setFormPostAge("24h");
    setFormMinMatchScore(70);
    setFormMaxApplications(3);
    setFormCronPreset("daily");
    setFormCustomCron("0 8 * * *");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (schedule: JobSchedule) => {
    setEditingSchedule(schedule);
    setFormName(schedule.name);
    setFormTargetRolesText(schedule.targetRoles.join(", "));
    setFormLocationsText(schedule.locations.join(", "));
    setFormWorkType(schedule.workType);
    setFormExperienceLevel(schedule.experienceLevel);
    setFormSalaryMin(schedule.salaryMin ? schedule.salaryMin.toString() : "");
    setFormPostAge(schedule.postAge);
    setFormMinMatchScore(schedule.minMatchScore);
    setFormMaxApplications(schedule.maxApplications);
    
    if (schedule.cronExpression === "0 8 * * *") {
      setFormCronPreset("daily");
    } else if (schedule.cronExpression === "0 */12 * * *") {
      setFormCronPreset("halfday");
    } else if (schedule.cronExpression === "0 0 * * 0") {
      setFormCronPreset("weekly");
    } else {
      setFormCronPreset("custom");
      setFormCustomCron(schedule.cronExpression);
    }
    
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetRoles = formTargetRolesText.split(",").map(t => t.trim()).filter(Boolean);
    const locations = formLocationsText.split(",").map(l => l.trim()).filter(Boolean);
    
    if (targetRoles.length === 0) {
      toast.error("Please provide at least one target role.");
      return;
    }
    if (locations.length === 0) {
      toast.error("Please provide at least one target location.");
      return;
    }

    let cronExpression = "";
    if (formCronPreset === "daily") cronExpression = "0 8 * * *";
    else if (formCronPreset === "halfday") cronExpression = "0 */12 * * *";
    else if (formCronPreset === "weekly") cronExpression = "0 0 * * 0";
    else cronExpression = formCustomCron;

    const payload = {
      name: formName || "My Job Search",
      cronExpression,
      targetRoles,
      locations,
      workType: formWorkType,
      experienceLevel: formExperienceLevel,
      salaryMin: formSalaryMin ? parseInt(formSalaryMin) : null,
      postAge: formPostAge,
      minMatchScore: formMinMatchScore,
      maxApplications: formMaxApplications,
    };

    try {
      setSubmittingForm(true);
      if (editingSchedule) {
        const response = await axiosAPI.put(`/autopilot/schedules/${editingSchedule.id}`, payload);
        toast.success("Schedule updated successfully.");
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? response.data.schedule : s));
      } else {
        const response = await axiosAPI.post("/autopilot/schedules", payload);
        toast.success("Autopilot schedule created successfully.");
        setSchedules([response.data.schedule, ...schedules]);
        
        if (shouldRunAfterCreate) {
          setShouldRunAfterCreate(false);
          const newId = response.data.schedule.id;
          setShowFormModal(false);
          setTimeout(() => handleManualTrigger(newId), 500);
          return;
        }
      }
      setShowFormModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to save schedule.");
      console.error("Save schedule error:", error);
    } finally {
      setSubmittingForm(false);
      setShouldRunAfterCreate(false);
    }
  };

  const handleGenerateDocuments = (job: DiscoveredJob) => {
    if (job.applicationId) {
      toast.success("Opening generated documents");
      router.push(`/apply?id=${job.applicationId}`);
    } else {
      localStorage.setItem("prefilledJobDesc", job.description);
      toast.success("Loading job into document pipeline");
      router.push("/apply");
    }
  };

  const handleGenerateAnyway = (job: DiscoveredJob) => {
    localStorage.setItem("prefilledJobDesc", job.description);
    toast("Generating documents — note this job scored below threshold.", { icon: "⚠️" });
    router.push("/apply");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground bg-muted border-border";
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-rose-500 bg-rose-500/10 border-rose-500/30";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">Applied</span>;
      case "qualified":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">Qualified</span>;
      case "discovered":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-muted text-foreground border border-border">Discovered</span>;
      case "below_threshold":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">Low Score</span>;
      case "skipped":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-muted text-muted-foreground border border-border">Skipped</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-muted text-foreground border border-border">{status}</span>;
    }
  };

  if (checkingProfile) return <FullPageSkeleton />;

  // Profile setup onboarding wall
  if (hasProfile === false) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-xl w-full bg-card border border-border shadow-2xl p-8 rounded-none text-center relative z-10">
          <CardContent className="p-0">
            <div className="w-14 h-14 bg-muted border border-border rounded-none flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-7 h-7 text-foreground" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-2">
              [REQUIREMENT_CHECK_FAILED]
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Master Profile Required
            </h1>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-md mx-auto">
              Autonomous Autopilot requires your master experience, core skills, and preferences to scan job boards, compute match scores, and generate documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-5 py-2.5 border border-border hover:border-foreground/40 bg-card rounded-none font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider rounded-none inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles size={14} />
                Set Up Master Profile
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Statistics summaries
  const totalDiscoveredAcrossSchedules = schedules.reduce((acc, s) => acc + (s._count?.discoveredJobs || 0), 0);
  const totalAppliedAcrossSchedules = schedules.reduce((acc, s) => acc + s.totalApplied, 0);
  const activeSchedulesCount = schedules.filter(s => s.isActive).length;

  return (
    <>
      <div className="w-full min-h-screen bg-transparent px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Header Bar */}
        <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Job Autopilot
                </h1>
                <p className="text-muted-foreground text-xs">
                  Automated background search agents querying job boards and evaluating matches.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {activeTab === "schedules" && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-3.5 py-1.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors rounded-none inline-flex items-center gap-1.5 font-semibold"
                  >
                    <Plus size={13} />
                    New Autopilot
                  </button>
                )}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors rounded-none flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar sharing clean straight borders */}
          <div className="relative border border-border bg-card">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-border">
              <div className="p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">Active Agents</span>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  {activeSchedulesCount}
                  <span className="text-xs text-muted-foreground font-normal">/ {schedules.length}</span>
                </p>
              </div>

              <div className="p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">Total Evaluated</span>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
                  {totalDiscoveredAcrossSchedules}
                </p>
              </div>

              <div className="p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">Generated Matches</span>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
                  {totalAppliedAcrossSchedules}
                </p>
              </div>

              <div className="p-4 flex flex-col justify-between">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">Status</span>
                <p className="font-mono text-sm font-semibold text-foreground">
                  Ready
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border border-border bg-card max-w-sm">
            <button
              onClick={() => setActiveTab("schedules")}
              className={cn(
                "flex-1 py-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 border-r border-border transition-colors",
                activeTab === "schedules" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Clock size={12} />
              Schedules ({schedules.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={cn(
                "flex-1 py-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors",
                activeTab === "jobs" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Award size={12} />
              Discovered Feed
            </button>
          </div>

          {/* Tabs Contents */}
          {activeTab === "schedules" ? (
            loadingSchedules ? (
              <ScheduleGridSkeleton count={4} />
            ) : schedules.length === 0 ? (
              <div className="relative border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 rounded-none">
                <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
                  <Activity size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">No Autopilots Configured</h3>
                  <p className="text-muted-foreground text-xs font-mono max-w-sm mx-auto">
                    Create a schedule to automate background discovery on Remotive and JSearch.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 rounded-none font-semibold"
                >
                  <Plus size={13} />
                  Configure Autopilot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={cn(
                      "relative border bg-card p-5 space-y-4 rounded-none transition-colors",
                      schedule.isActive ? "border-border hover:border-foreground/30" : "border-border/60 opacity-60"
                    )}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-foreground tracking-tight">
                            {schedule.name}
                          </h3>
                          {!schedule.isActive && (
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-none bg-muted text-muted-foreground border border-border">
                              PAUSED
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Clock size={11} className="text-foreground" />
                          <span>{schedule.cronExpression === "0 8 * * *" ? "Daily at 08:00 AM" : schedule.cronExpression === "0 */12 * * *" ? "Every 12 Hours" : `Cron: ${schedule.cronExpression}`}</span>
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSchedule(schedule.id, schedule.isActive)}
                          className={cn(
                            "p-1.5 rounded-none border transition-colors",
                            schedule.isActive 
                              ? "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border" 
                              : "bg-muted text-foreground border-border"
                          )}
                          title={schedule.isActive ? "Pause Autopilot" : "Activate Autopilot"}
                        >
                          {schedule.isActive ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(schedule)}
                          className="p-1.5 rounded-none border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Filters"
                        >
                          <Search size={12} />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-none border border-border bg-card hover:border-destructive/40 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Agent"
                            >
                              <Trash2 size={12} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()} className="rounded-none border border-border bg-card">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-bold">Delete Autopilot Agent?</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                This will permanently remove this autopilot configuration.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="rounded-none border border-border">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={(e) => { e.stopPropagation(); handleDeleteSchedule(schedule.id); }}
                                className="rounded-none bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs uppercase"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Filter Summary Tags */}
                    <div className="space-y-1 text-xs border-b border-border/60 pb-3 font-mono">
                      <div className="truncate">
                        <span className="text-muted-foreground">Roles: </span>
                        <span className="text-foreground">{schedule.targetRoles.join(", ")}</span>
                      </div>
                      <div className="truncate">
                        <span className="text-muted-foreground">Locations: </span>
                        <span className="text-foreground">{schedule.locations.join(", ")}</span>
                      </div>
                      <div className="truncate text-muted-foreground">
                        <span>{schedule.workType} &bull; {schedule.experienceLevel} &bull; Score: &ge;{schedule.minMatchScore}%</span>
                      </div>
                    </div>

                    {/* Autopilot Stats & Trigger Bar */}
                    <div className="flex justify-between items-center bg-muted/20 p-2.5 rounded-none border border-border">
                      <div className="font-mono text-xs">
                        <span className="text-muted-foreground">Discovered: </span>
                        <span className="font-bold text-foreground">{schedule._count?.discoveredJobs || 0}</span>
                      </div>

                      <button
                        onClick={() => handleManualTrigger(schedule.id)}
                        disabled={triggeringScheduleId !== null}
                        className="px-3 py-1 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider rounded-none flex items-center gap-1.5 disabled:opacity-40 transition-colors font-semibold"
                      >
                        {triggeringScheduleId === schedule.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Zap size={11} fill="currentColor" />
                            Run Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Discovered Jobs Feed */
            <div className="space-y-4">
              {/* Filters */}
              <div className="bg-card border border-border p-3 rounded-none flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Autopilot:</span>
                  <select
                    value={filterScheduleId}
                    onChange={(e) => { setFilterScheduleId(e.target.value); setJobsPage(1); }}
                    className="flat-input text-xs px-2.5 py-1 rounded-none border-border"
                  >
                    <option value="">All Autopilots</option>
                    {schedules.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setJobsPage(1); }}
                    className="flat-input text-xs px-2.5 py-1 rounded-none border-border"
                  >
                    <option value="">All Statuses</option>
                    <option value="discovered">Discovered</option>
                    <option value="qualified">Qualified Match</option>
                    <option value="applied">Auto-Generated</option>
                    <option value="below_threshold">Below Score</option>
                    <option value="skipped">Skipped</option>
                  </select>
                </div>

                <div className="ml-auto font-mono text-xs text-muted-foreground">
                  Found <span className="font-bold text-foreground">{totalJobsCount}</span> roles
                </div>
              </div>

              {loadingJobs && jobsPage === 1 ? (
                <JobFeedSkeleton count={5} />
              ) : discoveredJobs.length === 0 ? (
                <Card className="bg-card border border-border p-12 text-center max-w-xl mx-auto rounded-none">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-muted border border-border rounded-none flex items-center justify-center mx-auto mb-4">
                      <Search size={24} className="text-muted-foreground" />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      [EMPTY_FEED]
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">No Jobs Found</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-md mx-auto">
                      Run an Autopilot agent to discover and evaluate jobs from JSearch and Remotive.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {discoveredJobs.map((job) => {
                    const isExpanded = expandedJobId === job.id;
                    return (
                      <Card
                        key={job.id}
                        className={cn(
                          "bg-card border rounded-none transition-colors",
                          isExpanded ? "border-foreground/40" : "border-border hover:border-foreground/20"
                        )}
                      >
                        <CardContent className="p-0">
                          {/* Summary Row */}
                          <div
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="p-5 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-muted/30 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-mono text-[11px] font-bold px-2 py-0.5 rounded-none border",
                                  getScoreColor(job.matchScore)
                                )}>
                                  {job.matchScore !== null ? `${job.matchScore}% MATCH` : "EVALUATING"}
                                </span>
                                {getStatusBadge(job.status)}
                                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                                  via {job.source}
                                </span>
                              </div>
                              <h3 className="font-bold text-base text-foreground tracking-tight mt-1.5">
                                {job.title}
                              </h3>
                              <p className="text-xs font-medium text-foreground">
                                {job.company} &bull; <span className="text-muted-foreground">{job.location || "Remote / Unspecified"}</span>
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Calendar size={11} />
                                Discovered: {formatDate(job.createdAt)} &bull; Agent: {job.schedule.name}
                              </p>
                            </div>

                            <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end mt-2 md:mt-0">
                              {job.status === "below_threshold" ? (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-mono text-[10px] text-amber-500 uppercase">
                                    Below {schedules.find((s) => s.id === job.scheduleId)?.minMatchScore ?? "—"}%
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleGenerateAnyway(job); }}
                                    className="px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-500 transition-colors"
                                  >
                                    Generate Anyway
                                  </button>
                                </div>
                              ) : job.applicationId ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleGenerateDocuments(job); }}
                                  className="px-3.5 py-1.5 rounded-none font-mono text-xs uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 transition-colors inline-flex items-center gap-1.5"
                                >
                                  <FileText size={12} />
                                  View Assets
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleGenerateDocuments(job); }}
                                  className="px-3.5 py-1.5 rounded-none font-mono text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors inline-flex items-center gap-1.5"
                                >
                                  <Sparkles size={12} />
                                  Generate Docs
                                </button>
                              )}

                              {job.url && (
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground rounded-none transition-colors"
                                  title="Open Job Link"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                              <button className="p-2 text-muted-foreground hover:text-foreground rounded-none transition-colors">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="border-t border-border bg-muted/20 p-5 space-y-4 text-xs font-mono">
                              {job.matchReason && (
                                <div className="p-4 bg-card border border-border rounded-none space-y-1.5">
                                  <h4 className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={12} />
                                    AI Evaluator Rationale
                                  </h4>
                                  <p className="text-foreground text-xs leading-relaxed whitespace-pre-line font-sans font-normal">
                                    {job.matchReason}
                                  </p>
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                  Job Description Content
                                </h4>
                                <div className="p-4 bg-background border border-border rounded-none max-h-[250px] overflow-y-auto text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-mono">
                                  {job.description}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Pagination */}
                  {jobsTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-4">
                      <button
                        onClick={() => fetchDiscoveredJobs(jobsPage - 1)}
                        disabled={jobsPage === 1}
                        className="px-3 py-1.5 border border-border hover:border-foreground/40 bg-card rounded-none font-mono text-xs uppercase disabled:opacity-40 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="font-mono text-xs text-muted-foreground">
                        Page {jobsPage} / {jobsTotalPages}
                      </span>
                      <button
                        onClick={() => fetchDiscoveredJobs(jobsPage + 1)}
                        disabled={jobsPage === jobsTotalPages}
                        className="px-3 py-1.5 border border-border hover:border-foreground/40 bg-card rounded-none font-mono text-xs uppercase disabled:opacity-40 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      {/* CREATE & EDIT SCHEDULE MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
          <Card
            className="bg-card border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col rounded-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center">
                  <Terminal size={16} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {editingSchedule ? "Edit Autopilot Configuration" : "Configure New Autopilot"}
                </h2>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-none transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-background">
              <div className="space-y-1">
                <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Agent Identifier / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Autopilot"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="flat-input w-full px-3 py-2 text-sm rounded-none border-border"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Target Roles *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer, React Developer"
                    value={formTargetRolesText}
                    onChange={(e) => setFormTargetRolesText(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border"
                  />
                  <p className="font-mono text-[10px] text-muted-foreground">Comma-separated query keywords</p>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Locations *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remote, San Francisco, London"
                    value={formLocationsText}
                    onChange={(e) => setFormLocationsText(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border"
                  />
                  <p className="font-mono text-[10px] text-muted-foreground">Comma-separated regions or 'Remote'</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Work Type</label>
                  <select
                    value={formWorkType}
                    onChange={(e) => setFormWorkType(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border bg-card"
                  >
                    <option value="any">Any Work Type</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-Site Only</option>
                    <option value="hybrid">Hybrid Only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Experience Level</label>
                  <select
                    value={formExperienceLevel}
                    onChange={(e) => setFormExperienceLevel(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border bg-card"
                  >
                    <option value="any">Any Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior / Lead</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Post Age</label>
                  <select
                    value={formPostAge}
                    onChange={(e) => setFormPostAge(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border bg-card"
                  >
                    <option value="24h">Past 24 Hours</option>
                    <option value="48h">Past 48 Hours</option>
                    <option value="7d">Past 7 Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Min Salary ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 90000"
                    value={formSalaryMin}
                    onChange={(e) => setFormSalaryMin(e.target.value)}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border bg-card font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Score Threshold</label>
                    <span className="font-mono text-xs font-bold text-emerald-500">{formMinMatchScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="5"
                    value={formMinMatchScore}
                    onChange={(e) => setFormMinMatchScore(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 mt-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Max Applies Per Run</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formMaxApplications}
                    onChange={(e) => setFormMaxApplications(parseInt(e.target.value))}
                    className="flat-input w-full px-3 py-2 text-sm rounded-none border-border bg-card font-mono"
                  />
                </div>
              </div>

              {/* Schedule Cron settings */}
              <div className="p-4 bg-card border border-border rounded-none space-y-3">
                <h3 className="font-mono text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Trigger Frequency</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 border border-border bg-background cursor-pointer hover:border-foreground/30">
                    <input
                      type="radio"
                      name="cron-preset"
                      checked={formCronPreset === "daily"}
                      onChange={() => setFormCronPreset("daily")}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono text-xs">Every Day at 08:00 AM</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 border border-border bg-background cursor-pointer hover:border-foreground/30">
                    <input
                      type="radio"
                      name="cron-preset"
                      checked={formCronPreset === "halfday"}
                      onChange={() => setFormCronPreset("halfday")}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono text-xs">Every 12 Hours</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 border border-border bg-background cursor-pointer hover:border-foreground/30">
                    <input
                      type="radio"
                      name="cron-preset"
                      checked={formCronPreset === "weekly"}
                      onChange={() => setFormCronPreset("weekly")}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono text-xs">Weekly (Sun 00:00)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 border border-border bg-background cursor-pointer hover:border-foreground/30">
                    <input
                      type="radio"
                      name="cron-preset"
                      checked={formCronPreset === "custom"}
                      onChange={() => setFormCronPreset("custom")}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono text-xs">Custom Expression</span>
                  </label>
                </div>

                {formCronPreset === "custom" && (
                  <div className="space-y-1 pt-2 border-t border-border">
                    <label className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">Cron String</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0 9 * * 1-5"
                      value={formCustomCron}
                      onChange={(e) => setFormCustomCron(e.target.value)}
                      className="flat-input w-full px-3 py-2 text-xs font-mono rounded-none border-border"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors border border-border bg-card rounded-none"
                >
                  Cancel
                </button>
                {!editingSchedule && (
                  <button
                    type="submit"
                    disabled={submittingForm}
                    onClick={() => setShouldRunAfterCreate(true)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider border border-border bg-card hover:bg-muted text-foreground transition-colors rounded-none inline-flex items-center gap-1.5"
                  >
                    {submittingForm && shouldRunAfterCreate ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap size={13} className="text-emerald-500" />
                    )}
                    Create & Run Now
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingForm}
                  onClick={() => setShouldRunAfterCreate(false)}
                  className="px-5 py-2 font-semibold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors rounded-none inline-flex items-center gap-1.5"
                >
                  {submittingForm && !shouldRunAfterCreate ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles size={13} />
                  )}
                  {editingSchedule ? "Save Changes" : "Save Agent"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* AI THINKING OVERLAY */}
      <AutopilotRunOverlay
        isOpen={overlayState.isOpen}
        scheduleId={overlayState.scheduleId}
        scheduleName={overlayState.scheduleName}
        initialLastRunAt={overlayState.initialLastRunAt}
        onComplete={handleOverlayComplete}
        onDismiss={handleOverlayDismiss}
      />
    </>
  );
}
