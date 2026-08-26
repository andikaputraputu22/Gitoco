import { useState } from "react";
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
      <ul className="mt-3 space-y-2">
        {evidence.map((item) => (
          <li key={item.title} className="text-[12.5px] leading-snug">
            <span style={{ color: tokens.ink }}>{item.title}</span>
            <span style={{ color: tokens.body }}> — {item.status}</span>
            <span className="mono block text-[11.5px]" style={{ color: tokens.faint }}>
              {item.summary.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setActive(evidence[0])}
        className="mono mt-3 text-[11.5px] underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
        style={{ color: tokens.accent }}
        data-testid={`${testId}-detail-btn`}
      >
        View Detailed Evidence
      </button>

      <EvidenceDetailDialog item={active} onOpenChange={(o) => !o && setActive(null)} />
    </div>
  );
}
