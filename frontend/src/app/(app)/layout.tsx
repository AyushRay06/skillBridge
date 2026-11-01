"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { FullPageSkeleton } from "@/components/skeletons";
import GrainBackground from "@/components/GrainBackground";

// Map routes to readable page titles
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs",
  "/saved-resumes": "Saved Resumes",
  "/resume": "Create Resume",
  "/apply": "One-click",
  "/autopilot": "Job Autopilot",
  "/profile": "Master Profile",
  "/billing": "Billing",
  "/settings": "Settings",
};

function getTitle(pathname: string) {
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === path || pathname.startsWith(path + "/")) return title;
  }
  return "CareerCrew";
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return <FullPageSkeleton />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-background text-foreground overflow-x-hidden relative flex flex-col">
        {/* Grain texture layer placed behind page canvas */}
        <GrainBackground className="opacity-20 mix-blend-multiply dark:opacity-15 dark:mix-blend-screen" />

        {/* Top bar with clean title */}
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-xs px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground rounded-none transition-colors border border-transparent hover:border-border" />
            <Separator orientation="vertical" className="h-3.5 mx-1" />
            <span className="text-xs font-semibold text-foreground tracking-tight">
              {getTitle(pathname)}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="relative z-10 flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
