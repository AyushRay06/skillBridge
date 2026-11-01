"use client";

import React, { useEffect, useState } from "react";

/**
 * GrainOverlay renders a tactile, authentic monochrome film/paper grain texture.
 * Scoped strictly to the landing page with pointer-events-none.
 * Uses neutral grayscale values with balanced opacity so it is clearly visible
 * as an elegant texture without being harsh or greenish.
 */
export default function GrainOverlay() {
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
      // High-density neutral monochrome film specks
      const isDark = Math.random() > 0.45;
      const shade = isDark ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 60) + 195;
      data[i] = shade;     // R
      data[i + 1] = shade; // G
      data[i + 2] = shade; // B
      // Organic analog distribution
      data[i + 3] = Math.floor(Math.random() * 55) + 25;
    }

    ctx.putImageData(imgData, 0, 0);
    setPatternUrl(canvas.toDataURL("image/png"));
  }, []);

  if (!patternUrl) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full select-none"
      style={{
        backgroundImage: `url(${patternUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px 140px",
        opacity: 0.15,
        mixBlendMode: "multiply",
      }}
    />
  );
}

