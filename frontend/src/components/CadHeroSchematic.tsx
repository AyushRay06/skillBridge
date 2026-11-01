"use client";

import React, { useState } from "react";
import { CadCrosshair } from "./CadAccents";

/**
 * CadHeroSchematic
 * A high-precision architectural blueprint composed 100% of straight lines,
 * orthogonal grids, metric ticks, and geometric wireframe art in clean light mode:
 * - Central Autonomous Career Daemon / Robot Bot
 * - Left Search Lens / Crawler Radar
 * - Right LaTeX Resume Document with 99% ATS checkmark
 * - Bottom Application Dispatch Envelope with speed guide rails
 * - Interconnecting 90° bus lines and CAD calibration metadata
 */
export default function CadHeroSchematic() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none border border-border/80 bg-background/90 shadow-xs text-foreground">
      {/* Precision Outer Corner Reticles */}
      <CadCrosshair className="-top-2 -left-2 absolute" size="text-[10px]" />
      <CadCrosshair className="-top-2 -right-2 absolute" size="text-[10px]" />
      <CadCrosshair className="-bottom-2 -left-2 absolute" size="text-[10px]" />
      <CadCrosshair className="-bottom-2 -right-2 absolute" size="text-[10px]" />

      {/* Top Millimeter Ruler Strip */}
      <div
        className="w-full h-3 border-b border-border/60 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
        }}
      />

      {/* Main SVG Blueprint Canvas */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted/5 flex items-center justify-center p-2">
        {/* Full-bleed Orthogonal Hairline Grid Background */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Left & Right Ruler Strips */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 border-r border-border/60 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to bottom, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2.5 border-l border-border/60 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to bottom, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
          }}
        />

        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-foreground"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* =========================================================
              1. STRUCTURAL BACKGROUND RAILS & GUIDE AXES (Dashed & Solid)
              ========================================================= */}
          {/* Main Major Axes */}
          <line x1="250" y1="20" x2="250" y2="480" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <line x1="20" y1="250" x2="480" y2="250" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

          {/* Sub-alignment guides */}
          <line x1="100" y1="20" x2="100" y2="480" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />
          <line x1="400" y1="20" x2="400" y2="480" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />
          <line x1="20" y1="120" x2="480" y2="120" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />
          <line x1="20" y1="380" x2="480" y2="380" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />

          {/* Diagonal Corner Rays (45-degree straight guidelines) */}
          <line x1="30" y1="30" x2="110" y2="110" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          <line x1="470" y1="30" x2="390" y2="110" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          <line x1="30" y1="470" x2="120" y2="380" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          <line x1="470" y1="470" x2="380" y2="380" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

          {/* =========================================================
              2. INTERCONNECTING 90° BUS RAILS & CIRCUIT TRACES
              ========================================================= */}
          {/* Bus from Search Lens to Robot Head */}
          <path
            d="M 125 155 H 170 V 175 H 180"
            stroke="var(--foreground)"
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* Bus from Robot Torso to LaTeX Resume */}
          <path
            d="M 320 255 H 370 V 185 H 360"
            stroke="var(--foreground)"
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* Bus from Robot Torso down to Dispatch Envelope */}
          <path
            d="M 250 320 V 355"
            stroke="var(--foreground)"
            strokeWidth="1.2"
            opacity="0.9"
          />
          <path
            d="M 220 310 V 375 H 200"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d="M 280 310 V 375 H 300"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Node Junction Reticles (+) */}
          <text x="170" y="178" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">+</text>
          <text x="370" y="188" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">+</text>
          <text x="250" y="340" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">+</text>

          {/* =========================================================
              3. LEFT NODE: THE GEOMETRIC SEARCH RADAR / MAGNIFIER
              ========================================================= */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-100"
            onMouseEnter={() => setActiveNode("search")}
            onMouseLeave={() => setActiveNode(null)}
            opacity={activeNode === "search" || !activeNode ? "0.95" : "0.5"}
          >
            {/* Outer Octagonal Frame */}
            <polygon
              points="75,70 120,70 142,92 142,138 120,160 75,160 52,138 52,92"
              stroke="var(--foreground)"
              strokeWidth="1.8"
              fill="var(--background)"
            />
            {/* Inner Concentric Octagonal Ring */}
            <polygon
              points="80,78 115,78 134,97 134,133 115,152 80,152 61,133 61,97"
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            {/* Center Orthogonal Crosshair */}
            <line x1="97" y1="62" x2="97" y2="168" stroke="var(--foreground)" strokeWidth="1" opacity="0.7" />
            <line x1="44" y1="115" x2="150" y2="115" stroke="var(--foreground)" strokeWidth="1" opacity="0.7" />

            {/* Target Reticles & Radar Scan Box */}
            <rect x="87" y="105" width="20" height="20" stroke="var(--foreground)" strokeWidth="1.2" fill="none" />
            <circle cx="97" cy="115" r="1.5" fill="var(--foreground)" />

            {/* Straight Radar Angle Lines (45-degree sweeps) */}
            <line x1="72" y1="90" x2="122" y2="140" stroke="var(--border)" strokeWidth="0.8" />
            <line x1="72" y1="140" x2="122" y2="90" stroke="var(--border)" strokeWidth="0.8" />

            {/* Diagonal Straight Handle */}
            <polygon
              points="125,145 152,172 144,180 117,153"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              fill="var(--background)"
            />
            {/* Handle Grip Lines */}
            <line x1="126" y1="156" x2="134" y2="148" stroke="var(--border)" strokeWidth="1" />
            <line x1="133" y1="163" x2="141" y2="155" stroke="var(--border)" strokeWidth="1" />
            <line x1="140" y1="170" x2="148" y2="162" stroke="var(--border)" strokeWidth="1" />

            {/* Monospace Metadata Tag */}
            <rect x="45" y="188" width="105" height="18" stroke="var(--border)" fill="var(--background)" strokeWidth="1" />
            <text x="97" y="200" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">
              01 // CRAWL_SEARCH
            </text>
          </g>

          {/* =========================================================
              4. RIGHT NODE: THE GEOMETRIC LATEX RESUME DOCUMENT
              ========================================================= */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-100"
            onMouseEnter={() => setActiveNode("resume")}
            onMouseLeave={() => setActiveNode(null)}
            opacity={activeNode === "resume" || !activeNode ? "0.95" : "0.5"}
          >
            {/* Outer Sheet with Chamfered Folded Corner */}
            <polygon
              points="355,68 418,68 440,90 440,185 355,185"
              stroke="var(--foreground)"
              strokeWidth="1.8"
              fill="var(--background)"
            />
            {/* Corner Fold Triangle */}
            <polygon
              points="418,68 418,90 440,90"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              fill="var(--muted)"
              opacity="0.5"
            />

            {/* LaTeX Document Header (Candidate Profile Line Block) */}
            <rect x="367" y="80" width="42" height="6" fill="var(--foreground)" />
            <rect x="367" y="90" width="60" height="2" fill="var(--border)" />

            {/* Section 1: Experience Line Segments */}
            <line x1="367" y1="102" x2="428" y2="102" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="367" y1="110" x2="422" y2="110" stroke="var(--border)" strokeWidth="1" />
            <line x1="367" y1="116" x2="415" y2="116" stroke="var(--border)" strokeWidth="1" />
            <line x1="367" y1="122" x2="426" y2="122" stroke="var(--border)" strokeWidth="1" />

            {/* Section 2: Skills & LaTeX Typesetting Line Segments */}
            <line x1="367" y1="134" x2="410" y2="134" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="367" y1="142" x2="428" y2="142" stroke="var(--border)" strokeWidth="1" />
            <line x1="367" y1="148" x2="418" y2="148" stroke="var(--border)" strokeWidth="1" />

            {/* ATS Verification Stamp with 45° Checkmark */}
            <rect x="400" y="156" width="32" height="20" stroke="var(--foreground)" strokeWidth="1.2" fill="var(--background)" />
            <path
              d="M 406 166 L 411 171 L 424 159"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
            />

            {/* Monospace Metadata Tag */}
            <rect x="345" y="195" width="105" height="18" stroke="var(--border)" fill="var(--background)" strokeWidth="1" />
            <text x="397" y="207" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">
              02 // LATEX_ATS_98%
            </text>
          </g>

          {/* =========================================================
              5. CENTER MASTER: THE AUTONOMOUS CAREER DAEMON / ROBOT BOT
              ========================================================= */}
          <g
            className="cursor-pointer transition-transform hover:scale-[1.01]"
            onMouseEnter={() => setActiveNode("daemon")}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Daemon Crest / Angular Straight-Line Horns & Antenna */}
            {/* Left Horn */}
            <polygon
              points="208,128 185,80 174,80 196,128"
              stroke="var(--foreground)"
              strokeWidth="1.8"
              fill="var(--background)"
            />
            {/* Right Horn */}
            <polygon
              points="292,128 315,80 326,80 304,128"
              stroke="var(--foreground)"
              strokeWidth="1.8"
              fill="var(--background)"
            />
            {/* Center Antenna Mast */}
            <line x1="250" y1="128" x2="250" y2="70" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="240" y1="70" x2="260" y2="70" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="244" y1="62" x2="256" y2="62" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="247" y1="55" x2="253" y2="55" stroke="#10b981" strokeWidth="2" />

            {/* Frequency Pulse Lines Above Antenna */}
            <line x1="235" y1="46" x2="265" y2="46" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="228" y1="38" x2="272" y2="38" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 3" />

            {/* Ear Radiator Cooling Fins (Horizontal Straight Hairlines) */}
            {/* Left Ear Fins */}
            <line x1="168" y1="158" x2="180" y2="158" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="164" y1="165" x2="180" y2="165" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="162" y1="172" x2="180" y2="172" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="164" y1="179" x2="180" y2="179" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="168" y1="186" x2="180" y2="186" stroke="var(--foreground)" strokeWidth="1.5" />
            {/* Right Ear Fins */}
            <line x1="320" y1="158" x2="332" y2="158" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="320" y1="165" x2="336" y2="165" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="320" y1="172" x2="338" y2="172" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="320" y1="179" x2="336" y2="179" stroke="var(--foreground)" strokeWidth="1.5" />
            <line x1="320" y1="186" x2="332" y2="186" stroke="var(--foreground)" strokeWidth="1.5" />

            {/* Head Chassis: Octagonal Chamfered Straight-Line Helmet */}
            <polygon
              points="200,128 300,128 320,148 320,202 300,222 200,222 180,202 180,148"
              stroke="var(--foreground)"
              strokeWidth="2.2"
              fill="var(--background)"
            />

            {/* Head Chamfer Accent Lines */}
            <line x1="180" y1="148" x2="200" y2="148" stroke="var(--border)" strokeWidth="1" />
            <line x1="300" y1="148" x2="320" y2="148" stroke="var(--border)" strokeWidth="1" />
            <line x1="180" y1="202" x2="200" y2="202" stroke="var(--border)" strokeWidth="1" />
            <line x1="300" y1="202" x2="320" y2="202" stroke="var(--border)" strokeWidth="1" />

            {/* Inner Visor Housing (Chamfered Rectangle) */}
            <polygon
              points="194,152 306,152 312,158 312,184 306,190 194,190 188,184 188,158"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              fill="var(--muted)"
              opacity="0.35"
            />

            {/* Visor Scanlines (Straight Horizontal Lines spaced 5px) */}
            <line x1="190" y1="158" x2="310" y2="158" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />
            <line x1="190" y1="164" x2="310" y2="164" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />
            <line x1="190" y1="170" x2="310" y2="170" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />
            <line x1="190" y1="176" x2="310" y2="176" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />
            <line x1="190" y1="182" x2="310" y2="182" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />

            {/* Geometric Polygonal Eyes (Sharp Square/Diamond CAD Sensors) */}
            {/* Left Eye */}
            <rect x="210" y="162" width="22" height="18" stroke="var(--foreground)" strokeWidth="1.8" fill="var(--background)" />
            <line x1="221" y1="162" x2="221" y2="180" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="210" y1="171" x2="232" y2="171" stroke="var(--foreground)" strokeWidth="1" />
            <circle cx="221" cy="171" r="2.5" fill="#10b981" />

            {/* Right Eye */}
            <rect x="268" y="162" width="22" height="18" stroke="var(--foreground)" strokeWidth="1.8" fill="var(--background)" />
            <line x1="279" y1="162" x2="279" y2="180" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="268" y1="171" x2="290" y2="171" stroke="var(--foreground)" strokeWidth="1" />
            <circle cx="279" cy="171" r="2.5" fill="#10b981" />

            {/* Mouth / Audio Vocoder (Straight Vertical Ticks) */}
            <line x1="216" y1="206" x2="284" y2="206" stroke="var(--foreground)" strokeWidth="1.2" />
            <line x1="222" y1="202" x2="222" y2="210" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="230" y1="200" x2="230" y2="212" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="238" y1="202" x2="238" y2="210" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="246" y1="199" x2="246" y2="213" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="254" y1="199" x2="254" y2="213" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="262" y1="202" x2="262" y2="210" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="270" y1="200" x2="270" y2="212" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="278" y1="202" x2="278" y2="210" stroke="var(--foreground)" strokeWidth="1" />

            {/* Neck Mechanical Pivot Rail */}
            <rect x="232" y="222" width="36" height="12" stroke="var(--foreground)" strokeWidth="1.5" fill="var(--background)" />
            <line x1="238" y1="222" x2="238" y2="234" stroke="var(--border)" strokeWidth="1" />
            <line x1="244" y1="222" x2="244" y2="234" stroke="var(--border)" strokeWidth="1" />
            <line x1="250" y1="222" x2="250" y2="234" stroke="var(--border)" strokeWidth="1" />
            <line x1="256" y1="222" x2="256" y2="234" stroke="var(--border)" strokeWidth="1" />
            <line x1="262" y1="222" x2="262" y2="234" stroke="var(--border)" strokeWidth="1" />

            {/* Torso / Chassis Frame (Straight Trapezoidal Geometry) */}
            <polygon
              points="190,234 310,234 326,258 316,322 184,322 174,258"
              stroke="var(--foreground)"
              strokeWidth="2.2"
              fill="var(--background)"
            />

            {/* Shoulder Articulation Brackets */}
            <rect x="160" y="244" width="14" height="24" stroke="var(--foreground)" strokeWidth="1.5" fill="var(--background)" />
            <line x1="160" y1="256" x2="174" y2="256" stroke="var(--border)" strokeWidth="1" />
            <rect x="326" y="244" width="14" height="24" stroke="var(--foreground)" strokeWidth="1.5" fill="var(--background)" />
            <line x1="326" y1="256" x2="340" y2="256" stroke="var(--border)" strokeWidth="1" />

            {/* Inner Core Chamber: The "Autonomous Reasoning Engine" */}
            <rect x="214" y="248" width="72" height="54" stroke="var(--foreground)" strokeWidth="1.8" fill="var(--muted)" opacity="0.3" />
            <rect x="218" y="252" width="64" height="46" stroke="var(--border)" strokeWidth="1" fill="var(--background)" />

            {/* Core Heartbeat / ECG Waveform (All Straight Lines!) */}
            <polyline
              points="220,275 232,275 238,260 244,288 250,265 256,280 262,275 280,275"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
            />
            {/* Core Corner Crosshairs */}
            <text x="222" y="259" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)">+</text>
            <text x="274" y="259" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)">+</text>
            <text x="222" y="294" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)">+</text>
            <text x="274" y="294" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)">+</text>

            {/* Bottom Torso Output Connector Pins */}
            <line x1="200" y1="322" x2="200" y2="330" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="220" y1="322" x2="220" y2="330" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="240" y1="322" x2="240" y2="330" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="260" y1="322" x2="260" y2="330" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="280" y1="322" x2="280" y2="330" stroke="var(--foreground)" strokeWidth="2" />
            <line x1="300" y1="322" x2="300" y2="330" stroke="var(--foreground)" strokeWidth="2" />

          </g>

          {/* =========================================================
              6. BOTTOM NODE: THE DISPATCH ENVELOPE / OUTBOX MAILER
              ========================================================= */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-100"
            onMouseEnter={() => setActiveNode("dispatch")}
            onMouseLeave={() => setActiveNode(null)}
            opacity={activeNode === "dispatch" || !activeNode ? "0.95" : "0.5"}
          >
            {/* Outer Envelope Body (Sharp Rectangle) */}
            <rect
              x="200"
              y="370"
              width="100"
              height="60"
              stroke="var(--foreground)"
              strokeWidth="1.8"
              fill="var(--background)"
            />

            {/* Top Flap (Sharp Straight 45° Fold) */}
            <polyline
              points="200,370 250,405 300,370"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Bottom Diagonal Fold Lines */}
            <line x1="200" y1="430" x2="238" y2="398" stroke="var(--border)" strokeWidth="1.2" />
            <line x1="300" y1="430" x2="262" y2="398" stroke="var(--border)" strokeWidth="1.2" />

            {/* Trajectory / Speed Guide Rails (Leftward straight dispatch motion) */}
            <line x1="160" y1="385" x2="192" y2="385" stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="4 2" />
            <line x1="140" y1="400" x2="190" y2="400" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 3" />
            <line x1="165" y1="415" x2="192" y2="415" stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="4 2" />

            {/* Right Trajectory Guides */}
            <line x1="308" y1="390" x2="335" y2="390" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="308" y1="410" x2="345" y2="410" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Monospace Metadata Tag */}
            <rect x="195" y="442" width="110" height="18" stroke="var(--border)" fill="var(--background)" strokeWidth="1" />
            <text x="250" y="454" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">
              03 // DISPATCH_AUTOPILOT
            </text>
          </g>

          {/* =========================================================
              7. ARCHITECTURAL CALIBRATION LABELS & DIMENSION ARROWS
              ========================================================= */}
          {/* Top-Right Dimension Callout: 2.0 mm Spacing Marker */}
          <line x1="440" y1="230" x2="480" y2="230" stroke="var(--foreground)" strokeWidth="1" />
          <line x1="440" y1="226" x2="440" y2="234" stroke="var(--foreground)" strokeWidth="1" />
          <line x1="480" y1="226" x2="480" y2="234" stroke="var(--foreground)" strokeWidth="1" />
          <text x="460" y="222" fontSize="7" fontFamily="monospace" fill="var(--muted-foreground)" textAnchor="middle">
            2.0mm
          </text>

          {/* Bottom-Left Coordinate Angle Guide */}
          <path
            d="M 50 310 H 90 V 350"
            stroke="var(--border)"
            strokeWidth="1"
            fill="none"
          />
          <text x="65" y="328" fontSize="7" fontFamily="monospace" fill="var(--muted-foreground)">
            90° CAD
          </text>
        </svg>
      </div>

      {/* Bottom Millimeter Ruler Strip */}
      <div
        className="w-full h-3 border-t border-border/60 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
        }}
      />
    </div>
  );
}
