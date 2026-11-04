"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { CadCrosshair, StraightLinePattern } from "./CadAccents";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

/**
 * CadGridFrame
 * Constructs a technical CAD border around the card using straight lines
 * and an 8px grid-like tick mark track. The center remains 100% clean and transparent
 * for maximum text legibility.
 */
function CadGridFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0 select-none"
    >
      {/* Outer Emerald Boundary Line */}
      <div className="absolute inset-0 border border-emerald-500/70" />

      {/* Stepped Inner Boundary Hairline (clean frame gap) */}
      <div className="absolute inset-[8px] border border-emerald-500/30 pointer-events-none" />

      {/* Top Border Grid Track (straight orthogonal ticks) */}
      <div
        className="absolute top-0 left-0 right-0 h-[8px] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Bottom Border Grid Track */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[8px] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Left Border Grid Track (horizontal straight ticks) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[8px] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Right Border Grid Track */}
      <div
        className="absolute top-0 bottom-0 right-0 w-[8px] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* 4 Corner Crosshairs (+) with subtle hover rotation */}
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none select-none transition-transform duration-300 group-hover:rotate-90">
        +
      </span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none select-none transition-transform duration-300 group-hover:rotate-90">
        +
      </span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none select-none transition-transform duration-300 group-hover:rotate-90">
        +
      </span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none select-none transition-transform duration-300 group-hover:rotate-90">
        +
      </span>

      {/* Perimeter Edge Luminescence - Center remains 100% clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 25% at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 65%), radial-gradient(ellipse 90% 25% at 50% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}

interface TestimonialCard {
  id: string;
  badge: string;
  author: string;
  rating: number;
  comment: string;
}

const testimonialsRow1: (TestimonialCard & { colSpan: string })[] = [
  {
    id: "t1",
    badge: "Frontend Developer · Datadog",
    author: "Alex Chen",
    rating: 5,
    comment:
      "Applying used to feel like sending resumes into a black hole. With CareerCrewAI tailoring my frontend project achievements directly to the job specs, I landed 3 recruiter calls in my first week.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4 border-b border-border/80 md:border-r",
  },
  {
    id: "t2",
    badge: "Growth Marketer · HubSpot",
    author: "Maya Patel",
    rating: 5,
    comment:
      "As a growth marketer, aligning CAC and retention wins with the JD is everything. The tailored resume framed my achievements in clean LaTeX that hiring managers actually complimented.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-3 border-b border-border/80 lg:border-r",
  },
  {
    id: "t3",
    badge: "Account Executive · Ramp",
    author: "Liam Foster",
    rating: 5,
    comment:
      "Sales roles get flooded with hundreds of applicants. Having personalized outreach notes generated directly for hiring managers got me straight past the filters into screening calls.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-3 border-b border-border/80 md:border-r lg:border-r",
  },
];

const testimonialsRow2: (TestimonialCard & { colSpan: string })[] = [
  {
    id: "t4",
    badge: "Product Operations · Figma",
    author: "Sophia Martinez",
    rating: 5,
    comment:
      "I didn't have to fiddle with broken word templates or weird spacing. Every resume was crisp, modern, and aligned with what design and product teams look for.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4 border-b md:border-b-0 border-border/80 lg:border-r",
  },
  {
    id: "t5",
    badge: "Software Engineer · Linear",
    author: "Jordan Miller",
    rating: 5,
    comment:
      "Most AI resume tools hallucinate skills you don't have. CareerCrewAI actually understood my tech stack and highlighted my real contributions accurately.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-3 border-b md:border-b-0 border-border/80 md:border-r lg:border-r",
  },
  {
    id: "t6",
    badge: "Customer Success Lead · Klaviyo",
    author: "Chloe Nguyen",
    rating: 5,
    comment:
      "Transitioning between SaaS platforms was intimidating, but having tailored resumes highlighting retention and account expansions made all the difference in getting callbacks.",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-3",
  },
];

const companyLogos = [
  { name: "Google", src: "/company/google.png", width: 90, height: 28 },
  { name: "Meta", src: "/company/meta.png", width: 85, height: 26 },
  { name: "Apple", src: "/company/apple.png", width: 28, height: 28 },
  { name: "Microsoft", src: "/company/microsoft.svg", width: 100, height: 24 },
  { name: "Amazon", src: "/company/amazon.svg", width: 85, height: 26 },
  { name: "Y Combinator", src: "/company/yc.png", width: 95, height: 26 },
];

export default function TestimonialSection() {
  const { t } = useLandingLanguage();
  return (
    <section
      id="testimonials"
      aria-label="User Testimonials & Proven Track Record"
      className="relative bg-background text-foreground w-full"
    >
      {/* Full-Width Header with Deep Breathing Room */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {t.testimonials.sectionTag}
          </span>
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60 ml-2" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-3xl">
              {t.testimonials.heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.testimonials.subheading}
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
                  "repeating-linear-gradient(to right, transparent, transparent 3px, var(--border) 3px, var(--border) 4px)",
              }}
            />
            <div
              className="w-10 h-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)",
              }}
            />
            <div className="w-9 h-full flex items-center justify-center font-mono text-[11px] font-bold text-foreground/50">
              +
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric 2-Row Bento Grid with 6 Testimonials + 2 CAD Pattern Boxes */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 border-x border-b border-border/80 relative bg-background">
            
            {/* ROW 1: 3 Asymmetric Testimonials + 1 Empty Pattern Box (4 + 3 + 3 + 2 = 12 cols) */}
            {testimonialsRow1.map((item) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden flex flex-col justify-between bg-card/40 p-6 sm:p-8 lg:p-10 transition-all duration-300 ease-out hover:bg-muted/15 hover:-translate-y-1.5 hover:shadow-md ${item.colSpan}`}
              >
                {/* Precision CAD Straight-Line Grid Border Frame on Hover (Center remains 100% clean) */}
                <CadGridFrame />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Row: Category badge */}
                    <div className="mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/60 px-2.5 py-1 border border-border/60 transition-colors duration-300 group-hover:border-emerald-500/50 group-hover:text-foreground">
                        {item.badge}
                      </span>
                    </div>

                    {/* 5-Star Rating (Cleanly positioned, replacing header titles) */}
                    <div className="flex items-center gap-1 text-foreground mb-4 transition-all duration-300" aria-label="5 out of 5 stars">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-foreground text-foreground transition-all duration-200 group-hover:fill-emerald-500 group-hover:text-emerald-500 group-hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Quote & Author Name (Clean layout, zero extra tags) */}
                  <div className="mt-6 pt-5 border-t border-border/50">
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 mb-4 italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                    <div className="font-mono text-xs font-semibold text-foreground tracking-wide group-hover:text-emerald-400 transition-colors duration-200">
                      {item.author}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Pattern Box 1: CAD Opening Double Quote (“) Engineered 100% with Straight Lines */}
            <div className="col-span-12 md:col-span-6 lg:col-span-2 border-b border-border/80 relative flex items-center justify-center p-6 bg-muted/10 overflow-hidden min-h-[240px] sm:min-h-[270px]">
              {/* Dense Orthogonal 8px Engineering Grid */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "8px 8px, 8px 8px",
                }}
              />

              {/* SVG: Precision Straight-Line Opening Double Quotes (“) */}
              <svg
                viewBox="0 0 160 160"
                className="w-28 h-28 sm:w-32 sm:h-32 text-foreground/50 relative z-10 pointer-events-none"
                fill="none"
                stroke="currentColor"
              >
                {/* Outer Double Straight-Line Frame with Corner Notches */}
                <rect x="12" y="12" width="136" height="136" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <rect x="20" y="20" width="120" height="120" strokeWidth="1.2" opacity="0.6" />

                {/* 45-degree Corner Notches */}
                <line x1="12" y1="28" x2="28" y2="12" strokeWidth="1" opacity="0.6" />
                <line x1="148" y1="28" x2="132" y2="12" strokeWidth="1" opacity="0.6" />
                <line x1="12" y1="132" x2="28" y2="148" strokeWidth="1" opacity="0.6" />
                <line x1="148" y1="132" x2="132" y2="148" strokeWidth="1" opacity="0.6" />

                {/* Cardinal Center Hairlines */}
                <line x1="20" y1="80" x2="140" y2="80" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
                <line x1="80" y1="20" x2="80" y2="140" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />

                {/* Calibration Straight Tick Marks */}
                <line x1="40" y1="20" x2="40" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="60" y1="20" x2="60" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="100" y1="20" x2="100" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="120" y1="20" x2="120" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="40" y1="140" x2="40" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="60" y1="140" x2="60" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="100" y1="140" x2="100" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="120" y1="140" x2="120" y2="136" strokeWidth="0.8" opacity="0.5" />

                {/* Quote Mark 1 (Left): Faceted Stepped Straight Lines */}
                <polygon
                  points="44,48 68,48 76,56 76,84 66,94 58,94 40,116 32,116 36,94 36,56"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  opacity="0.85"
                />
                {/* Inner Precision Emerald Hairlines */}
                <line x1="44" y1="56" x2="68" y2="56" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="68" y1="56" x2="68" y2="84" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="56" y1="94" x2="38" y2="114" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                {/* Horizontal engraving straight lines inside Quote 1 */}
                <line x1="42" y1="66" x2="64" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                <line x1="42" y1="74" x2="64" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />

                {/* Quote Mark 2 (Right): Faceted Stepped Straight Lines */}
                <polygon
                  points="86,48 110,48 118,56 118,84 108,94 100,94 82,116 74,116 78,94 78,56"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  opacity="0.85"
                />
                {/* Inner Precision Emerald Hairlines */}
                <line x1="86" y1="56" x2="110" y2="56" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="110" y1="56" x2="110" y2="84" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="98" y1="94" x2="80" y2="114" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                {/* Horizontal engraving straight lines inside Quote 2 */}
                <line x1="84" y1="66" x2="106" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                <line x1="84" y1="74" x2="106" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
              </svg>

              {/* Minimal Corner Reticles */}
              <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
            </div>

            {/* ROW 2: 1 Empty Pattern Box + 3 Asymmetric Testimonials (2 + 4 + 3 + 3 = 12 cols) */}

            {/* Pattern Box 2: CAD Closing Double Quote (”) Engineered 100% with Straight Lines */}
            <div className="col-span-12 md:col-span-6 lg:col-span-2 border-b md:border-b-0 border-border/80 md:border-r relative flex items-center justify-center p-6 bg-muted/10 overflow-hidden min-h-[240px] sm:min-h-[270px]">
              {/* Dense Orthogonal 8px Engineering Grid */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "8px 8px, 8px 8px",
                }}
              />

              {/* SVG: Precision Straight-Line Closing Double Quotes (”) */}
              <svg
                viewBox="0 0 160 160"
                className="w-28 h-28 sm:w-32 sm:h-32 text-foreground/50 relative z-10 pointer-events-none"
                fill="none"
                stroke="currentColor"
              >
                {/* Outer Double Straight-Line Frame with Corner Notches */}
                <rect x="12" y="12" width="136" height="136" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <rect x="20" y="20" width="120" height="120" strokeWidth="1.2" opacity="0.6" />

                {/* 45-degree Corner Notches */}
                <line x1="12" y1="28" x2="28" y2="12" strokeWidth="1" opacity="0.6" />
                <line x1="148" y1="28" x2="132" y2="12" strokeWidth="1" opacity="0.6" />
                <line x1="12" y1="132" x2="28" y2="148" strokeWidth="1" opacity="0.6" />
                <line x1="148" y1="132" x2="132" y2="148" strokeWidth="1" opacity="0.6" />

                {/* Cardinal Center Hairlines */}
                <line x1="20" y1="80" x2="140" y2="80" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
                <line x1="80" y1="20" x2="80" y2="140" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />

                {/* Calibration Straight Tick Marks */}
                <line x1="40" y1="20" x2="40" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="60" y1="20" x2="60" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="100" y1="20" x2="100" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="120" y1="20" x2="120" y2="24" strokeWidth="0.8" opacity="0.5" />
                <line x1="40" y1="140" x2="40" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="60" y1="140" x2="60" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="100" y1="140" x2="100" y2="136" strokeWidth="0.8" opacity="0.5" />
                <line x1="120" y1="140" x2="120" y2="136" strokeWidth="0.8" opacity="0.5" />

                {/* Quote Mark 1 (Left Closing): Faceted Stepped Straight Lines */}
                <polygon
                  points="74,48 50,48 42,56 42,84 52,94 60,94 78,116 86,116 82,94 82,56"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  opacity="0.85"
                />
                {/* Inner Precision Emerald Hairlines */}
                <line x1="74" y1="56" x2="50" y2="56" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="50" y1="56" x2="50" y2="84" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="62" y1="94" x2="80" y2="114" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                {/* Horizontal engraving straight lines inside Quote 1 */}
                <line x1="50" y1="66" x2="72" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                <line x1="50" y1="74" x2="72" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />

                {/* Quote Mark 2 (Right Closing): Faceted Stepped Straight Lines */}
                <polygon
                  points="116,48 92,48 84,56 84,84 94,94 102,94 120,116 128,116 124,94 124,56"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  opacity="0.85"
                />
                {/* Inner Precision Emerald Hairlines */}
                <line x1="116" y1="56" x2="92" y2="56" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="92" y1="56" x2="92" y2="84" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                <line x1="104" y1="94" x2="122" y2="114" stroke="#10b981" strokeWidth="1.2" opacity="0.8" />
                {/* Horizontal engraving straight lines inside Quote 2 */}
                <line x1="92" y1="66" x2="114" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                <line x1="92" y1="74" x2="114" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
              </svg>

              {/* Minimal Corner Reticles */}
              <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
              <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
            </div>

            {/* Testimonials 4, 5, 6 */}
            {testimonialsRow2.map((item) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden flex flex-col justify-between bg-card/40 p-6 sm:p-8 lg:p-10 transition-all duration-300 ease-out hover:bg-muted/15 hover:-translate-y-1.5 hover:shadow-md ${item.colSpan}`}
              >
                {/* Precision CAD Straight-Line Grid Border Frame on Hover (Center remains 100% clean) */}
                <CadGridFrame />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Row: Category badge */}
                    <div className="mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/60 px-2.5 py-1 border border-border/60 transition-colors duration-300 group-hover:border-emerald-500/50 group-hover:text-foreground">
                        {item.badge}
                      </span>
                    </div>

                    {/* 5-Star Rating (Cleanly positioned, replacing header titles) */}
                    <div className="flex items-center gap-1 text-foreground mb-4 transition-all duration-300" aria-label="5 out of 5 stars">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-foreground text-foreground transition-all duration-200 group-hover:fill-emerald-500 group-hover:text-emerald-500 group-hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Quote & Author Name (Clean layout, zero extra tags) */}
                  <div className="mt-6 pt-5 border-t border-border/50">
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 mb-4 italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                    <div className="font-mono text-xs font-semibold text-foreground tracking-wide group-hover:text-emerald-400 transition-colors duration-200">
                      {item.author}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Corner Intersection CAD Reticles (+) */}
            <CadCrosshair className="absolute -top-2 -left-2" />
            <CadCrosshair className="absolute -top-2 -right-2" />
            <CadCrosshair className="absolute -bottom-2 -left-2" />
            <CadCrosshair className="absolute -bottom-2 -right-2" />
          </div>
        </div>
      </div>

      {/* Infinite Marquee Logo Strip */}
      <div className="border-t border-border/80 bg-muted/10 py-6 overflow-hidden select-none w-full">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] items-center">
          {[...companyLogos, ...companyLogos, ...companyLogos].map((company, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={company.src}
                alt={`${company.name} logo`}
                width={company.width}
                height={company.height}
                className="max-h-6 w-auto object-contain dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
