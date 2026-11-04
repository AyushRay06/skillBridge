"use client";

import { useState, useEffect } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import {
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
  Eye,
  ArrowLeft,
  Code2,
  RefreshCw,
  Terminal,
} from "@/components/animate-ui/icons";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface ResumeDisplayProps {
  resumeId: string | null;
  onBack: () => void;
}

type TabType = "latex" | "pdf";

export default function ResumeDisplay({
  resumeId,
  onBack,
}: ResumeDisplayProps) {
  const [latexCode, setLatexCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("pdf");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompilingPdf, setIsCompilingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string>("");

  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId);
    }
  }, [resumeId]);

  useEffect(() => {
    if (latexCode && resumeId && !pdfUrl) {
      compilePdf();
    }
  }, [latexCode, resumeId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const fetchResume = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosAPI.get(`/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLatexCode(response.data.latexCode);
    } catch (err: any) {
      console.error("Error fetching resume:", err);
      setError(err.response?.data?.msg || "Failed to fetch resume data");
    } finally {
      setIsLoading(false);
    }
  };

  const compilePdf = async () => {
    if (!resumeId) return;

    setIsCompilingPdf(true);
    setPdfError("");

    try {
      const response = await axiosAPI.get(`/resume/${resumeId}/pdf`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.msg || "Compilation failed");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfUrl(url);
      toast.success("PDF compiled successfully!");
    } catch (err: any) {
      console.error("Error compiling PDF:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.message ||
        "Failed to compile PDF. Please try again.";
      setPdfError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCompilingPdf(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = latexCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadLatexFile = () => {
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    toast.success("LaTeX file downloaded");
  };

  const downloadPdfFile = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("PDF downloaded");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Compiling Resume Artifacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 w-full max-w-md bg-card border border-border rounded-none shadow-2xl">
          <CardContent className="p-0">
            <Alert variant="destructive" className="mb-6 rounded-none border border-destructive/50 bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold text-xs uppercase tracking-wider font-mono">Error Loading Resume</AlertTitle>
              <AlertDescription className="mt-1 text-xs">{error}</AlertDescription>
            </Alert>
            <button 
              onClick={onBack} 
              className="w-full py-2.5 flex items-center justify-center gap-2 border border-border hover:border-foreground/40 bg-card rounded-none font-mono text-xs uppercase tracking-wider text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back to Editor
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-border pb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-1">
              [OUTPUT_VIEWER]
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Generated Resume
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Review compiled PDF artifact or inspect raw LaTeX typesetting source</p>
          </div>
          <button 
            onClick={onBack} 
            className="px-4 py-2 border border-border hover:border-foreground/40 bg-card rounded-none font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>
        </div>

        <Card className="bg-card border border-border rounded-none p-6">
          <CardContent className="p-0">
            {/* Tab Navigation */}
            <div className="flex border border-border bg-background w-fit mb-6">
              <button
                onClick={() => setActiveTab("pdf")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors border-r border-border",
                  activeTab === "pdf"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                PDF Preview
              </button>
              <button
                onClick={() => setActiveTab("latex")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors",
                  activeTab === "latex"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                LaTeX Source
              </button>
            </div>

            {/* PDF Preview Tab */}
            {activeTab === "pdf" && (
              <div>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <button
                    onClick={compilePdf}
                    disabled={isCompilingPdf || !latexCode}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {isCompilingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    {isCompilingPdf ? "Compiling..." : "Recompile PDF"}
                  </button>

                  <button
                    onClick={downloadPdfFile}
                    disabled={!pdfUrl || isCompilingPdf}
                    className="px-4 py-2 border border-border hover:border-foreground/40 bg-card text-foreground font-mono text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>

                <div className="border border-border bg-background h-[75vh]">
                  {isCompilingPdf ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Compiling LaTeX to PDF...
                      </p>
                    </div>
                  ) : pdfUrl ? (
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full border-none"
                      title="Resume PDF Preview"
                    />
                  ) : pdfError ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Alert variant="destructive" className="mb-4 max-w-lg rounded-none border border-destructive/50 bg-destructive/10 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-mono text-xs uppercase tracking-wider font-bold">Compilation Failed</AlertTitle>
                        <AlertDescription className="mt-1 text-xs">{pdfError}</AlertDescription>
                      </Alert>
                      <button 
                        onClick={compilePdf} 
                        className="px-4 py-2 bg-emerald-500 text-black font-semibold text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Retry Compilation
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                      <FileText className="w-8 h-8 opacity-40" />
                      <p className="font-mono text-xs uppercase tracking-wider">
                        PDF artifact pending compilation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LaTeX Code Tab */}
            {activeTab === "latex" && (
              <div>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <button
                    onClick={copyToClipboard}
                    disabled={!latexCode}
                    className={cn(
                      "px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 transition-colors",
                      copied
                        ? "bg-emerald-500 text-black font-bold"
                        : "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                    )}
                  >
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Code"}
                  </button>

                  <button
                    onClick={downloadLatexFile}
                    disabled={!latexCode}
                    className="px-4 py-2 border border-border hover:border-foreground/40 bg-card text-foreground font-mono text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .tex
                  </button>
                </div>

                <div className="border border-border bg-background">
                  {latexCode ? (
                    <pre className="p-4 overflow-auto max-h-[65vh] text-xs font-mono text-foreground leading-relaxed">
                      {latexCode}
                    </pre>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground font-mono text-xs uppercase">
                      No LaTeX source available.
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-muted/30 border border-border flex gap-3 items-start">
                  <Terminal size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-bold text-foreground font-mono uppercase tracking-wider mb-1">
                      Local / Overleaf Compilation
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The generated LaTeX code compiles cleanly with <span className="font-mono text-foreground font-bold">pdflatex</span> or <span className="font-mono text-foreground font-bold">xelatex</span> engines. You can paste this code directly into Overleaf or compile using any standard TeX distribution.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
