"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { HatchedBlock, CadCrosshair, CrisscrossBox, StraightLinePattern, CadStraightLineBorder } from "./CadAccents";

/**
 * CadCurrencySchematic
 * A bespoke CAD straight-line currency / banknote vault design for inactive cards.
 * Engineered 100% with straight lines (no curves, zero text).
 */
function CadCurrencySchematic() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 flex items-center justify-center p-6 sm:p-10 select-none pointer-events-none animate-in fade-in duration-300"
    >
      {/* Dense Orthogonal 8px Engineering Grid Background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "8px 8px, 8px 8px",
        }}
      />

      {/* Primary SVG: Precision Straight-Line Banknote & Dollar Geometry */}
      <svg
        viewBox="0 0 220 280"
        className="w-full h-full max-h-[360px] text-foreground/50"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Banknote Double Rectangular Frame with Chamfered Corners */}
        <rect x="14" y="14" width="192" height="252" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <rect x="22" y="22" width="176" height="236" strokeWidth="1.2" opacity="0.6" />

        {/* 45-degree Corner Notches */}
        <line x1="14" y1="36" x2="36" y2="14" strokeWidth="1" opacity="0.6" />
        <line x1="206" y1="36" x2="184" y2="14" strokeWidth="1" opacity="0.6" />
        <line x1="14" y1="244" x2="36" y2="266" strokeWidth="1" opacity="0.6" />
        <line x1="206" y1="244" x2="184" y2="266" strokeWidth="1" opacity="0.6" />

        {/* Banknote Corner Security Diamonds (Straight Lines) */}
        <polygon points="34,26 42,34 34,42 26,34" strokeWidth="0.8" opacity="0.5" />
        <polygon points="186,26 194,34 186,42 178,34" strokeWidth="0.8" opacity="0.5" />
        <polygon points="34,238 42,246 34,254 26,246" strokeWidth="0.8" opacity="0.5" />
        <polygon points="186,238 194,246 186,254 178,246" strokeWidth="0.8" opacity="0.5" />

        {/* Perimeter Straight-Line Ruler Tick Marks */}
        <line x1="50" y1="22" x2="50" y2="27" strokeWidth="0.8" opacity="0.5" />
        <line x1="70" y1="22" x2="70" y2="27" strokeWidth="0.8" opacity="0.5" />
        <line x1="90" y1="22" x2="90" y2="27" strokeWidth="0.8" opacity="0.5" />
        <line x1="110" y1="22" x2="110" y2="29" strokeWidth="1" opacity="0.7" />
        <line x1="130" y1="22" x2="130" y2="27" strokeWidth="0.8" opacity="0.5" />
        <line x1="150" y1="22" x2="150" y2="27" strokeWidth="0.8" opacity="0.5" />
        <line x1="170" y1="22" x2="170" y2="27" strokeWidth="0.8" opacity="0.5" />

        <line x1="50" y1="258" x2="50" y2="253" strokeWidth="0.8" opacity="0.5" />
        <line x1="70" y1="258" x2="70" y2="253" strokeWidth="0.8" opacity="0.5" />
        <line x1="90" y1="258" x2="90" y2="253" strokeWidth="0.8" opacity="0.5" />
        <line x1="110" y1="258" x2="110" y2="251" strokeWidth="1" opacity="0.7" />
        <line x1="130" y1="258" x2="130" y2="253" strokeWidth="0.8" opacity="0.5" />
        <line x1="150" y1="258" x2="150" y2="253" strokeWidth="0.8" opacity="0.5" />
        <line x1="170" y1="258" x2="170" y2="253" strokeWidth="0.8" opacity="0.5" />

        {/* Central Axis Hairlines */}
        <line x1="22" y1="140" x2="198" y2="140" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
        <line x1="110" y1="22" x2="110" y2="258" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

        {/* Concentric Faceted Octagons (Vault Medallion) */}
        <polygon
          points="110,58 144,68 168,92 178,126 178,154 168,188 144,212 110,222 76,212 52,188 42,154 42,126 52,92 76,68"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.45"
        />
        <polygon
          points="110,68 138,76 158,96 166,124 166,156 158,184 138,204 110,212 82,204 62,184 54,156 54,124 62,96 82,76"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Radiating Straight Guilloche Rays */}
        <line x1="110" y1="68" x2="110" y2="82" strokeWidth="0.8" opacity="0.4" />
        <line x1="110" y1="212" x2="110" y2="198" strokeWidth="0.8" opacity="0.4" />
        <line x1="54" y1="140" x2="68" y2="140" strokeWidth="0.8" opacity="0.4" />
        <line x1="166" y1="140" x2="152" y2="140" strokeWidth="0.8" opacity="0.4" />
        <line x1="72" y1="102" x2="82" y2="112" strokeWidth="0.8" opacity="0.4" />
        <line x1="148" y1="102" x2="138" y2="112" strokeWidth="0.8" opacity="0.4" />
        <line x1="72" y1="178" x2="82" y2="168" strokeWidth="0.8" opacity="0.4" />
        <line x1="148" y1="178" x2="138" y2="168" strokeWidth="0.8" opacity="0.4" />

        {/* ======================================================== */}
        {/* THE CAD DOLLAR SIGN ($) - CONSTRUCTED 100% STRAIGHT LINES */}
        {/* ======================================================== */}

        {/* Double Vertical Spine with Hairline Endcaps */}
        <line x1="105" y1="74" x2="105" y2="206" stroke="#10b981" strokeWidth="1.8" opacity="0.85" />
        <line x1="115" y1="74" x2="115" y2="206" stroke="#10b981" strokeWidth="1.8" opacity="0.85" />
        <line x1="99" y1="74" x2="121" y2="74" stroke="#10b981" strokeWidth="1.8" opacity="0.85" />
        <line x1="99" y1="206" x2="121" y2="206" stroke="#10b981" strokeWidth="1.8" opacity="0.85" />

        {/* Outer Faceted S Contour (Stepped Straight Lines) */}
        <polyline
          points="138,104 138,92 92,92 80,104 80,118 92,130 128,142 140,154 140,168 128,188 82,188 82,176"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.9"
        />

        {/* Parallel Inner Straight Hairline */}
        <polyline
          points="128,102 128,100 98,100 90,108 90,114 98,122 122,134 130,144 130,162 122,180 92,180 92,178"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Straight Horizontal Currency Hatch Lines inside the Dollar Symbol */}
        <line x1="92" y1="96" x2="128" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1="82" y1="110" x2="98" y2="110" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1="122" y1="168" x2="138" y2="168" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1="92" y1="184" x2="128" y2="184" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />

        {/* Center Crosshair Intersection Ticks */}
        <line x1="102" y1="140" x2="118" y2="140" stroke="#10b981" strokeWidth="1.5" opacity="0.8" />

        {/* Outer S Corner Reticles */}
        <line x1="74" y1="104" x2="78" y2="104" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="142" y1="168" x2="146" y2="168" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      </svg>

      {/* 4 Corner Crosshairs */}
      <CadCrosshair className="absolute top-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute top-2 right-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 left-2 opacity-40" size="text-[8px]" />
      <CadCrosshair className="absolute bottom-2 right-2 opacity-40" size="text-[8px]" />
    </div>
  );
}

export default function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      tag: "TIER 01",
      name: "Starter",
      description: "For creating and exporting verified ATS resume assets.",
      price: "$0",
      cadence: "/ month",
      cta: { label: "Get Started Free", href: "/signup", variant: "outline" },
      features: [
        "1 ATS Resume creation / day",
        "LaTeX and Vector PDF export",
        "Standard keyword density parser",
      ],
    },
    {
      id: "pro",
      tag: "TIER 02",
      name: "Pro Autopilot",
      description: "For active candidates seeking consistent weekly interviews.",
      price: "$3",
      cadence: "/ month",
      popular: true,
      cta: { label: "Start Free Trial", href: "/signup", variant: "solid" },
      features: [
        "Continuous 24/7 background crawler",
        "Unlimited manual LaTeX creations",
        "Parallel cover letters & recruiter emails",
      ],
    },
    {
      id: "elite",
      tag: "TIER 03",
      name: "Elite Autonomous",
      description: "High-volume execution with zero limits or queue delays.",
      price: "$16",
      cadence: "/ month",
      cta: { label: "Get Started Now", href: "/signup", variant: "outline" },
      features: [
        "Unlimited autonomous agent dispatches",
        "Priority recruiter contact discovery",
        "Dedicated model fine-tuning",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      aria-label="Subscription Pricing Plans"
      className="relative bg-background text-foreground w-full"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            TRANSPARENT PRICING
          </span>
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60 ml-2" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Simple, transparent plans
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              No hidden fees. Choose your application volume and cancel anytime.
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

      {/* 3 Columns with Interactive Focus State */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          <div
            className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/80 border-x border-b border-border/80 relative bg-background"
            onMouseLeave={() => setHoveredPlan(null)}
          >
            {plans.map((plan) => {
              const isHovered = hoveredPlan === plan.id;
              const isInactive = hoveredPlan !== null && !isHovered;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  className={`group relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 transition-all duration-300 ease-out ${
                    isHovered
                      ? "-translate-y-1.5 shadow-md bg-card/60"
                      : isInactive
                      ? "bg-muted/5 opacity-85"
                      : plan.popular
                      ? "bg-muted/30"
                      : "bg-background"
                  }`}
                >
                  {/* Hovered Plan: Subtle light greenish-emerald border of straight-line combinations */}
                  {isHovered && <CadStraightLineBorder />}

                  {/* Inactive Plans: Converted into CAD straight-line currency schematic (Zero text) */}
                  {isInactive && <CadCurrencySchematic />}

                  {/* Plan Content: Visible when normal or active, smoothly hidden when inactive */}
                  <div
                    className={`relative z-10 flex flex-col justify-between h-full transition-opacity duration-300 ${
                      isInactive ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-6 pb-2 border-b border-border/60 transition-colors duration-300 group-hover:border-foreground/30">
                        <div className="flex items-center gap-2">
                          <span className="group-hover:text-foreground transition-colors duration-300">{plan.tag}</span>
                          <HatchedBlock className="hidden xl:block opacity-50 group-hover:opacity-75 transition-opacity" />
                        </div>
                        {plan.popular && (
                          <span className="bg-foreground text-background px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] shadow-xs">
                            MOST POPULAR
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1 leading-snug group-hover:text-foreground transition-colors">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors">
                        {plan.description}
                      </p>

                      <div className="mb-6 flex items-baseline gap-1 font-mono transition-transform duration-300 group-hover:translate-x-0.5">
                        <span className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-sans">
                          {plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                      </div>

                      <Link
                        href={plan.cta.href}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 mb-8 cursor-pointer ${
                          plan.cta.variant === "solid"
                            ? "bg-foreground text-background hover:opacity-90 hover:shadow-xs active:scale-[0.99]"
                            : "border border-border/80 bg-background text-foreground hover:bg-muted hover:border-foreground/60 active:scale-[0.99]"
                        }`}
                      >
                        <span>{plan.cta.label}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>

                      <div className="border-t border-border/60 divide-y divide-border/50 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-foreground/30">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="py-2.5 flex items-center gap-2.5 transition-transform duration-200 hover:translate-x-0.5">
                            <Check className="h-3.5 w-3.5 text-foreground shrink-0 transition-transform duration-200 group-hover:scale-110" />
                            <span className="text-foreground/90">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Corner Intersection CAD Reticles (+) */}
            <CadCrosshair className="absolute -top-2 -left-2" />
            <CadCrosshair className="absolute -top-2 -right-2" />
            <CadCrosshair className="absolute -bottom-2 -left-2" />
            <CadCrosshair className="absolute -bottom-2 -right-2" />
          </div>
        </div>
      </div>

      {/* Bottom Guarantee */}
      <div className="border-t border-border/80 bg-muted/10 w-full">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 py-5 flex items-center justify-center gap-2.5 font-mono text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-foreground" />
          <span>14-day money-back guarantee • No credit card required for Starter</span>
        </div>
      </div>
    </section>
  );
}
