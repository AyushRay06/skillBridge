import React from "react";
import { Briefcase } from "lucide-react";

interface HatchedSectionDividerProps {
  className?: string;
  icon?: React.ElementType;
}

/**
 * HatchedSectionDivider renders two full-width horizontal straight lines
 * separated by a sleek gap (h-5 to h-6, 20px–24px) of equal thickness.
 * The space between contains airy 45-degree slanting lines (30px pitch)
 * with a clean, minimal job icon in the center — zero text or eye friction.
 */
export default function HatchedSectionDivider({
  className = "",
  icon: Icon = Briefcase,
}: HatchedSectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative z-10 w-full py-10 sm:py-14 lg:py-16 select-none pointer-events-none ${className}`}
    >
      {/* Outer rail with symmetrical top and bottom horizontal lines of identical thickness */}
      <div className="relative w-full h-5 sm:h-6 border-y border-border/80 bg-muted/20 overflow-hidden flex items-center justify-center">
        {/* Airier, less dense 45-degree slanting lines (30px pitch) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 28px, var(--border) 28px, var(--border) 30px)",
          }}
        />

        {/* Minimal centered job icon badge with straight borders and zero text */}
        <div className="relative z-10 flex items-center justify-center h-full px-3.5 border-x border-border/80 bg-background text-foreground/70">
          <Icon className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

