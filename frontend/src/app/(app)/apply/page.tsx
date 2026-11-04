"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Sparkles, Check, Copy, FileText, CheckCircle2, 
  AlertCircle, Loader2, Download, Search, Award, Mail, 
  Activity, ArrowRight, ShieldAlert, Terminal, RefreshCw,
  ChevronRight, Eye, ExternalLink, Code2, Layers, CheckSquare, Plus
} from "@/components/animate-ui/icons";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { FullPageSkeleton, ApplyPageSkeleton } from "@/components/skeletons";

interface ApplicationData {
  id: string;
  jobDescription: string;
  status: string;
  matchScore: number | null;
  matchAnalysis: {
    strengths: string[];
    gaps: string[];
    suggestions: string[];
  } | null;
  parsedJob: {
    title: string;
    company: string;
    location: string;
    type: string;
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    keyResponsibilities: string[];
    keywords: string[];
  } | null;
  tailoredResume: string | null;
  coverLetter: string | null;
  coldEmail: {
    subject: string;
    body: string;
  } | null;
}

const SAMPLE_JDS = [
  {
    label: "Frontend Engineer",
    text: `Company: ScaleAI\nRole: Senior Frontend Engineer\nLocation: Remote (US / Global)\nType: Full-time\n\nAbout the Role:\nWe are looking for a Senior Frontend Engineer to architect performant, high-scale web interfaces for our generative AI developer platform. You will build complex data visualization tools, canvas-based model debuggers, and real-time collaboration workflows.\n\nKey Responsibilities:\n• Architect and maintain web applications using React, Next.js, and TypeScript.\n• Optimize Core Web Vitals, client-side rendering performance, and bundle distribution.\n• Integrate streaming LLM responses via WebSockets and Server-Sent Events (SSE).\n• Champion accessibility (WCAG 2.1 AA) and automated component testing.\n\nQualifications:\n• 4+ years of professional experience with React and modern frontend ecosystems.\n• Strong proficiency with TypeScript, Tailwind CSS, and state machines.\n• Experience with performance profiling, Web Workers, and client caching strategies.`
  },
  {
    label: "Full Stack Engineer",
    text: `Company: Datadog\nRole: Full Stack Platform Engineer\nLocation: Remote / New York\nType: Full-time\n\nAbout the Role:\nWe seek a Full Stack Engineer to build and scale our continuous automation infrastructure. You will work across both distributed backend services and high-density operator dashboards.\n\nKey Responsibilities:\n• Build robust API pipelines and background task schedulers using Node.js and Go.\n• Develop intuitive dashboard controls in React and Next.js for platform monitoring.\n• Design PostgreSQL schemas, caching strategies with Redis, and queue workers.\n• Participate in system architecture reviews and maintain 99.9% uptime SLOs.\n\nQualifications:\n• 3+ years experience across modern web and backend service development.\n• Hands-on proficiency with TypeScript, PostgreSQL, and distributed messaging.\n• Solid understanding of containerized deployment (Docker, Kubernetes) and CI/CD.`
  }
];

export default function OneClickApplyPage() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <OneClickApply />
    </Suspense>
  );
}

function OneClickApply() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [appDetails, setAppDetails] = useState<ApplicationData | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"match" | "resume" | "cover" | "email">("match");
  const [showOriginalJd, setShowOriginalJd] = useState(false);
  
  // Interactive copy triggers
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkUserProfile();
    
    if (typeof window !== "undefined") {
      const appIdFromUrl = searchParams.get("id");
      if (appIdFromUrl) {
        loadExistingApplication(appIdFromUrl);
      } else {
        const prefilled = localStorage.getItem("prefilledJobDesc");
        if (prefilled) {
          setJobDescription(prefilled);
          localStorage.removeItem("prefilledJobDesc");
          toast.success("Loaded job description from Autopilot!");
        }
      }
    }

    return () => stopPolling();
  }, []);

  const loadExistingApplication = async (appId: string) => {
    try {
      const response = await axiosAPI.get(`/apply/${appId}`);
      const app = response.data.application;
      setApplicationId(appId);
      setAppDetails(app);
      setJobDescription(app.jobDescription || "");
      toast.success("Loaded application from Autopilot!");
    } catch (error: any) {
      console.error("Failed to load application:", error);
      toast.error("Failed to load application. It may have been deleted.");
    }
  };

  const checkUserProfile = async () => {
    try {
      setCheckingProfile(true);
      const response = await axiosAPI.get("/profile");
      if (response.data.profile) {
        setHasProfile(true);
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

  const startPolling = (appId: string) => {
    stopPolling();
    pollingInterval.current = setInterval(async () => {
      try {
        const response = await axiosAPI.get(`/apply/${appId}`);
        const app = response.data.application;
        setAppDetails(app);

        if (app.status === "completed") {
          stopPolling();
          setSubmitting(false);
          toast.success("AI Pipeline finished successfully!");
        } else if (app.status === "failed") {
          stopPolling();
          setSubmitting(false);
          toast.error("AI pipeline execution failed. Please verify job input.");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const handleStartPipeline = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description first.");
      return;
    }

    try {
      setSubmitting(true);
      setAppDetails(null);
      setApplicationId(null);
      
      const response = await axiosAPI.post("/apply/one-click", { jobDescription });
      const { applicationId: newAppId, application } = response.data;
      
      setApplicationId(newAppId);
      setAppDetails(application);
      
      startPolling(newAppId);
    } catch (error: any) {
      setSubmitting(false);
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 429) {
        toast.error(data?.message || "Usage limit reached. Please try again later.", { duration: 6000 });
        if (data?.suggestion) {
          toast(data.suggestion, { icon: "💡", duration: 8000 });
        }
        if (data?.upgrade) {
          toast(data.upgrade, { icon: "⬆️", duration: 8000 });
        }
      } else {
        const errMsg = data?.msg || data?.message || "Failed to initiate One-Click Apply pipeline.";
        toast.error(errMsg);
      }
      console.error("Pipeline start error:", error);
    }
  };

  const handleResetForNewJob = () => {
    setAppDetails(null);
    setApplicationId(null);
    setJobDescription("");
    stopPolling();
  };

  const handleCopyText = async (text: string, type: "resume" | "cover" | "email" | "subject") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "resume") {
        setCopiedResume(true);
        setTimeout(() => setCopiedResume(false), 2000);
      } else if (type === "cover") {
        setCopiedCover(true);
        setTimeout(() => setCopiedCover(false), 2000);
      } else if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleDownloadPdf = async () => {
    if (!applicationId || !appDetails || !appDetails.tailoredResume) return;

    try {
      setDownloadingPdf(true);
      toast.loading("Compiling PDF with pdflatex...", { id: "pdf-loading" });

      const response = await axiosAPI.get(`/apply/${applicationId}/pdf`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `tailored_resume_${appDetails.parsedJob?.company || "applied"}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
      
      toast.success("PDF Downloaded successfully!", { id: "pdf-loading" });
    } catch (error) {
      toast.error("Failed to compile resume PDF.", { id: "pdf-loading" });
      console.error("Download PDF error:", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (checkingProfile) return <ApplyPageSkeleton />;

  // Profile setup onboarding wall
  if (hasProfile === false) {
    return (
      <div className="min-h-screen bg-transparent py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-card border border-border p-8 text-center space-y-5 rounded-none shadow-2xl relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

          <div className="w-10 h-10 border border-border bg-muted/30 flex items-center justify-center mx-auto text-foreground rounded-none">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              REQUIREMENT CHECK
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Master Profile Required
            </h1>
            <p className="text-muted-foreground text-xs font-mono leading-relaxed max-w-md mx-auto">
              The One-Click Apply engine requires your master experience telemetry to compute ATS alignment and adapt LaTeX bullet points.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-border hover:border-foreground/40 bg-card text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors rounded-none"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors rounded-none flex justify-center items-center gap-2 font-semibold"
            >
              <Sparkles size={13} />
              Set Up Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = appDetails && appDetails.status === "completed";
  const charCount = jobDescription.length;
  const lineCount = jobDescription ? jobDescription.split("\n").length : 0;

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        
        {/* Top Console Navigation Bar with CAD Framing */}
        <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                One-Click Application
              </h1>
              <p className="text-muted-foreground text-xs">
                Paste any job description to compute ATS match score, synthesize tailored resume bullets, and generate cold outreach.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isCompleted && (
                <button
                  onClick={handleResetForNewJob}
                  className="px-3 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase tracking-wider text-foreground transition-colors rounded-none flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  New Job
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

        {/* ── MODE 1: EXECUTION STATE (RUNNING DAG) ─────────────────────────── */}
        {submitting && (
          <div className="relative border border-border bg-card p-8 rounded-none space-y-6">
            <div className="flex flex-col items-center justify-center text-center p-6 border border-border bg-background">
              <Loader2 className="w-7 h-7 text-foreground animate-spin mb-3" />
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                EXECUTING PIPELINE
              </div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Synthesizing Application Assets
              </h2>
              <p className="font-mono text-xs text-muted-foreground mt-1 max-w-md">
                Multi-agent parsing, ATS scoring matrix, LaTeX bullet adaptation, and outreach copywriting...
              </p>
            </div>

            {/* Horizontal Visual Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3 border border-foreground/30 bg-muted/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">01 / STAGE</span>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </div>
                <p className="font-bold text-foreground">Ingest Job</p>
                <p className="text-[10px] text-emerald-500">Payload Accepted</p>
              </div>

              <div className={cn(
                "p-3 border space-y-1 transition-colors",
                appDetails?.parsedJob ? "border-foreground/30 bg-muted/20" : "border-border bg-card"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">02 / STAGE</span>
                  {appDetails?.parsedJob ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Loader2 size={13} className="text-foreground animate-spin" />}
                </div>
                <p className="font-bold text-foreground">Entity Parser</p>
                <p className="text-[10px] text-muted-foreground">Extracting Skills</p>
              </div>

              <div className={cn(
                "p-3 border space-y-1 transition-colors",
                appDetails?.matchScore !== null ? "border-foreground/30 bg-muted/20" : "border-border bg-card"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">03 / STAGE</span>
                  {appDetails?.matchScore !== null ? <CheckCircle2 size={13} className="text-emerald-500" /> : <div className="w-3 h-3 border border-border" />}
                </div>
                <p className="font-bold text-foreground">ATS Scoring</p>
                <p className="text-[10px] text-muted-foreground">Gap Analysis</p>
              </div>

              <div className={cn(
                "p-3 border space-y-1 transition-colors",
                appDetails?.tailoredResume ? "border-foreground/30 bg-muted/20" : "border-border bg-card"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">04 / STAGE</span>
                  {appDetails?.tailoredResume ? <CheckCircle2 size={13} className="text-emerald-500" /> : <div className="w-3 h-3 border border-border" />}
                </div>
                <p className="font-bold text-foreground">LaTeX Synthesis</p>
                <p className="text-[10px] text-muted-foreground">Tailor Bullets</p>
              </div>

              <div className={cn(
                "p-3 border space-y-1 transition-colors",
                appDetails?.coverLetter && appDetails?.coldEmail ? "border-foreground/30 bg-muted/20" : "border-border bg-card"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">05 / STAGE</span>
                  {appDetails?.coverLetter ? <CheckCircle2 size={13} className="text-emerald-500" /> : <div className="w-3 h-3 border border-border" />}
                </div>
                <p className="font-bold text-foreground">Outreach Copy</p>
                <p className="text-[10px] text-muted-foreground">Cover & Email</p>
              </div>
            </div>
          </div>
        )}

        {/* ── MODE 2: INPUT INGESTION WORKBENCH (BEFORE COMPLETED) ─────────── */}
        {!isCompleted && !submitting && (
          <div className="w-full space-y-4">
            <div className="relative border border-border bg-card p-6 sm:p-7 rounded-none space-y-4">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

              {/* Editor Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-foreground" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    Job Description
                  </span>
                </div>

                {/* Sample Ingestion Buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">Samples:</span>
                  {SAMPLE_JDS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => {
                        setJobDescription(sample.text);
                        toast.success(`Loaded: ${sample.label}`);
                      }}
                      className="px-2 py-0.5 border border-border hover:border-foreground/40 bg-background font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors rounded-none"
                    >
                      {sample.label}
                    </button>
                  ))}
                  {jobDescription && (
                    <button
                      type="button"
                      onClick={() => setJobDescription("")}
                      className="px-2 py-0.5 border border-destructive/40 hover:border-destructive text-destructive font-mono text-[10px] uppercase rounded-none transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Area */}
              <div className="space-y-1.5">
                <textarea
                  placeholder="Paste the raw job description requirements, responsibilities, or posting text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={14}
                  className="w-full p-4 font-mono text-xs border border-border bg-background text-foreground focus:border-foreground/40 focus:outline-none resize-none leading-relaxed rounded-none"
                />
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground px-1">
                  <span>{charCount > 0 ? `${charCount} characters` : "Waiting for job description..."}</span>
                  <span>{lineCount} lines</span>
                </div>
              </div>

              {/* Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartPipeline}
                  disabled={!jobDescription.trim()}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-none flex items-center justify-center gap-2 transition-colors disabled:opacity-30 select-none"
                >
                  <Sparkles size={14} />
                  Generate Tailored Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODE 3: RESULT EXECUTIVE WORKBENCH (COMPLETED) ────────────────── */}
        {isCompleted && (
          <div className="space-y-6">
            
            {/* Top KPI & Target Role Rail */}
            <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none flex flex-col lg:flex-row justify-between lg:items-center gap-5">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-border bg-muted/20 text-foreground">
                    EVALUATION COMPLETE
                  </span>
                  {appDetails.parsedJob?.type && (
                    <span className="font-mono text-[10px] uppercase text-muted-foreground border border-border px-2 py-0.5 bg-background">
                      {appDetails.parsedJob.type}
                    </span>
                  )}
                  {appDetails.parsedJob?.experienceLevel && (
                    <span className="font-mono text-[10px] uppercase text-muted-foreground border border-border px-2 py-0.5 bg-background">
                      {appDetails.parsedJob.experienceLevel} Level
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {appDetails.parsedJob?.title || "Target Position"}
                </h2>
                
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="text-foreground font-semibold">{appDetails.parsedJob?.company}</span> &bull; {appDetails.parsedJob?.location || "Remote / Unspecified"}
                </p>
              </div>

              {/* Score Tile & Action Suite */}
              <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                <div className="flex items-center gap-3.5 px-4 py-2 bg-background border border-border">
                  <div className="text-right font-mono">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">ATS Score</span>
                    <span className="text-xs text-foreground font-semibold">Calibrated</span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-foreground border-l border-border pl-3.5">
                    {appDetails.matchScore ?? 0}%
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 transition-colors disabled:opacity-50 font-semibold"
                  >
                    <Download size={13} />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowOriginalJd(!showOriginalJd)}
                    className={cn(
                      "px-3.5 py-2 border font-mono text-xs uppercase tracking-wider transition-colors rounded-none inline-flex items-center gap-1.5",
                      showOriginalJd 
                        ? "border-foreground text-foreground bg-muted/40 font-semibold" 
                        : "border-border hover:border-foreground/40 bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Eye size={13} />
                    {showOriginalJd ? "Hide Source" : "View Source"}
                  </button>
                </div>
              </div>
            </div>

            {/* Split View: Left Workspace & Optional Collapsible JD Side Pane */}
            <div className={cn("grid gap-6", showOriginalJd ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
              
              {/* Primary Result Panels */}
              <div className={cn(showOriginalJd ? "lg:col-span-2" : "w-full", "space-y-4")}>
                
                {/* 4-Tab Workspace Navigation */}
                <div className="flex border border-border bg-card">
                  <button
                    onClick={() => setActiveResultTab("match")}
                    className={cn(
                      "flex-1 py-2.5 px-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-r border-border transition-colors",
                      activeResultTab === "match" ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Award size={13} />
                    ATS Audit
                  </button>
                  <button
                    onClick={() => setActiveResultTab("resume")}
                    className={cn(
                      "flex-1 py-2.5 px-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-r border-border transition-colors",
                      activeResultTab === "resume" ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <FileText size={13} />
                    Tailored LaTeX
                  </button>
                  <button
                    onClick={() => setActiveResultTab("cover")}
                    className={cn(
                      "flex-1 py-2.5 px-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-r border-border transition-colors",
                      activeResultTab === "cover" ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Layers size={13} />
                    Cover Letter
                  </button>
                  <button
                    onClick={() => setActiveResultTab("email")}
                    className={cn(
                      "flex-1 py-2.5 px-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
                      activeResultTab === "email" ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Mail size={13} />
                    Outreach Email
                  </button>
                </div>

                {/* Tab 1: ATS Intelligence & Audit */}
                {activeResultTab === "match" && (
                  <div className="border border-border bg-card p-6 rounded-none space-y-6">
                    {/* Skills Extracted from JD */}
                    {appDetails.parsedJob?.requiredSkills && appDetails.parsedJob.requiredSkills.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <CheckSquare size={13} />
                          Required Competencies ({appDetails.parsedJob.requiredSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border">
                          {appDetails.parsedJob.requiredSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-muted/40 border border-border font-mono text-xs text-foreground">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Side-by-Side Strengths vs Gaps */}
                    {appDetails.matchAnalysis && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-border p-4 bg-background space-y-2">
                          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500" /> Profile Strengths
                          </h4>
                          <ul className="space-y-1.5 font-mono text-xs text-muted-foreground">
                            {appDetails.matchAnalysis.strengths.map((str, i) => (
                              <li key={i} className="p-2 bg-muted/20 border border-border/60 leading-relaxed">
                                &bull; {str}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border border-border p-4 bg-background space-y-2">
                          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <AlertCircle size={13} /> Identified Gaps
                          </h4>
                          <ul className="space-y-1.5 font-mono text-xs text-muted-foreground">
                            {appDetails.matchAnalysis.gaps.map((gap, i) => (
                              <li key={i} className="p-2 bg-muted/20 border border-border/60 leading-relaxed">
                                &bull; {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Actionable Recommendations */}
                    {appDetails.matchAnalysis?.suggestions && appDetails.matchAnalysis.suggestions.length > 0 && (
                      <div className="border border-border p-4 bg-background space-y-2">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <Sparkles size={13} /> Optimization Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
                          {appDetails.matchAnalysis.suggestions.map((sug, i) => (
                            <div key={i} className="p-2 bg-muted/20 border border-border/60 leading-relaxed">
                              &bull; {sug}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Tailored LaTeX Resume */}
                {activeResultTab === "resume" && (
                  <div className="border border-border bg-card p-5 space-y-4 rounded-none">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                      <div className="font-mono text-xs text-muted-foreground">
                        TYPESET: <span className="text-foreground font-semibold">LaTeX 2e (pdflatex)</span> &bull; {appDetails.tailoredResume?.length || 0} bytes
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyText(appDetails.tailoredResume || "", "resume")}
                          className="px-3.5 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase text-foreground transition-colors rounded-none inline-flex items-center gap-1.5"
                        >
                          {copiedResume ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          {copiedResume ? "Copied" : "Copy Code"}
                        </button>
                        <button
                          onClick={handleDownloadPdf}
                          disabled={downloadingPdf}
                          className="px-4 py-1.5 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider transition-colors rounded-none inline-flex items-center gap-1.5 font-semibold"
                        >
                          <Download size={13} />
                          Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="border border-border bg-background">
                      <pre className="p-4 overflow-x-auto font-mono text-xs text-foreground leading-relaxed max-h-[500px]">
                        <code>{appDetails.tailoredResume}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Tab 3: Cover Letter */}
                {activeResultTab === "cover" && (
                  <div className="border border-border bg-card p-5 space-y-4 rounded-none">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="font-mono text-xs text-muted-foreground">
                        DOCUMENT: <span className="text-foreground font-semibold">Tailored Cover Letter</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(appDetails.coverLetter || "", "cover")}
                        className="px-3.5 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase text-foreground transition-colors rounded-none inline-flex items-center gap-1.5"
                      >
                        {copiedCover ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        {copiedCover ? "Copied" : "Copy Letter"}
                      </button>
                    </div>

                    <div className="p-6 border border-border bg-background font-mono text-xs leading-relaxed whitespace-pre-line text-foreground max-h-[500px] overflow-y-auto">
                      {appDetails.coverLetter}
                    </div>
                  </div>
                )}

                {/* Tab 4: Cold Outreach Email */}
                {activeResultTab === "email" && (
                  <div className="border border-border bg-card p-5 space-y-4 rounded-none">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="font-mono text-xs text-muted-foreground">
                        OUTREACH: <span className="text-foreground font-semibold">Direct Recruiter Pitch</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(`Subject: ${appDetails.coldEmail?.subject}\n\n${appDetails.coldEmail?.body}` || "", "email")}
                        className="px-3.5 py-1.5 border border-border hover:border-foreground/40 bg-card font-mono text-xs uppercase text-foreground transition-colors rounded-none inline-flex items-center gap-1.5"
                      >
                        {copiedEmail ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        {copiedEmail ? "Copied All" : "Copy Complete Email"}
                      </button>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {/* Subject Line Bar */}
                      <div className="p-3 border border-border bg-background flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Subject:</span>
                          <p className="font-semibold text-foreground truncate">{appDetails.coldEmail?.subject}</p>
                        </div>
                        <button
                          onClick={() => handleCopyText(appDetails.coldEmail?.subject || "", "subject")}
                          className="px-2.5 py-1 border border-border hover:border-foreground/40 text-[10px] uppercase text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        >
                          {copiedSubject ? "Copied" : "Copy Subject"}
                        </button>
                      </div>

                      {/* Body Box */}
                      <div className="p-5 border border-border bg-background leading-relaxed whitespace-pre-line text-foreground max-h-[400px] overflow-y-auto">
                        {appDetails.coldEmail?.body}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Drawer: Raw Job Description */}
              {showOriginalJd && (
                <div className="lg:col-span-1 border border-border bg-card p-4 rounded-none space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-foreground">
                      <Search size={13} />
                      Original Job Post
                    </div>
                    <button
                      onClick={() => setShowOriginalJd(false)}
                      className="text-muted-foreground hover:text-foreground font-mono text-xs"
                    >
                      [CLOSE]
                    </button>
                  </div>
                  <div className="p-3 bg-background border border-border max-h-[580px] overflow-y-auto font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {jobDescription || appDetails.jobDescription}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
  );
}
