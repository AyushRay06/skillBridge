"use client";

import React from "react";
import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import { CadCrosshair } from "./CadAccents";

export function FooterNew() {
  const productLinks = [
    { label: "1-Click Apply", href: "/apply" },
    { label: "LaTeX Resumes", href: "/resume" },
    { label: "Autopilot Dispatch", href: "/autopilot" },
    { label: "Job Crawler", href: "/jobs" },
  ];

  const platformLinks = [
    { label: "Architecture", href: "/#pipeline" },
    { label: "Telemetry", href: "/#telemetry" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "ATS Guidelines", href: "/#faq" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://x.com", label: "X / Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer
      aria-label="Site Footer"
      className="relative w-full bg-[#161618] text-[#f4f4f5] overflow-hidden border-t border-zinc-800/80 select-none"
    >
      {/* Top Millimeter Ruler Calibration Line */}
      <div
        className="w-full h-2 border-b border-zinc-800/60 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px)",
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Brand & Minimalist Straight-Line Robot Avatar (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Link
              href="/"
              className="inline-flex items-center group focus:outline-none"
              aria-label="Carrier Crew AI Home"
            >
              <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white select-none group-hover:opacity-85 transition-opacity">
                CareerCrewAI
              </span>
            </Link>

            <p className="font-mono text-xs text-zinc-300 max-w-sm leading-relaxed">
              Autonomous multi-agent infrastructure for live job discovery, ATS LaTeX synthesis, and automated dispatch.
            </p>

            {/* Operational Status */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-300 pt-1">
              <span className="w-1.5 h-1.5 rounded-xs bg-emerald-400 inline-block animate-pulse" />
              <span>ALL AGENTS ACTIVE</span>
              <span className="text-zinc-500">//</span>
              <span className="text-zinc-200 font-bold">v4.2</span>
            </div>
          </div>

          {/* Product Links (2 cols) */}
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
              PRODUCT
            </div>
            <ul className="space-y-2.5 font-mono text-xs text-zinc-300">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1 group text-zinc-300"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links (2 cols) */}
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
              PLATFORM
            </div>
            <ul className="space-y-2.5 font-mono text-xs text-zinc-300">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1 group text-zinc-300"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Socials (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between h-full">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
                LEGAL
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-zinc-300 mb-6">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors block text-zinc-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Straight 0px Social Icon Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((soc) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={soc.label}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.label}
                    className="flex h-7 w-7 items-center justify-center border border-zinc-600 bg-[#222226] text-zinc-200 hover:bg-white hover:text-black transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Architectural Wordmark: CAREERCREWAI */}
      <div className="relative select-none overflow-hidden border-t border-zinc-800/80 bg-[#121214] w-full">
        {/* Dimension Rails */}
        <div className="w-full flex items-center justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-1.5 border-b border-zinc-800/60 font-mono text-[9px] text-zinc-400 bg-[#141417]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-zinc-400 inline-block" />
            <span className="font-semibold text-zinc-300">CAD_0px_RAIL</span>
          </span>
          <span className="hidden sm:inline text-zinc-400 font-mono">|←— 1330mm ARCHITECTURAL SPAN —→|</span>
          <span className="text-zinc-300 font-bold">SCALE 1:1</span>
        </div>

        {/* Monolithic CAREERCREWAI Wordmark (No borders, subtle graphite tone, single continuous word) */}
        <div className="w-full flex justify-center items-center leading-none pointer-events-none py-2 sm:py-4 px-2 overflow-hidden relative select-none">
          <span
            className="text-[12.6vw] sm:text-[13.4vw] font-black tracking-tighter uppercase whitespace-nowrap inline-block select-none font-mono"
            style={{
              letterSpacing: "-0.03em",
              color: "rgba(255, 255, 255, 0.12)",
            }}
          >
            CAREERCREWAI
          </span>
        </div>

        {/* 1-Line Minimalist Copyright & Telemetry Strip */}
        <div className="border-t border-zinc-800/80 bg-[#101012] py-4 px-6 sm:px-12 lg:px-16 xl:px-24 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-zinc-300">
          <div>
            © 2026 CAREERCREWAI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-5 text-zinc-300">
            <span>FORMAT: <strong className="text-zinc-100">100% LATEX</strong></span>
            <span>GEOMETRY: <strong className="text-zinc-100">0px SHARP</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
