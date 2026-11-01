"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  FileText,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import { HatchedBlock, CadCrosshair, CrisscrossBox, StraightLinePattern } from "./CadAccents";

export default function PipelineFlowSection() {
  // 4 Execution Stages:
  // 0 = Agent 01 active
  // 1 = Agent 02 active
  // 2 = Level 3 (Agents 03, 04, 05 in parallel) active
  // 3 = Agent 06 active
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="pipeline"
      aria-label="6-Agent Autonomous Pipeline Architecture"
      className="relative bg-background text-foreground w-full overflow-hidden"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-12 sm:pt-32 sm:pb-14">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            PIPELINE ARCHITECTURE
          </span>
          <HatchedBlock className="hidden sm:block opacity-60 ml-1" />
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              6-agent autonomous pipeline
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              From role discovery to scoring, parallel asset synthesis, and automated application.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <CrisscrossBox size="w-8 h-8 hidden sm:block" />
            <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-foreground font-semibold">
                STAGE {activeStage + 1} OF 4 ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main DAG Graph Canvas: Perfectly Center-Aligned, Roomy Cards, Seamless Connected Flow */}
      <div className="border-t border-border/80 w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-x-auto flex justify-center">
        <div className="flex items-center justify-center min-w-max mx-auto select-none h-[312px]">
          {/* ================= LEVEL 1: Agent 01 (Job Search) ================= */}
          <div className="w-[230px] lg:w-[250px] xl:w-[270px] h-[170px] shrink-0 flex flex-col justify-center relative">
            <div
              onClick={() => setActiveStage(0)}
              className={`h-full relative border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 0
                  ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-current/20 opacity-70">
                <span className="font-bold">AGENT 01</span>
                <span>STAGE 01</span>
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border ${
                    activeStage === 0
                      ? "border-background bg-background text-foreground"
                      : "border-border bg-muted/40 text-foreground"
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold leading-tight">Job Search</h3>
              </div>

              <p className="border-t border-current/20 pt-2 text-[11px] sm:text-xs leading-relaxed opacity-85">
                Search for relevant jobs according to users&apos; profiles and target criteria.
              </p>
            </div>
          </div>

          {/* ================= CONNECTOR 1: Seamless Line from Level 1 to Level 2 ================= */}
          <div className="w-[50px] sm:w-[65px] lg:w-[80px] xl:w-[96px] h-[312px] shrink-0 relative z-0">
            <svg
              className="w-full h-full overflow-visible block"
              viewBox="0 0 100 312"
              preserveAspectRatio="none"
            >
              {/* Output port on Level 1 right border */}
              <circle
                cx="0"
                cy="156"
                r="3.5"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />

              {/* Connecting line spanning edge to edge */}
              <line
                x1="0"
                y1="156"
                x2="100"
                y2="156"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 0 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 0 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />

              {/* Arrowhead landing precisely touching Level 2 border */}
              <polygon points="88,152 100,156 88,160" className="fill-foreground" />
            </svg>
          </div>

          {/* ================= LEVEL 2: Agent 02 (Fit & Scoring) ================= */}
          <div className="w-[230px] lg:w-[250px] xl:w-[270px] h-[170px] shrink-0 flex flex-col justify-center relative">
            <div
              onClick={() => setActiveStage(1)}
              className={`h-full relative border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 1
                  ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-current/20 opacity-70">
                <span className="font-bold">AGENT 02</span>
                <span>STAGE 02</span>
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border ${
                    activeStage === 1
                      ? "border-background bg-background text-foreground"
                      : "border-border bg-muted/40 text-foreground"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold leading-tight">Fit &amp; Scoring</h3>
              </div>

              <p className="border-t border-current/20 pt-2 text-[11px] sm:text-xs leading-relaxed opacity-85">
                Score each searched job against your profile and rank them by fit score.
              </p>
            </div>
          </div>

          {/* ================= CONNECTOR 2: 3 DIRECT ARROWS from Level 2 to Level 3 ================= */}
          <div className="w-[50px] sm:w-[65px] lg:w-[80px] xl:w-[96px] h-[312px] shrink-0 relative z-0">
            <svg
              className="w-full h-full overflow-visible block"
              viewBox="0 0 100 312"
              preserveAspectRatio="none"
            >
              {/* Output port on Level 2 right border */}
              <circle
                cx="0"
                cy="156"
                r="3.5"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />

              {/* Arrow 1: Branch to Agent 03 (y=48) */}
              <path
                d="M 0,156 C 45,156 55,48 100,48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 1 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 1 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />
              <polygon points="88,44 100,48 88,52" className="fill-foreground" />

              {/* Arrow 2: Direct horizontal to Agent 04 (y=156) */}
              <line
                x1="0"
                y1="156"
                x2="100"
                y2="156"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 1 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 1 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />
              <polygon points="88,152 100,156 88,160" className="fill-foreground" />

              {/* Arrow 3: Branch to Agent 05 (y=264) */}
              <path
                d="M 0,156 C 45,156 55,264 100,264"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 1 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 1 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />
              <polygon points="88,260 100,264 88,268" className="fill-foreground" />
            </svg>
          </div>

          {/* ================= LEVEL 3: 3 AGENTS STACKED ON SEPARATE LINES ================= */}
          <div className="w-[230px] lg:w-[250px] xl:w-[270px] h-[312px] shrink-0 grid grid-rows-3 gap-3 relative">
            {/* Agent 03: ATS Resume */}
            <div
              onClick={() => setActiveStage(2)}
              className={`h-full relative border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 2
                  ? "border-foreground bg-foreground text-background shadow-md scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] opacity-70">
                <span className="font-bold">AGENT 03</span>
                <span>RESUME</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold leading-tight truncate">ATS Resume</h4>
              </div>
              <p className="border-t border-current/20 pt-1 text-[10.5px] leading-snug opacity-85">
                Generate a resume from a JD, 100% in LaTeX.
              </p>
            </div>

            {/* Agent 04: Cover Letter */}
            <div
              onClick={() => setActiveStage(2)}
              className={`h-full relative border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 2
                  ? "border-foreground bg-foreground text-background shadow-md scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] opacity-70">
                <span className="font-bold">AGENT 04</span>
                <span>COVER LETTER</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold leading-tight truncate">Cover Letter</h4>
              </div>
              <p className="border-t border-current/20 pt-1 text-[10.5px] leading-snug opacity-85">
                Generate a cover letter according to the company.
              </p>
            </div>

            {/* Agent 05: Outreach Email */}
            <div
              onClick={() => setActiveStage(2)}
              className={`h-full relative border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 2
                  ? "border-foreground bg-foreground text-background shadow-md scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] opacity-70">
                <span className="font-bold">AGENT 05</span>
                <span>OUTREACH</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold leading-tight truncate">Recruiter Email</h4>
              </div>
              <p className="border-t border-current/20 pt-1 text-[10.5px] leading-snug opacity-85">
                Write a personalized email for outreach.
              </p>
            </div>
          </div>

          {/* ================= CONNECTOR 3: 3 DIRECT LINES CONVERGING TO LEVEL 4 ================= */}
          <div className="w-[50px] sm:w-[65px] lg:w-[80px] xl:w-[96px] h-[312px] shrink-0 relative z-0">
            <svg
              className="w-full h-full overflow-visible block"
              viewBox="0 0 100 312"
              preserveAspectRatio="none"
            >
              {/* Output port on Agent 03 right border */}
              <circle
                cx="0"
                cy="48"
                r="3.5"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />

              {/* Output port on Agent 04 right border */}
              <circle
                cx="0"
                cy="156"
                r="3.5"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />

              {/* Output port on Agent 05 right border */}
              <circle
                cx="0"
                cy="264"
                r="3.5"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />

              {/* Line 1 from Agent 03 (y=48) to Level 4 (y=156) */}
              <path
                d="M 0,48 C 45,48 55,156 100,156"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 2 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 2 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />

              {/* Line 2 from Agent 04 (y=156) to Level 4 (y=156) */}
              <line
                x1="0"
                y1="156"
                x2="100"
                y2="156"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 2 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 2 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />

              {/* Line 3 from Agent 05 (y=264) to Level 4 (y=156) */}
              <path
                d="M 0,264 C 45,264 55,156 100,156"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={activeStage === 2 ? "4 3" : "none"}
                className={`text-foreground transition-all duration-300 ${
                  activeStage === 2 ? "animate-[flow-dash_1s_linear_infinite]" : "opacity-40"
                }`}
              />

              {/* Arrowhead landing precisely touching Level 4 border */}
              <polygon points="88,152 100,156 88,160" className="fill-foreground" />
            </svg>
          </div>

          {/* ================= LEVEL 4: Agent 06 (Autonomous Apply) ================= */}
          <div className="w-[230px] lg:w-[250px] xl:w-[270px] h-[170px] shrink-0 flex flex-col justify-center relative">
            <div
              onClick={() => setActiveStage(3)}
              className={`h-full relative border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStage === 3
                  ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02] z-10"
                  : "border-border/80 bg-card hover:border-foreground/60 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-current/20 opacity-70">
                <span className="font-bold">AGENT 06</span>
                <span>STAGE 04</span>
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border ${
                    activeStage === 3
                      ? "border-background bg-background text-foreground"
                      : "border-border bg-muted/40 text-foreground"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold leading-tight">Autonomous Apply</h3>
              </div>

              <p className="border-t border-current/20 pt-2 text-[11px] sm:text-xs leading-relaxed opacity-85">
                Apply automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Precision CAD telemetry baseline */}
      <div className="w-full border-t border-b border-border/80 bg-muted/10 px-6 sm:px-12 lg:px-16 xl:px-24 py-2.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground/70">+ DAG PIPELINE</span>
          <div className="w-6 h-[1px] bg-border/80" />
          <span className="hidden sm:inline">6-AGENT ORCHESTRATION GRAPH</span>
        </div>
        <div className="flex items-center gap-3">
          <StraightLinePattern direction="horizontal" size="w-10 h-2.5 opacity-60" />
          <span className="font-semibold text-foreground/80">PARALLEL SYNTHESIS</span>
        </div>
      </div>
    </section>
  );
}
