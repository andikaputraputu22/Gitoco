import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Briefcase,
  FolderGit2,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DEVELOPER } from "@/lib/mock";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, testId: "nav-overview" },
  { to: "/projects", label: "My Projects", icon: FolderGit2, testId: "nav-projects" },
  { to: "/portfolio", label: "Portfolio", icon: Sparkles, testId: "nav-portfolio" },
  { to: "/job-match", label: "Job Match", icon: Briefcase, testId: "nav-job-match" },
  { to: "/settings", label: "Settings", icon: Settings, testId: "nav-settings" },
];

function NavItems({ onNavigate, prefix = "" }: { onNavigate?: () => void; prefix?: string }) {
  const { stats } = useApp();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          data-testid={`${prefix}${item.testId}`}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-muted-foreground",
              "transition-[color,background-color] duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "absolute left-0 h-5 w-[2px] rounded-full bg-primary opacity-0 transition-opacity duration-200",
                  isActive && "opacity-100",
                )}
              />
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {item.label === "My Projects" && stats.analyzed > 0 && (
                <Badge variant="secondary" className="ml-auto mono text-[11px]">
                  {stats.analyzed}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate, prefix = "" }: { onNavigate?: () => void; prefix?: string }) {
  const { stats } = useApp();
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <Logo to="/dashboard" className="px-2" />
      <div className="space-y-3">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          Workspace
        </p>
        <NavItems onNavigate={onNavigate} prefix={prefix} />
      </div>
      <div className="mt-auto space-y-4 rounded-xl border border-sidebar-border bg-background/60 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-medium">Portfolio completion</p>
          <span className="mono text-[13px] font-semibold text-primary" data-testid={`${prefix}sidebar-completion-value`}>
            {stats.completion}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700"
            style={{ width: `${stats.completion}%` }}
          />
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Demo workspace — repositories and AI output are simulated.
        </p>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden" data-testid="mobile-nav-trigger" aria-label="Open navigation">
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBody onNavigate={() => setOpen(false)} prefix="mobile-" />
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, technologies…"
              className="h-9 rounded-full pl-9 text-[13px]"
              data-testid="topbar-search-input"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle testId="theme-toggle-dashboard" />
            {/* Notifications are a visual demo element only — intentionally inactive. */}
            <span
              aria-disabled="true"
              title="Notifications aren't available in this prototype"
              className="relative grid size-8 cursor-not-allowed place-items-center rounded-full text-muted-foreground/50"
              data-testid="notifications-trigger"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/50" />
            </span>
            {/* Profile menu is intentionally inactive in this prototype. */}
            <span
              aria-disabled="true"
              title="Account menu isn't available in this prototype"
              className="flex cursor-not-allowed items-center gap-2 rounded-full pl-1 pr-3 opacity-70"
              data-testid="user-profile-trigger"
            >
              <img src={DEVELOPER.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="hidden text-[13px] font-medium sm:inline">{DEVELOPER.name}</span>
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {(title || action) && (
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                {title && <h1 className="font-heading text-[30px] font-semibold leading-tight sm:text-[34px]">{title}</h1>}
                {subtitle && <p className="text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>}
              </div>
              {action}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
