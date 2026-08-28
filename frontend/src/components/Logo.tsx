import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  to = "/",
  iconOnly = false,
}: {
  className?: string;
  to?: string;
  /** collapsed sidebar rail: symbol without the wordmark */
  iconOnly?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn("group inline-flex items-center gap-1.5", className)}
      data-testid="gitoco-logo"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[22px] w-[22px] shrink-0 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 4v10a3 3 0 0 0 3 3h4" />
        <circle cx="7" cy="18" r="2.2" />
        <circle cx="17" cy="6" r="2.2" />
        <circle cx="17" cy="17" r="2.2" />
      </svg>
      {!iconOnly && (
        <span className="whitespace-nowrap font-heading text-[17px] font-semibold tracking-tight">
          Gitoco
        </span>
      )}
    </Link>
  );
}
