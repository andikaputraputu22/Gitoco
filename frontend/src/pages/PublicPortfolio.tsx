import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import { PortfolioDocumentView } from "@/components/PortfolioDocumentView";
import { buttonVariants } from "@/components/ui/button";
import { TEMPLATES, buildPortfolio } from "@/lib/portfolio";
import { analyzedRepos, useApp } from "@/lib/store";

/**
 * Public, standalone portfolio page — no dashboard chrome, no editor controls.
 * Renders the same document component and state as the dashboard preview, so the
 * published page always matches what the user reviewed.
 */
export default function PublicPortfolio(): React.ReactElement {
  const { handle = "" } = useParams();
  const { state } = useApp();
  const repos = analyzedRepos(state.analyzedIds);
  const data = buildPortfolio(repos, state.template);
  const tokens = TEMPLATES[state.template].tokens;

  const available = repos.length > 0 && state.portfolioGenerated;

  if (!available || handle.toLowerCase() !== data.handle.toLowerCase()) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6" data-testid="public-portfolio-unavailable">
        <div className="max-w-md text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Globe className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-heading text-[22px] font-semibold">This portfolio isn't published</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {available
              ? `No published portfolio exists at /portfolio/${handle}.`
              : "Generate and publish a portfolio in the dashboard first — this demo serves the published page from your local session."}
          </p>
          <Link to="/dashboard" className={buttonVariants() + " mt-6 rounded-full"} data-testid="public-portfolio-dashboard-link">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.page }} data-testid="public-portfolio-page">
      <PortfolioDocumentView data={data} />

      <footer
        className="px-8 py-10 sm:px-14"
        style={{ backgroundColor: tokens.page, borderTop: `1px solid ${tokens.rule}` }}
        data-testid="public-portfolio-footer"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <p className="mono text-[12px]" style={{ color: tokens.faint }}>
            {data.portfolioUrl}
          </p>
          <p className="mono text-[12px]" style={{ color: tokens.faint }}>
            Built with Gitoco
          </p>
        </div>
      </footer>
    </div>
  );
}
