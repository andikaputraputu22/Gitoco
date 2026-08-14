import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn("group inline-flex items-center gap-2.5", className)}
      data-testid="gitoco-logo"
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_6px_20px_-8px_var(--primary)]">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4v10a3 3 0 0 0 3 3h4" />
          <circle cx="7" cy="18" r="2.2" />
          <circle cx="17" cy="6" r="2.2" />
          <circle cx="17" cy="17" r="2.2" />
        </svg>
      </span>
      <span className="whitespace-nowrap font-heading text-[17px] font-semibold tracking-tight">
        Gitoco
      </span>
    </Link>
  );
}
