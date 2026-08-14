import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FileDown, Globe, Loader2, Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { ExportPdfDialog } from "@/components/ExportPdfDialog";
import { PublishDialog } from "@/components/PublishDialog";
import { PortfolioDocumentView } from "@/components/PortfolioDocumentView";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { TEMPLATES, TEMPLATE_LIST, buildPortfolio } from "@/lib/portfolio";
import { analyzedRepos, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PortfolioPreview() {
  const { state, update } = useApp();
  const repos = analyzedRepos(state.analyzedIds);
  const [generating, setGenerating] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

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
            Analyse at least one repository and Gitoco will write your portfolio for you.
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
          <Button className="rounded-full" onClick={() => setPublishOpen(true)} data-testid="publish-portfolio-btn">
            <Globe className="mr-2 h-4 w-4" /> {state.published ? "Republish" : "Publish Portfolio"}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => setExportOpen(true)} data-testid="export-pdf-btn">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Link to="/job-match" className={buttonVariants({ variant: "ghost" }) + " rounded-full"} data-testid="portfolio-to-job-match-btn">
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
      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        publicUrl={data.portfolioUrl}
        publicPath={`/portfolio/${data.handle}`}
      />

      {state.published && (
        <div
          className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/8 px-6 py-4"
          data-testid="published-banner"
        >
          <Globe className="h-4 w-4 shrink-0 text-[var(--success)]" />
          <p className="text-[13.5px]">
            Live at <span className="mono">{data.portfolioUrl}</span>
          </p>
          <Link
            to={`/portfolio/${data.handle}`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " ml-auto rounded-full"}
            data-testid="published-banner-open-btn"
          >
            View public page
          </Link>
        </div>
      )}

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
          <PortfolioDocumentView data={data} />
        </div>
      </div>

      <p className="mt-6 text-[12px] text-muted-foreground/70">
        Exporting to PDF prints this exact template. Publishing and custom domains are out of scope for this prototype.
      </p>
    </AppLayout>
  );
}
