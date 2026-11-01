"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Line,
  LineChart,
  Label,
} from "recharts";
import {
  Zap,
  Coins,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CadCrosshair,
  CrisscrossBox,
  StraightLinePattern,
  HatchedBlock,
} from "./CadAccents";

/* =========================================================================
   1. MULTIPLE BAR CHART: Manual Application vs. CareerCrew Velocity (Minutes)
   ========================================================================= */
const velocityData = [
  { step: "Job Discovery", manual: 120, careercrew: 1 },
  { step: "ATS Match", manual: 60, careercrew: 0.5 },
  { step: "LaTeX Tailor", manual: 180, careercrew: 0.5 },
  { step: "Find Recruiter", manual: 120, careercrew: 0.5 },
  { step: "Pitch Draft", manual: 60, careercrew: 0.5 },
  { step: "Submit & Track", manual: 60, careercrew: 0.5 },
];

const velocityConfig = {
  manual: {
    label: "Manual Grind (Minutes)",
    color: "hsl(0 72% 51%)",
  },
  careercrew: {
    label: "CareerCrew Autonomous (Minutes)",
    color: "hsl(142 71% 45%)",
  },
} satisfies ChartConfig;

function VelocityBarChartComponent() {
  return (
    <div className="w-full flex-1 flex flex-col justify-end pt-4 pb-2">
      <ChartContainer config={velocityConfig} className="w-full h-[220px]">
        <BarChart
          accessibilityLayer
          data={velocityData}
          margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />
          <XAxis
            dataKey="step"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            className="text-[11px] font-mono fill-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            className="text-[10px] font-mono fill-muted-foreground"
            unit="m"
            ticks={[0, 60, 120, 180]}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.2 }}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="manual"
            fill="var(--color-manual)"
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="careercrew"
            fill="var(--color-careercrew)"
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
            minPointSize={10}
          />
        </BarChart>
      </ChartContainer>
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/60 mt-2 gap-y-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
          <span>Manual 5-Job Grind: <strong className="text-foreground">600 min (10 hours)</strong></span>
        </span>
        <span className="flex items-center gap-1.5 font-bold text-emerald-500">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
          <span>CareerCrew Total: &lt; 2 minutes (300x faster)</span>
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. STACKED RADIAL CHART: Subscription Cost Elimination ($133/Month Saved)
   ========================================================================= */
const costData = [
  { category: "spend", manualStack: 149, careercrewStack: 16 },
];

const costConfig = {
  manualStack: {
    label: "Fragmented Subscriptions (ChatGPT + Claude + LinkedIn)",
    color: "hsl(0 72% 51%)",
  },
  careercrewStack: {
    label: "CareerCrew Elite ($16/mo)",
    color: "hsl(142 71% 45%)",
  },
} satisfies ChartConfig;

function TokenRadialChartComponent() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center pt-2 pb-2">
      <ChartContainer
        config={costConfig}
        className="mx-auto aspect-square w-full max-h-[220px]"
      >
        <RadialBarChart
          data={costData}
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={108}
        >
          <RadialBar
            dataKey="manualStack"
            fill="var(--color-manualStack)"
            cornerRadius={4}
            className="stroke-transparent stroke-2 opacity-85"
          />
          <RadialBar
            dataKey="careercrewStack"
            cornerRadius={4}
            fill="var(--color-careercrewStack)"
            className="stroke-transparent stroke-2"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 14}
                        className="fill-foreground text-3xl font-extrabold font-sans"
                      >
                        $133
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 6}
                        className="fill-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest"
                      >
                        SAVED / MO
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/60">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" />
          <span>Manual Stack: $149/mo</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-500 font-bold">
          <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
          <span>CareerCrew Elite: $16/mo (Save $133)</span>
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   3. HORIZONTAL BAR CHART: Multi-Engine ATS Parser Compatibility (96%+ Score)
   ========================================================================= */
const atsBarData = [
  { engine: "Greenhouse", manual: 42, careercrew: 98 },
  { engine: "Lever", manual: 38, careercrew: 96 },
  { engine: "Workday", manual: 29, careercrew: 95 },
  { engine: "Taleo", manual: 35, careercrew: 94 },
  { engine: "iCIMS", manual: 40, careercrew: 97 },
];

const atsBarConfig = {
  careercrew: {
    label: "CareerCrew (LaTeX ATS Pass Rate)",
    color: "hsl(142 71% 45%)",
  },
  manual: {
    label: "Standard Resume (Word/Canva Pass Rate)",
    color: "hsl(0 72% 51%)",
  },
} satisfies ChartConfig;

function AtsBarChartComponent() {
  return (
    <div className="w-full flex-1 flex flex-col justify-end pt-2 pb-2">
      <ChartContainer config={atsBarConfig} className="w-full h-[220px]">
        <BarChart
          accessibilityLayer
          data={atsBarData}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 16, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.25} />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            className="text-[10px] font-mono fill-muted-foreground"
            ticks={[0, 25, 50, 75, 100]}
          />
          <YAxis
            type="category"
            dataKey="engine"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-[11px] font-mono font-medium fill-foreground"
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.2 }}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="careercrew"
            fill="var(--color-careercrew)"
            radius={[0, 3, 3, 0]}
            maxBarSize={14}
          />
          <Bar
            dataKey="manual"
            fill="var(--color-manual)"
            radius={[0, 3, 3, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ChartContainer>
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/60">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" />
          <span>Standard: 36.8% avg pass rate</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-500 font-bold">
          <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
          <span>CareerCrew: 96.0% avg pass rate</span>
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   4. 30-DAY PIPELINE SCALING: Recruiter Interviews & Applications (All 4 in One Place)
   ========================================================================= */
const pipelineData = [
  { day: "Day 1", careercrewApps: 15, careercrewInterviews: 2, manualApps: 5, manualInterviews: 0 },
  { day: "Day 5", careercrewApps: 65, careercrewInterviews: 8, manualApps: 12, manualInterviews: 1 },
  { day: "Day 10", careercrewApps: 140, careercrewInterviews: 18, manualApps: 18, manualInterviews: 1 },
  { day: "Day 15", careercrewApps: 220, careercrewInterviews: 28, manualApps: 22, manualInterviews: 2 },
  { day: "Day 20", careercrewApps: 290, careercrewInterviews: 38, manualApps: 25, manualInterviews: 2 },
  { day: "Day 30", careercrewApps: 380, careercrewInterviews: 48, manualApps: 28, manualInterviews: 2 },
];

const pipelineConfig = {
  careercrewApps: {
    label: "CareerCrew Applications (Left Axis)",
    color: "var(--foreground)",
  },
  careercrewInterviews: {
    label: "CareerCrew Interviews (Right Axis)",
    color: "hsl(142 71% 45%)",
  },
  manualApps: {
    label: "Manual Applications (Left Axis)",
    color: "hsl(0 72% 51%)",
  },
  manualInterviews: {
    label: "Manual Interviews (Right Axis)",
    color: "hsl(24 95% 53%)",
  },
} satisfies ChartConfig;

function ApplicationVolumeLineChartComponent() {
  return (
    <div className="w-full flex-1 flex flex-col justify-end pt-4 pb-2">
      <ChartContainer config={pipelineConfig} className="w-full h-[230px]">
        <LineChart
          accessibilityLayer
          data={pipelineData}
          margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-[11px] font-mono fill-muted-foreground"
          />
          {/* Left Y-Axis for Applications */}
          <YAxis
            yAxisId="left"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            className="text-[10px] font-mono fill-muted-foreground"
            ticks={[0, 100, 200, 300, 400]}
          />
          {/* Right Y-Axis for Interviews */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            className="text-[10px] font-mono fill-muted-foreground"
            ticks={[0, 10, 20, 30, 40, 50]}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            yAxisId="left"
            dataKey="careercrewApps"
            type="monotone"
            stroke="var(--color-careercrewApps)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: "var(--foreground)" }}
          />
          <Line
            yAxisId="right"
            dataKey="careercrewInterviews"
            type="monotone"
            stroke="var(--color-careercrewInterviews)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(142 71% 45%)" }}
          />
          <Line
            yAxisId="left"
            dataKey="manualApps"
            type="monotone"
            stroke="var(--color-manualApps)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2, fill: "hsl(0 72% 51%)" }}
          />
          <Line
            yAxisId="right"
            dataKey="manualInterviews"
            type="monotone"
            stroke="var(--color-manualInterviews)"
            strokeWidth={1.5}
            strokeDasharray="2 2"
            dot={{ r: 2, fill: "hsl(24 95% 53%)" }}
          />
        </LineChart>
      </ChartContainer>

      {/* Single Minimal Legend Bar (Below Chart Only) */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/60 mt-2 gap-y-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-foreground font-semibold">
            <span className="w-2 h-2 rounded-xs bg-foreground inline-block" />
            <span>CareerCrew: 380 apps</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
            <span>48 interviews (24x lift)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" />
            <span>Manual: 28 apps</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-amber-500 inline-block" />
            <span>2 interviews</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN COMPONENT: Spacious, Unsqueezed Bento Dashboard
   ========================================================================= */
export default function TelemetryStatsSection() {
  return (
    <section
      id="telemetry"
      aria-label="Process Transformation and Empirical Performance Benchmarks"
      className="relative bg-background text-foreground w-full"
    >
      {/* Spacious Section Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-12 sm:pt-32 sm:pb-14">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            PROCESS TRANSFORMATION
          </span>
          <StraightLinePattern direction="horizontal" size="w-8 h-3 hidden sm:block opacity-60 ml-2" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Manual grind vs. autonomous velocity
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Applying to 5 jobs manually used to take an entire 10-hour workday. With CareerCrew, discover, score, tailor, and dispatch in under 2 minutes.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <CrisscrossBox size="w-8 h-8 hidden sm:block" />
            <div className="font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20">
              BENCHMARK: <strong className="text-foreground">300x EFFICIENCY</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Spacious, Unsqueezed Bento Grid Container */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pb-16 sm:pb-24">
        <div className="border border-border/80 bg-background relative shadow-xs">

          {/* =========================================================
              ROW 1: Velocity Bar Chart (8 cols) + Empty Box 1 (4 cols)
             ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/80 border-b border-border/80">
            
            {/* Cell 1 (8 cols): Multiple Bar Chart for Application Velocity */}
            <div className="lg:col-span-8 p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[380px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 border border-border/80 bg-background">
                      <Zap className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      Pipeline Velocity by Phase
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Manual 10-hour workday grind vs. automated multi-agent pipeline in minutes
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500 bg-muted/40 border border-border/80 px-2 py-0.5 shrink-0">
                  300x FASTER
                </span>
              </div>

              {/* Multiple Bar Chart */}
              <VelocityBarChartComponent />
            </div>

            {/* Cell 2 (4 cols): Empty Architectural Negative Space Box 1 (Zero Text, Pure Grid & Lines) */}
            <div className="lg:col-span-4 relative overflow-hidden select-none min-h-[380px] bg-muted/10 flex items-center justify-center p-8">
              <CadCrosshair className="-top-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-top-1.5 -right-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -right-1.5 absolute" size="text-[9px]" />

              {/* Full-bleed orthogonal straight-line grid */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Center Concentric Straight-Line Frames */}
              <div className="relative z-10 w-36 h-36 border border-border/80 bg-background/90 flex items-center justify-center shadow-xs">
                <CadCrosshair className="-top-1.5 -left-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-top-1.5 -right-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-bottom-1.5 -left-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-bottom-1.5 -right-1.5 absolute" size="text-[9px]" />
                
                <div className="w-24 h-24 border border-border/80 flex items-center justify-center bg-muted/20">
                  <div
                    className="w-16 h-16 border border-border/80 bg-background flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  >
                    <span className="font-mono text-sm font-bold text-foreground/70">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              ROW 2: Radial Token Chart (4 cols) + Empty Box 2 (4 cols, MIDDLE) + Radar Chart (4 cols, RIGHT)
             ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 divide-y md:divide-y-0 lg:divide-x divide-border/80 border-b border-border/80">
            
            {/* Cell 3 (4 cols): Stacked Radial Chart for Software Tool Stack Elimination */}
            <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between min-h-[380px] border-b md:border-b-0 border-border/80">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 border border-border/80 bg-background">
                      <Coins className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <h4 className="text-base font-bold tracking-tight text-foreground">
                      Software Tool Stack Elimination
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Replaces $149/mo in separate ChatGPT, Claude &amp; LinkedIn subs with CareerCrew Elite ($16/mo)
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-foreground bg-muted/40 border border-border/80 px-2 py-0.5 shrink-0">
                  SAVE $133/MO
                </span>
              </div>

              {/* Stacked Radial Bar Chart */}
              <TokenRadialChartComponent />
            </div>

            {/* Cell 4 (4 cols, MIDDLE): Empty Architectural Negative Space Box 2 (Zero Text, Multi-Axis Calibration Matrix with Ruler Ticks — NO Center Box) */}
            <div className="lg:col-span-4 relative overflow-hidden select-none min-h-[380px] bg-muted/10 flex flex-col justify-between border-b md:border-b-0 border-border/80">
              <CadCrosshair className="-top-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-top-1.5 -right-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -right-1.5 absolute" size="text-[9px]" />

              {/* Top horizontal ruler strip with millimeter tick marks */}
              <div
                className="w-full h-5 border-b border-border/70 shrink-0 opacity-70"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
                }}
              />

              {/* Main matrix field with open center (no box in the middle) */}
              <div className="relative flex-1 w-full overflow-hidden">
                {/* Full-bleed orthogonal hairline grid (20px x 20px) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Left vertical ruler strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-4 border-r border-border/70 pointer-events-none opacity-60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to bottom, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
                  }}
                />

                {/* Right vertical ruler strip */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-4 border-l border-border/70 pointer-events-none opacity-60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to bottom, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
                  }}
                />

                {/* Top-Right Quadrant: Fine diagonal slanting lines (accent zone) */}
                <div
                  className="absolute top-0 right-4 w-1/2 h-1/2 pointer-events-none opacity-25 border-b border-l border-dashed border-border/80"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent, transparent 5px, var(--border) 5px, var(--border) 6px)",
                  }}
                />

                {/* Bottom-Left Quadrant: Micro-dense orthogonal grid (accent zone) */}
                <div
                  className="absolute bottom-0 left-4 w-1/2 h-1/2 pointer-events-none opacity-30 border-t border-r border-dashed border-border/80"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                />

                {/* Major Primary Center Axes (solid cross-lines across the entire canvas) */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-border pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-border pointer-events-none" />

                {/* Secondary Guide Rails (dashed lines at 25% and 75%) */}
                <div className="absolute inset-x-4 top-1/4 h-[1px] border-b border-dashed border-border/60 pointer-events-none" />
                <div className="absolute inset-x-4 top-3/4 h-[1px] border-b border-dashed border-border/60 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/4 w-[1px] border-r border-dashed border-border/60 pointer-events-none" />
                <div className="absolute inset-y-0 left-3/4 w-[1px] border-r border-dashed border-border/60 pointer-events-none" />

                {/* Distributed Coordinate Reticle (+) Array across line intersections */}
                {/* Center Reticle (Open intersection, no bounding box) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <span className="font-mono text-base font-bold text-foreground leading-none select-none">+</span>
                </div>

                {/* 25% & 75% Corner and Edge Reticles */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/50 leading-none select-none">+</span>
                </div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/60 leading-none select-none">+</span>
                </div>
                <div className="absolute top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/50 leading-none select-none">+</span>
                </div>

                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/60 leading-none select-none">+</span>
                </div>
                <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/60 leading-none select-none">+</span>
                </div>

                <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/50 leading-none select-none">+</span>
                </div>
                <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/60 leading-none select-none">+</span>
                </div>
                <div className="absolute top-3/4 left-3/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-foreground/50 leading-none select-none">+</span>
                </div>
              </div>

              {/* Bottom horizontal ruler strip with millimeter tick marks */}
              <div
                className="w-full h-5 border-t border-border/70 shrink-0 opacity-70"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
                }}
              />
            </div>

            {/* Cell 5 (4 cols, RIGHT): Radar Chart for ATS Engine Compatibility (moved to 3rd position in Row 2) */}
            <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between min-h-[380px] md:col-span-2 lg:col-span-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 border border-border/80 bg-background">
                      <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <h4 className="text-base font-bold tracking-tight text-foreground">
                      ATS Pass Rate by System
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CareerCrew LaTeX resume match vs. standard Word/Canva resume pass rates across major ATS systems
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500 bg-muted/40 border border-border/80 px-2 py-0.5 shrink-0">
                  96.0% VS 36.8%
                </span>
              </div>

              {/* Horizontal Bar Chart */}
              <AtsBarChartComponent />
            </div>
          </div>

          {/* =========================================================
              ROW 3: Empty Box 3 (4 cols) + Application Volume Line Chart (8 cols)
             ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/80">
            
            {/* Cell 6 (4 cols): Empty Architectural Negative Space Box 3 (Zero Text, Pure Orthogonal Grid Matrix) */}
            <div className="lg:col-span-4 relative overflow-hidden select-none min-h-[380px] bg-muted/10 flex items-center justify-center p-8">
              <CadCrosshair className="-top-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-top-1.5 -right-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -left-1.5 absolute" size="text-[9px]" />
              <CadCrosshair className="-bottom-1.5 -right-1.5 absolute" size="text-[9px]" />

              {/* Full-bleed orthogonal straight grid */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Symmetrical concentric straight-line frames */}
              <div className="relative z-10 w-44 h-44 border border-border/80 bg-background/90 p-4 flex items-center justify-center shadow-xs">
                <CadCrosshair className="-top-1.5 -left-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-top-1.5 -right-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-bottom-1.5 -left-1.5 absolute" size="text-[9px]" />
                <CadCrosshair className="-bottom-1.5 -right-1.5 absolute" size="text-[9px]" />

                <div className="w-full h-full border border-border/80 p-3 flex items-center justify-center bg-muted/20">
                  <div
                    className="w-full h-full border border-border/80 bg-background flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  >
                    <div className="w-5 h-5 border border-border/80 flex items-center justify-center bg-muted/40">
                      <span className="font-mono text-xs font-bold text-foreground/70">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cell 7 (8 cols): Multiple Line Chart for Volume & Callback Scaling */}
            <div className="lg:col-span-8 p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[380px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 border border-border/80 bg-background">
                      <TrendingUp className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      30-Day Pipeline Scaling
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Applications sent vs. recruiter interviews scheduled over 30 days
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500 bg-muted/40 border border-border/80 px-2 py-0.5 shrink-0">
                  24x LIFT
                </span>
              </div>

              {/* Multiple Line Chart */}
              <ApplicationVolumeLineChartComponent />
            </div>
          </div>

          {/* Precision Corner CAD Reticles (+) */}
          <CadCrosshair className="absolute -top-2 -left-2" />
          <CadCrosshair className="absolute -top-2 -right-2" />
          <CadCrosshair className="absolute -bottom-2 -left-2" />
          <CadCrosshair className="absolute -bottom-2 -right-2" />
        </div>
      </div>
    </section>
  );
}
