import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDF_STEPS, generatePortfolioPdf } from "@/lib/pdf";
import type { PortfolioDocument, PdfResult } from "@/lib/pdf";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEP_MS = 620;

export function ExportPdfDialog({
  open,
  onOpenChange,
  buildDocument,
  templateLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Called at export time so the PDF always uses the currently previewed content. */
  buildDocument: () => PortfolioDocument;
  templateLabel: string;
}) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<PdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<PdfResult | null>(null);

  const revoke = useCallback(() => {
    if (resultRef.current) {
      URL.revokeObjectURL(resultRef.current.url);
      resultRef.current = null;
    }
  }, []);

  // Reset + drive the step sequence whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setError(null);
    setResult(null);
    let cancelled = false;

    const timers: number[] = [];
    timers.push(window.setTimeout(() => !cancelled && setStep(1), STEP_MS));
    timers.push(window.setTimeout(() => !cancelled && setStep(2), STEP_MS * 2));
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        try {
          revoke();
          const res = generatePortfolioPdf(buildDocument());
          resultRef.current = res;
          setResult(res);
          setStep(4);
        } catch (e) {
          setError(e instanceof Error ? e.message : "PDF generation failed");
          setStep(2);
        }
      }, STEP_MS * 3),
    );

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [open, buildDocument, revoke]);

  useEffect(() => revoke, [revoke]);

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("PDF downloaded", { description: result.filename });
  }

  /**
   * Opens the PDF in a new tab. An anchor click survives popup blockers better
   * than window.open; if the tab is still blocked we fall back to downloading
   * so the button is never a dead end.
   */
  function preview() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (typeof window !== "undefined" && window.open === undefined) download();
  }

  const done = step >= 4 && !!result;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="export-pdf-dialog">
        <DialogHeader>
          <span className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <FileText className="h-5 w-5" />
          </span>
          <DialogTitle className="font-heading text-[20px]" data-testid="export-pdf-title">
            {done ? "Your portfolio PDF is ready." : "Exporting your portfolio"}
          </DialogTitle>
          <DialogDescription>
            {done
              ? `A4 · ${result.pages} page${result.pages === 1 ? "" : "s"} · ${templateLabel} template · print-ready.`
              : `Building a print-ready A4 document from your ${templateLabel} portfolio.`}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3.5 rounded-xl border border-border bg-muted/40 p-5" data-testid="export-pdf-steps">
          {PDF_STEPS.map((label, i) => {
            const complete = step > i || (done && i === PDF_STEPS.length - 1);
            const active = step === i && !done;
            return (
              <li
                key={label}
                data-testid={`export-step-${i}`}
                data-state={complete ? "done" : active ? "active" : "pending"}
                className={cn(
                  "flex items-center gap-3 text-[13.5px] transition-colors duration-300",
                  complete || active ? "text-foreground" : "text-muted-foreground/50",
                )}
              >
                <span
                  className={cn(
                    "grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    complete
                      ? "border-[var(--success)] bg-[var(--success)]/12 text-[var(--success)]"
                      : active
                        ? "border-primary text-primary"
                        : "border-border",
                  )}
                >
                  {complete ? (
                    <Check className="h-3 w-3" />
                  ) : active ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : null}
                </span>
                <span>{label}</span>
              </li>
            );
          })}
        </ul>

        {error && (
          <p className="text-[13px] text-destructive" data-testid="export-pdf-error">
            {error}
          </p>
        )}

        {done && (
          <div className="flex flex-wrap items-center gap-3" data-testid="export-pdf-success">
            <Button className="rounded-full" onClick={download} data-testid="download-pdf-btn">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={preview}
              data-testid="preview-pdf-btn"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Preview PDF
            </Button>
            <Badge variant="outline" className="mono ml-auto text-[10px]" data-testid="export-pdf-filename">
              {result.filename}
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
