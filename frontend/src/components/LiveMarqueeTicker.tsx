"use client";

import React from "react";

const tickerItems = [
  { tag: "AGENT 01", text: "Search for relevant jobs according to users' profiles and target criteria" },
  { tag: "AGENT 02", text: "Score each searched job and rank them by fit score" },
  { tag: "AGENT 03", text: "Generate a resume from a JD, 100% in LaTeX" },
  { tag: "AGENT 04", text: "Generate a cover letter according to the company" },
  { tag: "AGENT 05", text: "Write a personalized email for outreach" },
  { tag: "AGENT 06", text: "Apply automatically" },
];

export default function LiveMarqueeTicker() {
  return (
    <div
      aria-label="Live System Telemetry Marquee"
      className="relative w-full border-y border-border/80 bg-muted/20 py-2.5 overflow-hidden select-none"
    >
      <div className="flex w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Render twice for continuous loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-6 font-mono text-[11px] text-muted-foreground whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {item.tag}
            </span>
            <span className="text-foreground/80">{item.text}</span>
            <span className="text-border/80 pl-3">///</span>
          </div>
        ))}
      </div>
    </div>
  );
}
