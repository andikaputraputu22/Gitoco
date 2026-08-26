import { useState } from "react";
import { FileCode2, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EvidenceItem, EvidenceStatus } from "@/lib/mock";
import { cn } from "@/lib/utils";

/**
 * Engineering Evidence UI, shared by the AI analysis page, the portfolio preview
 * and the public portfolio. Evidence content itself lives in `lib/mock.ts`
 * (`Insight.evidence`) so the three surfaces never diverge.
 *
 * Wording note: this prototype analyses simulated repository data, so statuses
 * describe evidence strength ("Strong Evidence") and never claim verification.
 */

const STATUS_STYLES: Record<EvidenceStatus, string> = {
  "Strong Evidence": "border-[var(--success)]/35 bg-[var(--success)]/10 text-[var(--success)]",
  "Evidence Found": "border-primary/35 bg-primary/10 text-primary",
  "Limited Evidence": "border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]",
  "Not Detected": "border-border bg-muted text-muted-foreground",
};

export function EvidenceStatusBadge({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}): React.ReactElement {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", STATUS_STYLES[status], className)}>
      {status}
    </Badge>
  );
}

export function EvidenceDetailDialog({
  item,
  onOpenChange,
}: {
  item: EvidenceItem | null;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="evidence-detail-dialog">
        {item && (
          <>
            <DialogHeader>
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <DialogTitle className="font-heading text-[19px]" data-testid="evidence-detail-title">
                  {item.title}
                </DialogTitle>
                <EvidenceStatusBadge status={item.status} />
              </div>
              <DialogDescription>{item.description}</DialogDescription>
            </DialogHeader>

            {item.patterns.length > 0 && (
              <div data-testid="evidence-detail-patterns">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Detected patterns
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.patterns.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[11.5px]">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div data-testid="evidence-detail-summary">
              <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Evidence summary
              </p>
              <p className="mono mt-2 text-[12.5px]">{item.summary.join(" · ")}</p>
            </div>

            {item.files.length > 0 && (
              <div data-testid="evidence-detail-files">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Repository evidence
                </p>
                <ul className="mt-2.5 space-y-2">
                  {item.files.map((f) => (
                    <li key={f.path} className="rounded-xl border border-border bg-muted/40 p-3">
                      <p className="mono flex items-center gap-2 text-[12.5px]">
                        <FileCode2 className="h-3.5 w-3.5 shrink-0 text-primary" /> {f.path}
                      </p>
                      <p className="mt-1 pl-5.5 text-[12.5px] text-muted-foreground">{f.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11.5px] text-muted-foreground/70">
              Repository evidence is simulated for this contest demo.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Full section for the project AI analysis page. */
export function EngineeringEvidenceSection({
  evidence,
}: {
  evidence: EvidenceItem[];
}): React.ReactElement | null {
  const [active, setActive] = useState<EvidenceItem | null>(null);
  if (evidence.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6" data-testid="engineering-evidence-section">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-[15px] font-semibold uppercase tracking-[0.08em]">
          Engineering Evidence
        </h2>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Evidence found in the repository that supports Gitoco's engineering insights.
      </p>

      <ul className="mt-5 space-y-3">
        {evidence.map((item) => (
          <li
            key={item.title}
            className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4"
            data-testid={`evidence-row-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <div className="min-w-0 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[14px] font-medium">{item.title}</h3>
                <EvidenceStatusBadge status={item.status} />
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
              <p className="mono mt-2 text-[11.5px] text-muted-foreground/80">{item.summary.join(" · ")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setActive(item)}
              data-testid={`view-evidence-btn-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              View Evidence
            </Button>
          </li>
        ))}
      </ul>

      <EvidenceDetailDialog item={active} onOpenChange={(o) => !o && setActive(null)} />
    </section>
  );
}
