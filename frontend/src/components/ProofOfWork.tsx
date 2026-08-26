import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { EvidenceDetailDialog } from "@/components/EngineeringEvidence";
import type { EvidenceItem } from "@/lib/mock";
import type { TemplateTokens } from "@/lib/portfolio";

/**
 * Compact Proof of Work block for the portfolio document.
 *
 * - `variant="indicator"`: one non-intrusive line + action (dashboard preview)
 * - `variant="summary"`: short claim/status list + action (public portfolio)
 *
 * Colours come from the active template's tokens so it stays inside the
 * portfolio's own palette. Evidence data is the same `Insight.evidence`
 * used by the AI analysis page.
 */
export function ProofOfWork({
  evidence,
  tokens,
  variant,
  testId,
}: {
  evidence: EvidenceItem[];
  tokens: TemplateTokens;
  variant: "indicator" | "summary";
  testId: string;
}): React.ReactElement | null {
  const [active, setActive] = useState<EvidenceItem | null>(null);
  const [openSummary, setOpenSummary] = useState(false);
  if (evidence.length === 0) return null;

  const withEvidence = evidence.filter((e) => e.status !== "Not Detected");

  if (variant === "indicator") {
    return (
      <div className="mt-4" data-testid={testId}>
        <p className="mono text-[11.5px]" style={{ color: tokens.faint }}>
          {withEvidence.length} engineering skills with evidence
        </p>
        <button
          type="button"
          onClick={() => setOpenSummary((v) => !v)}
          className="mono mt-1.5 text-[11.5px] underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
          style={{ color: tokens.accent }}
          data-testid={`${testId}-toggle`}
        >
          {openSummary ? "Hide proof of work" : "View Proof of Work"}
        </button>

        {openSummary && (
          <ul className="mt-3 space-y-1.5" data-testid={`${testId}-list`}>
            {evidence.map((item) => (
              <li key={item.title} className="text-[12.5px]">
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="text-left transition-opacity duration-200 hover:opacity-70"
                  style={{ color: tokens.body }}
                >
                  <span style={{ color: tokens.ink }}>{item.title}</span> — {item.status}
                  <span className="mono block text-[11.5px]" style={{ color: tokens.faint }}>
                    {item.summary.join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <EvidenceDetailDialog item={active} onOpenChange={(o) => !o && setActive(null)} />
      </div>
    );
  }

  return (
    <div
      className="mt-5 rounded-xl p-4"
      style={{ border: `1px solid ${tokens.rule}` }}
      data-testid={testId}
    >
      <p className="mono text-[10px] uppercase tracking-[0.16em]" style={{ color: tokens.faint }}>
        Engineering Evidence
      </p>
      <ul className="mt-3 space-y-1">
        {evidence.map((item) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group -mx-2 flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] leading-snug transition-colors duration-200 hover:bg-black/[0.035]"
              data-testid={`${testId}-item-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <span className="min-w-0 flex-1">
                <span style={{ color: tokens.ink }}>{item.title}</span>
                <span style={{ color: tokens.body }}> — {item.status}</span>
                <span className="mono block text-[11.5px]" style={{ color: tokens.faint }}>
                  {item.summary.join(" · ")}
                </span>
              </span>
              <ChevronRight
                className="mt-0.5 size-3.5 shrink-0 opacity-40 transition-opacity duration-200 group-hover:opacity-80"
                style={{ color: tokens.accent }}
              />
            </button>
          </li>
        ))}
      </ul>

      <EvidenceDetailDialog item={active} onOpenChange={(o) => !o && setActive(null)} />
    </div>
  );
}
