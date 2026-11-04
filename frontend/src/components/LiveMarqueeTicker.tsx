"use client";

import React from "react";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

export default function LiveMarqueeTicker() {
  const { t } = useLandingLanguage();
  const items = (t.ticker?.events || []).map((evt, idx) => ({
    tag: `AGENT 0${idx + 1}`,
    text: evt,
  }));

  return (
    <div
      aria-label="Live System Telemetry Marquee"
      className="relative w-full border-y border-border/80 bg-muted/20 py-2.5 overflow-hidden select-none"
    >
      <div className="flex w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Render twice for continuous loop */}
        {[...items, ...items].map((item, idx) => (
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
