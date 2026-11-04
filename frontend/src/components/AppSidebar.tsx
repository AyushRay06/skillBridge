"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { axiosAPI } from "@/lib/axiosInterface";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Activity,
  User,
  CreditCard,
  LogOut,
  ChevronDown,
  Plus,
  Briefcase,
  Compass,
  Map,
  Star,
} from "@/components/animate-ui/icons";
import { ChevronsUpDown, MessageSquare } from "lucide-react";
import { PandaLogo } from "@/components/PandaLogo";
import { getCached, setCache } from "@/lib/clientCache";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme-toggle";

// ─── Professional Navigation Configuration ──────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number; animateOnHover?: boolean }>;
  href: string;
  badge?: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        label: "Job Autopilot",
        icon: Activity,
        href: "/autopilot",
        badge: (
          <span className="inline-flex items-center gap-1 font-mono text-[9.5px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live
          </span>
        ),
      },
      {
        label: "One-Click Apply",
        icon: Sparkles,
        href: "/apply",
      },
      {
        label: "Create Resume",
        icon: Plus,
        href: "/resume",
      },
    ],
  },
  {
    title: "Discovery",
    items: [
      {
        label: "Jobs Explorer",
        icon: Briefcase,
        href: "/jobs",
      },
      {
        label: "Saved Jobs",
        icon: Star,
        href: "/saved-jobs",
      },
      {
        label: "Saved Resumes",
        icon: FileText,
        href: "/saved-resumes",
      },
    ],
  },
  {
    title: "Career Advisory",
    items: [
      {
        label: "Career Guide",
        icon: Compass,
        href: "/career-guide",
        badge: (
          <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium border border-border select-none">
            AI
          </span>
        ),
      },
      {
        label: "WhatsApp Bot",
        icon: MessageSquare,
        href: "/whatsapp",
        badge: (
          <span className="inline-flex items-center gap-1 font-mono text-[9.5px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live
          </span>
        ),
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Master Profile",
        icon: User,
        href: "/profile",
      },
      {
        label: "Billing & Plans",
        icon: CreditCard,
        href: "/billing",
      },
    ],
  },
];

// ─── Roadmaps Nested Section ────────────────────────────────────────────────

interface SavedRoadmap {
  id: string;
  title: string;
  targetRole?: string;
}

function RoadmapsSubSection({ pathname }: { pathname: string }) {
  const { isAuthenticated } = useAuth();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>(() => {
    return getCached<SavedRoadmap[]>("sidebar_roadmaps", 180_000) || [];
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);

  const fetchRoadmaps = useCallback(() => {
    if (!isAuthenticated) return;
    axiosAPI
      .get("/career-guide/roadmaps")
      .then((res) => {
        const list = res.data.roadmaps ?? res.data ?? [];
        setRoadmaps(list);
        setCache("sidebar_roadmaps", list);
      })
      .catch(() => {
        // silently fail
      });
  }, [isAuthenticated]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchRoadmaps();
    };
    window.addEventListener("skillbridge:roadmap-updated", handleUpdate);
    return () => {
      window.removeEventListener("skillbridge:roadmap-updated", handleUpdate);
    };
  }, [fetchRoadmaps]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const currentId = params.get("roadmap");
      setActiveRoadmapId(currentId);
      if (currentId) {
        setIsExpanded(true);
      }
    }
  }, [pathname]);

  if (!roadmaps.length) return null;

  return (
    <div className="mt-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsExpanded((prev) => !prev)}
          tooltip="Saved Roadmaps"
          className="group relative flex items-center h-9 rounded-md text-[13px] font-medium transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer px-2.5 select-none"
        >
          <Map className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden tracking-tight">
            Saved Roadmaps
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md border border-border bg-muted/60 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0">
            {roadmaps.length}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-180 text-foreground" : ""
            )}
          />
        </SidebarMenuButton>

        {/* Smooth Accordion Motion with Framer Motion */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden group-data-[collapsible=icon]:hidden"
            >
              <div className="pl-3 pr-1 py-1 mt-0.5 space-y-0.5 border-l border-border/70 ml-4.5">
                {roadmaps.map((rm) => {
                  const isActive = activeRoadmapId === rm.id;
                  const href = `/career-guide?roadmap=${rm.id}`;
                  return (
                    <Link
                      key={rm.id}
                      href={href}
                      className={cn(
                        "group/rm flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                        isActive
                          ? "bg-muted text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      title={rm.title}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                          isActive
                            ? "bg-foreground"
                            : "bg-muted-foreground/40 group-hover/rm:bg-foreground"
                        )}
                      />
                      <span className="truncate leading-tight">{rm.title}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenuItem>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Main AppSidebar Component ──────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isItemActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar text-foreground select-none flex flex-col justify-between"
    >
      {/* ── Professional Workspace Header ───────────────────────────────── */}
      <SidebarHeader className="h-14 px-3.5 flex flex-row items-center border-b border-border/80 bg-sidebar transition-all group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group w-full overflow-hidden group-data-[collapsible=icon]:justify-center select-none"
        >
          {/* Brand Icon Box */}
          <div className="w-8 h-8 rounded-md border border-border/80 bg-card flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-foreground/40 shadow-2xs">
            <PandaLogo className="w-5 h-5" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-heading text-sm font-bold tracking-tight text-foreground truncate flex items-center gap-1.5">
                CareerCrew
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-sm bg-muted text-muted-foreground border border-border/60">
                  AI
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground/80 truncate">
                Personal Workspace
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* ── Navigation List (Balanced & Even Spacing) ───────────────── */}
      <SidebarContent className="px-3 py-3 overflow-x-hidden overflow-y-auto flex-1 space-y-4">
        {NAVIGATION_GROUPS.map((group) => (
          <SidebarGroup key={group.title} className="p-0">
            {/* Subtle, Professional Category Label */}
            <div className="px-2.5 mb-1.5 select-none">
              <span className="text-[10.5px] font-mono font-semibold text-muted-foreground/70 uppercase tracking-wider block">
                {group.title}
              </span>
            </div>

            {/* Navigation Items (Consistent 36px Height, 6px Even Gap) */}
            <SidebarMenu className="gap-1.5">
              {group.items.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "group relative flex items-center h-9 rounded-md text-[13px] font-medium transition-all select-none p-0 overflow-hidden",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-9",
                        active
                          ? "bg-muted/90 text-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Link
                        href={item.href}
                        className="relative flex items-center gap-3 w-full h-full px-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                      >
                        {/* Active Left Indicator Bar */}
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-full" />
                        )}

                        {/* Icon */}
                        <item.icon
                          size={16}
                          animateOnHover
                          className={cn(
                            "w-4 h-4 shrink-0 z-10 transition-colors ml-0.5",
                            active
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />

                        {/* Label */}
                        <span className="flex-1 truncate group-data-[collapsible=icon]:hidden z-10 tracking-tight">
                          {item.label}
                        </span>

                        {/* Badge */}
                        {item.badge && (
                          <div className="z-10 group-data-[collapsible=icon]:hidden">
                            {item.badge}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Nested Roadmaps under Career Advisory */}
              {group.title === "Career Advisory" && (
                <RoadmapsSubSection pathname={pathname} />
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Professional User Profile Footer ───────────────────────────── */}
      <SidebarFooter className="p-2.5 border-t border-border/80 bg-sidebar shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.fullName ?? "Account"}
                  className="h-auto p-2 rounded-md border border-border/60 hover:bg-muted/50 hover:border-border transition-all select-none cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 w-full min-w-0">
                    {/* User Avatar */}
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName || "User"}
                        className="w-8 h-8 rounded-full border border-border object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-mono text-[11px] font-semibold text-foreground shrink-0">
                        {getInitials(user?.fullName)}
                      </div>
                    )}

                    {!isCollapsed && (
                      <>
                        <div className="flex flex-col leading-tight flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {user?.fullName ?? "User"}
                            </span>
                            {user?.subscriptionPlan && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-sm bg-foreground text-background font-bold shrink-0">
                                {user.subscriptionPlan}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {user?.email ?? ""}
                          </span>
                        </div>
                        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56 rounded-lg border border-border shadow-xl p-1 bg-popover text-popover-foreground space-y-0.5 font-sans"
              >
                {/* Account Details Header */}
                <div className="px-2.5 py-2 border-b border-border/70 mb-1 select-none">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.fullName ?? "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email ?? ""}
                  </p>
                </div>

                {/* Profile link */}
                <DropdownMenuItem
                  asChild
                  className="rounded-md cursor-pointer text-xs font-medium py-2 hover:bg-muted/60 transition-colors"
                >
                  <Link href="/profile" className="flex items-center gap-2.5 w-full">
                    <User size={14} className="text-muted-foreground" />
                    <span>Master Profile</span>
                  </Link>
                </DropdownMenuItem>

                {/* Billing link */}
                <DropdownMenuItem
                  asChild
                  className="rounded-md cursor-pointer text-xs font-medium py-2 hover:bg-muted/60 transition-colors"
                >
                  <Link href="/billing" className="flex items-center gap-2.5 w-full">
                    <CreditCard size={14} className="text-muted-foreground" />
                    <span>Billing & Subscription</span>
                  </Link>
                </DropdownMenuItem>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between px-2.5 py-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium">Theme</span>
                  <ModeToggle />
                </div>

                {/* Sign Out */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-md font-medium text-xs py-2 border-t border-border/60"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
