"use client";

import { useEffect, useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { Trash2, FileText, Calendar, Plus, X, Copy, Check, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DashboardResumeSkeleton } from "@/components/skeletons";
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

interface Resume {
  id: string;
  title: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLatexCode, setSelectedLatexCode] = useState("");
  const [loadingLatex, setLoadingLatex] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosAPI.get("/resume/all");
      setResumes(response.data.resumes);
      setError("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || "Failed to fetch resumes";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {

    try {
      await axiosAPI.delete(`/resume/${id}`);
      setResumes(resumes.filter((resume) => resume.id !== id));
      toast.success("Resume deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to delete resume");
      console.error("Error deleting resume:", err);
    }
  };

  const handleView = async (id: string) => {
    try {
      setLoadingLatex(true);
      setShowModal(true);
      const response = await axiosAPI.get(`/resume/${id}`);
      setSelectedLatexCode(response.data.latexCode);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to fetch resume");
      console.error("Error fetching resume:", err);
      setShowModal(false);
    } finally {
      setLoadingLatex(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedLatexCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLatexCode("");
    setCopied(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {loading ? (
        <div className="w-full">
          <DashboardResumeSkeleton />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Bar with CAD Framing */}
          <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Saved Resumes
                </h1>
                <p className="text-muted-foreground text-xs">
                  All your created resumes and LaTeX files.
                </p>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => router.push("/resume")}
                  className="px-3.5 py-1.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors cursor-pointer select-none flex items-center gap-1.5 rounded-none font-semibold"
                >
                  <Plus size={13} />
                  New Resume
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 rounded-none">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-mono text-xs uppercase">Error</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {resumes.length === 0 && !loading && !error && (
            <div className="relative border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 rounded-none">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

              <div className="w-10 h-10 border border-border bg-background flex items-center justify-center mx-auto text-muted-foreground">
                <FileText size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">No documents in store</h3>
                <p className="text-muted-foreground text-xs font-mono max-w-sm mx-auto">
                  Compile your first tailored ATS resume to begin storing document assets.
                </p>
              </div>
              <button
                onClick={() => router.push("/resume")}
                className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 rounded-none"
              >
                <Plus size={13} />
                Create First Resume
              </button>
            </div>
          )}

          {/* Resume Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => handleView(resume.id)}
                className="relative border border-border bg-card p-5 cursor-pointer hover:border-foreground/40 transition-colors group flex flex-col justify-between space-y-4 rounded-none"
              >
                <div>
                  <div className="flex items-start justify-between mb-3 border-b border-border/60 pb-3">
                    <div className="w-7 h-7 border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40 transition-colors">
                      <FileText size={13} />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-colors rounded-none"
                          title="Delete Resume"
                        >
                          <Trash2 size={13} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()} className="rounded-none border border-border bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-bold">Delete this resume document?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs">
                            This will permanently remove the resume source file from your repository.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="rounded-none border border-border">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); }}
                            className="bg-destructive text-destructive-foreground border border-destructive hover:brightness-90 rounded-none font-mono text-xs uppercase"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:underline transition-colors">
                    {resume.title || "Untitled Resume"}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">{resume.fullName}</p>
                </div>

                <div className="space-y-1 border-t border-border/60 pt-3 font-mono text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} />
                    <span>Updated: {formatDate(resume.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} />
                    <span>Created: {formatDate(resume.createdAt)}</span>
                  </div>
                </div>
                
                <div className="pt-2.5 flex items-center justify-between border-t border-border/40">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                    View LaTeX Source
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LaTeX Code Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-card border border-border rounded-none shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-foreground" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">LaTeX Source Terminal</h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors cursor-pointer rounded-none"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4 bg-muted/5">
              {loadingLatex ? (
                <div className="flex flex-col justify-center items-center h-64 gap-3">
                  <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-none animate-spin" />
                  <p className="font-mono text-xs text-muted-foreground">FETCHING LATEX SOURCE...</p>
                </div>
              ) : (
                <pre className="p-4 overflow-x-auto font-mono text-xs text-foreground leading-relaxed bg-background border border-border max-h-[60vh]">
                  <code>{selectedLatexCode}</code>
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-3 border-t border-border bg-muted/10">
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                {selectedLatexCode ? `${selectedLatexCode.length} CHARACTERS` : ""}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-3.5 py-1.5 text-xs font-mono uppercase text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors cursor-pointer select-none rounded-none"
                >
                  Close
                </button>
                <button
                  onClick={handleCopyCode}
                  disabled={loadingLatex}
                  className={cn(
                    "px-4 py-1.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-colors cursor-pointer select-none rounded-none",
                    copied
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-foreground text-background hover:bg-foreground/90 border-foreground disabled:opacity-40 font-semibold"
                  )}
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
