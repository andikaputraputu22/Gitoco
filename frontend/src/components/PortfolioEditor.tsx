import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowLeft, ChevronDown, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_EDITS } from "@/lib/portfolio";
import type { PortfolioData, PortfolioEdits } from "@/lib/portfolio";

/**
 * Edit Portfolio.
 *
 * One implementation of the form (`PortfolioEditorForm`) rendered in two shells:
 *  - desktop: an inline left column beside the live preview (split-screen)
 *  - tablet / mobile: a fullscreen workspace (`PortfolioEditorFullscreen`)
 *
 * The form works on a local draft of `PortfolioEdits` and pushes every change up
 * as a live draft, so the preview updates without saving. Save commits the draft
 * to app state (the single source of truth for preview, public portfolio, PDF),
 * Cancel discards it.
 */

export interface EditorProps {
  saved: PortfolioEdits;
  /** un-edited generated document, used for placeholders and project rows */
  generated: PortfolioData;
  onDraftChange: (draft: PortfolioEdits | null) => void;
  onSave: (draft: PortfolioEdits) => void;
  onClose: () => void;
  /** re-seeds the draft whenever edit mode is (re)entered */
  sessionKey: number;
}

/** true when the viewport is wide enough for the split-screen editor. */
export function useIsDesktopEditor(): boolean {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return match;
}

/** Tablet / mobile: dedicated fullscreen editing screen (no overlay, no drawer). */
export function PortfolioEditorFullscreen({
  open,
  ...props
}: EditorProps & { open: boolean }): React.ReactElement | null {
  // Lock the page behind the fullscreen editor so only the form scrolls.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background" data-testid="portfolio-editor-panel">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close editor"
          onClick={() => {
            props.onDraftChange(null);
            props.onClose();
          }}
          data-testid="editor-close-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h2 className="font-heading text-[16px] font-semibold">Edit Portfolio</h2>
          <p className="hidden text-[12.5px] text-muted-foreground sm:block">
            Changes appear instantly in your portfolio once saved.
          </p>
        </div>
      </header>
      <PortfolioEditorForm {...props} />
    </div>
  );
}

export function PortfolioEditorForm({
  saved,
  generated,
  onDraftChange,
  onSave,
  onClose,
  sessionKey,
}: EditorProps): React.ReactElement {
  const [draft, setDraft] = useState<PortfolioEdits>(saved);
  const [newSkill, setNewSkill] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  // Re-seed the draft each time edit mode is entered.
  useEffect(() => {
    setDraft(saved);
    setConfirmReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  function apply(next: PortfolioEdits) {
    setDraft(next);
    onDraftChange(next);
  }

  const skills = draft.skills ?? generated.skills;
  const order = draft.order.length > 0 ? draft.order : generated.projects.map((p) => p.id);
  const projects = order
    .map((id) => generated.projects.find((p) => p.id === id))
    .filter((p): p is PortfolioData["projects"][number] => !!p);

  function setProject(
    id: string,
    patch: Partial<{ title: string; blurb: string; tech: string[]; hidden: boolean }>,
  ) {
    apply({
      ...draft,
      projects: { ...draft.projects, [id]: { ...draft.projects[id], ...patch } },
    });
  }

  function move(id: string, dir: -1 | 1) {
    const ids = [...order];
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    apply({ ...draft, order: ids });
  }

  function cancel() {
    onDraftChange(null);
    onClose();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="portfolio-editor-form">
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
        {/* Profile */}
        <section className="space-y-3" data-testid="editor-profile-section">
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
          {(
            [
              ["name", "Developer name", generated.name],
              ["title", "Professional title", generated.title],
              ["location", "Location", generated.location],
              ["email", "Contact email", generated.email],
              ["handle", "GitHub username", generated.handle],
            ] as const
          ).map(([field, label, placeholder]) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={`editor-${field}`} className="text-[13px]">
                {label}
              </Label>
              <Input
                id={`editor-${field}`}
                value={draft[field] ?? ""}
                placeholder={placeholder}
                onChange={(e) => apply({ ...draft, [field]: e.target.value })}
                data-testid={`editor-input-${field}`}
              />
            </div>
          ))}
        </section>

        {/* Summary */}
        <section className="space-y-3" data-testid="editor-summary-section">
          <div className="flex items-center justify-between gap-3">
            <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Professional summary
            </p>
            <ToggleRow
              id="show-summary"
              label="Show"
              checked={draft.sections.summary}
              onChange={(v) => apply({ ...draft, sections: { ...draft.sections, summary: v } })}
            />
          </div>
          <Textarea
            rows={6}
            value={draft.summary ?? generated.summary}
            onChange={(e) => apply({ ...draft, summary: e.target.value })}
            data-testid="editor-input-summary"
          />
        </section>

        {/* Skills */}
        <section className="space-y-3" data-testid="editor-skills-section">
          <div className="flex items-center justify-between gap-3">
            <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Core skills</p>
            <ToggleRow
              id="show-skills"
              label="Show"
              checked={draft.sections.skills}
              onChange={(v) => apply({ ...draft, sections: { ...draft.sections, skills: v } })}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[12.5px]"
                data-testid={`editor-skill-${slug(s)}`}
              >
                {s}
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  className="cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-destructive"
                  onClick={() => apply({ ...draft, skills: skills.filter((x) => x !== s) })}
                  data-testid={`editor-skill-remove-${slug(s)}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              placeholder="Add a skill"
              onChange={(e) => setNewSkill(e.target.value)}
              data-testid="editor-skill-input"
            />
            <Button
              variant="outline"
              onClick={() => {
                const v = newSkill.trim();
                if (!v || skills.includes(v)) return;
                apply({ ...draft, skills: [...skills, v] });
                setNewSkill("");
              }}
              data-testid="editor-skill-add-btn"
            >
              Add
            </Button>
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-3" data-testid="editor-projects-section">
          <div className="flex items-center justify-between gap-3">
            <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Featured projects
            </p>
            <ToggleRow
              id="show-work"
              label="Show"
              checked={draft.sections.work}
              onChange={(v) => apply({ ...draft, sections: { ...draft.sections, work: v } })}
            />
          </div>

          <ToggleRow
            id="show-evidence"
            label="Show Engineering Evidence"
            checked={draft.sections.evidence}
            onChange={(v) => apply({ ...draft, sections: { ...draft.sections, evidence: v } })}
          />

          {projects.map((p, i) => {
            const edit = draft.projects[p.id] ?? {};
            return (
              <details
                key={p.id}
                className="group rounded-xl border border-border bg-card px-4 py-3"
                data-testid={`editor-project-${p.id}`}
              >
                <summary className="flex cursor-pointer list-none items-center gap-2 text-[14px] font-medium [&::-webkit-details-marker]:hidden">
                  <span className="mono text-[11px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{edit.title ?? p.title}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => move(p.id, -1)}
                      data-testid={`editor-project-up-${p.id}`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move down"
                      disabled={i === projects.length - 1}
                      onClick={() => move(p.id, 1)}
                      data-testid={`editor-project-down-${p.id}`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Input
                    value={edit.title ?? p.title}
                    onChange={(e) => setProject(p.id, { title: e.target.value })}
                    data-testid={`editor-project-title-${p.id}`}
                  />
                  <Textarea
                    rows={3}
                    value={edit.blurb ?? p.blurb}
                    onChange={(e) => setProject(p.id, { blurb: e.target.value })}
                    data-testid={`editor-project-blurb-${p.id}`}
                  />
                  <Input
                    value={(edit.tech ?? p.tech).join(", ")}
                    onChange={(e) =>
                      setProject(p.id, {
                        tech: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Tech stack, comma separated"
                    data-testid={`editor-project-tech-${p.id}`}
                  />
                  <ToggleRow
                    id={`show-project-${p.id}`}
                    label="Show in portfolio"
                    checked={edit.hidden !== true}
                    onChange={(v) => setProject(p.id, { hidden: !v })}
                    testId={`editor-project-visible-${p.id}`}
                  />
                </div>
              </details>
            );
          })}
        </section>
      </div>

      {/* Sticky actions */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="rounded-full"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            data-testid="editor-save-btn"
          >
            Save Changes
          </Button>
          <Button variant="outline" className="rounded-full" onClick={cancel} data-testid="editor-cancel-btn">
            Cancel
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 px-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (!confirmReset) {
              setConfirmReset(true);
              return;
            }
            apply(DEFAULT_EDITS);
            setConfirmReset(false);
          }}
          data-testid="editor-reset-btn"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          {confirmReset ? "Confirm reset" : "Reset to Generated Content"}
        </Button>
      </div>
    </div>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
  testId,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  testId?: string;
}): React.ReactElement {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-[13px]">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        data-testid={testId ?? `editor-toggle-${id}`}
      />
      <span>{label}</span>
    </label>
  );
}
