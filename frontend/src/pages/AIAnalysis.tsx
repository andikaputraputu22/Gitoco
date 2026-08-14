import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ANALYSIS_STEPS, REPOS, getRepo } from "@/lib/mock";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEP_MS = 900;

export default function AIAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, update } = useApp();
  const routeIds = (location.state as { ids?: string[] } | null)?.ids;
  const idsRef = useRef<string[]>(
    routeIds && routeIds.length
      ? routeIds
      : state.analyzedIds.length
        ? state.analyzedIds
        : REPOS.filter((r) => r.recommended).map((r) => r.id),
  );
  const ids = idsRef.current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= ANALYSIS_STEPS.length) {
      const timer = window.setTimeout(() => {
        update({ analyzedIds: ids });
        navigate(`/insights/${ids[0]}`, { replace: true });
      }, 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [step, ids, navigate, update]);

  const pct = Math.round((Math.min(step, ANALYSIS_STEPS.length) / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background" data-testid="ai-analysis-screen">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <Logo to="/dashboard" />

        <div className="mt-12">
          <Badge variant="outline" className="mono rounded-full border-primary/30 bg-primary/8 text-[11px] text-primary">
            AI ANALYSIS IN PROGRESS
          </Badge>
          <h1 className="mt-5 font-heading text-[32px] font-semibold leading-tight sm:text-[38px]">
            Reading your code like a senior engineer.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Analysing {ids.length} repositor{ids.length === 1 ? "y" : "ies"} —{" "}
            <span className="mono text-foreground">{ids.map((id) => getRepo(id)?.name ?? id).join(", ")}</span>
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-7">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">Progress</p>
            <span className="mono text-[13px] font-semibold text-primary" data-testid="analysis-progress-value">{pct}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>

          <ul className="mt-8 space-y-4">
            {ANALYSIS_STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li
                  key={label}
                  data-testid={`analysis-step-${i}`}
                  data-state={done ? "done" : active ? "active" : "pending"}
                  className={cn(
                    "flex items-center gap-3 text-[14px] transition-colors duration-300",
                    done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground/50",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                      done
                        ? "border-[var(--success)] bg-[var(--success)]/12 text-[var(--success)]"
                        : active
                          ? "border-primary text-primary"
                          : "border-border",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  </span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-8 text-[12px] text-muted-foreground/70">
          Simulated analysis for the prototype. A production build would stream real GitHub metadata through an LLM.
        </p>
      </div>
    </div>
  );
}
