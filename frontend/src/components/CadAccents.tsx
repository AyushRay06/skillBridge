"use client";

import React from "react";

/**
 * CadCrosshair renders an engineering "+" reticle marker
 * positioned at line intersections.
 */
export function CadCrosshair({
  className = "",
  size = "text-[11px]",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`font-mono font-bold text-foreground/60 select-none pointer-events-none leading-none z-20 ${size} ${className}`}
    >
      +
    </span>
  );
}

/**
 * HatchedBlock renders a small architectural hatched box
 * with slanting lines, perfect for card headers, corners, or tag accents.
 */
export function HatchedBlock({
  className = "",
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      aria-hidden="true"
      className={`border border-border/80 bg-muted/20 overflow-hidden select-none pointer-events-none ${
        orientation === "vertical" ? "w-3 h-10" : "w-12 h-3.5"
      } ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent, transparent 7px, var(--border) 7px, var(--border) 8.5px)",
      }}
    />
  );
}

/**
 * CrisscrossBox renders a precision orthogonal grid block
 * created by crisscrossing straight horizontal and vertical lines.
 */
export function CrisscrossBox({
  className = "",
  size = "w-10 h-10",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`border border-border/80 bg-muted/10 overflow-hidden select-none pointer-events-none ${size} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    />
  );
}

/**
 * StraightLinePattern renders a pattern of straight parallel lines
 * (horizontal or vertical) for engineering cad badges.
 */
export function StraightLinePattern({
  className = "",
  direction = "horizontal",
  size = "w-12 h-4",
}: {
  className?: string;
  direction?: "horizontal" | "vertical";
  size?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`border border-border/80 bg-muted/10 overflow-hidden select-none pointer-events-none ${size} ${className}`}
      style={{
        backgroundImage:
          direction === "horizontal"
            ? "repeating-linear-gradient(to bottom, transparent, transparent 3px, var(--border) 3px, var(--border) 4px)"
            : "repeating-linear-gradient(to right, transparent, transparent 3px, var(--border) 3px, var(--border) 4px)",
      }}
    />
  );
}


/**
 * CadStraightLineBorder
 * Constructs a very subtle light greenish-emerald border of straight-line combinations
 * around the hovered card, with an outer hairline, stepped 6px inner hairline,
 * orthogonal tick mark track, and precision corner crosshairs, without any green hue wash.
 */
export function CadStraightLineBorder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 select-none animate-in fade-in duration-300 ${className}`}
    >
      {/* Outer Emerald Boundary Hairline */}
      <div className="absolute inset-0 border border-emerald-500/70" />

      {/* Stepped Inner Emerald Hairline (6px inset) */}
      <div className="absolute inset-[6px] border border-emerald-500/30" />

      {/* Top Border Straight-Line Grid Track */}
      <div
        className="absolute top-0 left-0 right-0 h-[6px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Bottom Border Straight-Line Grid Track */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[6px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Left Border Straight-Line Grid Track */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[6px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Right Border Straight-Line Grid Track */}
      <div
        className="absolute top-0 bottom-0 right-0 w-[6px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 0px, rgba(16, 185, 129, 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Precision CAD Corner Crosshairs (+) */}
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none">
        +
      </span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none">
        +
      </span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none">
        +
      </span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-emerald-400 font-bold leading-none">
        +
      </span>
    </div>
  );
}
