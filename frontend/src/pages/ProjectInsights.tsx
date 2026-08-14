import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  ExternalLink,
  Gauge,
  ListChecks,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getInsight, getRepo } from "@/lib/mock";
import { useApp } from "@/lib/store";

function Panel({
  title,
  icon: Icon,
  children,
  testId,
}: {
  title: string;
  icon: typeof Star;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6" data-testid={testId}>
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ProjectInsights() {
  const { id = "" } = useParams();
  const { state } = useApp();
  const repo = getRepo(id);
  const insight = getInsight(id);

  if (!repo || !insight) {
    return (
      <AppLayout title="Project not found" subtitle="That repository isn't part of this demo workspace.">
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-16 text-center" data-testid="insight-not-found">
          <Link to="/projects" className={buttonVariants() + " rounded-full"} data-testid="insight-back-to-projects-btn">
            Back to my projects
          </Link>
        </div>
      </AppLayout>
    );
  }

  const others = state.analyzedIds.filter((x) => x !== id);

  return (
    <AppLayout>
      <Link
        to="/projects"
        className="mono mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
        data-testid="insights-back-link"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> My Projects
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="mono text-[11px]" data-testid="insight-complexity-badge">
                Complexity: {insight.complexity}
              </Badge>
              <Badge variant="outline" className="mono text-[11px]">{repo.language}</Badge>
              <span className="mono flex items-center gap-1 text-[12px] text-muted-foreground">
                <Star className="h-3.5 w-3.5" /> {repo.stars}
              </span>
            </div>
            <h1 className="mt-4 font-heading text-[30px] font-semibold leading-tight sm:text-[36px]" data-testid="insight-title">
              {insight.title}
            </h1>
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mono mt-2 inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
              data-testid="insight-github-link"
            >
              {repo.fullName} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <Panel title="AI overview" icon={Sparkles} testId="insight-overview-panel">
            <p className="text-[15px] leading-[1.75] text-muted-foreground">{insight.overview}</p>
          </Panel>

          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Tech stack" icon={Boxes} testId="insight-tech-stack-panel">
              <div className="flex flex-wrap gap-1.5">
                {insight.techStack.map((t) => (
                  <Badge key={t} variant="outline" className="text-[12px]" data-testid={`insight-tech-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                    {t}
                  </Badge>
                ))}
              </div>
            </Panel>
            <Panel title="Architecture" icon={Wrench} testId="insight-architecture-panel">
              <ul className="space-y-2">
                {insight.architecture.map((a) => (
                  <li key={a} className="mono flex items-center gap-2 text-[13px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {a}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Key features" icon={ListChecks} testId="insight-features-panel">
              <ul className="space-y-2.5">
                {insight.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" /> {f}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Engineering strengths" icon={Gauge} testId="insight-strengths-panel">
              <ul className="space-y-2.5">
                {insight.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Resume-ready descriptions" icon={ListChecks} testId="insight-resume-panel">
            <ul className="space-y-3">
              {insight.resumeBullets.map((b) => (
                <li key={b} className="rounded-xl border border-border bg-muted/40 p-4 text-[13.5px] leading-relaxed">
                  {b}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Sticky rail */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-primary/25 bg-primary/6 p-6">
            <h2 className="font-heading text-[16px] font-semibold">Ready for your portfolio</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              This analysis is enough to generate a full developer portfolio with resume-ready copy.
            </p>
            <Link to="/portfolio" className={buttonVariants() + " mt-5 w-full rounded-full"} data-testid="generate-my-portfolio-btn">
              <Sparkles className="mr-2 h-4 w-4" /> Generate My Portfolio
            </Link>
            <Link to="/job-match" className={buttonVariants({ variant: "ghost", size: "sm" }) + " mt-2 w-full"} data-testid="insight-job-match-btn">
              Check job match <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6" data-testid="insight-scores-panel">
            <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">AI scoring</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Architecture", insight.scores.architecture],
                ["Code quality", insight.scores.codeQuality],
                ["Product impact", insight.scores.impact],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="mono font-semibold">{value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6" data-testid="insight-roles-panel">
            <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">Recommended roles</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {insight.roles.map((r) => (
                <Badge key={r} variant="secondary" className="text-[12px]">{r}</Badge>
              ))}
            </div>
          </div>

          {others.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6" data-testid="insight-other-projects">
              <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">Other analysed projects</h2>
              <ul className="mt-4 space-y-2">
                {others.map((oid) => (
                  <li key={oid}>
                    <Link
                      to={`/insights/${oid}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors duration-200 hover:bg-accent"
                      data-testid={`insight-link-${oid}`}
                    >
                      {getRepo(oid)?.name}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}
