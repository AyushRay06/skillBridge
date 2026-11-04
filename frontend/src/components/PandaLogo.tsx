"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PandaLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function PandaLogo({ className, size = 28, ...props }: PandaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0 select-none", className)}
      aria-label="Panda Logo"
      {...props}
    >
      {/* Outer Ears */}
      <circle cx="11" cy="11.5" r="7.5" className="fill-foreground" />
      <circle cx="37" cy="11.5" r="7.5" className="fill-foreground" />

      {/* Inner Ear Highlights */}
      <circle cx="11" cy="11.5" r="4.2" className="fill-background" />
      <circle cx="37" cy="11.5" r="4.2" className="fill-background" />

      {/* Cute Head / Chubby Face (No outer background, clean contrast fill) */}
      <ellipse
        cx="24"
        cy="27"
        rx="18"
        ry="16"
        className="fill-background stroke-foreground"
        strokeWidth="2.5"
      />

      {/* Cute Panda Eye Patches (Angled Ovals) */}
      <ellipse
        cx="16.5"
        cy="25.5"
        rx="5.5"
        ry="6.5"
        transform="rotate(-14 16.5 25.5)"
        className="fill-foreground"
      />
      <ellipse
        cx="31.5"
        cy="25.5"
        rx="5.5"
        ry="6.5"
        transform="rotate(14 31.5 25.5)"
        className="fill-foreground"
      />

      {/* Big Sparkly Eye Pupils (Kawaii Reflections) */}
      <circle cx="17.6" cy="24" r="2.3" className="fill-background" />
      <circle cx="30.4" cy="24" r="2.3" className="fill-background" />

      {/* Mini Secondary Eye Sparkles */}
      <circle cx="15.2" cy="26.8" r="1.1" className="fill-background" />
      <circle cx="32.8" cy="26.8" r="1.1" className="fill-background" />

      {/* Cute Button Nose */}
      <path
        d="M 21.8 30.5 Q 24 29 26.2 30.5 Q 24 32.8 21.8 30.5 Z"
        className="fill-foreground"
      />

      {/* Adorable ':3' Smiling Mouth */}
      <path
        d="M 20 33.5 Q 22 36.2 24 34 Q 26 36.2 28 33.5"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Subtle Cute Cheek Blush Markings */}
      <ellipse
        cx="9.5"
        cy="31"
        rx="2.5"
        ry="1.2"
        className="fill-foreground opacity-20"
      />
      <ellipse
        cx="38.5"
        cy="31"
        rx="2.5"
        ry="1.2"
        className="fill-foreground opacity-20"
      />
    </svg>
  );
}

export default PandaLogo;

