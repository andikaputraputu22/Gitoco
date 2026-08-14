// Mock GitHub + AI layer. Swap these functions for real GitHub/OpenAI calls later —
// the shape of the exported types is the contract the UI depends on.

export interface Repo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  tech: string[];
  githubUrl: string;
  recommended: boolean;
}

export interface Insight {
  repoId: string;
  title: string;
  overview: string;
  techStack: string[];
  architecture: string[];
  features: string[];
  strengths: string[];
  complexity: "Intermediate" | "Advanced" | "Expert";
  roles: string[];
  resumeBullets: string[];
  scores: { architecture: number; codeQuality: number; impact: number };
}

export const DEVELOPER = {
  name: "Andika",
  fullName: "I Putu Andika Putra",
  title: "Android & Full-Stack Engineer",
  handle: "andikaputraputu",
  location: "Jakarta, Indonesia",
  email: "andikaputraputu@gitoco.com",
  github: "https://github.com/andikaputraputu",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=320",
  summary:
    "Engineer focused on modern Android and product-grade web platforms. I build offline-first mobile apps with Clean Architecture and ship full-stack products with TypeScript and Postgres. Comfortable owning a feature from data layer to polished UI.",
};

export const REPOS: Repo[] = [
  {
    id: "oboeru",
    name: "Oboeru",
    fullName: "andikaputraputu/oboeru",
    description: "Japanese learning Android application with spaced repetition and offline-first vocabulary decks.",
    language: "Kotlin",
    stars: 428,
    forks: 37,
    updated: "2 days ago",
    tech: ["Kotlin", "Jetpack Compose", "Room", "Hilt", "Firebase"],
    githubUrl: "https://github.com/andikaputraputu/oboeru",
    recommended: true,
  },
  {
    id: "ananka",
    name: "Ananka",
    fullName: "andikaputraputu/ananka",
    description: "Wedding vendor discovery platform with search, curated collections and vendor dashboards.",
    language: "TypeScript",
    stars: 312,
    forks: 24,
    updated: "6 days ago",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/andikaputraputu/ananka",
    recommended: true,
  },
  {
    id: "newsstream",
    name: "NewsStream",
    fullName: "andikaputraputu/newsstream",
    description: "Modern news and video streaming application with background playback and offline reading.",
    language: "Kotlin",
    stars: 267,
    forks: 19,
    updated: "3 weeks ago",
    tech: ["Kotlin", "Media3", "Retrofit", "Room", "Hilt"],
    githubUrl: "https://github.com/andikaputraputu/newsstream",
    recommended: true,
  },
  {
    id: "kanjiflow",
    name: "KanjiFlow",
    fullName: "andikaputraputu/kanjiflow",
    description: "Stroke-order kanji trainer built as a Compose Multiplatform experiment.",
    language: "Kotlin",
    stars: 94,
    forks: 8,
    updated: "1 month ago",
    tech: ["Compose Multiplatform", "SQLDelight", "Ktor"],
    githubUrl: "https://github.com/andikaputraputu/kanjiflow",
    recommended: false,
  },
  {
    id: "warungapi",
    name: "warung-api",
    fullName: "andikaputraputu/warung-api",
    description: "REST API for a small-business POS system with role-based auth and daily sales reports.",
    language: "Python",
    stars: 61,
    forks: 11,
    updated: "2 months ago",
    tech: ["FastAPI", "PostgreSQL", "Docker", "JWT"],
    githubUrl: "https://github.com/andikaputraputu/warung-api",
    recommended: false,
  },
  {
    id: "dotfiles",
    name: "dotfiles",
    fullName: "andikaputraputu/dotfiles",
    description: "Personal terminal, Neovim and shell configuration for Android + web development.",
    language: "Shell",
    stars: 18,
    forks: 3,
    updated: "5 months ago",
    tech: ["Zsh", "Neovim", "Lua"],
    githubUrl: "https://github.com/andikaputraputu/dotfiles",
    recommended: false,
  },
];

const INSIGHTS: Insight[] = [
  {
    repoId: "oboeru",
    title: "Oboeru — Japanese Learning Application",
    overview:
      "Oboeru is a production-quality Android application that helps learners acquire Japanese vocabulary and grammar through spaced repetition. The codebase is organised into clearly separated data, domain and presentation layers, with a Room database acting as the offline source of truth and Firebase handling authentication and cross-device sync. UI is fully declarative in Jetpack Compose, driven by immutable state exposed from ViewModels, and long-running work is coordinated with Kotlin Coroutines and Flow.",
    techStack: ["Kotlin", "Jetpack Compose", "Room", "Hilt", "Firebase", "Coroutines"],
    architecture: ["Clean Architecture", "MVVM", "Repository Pattern"],
    features: [
      "Vocabulary learning with spaced repetition",
      "Grammar practice exercises",
      "Learning progress tracking",
      "Offline support with local persistence",
      "Firebase authentication and sync",
    ],
    strengths: [
      "Modern Android architecture",
      "Unidirectional state management",
      "Local data persistence",
      "Dependency injection",
      "Asynchronous programming",
    ],
    complexity: "Advanced",
    roles: ["Android Engineer", "Mobile Engineer", "Software Engineer"],
    resumeBullets: [
      "Built an offline-first Android learning app in Kotlin and Jetpack Compose serving spaced-repetition study sessions to 400+ users.",
      "Designed a Clean Architecture / MVVM codebase with Hilt dependency injection, cutting feature onboarding time for new modules.",
      "Implemented Room-backed local persistence with Firebase sync so study progress survives offline usage and device changes.",
    ],
    scores: { architecture: 92, codeQuality: 88, impact: 84 },
  },
  {
    repoId: "ananka",
    title: "Ananka — Wedding Vendor Discovery Platform",
    overview:
      "Ananka is a full-stack marketplace that connects couples with wedding vendors. It uses Next.js server components for fast, SEO-friendly discovery pages, a normalised PostgreSQL schema for vendors, packages and availability, and a typed data layer end to end. The design system is built with Tailwind CSS and shared primitives, keeping vendor dashboards and the public catalogue visually consistent.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Prisma"],
    architecture: ["Server Components", "Layered Services", "Typed Data Access"],
    features: [
      "Faceted vendor search and filtering",
      "Curated vendor collections",
      "Vendor dashboard with package management",
      "Availability and enquiry flow",
      "SEO-optimised discovery pages",
    ],
    strengths: [
      "End-to-end type safety",
      "Relational data modelling",
      "Server-side rendering performance",
      "Reusable design system",
      "Product-oriented UX thinking",
    ],
    complexity: "Advanced",
    roles: ["Full-Stack Engineer", "Frontend Engineer", "Product Engineer"],
    resumeBullets: [
      "Shipped a Next.js + TypeScript marketplace with faceted vendor search over a normalised PostgreSQL schema.",
      "Built vendor-facing dashboards on a shared Tailwind design system, keeping public and authenticated surfaces consistent.",
      "Used server components and query-level caching to keep discovery pages fast and SEO-indexable.",
    ],
    scores: { architecture: 86, codeQuality: 85, impact: 81 },
  },
  {
    repoId: "newsstream",
    title: "NewsStream — News & Video Streaming App",
    overview:
      "NewsStream is an Android client that combines article reading with adaptive video playback. Media3 drives streaming with background playback and media session support, Retrofit handles the news API layer with typed responses, and Room caches articles for offline reading. Hilt keeps the dependency graph explicit across feature modules.",
    techStack: ["Kotlin", "Media3", "Retrofit", "Room", "Hilt", "Coroutines"],
    architecture: ["MVVM", "Repository Pattern", "Modularised Features"],
    features: [
      "Adaptive video streaming with Media3",
      "Background playback and media session",
      "Offline article caching",
      "Personalised topic feed",
      "Paginated news API consumption",
    ],
    strengths: [
      "Media playback engineering",
      "REST API integration",
      "Caching and pagination strategy",
      "Feature modularisation",
      "Lifecycle-aware state handling",
    ],
    complexity: "Advanced",
    roles: ["Android Engineer", "Media Engineer", "Mobile Engineer"],
    resumeBullets: [
      "Implemented adaptive video streaming with Media3, including background playback and media session integration.",
      "Integrated a paginated REST news API with Retrofit and Room caching for full offline reading support.",
      "Modularised features behind Hilt-provided repositories to keep build times and ownership boundaries clean.",
    ],
    scores: { architecture: 84, codeQuality: 83, impact: 78 },
  },
  {
    repoId: "kanjiflow",
    title: "KanjiFlow — Compose Multiplatform Kanji Trainer",
    overview:
      "KanjiFlow explores Compose Multiplatform by sharing stroke-order rendering and study logic between Android and desktop targets. SQLDelight provides a typed multiplatform database and Ktor handles networking, making it a strong demonstration of shared-code architecture.",
    techStack: ["Kotlin", "Compose Multiplatform", "SQLDelight", "Ktor"],
    architecture: ["Shared KMP Module", "MVVM", "Repository Pattern"],
    features: [
      "Stroke-order animation rendering",
      "Shared study engine across targets",
      "Typed multiplatform database",
      "Desktop and Android builds",
    ],
    strengths: [
      "Kotlin Multiplatform structuring",
      "Custom canvas rendering",
      "Cross-platform abstraction design",
    ],
    complexity: "Intermediate",
    roles: ["Android Engineer", "Kotlin Multiplatform Engineer"],
    resumeBullets: [
      "Shared 80% of study-engine code across Android and desktop with Compose Multiplatform and SQLDelight.",
      "Built custom canvas stroke-order animations for kanji practice.",
    ],
    scores: { architecture: 78, codeQuality: 76, impact: 64 },
  },
  {
    repoId: "warungapi",
    title: "warung-api — Small Business POS Backend",
    overview:
      "warung-api is a FastAPI backend powering a point-of-sale system for small retailers. It exposes typed REST endpoints for products, transactions and reporting, secures them with JWT and role-based permissions, and ships as a Docker image with migration tooling.",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Docker", "JWT"],
    architecture: ["Layered Services", "Repository Pattern", "Dependency Injection"],
    features: [
      "Product and inventory endpoints",
      "Transaction recording",
      "Daily sales reporting",
      "Role-based access control",
      "Containerised deployment",
    ],
    strengths: [
      "REST API design",
      "Authentication and authorisation",
      "Relational reporting queries",
      "Containerisation",
    ],
    complexity: "Intermediate",
    roles: ["Backend Engineer", "Python Engineer"],
    resumeBullets: [
      "Designed a JWT-secured FastAPI backend with role-based permissions for a retail POS system.",
      "Wrote aggregate reporting queries producing daily sales summaries over PostgreSQL.",
    ],
    scores: { architecture: 75, codeQuality: 79, impact: 62 },
  },
  {
    repoId: "dotfiles",
    title: "dotfiles — Development Environment Configuration",
    overview:
      "A curated set of shell, Neovim and tooling configurations tuned for Android and web development. Useful as a signal of tooling fluency, though it carries little product weight for a portfolio.",
    techStack: ["Shell", "Zsh", "Lua", "Neovim"],
    architecture: ["Declarative Config", "Bootstrap Scripts"],
    features: ["One-command environment bootstrap", "Neovim LSP setup", "Shared shell aliases"],
    strengths: ["Tooling automation", "Developer experience focus"],
    complexity: "Intermediate",
    roles: ["Software Engineer"],
    resumeBullets: ["Automated a reproducible development environment bootstrap across machines."],
    scores: { architecture: 58, codeQuality: 70, impact: 40 },
  },
];

export const ANALYSIS_STEPS = [
  "Reading repository metadata",
  "Detecting technologies",
  "Understanding project architecture",
  "Identifying key features",
  "Evaluating engineering practices",
  "Writing portfolio content",
];

export function getRepo(id: string): Repo | undefined {
  return REPOS.find((r) => r.id === id);
}

export function getInsight(id: string): Insight | undefined {
  return INSIGHTS.find((i) => i.repoId === id);
}

export interface JobMatchResult {
  score: number;
  strong: string[];
  gaps: string[];
  recommendedProjects: string[];
  improvement: string;
  summary: string;
}

const SKILL_KEYWORDS = [
  "Kotlin", "Jetpack Compose", "MVVM", "REST API", "Coroutines", "Room", "Hilt",
  "Firebase", "Clean Architecture", "TypeScript", "Next.js", "React", "PostgreSQL",
  "Tailwind CSS", "FastAPI", "Python", "Media3", "Docker",
];

const GAP_KEYWORDS = [
  "Automated testing", "CI/CD", "Kubernetes", "GraphQL", "Accessibility", "Performance profiling",
];

/** Every technology + architecture pattern across the given repos. */
function ownedSkills(repoIds: string[]): Set<string> {
  const owned = new Set<string>();
  repoIds.forEach((id) => {
    const insight = getInsight(id);
    insight?.techStack.forEach((t) => owned.add(t.toLowerCase()));
    insight?.architecture.forEach((t) => owned.add(t.toLowerCase()));
  });
  return owned;
}

/** Requirements named in the job description that the developer demonstrably has. */
function strongMatches(text: string, mentioned: string[], owned: Set<string>): string[] {
  return mentioned.filter(
    (k) =>
      owned.has(k.toLowerCase()) ||
      (k === "REST API" && (owned.has("retrofit") || owned.has("ktor") || text.includes("rest"))),
  );
}

/** Requirements named in the description with no matching evidence. */
function detectGaps(text: string): string[] {
  return GAP_KEYWORDS.filter((g) =>
    g.split(/[/ ]/).some((part) => part.length > 2 && text.includes(part.toLowerCase())),
  );
}

function scoreOf(mentioned: string[], strong: string[], gapCount: number): number {
  const base = mentioned.length ? Math.round((strong.length / mentioned.length) * 100) : 74;
  return Math.max(48, Math.min(96, Math.round(base * 0.95) - gapCount * 4 - 4));
}

/** The two projects that best evidence this role, by keyword hits then impact. */
function rankProjects(text: string, repoIds: string[]): string[] {
  return repoIds
    .map((id) => ({ id, insight: getInsight(id) }))
    .filter((x) => x.insight)
    .map((x) => ({
      id: x.id,
      hits: x.insight!.techStack.filter((t) => text.includes(t.toLowerCase())).length,
      impact: x.insight!.scores.impact,
    }))
    .sort((a, b) => b.hits - a.hits || b.impact - a.impact)
    .slice(0, 2)
    .map((x) => getRepo(x.id)?.name ?? x.id);
}

/** Simulated AI job-match analysis. Replace with an LLM call later; the return shape stays. */
export function analyzeJobMatch(description: string, analyzedRepoIds: string[]): JobMatchResult {
  const text = description.toLowerCase();
  const pool = analyzedRepoIds.length ? analyzedRepoIds : REPOS.map((r) => r.id);

  const mentioned = SKILL_KEYWORDS.filter((k) => text.includes(k.toLowerCase()));
  const strong = strongMatches(text, mentioned, ownedSkills(pool));
  const gaps = detectGaps(text);
  const listedGaps = gaps.includes("CI/CD") ? gaps : [...gaps, "CI/CD"];
  const ranked = rankProjects(text, pool);

  return {
    score: scoreOf(mentioned, strong, gaps.length),
    strong: strong.length ? strong : ["Kotlin", "Jetpack Compose", "MVVM", "REST API", "Coroutines"],
    gaps: listedGaps.length ? listedGaps : ["Automated testing", "CI/CD"],
    recommendedProjects: ranked.length ? ranked : ["Oboeru", "NewsStream"],
    improvement: gaps.length
      ? `Highlight your experience with ${listedGaps.join(" and ")}.`
      : "Highlight your experience with automated testing and CI/CD.",
    summary:
      "Your analysed projects cover most of the core requirements in this role. Lead with your strongest architectural work and address the gaps explicitly in your portfolio summary.",
  };
}
