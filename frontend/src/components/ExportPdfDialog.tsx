import { Download, ExternalLink, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StepList } from "@/components/StepList";
import { PDF_STEPS } from "@/lib/pdf";
import { downloadPdf, openPdfInNewTab, usePdfExport } from "@/lib/usePdfExport";
import type { PortfolioData } from "@/lib/portfolio";
import { toast } from "sonner";

export function ExportPdfDialog({
  open,
  onOpenChange,
  buildDocument,
  templateLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Called at export time so the PDF always uses the currently previewed content. */
  buildDocument: () => PortfolioData;
  templateLabel: string;
}): React.ReactElement {
  const { step, result, error, done } = usePdfExport(open, buildDocument);

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
            {done && result
              ? `A4 · ${result.pages} page${result.pages === 1 ? "" : "s"} · ${templateLabel} template · print-ready.`
              : `Building a print-ready A4 document from your ${templateLabel} portfolio.`}
          </DialogDescription>
        </DialogHeader>

        <StepList
          steps={PDF_STEPS}
          current={step}
          allDone={done}
          testId="export-pdf-steps"
          idPrefix="export-step"
        />

        {error && (
          <p className="text-[13px] text-destructive" data-testid="export-pdf-error">
            {error}
          </p>
        )}

        {done && result && (
          <div className="flex flex-wrap items-center gap-3" data-testid="export-pdf-success">
            <Button
              className="rounded-full"
              onClick={() => {
                downloadPdf(result);
                toast.success("PDF downloaded", { description: result.filename });
              }}
              data-testid="download-pdf-btn"
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => openPdfInNewTab(result)}
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
