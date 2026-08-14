import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  FolderGit2,
  Layers,
  Sparkles,
  Star,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { ConnectGitHubModal } from "@/components/ConnectGitHubModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEVELOPER, REPOS, getInsight } from "@/lib/mock";
import { analyzedRepos, useApp } from "@/lib/store";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  testId,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Star;
  testId: string;
}) {
  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-6" data-testid={testId}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-4 font-heading text-[30px] font-semibold leading-none">{value}</p>
      <p className="mt-2 text-[12px] text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function Dashboard(): React.ReactElement {
  const { state, stats } = useApp();
  const [modal, setModal] = useState(false);
  const featured = analyzedRepos(state.analyzedIds);

  return (
    <AppLayout
      title={state.connected ? `${greeting()}, ${DEVELOPER.fullName}` : greeting()}
      subtitle="Let's turn your projects into your professional story."
      action={
        state.connected ? (
          <Link to="/repositories" className={buttonVariants() + " rounded-full"} data-testid="import-more-repos-btn">
            <Github className="mr-2 h-4 w-4" /> Import more repositories
          </Link>
        ) : (
          <Button className="rounded-full" onClick={() => setModal(true)} data-testid="connect-github-btn">
            <Github className="mr-2 h-4 w-4" /> Connect GitHub
          </Button>
        )
      }
    >
      <ConnectGitHubModal open={modal} onOpenChange={setModal} />

      {!state.connected && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-primary/25 bg-primary/6 p-7" data-testid="connect-banner">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-heading text-[19px] font-semibold">Start by connecting GitHub</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                Your workspace is empty. Connect your account, pick your best repositories and let Gitoco
                write your portfolio from your actual code.
              </p>
            </div>
            <Button className="rounded-full" onClick={() => setModal(true)} data-testid="connect-banner-btn">
              Connect GitHub <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects analyzed"
          value={String(stats.analyzed)}
          hint={stats.analyzed ? "AI insights ready" : "No analysis yet"}
          icon={FolderGit2}
          testId="stat-projects-analyzed"
        />
        <StatCard
          label="Portfolio completion"
          value={`${stats.completion}%`}
          hint={state.portfolioGenerated ? "Portfolio generated" : "Generate to reach 100%"}
          icon={Sparkles}
          testId="stat-portfolio-completion"
        />
        <StatCard
          label="Technologies detected"
          value={String(stats.technologies)}
          hint={stats.technologies ? stats.techList.slice(0, 3).join(" · ") : "Analyse a project to detect"}
          icon={Layers}
          testId="stat-technologies-detected"
        />
        <StatCard
          label="Job match score"
          value={stats.jobScore !== null ? `${stats.jobScore}%` : "—"}
          hint={stats.jobScore !== null ? "Latest job description" : "Run a Job Match analysis"}
          icon={Briefcase}
          testId="stat-job-match-score"
        />
      </section>

      <section className="mt-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-[20px] font-semibold">Featured projects</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              The analysed work that leads your portfolio.
            </p>
          </div>
          {featured.length > 0 && (
            <Link to="/projects" className={buttonVariants({ variant: "ghost", size: "sm" })} data-testid="view-all-projects-btn">
              View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {featured.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-16 text-center"
            data-testid="featured-empty-state"
          >
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
              <FolderGit2 className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-heading text-[17px] font-semibold">No analysed projects yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
              {state.connected
                ? "Your repositories are imported. Select your best projects and run the AI analysis."
                : "Connect GitHub to import your repositories, then analyse the projects you're proudest of."}
            </p>
            {state.connected ? (
              <Link to="/repositories" className={buttonVariants() + " mt-6 rounded-full"} data-testid="empty-select-repos-btn">
                Select your best projects
              </Link>
            ) : (
              <Button className="mt-6 rounded-full" onClick={() => setModal(true)} data-testid="empty-connect-github-btn">
                Connect GitHub
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {featured.map((repo) => {
              const insight = getInsight(repo.id);
              return (
                <Link
                  key={repo.id}
                  to={`/insights/${repo.id}`}
                  className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
                  data-testid={`featured-project-${repo.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-[17px] font-semibold">{repo.name}</h3>
                    <Badge variant="secondary" className="mono text-[11px]">{insight?.complexity}</Badge>
                  </div>
                  <p className="mono mt-1 text-[11px] text-muted-foreground">{repo.fullName}</p>
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">{repo.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {repo.tech.slice(0, 4).map((t) => (
                      <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {repo.stars}</span>
                    <span className="mono">{repo.language}</span>
                    <span className="ml-auto flex items-center gap-1 text-primary">
                      View insights <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-3">
        {[
          { to: "/repositories", title: "Select repositories", body: "Choose which projects tell your story best.", cta: "Open selector", testId: "quick-action-repositories" },
          { to: "/portfolio", title: "Portfolio preview", body: "Three templates, generated from your analysed work.", cta: "Preview portfolio", testId: "quick-action-portfolio" },
          { to: "/job-match", title: "Job Match", body: "Score your profile against any job description.", cta: "Analyse a role", testId: "quick-action-job-match" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="card-hover rounded-2xl border border-border bg-card p-6"
            data-testid={c.testId}
          >
            <h3 className="font-heading text-[16px] font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary">
              {c.cta} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>

      <p className="mt-12 text-[12px] text-muted-foreground/70">
        {state.connected
          ? `Demo workspace for ${DEVELOPER.fullName} · ${REPOS.length} simulated repositories available.`
          : `Demo workspace · ${REPOS.length} simulated repositories available once GitHub is connected.`}
      </p>
    </AppLayout>
  );
}
