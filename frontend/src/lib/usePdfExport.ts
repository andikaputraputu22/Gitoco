import { useCallback, useEffect, useRef, useState } from "react";
import { PDF_STEPS, generatePortfolioPdf } from "@/lib/pdf";
import type { PdfResult } from "@/lib/pdf";
import { loadRoundedImage } from "@/lib/image";
import { TEMPLATES } from "@/lib/portfolio";
import type { PortfolioData } from "@/lib/portfolio";

const STEP_MS = 620;
/** index shown once generation finished */
const DONE_STEP = PDF_STEPS.length;

export interface PdfExportState {
  step: number;
  result: PdfResult | null;
  error: string | null;
  done: boolean;
}

/**
 * Drives the PDF export: steps the progress list, pre-loads the avatar (jsPDF
 * cannot fetch), generates the document and owns blob-URL cleanup.
 *
 * Keeping this out of the dialog leaves the component purely presentational.
 */
export function usePdfExport(open: boolean, buildDocument: () => PortfolioData): PdfExportState {
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

  useEffect(() => revoke, [revoke]);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setError(null);
    setResult(null);

    let cancelled = false;
    const docData = buildDocument();
    // "Preparing portfolio": only the Professional template shows a photo.
    const avatarPromise =
      TEMPLATES[docData.template].tokens.header === "band"
        ? loadRoundedImage(docData.avatar)
        : Promise.resolve(null);

    const timers = [
      window.setTimeout(() => !cancelled && setStep(1), STEP_MS),
      window.setTimeout(() => !cancelled && setStep(2), STEP_MS * 2),
      window.setTimeout(() => {
        if (cancelled) return;
        void avatarPromise.then((avatar) => {
          if (cancelled) return;
          try {
            revoke();
            const res = generatePortfolioPdf(docData, { avatar });
            resultRef.current = res;
            setResult(res);
            setStep(DONE_STEP);
          } catch (e) {
            setError(e instanceof Error ? e.message : "PDF generation failed");
            setStep(2);
          }
        });
      }, STEP_MS * 3),
    ];

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [open, buildDocument, revoke]);

  return { step, result, error, done: step >= DONE_STEP && !!result };
}

/** Triggers a browser download of the generated PDF. */
export function downloadPdf(result: PdfResult): void {
  const a = document.createElement("a");
  a.href = result.url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Opens the PDF in a new tab. An anchor click survives popup blockers better
 * than window.open; if the tab is blocked we fall back to downloading so the
 * button is never a dead end.
 */
export function openPdfInNewTab(result: PdfResult): void {
  const a = document.createElement("a");
  a.href = result.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
