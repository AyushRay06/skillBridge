/**
 * skeletons.tsx
 * ─────────────────────────────────────────────────────────────
 * Centralised skeleton loading components for every page.
 * Built on top of the shadcn <Skeleton> primitive.
 *
 * Usage:
 *   import { DashboardSkeleton } from "@/components/skeletons";
 *   if (loading) return <DashboardSkeleton />;
 * ─────────────────────────────────────────────────────────────
 */

import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────
// Shared atoms — tiny re-usable pieces
// ─────────────────────────────────────────────────────────────

/** Full-page centred skeleton wrapper */
export const PageSkeleton = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    {children}
  </div>
);

/** Card outline matching the app's rounded-3xl card style */
export const CardShell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-none p-6 ${className}`}>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 1. PAGE-LEVEL SPINNER REPLACEMENT
//    Used while auth / profile is checking (any page)
// ─────────────────────────────────────────────────────────────
export const FullPageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-full max-w-md px-6 space-y-4">
      <Skeleton className="h-8 w-48 mx-auto rounded-xl" />
      <Skeleton className="h-4 w-72 mx-auto rounded-lg" />
      <Skeleton className="h-4 w-56 mx-auto rounded-lg" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 2. DASHBOARD — Resume grid cards + agent pipeline cards
// ─────────────────────────────────────────────────────────────
export const DashboardResumeSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <CardShell key={i}>
        {/* Icon + delete btn */}
        <div className="flex items-start justify-between mb-6 pl-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        {/* Title + name */}
        <div className="pl-4 mb-6 space-y-2">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        {/* Dates */}
        <div className="pl-4 space-y-2.5 border-t border-border pt-5 mb-5">
          <Skeleton className="h-3.5 w-44 rounded-md" />
          <Skeleton className="h-3.5 w-40 rounded-md" />
        </div>
        {/* CTA link */}
        <div className="pl-4">
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </CardShell>
    ))}
  </div>
);

export const DashboardAgentCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    {[...Array(3)].map((_, i) => (
      <CardShell key={i} className="p-8 space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </CardShell>
    ))}
  </div>
);

/** Full dashboard skeleton: agents + resume grid */
export const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-12">
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 rounded-2xl" />
        <Skeleton className="h-5 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-44 rounded-2xl" />
    </div>
    <DashboardAgentCardsSkeleton />
    <DashboardResumeSkeleton />
  </div>
);

// ─────────────────────────────────────────────────────────────
// 3. AUTOPILOT — Schedule cards tab
// ─────────────────────────────────────────────────────────────
export const ScheduleCardSkeleton = () => (
  <CardShell className="space-y-5">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-5 w-44 rounded-lg" />
        <Skeleton className="h-3.5 w-28 rounded-md" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
    {/* Filter tags */}
    <div className="space-y-3 border-b border-border pb-5">
      {[64, 48, 72].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className={`h-3.5 w-${w} rounded-md`} />
        </div>
      ))}
    </div>
    {/* Stats + run btn */}
    <div className="flex justify-between items-center bg-muted p-4 rounded-2xl border border-border">
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-28 rounded-md" />
        <Skeleton className="h-3 w-36 rounded-md" />
      </div>
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
  </CardShell>
);

export const ScheduleGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(count)].map((_, i) => <ScheduleCardSkeleton key={i} />)}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 4. AUTOPILOT — Discovered jobs feed
// ─────────────────────────────────────────────────────────────
export const JobCardSkeleton = () => (
  <CardShell>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Left */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-14 rounded-md" />
        </div>
        <Skeleton className="h-5 w-72 rounded-lg" />
        <Skeleton className="h-4 w-52 rounded-md" />
        <Skeleton className="h-3.5 w-64 rounded-md" />
      </div>
      {/* Right */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  </CardShell>
);

export const JobFeedSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => <JobCardSkeleton key={i} />)}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 5. APPLY / ONE-CLICK GENERATE PAGE
// ─────────────────────────────────────────────────────────────
export const ApplyInputPanelSkeleton = () => (
  <CardShell className="space-y-4">
    {/* Panel header */}
    <div className="flex items-center gap-2 mb-2">
      <Skeleton className="h-5 w-5 rounded-md" />
      <Skeleton className="h-5 w-36 rounded-lg" />
    </div>
    {/* Textarea */}
    <div className="space-y-1.5">
      <Skeleton className="h-3.5 w-32 rounded-md" />
      <Skeleton className="h-52 w-full rounded-2xl" />
    </div>
    {/* Button */}
    <Skeleton className="h-12 w-full rounded-2xl" />
  </CardShell>
);

export const ApplyResultPanelSkeleton = () => (
  <CardShell className="min-h-[550px] space-y-6">
    {/* Header row */}
    <div className="flex justify-between items-center border-b border-border pb-4">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-56 rounded-lg" />
        <Skeleton className="h-3.5 w-40 rounded-md" />
      </div>
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
    {/* Tab selector bar */}
    <div className="flex gap-2 bg-muted/60 p-1.5 rounded-2xl">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="flex-1 h-9 rounded-xl" />
      ))}
    </div>
    {/* Content area */}
    <div className="space-y-3">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-3/4 rounded-xl" />
    </div>
  </CardShell>
);

export const ApplyPageSkeleton = () => (
  <div className="max-w-6xl mx-auto relative z-10 pt-28 px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="mb-10 space-y-3">
      <Skeleton className="h-4 w-36 rounded-lg" />
      <Skeleton className="h-9 w-72 rounded-2xl" />
      <Skeleton className="h-4 w-96 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ApplyInputPanelSkeleton />
      </div>
      <div className="lg:col-span-2">
        <ApplyResultPanelSkeleton />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 6. PROFILE PAGE
// ─────────────────────────────────────────────────────────────
export const ProfileSectionSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <CardShell className="space-y-4">
    {/* Section header */}
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-md" />
        <Skeleton className="h-5 w-36 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16 rounded-xl" />
    </div>
    {/* Field rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton className="h-3.5 w-24 rounded-md" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    ))}
  </CardShell>
);

export const ProfilePageSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52 rounded-2xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <Skeleton className="h-11 w-36 rounded-2xl" />
    </div>
    {/* Avatar + name header card */}
    <CardShell className="flex items-center gap-6 p-8">
      <Skeleton className="h-20 w-20 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-4 w-36 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
    </CardShell>
    {/* Section cards */}
    <ProfileSectionSkeleton rows={3} />
    <ProfileSectionSkeleton rows={4} />
    <ProfileSectionSkeleton rows={2} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// 7. RESUME CREATE PAGE
// ─────────────────────────────────────────────────────────────
export const ResumeFormSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 space-y-6">
    {/* Header */}
    <div className="space-y-3 mb-8">
      <Skeleton className="h-4 w-36 rounded-lg" />
      <Skeleton className="h-9 w-64 rounded-2xl" />
      <Skeleton className="h-4 w-80 rounded-lg" />
    </div>
    {/* Form sections */}
    {[...Array(4)].map((_, i) => (
      <CardShell key={i} className="space-y-5">
        {/* Section title */}
        <Skeleton className="h-5 w-36 rounded-lg border-b border-border pb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </CardShell>
    ))}
    {/* Submit button */}
    <Skeleton className="h-12 w-full rounded-2xl" />
  </div>
);
