"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowDown } from "lucide-react";
import CadHeroSchematic from "@/components/CadHeroSchematic";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

export default function HeroSection() {
  const { t } = useLandingLanguage();
  return (
    <div className="relative w-full bg-background text-foreground overflow-hidden">
      {/* Subtle CAD Engineering Grid (Airy & Non-Intrusive) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Symmetrical Subtle Guide Rails */}
      <div className="absolute inset-y-0 left-6 sm:left-12 lg:left-16 xl:left-24 w-[1px] border-r border-border/40 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 sm:right-12 lg:right-16 xl:right-24 w-[1px] border-l border-border/40 pointer-events-none" />

      {/* Expansive Hero Container */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-18 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Clean Architectural Typography & Action CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Minimal Monospace Category Tag */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <span className="font-mono text-xs font-black tracking-tighter text-foreground/70">
                ///
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {t.hero.categoryTag}
              </span>
            </div>

            {/* Architectural Display Heading: Hierarchy, Monochrome Shades & Straight Lines */}
            <h1 className="flex flex-col tracking-tight text-balance uppercase font-heading select-none">
              {/* Step 1: The Discarded Manual Method (Muted Monochrome + Straight Line Accent) */}
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-medium text-muted-foreground/60 tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <span className="inline-block w-4 sm:w-6 h-[1px] bg-muted-foreground/40" />
                  <span>{t.hero.step1}</span>
                </span>
                <span className="hidden sm:inline-block h-[1px] flex-1 bg-border/50 max-w-[120px]" />
              </div>

              {/* Step 2: The Core Imperative (Bold, Pure White Contrast) */}
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.85rem] font-bold tracking-tight text-foreground leading-[1.02]">
                {t.hero.step2}
              </span>

              {/* Step 3: The Superpower (CAD Straight-Line Architectural Framing) */}
              <div className="mt-2.5 sm:mt-3.5 flex items-center flex-wrap">
                <span className="relative inline-flex items-center border border-border/90 bg-muted/15 px-3.5 sm:px-5 py-1.5 sm:py-2 text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.15rem] font-black tracking-tight text-foreground leading-none">
                  {/* Outer CAD Corner Crosshairs (+) */}
                  <span className="absolute -top-1.5 -left-1.5 font-mono text-[9px] text-foreground/50 font-bold select-none leading-none">+</span>
                  <span className="absolute -top-1.5 -right-1.5 font-mono text-[9px] text-foreground/50 font-bold select-none leading-none">+</span>
                  <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[9px] text-foreground/50 font-bold select-none leading-none">+</span>
                  <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[9px] text-foreground/50 font-bold select-none leading-none">+</span>

                  {/* Top & Bottom Sub-Hairlines (CAD Stepped Track) */}
                  <span
                    className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 5px)",
                    }}
                  />
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 5px)",
                    }}
                  />

                  <span>{t.hero.step3Badge}</span>
                </span>
              </div>
            </h1>

            {/* Clean Subtitle with Open Line Height */}
            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t.hero.description}
            </p>

            {/* Action Buttons Row: Focused & Uncluttered */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Primary Split Button */}
              <Link
                href="/signup"
                className="group inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
              >
                <div className="flex items-center justify-center px-3.5 py-4 border-r border-background/20 bg-foreground">
                  <ChevronRight className="h-4 w-4 text-background transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="flex items-center px-6 sm:px-7 py-4">
                  {t.hero.primaryCta}
                </div>
              </Link>

              {/* Secondary Clean Outline Button */}
              <Link
                href="/#pipeline"
                className="inline-flex items-center gap-2.5 border border-border/80 bg-background px-6 sm:px-7 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 transition-colors"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Straight-Line Schematic Wireframe Art */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <CadHeroSchematic />
          </div>

        </div>
      </div>
    </div>
  );
}
