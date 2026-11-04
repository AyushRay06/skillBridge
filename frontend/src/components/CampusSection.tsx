"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Brain,
  Layers,
} from "lucide-react";
import { HatchedBlock, CadCrosshair, StraightLinePattern, CadStraightLineBorder } from "./CadAccents";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

export default function CampusSection() {
  const { t } = useLandingLanguage();
  const [showHint, setShowHint] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const campusCards = [
    {
      tag: t.campus.c1.tag,
      title: t.campus.c1.title,
      desc: t.campus.c1.desc,
      spec: t.campus.c1.spec,
      cta: { label: t.campus.c1.cta, href: "/career-guide" },
      icon: Award,
    },
    {
      tag: t.campus.c2.tag,
      title: t.campus.c2.title,
      desc: t.campus.c2.desc,
      spec: t.campus.c2.spec,
      cta: { label: t.campus.c2.cta, href: "/career-guide" },
      icon: Brain,
    },
    {
      tag: t.campus.c3.tag,
      title: t.campus.c3.title,
      desc: t.campus.c3.desc,
      spec: t.campus.c3.spec,
      cta: { label: t.campus.c3.cta, href: "/career-guide" },
      icon: Layers,
    },
  ];

  return (
    <section
      id="campus"
      aria-label="Career Campus and Placement Readiness Platform"
      className="relative bg-background text-foreground w-full overflow-hidden"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-14 sm:pt-32 sm:pb-18">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {t.campus.sectionTag}
          </span>
          <HatchedBlock className="hidden sm:block opacity-60 ml-1" />
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {t.campus.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t.campus.subheading}
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20 self-start md:self-auto select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-foreground font-semibold">
              PLACEMENT RADAR ACTIVE // 42+ INSTITUTIONS
            </span>
          </div>
        </div>
      </div>

      {/* Main CAD Dual Simulator Console */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          <div className="border-x border-b border-border/80 relative bg-background">
            
            {/* Top Engineering Calibration Strip */}
            <div className="border-b border-border/80 bg-muted/10 px-6 py-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground select-none">
              <div className="flex items-center gap-3">
                <span className="text-foreground font-bold">SYSTEM TELEMETRY:</span>
                <span>CAMPUS_ENGINE_v4.2</span>
                <span className="text-border">//</span>
                <span>BILINGUAL ADVISORY: ACTIVE</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>LATENCY: 140ms</span>
                <span className="text-border">//</span>
                <span>SCORE CONFIDENCE: 98.4%</span>
              </div>
            </div>

            {/* Main Interactive Dual Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/80 relative">
              
              {/* Left Column (7 cols): Placement Readiness Simulator */}
              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-background">
                <div>
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-6 font-mono text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold text-foreground uppercase tracking-wider">
                        {t.campus.readinessTitle}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      Tier 1 Ready
                    </span>
                  </div>

                  {/* Primary Readiness Score Visual */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-8">
                    {/* Big Percentage Number & Radial Frame */}
                    <div className="sm:col-span-5 border border-border/80 bg-muted/15 p-6 flex flex-col items-center justify-center text-center relative">
                      <CadCrosshair className="absolute top-1 left-1 opacity-50" size="text-[8px]" />
                      <CadCrosshair className="absolute top-1 right-1 opacity-50" size="text-[8px]" />
                      <CadCrosshair className="absolute bottom-1 left-1 opacity-50" size="text-[8px]" />
                      <CadCrosshair className="absolute bottom-1 right-1 opacity-50" size="text-[8px]" />
                      
                      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                        Composite Readiness
                      </div>
                      <div className="text-5xl sm:text-6xl font-black font-heading text-foreground tracking-tight">
                        87<span className="text-emerald-500 text-3xl">%</span>
                      </div>
                      <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        +14% vs Cohort Mean
                      </div>
                    </div>

                    {/* Breakdown Progress Bars */}
                    <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span>Core Tech Skill Match</span>
                          <span className="font-bold text-foreground">92%</span>
                        </div>
                        <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: "92%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span>ATS LaTeX Resume Score</span>
                          <span className="font-bold text-foreground">96%</span>
                        </div>
                        <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: "96%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span>Mock Interview Readiness</span>
                          <span className="font-bold text-foreground">88%</span>
                        </div>
                        <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: "88%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span>Roadmap Milestones Done</span>
                          <span className="font-bold text-foreground">75%</span>
                        </div>
                        <div className="w-full h-2 bg-muted border border-border/80 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: "75%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skill Gap Analysis Console */}
                  <div className="border border-border/80 bg-muted/10 p-5 mb-8">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                      <span>Target Role: Full-Stack Engineer</span>
                      <span className="text-emerald-500">Verified by SkillBridge</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Matched Skills (Ready)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {["React.js", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Tailwind"].map((s) => (
                            <span key={s} className="px-2 py-0.5 border border-border bg-background text-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3 text-amber-500" />
                          <span>Priority Gap (Roadmap Queued)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {["System Design (Distributed Caching)", "Docker Containers", "Kafka Message Bus"].map((s) => (
                            <span key={s} className="px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Split Action Button */}
                <div className="pt-2">
                  <Link
                    href="/career-guide"
                    className="group inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
                  >
                    <div className="flex items-center justify-center px-3.5 py-3 border-r border-background/20 bg-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-background transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="flex items-center px-6 py-3">
                      Audit Your Campus Readiness Free
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Column (5 cols): Interactive Mock Interview Preview */}
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-muted/5 relative">
                <div>
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-6 font-mono text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Brain className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold text-foreground uppercase tracking-wider">
                        {t.campus.mockTitle}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Q2 of 5
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="border border-border/80 bg-background p-5 mb-4 relative">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                      <span className="text-emerald-500 font-bold">TOPIC: DISTRIBUTED SYSTEMS</span>
                      <span>MEDIUM / HARD</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                      &quot;How would you architect a distributed rate-limiter for 50,000 requests/sec across multi-region clusters?&quot;
                    </p>

                    {/* Hint Toggle */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{showHint ? "Hide AI Interviewer Hint" : "Show AI Interviewer Hint"}</span>
                      </button>

                      {showHint && (
                        <div className="mt-2 p-3 bg-muted/30 border border-border/80 font-mono text-[11px] text-muted-foreground leading-relaxed">
                          Consider Token Bucket vs Leaky Bucket with Redis Sentinel and sliding window timestamps to prevent race conditions.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simulated Candidate Response */}
                  <div className="border border-border/70 bg-muted/20 p-4 mb-4 font-mono text-xs">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">
                      Candidate Voice Transcript (Assamese / English):
                    </div>
                    <p className="text-[11px] text-foreground/90 italic leading-relaxed">
                      &quot;I would implement a sliding window counter using Redis with Lua scripts for atomic increments to avoid race conditions across distributed microservices...&quot;
                    </p>
                  </div>

                  {/* Real-time AI Rubric Scorecard */}
                  <div className="border border-border/80 bg-background p-4 space-y-2 font-mono text-[11px]">
                    <div className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Instant Rubric Scorecard:
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Technical Depth</span>
                      <span className="font-bold text-emerald-500">9.2 / 10</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Problem Solving CoT</span>
                      <span className="font-bold text-emerald-500">8.9 / 10</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Communication & Clarity</span>
                      <span className="font-bold text-emerald-500">9.0 / 10</span>
                    </div>
                    <div className="pt-2 border-t border-border/50 text-[10px] text-muted-foreground leading-normal">
                      Feedback: &quot;Accurately highlighted Redis Lua atomicity. Next step: discuss fallback behavior during network partition.&quot;
                    </div>
                  </div>
                </div>

                {/* Right Action Link */}
                <div className="pt-6 mt-4 border-t border-border/60">
                  <Link
                    href="/career-guide"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-80 transition-opacity"
                  >
                    <span>Launch AI Mock Interview Session</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Interstitial Grid Reticles */}
            <CadCrosshair className="absolute -top-2 -left-2" />
            <CadCrosshair className="absolute -top-2 -right-2" />
            <CadCrosshair className="absolute -bottom-2 -left-2" />
            <CadCrosshair className="absolute -bottom-2 -right-2" />

            {/* Row 2: Three Core Campus Capability Cards */}
            <div className="border-t border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80 bg-background relative">
              {campusCards.map((card, idx) => {
                const Icon = card.icon;
                const isHovered = hoveredCard === idx;

                return (
                  <div
                    key={card.tag}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:bg-muted/10 cursor-default"
                  >
                    {isHovered && <CadStraightLineBorder />}

                    <div>
                      {/* Top Tag & Icon */}
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-6 pb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="tracking-wider group-hover:text-foreground transition-colors">
                            {card.tag}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all duration-300 group-hover:border-foreground">
                          <Icon className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3 leading-snug">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                        {card.desc}
                      </p>

                      {/* Spec hairlines */}
                      <div className="font-mono text-[10px] text-foreground/80 border-t border-border/60 pt-3 flex items-center gap-2">
                        <span className="h-0.5 w-3 bg-emerald-500 inline-block" />
                        <span className="tracking-wide uppercase">{card.spec}</span>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-6 mt-auto">
                      <Link
                        href={card.cta.href}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-80 transition-opacity"
                      >
                        <span>{card.cta.label}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row 3: WhatsApp Campus Companion Banner */}
            <div className="border-t border-border/80 bg-muted/15 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      {t.campus.whatsappBanner.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE BOT
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    {t.campus.whatsappBanner.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-stretch sm:self-auto">
                <Link
                  href="/whatsapp"
                  className="group inline-flex items-stretch border border-emerald-600 bg-emerald-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-95 w-full sm:w-auto"
                >
                  <div className="flex items-center justify-center px-3.5 py-2.5 border-r border-white/20 bg-emerald-700">
                    <ChevronRight className="h-3.5 w-3.5 text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex items-center px-5 py-2.5 justify-center">
                    {t.campus.whatsappBanner.cta}
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
