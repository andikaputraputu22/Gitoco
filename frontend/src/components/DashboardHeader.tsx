import { Bell, Menu, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEVELOPER } from "@/lib/mock";
import type { ReactNode } from "react";

/**
 * Dashboard top bar: mobile nav trigger, search, theme toggle and the GitHub
 * identity area. Notifications and the profile are intentionally inactive in
 * this prototype, and the identity only renders once GitHub is connected.
 */
export function DashboardHeader({
  connected,
  open,
  onOpenChange,
  drawer,
}: {
  connected: boolean;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** sidebar contents rendered inside the mobile drawer */
  drawer: ReactNode;
}): React.ReactElement {
  return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass px-4 sm:px-6">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger
            render={
            <Button variant="ghost" size="icon-sm" className="lg:hidden" data-testid="mobile-nav-trigger" aria-label="Open navigation">
              <Menu className="h-4.5 w-4.5" />
            </Button>
            }
          />
          <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            {drawer}
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
          {/* Profile menu is intentionally inactive in this prototype.
            Identity only appears once GitHub is connected — before that the
            header shows a neutral placeholder. */}
          {connected ? (
            <span
            aria-disabled="true"
            title="Account menu isn't available in this prototype"
            className="flex cursor-not-allowed items-center gap-2.5 rounded-full pl-1 pr-3 opacity-90"
            data-testid="user-profile-trigger"
            >
            <img
              src={DEVELOPER.avatar}
              alt={DEVELOPER.fullName}
              className="h-8 w-8 rounded-full object-cover"
              data-testid="header-avatar"
            />
            <span className="hidden leading-tight sm:flex sm:flex-col">
              <span className="text-[13px] font-medium" data-testid="header-profile-name">
                {DEVELOPER.fullName}
              </span>
              <span className="mono text-[11px] text-muted-foreground" data-testid="header-profile-handle">
                @{DEVELOPER.handle}
              </span>
            </span>
            </span>
          ) : (
            <span
            aria-disabled="true"
            title="Connect GitHub to load your developer profile"
            className="flex cursor-not-allowed items-center gap-2 rounded-full pl-1 pr-3"
            data-testid="user-profile-placeholder"
            >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-border bg-muted text-muted-foreground">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="hidden text-[13px] font-medium text-muted-foreground sm:inline">
              Not connected
            </span>
            </span>
          )}
        </div>
      </header>
  );
}
