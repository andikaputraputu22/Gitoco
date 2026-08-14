import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileDown, Loader2, Mail, MapPin, Sparkles } from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { ExportPdfDialog } from "@/components/ExportPdfDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { TEMPLATES, TEMPLATE_LIST, buildPortfolio, heroLine, projectHeading } from "@/lib/portfolio";
import type { PortfolioData, PortfolioProject, TemplateConfig } from "@/lib/portfolio";
import { analyzedRepos, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Small caption used for every section heading; styling comes from the template tokens. */
function SectionLabel({ t, children }: { t: TemplateConfig; children: string }) {
  return (
    <h2
      className="mono text-[11px] uppercase"
      style={{
        color: t.tokens.faint,
        letterSpacing: t.tokens.serif ? "0.24em" : "0.18em",
      }}
    >
      {children}
    </h2>
  );
}

function HighlightList({ t, project }: { t: TemplateConfig; project: PortfolioProject }) {
  if (!project.highlights.length) return null;
  return (
    <div className="mt-4">
      <p
        className="mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: t.tokens.accent }}
      >
        {t.labels.highlights}
      </p>
      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
        {project.highlights.map((h) => (
          <li key={h} className="text-[13px] leading-relaxed" style={{ color: t.tokens.faint }}>
            • {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MinimalTemplate({ data }: { data: PortfolioData }) {
  const t = TEMPLATES.minimal;
  const k = t.tokens;
  return (
    <div
      className="px-8 py-16 sm:px-16"
      style={{ backgroundColor: k.page, color: k.ink }}
      data-testid="portfolio-template-minimal"
    >
      <div className="mx-auto max-w-2xl">
        <p className="mono text-[11px] uppercase tracking-[0.24em]" style={{ color: k.faint }}>
          {data.location}
        </p>
        <h1 className="mt-5 font-heading text-[40px] font-semibold leading-[1.05] tracking-tight">
          {data.name}
        </h1>
        <p className="mt-3 text-[17px]" style={{ color: k.muted }}>
          {data.title}
        </p>
        <p
          className="mt-8 border-t pt-8 text-[16px] leading-[1.8]"
          style={{ borderColor: k.rule, color: k.body }}
        >
          {data.summary}
        </p>

        <div className="mt-14">
          <SectionLabel t={t}>{t.labels.skills!}</SectionLabel>
          <p className="mt-4 text-[15px] leading-[1.9]" style={{ color: k.body }}>
            {data.skills.join(" · ")}
          </p>
        </div>

        <div className="mt-14">
          <SectionLabel t={t}>{t.labels.work}</SectionLabel>
          <div className="mt-6">
            {data.projects.map((p, i) => (
              <article
                key={p.id}
                className="py-7"
                style={i > 0 ? { borderTop: `1px solid ${k.rule}` } : undefined}
                data-testid={`portfolio-project-${p.id}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-heading text-[20px] font-semibold">{projectHeading(t, p)}</h3>
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-[12px] underline"
                    style={{ color: k.muted, textDecorationColor: "#CCCCCC" }}
                  >
                    {t.labels.githubLink}
                  </a>
                </div>
                <p className="mt-2.5 text-[15px] leading-[1.75]" style={{ color: k.body }}>
                  {p.blurb}
                </p>
                <HighlightList t={t} project={p} />
                <p className="mono mt-3 text-[12px]" style={{ color: k.faint }}>
                  {p.tech.join(", ")}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SectionLabel t={t}>{t.labels.contact}</SectionLabel>
          <p className="mt-4 text-[15px]" style={{ color: k.body }}>
            {data.email} —{" "}
            <a
              href={data.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
              style={{ textDecorationColor: "#CCCCCC" }}
            >
              {data.githubLabel}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: PortfolioData }) {
  const t = TEMPLATES.professional;
  const k = t.tokens;
  return (
    <div style={{ backgroundColor: k.page, color: k.ink }} data-testid="portfolio-template-professional">
      <div
        className="px-8 py-12 sm:px-14"
        style={{ backgroundColor: k.surface!, borderBottom: `1px solid ${k.rule}` }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-8">
          <img src={data.avatar} alt={data.name} className="h-20 w-20 rounded-2xl object-cover" />
          <div className="min-w-0">
            <h1 className="font-heading text-[30px] font-semibold leading-tight">{data.name}</h1>
            <p className="mt-1 text-[16px]" style={{ color: k.accent }}>
              {data.title}
            </p>
            <p className="mono mt-2 flex flex-wrap items-center gap-3 text-[12px]" style={{ color: k.faint }}>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {data.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {data.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Github className="h-3.5 w-3.5" /> {data.handle}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-8 py-12 sm:px-14">
        <section className="rounded-2xl p-7" style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}>
          <SectionLabel t={t}>{t.labels.summary!}</SectionLabel>
          <p className="mt-3 text-[15.5px] leading-[1.8]" style={{ color: k.body }}>
            {data.summary}
          </p>
        </section>

        <section className="rounded-2xl p-7" style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}>
          <SectionLabel t={t}>{t.labels.skills!}</SectionLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span
                key={s}
                className="rounded-full px-3 py-1 text-[12.5px]"
                style={{ backgroundColor: k.pillBg!, color: k.pillInk!, border: "1px solid #DCE6F5" }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel t={t}>{t.labels.work}</SectionLabel>
          <div className="mt-4 grid gap-4">
            {data.projects.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl p-7"
                style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}
                data-testid={`portfolio-project-${p.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-heading text-[19px] font-semibold">{projectHeading(t, p)}</h3>
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mono inline-flex items-center gap-1 text-[12px] hover:underline"
                    style={{ color: k.accent }}
                  >
                    {t.labels.githubLink} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.75]" style={{ color: k.body }}>
                  {p.blurb}
                </p>
                <div className="mt-4">
                  <p className="mono text-[10px] uppercase tracking-[0.16em]" style={{ color: k.accent }}>
                    {t.labels.features}
                  </p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="text-[13.5px]" style={{ color: k.faint }}>
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <HighlightList t={t} project={p} />
                <div className="mt-5 flex flex-wrap gap-1.5 pt-4" style={{ borderTop: `1px solid ${k.rule}` }}>
                  {p.tech.map((tech) => (
                    <span
                      key={tech}
                      className="mono rounded-md px-2 py-0.5 text-[11.5px]"
                      style={{ backgroundColor: "#F1F5F9", color: k.body }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl p-7" style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}>
          <SectionLabel t={t}>{t.labels.contact}</SectionLabel>
          <p className="mt-3 text-[15px]" style={{ color: k.body }}>
            {data.contactLine} — {data.email}
          </p>
          <a
            href={data.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mono mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] text-white"
            style={{ backgroundColor: k.accent }}
          >
            <Github className="h-3.5 w-3.5" /> {data.githubLabel}
          </a>
        </section>
      </div>
    </div>
  );
}

function ModernTemplate({ data }: { data: PortfolioData }) {
  const t = TEMPLATES.modern;
  const k = t.tokens;
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: k.page, color: k.ink }}
      data-testid="portfolio-template-modern"
    >
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#2563EB]/25 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-8 py-16 sm:px-14">
        <p className="mono text-[11px] uppercase tracking-[0.24em]" style={{ color: k.accent }}>
          Available for hire
        </p>
        <h1 className="mt-5 font-heading text-[44px] font-semibold leading-[1.02] sm:text-[60px]">
          {data.name}
        </h1>
        <p className="mt-4 max-w-xl text-[18px] leading-relaxed" style={{ color: k.body }}>
          {heroLine(data)}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span
              key={s}
              className="mono rounded-full px-3 py-1 text-[12px]"
              style={{ backgroundColor: k.pillBg!, color: k.pillInk!, border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-20">
          <SectionLabel t={t}>{t.labels.work}</SectionLabel>
          <div className="mt-6 grid gap-4">
            {data.projects.map((p, i) => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-2xl p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1"
                style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}
                data-testid={`portfolio-project-${p.id}`}
              >
                <span className="mono text-[11px]" style={{ color: k.faint }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-heading text-[24px] font-semibold">{projectHeading(t, p)}</h3>
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mono inline-flex items-center gap-1 text-[12px]"
                    style={{ color: k.accent }}
                  >
                    {t.labels.githubLink} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.75]" style={{ color: k.body }}>
                  {p.blurb}
                </p>
                <HighlightList t={t} project={p} />
                <p className="mono mt-4 text-[12px]" style={{ color: k.faint }}>
                  {p.tech.join(" / ")}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div
          className="mt-20 rounded-2xl p-8"
          style={{ backgroundColor: k.surface!, border: `1px solid ${k.rule}` }}
        >
          <h2 className="font-heading text-[26px] font-semibold">{t.labels.contact}</h2>
          <p className="mt-2 text-[15px]" style={{ color: k.body }}>
            {data.email}
          </p>
          <a
            href={data.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mono mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium"
            style={{ color: k.page }}
          >
            <Github className="h-4 w-4" /> {data.githubLabel}
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

  // The document the preview renders. The PDF export is handed this exact object,
  // so both surfaces always agree on content, order and template.
  const data = buildPortfolio(repos, state.template);
  const buildDocument = useCallback(
    () => buildPortfolio(repos, state.template),
    [repos, state.template],
  );

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
        templateLabel={TEMPLATES[state.template].label}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-full border border-border bg-card p-1.5" data-testid="template-selector">
        {TEMPLATE_LIST.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => update({ template: tpl.id })}
            data-testid={`template-${tpl.id}-btn`}
            aria-pressed={state.template === tpl.id}
            className={cn(
              "rounded-full px-5 py-2 text-[13px] font-medium transition-[background-color,color] duration-200",
              state.template === tpl.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {tpl.label}
          </button>
        ))}
        <span className="mono ml-auto hidden px-3 text-[12px] text-muted-foreground sm:block" data-testid="template-note">
          {TEMPLATES[state.template].note}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="mono ml-3 truncate text-[11px] text-muted-foreground">{data.portfolioUrl}</span>
          <Badge variant="outline" className="mono ml-auto text-[10px]">LIVE PREVIEW</Badge>
        </div>
        <div className="max-h-[720px] overflow-y-auto">
          {state.template === "minimal" && <MinimalTemplate data={data} />}
          {state.template === "professional" && <ProfessionalTemplate data={data} />}
          {state.template === "modern" && <ModernTemplate data={data} />}
        </div>
      </div>

      <p className="mt-6 text-[12px] text-muted-foreground/70">
        Exporting to PDF prints this exact template. Publishing and custom domains are out of scope for this prototype.
      </p>
    </AppLayout>
  );
}
