import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepState = "done" | "active" | "pending";

/**
 * Shared progress checklist used by the PDF export and publish dialogs.
 * Extracted so both dialogs stay small and the step visuals never drift.
 */
export function StepList({
  steps,
  current,
  allDone = false,
  testId,
  idPrefix,
}: {
  steps: readonly string[];
  /** index of the in-flight step */
  current: number;
  /** force every step to render as complete */
  allDone?: boolean;
  testId: string;
  idPrefix: string;
}): React.ReactElement {
  return (
    <ul className="space-y-3.5 rounded-xl border border-border bg-muted/40 p-5" data-testid={testId}>
      {steps.map((label, i) => {
        const state: StepState = allDone || current > i ? "done" : current === i ? "active" : "pending";
        return (
          <li
            key={label}
            data-testid={`${idPrefix}-${i}`}
            data-state={state}
            className={cn(
              "flex items-center gap-3 text-[13.5px] transition-colors duration-300",
              state === "pending" ? "text-muted-foreground/50" : "text-foreground",
            )}
          >
            <span
              className={cn(
                "grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                state === "done"
                  ? "border-[var(--success)] bg-[var(--success)]/12 text-[var(--success)]"
                  : state === "active"
                    ? "border-primary text-primary"
                    : "border-border",
              )}
            >
              {state === "done" ? (
                <Check className="h-3 w-3" />
              ) : state === "active" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : null}
            </span>
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
