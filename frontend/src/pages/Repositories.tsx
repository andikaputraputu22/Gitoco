import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { ConnectGitHubModal } from "@/components/ConnectGitHubModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { REPOS } from "@/lib/mock";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Repositories() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState<string[]>(() =>
    state.analyzedIds.length ? state.analyzedIds : REPOS.filter((r) => r.recommended).map((r) => r.id),
  );

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  if (!state.connected) {
    return (
      <AppLayout title="Select your best projects" subtitle="Connect GitHub to import your repositories first.">
        <ConnectGitHubModal open={modal} onOpenChange={setModal} />
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-20 text-center" data-testid="repositories-empty-state">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--ink)] text-white">
            <Github className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-[18px] font-semibold">No repositories imported</h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Gitoco needs read access to your public repositories before it can analyse anything.
          </p>
          <Button className="mt-6 rounded-full" onClick={() => setModal(true)} data-testid="repositories-connect-btn">
            Connect GitHub
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Select your best projects"
      subtitle="Pick the repositories you want recruiters and clients to read about. We recommend three to five."
      action={
        <div className="flex items-center gap-3">
          <span className="mono text-[13px] text-muted-foreground" data-testid="selected-count">
            {selected.length} selected
          </span>
          <Button
            className="rounded-full"
            disabled={selected.length === 0}
            onClick={() => navigate("/analyzing", { state: { ids: selected } })}
            data-testid="analyze-projects-btn"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Analyze Selected Projects
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2" data-testid="repository-list">
        {REPOS.map((repo) => {
          const checked = selected.includes(repo.id);
          return (
            <button
              key={repo.id}
              type="button"
              onClick={() => toggle(repo.id)}
              data-testid={`repo-card-${repo.id}`}
              aria-pressed={checked}
              className={cn(
                "group relative w-full rounded-2xl border bg-card p-6 text-left transition-[border-color,box-shadow,transform] duration-200",
                checked
                  ? "border-primary shadow-[0_10px_36px_-20px_var(--primary)]"
                  : "border-border hover:border-primary/50 hover:-translate-y-0.5",
              )}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(repo.id)}
                  className="mt-1"
                  data-testid={`repo-checkbox-${repo.id}`}
                  aria-label={`Select ${repo.name}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-[17px] font-semibold">{repo.name}</h3>
                    {repo.recommended && (
                      <Badge className="rounded-full bg-primary/12 text-[11px] text-primary" variant="ghost">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="mono mt-0.5 text-[11px] text-muted-foreground">{repo.fullName}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{repo.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {repo.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
                    ))}
                  </div>
                  <div className="mono mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {repo.language}
                    </span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {repo.stars}</span>
                    <span>{repo.forks} forks</span>
                    <span className="ml-auto">Updated {repo.updated}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
          Analysis runs on repository metadata only. This prototype uses simulated AI output.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className={buttonVariants({ variant: "outline" }) + " rounded-full"} data-testid="back-to-dashboard-btn">
            Back to overview
          </Link>
          <Button
            className="rounded-full"
            disabled={selected.length === 0}
            onClick={() => navigate("/analyzing", { state: { ids: selected } })}
            data-testid="analyze-projects-btn-bottom"
          >
            Analyze Selected Projects <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
