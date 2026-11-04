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
import { ModeToggle } from "@/components/theme-toggle";

// Map routes to readable page titles
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs",
  "/saved-jobs": "Saved Jobs",
  "/saved-resumes": "Saved Resumes",
  "/resume": "Create Resume",
  "/apply": "One-click",
  "/autopilot": "Job Autopilot",
  "/profile": "Master Profile",
  "/billing": "Billing",
  "/settings": "Settings",
  "/career-guide": "Career Guide",
  "/whatsapp": "WhatsApp Agent",
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

  const isChatRoute = pathname.startsWith("/career-guide");

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground flex flex-col">
      <SidebarProvider className="h-full w-full min-h-0 flex-1 overflow-hidden flex flex-row">
        <AppSidebar />
        <SidebarInset className="h-full min-h-0 w-full flex-1 flex flex-col overflow-hidden relative bg-background text-foreground">
          {/* Grain texture layer placed behind page canvas in light mode (hidden in dark mode for pure OLED black) */}
          <GrainBackground className="opacity-20 mix-blend-multiply dark:hidden" />

          {/* Top bar with clean title and dark/light mode toggle */}
          <header className="shrink-0 z-20 flex h-14 items-center justify-between border-b border-border/80 bg-background/90 backdrop-blur-md px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors flex items-center justify-center shrink-0 cursor-pointer" />
              <Separator orientation="vertical" className="h-4 mx-1 opacity-50" />
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <span className="text-muted-foreground/70 hidden sm:inline font-normal">Workspace</span>
                <span className="text-muted-foreground/30 hidden sm:inline">/</span>
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {getTitle(pathname)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>

          {/* Page content */}
          <div className={`relative z-10 flex-1 min-h-0 w-full flex flex-col ${isChatRoute ? "overflow-hidden" : "overflow-y-auto"}`}>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
