import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  FileDown,
  Loader2,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { ExportPdfDialog } from "@/components/ExportPdfDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DEVELOPER, getInsight } from "@/lib/mock";
import type { Repo } from "@/lib/mock";
import type { PortfolioDocument } from "@/lib/pdf";
import type { TemplateId } from "@/lib/store";
import { analyzedRepos, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TEMPLATES: { id: TemplateId; label: string; note: string }[] = [
  { id: "minimal", label: "Minimal", note: "Editorial, type-led, quiet" },
  { id: "professional", label: "Professional", note: "Structured and recruiter-friendly" },
  { id: "modern", label: "Modern", note: "High contrast, dark, kinetic" },
];

function skillsOf(repos: Repo[]) {
  const set = new Set<string>();
  repos.forEach((r) => getInsight(r.id)?.techStack.forEach((t) => set.add(t)));
  return Array.from(set);
}

function ProjectBlurb({ repo }: { repo: Repo }) {
  const insight = getInsight(repo.id)!;
  return <>{insight.resumeBullets[0] ?? repo.description}</>;
}

function MinimalTemplate({ repos }: { repos: Repo[] }) {
  return (
    <div className="bg-white px-8 py-16 text-[#111] sm:px-16" data-testid="portfolio-template-minimal">
      <div className="mx-auto max-w-2xl">
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#888]">{DEVELOPER.location}</p>
        <h1 className="mt-5 font-heading text-[40px] font-semibold leading-[1.05] tracking-tight">{DEVELOPER.fullName}</h1>
        <p className="mt-3 text-[17px] text-[#555]">{DEVELOPER.title}</p>
        <p className="mt-8 border-t border-[#eee] pt-8 text-[16px] leading-[1.8] text-[#333]">{DEVELOPER.summary}</p>

        <h2 className="mono mt-14 text-[11px] uppercase tracking-[0.24em] text-[#888]">Skills</h2>
        <p className="mt-4 text-[15px] leading-[1.9] text-[#333]">{skillsOf(repos).join(" · ")}</p>

        <h2 className="mono mt-14 text-[11px] uppercase tracking-[0.24em] text-[#888]">Selected work</h2>
        <div className="mt-6 divide-y divide-[#eee]">
          {repos.map((repo) => (
            <article key={repo.id} className="py-7" data-testid={`portfolio-project-${repo.id}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-[20px] font-semibold">{repo.name}</h3>
                <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="mono text-[12px] text-[#666] underline decoration-[#ccc]">
                  GitHub
                </a>
              </div>
              <p className="mt-2.5 text-[15px] leading-[1.75] text-[#444]">
                <ProjectBlurb repo={repo} />
              </p>
              <p className="mono mt-3 text-[12px] text-[#888]">{getInsight(repo.id)!.techStack.join(", ")}</p>
            </article>
          ))}
        </div>

        <h2 className="mono mt-14 text-[11px] uppercase tracking-[0.24em] text-[#888]">Contact</h2>
        <p className="mt-4 text-[15px] text-[#333]">
          {DEVELOPER.email} — <a href={DEVELOPER.github} target="_blank" rel="noreferrer" className="underline decoration-[#ccc]">github.com/{DEVELOPER.handle}</a>
        </p>
      </div>
    </div>
  );
}

function ProfessionalTemplate({ repos }: { repos: Repo[] }) {
  return (
    <div className="bg-[#F7F9FC] text-[#0F172A]" data-testid="portfolio-template-professional">
      <div className="border-b border-[#E1E8F0] bg-white px-8 py-12 sm:px-14">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-8">
          <img src={DEVELOPER.avatar} alt={DEVELOPER.fullName} className="h-20 w-20 rounded-2xl object-cover" />
          <div className="min-w-0">
            <h1 className="font-heading text-[30px] font-semibold leading-tight">{DEVELOPER.fullName}</h1>
            <p className="mt-1 text-[16px] text-[#2563EB]">{DEVELOPER.title}</p>
            <p className="mono mt-2 flex flex-wrap items-center gap-3 text-[12px] text-[#55637A]">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {DEVELOPER.location}</span>
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {DEVELOPER.email}</span>
              <span className="inline-flex items-center gap-1"><Github className="h-3.5 w-3.5" /> {DEVELOPER.handle}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-8 py-12 sm:px-14">
        <section className="rounded-2xl border border-[#E1E8F0] bg-white p-7">
          <h2 className="mono text-[11px] uppercase tracking-[0.18em] text-[#55637A]">Professional summary</h2>
          <p className="mt-3 text-[15.5px] leading-[1.8] text-[#33415C]">{DEVELOPER.summary}</p>
        </section>

        <section className="rounded-2xl border border-[#E1E8F0] bg-white p-7">
          <h2 className="mono text-[11px] uppercase tracking-[0.18em] text-[#55637A]">Core skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skillsOf(repos).map((s) => (
              <span key={s} className="rounded-full border border-[#DCE6F5] bg-[#F1F6FE] px-3 py-1 text-[12.5px] text-[#1D4ED8]">{s}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mono text-[11px] uppercase tracking-[0.18em] text-[#55637A]">Featured projects</h2>
          <div className="mt-4 grid gap-4">
            {repos.map((repo) => {
              const insight = getInsight(repo.id)!;
              return (
                <article key={repo.id} className="rounded-2xl border border-[#E1E8F0] bg-white p-7" data-testid={`portfolio-project-${repo.id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-heading text-[19px] font-semibold">{insight.title}</h3>
                    <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="mono inline-flex items-center gap-1 text-[12px] text-[#2563EB] hover:underline">
                      View source <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="mt-3 text-[14.5px] leading-[1.75] text-[#33415C]">
                    <ProjectBlurb repo={repo} />
                  </p>
                  <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                    {insight.features.slice(0, 4).map((f) => (
                      <li key={f} className="text-[13.5px] text-[#55637A]">• {f}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#EDF1F7] pt-4">
                    {insight.techStack.map((t) => (
                      <span key={t} className="mono rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11.5px] text-[#33415C]">{t}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E1E8F0] bg-white p-7">
          <h2 className="mono text-[11px] uppercase tracking-[0.18em] text-[#55637A]">Contact</h2>
          <p className="mt-3 text-[15px] text-[#33415C]">
            Available for engineering roles and freelance work — {DEVELOPER.email}
          </p>
          <a href={DEVELOPER.github} target="_blank" rel="noreferrer" className="mono mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-[13px] text-white">
            <Github className="h-3.5 w-3.5" /> github.com/{DEVELOPER.handle}
          </a>
        </section>
      </div>
    </div>
  );
}

function ModernTemplate({ repos }: { repos: Repo[] }) {
  return (
    <div className="relative overflow-hidden bg-[#030712] text-slate-100" data-testid="portfolio-template-modern">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#2563EB]/25 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-8 py-16 sm:px-14">
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#38BDF8]">Available for hire</p>
        <h1 className="mt-5 font-heading text-[44px] font-semibold leading-[1.02] sm:text-[60px]">
          {DEVELOPER.fullName}
        </h1>
        <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-slate-400">
          {DEVELOPER.title} — {DEVELOPER.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {skillsOf(repos).map((s) => (
            <span key={s} className="mono rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[12px] text-slate-300">{s}</span>
          ))}
        </div>

        <h2 className="mono mt-20 text-[11px] uppercase tracking-[0.24em] text-slate-500">Work</h2>
        <div className="mt-6 grid gap-4">
          {repos.map((repo, i) => {
            const insight = getInsight(repo.id)!;
            return (
              <article
                key={repo.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#38BDF8]/50"
                data-testid={`portfolio-project-${repo.id}`}
              >
                <span className="mono text-[11px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-heading text-[24px] font-semibold">{repo.name}</h3>
                  <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="mono inline-flex items-center gap-1 text-[12px] text-[#38BDF8]">
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-slate-400">
                  <ProjectBlurb repo={repo} />
                </p>
                <p className="mono mt-4 text-[12px] text-slate-500">{insight.techStack.join(" / ")}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="font-heading text-[26px] font-semibold">Let's build something.</h2>
          <p className="mt-2 text-[15px] text-slate-400">{DEVELOPER.email}</p>
          <a href={DEVELOPER.github} target="_blank" rel="noreferrer" className="mono mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#030712]">
            <Github className="h-4 w-4" /> github.com/{DEVELOPER.handle}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPreview() {
  const { state, update } = useApp();
  const repos = analyzedRepos(state.analyzedIds);
  const [generating, setGenerating] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Built at export time from the same data the preview renders, so the PDF can
  // never drift from what the user sees. Swap the source here for real data later.
  const buildDocument = useCallback((): PortfolioDocument => {
    return {
      name: DEVELOPER.fullName,
      title: DEVELOPER.title,
      summary: DEVELOPER.summary,
      location: DEVELOPER.location,
      email: DEVELOPER.email,
      githubUrl: DEVELOPER.github,
      handle: DEVELOPER.handle,
      portfolioUrl: `gitfolio.dev/${DEVELOPER.handle}`,
      skills: skillsOf(repos),
      template: state.template,
      projects: repos.map((repo) => {
        const insight = getInsight(repo.id)!;
        return {
          name: repo.name,
          title: insight.title,
          description: insight.resumeBullets[0] ?? repo.description,
          tech: insight.techStack,
          highlights: [...insight.strengths.slice(0, 3), ...insight.architecture],
          githubUrl: repo.githubUrl,
        };
      }),
    };
  }, [repos, state.template]);

  function generate() {
    setGenerating(true);
    window.setTimeout(() => {
      update({ portfolioGenerated: true });
      setGenerating(false);
      toast.success("Portfolio generated", { description: "Switch templates any time." });
    }, 1500);
  }

  if (repos.length === 0) {
    return (
      <AppLayout title="Portfolio" subtitle="Your portfolio is generated from analysed projects.">
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-20 text-center" data-testid="portfolio-empty-state">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-[18px] font-semibold">Nothing to generate from yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Analyse at least one repository and GitFolio AI will write your portfolio for you.
          </p>
          <Link to="/repositories" className={buttonVariants() + " mt-6 rounded-full"} data-testid="portfolio-empty-cta">
            Select your best projects
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (!state.portfolioGenerated) {
    return (
      <AppLayout title="Portfolio" subtitle={`${repos.length} analysed project(s) are ready to become a portfolio.`}>
        <div className="rounded-2xl border border-primary/25 bg-primary/6 px-8 py-20 text-center" data-testid="portfolio-generate-state">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-[20px] font-semibold">Generate your portfolio</h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            We'll assemble your summary, skills and project write-ups from the AI insights, in three switchable
            templates.
          </p>
          <Button className="mt-6 rounded-full" onClick={generate} disabled={generating} data-testid="portfolio-generate-btn">
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Writing your portfolio…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate My Portfolio
              </>
            )}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Portfolio preview"
      subtitle="A live developer portfolio generated from your analysed repositories. Switch templates instantly."
      action={
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-full" onClick={() => setExportOpen(true)} data-testid="export-pdf-btn">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Link to="/job-match" className={buttonVariants({ variant: "outline" }) + " rounded-full"} data-testid="portfolio-to-job-match-btn">
            Optimise for a job
          </Link>
        </div>
      }
    >
      <ExportPdfDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        buildDocument={buildDocument}
        templateLabel={TEMPLATES.find((t) => t.id === state.template)?.label ?? "Professional"}
      />
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-full border border-border bg-card p-1.5" data-testid="template-selector">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => update({ template: t.id })}
            data-testid={`template-${t.id}-btn`}
            aria-pressed={state.template === t.id}
            className={cn(
              "rounded-full px-5 py-2 text-[13px] font-medium transition-[background-color,color] duration-200",
              state.template === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
        <span className="mono ml-auto hidden px-3 text-[12px] text-muted-foreground sm:block" data-testid="template-note">
          {TEMPLATES.find((t) => t.id === state.template)?.note}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="mono ml-3 truncate text-[11px] text-muted-foreground">
            gitfolio.dev/{DEVELOPER.handle}
          </span>
          <Badge variant="outline" className="mono ml-auto text-[10px]">LIVE PREVIEW</Badge>
        </div>
        <div className="max-h-[720px] overflow-y-auto">
          {state.template === "minimal" && <MinimalTemplate repos={repos} />}
          {state.template === "professional" && <ProfessionalTemplate repos={repos} />}
          {state.template === "modern" && <ModernTemplate repos={repos} />}
        </div>
      </div>

      <p className="mt-6 text-[12px] text-muted-foreground/70">
        Publishing and custom domains are out of scope for this prototype.
      </p>
    </AppLayout>
  );
}
