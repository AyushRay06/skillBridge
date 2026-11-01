"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, FileText, Clock, FileCheck, Mail, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { HatchedBlock, CadCrosshair, StraightLinePattern, CadStraightLineBorder } from "./CadAccents";

/**
 * CadPipelineSchematic
 * Inactive state for Feature 01 (End-to-End Application Pipeline).
 * Constructed with 100% straight lines, CAD geometry, and zero text.
 */
function CadPipelineSchematic() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center p-6 select-none pointer-events-none overflow-hidden"
    >
      {/* Background Engineering Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      <svg
        viewBox="0 0 200 260"
        className="w-48 h-60 text-foreground/40 relative z-10"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Boundary Frame with 45° Corner Notches */}
        <polygon
          points="20,20 180,20 190,30 190,230 180,240 20,240 10,230 10,30"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        <rect x="18" y="28" width="164" height="204" strokeWidth="0.8" opacity="0.4" />

        {/* Perimeter Calibration Ticks */}
        <line x1="50" y1="20" x2="50" y2="24" strokeWidth="0.8" opacity="0.6" />
        <line x1="100" y1="20" x2="100" y2="26" strokeWidth="1" opacity="0.8" />
        <line x1="150" y1="20" x2="150" y2="24" strokeWidth="0.8" opacity="0.6" />
        <line x1="50" y1="240" x2="50" y2="236" strokeWidth="0.8" opacity="0.6" />
        <line x1="100" y1="240" x2="100" y2="234" strokeWidth="1" opacity="0.8" />
        <line x1="150" y1="240" x2="150" y2="236" strokeWidth="0.8" opacity="0.6" />

        {/* Central Vertical Tracing Bus */}
        <line x1="100" y1="36" x2="100" y2="224" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

        {/* Stage 1: Pipeline Search Node (Top Octagon) */}
        <polygon
          points="100,42 124,52 134,70 124,88 100,98 76,88 66,70 76,52"
          strokeWidth="1.4"
          strokeLinejoin="miter"
          opacity="0.85"
        />
        <polygon
          points="100,50 118,58 126,70 118,82 100,90 82,82 74,70 82,58"
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.75"
        />
        <line x1="84" y1="70" x2="116" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.8" />
        <line x1="100" y1="54" x2="100" y2="86" stroke="#10b981" strokeWidth="1" opacity="0.8" />

        {/* Bus Trace from Stage 1 to Stage 2 */}
        <line x1="100" y1="98" x2="100" y2="118" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />
        <polyline points="94,112 100,118 106,112" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />

        {/* Stage 2: Fit Evaluation Diamond (Middle) */}
        <polygon
          points="100,120 136,145 100,170 64,145"
          strokeWidth="1.6"
          strokeLinejoin="miter"
          opacity="0.9"
        />
        <polygon
          points="100,128 126,145 100,162 74,145"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.7"
        />
        {/* Horizontal straight hatch lines inside Diamond */}
        <line x1="82" y1="140" x2="118" y2="140" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="82" y1="150" x2="118" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="92" y1="135" x2="108" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="92" y1="155" x2="108" y2="155" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

        {/* Lateral Expansion Traces */}
        <polyline points="64,145 42,145 42,165" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <polyline points="136,145 158,145 158,165" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="40" y1="165" x2="44" y2="165" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
        <line x1="156" y1="165" x2="160" y2="165" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />

        {/* Bus Trace from Stage 2 to Stage 3 */}
        <line x1="100" y1="170" x2="100" y2="190" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />
        <polyline points="94,184 100,190 106,184" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />

        {/* Stage 3: Auto-Dispatch Terminal (Bottom Box) */}
        <polygon
          points="62,192 138,192 146,200 146,220 138,228 62,228 54,220 54,200"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <line x1="64" y1="202" x2="136" y2="202" stroke="#10b981" strokeWidth="1" opacity="0.75" />
        <line x1="64" y1="210" x2="120" y2="210" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
        <line x1="64" y1="218" x2="104" y2="218" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
      </svg>

      {/* 4 Corner Reticles */}
      <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
    </div>
  );
}

/**
 * CadResumeSchematic
 * Inactive state for Feature 02 (Instant JD Resume Generator).
 * Constructed with 100% straight lines, CAD geometry, and zero text.
 */
function CadResumeSchematic() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center p-6 select-none pointer-events-none overflow-hidden"
    >
      {/* Background Engineering Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      <svg
        viewBox="0 0 200 260"
        className="w-48 h-60 text-foreground/40 relative z-10"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Boundary Frame */}
        <polygon
          points="20,20 180,20 190,30 190,230 180,240 20,240 10,230 10,30"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        <rect x="18" y="28" width="164" height="204" strokeWidth="0.8" opacity="0.4" />

        {/* LaTeX Document Perimeter Sheet */}
        <polygon
          points="46,38 134,38 154,58 154,222 46,222"
          strokeWidth="1.6"
          strokeLinejoin="miter"
          opacity="0.9"
        />
        {/* Folded Corner Dog-Ear */}
        <polyline points="134,38 134,58 154,58" strokeWidth="1.2" opacity="0.85" />
        <line x1="134" y1="58" x2="154" y2="38" stroke="#10b981" strokeWidth="0.8" opacity="0.6" />

        {/* ATS Resume Header Block */}
        <line x1="58" y1="52" x2="118" y2="52" stroke="#10b981" strokeWidth="1.8" opacity="0.9" />
        <line x1="58" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
        <line x1="58" y1="68" x2="142" y2="68" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />

        {/* Section 1: Summary / Profile */}
        <line x1="58" y1="80" x2="88" y2="80" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
        <line x1="58" y1="88" x2="142" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="58" y1="94" x2="134" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="58" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

        {/* Section 2: Experience / Verified Metrics */}
        <line x1="58" y1="114" x2="98" y2="114" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
        <line x1="58" y1="122" x2="142" y2="122" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="66" y1="130" x2="138" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="66" y1="136" x2="128" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="58" y1="146" x2="142" y2="146" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="66" y1="154" x2="136" y2="154" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="66" y1="160" x2="116" y2="160" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

        {/* Section 3: Technical Competencies / ATS Matrix */}
        <line x1="58" y1="174" x2="84" y2="174" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
        {/* ATS Keyword Check Chips (Straight Rectangles) */}
        <rect x="58" y="182" width="22" height="7" stroke="#10b981" strokeWidth="0.8" opacity="0.75" />
        <rect x="85" y="182" width="26" height="7" stroke="#10b981" strokeWidth="0.8" opacity="0.75" />
        <rect x="116" y="182" width="22" height="7" stroke="#10b981" strokeWidth="0.8" opacity="0.75" />

        <rect x="58" y="193" width="28" height="7" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <rect x="91" y="193" width="20" height="7" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <rect x="116" y="193" width="26" height="7" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

        {/* LaTeX Compilation Seal / Checkmark Ticks at bottom */}
        <line x1="58" y1="210" x2="142" y2="210" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" />
        <polyline points="134,214 138,218 144,212" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
      </svg>

      {/* 4 Corner Reticles */}
      <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
    </div>
  );
}

/**
 * CadCadenceSchematic
 * Inactive state for Feature 03 (Scheduled Agent Automation).
 * Constructed with 100% straight lines, CAD geometry, and zero text.
 */
function CadCadenceSchematic() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center p-6 select-none pointer-events-none overflow-hidden"
    >
      {/* Background Engineering Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      <svg
        viewBox="0 0 200 260"
        className="w-48 h-60 text-foreground/40 relative z-10"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Boundary Frame */}
        <polygon
          points="20,20 180,20 190,30 190,230 180,240 20,240 10,230 10,30"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        <rect x="18" y="28" width="164" height="204" strokeWidth="0.8" opacity="0.4" />

        {/* Central Crosshair Hairline Axes */}
        <line x1="26" y1="130" x2="174" y2="130" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
        <line x1="100" y1="36" x2="100" y2="224" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

        {/* Concentric Faceted CAD Octagons (Radar Cadence Dial) */}
        <polygon
          points="100,56 142,72 166,110 166,150 142,188 100,204 58,188 34,150 34,110 58,72"
          strokeWidth="1.4"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        <polygon
          points="100,68 134,82 154,114 154,146 134,178 100,192 66,178 46,146 46,114 66,82"
          strokeWidth="1.2"
          opacity="0.75"
        />
        <polygon
          points="100,82 126,94 140,118 140,142 126,166 100,178 74,166 60,142 60,118 74,94"
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Radiating 12 Cardinal CAD Straight Ticks */}
        <line x1="100" y1="68" x2="100" y2="78" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />
        <line x1="100" y1="192" x2="100" y2="182" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />
        <line x1="46" y1="130" x2="56" y2="130" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />
        <line x1="154" y1="130" x2="144" y2="130" stroke="#10b981" strokeWidth="1.5" opacity="0.85" />

        <line x1="62" y1="92" x2="70" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="138" y1="92" x2="130" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="62" y1="168" x2="70" y2="160" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="138" y1="168" x2="130" y2="160" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

        {/* Precision Clockwork Vectors (12:00 and 03:00 Agent Cadence) */}
        <line x1="100" y1="130" x2="100" y2="86" stroke="#10b981" strokeWidth="2" opacity="0.9" />
        <polyline points="96,92 100,86 104,92" stroke="#10b981" strokeWidth="1.5" opacity="0.9" />

        <line x1="100" y1="130" x2="134" y2="130" stroke="currentColor" strokeWidth="1.8" opacity="0.85" />
        <polyline points="128,126 134,130 128,134" stroke="currentColor" strokeWidth="1.4" opacity="0.85" />

        {/* Center Pivot Reticle */}
        <polygon points="100,126 104,130 100,134 96,130" fill="#10b981" stroke="#10b981" strokeWidth="1" />
      </svg>

      {/* 4 Corner Reticles */}
      <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
    </div>
  );
}

/**
 * CadMicroSchematic
 * Inactive states for Row 2 Micro Feature Boxes.
 * Constructed with 100% straight lines, CAD geometry, and zero text.
 */
function CadMicroSchematic({ type }: { type: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center p-6 select-none pointer-events-none overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />

      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 text-foreground/40 relative z-10"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Frame with Corner Ticks */}
        <rect x="16" y="16" width="128" height="128" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
        <rect x="24" y="24" width="112" height="112" strokeWidth="1" opacity="0.6" />

        {/* Center axes */}
        <line x1="24" y1="80" x2="136" y2="80" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" />
        <line x1="80" y1="24" x2="80" y2="136" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" />

        {type === 0 && (
          // ATS Resume Micro Glyph
          <>
            <polygon points="52,40 100,40 112,52 112,120 52,120" strokeWidth="1.4" opacity="0.85" />
            <polyline points="100,40 100,52 112,52" strokeWidth="1" opacity="0.8" />
            <line x1="60" y1="52" x2="92" y2="52" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
            <line x1="60" y1="64" x2="104" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="60" y1="74" x2="98" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="60" y1="84" x2="104" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="60" y1="94" x2="88" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <polyline points="96,104 100,108 106,102" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
          </>
        )}

        {type === 1 && (
          // Cover Letter Micro Glyph
          <>
            <polygon points="44,48 116,48 122,54 122,112 44,112" strokeWidth="1.4" opacity="0.85" />
            <polyline points="44,48 80,82 116,48" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
            <line x1="56" y1="86" x2="104" y2="86" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="56" y1="94" x2="96" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="56" y1="102" x2="84" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          </>
        )}

        {type === 2 && (
          // Email Outreach Signal Micro Glyph
          <>
            <polygon points="80,44 116,68 116,92 80,116 44,92 44,68" strokeWidth="1.4" opacity="0.85" />
            <line x1="44" y1="80" x2="116" y2="80" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
            <line x1="80" y1="44" x2="80" y2="116" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
            <line x1="56" y1="62" x2="104" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
            <line x1="56" y1="98" x2="104" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
          </>
        )}
      </svg>

      <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
    </div>
  );
}

export default function Features() {
  const [hoveredMain, setHoveredMain] = useState<string | null>(null);
  const [hoveredMicro, setHoveredMicro] = useState<string | null>(null);

  const mainFeatures = [
    {
      id: "pipeline",
      tag: "01 // PIPELINE",
      icon: Bot,
      title: "End-to-End Application Pipeline",
      desc: "Searches for verified job openings matching your profile, evaluates match fit, and automatically submits applications on your behalf.",
      spec: "SEARCH → FIT SCORE → AUTO-APPLY",
      cta: { label: "Deploy Pipeline", href: "/autopilot" },
    },
    {
      id: "atomic-resume",
      tag: "02 // ATOMIC SYNTHESIS",
      icon: FileText,
      title: "Instant JD Resume Generator",
      desc: "Paste any job description to instantly compile a tailored, ATS-friendly LaTeX resume aligned with the role's exact keywords.",
      spec: "PASTE JOB DESCRIPTION → LATEX PDF",
      cta: { label: "Generate Resume", href: "/apply" },
    },
    {
      id: "scheduling",
      tag: "03 // SCHEDULING",
      icon: Clock,
      title: "Scheduled Agent Automation",
      desc: "Create autonomous agents and schedule background tasks to continuously discover openings and dispatch applications on your cadence.",
      spec: "CREATE AGENTS → SCHEDULE CADENCE",
      cta: { label: "Schedule Tasks", href: "/dashboard" },
    },
  ];

  const microFeatures = [
    {
      tag: "MICRO // 01",
      title: "ATS-Friendly Resumes",
      desc: "Structured in clean LaTeX with verified keyword density to pass Greenhouse, Lever, and Workday ATS filters.",
      icon: FileCheck,
    },
    {
      tag: "MICRO // 02",
      title: "ATS-Compatible Cover Letters",
      desc: "Synthesized directly from your background and the target job description with zero generic filler.",
      icon: CheckCircle2,
    },
    {
      tag: "MICRO // 03",
      title: "Personalized Email Outreach",
      desc: "Concise, context-rich cold emails written directly for recruiters and engineering decision-makers.",
      icon: Mail,
    },
  ];

  return (
    <section
      id="features"
      aria-label="Core Platform Capabilities"
      className="relative bg-background text-foreground w-full"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-14 sm:pt-32 sm:pb-18">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            CORE PLATFORM
          </span>
          <HatchedBlock className="hidden sm:block opacity-60 ml-1" />
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              The ultimate career platform
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Autonomous multi-agent infrastructure designed to search, tailor, and apply on autopilot.
            </p>
          </div>

          {/* Extended CAD Straight-Line Grid Combination (No Text) */}
          <div className="flex items-center border border-border/80 bg-muted/10 divide-x divide-border/80 h-9 self-start md:self-auto select-none overflow-hidden">
            <div
              className="w-20 sm:w-28 h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "6px 6px",
              }}
            />
            <div
              className="w-14 sm:w-18 h-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 3px, var(--border) 3px, var(--border) 4px)",
              }}
            />
            <div
              className="w-10 h-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)",
              }}
            />
            <div className="w-9 h-full flex items-center justify-center font-mono text-[11px] font-bold text-foreground/50">
              +
            </div>
          </div>
        </div>
      </div>

      {/* Main CAD Box System with Shared Overlapping Borders & Blueprint Focus Mode */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          
          {/* Continuous Shared-Border Framework */}
          <div className="border-x border-b border-border/80 relative bg-background">

            {/* ======================================================== */}
            {/* ROW 1: Main 3 Core Boxes (Shared Overlapping Borders)    */}
            {/* ======================================================== */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/80 border-b border-border/80 relative"
              onMouseLeave={() => setHoveredMain(null)}
            >
              {mainFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                const isHovered = hoveredMain === feature.id;
                const isInactive = hoveredMain !== null && !isHovered;

                return (
                  <div
                    key={feature.id}
                    onMouseEnter={() => setHoveredMain(feature.id)}
                    className={`group relative overflow-hidden flex flex-col justify-between p-10 sm:p-14 lg:p-16 min-h-[440px] sm:min-h-[480px] transition-all duration-300 ease-out cursor-default ${
                      isHovered
                        ? "-translate-y-1 shadow-md bg-card/60"
                        : isInactive
                        ? "bg-muted/5 opacity-85"
                        : "hover:bg-muted/10"
                    }`}
                  >
                    {/* Hovered Card: Subtle light greenish-emerald border of straight-line combinations (same as pricing) */}
                    {isHovered && <CadStraightLineBorder />}

                    {/* Inactive Blueprint Schematic (100% straight lines, zero text) */}
                    {isInactive && (
                      idx === 0 ? <CadPipelineSchematic /> :
                      idx === 1 ? <CadResumeSchematic /> :
                      <CadCadenceSchematic />
                    )}

                    {/* Card Content: Smoothly visible when active/idle, fades out when inactive */}
                    <div
                      className={`relative z-10 flex flex-col justify-between h-full transition-opacity duration-300 ${
                        isInactive ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      <div>
                        {/* Top Tag & Icon Row with Generous Margins */}
                        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-8 pb-4 border-b border-border/60 transition-colors duration-300 group-hover:border-foreground/30">
                          <div className="flex items-center gap-2">
                            <span className="tracking-wider group-hover:text-foreground transition-colors duration-300">
                              {feature.tag}
                            </span>
                            <span className="w-1.5 h-1.5 bg-emerald-500/70 inline-block transition-transform duration-300 group-hover:scale-125" />
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground transition-all duration-300 group-hover:border-emerald-500/80 group-hover:bg-emerald-500/10 group-hover:scale-105">
                            <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-400" />
                          </div>
                        </div>

                        {/* Title with Spacious Breathing Room */}
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-5 leading-snug transition-colors duration-200">
                          {feature.title}
                        </h3>

                        {/* Description with Open Line Height */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-10 group-hover:text-foreground/90 transition-colors duration-300">
                          {feature.desc}
                        </p>

                        {/* Monospace Execution Spec */}
                        <div className="font-mono text-[11px] text-foreground/80 mb-10 border-t border-border/60 pt-4 flex items-center gap-2.5 transition-colors duration-300 group-hover:border-foreground/30">
                          <span className="h-0.5 bg-emerald-500 inline-block transition-all duration-300 w-2 group-hover:w-5 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          <span className="tracking-wide group-hover:text-foreground transition-colors duration-200">
                            {feature.spec}
                          </span>
                        </div>
                      </div>

                      {/* CTA Link Grounded at the Bottom */}
                      <div className="relative z-10 pt-4 mt-auto">
                        <Link
                          href={feature.cta.href}
                          className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-80 group-hover:translate-x-1.5 transition-transform duration-200 cursor-pointer"
                        >
                          <span>{feature.cta.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Top Intersection Reticles (+) */}
              <CadCrosshair className="absolute -top-2 -left-2" />
              <CadCrosshair className="absolute -top-2 -right-2" />
              <CadCrosshair className="absolute -top-2 left-1/3 -translate-x-1/2 hidden lg:block" />
              <CadCrosshair className="absolute -top-2 left-2/3 -translate-x-1/2 hidden lg:block" />
            </div>

            {/* ======================================================== */}
            {/* INTERSTITIAL SHARED-BORDER STRAIGHT-LINE & GRID BAND     */}
            {/* ======================================================== */}
            <div className="border-b border-border/80 bg-muted/10 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/80 relative min-h-[40px]">
              
              {/* Segment 1: Orthogonal Engineering Grid */}
              <div
                className="col-span-12 md:col-span-4 h-9 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}
              />

              {/* Segment 2: Repeating Straight Parallel Lines */}
              <div
                className="col-span-12 md:col-span-4 h-9 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 3px, var(--border) 3px, var(--border) 4px)",
                }}
              />

              {/* Segment 3: 45° CAD Hatch Matrix */}
              <div
                className="col-span-12 md:col-span-4 h-9 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 5px, var(--border) 5px, var(--border) 6px)",
                }}
              />

              {/* Mid-Row Intersection Reticles (+) */}
              <CadCrosshair className="absolute -top-2 left-1/3 -translate-x-1/2 hidden md:block" />
              <CadCrosshair className="absolute -top-2 left-2/3 -translate-x-1/2 hidden md:block" />
              <CadCrosshair className="absolute -bottom-2 left-1/3 -translate-x-1/2 hidden md:block" />
              <CadCrosshair className="absolute -bottom-2 left-2/3 -translate-x-1/2 hidden md:block" />
            </div>

            {/* ======================================================== */}
            {/* ROW 2: Micro 3 Capability Boxes (Shared Overlapping Borders) */}
            {/* ======================================================== */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80 bg-muted/5 relative"
              onMouseLeave={() => setHoveredMicro(null)}
            >
              {microFeatures.map((micro, idx) => {
                const Icon = micro.icon;
                const isHovered = hoveredMicro === micro.tag;
                const isInactive = hoveredMicro !== null && !isHovered;

                return (
                  <div
                    key={micro.tag}
                    onMouseEnter={() => setHoveredMicro(micro.tag)}
                    className={`group relative overflow-hidden flex flex-col justify-between p-10 sm:p-12 lg:p-14 min-h-[300px] sm:min-h-[340px] transition-all duration-300 ease-out cursor-default ${
                      isHovered
                        ? "-translate-y-1 shadow-md bg-card/60"
                        : isInactive
                        ? "bg-muted/5 opacity-85"
                        : "hover:bg-muted/10"
                    }`}
                  >
                    {/* Hovered Card: Subtle light greenish-emerald border of straight-line combinations (same as pricing) */}
                    {isHovered && <CadStraightLineBorder />}

                    {/* Inactive Blueprint Schematic for Micro Cards */}
                    {isInactive && <CadMicroSchematic type={idx} />}

                    <div
                      className={`relative z-10 flex flex-col justify-between h-full transition-opacity duration-300 ${
                        isInactive ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      <div>
                        {/* Top Row: Tag & Icon */}
                        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-6 pb-3 border-b border-border/60 transition-colors duration-200 group-hover:text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{micro.tag}</span>
                            <span className="w-1.5 h-1.5 bg-border group-hover:bg-emerald-500 transition-colors" />
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all duration-300 group-hover:border-foreground group-hover:scale-105">
                            <Icon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-emerald-400 group-hover:scale-110" />
                          </div>
                        </div>

                        {/* Micro Feature Title */}
                        <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-snug transition-colors duration-200">
                          {micro.title}
                        </h4>

                        {/* Micro Feature Description */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
                          {micro.desc}
                        </p>
                      </div>

                      {/* Bottom Straight Line Accent on Micro Cards (No Text) */}
                      <div className="relative z-10 mt-8 border-t border-border/40" />
                    </div>
                  </div>
                );
              })}

              {/* Bottom Intersection Reticles (+) */}
              <CadCrosshair className="absolute -bottom-2 -left-2" />
              <CadCrosshair className="absolute -bottom-2 -right-2" />
              <CadCrosshair className="absolute -bottom-2 left-1/3 -translate-x-1/2 hidden md:block" />
              <CadCrosshair className="absolute -bottom-2 left-2/3 -translate-x-1/2 hidden md:block" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
