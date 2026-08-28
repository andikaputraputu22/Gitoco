import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  FolderGit2,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, testId: "nav-overview" },
  { to: "/projects", label: "My Projects", icon: FolderGit2, testId: "nav-projects" },
  { to: "/portfolio", label: "Portfolio", icon: Sparkles, testId: "nav-portfolio" },
  { to: "/job-match", label: "Job Match", icon: Briefcase, testId: "nav-job-match" },
  { to: "/settings", label: "Settings", icon: Settings, testId: "nav-settings" },
];

const SIDEBAR_KEY = "gitoco.sidebar.collapsed";

function loadCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

function NavItems({
  onNavigate,
  prefix = "",
  collapsed = false,
}: {
  onNavigate?: () => void;
  prefix?: string;
  collapsed?: boolean;
}) {
  const { stats } = useApp();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          data-testid={`${prefix}${item.testId}`}
          title={collapsed ? item.label : undefined}
          aria-label={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-muted-foreground",
              collapsed && "justify-center gap-0 px-0",
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
              <span className="relative flex items-center">
                <item.icon className="h-4 w-4 shrink-0" />
                {collapsed && item.label === "My Projects" && stats.analyzed > 0 && (
                  <span
                    className="mono absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground"
                    data-testid={`${prefix}nav-projects-count`}
                  >
                    {stats.analyzed}
                  </span>
                )}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === "My Projects" && stats.analyzed > 0 && (
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

function SidebarBody({
  onNavigate,
  prefix = "",
  collapsed = false,
  onToggleCollapsed,
}: {
  onNavigate?: () => void;
  prefix?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { stats } = useApp();
  return (
    <div className={cn("flex h-full flex-col gap-8 py-6", collapsed ? "px-2" : "px-4")}>
      <div className={cn("flex items-center", collapsed ? "flex-col gap-3" : "justify-between gap-2")}>
        <Logo to="/dashboard" className={collapsed ? "" : "px-2"} iconOnly={collapsed} />
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            data-testid="sidebar-collapse-btn"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {!collapsed && (
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            Workspace
          </p>
        )}
        <NavItems onNavigate={onNavigate} prefix={prefix} collapsed={collapsed} />
      </div>
      <div className={cn("mt-auto space-y-4 rounded-xl border border-sidebar-border bg-background/60 p-4", collapsed && "hidden")}>
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
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => loadCollapsed());

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {
      /* preference is best-effort */
    }
  }, [collapsed]);
  // GitHub identity in the header is driven by the persisted connection state,
  // so it survives navigation across the whole demo flow.
  const { state: { connected } } = useApp();

  return (
    <div
      className={cn(
        "min-h-screen bg-background lg:grid",
        collapsed ? "lg:grid-cols-[76px_1fr]" : "lg:grid-cols-[264px_1fr]",
      )}
      data-testid="dashboard-shell"
    >
      <aside
        className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block"
        data-collapsed={collapsed}
        data-testid="dashboard-sidebar"
      >
        <SidebarBody collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <DashboardHeader
          connected={connected}
          open={open}
          onOpenChange={setOpen}
          drawer={<SidebarBody onNavigate={() => setOpen(false)} prefix="mobile-" />}
        />

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
