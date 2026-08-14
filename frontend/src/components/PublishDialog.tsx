import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, ExternalLink, Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const STEPS = ["Preparing portfolio", "Creating public page", "Publishing portfolio"];
const STEP_MS = 700;

export function PublishDialog({
  open,
  onOpenChange,
  publicUrl,
  publicPath,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Display URL, e.g. gitoco.com/andikaputraputu (simulated for the prototype) */
  publicUrl: string;
  /** In-app route that serves the public page, e.g. /portfolio/andikaputraputu */
  publicPath: string;
}) {
  const { update } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    let cancelled = false;
    const timers = STEPS.map((_, i) =>
      window.setTimeout(() => !cancelled && setStep(i + 1), STEP_MS * (i + 1)),
    );
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        update({ published: true });
      }, STEP_MS * STEPS.length),
    );
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [open, update]);

  const done = step >= STEPS.length;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${publicUrl}`);
      toast.success("Link copied", { description: publicUrl });
    } catch {
      toast.error("Couldn't copy automatically", { description: publicUrl });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="publish-dialog">
        <DialogHeader>
          <span className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-[var(--success)]/12 text-[var(--success)]">
            <Globe className="h-5 w-5" />
          </span>
          <DialogTitle className="font-heading text-[20px]" data-testid="publish-dialog-title">
            {done ? "Your portfolio is live!" : "Publishing your portfolio"}
          </DialogTitle>
          <DialogDescription>
            {done
              ? "Anyone with the link can view your portfolio — no sign-in required."
              : "Creating a public page from your selected template."}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3.5 rounded-xl border border-border bg-muted/40 p-5" data-testid="publish-steps">
          {STEPS.map((label, i) => {
            const complete = step > i;
            const active = step === i;
            return (
              <li
                key={label}
                data-testid={`publish-step-${i}`}
                data-state={complete ? "done" : active ? "active" : "pending"}
                className={`flex items-center gap-3 text-[13.5px] transition-colors duration-300 ${
                  complete || active ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                <span
                  className={`grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                    complete
                      ? "border-[var(--success)] bg-[var(--success)]/12 text-[var(--success)]"
                      : active
                        ? "border-primary text-primary"
                        : "border-border"
                  }`}
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

        {done && (
          <div className="space-y-4" data-testid="publish-success">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <Globe className="h-4 w-4 shrink-0 text-[var(--success)]" />
              <span className="mono truncate text-[13px]" data-testid="public-url-value">
                {publicUrl}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate(publicPath);
                }}
                data-testid="open-portfolio-btn"
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Open Portfolio
              </Button>
              <Button variant="outline" className="rounded-full" onClick={copyLink} data-testid="copy-link-btn">
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>
            </div>
            <p className="text-[12px] text-muted-foreground/70">
              The public address is simulated for this prototype — the page is served inside the app at{" "}
              <span className="mono">{publicPath}</span>.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
