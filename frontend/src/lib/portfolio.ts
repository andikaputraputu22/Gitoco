import { DEVELOPER, getInsight } from "@/lib/mock";
import type { EvidenceItem, Repo } from "@/lib/mock";
import type { TemplateId } from "@/lib/store";

/**
 * Single source of truth for the portfolio document.
 *
 * Both surfaces read from here:
 *  - the live preview (`pages/PortfolioPreview.tsx`)
 *  - the PDF export (`lib/pdf.ts`)
 *
 * Content, section order, labels and the per-template design tokens are declared
 * once, so the exported PDF is a print rendering of the same template the user is
 * looking at. Never hardcode portfolio copy, colours or section labels in either
 * surface — add them here.
 */

export interface PortfolioProject {
  id: string;
  name: string;
  title: string;
  blurb: string;
  tech: string[];
  features: string[];
  highlights: string[];
  githubUrl: string;
  /** shared Engineering Evidence, reused from the AI insight */
  evidence: EvidenceItem[];
  /** hidden projects are filtered out of the document before render/export */
  hidden?: boolean;
}

export interface PortfolioData {
  template: TemplateId;
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  handle: string;
  githubUrl: string;
  githubLabel: string;
  portfolioUrl: string;
  avatar: string;
  contactLine: string;
  skills: string[];
  projects: PortfolioProject[];
}

/** Section order is shared by both surfaces — index order is render order. */
export const SECTION_ORDER = ["summary", "skills", "work", "contact"] as const;

export interface TemplateLabels {
  /** null = the section renders without a caption in this template. */
  summary: string | null;
  skills: string | null;
  work: string;
  contact: string;
  features: string;
  highlights: string;
  githubLink: string;
}

export interface TemplateTokens {
  /** page background of the portfolio document itself (not the app chrome) */
  page: string;
  /** raised surface: cards in Professional, project panels in Modern */
  surface: string | null;
  ink: string;
  body: string;
  muted: string;
  faint: string;
  rule: string;
  accent: string;
  pillBg: string | null;
  pillInk: string | null;
  /** serif = editorial (Minimal); sans = Professional/Modern */
  serif: boolean;
  header: "editorial" | "band" | "hero";
  skillStyle: "inline" | "pills";
  numbered: boolean;
  /** Professional is the only template that lists key features */
  showFeatures: boolean;
  /** which project heading the template shows — short repo name or full insight title */
  projectHeading: "name" | "title";
  dark: boolean;
}

export interface TemplateConfig {
  id: TemplateId;
  label: string;
  note: string;
  labels: TemplateLabels;
  tokens: TemplateTokens;
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  minimal: {
    id: "minimal",
    label: "Minimal",
    note: "Editorial, type-led, quiet",
    labels: {
      summary: null,
      skills: "Skills",
      work: "Selected work",
      contact: "Contact",
      features: "Key features",
      highlights: "Engineering highlights",
      githubLink: "GitHub",
    },
    tokens: {
      page: "#FFFFFF",
      surface: null,
      ink: "#111111",
      body: "#333333",
      muted: "#555555",
      faint: "#888888",
      rule: "#EEEEEE",
      accent: "#111111",
      pillBg: null,
      pillInk: null,
      serif: true,
      header: "editorial",
      skillStyle: "inline",
      numbered: false,
      showFeatures: false,
      projectHeading: "name",
      dark: false,
    },
  },
  professional: {
    id: "professional",
    label: "Professional",
    note: "Structured and recruiter-friendly",
    labels: {
      summary: "Professional summary",
      skills: "Core skills",
      work: "Featured projects",
      contact: "Contact",
      features: "Key features",
      highlights: "Engineering highlights",
      githubLink: "View source",
    },
    tokens: {
      page: "#F7F9FC",
      surface: "#FFFFFF",
      ink: "#0F172A",
      body: "#33415C",
      muted: "#33415C",
      faint: "#55637A",
      rule: "#E1E8F0",
      accent: "#2563EB",
      pillBg: "#F1F6FE",
      pillInk: "#1D4ED8",
      serif: false,
      header: "band",
      skillStyle: "pills",
      numbered: false,
      showFeatures: true,
      projectHeading: "title",
      dark: false,
    },
  },
  modern: {
    id: "modern",
    label: "Modern",
    note: "High contrast, dark, kinetic",
    labels: {
      summary: null,
      skills: null,
      work: "Work",
      contact: "Let's build something.",
      features: "Key features",
      highlights: "Engineering highlights",
      githubLink: "GitHub",
    },
    tokens: {
      page: "#030712",
      surface: "#0B1220",
      ink: "#F1F5F9",
      body: "#94A3B8",
      muted: "#94A3B8",
      faint: "#64748B",
      rule: "#1E293B",
      accent: "#38BDF8",
      pillBg: "#0F1B2E",
      pillInk: "#CBD5E1",
      serif: false,
      header: "hero",
      skillStyle: "pills",
      numbered: true,
      showFeatures: false,
      projectHeading: "name",
      dark: true,
    },
  },
};

export const TEMPLATE_LIST: TemplateConfig[] = [
  TEMPLATES.minimal,
  TEMPLATES.professional,
  TEMPLATES.modern,
];

/** Heading text for a project card, per the selected template. */
export function projectHeading(cfg: TemplateConfig, p: PortfolioProject): string {
  return cfg.tokens.projectHeading === "title" ? p.title : p.name;
}

/** Modern's hero merges title + summary into one line; both surfaces use this. */
export function heroLine(data: PortfolioData): string {
  return data.summary ? `${data.title} — ${data.summary}` : data.title;
}


/* ------------------------------------------------------------------ *
 * Manual edits (Edit Portfolio)
 *
 * The AI/mock generated document is the base; `PortfolioEdits` is a thin
 * override layer stored in the app state (localStorage). `buildPortfolio`
 * applies it, so the live preview, the public portfolio and the PDF export
 * all read the same edited document.
 * ------------------------------------------------------------------ */

export interface ProjectEdit {
  title?: string;
  blurb?: string;
  tech?: string[];
  hidden?: boolean;
}

export interface PortfolioSectionFlags {
  summary: boolean;
  skills: boolean;
  work: boolean;
  evidence: boolean;
}

export interface PortfolioEdits {
  name?: string;
  title?: string;
  location?: string;
  email?: string;
  handle?: string;
  summary?: string;
  /** null/undefined = use the generated skill list */
  skills?: string[];
  projects: Record<string, ProjectEdit>;
  /** project ids in display order; unknown ids are ignored, missing ids append */
  order: string[];
  sections: PortfolioSectionFlags;
}

export const DEFAULT_EDITS: PortfolioEdits = {
  projects: {},
  order: [],
  sections: { summary: true, skills: true, work: true, evidence: true },
};

export function buildPortfolio(
  repos: Repo[],
  template: TemplateId,
  edits: PortfolioEdits = DEFAULT_EDITS,
): PortfolioData {
  const skills: string[] = [];
  const seen = new Set<string>();

  const projects: PortfolioProject[] = repos.map((repo) => {
    const insight = getInsight(repo.id);
    const tech = insight?.techStack ?? repo.tech;
    tech.forEach((t) => {
      if (!seen.has(t)) {
        seen.add(t);
        skills.push(t);
      }
    });
    const edit = edits.projects[repo.id] ?? {};
    return {
      id: repo.id,
      name: edit.title ?? repo.name,
      title: edit.title ?? insight?.title ?? repo.name,
      blurb: edit.blurb ?? insight?.resumeBullets[0] ?? repo.description,
      tech: edit.tech ?? tech,
      features: (insight?.features ?? []).slice(0, 4),
      highlights: [...(insight?.strengths ?? []).slice(0, 3), ...(insight?.architecture ?? [])],
      githubUrl: repo.githubUrl,
      evidence: edits.sections.evidence ? (insight?.evidence ?? []) : [],
      hidden: edit.hidden === true,
    };
  });

  const ordered = orderProjects(projects, edits.order).filter((p) => !p.hidden);
  const handle = edits.handle?.trim() || DEVELOPER.handle;

  return {
    template,
    name: edits.name?.trim() || DEVELOPER.fullName,
    title: edits.title?.trim() || DEVELOPER.title,
    summary: edits.sections.summary ? (edits.summary ?? DEVELOPER.summary) : "",
    location: edits.location?.trim() || DEVELOPER.location,
    email: edits.email?.trim() || DEVELOPER.email,
    handle,
    githubUrl: `https://github.com/${handle}`,
    githubLabel: `github.com/${handle}`,
    portfolioUrl: `gitoco.com/portfolio/${handle}`,
    avatar: DEVELOPER.avatar,
    contactLine: "Available for engineering roles and freelance work",
    skills: edits.sections.skills ? (edits.skills ?? skills) : [],
    projects: edits.sections.work ? ordered : [],
  };
}

/** Generated (un-edited) document — the editor reads this as its starting point. */
export function generatedPortfolio(repos: Repo[], template: TemplateId): PortfolioData {
  return buildPortfolio(repos, template, DEFAULT_EDITS);
}

function orderProjects(projects: PortfolioProject[], order: string[]): PortfolioProject[] {
  if (order.length === 0) return projects;
  const ranked = [...projects];
  ranked.sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
  });
  return ranked;
}
