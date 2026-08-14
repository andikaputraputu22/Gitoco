import { Link } from "react-router-dom";
import {
  ArrowRight,
  FolderGit2,
  Sparkles,
  Star,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getInsight } from "@/lib/mock";
import { analyzedRepos, useApp } from "@/lib/store";

export default function MyProjects() {
  const { state } = useApp();
  const repos = analyzedRepos(state.analyzedIds);

  return (
    <AppLayout
      title="My Projects"
      subtitle="Every repository Gitoco has analysed, with its AI-generated insight report."
      action={
        <Link to="/repositories" className={buttonVariants() + " rounded-full"} data-testid="projects-add-repos-btn">
          <Github className="mr-2 h-4 w-4" /> {state.connected ? "Import more repositories" : "Connect GitHub"}
        </Link>
      }
    >
      {repos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-20 text-center" data-testid="projects-empty-state">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <FolderGit2 className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-[18px] font-semibold">Nothing analysed yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Select repositories and run the AI analysis to build your project library.
          </p>
          <Link to="/repositories" className={buttonVariants() + " mt-6 rounded-full"} data-testid="projects-empty-cta">
            Select your best projects
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4" data-testid="projects-list">
            {repos.map((repo) => {
              const insight = getInsight(repo.id)!;
              return (
                <Link
                  key={repo.id}
                  to={`/insights/${repo.id}`}
                  className="card-hover block rounded-2xl border border-border bg-card p-6"
                  data-testid={`project-row-${repo.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-[18px] font-semibold">{insight.title}</h3>
                        <Badge variant="secondary" className="mono text-[11px]">{insight.complexity}</Badge>
                      </div>
                      <p className="mono mt-1 text-[11px] text-muted-foreground">{repo.fullName}</p>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{repo.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {insight.techStack.map((t) => (
                          <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex w-full max-w-[190px] flex-col gap-3">
                      {[
                        ["Architecture", insight.scores.architecture],
                        ["Code quality", insight.scores.codeQuality],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <div className="flex items-baseline justify-between text-[12px]">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="mono font-semibold">{value}</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                      <span className="mono mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <Star className="h-3.5 w-3.5" /> {repo.stars} · {repo.language}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                        View insights <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/6 p-6">
            <p className="max-w-lg text-[14px] leading-relaxed">
              {state.portfolioGenerated
                ? "Your portfolio is generated from these projects — open it to switch templates."
                : "These projects are ready. Generate your portfolio to turn them into a public developer profile."}
            </p>
            <Link to="/portfolio" className={buttonVariants() + " rounded-full"} data-testid="projects-generate-portfolio-btn">
              <Sparkles className="mr-2 h-4 w-4" />
              {state.portfolioGenerated ? "Open portfolio" : "Generate My Portfolio"}
            </Link>
          </div>
        </>
      )}
    </AppLayout>
  );
}
