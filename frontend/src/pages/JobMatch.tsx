import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Loader2, Sparkles, Target } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeJobMatch, getRepo, REPOS } from "@/lib/mock";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const SAMPLE =
  "Senior Android Developer with strong experience in Kotlin, Jetpack Compose, MVVM, REST APIs, Coroutines and automated testing.";

export default function JobMatch(): React.ReactElement {
  const { state, update } = useApp();
  const [text, setText] = useState(state.jobDescription);
  const [busy, setBusy] = useState(false);
  const result = state.jobMatch;

  function analyze() {
    if (text.trim().length < 20) {
      toast.error("Paste a longer job description", { description: "At least a couple of sentences works best." });
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const res = analyzeJobMatch(text, state.analyzedIds);
      update({ jobMatch: res, jobDescription: text });
      setBusy(false);
      toast.success(`Match score: ${res.score}%`);
    }, 1600);
  }

  return (
    <AppLayout
      title="Job Match"
      subtitle="Paste a job description and Gitoco scores your analysed projects against it."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-7">
          <div className="flex items-center gap-2.5">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">Job description</h2>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={12}
            className="mt-5 resize-none text-[14px] leading-relaxed"
            data-testid="job-description-input"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button className="rounded-full" onClick={analyze} disabled={busy} data-testid="analyze-job-match-btn">
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing match…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Analyze Job Match
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText(SAMPLE)}
              data-testid="use-sample-job-btn"
            >
              Use sample role
            </Button>
          </div>
          {state.analyzedIds.length === 0 && (
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
              You haven't analysed any projects yet — scoring will use all {REPOS.length} demo repositories.{" "}
              <Link to="/repositories" className="text-primary hover:underline" data-testid="job-match-analyse-link">
                Analyse your projects
              </Link>{" "}
              for a tailored result.
            </p>
          )}
        </section>

        <section>
          {!result ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-8 py-16 text-center" data-testid="job-match-empty-state">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-heading text-[17px] font-semibold">No analysis yet</h3>
              <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
                Paste a job description on the left to see your match score, strengths and gaps.
              </p>
            </div>
          ) : (
            <div className="space-y-5" data-testid="job-match-results">
              <div className="rounded-2xl border border-primary/25 bg-primary/6 p-7">
                <p className="mono text-[11px] uppercase tracking-[0.16em] text-primary">Job match score</p>
                <div className="mt-3 flex items-end gap-4">
                  <span className="font-heading text-[52px] font-semibold leading-none" data-testid="job-match-score">
                    {result.score}%
                  </span>
                  <div className="flex-1 pb-2">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${result.score}%` }} />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{result.summary}</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6" data-testid="job-match-strong">
                  <h3 className="font-heading text-[14px] font-semibold uppercase tracking-[0.08em]">Strong matches</h3>
                  <ul className="mt-4 space-y-2.5">
                    {result.strong.map((s) => (
                      <li key={s} className="flex items-center gap-2.5 text-[13.5px]">
                        <Check className="h-4 w-4 shrink-0 text-[var(--success)]" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6" data-testid="job-match-gaps">
                  <h3 className="font-heading text-[14px] font-semibold uppercase tracking-[0.08em]">Potential gaps</h3>
                  <ul className="mt-4 space-y-2.5">
                    {result.gaps.map((g) => (
                      <li key={g} className="flex items-center gap-2.5 text-[13.5px]">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--warning)]" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6" data-testid="job-match-recommended-projects">
                <h3 className="font-heading text-[14px] font-semibold uppercase tracking-[0.08em]">Recommended projects to highlight</h3>
                <ol className="mt-4 space-y-2">
                  {result.recommendedProjects.map((name, i) => {
                    const repo = REPOS.find((r) => r.name === name) ?? getRepo(name.toLowerCase());
                    return (
                      <li key={name} className="flex items-center gap-3 text-[14px]">
                        <span className="mono text-[12px] text-muted-foreground">{i + 1}.</span>
                        {repo ? (
                          <Link to={`/insights/${repo.id}`} className="font-medium text-primary hover:underline" data-testid={`job-match-project-${repo.id}`}>
                            {name}
                          </Link>
                        ) : (
                          <span>{name}</span>
                        )}
                        {repo && <Badge variant="outline" className="mono text-[11px]">{repo.language}</Badge>}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="rounded-2xl border border-[var(--warning)]/30 bg-[var(--warning)]/8 p-6" data-testid="job-match-improvements">
                <h3 className="font-heading text-[14px] font-semibold uppercase tracking-[0.08em]">Recommended improvements</h3>
                <p className="mt-3 text-[14px] leading-relaxed">{result.improvement}</p>
                <Link to="/portfolio" className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-5 rounded-full"} data-testid="job-match-open-portfolio-btn">
                  Update my portfolio
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
