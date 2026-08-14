import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
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

const SCOPES = [
  "Read your public repository metadata",
  "Read languages and topics per repository",
  "No write access, ever",
];

export function ConnectGitHubModal({
  open,
  onOpenChange,
  /** Where to go after connecting. Pass null to stay on the current page. */
  redirectTo = "/repositories",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  redirectTo?: string | null;
}) {
  const { update } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  function connect() {
    setBusy(true);
    window.setTimeout(() => {
      update({ connected: true });
      setBusy(false);
      onOpenChange(false);
      toast.success("GitHub connected", { description: "6 repositories imported (simulated)." });
      if (redirectTo) navigate(redirectTo);
    }, 1400);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="connect-github-modal">
        <DialogHeader>
          <span className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-[var(--ink)] text-white">
            <Github className="h-5 w-5" />
          </span>
          <DialogTitle className="font-heading text-[20px]">Connect your GitHub account</DialogTitle>
          <DialogDescription>
            Gitoco reads your public repositories to analyse your work. This prototype simulates the
            OAuth handshake — no real GitHub account is contacted.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-4">
          {SCOPES.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-[13px]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Demo mode — repository data is mocked locally.
        </p>

        <Button onClick={connect} disabled={busy} className="w-full rounded-full" data-testid="confirm-connect-github-btn">
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authorising Gitoco…
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" /> Authorise with GitHub
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
