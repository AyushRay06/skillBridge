"use client";

import React, { useEffect, useState } from "react";

interface GrainBackgroundProps {
  className?: string;
}

/**
 * GrainBackground renders an authentic monochrome film-grain texture
 * positioned directly on the background canvas (behind page cards, components, and sidebar items).
 * 
 * Because page boxes and cards use opaque backgrounds (bg-card), they sit clearly
 * and sharply on top of the texture without any blur or grain obscuring their text or buttons.
 */
export default function GrainBackground({ className = "" }: GrainBackgroundProps) {
  const [patternUrl, setPatternUrl] = useState<string>("");

  useEffect(() => {
    // Generate a 180x180 neutral monochrome noise pattern
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(180, 180);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Balanced neutral monochrome film specks
      const isDark = Math.random() > 0.45;
      const shade = isDark
        ? Math.floor(Math.random() * 60)
        : Math.floor(Math.random() * 60) + 195;
      data[i] = shade;     // R
      data[i + 1] = shade; // G
      data[i + 2] = shade; // B
      data[i + 3] = Math.floor(Math.random() * 60) + 35; // Alpha
    }

    ctx.putImageData(imgData, 0, 0);
    setPatternUrl(canvas.toDataURL("image/png"));
  }, []);

  if (!patternUrl) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full select-none opacity-20 mix-blend-multiply dark:opacity-15 dark:mix-blend-screen ${className}`}
      style={{
        backgroundImage: `url(${patternUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px 140px",
      }}
    />
  );
}
