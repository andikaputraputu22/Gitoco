import { useState } from "react";
import {
  RotateCcw,
  Save,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEVELOPER } from "@/lib/mock";
import type { TemplateId } from "@/lib/store";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const TEMPLATE_LABELS: Record<string, string> = {
  minimal: "Minimal",
  professional: "Professional",
  modern: "Modern",
};

export default function Settings() {
  const { state, update, reset } = useApp();
  const [headline, setHeadline] = useState(state.headline);
  const [email, setEmail] = useState(DEVELOPER.email);

  return (
    <AppLayout title="Settings" subtitle="Profile, portfolio defaults and demo workspace controls.">
      <div className="grid max-w-3xl gap-6">
        <section className="rounded-2xl border border-border bg-card p-7" data-testid="settings-profile-section">
          <h2 className="font-heading text-[16px] font-semibold">Developer profile</h2>
          <div className="mt-6 flex items-center gap-4">
            <img src={DEVELOPER.avatar} alt="" className="h-14 w-14 rounded-xl object-cover" />
            <div>
              <p className="text-[14px] font-medium">{DEVELOPER.fullName}</p>
              <p className="mono text-[12px] text-muted-foreground">@{DEVELOPER.handle}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="headline">Professional title</Label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} data-testid="settings-headline-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="settings-email-input" />
            </div>
          </div>
          <Button
            className="mt-6 rounded-full"
            onClick={() => {
              update({ headline });
              toast.success("Profile saved");
            }}
            data-testid="settings-save-btn"
          >
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-7" data-testid="settings-portfolio-section">
          <h2 className="font-heading text-[16px] font-semibold">Portfolio defaults</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default template</Label>
              <Select value={state.template} onValueChange={(v: string) => update({ template: v as TemplateId })}>
                <SelectTrigger data-testid="settings-template-select">
                  <SelectValue>{(v) => TEMPLATE_LABELS[v as string] ?? "Professional"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Appearance</Label>
              <div className="flex h-9 items-center gap-3 rounded-lg border border-border px-3">
                <span className="text-[13px] text-muted-foreground">Light / dark theme</span>
                <ThemeToggle testId="theme-toggle-settings" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-7" data-testid="settings-integrations-section">
          <h2 className="font-heading text-[16px] font-semibold">Integrations</h2>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--ink)] text-white">
                <Github className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[14px] font-medium">GitHub</p>
                <p className="text-[12px] text-muted-foreground">
                  {state.connected ? `Connected as @${DEVELOPER.handle} (simulated)` : "Not connected"}
                </p>
              </div>
            </div>
            <Badge variant={state.connected ? "secondary" : "outline"} className="mono text-[11px]" data-testid="settings-github-status">
              {state.connected ? "CONNECTED" : "DISCONNECTED"}
            </Badge>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
            OpenAI and real GitHub OAuth are intentionally out of scope for this prototype. The analysis layer is
            isolated so both can be plugged in without UI changes.
          </p>
        </section>

        <section className="rounded-2xl border border-destructive/30 bg-destructive/6 p-7" data-testid="settings-danger-section">
          <h2 className="font-heading text-[16px] font-semibold">Reset demo workspace</h2>
          <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
            Clears the GitHub connection, analysed projects, generated portfolio and job match so you can walk the
            full flow again from the start.
          </p>
          <Button
            variant="outline"
            className="mt-5 rounded-full"
            onClick={() => {
              reset();
              toast.success("Demo workspace reset");
            }}
            data-testid="settings-reset-btn"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset demo data
          </Button>
        </section>
      </div>
    </AppLayout>
  );
}
