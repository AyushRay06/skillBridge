"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Activity,
  User,
  CreditCard,
  LogOut,
  ChevronUp,
  Plus,
  Briefcase,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Navigation Config (Categorized) ──────────────────────────

// 1. Overview (Dashboard)
const overviewItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
];

// 2. Create & Autopilot
const creationItems = [
  {
    label: "Create New Resume",
    icon: Plus,
    href: "/resume",
  },
  {
    label: "One-Click Automation",
    icon: Sparkles,
    href: "/apply",
  },
  {
    label: "Job Autopilot",
    icon: Activity,
    href: "/autopilot",
  },
];

// 3. Jobs & Resumes
const jobItems = [
  {
    label: "Jobs",
    icon: Briefcase,
    href: "/jobs",
  },
  {
    label: "Saved Resumes",
    icon: FileText,
    href: "/saved-resumes",
  },
];

// 4. Master Profile
const profileItems = [
  {
    label: "Master Profile",
    icon: User,
    href: "/profile",
  },
];

// 5. Billing
const billingItems = [
  {
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
];

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

// ─── Reusable NavGroup with Subtle Division ───────────────────
function NavGroup({
  label,
  items,
  pathname,
}: {
  label?: string;
  items: NavItem[];
  pathname: string;
}) {
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <SidebarGroup className="p-0 py-0.5">
      {label && (
        <SidebarGroupLabel className="h-5 px-2 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider select-none">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={active}
                tooltip={item.label}
                className={`
                  group relative flex items-center gap-2.5 h-8 rounded-none text-xs font-medium
                  transition-colors
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
                  ${
                    active
                      ? "bg-zinc-200/90 dark:bg-zinc-800/90 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }
                `}
              >
                <Link href={item.href} className="flex items-center gap-2.5 w-full">
                  <item.icon
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ─── User Initials Helper ─────────────────────────────────────
function getInitials(name: string | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── AppSidebar ───────────────────────────────────────────────
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

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar select-none">
      {/* ── Brand Header (Deploy/Career Heading Typography) ─── */}
      <SidebarHeader className="h-12 px-4 flex flex-row items-center border-b border-border transition-all group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <Link href="/dashboard" className="flex items-center group w-full overflow-hidden group-data-[collapsible=icon]:justify-center">
          {!isCollapsed ? (
            <span className="font-heading text-base font-bold tracking-tight text-foreground select-none leading-none group-hover:opacity-85 transition-opacity truncate">
              CareerCrewAI
            </span>
          ) : (
            <span className="font-heading text-sm font-bold tracking-tight text-foreground select-none leading-none mx-auto">
              CC
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* ── Navigation Content (Subtle Dividers & Compact Categorization) ── */}
      <SidebarContent className="px-2 py-2 overflow-x-hidden overflow-y-auto">
        {/* 1. Dashboard */}
        <NavGroup items={overviewItems} pathname={pathname} />

        <SidebarSeparator className="my-1.5 mx-1 opacity-40" />

        {/* 2. Create & Autopilot */}
        <NavGroup
          label="Create & Autopilot"
          items={creationItems}
          pathname={pathname}
        />

        <SidebarSeparator className="my-1.5 mx-1 opacity-40" />

        {/* 3. Jobs & Resumes */}
        <NavGroup
          label="Jobs & Resumes"
          items={jobItems}
          pathname={pathname}
        />

        <SidebarSeparator className="my-1.5 mx-1 opacity-40" />

        {/* 4. Master Profile */}
        <NavGroup
          label="Profile"
          items={profileItems}
          pathname={pathname}
        />

        <SidebarSeparator className="my-1.5 mx-1 opacity-40" />

        {/* 5. Billing */}
        <NavGroup
          label="Billing"
          items={billingItems}
          pathname={pathname}
        />
      </SidebarContent>

      {/* ── User Footer (Profile Icon at the bottom) ────────── */}
      <SidebarFooter className="px-2 pb-2">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.fullName ?? "Account"}
                  className="h-auto p-1.5 rounded-none border border-border/50 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 w-full min-w-0">
                    {/* Square Avatar Profile Icon */}
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName || "User"}
                        className="w-7 h-7 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 rounded-none shrink-0 border border-border object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 rounded-none bg-muted border border-border flex items-center justify-center font-mono text-[10px] font-semibold text-foreground shrink-0">
                        {getInitials(user?.fullName)}
                      </div>
                    )}
                    {!isCollapsed && (
                      <>
                        <div className="flex flex-col leading-tight flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-medium text-foreground truncate">
                              {user?.fullName ?? "User"}
                            </span>
                            {user?.subscriptionPlan && user.subscriptionPlan !== "free" && (
                              <span className="font-mono text-[8px] uppercase tracking-wider px-1 py-0.2 bg-foreground text-background font-bold shrink-0">
                                {user.subscriptionPlan}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground truncate">
                            {user?.email ?? ""}
                          </span>
                        </div>
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-52 rounded-none border border-border shadow-xl p-1"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 cursor-pointer rounded-none font-medium text-xs py-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
