"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Eye,
  Mic,
  Languages,
  LayoutGrid,
  ChevronRight,
  ArrowUpRight,
  Check,
  Zap,
  Sparkles,
  Layers,
  Terminal,
} from "lucide-react";
import { HatchedBlock, CadCrosshair, StraightLinePattern, CadStraightLineBorder } from "./CadAccents";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

interface ModelItem {
  id: string;
  name: string;
  tag: string;
  contextWindow: string;
  latency: string;
  badgeColor: string;
  modalities: string[];
  description: string;
}

const PROVIDER_MODELS: Record<string, { label: string; models: ModelItem[] }> = {
  Google: {
    label: "Google DeepMind",
    models: [
      {
        id: "gemini-3-8-flash",
        name: "Gemini 3.8 Flash",
        tag: "Default • High Speed & Vision",
        contextWindow: "1M Tokens",
        latency: "120ms",
        badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-500",
        modalities: ["Text", "PDF Vision", "Voice Audio", "LaTeX Code"],
        description: "Primary multimodal engine with native document reasoning and ultra-fast visual token grounding.",
      },
      {
        id: "gemini-3-1-pro",
        name: "Gemini 3.1 Pro",
        tag: "Frontier Logic & Code Synthesis",
        contextWindow: "2M Tokens",
        latency: "280ms",
        badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-500",
        modalities: ["Text", "Multi-Page PDF", "Complex Coding", "Deep CoT"],
        description: "Deep algorithmic reasoning model optimized for difficult technical mock interviews and LaTeX compilation.",
      },
      {
        id: "gemini-3-7-flash",
        name: "Gemini 3.7 Flash",
        tag: "Ultra Low Latency Stream",
        contextWindow: "512K Tokens",
        latency: "95ms",
        badgeColor: "border-indigo-500/30 bg-indigo-500/10 text-indigo-500",
        modalities: ["Voice", "Streaming Chat", "Instant Feedback"],
        description: "Real-time speech dialogue engine powering the low-latency hands-free mock interview call mode.",
      },
    ],
  },
  OpenAI: {
    label: "OpenAI",
    models: [
      {
        id: "gpt-6-astra",
        name: "GPT-6 Astra",
        tag: "Next-Gen Omni Reasoning",
        contextWindow: "1M Tokens",
        latency: "220ms",
        badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        modalities: ["Omni", "Voice", "Vision", "Text"],
        description: "Frontier omni-modal intelligence delivering nuanced conversational career advice and resume evaluations.",
      },
      {
        id: "gpt-6-1-sol",
        name: "GPT-6.1 Sol",
        tag: "Algorithmic & Math Logic",
        contextWindow: "512K Tokens",
        latency: "310ms",
        badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        modalities: ["Math", "Data Structures", "System Design"],
        description: "Specialized in technical problem-solving, algorithmic scoring, and deep system architecture interviews.",
      },
      {
        id: "gpt-6-1-terra",
        name: "GPT-6.1 Terra",
        tag: "Multimodal Document Grounding",
        contextWindow: "1M Tokens",
        latency: "240ms",
        badgeColor: "border-teal-500/30 bg-teal-500/10 text-teal-500",
        modalities: ["PDFs", "Images", "Scanned Transcripts"],
        description: "High-precision document extraction engine for messy, multi-column PDF resumes and project portfolios.",
      },
    ],
  },
  Anthropic: {
    label: "Anthropic",
    models: [
      {
        id: "claude-fable-5-1",
        name: "Claude Fable 5.1",
        tag: "Frontier Intelligence & Ethics",
        contextWindow: "500K Tokens",
        latency: "260ms",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
        modalities: ["Executive Narratives", "Cover Letters", "Structured JSON"],
        description: "Unrivaled executive storytelling for personalized cover letters and recruiter cold outreach emails.",
      },
      {
        id: "opus-5-5",
        name: "Opus 5.5",
        tag: "Deep Academic Reasoning",
        contextWindow: "1M Tokens",
        latency: "380ms",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
        modalities: ["Deep CoT", "Academic Research", "Curriculum Design"],
        description: "Calculates verified skill gap priority weights and constructs personalized learning roadmaps with exact milestones.",
      },
      {
        id: "sonnet-5-5",
        name: "Sonnet 5.5",
        tag: "Balanced Enterprise Coding",
        contextWindow: "500K Tokens",
        latency: "180ms",
        badgeColor: "border-orange-500/30 bg-orange-500/10 text-orange-500",
        modalities: ["Full-Stack Code", "Architecture", "ATS Rules"],
        description: "Balances fast code generation with rigorous schema adherence for reliable, deterministic JSON outputs.",
      },
    ],
  },
  DeepSeek: {
    label: "DeepSeek",
    models: [
      {
        id: "deepseek-v4-pro",
        name: "DeepSeek V4 Pro",
        tag: "1M Context Deep Reasoning",
        contextWindow: "1M Tokens",
        latency: "240ms",
        badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-500",
        modalities: ["1M Context", "Full JD Indexation", "LaTeX Code"],
        description: "Ingests entire career portfolios, job histories, and thousands of job descriptions in a single context window.",
      },
      {
        id: "deepseek-v4-flash",
        name: "DeepSeek V4 Flash",
        tag: "High-Throughput MoE",
        contextWindow: "256K Tokens",
        latency: "110ms",
        badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-500",
        modalities: ["MoE Architecture", "High Speed", "ATS Scoring"],
        description: "Cost-efficient Mixture-of-Experts engine for rapid batch resume scoring and keyword extraction.",
      },
    ],
  },
  Trending: {
    label: "Multilingual & Open Weights",
    models: [
      {
        id: "qwen-3-x",
        name: "Qwen 3.x (Alibaba)",
        tag: "Multilingual Multimodal",
        contextWindow: "512K Tokens",
        latency: "170ms",
        badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-500",
        modalities: ["Assamese", "Hindi", "English", "Vision"],
        description: "Native trilingual grounding for Assam & Northeast regional career advice and dialect comprehension.",
      },
      {
        id: "kimi-k3",
        name: "Kimi K3 (Moonshot)",
        tag: "2M Context Long-Form",
        contextWindow: "2M Tokens",
        latency: "290ms",
        badgeColor: "border-rose-500/30 bg-rose-500/10 text-rose-500",
        modalities: ["2M Long Context", "Document Cross-Matching"],
        description: "Ultra-long context model for comprehensive institutional placement tracking and cohort analysis.",
      },
    ],
  },
};

export default function MultimodalSection() {
  const { t } = useLandingLanguage();
  const [activeProvider, setActiveProvider] = useState<string>("Google");
  const [hoveredModality, setHoveredModality] = useState<number | null>(null);

  const modalities = [
    {
      tag: t.multimodal.m1.tag,
      title: t.multimodal.m1.title,
      desc: t.multimodal.m1.desc,
      spec: t.multimodal.m1.spec,
      icon: Eye,
    },
    {
      tag: t.multimodal.m2.tag,
      title: t.multimodal.m2.title,
      desc: t.multimodal.m2.desc,
      spec: t.multimodal.m2.spec,
      icon: Mic,
    },
    {
      tag: t.multimodal.m3.tag,
      title: t.multimodal.m3.title,
      desc: t.multimodal.m3.desc,
      spec: t.multimodal.m3.spec,
      icon: Languages,
    },
    {
      tag: t.multimodal.m4.tag,
      title: t.multimodal.m4.title,
      desc: t.multimodal.m4.desc,
      spec: t.multimodal.m4.spec,
      icon: LayoutGrid,
    },
  ];

  const currentModels = PROVIDER_MODELS[activeProvider]?.models || [];

  return (
    <section
      id="multimodal"
      aria-label="Next-Gen Multimodal LLM Architecture"
      className="relative bg-background text-foreground w-full overflow-hidden"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-14 sm:pt-32 sm:pb-18">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {t.multimodal.sectionTag}
          </span>
          <HatchedBlock className="hidden sm:block opacity-60 ml-1" />
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {t.multimodal.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t.multimodal.subheading}
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20 self-start md:self-auto select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-foreground font-semibold">
              DYNAMIC ROUTER // 14 FRONTIER MODELS
            </span>
          </div>
        </div>
      </div>

      {/* Main Framework with Shared Overlapping Borders */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          <div className="border-x border-b border-border/80 relative bg-background">

            {/* Provider Tab Bar */}
            <div className="border-b border-border/80 bg-muted/10 p-2 sm:p-3 flex items-center gap-2 overflow-x-auto select-none font-mono text-xs">
              <span className="px-3 py-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                SELECT ENGINE CLUSTER:
              </span>
              {Object.keys(PROVIDER_MODELS).map((providerKey) => {
                const isActive = activeProvider === providerKey;
                return (
                  <button
                    key={providerKey}
                    type="button"
                    onClick={() => setActiveProvider(providerKey)}
                    className={`px-4 py-2 border transition-all cursor-pointer font-semibold uppercase tracking-wider text-xs whitespace-nowrap ${
                      isActive
                        ? "border-foreground bg-foreground text-background shadow-xs"
                        : "border-border/80 bg-background text-muted-foreground hover:text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {providerKey}
                  </button>
                );
              })}
            </div>

            {/* Active Provider Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80 bg-background border-b border-border/80 relative">
              {currentModels.map((model) => (
                <div
                  key={model.id}
                  className="p-8 sm:p-10 flex flex-col justify-between min-h-[300px] hover:bg-muted/5 transition-colors relative group"
                >
                  <CadStraightLineBorder />

                  <div>
                    {/* Top Tag & Context Info */}
                    <div className="flex items-center justify-between pb-3 mb-5 border-b border-border/60 font-mono text-[10px]">
                      <span className={`px-2 py-0.5 border font-semibold uppercase tracking-wider ${model.badgeColor}`}>
                        {model.tag}
                      </span>
                      <span className="text-muted-foreground">
                        {model.latency}
                      </span>
                    </div>

                    {/* Model Name */}
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2 flex items-center justify-between">
                      <span>{model.name}</span>
                      <span className="font-mono text-xs text-muted-foreground font-normal">
                        {model.contextWindow}
                      </span>
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                      {model.description}
                    </p>

                    {/* Supported Modalities Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {model.modalities.map((mod) => (
                        <span
                          key={mod}
                          className="font-mono text-[10px] px-2 py-0.5 border border-border/80 bg-muted/20 text-foreground/80"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Test Model Live CTA */}
                  <div className="pt-4 border-t border-border/60 mt-auto">
                    <Link
                      href="/career-guide"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-80 transition-opacity"
                    >
                      <span>Deploy {model.name}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Interstitial Grid Reticles */}
            <CadCrosshair className="absolute -top-2 -left-2" />
            <CadCrosshair className="absolute -top-2 -right-2" />

            {/* Sub-Heading for Execution Modalities */}
            <div className="border-b border-border/80 bg-muted/15 px-8 sm:px-12 py-5 flex items-center justify-between select-none">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.multimodal.capabilitiesHeading}</span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground hidden sm:block">
                END-TO-END ZERO LATENCY PIPELINE
              </div>
            </div>

            {/* Four Multimodal Execution Modalities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/80 bg-background relative">
              {modalities.map((item, idx) => {
                const Icon = item.icon;
                const isHovered = hoveredModality === idx;

                return (
                  <div
                    key={item.tag}
                    onMouseEnter={() => setHoveredModality(idx)}
                    onMouseLeave={() => setHoveredModality(null)}
                    className="p-8 sm:p-10 flex flex-col justify-between min-h-[300px] hover:bg-muted/10 transition-all duration-200 cursor-default relative group"
                  >
                    {isHovered && <CadStraightLineBorder />}

                    <div>
                      {/* Top Tag & Icon */}
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-6 pb-3 border-b border-border/60">
                        <span className="tracking-wider uppercase">{item.tag}</span>
                        <div className="h-8 w-8 border border-border bg-background flex items-center justify-center text-foreground group-hover:border-foreground group-hover:text-emerald-500 transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-3 leading-snug">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                        {item.desc}
                      </p>
                    </div>

                    {/* Spec Hairlines */}
                    <div className="font-mono text-[10px] text-foreground/80 border-t border-border/60 pt-3 flex items-center gap-2 mt-auto">
                      <span className="h-0.5 w-2.5 bg-emerald-500 inline-block" />
                      <span className="tracking-wide uppercase">{item.spec}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Interstitial Callout */}
            <div className="border-t border-border/80 bg-muted/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
              <div className="flex items-center gap-3 text-muted-foreground text-center sm:text-left">
                <Terminal className="h-4 w-4 text-emerald-500 shrink-0 hidden sm:block" />
                <span>
                  INTELLIGENT ROUTING: Automatically directs vision, voice, or deep logic prompts to the highest-performing multimodal LLM.
                </span>
              </div>

              <Link
                href="/career-guide"
                className="group inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 shrink-0"
              >
                <div className="flex items-center justify-center px-3 py-2.5 border-r border-background/20 bg-foreground">
                  <ChevronRight className="h-3.5 w-3.5 text-background transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="flex items-center px-5 py-2.5">
                  Explore Model Selector
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
