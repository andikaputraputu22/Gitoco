import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  GitFork,
  Menu,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Terminal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Github } from "@/components/GithubIcon";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    n: "01",
    title: "Connect GitHub",
    body: "Link your account and we pull in your public repositories with their metadata.",
    tag: "OAuth · 1-click",
  },
  {
    n: "02",
    title: "Select your best projects",
    body: "Pick the work you actually want recruiters and clients to read about.",
    tag: "Curated Showcase",
  },
  {
    n: "03",
    title: "Let AI understand your work",
    body: "We detect technologies, architecture patterns, features and engineering practices.",
    tag: "Deep AST & Code Scan",
  },
  {
    n: "04",
    title: "Generate your portfolio",
    body: "Publish a professional portfolio that showcases your projects, engineering strengths, and evidence, ready for recruiters and clients.",
    tag: "Instant Web & PDF",
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Engineering Evidence",
    body: "Go beyond skill lists. Gitoco connects engineering insights to evidence found in a developer's project structure and implementation.",
    badge: "Verifiable Claims",
  },
  {
    icon: Sparkles,
    title: "Portfolio Generation",
    body: "A real portfolio site with three switchable templates, generated from your projects.",
    badge: "3 Curated Layouts",
  },
  {
    icon: FileText,
    title: "Clearer Hiring Context",
    body: "Help recruiters and hiring teams understand what a developer has actually built without digging through repositories manually.",
    badge: "Executive Summary",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    subtitle: "For developers getting started",
    features: [
      "Connect 1 GitHub account",
      "Analyze up to 3 projects",
      "Basic portfolio template",
      "AI project insights",
      "Engineering Evidence summary",
      "Public portfolio link",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "/ month",
    subtitle: "For developers building a stronger professional presence",
    features: [
      "Up to 20 analyzed projects",
      "All portfolio templates",
      "Full Engineering Evidence details",
      "PDF export",
      "Public portfolio",
      "Advanced AI project insights",
      "Resume-ready project descriptions",
      "Priority portfolio customization",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    id: "teams",
    name: "Teams",
    price: "Coming Soon",
    period: "",
    subtitle: "For recruiters, agencies, and hiring teams",
    features: [
      "Shared candidate workspace",
      "Engineering evidence summaries",
      "Hiring context",
      "Candidate project review",
      "Team collaboration",
      "Multi-candidate management",
    ],
    cta: "Join Waitlist",
    featured: false,
  },
] as const;

const FAQS = [
  {
    q: "What is Gitoco?",
    a: "Gitoco helps developers turn GitHub repositories into structured professional portfolios by analyzing project technologies, architecture, engineering work, and project insights.",
  },
  {
    q: "How does Gitoco analyze my projects?",
    a: "Gitoco uses repository information to identify technologies, architecture patterns, key features, engineering strengths, and technical context that can be transformed into portfolio-ready content.",
  },
  {
    q: "What is Engineering Evidence?",
    a: "Engineering Evidence provides additional technical context behind Gitoco's project insights by highlighting patterns, structures, and implementation signals found within a project.",
  },
  {
    q: "Does Gitoco read my entire source code?",
    a: "The production version of Gitoco is designed to analyze only the repository information required to understand a project. Users should remain in control of which repositories they choose to analyze.",
  },
  {
    q: "Can I choose which GitHub projects appear in my portfolio?",
    a: "Yes. You can select the repositories that best represent your work instead of including every project in your GitHub account.",
  },
  {
    q: "Can I export my portfolio?",
    a: "Yes. Gitoco supports professional PDF export and a shareable public portfolio so your work can be presented to recruiters, clients, and hiring teams.",
  },
  {
    q: "Is Gitoco only for developers?",
    a: "Gitoco is developer-first, but the portfolios and engineering context it creates are also designed to help recruiters, hiring teams, and clients understand a developer's work more clearly.",
  },
  {
    q: "What is the difference between Free, Pro, and Teams?",
    a: "Free is designed for developers getting started. Pro unlocks more projects, advanced insights, portfolio templates, detailed Engineering Evidence, and professional export tools. Teams is planned for recruiters, agencies, and hiring teams.",
  },
  {
    q: "Is the current Gitoco demo using real GitHub and AI data?",
    a: "No. The current competition demo uses simulated GitHub repository data and AI insights to demonstrate the intended product experience.",
  },
] as const;

const HERO_STAGES = [
  {
    id: "github",
    number: "01",
    label: "GitHub Source",
    title: "Raw Repository Data",
    desc: "Ingests commit history, file tree, dependencies, and issues.",
  },
  {
    id: "analysis",
    number: "02",
    label: "AI Analysis",
    title: "Deep Architecture Parsing",
    desc: "Identifies Clean Architecture, MVVM, Room DB, and design patterns.",
  },
  {
    id: "evidence",
    number: "03",
    label: "Engineering Evidence",
    title: "Verifiable Claims",
    desc: "Cites direct source files backing up architectural capabilities.",
  },
  {
    id: "portfolio",
    number: "04",
    label: "Live Portfolio",
    title: "Recruiter-Ready Presence",
    desc: "Publishes custom web link and high-fidelity PDF export.",
  },
];

const TEMPLATE_PREVIEWS = [
  {
    id: "minimal",
    name: "Modern Minimal",
    tagline: "Ultra-clean Scandinavian layout for high signal-to-noise ratio.",
    badge: "Popular with Founders",
    accent: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "engineering",
    name: "Engineering Focus",
    tagline: "Architecture diagrams, code metrics, and evidence-first inspection.",
    badge: "Staff & Lead Roles",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "executive",
    name: "Executive Brief",
    tagline: "High-impact narrative, business metrics, and team leadership signals.",
    badge: "Manager & Director",
    accent: "from-purple-500/20 to-pink-500/10",
  },
];

export default function Landing(): React.ReactElement {
  const [heroStage, setHeroStage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.("https://gitoco.com/portfolio/andikaputraputu");
    setCopiedLink(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* ─── NAVIGATION ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6 xl:gap-10">
            <Logo />
            <nav className="hidden items-center gap-1 text-[13.5px] font-medium text-muted-foreground lg:flex">
              <a
                href="#product"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground"
                data-testid="nav-link-product"
              >
                Product
              </a>
              <a
                href="#how-it-works"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground"
                data-testid="nav-link-how-it-works"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground"
                data-testid="nav-link-features"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground"
                data-testid="nav-link-pricing"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle testId="theme-toggle-landing" />

            {/* Desktop Actions */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <Link
                to="/dashboard"
                className="cursor-pointer inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl border border-border bg-transparent px-4 text-[13.5px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
                data-testid="sign-in-btn"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="group inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-4 text-[13.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                data-testid="get-started-btn"
              >
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/80 text-foreground transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border/80 bg-background/95 backdrop-blur-2xl lg:hidden"
              data-testid="mobile-menu-panel"
            >
              <div className="flex flex-col space-y-3 px-5 py-5">
                <nav className="flex flex-col space-y-1 text-[15px] font-medium text-foreground">
                  <a
                    href="#product"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    Product
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    How It Works
                  </a>
                  <a
                    href="#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    Pricing
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    FAQ
                  </a>
                </nav>

                <div className="border-t border-border/60 pt-4 flex flex-col gap-2.5">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-transparent px-4 text-[14px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-[14px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Get Started
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 1. HERO SECTION ───────────────────────────────────────────── */}
      <section
        id="product"
        className="relative overflow-hidden border-b border-border/70 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-32 lg:pt-28"
      >
        {/* Stripe-inspired atmospheric gradients & mesh grid */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Subtle angled ambient beams */}
          <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 -rotate-12 rounded-[100%] bg-gradient-to-tr from-primary/18 via-sky-500/10 to-indigo-500/14 blur-[120px] dark:from-primary/25 dark:via-sky-500/15 dark:to-indigo-500/20" />
          <div className="absolute top-[20%] right-[-10%] h-[450px] w-[550px] rounded-full bg-cyan-400/10 blur-[130px] dark:bg-cyan-500/12" />
          <div className="absolute top-[40%] left-[-15%] h-[450px] w-[500px] rounded-full bg-blue-600/10 blur-[140px] dark:bg-blue-600/18" />
          <div className="absolute inset-0 grid-noise opacity-[0.25] dark:opacity-[0.35]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Top Pill / Contest Badge */}
          <div className="flex justify-center lg:justify-start">
            <Badge
              variant="outline"
              className="mono inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.07] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-primary backdrop-blur-md dark:border-primary/40 dark:bg-primary/10"
              data-testid="hero-badge"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              CONTEST DEMO · SIMULATED AI
            </Badge>
          </div>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Hero Narrative */}
            <div className="text-center lg:col-span-6 lg:text-left">
              <h1
                className="font-heading text-[30px] font-bold tracking-[-0.03em] text-foreground sm:text-[42px] lg:text-[48px] xl:text-[52px] leading-[1.08]"
                data-testid="hero-headline"
              >
                Turn your GitHub into a portfolio that{" "}
                <span className="text-primary">gets noticed.</span>
              </h1>

              <p
                className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17.5px] lg:mx-0"
                data-testid="hero-subtext"
              >
                Gitoco analyzes your repositories, architecture patterns, and engineering evidence to
                build a professional portfolio that showcases your true depth and gives hiring
                teams clear context to understand your work.
              </p>

              {/* CTAs with identical height, radius, shape, and clear filled vs outline hierarchy */}
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3.5 sm:mt-9 lg:justify-start">
                <Link
                  to="/dashboard"
                  className="group inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-7 text-[14.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                  data-testid="build-my-portfolio-btn"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-transparent px-7 text-[14.5px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
                  data-testid="see-how-it-works-btn"
                >
                  See How It Works
                </a>
              </div>

              {/* Product-Specific Value Points */}
              <div className="mt-10 border-t border-border/70 pt-6 sm:mt-11">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 text-left">
                  <div className="space-y-1">
                    <h3 className="font-heading text-[13.5px] font-semibold tracking-tight text-foreground sm:text-[14px]">
                      Real Code Structure
                    </h3>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      Goes beyond README-level analysis.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading text-[13.5px] font-semibold tracking-tight text-foreground sm:text-[14px]">
                      Verifiable Evidence
                    </h3>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      Backs your skills with real project evidence.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading text-[13.5px] font-semibold tracking-tight text-foreground sm:text-[14px]">
                      Recruiter Clarity
                    </h3>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      Gives hiring teams clearer technical context.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Product Visual: GitHub → AI Analysis → Engineering Evidence → Portfolio */}
            <div className="lg:col-span-6" data-testid="hero-visual">
              <div className="relative mx-auto max-w-xl">
                {/* Main Product Shell */}
                <div className="relative overflow-hidden rounded-2xl border border-border/90 bg-card shadow-lg shadow-black/[0.03] dark:border-white/10 dark:bg-[#0B111E] dark:shadow-black/40">
                  {/* Window Chrome Header */}
                  <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3.5 sm:px-4 py-3 dark:border-white/8 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-3 w-3 shrink-0 rounded-full bg-[#FF5F57]/90" />
                      <span className="h-3 w-3 shrink-0 rounded-full bg-[#FEBC2E]/90" />
                      <span className="h-3 w-3 shrink-0 rounded-full bg-[#28C840]/90" />
                      <span className="mono ml-1.5 sm:ml-2 flex min-w-0 items-center gap-1.5 text-[11px] sm:text-[11.5px] text-muted-foreground">
                        <Github className="h-3.5 w-3.5 shrink-0 text-foreground/70" />
                        <span className="truncate">oboeru · pipeline</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Pipeline Active
                      </span>
                    </div>
                  </div>

                  {/* Pipeline Stepper Bar */}
                  <div className="grid grid-cols-4 border-b border-border/70 bg-muted/20 text-center text-[12px] font-medium dark:border-white/8 dark:bg-white/[0.015]">
                    {HERO_STAGES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setHeroStage(idx)}
                        className={`group relative flex min-w-0 cursor-pointer flex-col items-center py-2 sm:py-2.5 px-0.5 sm:px-1 transition-colors ${
                          heroStage === idx
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="mono text-[9px] sm:text-[10px] tracking-wider opacity-75">{s.number}</span>
                        <span className="mt-0.5 block max-w-full truncate text-[10px] sm:text-[12px]">{s.label}</span>
                        {heroStage === idx && (
                          <motion.div
                            layoutId="heroTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Stage Display Area */}
                  <div className="p-3.5 sm:p-6">
                    <AnimatePresence mode="wait">
                      {heroStage === 0 && (
                        <motion.div
                          key="stage-0"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3.5"
                        >
                          <div className="rounded-xl border border-border/80 bg-muted/25 p-3.5 sm:p-4 dark:border-white/10 dark:bg-white/[0.02]">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <Github className="h-4 w-4 shrink-0 text-foreground" />
                                  <span className="mono text-[12px] sm:text-[13.5px] font-semibold text-foreground truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
                                    andikaputraputu/oboeru
                                  </span>
                                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                                    Public
                                  </span>
                                </div>
                                <p className="mt-1.5 text-[11.5px] sm:text-[12px] leading-relaxed text-muted-foreground">
                                  Japanese learning Android app with spaced repetition and offline-first
                                  vocabulary decks.
                                </p>
                              </div>
                              <Badge variant="outline" className="mono shrink-0 border-primary/30 text-[10px] text-primary">
                                Selected
                              </Badge>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-border/60 pt-2.5 dark:border-white/6">
                              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 shrink-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Kotlin
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground shrink-0">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 428
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground shrink-0">
                                <GitFork className="h-3 w-3" /> 37
                              </span>
                              <span className="mono text-[10.5px] sm:text-[11px] text-muted-foreground w-full sm:w-auto sm:ml-auto">
                                84 commits indexed
                              </span>
                            </div>
                          </div>

                          {/* Ingested Project Structure Preview */}
                          <div className="rounded-xl border border-border/70 bg-card p-3 sm:p-3.5 dark:border-white/10 dark:bg-black/40">
                            <div className="flex items-center justify-between border-b border-border/60 pb-2 text-[11px] text-muted-foreground dark:border-white/8">
                              <span className="mono flex items-center gap-1.5 font-medium text-foreground min-w-0">
                                <FileCode2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="truncate">Ingested Project Structure</span>
                              </span>
                              <span className="mono flex items-center gap-1 text-[10.5px] text-emerald-600 dark:text-emerald-400 shrink-0">
                                <Check className="h-3 w-3" /> Ready for AI Scan
                              </span>
                            </div>
                            <div className="mono mt-2.5 space-y-1.5 text-[10.5px] sm:text-[11px] text-muted-foreground">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-foreground">📁 presentation/</span>
                                <span className="text-[10px] sm:text-[10.5px] opacity-75">Compose UI · MVVM</span>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-foreground">📁 domain/</span>
                                <span className="text-[10px] sm:text-[10.5px] text-primary">UseCases · Pure Kotlin</span>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-foreground">📁 data/</span>
                                <span className="text-[10px] sm:text-[10.5px] opacity-75">Room DB · Offline Sync</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {heroStage === 1 && (
                        <motion.div
                          key="stage-1"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3.5"
                        >
                          <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-3.5 sm:p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <BrainCircuit className="h-4 w-4 shrink-0 text-primary" />
                                <span className="mono text-[11px] sm:text-[12px] font-semibold text-primary truncate">
                                  AI Architecture & Pattern Detection
                                </span>
                              </div>
                              <Badge className="bg-primary text-primary-foreground text-[10px] shrink-0">
                                Clean Architecture
                              </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                              <div className="rounded-lg border border-border/60 bg-card p-1.5 sm:p-2 min-w-0 dark:bg-white/[0.02]">
                                <span className="block text-[9px] sm:text-[10.5px] text-muted-foreground truncate">Modularity</span>
                                <p className="mono font-bold text-[13px] sm:text-[14px] text-foreground">94%</p>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-card p-1.5 sm:p-2 min-w-0 dark:bg-white/[0.02]">
                                <span className="block text-[9px] sm:text-[10.5px] text-muted-foreground truncate">Code Purity</span>
                                <p className="mono font-bold text-[13px] sm:text-[14px] text-foreground">98%</p>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-card p-1.5 sm:p-2 min-w-0 dark:bg-white/[0.02]">
                                <span className="block text-[9px] sm:text-[10.5px] text-muted-foreground truncate">Role Signal</span>
                                <p className="mono font-bold text-[11.5px] sm:text-[14px] text-emerald-600 dark:text-emerald-400 truncate">Sr. Android</p>
                              </div>
                            </div>
                          </div>

                          <div className="mono rounded-xl border border-border/80 bg-card p-3 sm:p-3.5 text-[12px] dark:border-white/10 dark:bg-black/60">
                            <div className="flex items-center gap-2 border-b border-border/60 pb-2 text-[11px] text-muted-foreground dark:border-white/10">
                              <Terminal className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="truncate">Extracted Engineering Capabilities</span>
                            </div>
                            <div className="mt-2.5 space-y-1.5 text-[11px] sm:text-[11.5px]">
                              <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <Check className="h-3 w-3 shrink-0" />
                                Clean Architecture · MVVM · Dagger Hilt
                              </p>
                              <p className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                                <Check className="h-3 w-3 shrink-0" />
                                Offline-First Sync with Room SQLite cache
                              </p>
                              <p className="text-[10.5px] sm:text-[11px] text-muted-foreground pl-4">
                                // Zero Android framework imports in domain layer
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {heroStage === 2 && (
                        <motion.div
                          key="stage-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3.5 sm:p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-heading text-[13px] sm:text-[13.5px] font-semibold text-foreground truncate">
                                  Clean Architecture & Offline Cache
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-emerald-500/40 bg-emerald-500/10 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0"
                              >
                                Verified Claim
                              </Badge>
                            </div>
                            <p className="mt-2 text-[11.5px] sm:text-[12px] leading-relaxed text-muted-foreground">
                              Repository structure isolates Domain, Data, and Presentation layers
                              with dedicated Repository interfaces and Room local cache.
                            </p>
                            <div className="mono mt-3 space-y-2 border-t border-emerald-500/20 pt-2.5">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-[11px]">
                                <span className="min-w-0 truncate text-muted-foreground">
                                  data/repository/WordRepositoryImpl.kt
                                </span>
                                <span className="shrink-0 text-emerald-600 dark:text-emerald-400 text-[10.5px] sm:text-[11px]">Verified Citation</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-[11px]">
                                <span className="min-w-0 truncate text-muted-foreground">
                                  domain/usecase/GetStudyDeckUseCase.kt
                                </span>
                                <span className="shrink-0 text-emerald-600 dark:text-emerald-400 text-[10.5px] sm:text-[11px]">Clean Domain Boundary</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-border/80 bg-card p-3 dark:border-white/10">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-1.5 text-[11.5px]">
                              <span className="mono font-medium text-foreground flex min-w-0 items-center gap-1.5">
                                <FileCode2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="truncate">data/repository/WordRepositoryImpl.kt</span>
                              </span>
                              <span className="mono shrink-0 text-[10.5px] text-emerald-600 dark:text-emerald-400">
                                Cache Fallback Verified
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {heroStage === 3 && (
                        <motion.div
                          key="stage-3"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3.5"
                        >
                          <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-2xs">
                            <div className="flex items-center gap-3">
                              <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=120"
                                alt="I Putu Andika Putra"
                                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-heading text-[13.5px] sm:text-[14.5px] font-bold text-foreground truncate">
                                  I Putu Andika Putra
                                </h4>
                                <p className="text-[11.5px] sm:text-[12px] text-muted-foreground truncate">
                                  Android & Systems Engineer
                                </p>
                              </div>
                              <Badge className="ml-auto shrink-0 bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-[10.5px]">
                                Published
                              </Badge>
                            </div>

                            <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                              <p className="text-[11.5px] sm:text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                                "Built offline-first mobile systems using Jetpack Compose & Clean Architecture. Backed by verified AST code citations."
                              </p>
                            </div>

                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 border-t border-border/60 pt-2.5 text-[11.5px]">
                              <span className="mono min-w-0 truncate text-muted-foreground">gitoco.com/portfolio/andikaputraputu</span>
                              <Link
                                to="/portfolio/andikaputraputu"
                                className="flex items-center gap-1 font-medium text-primary hover:underline shrink-0"
                              >
                                View Portfolio <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step Navigation Dots & Next Control */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-[11px] sm:text-[11.5px] text-muted-foreground">
                      <span className="mono min-w-0 truncate">
                        Step {heroStage + 1}/4: {HERO_STAGES[heroStage].title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex gap-1.5">
                          {HERO_STAGES.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setHeroStage(i)}
                              aria-label={`Go to step ${i + 1}`}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                heroStage === i ? "w-5 sm:w-6 bg-primary" : "w-1.5 sm:w-2 bg-muted hover:bg-muted-foreground/50"
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setHeroStage((prev) => (prev + 1) % HERO_STAGES.length)}
                          className="mono ml-1 sm:ml-2 inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-0.5 text-[10.5px] font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                        >
                          Next <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. GITHUB → GITOCO TRANSFORMATION ─────────────────────────── */}
      <section id="how-it-works" className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              How It Works
            </Badge>
            <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]">
              From raw repositories to hireable story.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Recruiters don't have time to sift through cryptic commits and endless repository trees.
              Gitoco bridges the gap between engineering craft and recruiter clarity.
            </p>
          </div>

          {/* Transformation Showcase: Before (Raw GitHub) vs After (Gitoco Portfolio) */}
          <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2">
            {/* Left: The Problem (Raw GitHub) */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-8 dark:border-white/8 dark:bg-white/[0.01]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border/60">
                <span className="mono text-[12px] font-semibold text-muted-foreground flex items-center gap-2">
                  <Github className="h-4 w-4 shrink-0" /> Before: Typical GitHub Profile
                </span>
                <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
                  Recruiters bounce in 10s
                </span>
              </div>
              <div className="mt-6 space-y-3.5 text-[13px] text-muted-foreground">
                <div className="rounded-xl border border-dashed border-border/80 p-3.5 sm:p-4 bg-background/40">
                  <p className="mono font-semibold text-foreground text-[12.5px]">README.md</p>
                  <p className="mt-1 text-muted-foreground text-[12px] break-words">
                    "# oboeru - Android app. Run ./gradlew installDebug to test."
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground/70 italic">
                    Recruiters see no architectural depth, impact, or design patterns.
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3 bg-background/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="mono text-[11.5px] sm:text-[12px] truncate min-w-0">git commit -m "fix typo & update db"</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">3 days ago</span>
                </div>
                <div className="rounded-xl border border-border/60 p-3 bg-background/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="mono text-[11.5px] sm:text-[12px] truncate min-w-0">84 commits buried across 6 branches</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">Unread</span>
                </div>
              </div>
            </div>

            {/* Right: The Solution (Gitoco Intelligence) */}
            <div className="relative rounded-2xl border border-primary/40 bg-card p-4 sm:p-8 dark:border-primary/50 dark:bg-primary/[0.03]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-primary/20">
                <span className="mono text-[12px] font-semibold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0" /> After: Gitoco Portfolio Intelligence
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500">
                  Instant Hiring Signal
                </span>
              </div>
              <div className="mt-6 space-y-3.5">
                <div className="rounded-xl border border-primary/20 bg-background/80 p-3.5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-semibold text-[14px]">Executive Project Brief</h4>
                    <Badge variant="outline" className="text-[10px] text-primary">AI Synthesized</Badge>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    "Offline-first mobile application featuring Clean Architecture, Room SQLite cache,
                    and custom spaced repetition algorithms with 99.8% crash-free sessions."
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                    <span className="text-[11px] text-muted-foreground">Verified Patterns</span>
                    <p className="mono font-semibold text-[12.5px] text-foreground mt-0.5">
                      Clean Arch · MVVM
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                    <span className="text-[11px] text-muted-foreground">Code Quality</span>
                    <p className="mono font-semibold text-[12.5px] text-emerald-500 mt-0.5">
                      94% Architecture Score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Steps Strip */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-colors duration-150 hover:border-primary/40 dark:border-white/10 dark:bg-card/60"
                data-testid={`how-step-${s.n}`}
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[14px] font-bold text-primary">{s.n}</span>
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {s.tag}
                  </Badge>
                </div>
                <h3 className="mt-5 font-heading text-[17px] font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. AI PROJECT ANALYSIS ────────────────────────────────────── */}
      <section id="features" className="relative border-b border-border/70 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
            {/* Left Narrative */}
            <div className="lg:col-span-5">
              <Badge
                variant="outline"
                className="mono rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
              >
                AI Project Analysis
              </Badge>
              <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[40px] leading-tight text-foreground">
                AI that understands how software is actually built.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Beyond README summaries. Gitoco analyzes code structure, design patterns, and
                engineering practices to surface your genuine technical depth.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-[15px] font-semibold text-foreground">
                      Automated Tech Stack Detection
                    </h4>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                      Identifies languages, frameworks, state libraries, and test suites directly from your code.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-[15px] font-semibold text-foreground">
                      Architecture & Pattern Recognition
                    </h4>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                      Surfaces Clean Architecture, MVVM, modular boundaries, and design patterns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-9">
                <Link
                  to="/dashboard"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-7 text-[14.5px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
                  data-testid="features-cta-btn"
                >
                  Try the Demo Analysis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Product UI Mockup */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-border bg-card dark:border-white/10 dark:bg-[#0C121E]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-muted/30 px-3.5 sm:px-5 py-3.5 dark:border-white/8 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0">
                    <ScanSearch className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-heading text-[12.5px] sm:text-[13px] font-semibold truncate">
                      Project Inspector · oboeru
                    </span>
                  </div>
                  <Badge variant="outline" className="mono text-[10.5px] shrink-0">
                    AST Depth: Level 4
                  </Badge>
                </div>

                <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
                  {/* Tech stack badge tags */}
                  <div>
                    <span className="mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                      Detected Stack
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {["Kotlin", "Jetpack Compose", "Room DB", "Hilt", "Coroutines Flow"].map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-[12px] text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Architecture Breakdown */}
                  <div className="border-t border-border/50 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                        Architecture Blueprint
                      </span>
                      <span className="mono text-[11px] text-emerald-500 font-medium">Clean Architecture · Strict</span>
                    </div>
                    <div className="mt-3 grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3 text-[12px]">
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5 sm:p-3 min-w-0">
                        <p className="text-[11px] text-muted-foreground">UI Layer</p>
                        <p className="font-semibold text-foreground mt-0.5 truncate">Compose + MVVM</p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5 sm:p-3 min-w-0">
                        <p className="text-[11px] text-muted-foreground">Domain</p>
                        <p className="font-semibold text-foreground mt-0.5 truncate">Use Cases</p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5 sm:p-3 min-w-0">
                        <p className="text-[11px] text-muted-foreground">Data</p>
                        <p className="font-semibold text-foreground mt-0.5 truncate">Offline Room</p>
                      </div>
                    </div>
                  </div>

                  {/* Complexity & Roles */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
                    <div>
                      <span className="text-[11.5px] text-muted-foreground">Role Alignment</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Badge className="bg-primary text-primary-foreground text-[11px]">
                          Senior Android Engineer
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11.5px] text-muted-foreground">Complexity</span>
                      <p className="font-heading font-semibold text-[15px] text-foreground">Advanced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Features Grid */}
          <div className="mt-20 border-t border-border/60 pt-14">
            <div className="grid gap-5 md:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-border/70 bg-card/50 p-5 transition-colors duration-150 hover:border-foreground/20 hover:bg-card dark:border-white/8 dark:bg-card/30"
                  data-testid={`feature-card-${f.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-4 w-4" />
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-medium py-0 px-2">
                      {f.badge}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-heading text-[15.5px] font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. ENGINEERING EVIDENCE ───────────────────────────────────── */}
      <section id="evidence" className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28 bg-muted/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-emerald-500/30 bg-emerald-500/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400"
            >
              The Core Differentiator
            </Badge>
            <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]">
              Don't just list skills. Prove them with Engineering Evidence.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Anyone can paste keywords like "Clean Architecture" or "Microservices" on a CV.
              Gitoco provides verifiable citations connecting your claims to actual files, design
              patterns, and commit implementations.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-12">
            {/* Left: Interactive Evidence Card Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-emerald-500/30 bg-card p-4 sm:p-8 dark:border-emerald-500/40 dark:bg-[#0B141E]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-border/70 pb-5">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 mt-0.5 sm:mt-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-[15px] sm:text-[16px] font-bold text-foreground leading-snug break-words">
                        Clean Architecture & Offline Caching
                      </h3>
                      <p className="text-[12px] text-muted-foreground mt-0.5 break-words">
                        Evaluated across 42 repository source files
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center sm:justify-end">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 self-start sm:self-auto"
                    >
                      Strong Evidence
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                      Detected Architectural Patterns
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge variant="secondary" className="text-[11px] sm:text-[11.5px] max-w-full whitespace-normal text-left py-0.5 px-2.5">
                        Repository Pattern
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] sm:text-[11.5px] max-w-full whitespace-normal text-left py-0.5 px-2.5">
                        Dependency Inversion (Hilt)
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] sm:text-[11.5px] max-w-full whitespace-normal text-left py-0.5 px-2.5">
                        Offline-First SQLite Cache
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] sm:text-[11.5px] max-w-full whitespace-normal text-left py-0.5 px-2.5">
                        Flow Reactive Streams
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 sm:p-4">
                    <span className="mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                      Evidence Summary
                    </span>
                    <p className="mono mt-1.5 text-[11px] sm:text-[12.5px] text-foreground leading-relaxed break-words">
                      3 layers · 7 use cases · Room DB persistence · 100% test coverage on domain rules
                    </p>
                  </div>

                  <div>
                    <span className="mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                      Verifiable Implementation Files
                    </span>
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 sm:px-3.5 text-[12px] min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="mono font-medium truncate text-[11px] sm:text-[12px]">
                            data/repository/WordRepositoryImpl.kt
                          </span>
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] text-muted-foreground shrink-0 sm:ml-auto pl-6 sm:pl-0">
                          Cache fallback logic
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 sm:px-3.5 text-[12px] min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="mono font-medium truncate text-[11px] sm:text-[12px]">
                            domain/usecase/GetStudyDeckUseCase.kt
                          </span>
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] text-muted-foreground shrink-0 sm:ml-auto pl-6 sm:pl-0">
                          Isolated business logic
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 sm:px-3.5 text-[12px] min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="mono font-medium truncate text-[11px] sm:text-[12px]">
                            ui/screens/study/StudyViewModel.kt
                          </span>
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] text-muted-foreground shrink-0 sm:ml-auto pl-6 sm:pl-0">
                          Predictable MVI state
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Explanatory Proof Points */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl border border-border/70 bg-card p-6 dark:border-white/10">
                <h4 className="font-heading text-[16px] font-semibold text-foreground">
                  Why Recruiters Trust Evidence
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Hiring managers spend under 30 seconds reading resumes. Gitoco synthesizes
                  verifiable technical proof without requiring them to clone repositories or inspect
                  Git trees manually.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-6 dark:border-white/10">
                <h4 className="font-heading text-[16px] font-semibold text-foreground">
                  No Unverified Boasts
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Claims are rated transparently as <em>Strong Evidence</em>, <em>Evidence Found</em>,
                  or <em>Limited Evidence</em>. This honesty builds immediate credibility with senior
                  engineering interviewers.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-6 dark:border-white/10">
                <h4 className="font-heading text-[16px] font-semibold text-foreground">
                  Exportable to PDF & Web
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Evidence summaries are included in your generated web portfolio and downloadable PDF
                  resumes for client proposals and technical interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. PORTFOLIO GENERATION & SWITCHABLE TEMPLATES ─────────────── */}
      <section className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              Portfolio Generation
            </Badge>
            <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]">
              One analysis. Three tailored presentations.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Switch templates with a single click. Whether you’re applying for an IC engineering
              role, a founding engineer position, or an executive lead, your portfolio matches the
              room.
            </p>
          </div>

          {/* Interactive Template Selector */}
          <div className="mt-10 flex justify-center">
            {/* Desktop Horizontal Segmented Control */}
            <div className="hidden sm:inline-flex max-w-full items-center justify-center gap-1 rounded-xl border border-border/80 bg-muted/40 p-1 dark:border-white/10 dark:bg-white/[0.02]">
              {TEMPLATE_PREVIEWS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                    selectedTemplate === t.id
                      ? "bg-background text-foreground shadow-xs font-semibold border border-border/70 dark:bg-card dark:text-foreground dark:border-white/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] border border-transparent"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Mobile Stacked Buttons (Equal height, 12-14px radius, clear active check) */}
            <div className="flex sm:hidden flex-col gap-2 w-full max-w-sm mx-auto">
              {TEMPLATE_PREVIEWS.map((t) => {
                const isActive = selectedTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`cursor-pointer flex h-11 w-full items-center justify-between px-4 rounded-xl text-[13.5px] transition-all ${
                      isActive
                        ? "border border-primary/50 bg-primary/10 font-semibold text-primary shadow-xs dark:border-primary/60 dark:bg-primary/15 dark:text-primary-foreground"
                        : "border border-border/70 bg-card/60 font-medium text-muted-foreground hover:border-border hover:text-foreground dark:border-white/10 dark:bg-card/40"
                    }`}
                  >
                    <span>{t.name}</span>
                    {isActive && (
                      <Check className="h-4 w-4 shrink-0 text-primary dark:text-primary-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Template Mockup */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card dark:border-white/10 dark:bg-[#0A101D]">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-4 sm:px-6 py-3 sm:py-4 dark:border-white/8 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="font-heading text-[13px] sm:text-[14px] font-semibold truncate">
                  {TEMPLATE_PREVIEWS.find((t) => t.id === selectedTemplate)?.name} Preview
                </span>
                <Badge variant="secondary" className="text-[10px] sm:text-[10.5px] shrink-0">
                  {TEMPLATE_PREVIEWS.find((t) => t.id === selectedTemplate)?.badge}
                </Badge>
              </div>
              <p className="hidden text-[12.5px] text-muted-foreground sm:block">
                {TEMPLATE_PREVIEWS.find((t) => t.id === selectedTemplate)?.tagline}
              </p>
            </div>

            {/* Template Content Render */}
            <div className="p-4 sm:p-8 lg:p-10">
              {selectedTemplate === "minimal" && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="border-b border-border/60 pb-6">
                    <h3 className="font-heading text-[22px] sm:text-[28px] font-bold text-foreground">
                      I Putu Andika Putra
                    </h3>
                    <p className="mt-1 text-[13.5px] sm:text-[15px] text-primary font-medium">
                      Android & Full-Stack Engineer · Jakarta, Indonesia
                    </p>
                    <p className="mt-3 text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
                      Building offline-first mobile applications with Clean Architecture and shipping
                      scalable full-stack web products.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-heading text-[15px] sm:text-[16px] font-semibold text-foreground mb-4">
                      Featured Work
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-heading font-semibold text-[15px]">Oboeru</h5>
                          <span className="mono text-[11px] text-muted-foreground">428 ★</span>
                        </div>
                        <p className="mt-2 text-[13px] text-muted-foreground">
                          Spaced repetition Japanese learning app with offline-first Room cache.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[10px]">Kotlin</Badge>
                          <Badge variant="outline" className="text-[10px]">Jetpack Compose</Badge>
                          <Badge variant="outline" className="text-[10px]">Room</Badge>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-heading font-semibold text-[15px]">Ananka</h5>
                          <span className="mono text-[11px] text-muted-foreground">312 ★</span>
                        </div>
                        <p className="mt-2 text-[13px] text-muted-foreground">
                          Vendor discovery platform with real-time search and vendor dashboards.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[10px]">Next.js</Badge>
                          <Badge variant="outline" className="text-[10px]">TypeScript</Badge>
                          <Badge variant="outline" className="text-[10px]">PostgreSQL</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "engineering" && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3.5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="mono text-[10.5px] sm:text-[11px] text-emerald-500 font-semibold">
                          ENGINEERING SPECIFICATION
                        </span>
                        <h3 className="font-heading text-[18px] sm:text-[24px] font-bold mt-1">
                          Architecture & Deep Evidence Profile
                        </h3>
                      </div>
                      <Badge className="bg-emerald-500 text-white text-[11px]">Score: 94/100</Badge>
                    </div>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                      <div className="p-2 sm:p-3 bg-background/80 rounded-lg border border-border/50 min-w-0">
                        <span className="block text-[10px] sm:text-[11px] text-muted-foreground truncate">Verified Patterns</span>
                        <p className="font-heading font-bold text-[13.5px] sm:text-[16px] text-foreground mt-0.5 truncate">8 Detected</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-background/80 rounded-lg border border-border/50 min-w-0">
                        <span className="block text-[10px] sm:text-[11px] text-muted-foreground truncate">Clean Arch</span>
                        <p className="font-heading font-bold text-[13.5px] sm:text-[16px] text-emerald-500 mt-0.5 truncate">Strict</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-background/80 rounded-lg border border-border/50 min-w-0">
                        <span className="block text-[10px] sm:text-[11px] text-muted-foreground truncate">Test Coverage</span>
                        <p className="font-heading font-bold text-[13.5px] sm:text-[16px] text-foreground mt-0.5 truncate">Domain Tested</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-background/80 rounded-lg border border-border/50 min-w-0">
                        <span className="block text-[10px] sm:text-[11px] text-muted-foreground truncate">Primary Stack</span>
                        <p className="font-heading font-bold text-[13.5px] sm:text-[16px] text-foreground mt-0.5 truncate">Android / Web</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/70 p-4 sm:p-5 bg-card">
                    <h5 className="font-heading font-semibold text-[14px]">
                      Core System Evidence: Oboeru Offline Sync
                    </h5>
                    <p className="mt-1.5 text-[12.5px] sm:text-[13px] text-muted-foreground leading-relaxed">
                      Repository interfaces decouple network serialization from Room database entities.
                      State is modeled via Kotlin sealed interfaces and exposed as StateFlow.
                    </p>
                  </div>
                </div>
              )}

              {selectedTemplate === "executive" && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="border-l-4 border-purple-500 pl-4 sm:pl-5">
                    <span className="mono text-[10.5px] sm:text-[11px] text-purple-500 uppercase tracking-widest font-semibold">
                      Executive Summary
                    </span>
                    <h3 className="font-heading text-[20px] sm:text-[26px] font-bold mt-1">
                      Full-Cycle Product Engineer & Lead
                    </h3>
                    <p className="mt-2 text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed">
                      Proven track record shipping consumer-facing Android and full-stack web products.
                      Owns technical architecture from database schema to polished interaction design.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 text-center">
                      <p className="font-heading font-bold text-[24px] sm:text-[28px] text-purple-500">740+</p>
                      <p className="text-[12px] sm:text-[12.5px] text-muted-foreground mt-1">
                        Combined GitHub Stars
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 text-center">
                      <p className="font-heading font-bold text-[24px] sm:text-[28px] text-foreground">3 Ships</p>
                      <p className="text-[12px] sm:text-[12.5px] text-muted-foreground mt-1">
                        Production Applications
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 text-center">
                      <p className="font-heading font-bold text-[24px] sm:text-[28px] text-emerald-500">100%</p>
                      <p className="text-[12px] sm:text-[12.5px] text-muted-foreground mt-1">
                        Offline Data Reliability
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. PUBLIC PORTFOLIO + PDF EXPORT ──────────────────────────── */}
      <section className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28 bg-muted/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left: Dual Channel Distribution Storytelling */}
            <div className="lg:col-span-6">
              <Badge
                variant="outline"
                className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
              >
                Multi-Channel Sharing
              </Badge>
              <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[42px] leading-tight">
                Share anywhere. Impress everywhere.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
                Your portfolio lives online under your personalized URL, and exports in one click
                to an ATS-friendly, pixel-perfect PDF formatted specifically for formal job
                applications and client proposals.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-[14.5px]">
                      Shareable Public Web URL
                    </span>
                    <Badge variant="outline" className="text-[10.5px]">
                      Responsive Web
                    </Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Custom vanity link with fast global edge delivery, dark mode, and mobile optimization.
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="mono flex min-w-0 flex-1 items-center rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-[12px] text-foreground">
                      <span className="truncate">gitoco.com/portfolio/andikaputraputu</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-[12px] font-medium hover:bg-muted shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-[14.5px]">
                      One-Click PDF Export
                    </span>
                    <Badge variant="outline" className="text-[10.5px]">
                      ATS & Print Ready
                    </Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Generates clean vector typography, QR codes linking to your live code, and verified
                    evidence summaries.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Download className="h-3.5 w-3.5 text-primary" />
                    <span>Exports cleanly in under 2 seconds. No watermarks.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: PDF and Web Visual Preview */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg">
                {/* PDF Paper Mockup Stack */}
                <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-7 dark:border-white/10 dark:bg-[#0B1220]">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-heading text-[13px] font-semibold truncate">
                        andika-portfolio.pdf
                      </span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] shrink-0">
                      Vector A4
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-4 text-[12px]">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-heading font-bold text-[15px] sm:text-[16px]">
                        I Putu Andika Putra
                      </span>
                      <span className="mono text-muted-foreground text-[10.5px] sm:text-[11px] truncate">
                        andikaputraputu@gitoco.com
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[12px] leading-relaxed">
                      Android & Full-Stack Engineer with 4+ years building high-reliability applications.
                      Specialized in Clean Architecture, reactive state, and offline synchronization.
                    </p>

                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-semibold text-foreground">Oboeru - Android App</span>
                        <span className="mono text-emerald-500 font-medium">Strong Evidence</span>
                      </div>
                      <p className="mt-1 text-muted-foreground text-[11.5px]">
                        • Engineered modular offline-first Android client with Jetpack Compose & Room.
                        <br />
                        • Designed domain use cases resulting in 100% testable business logic.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-semibold text-foreground">Ananka - Marketplace</span>
                        <span className="mono text-primary font-medium">Evidence Found</span>
                      </div>
                      <p className="mt-1 text-muted-foreground text-[11.5px]">
                        • Shipped full-stack vendor discovery platform with Next.js, Postgres & Tailwind.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-[11px] sm:text-[11.5px] text-muted-foreground">
                    <span className="mono">Generated with Gitoco Engine</span>
                    <span className="flex items-center gap-1 text-primary font-medium shrink-0">
                      <Check className="h-3.5 w-3.5" /> High-Resolution PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. DEVELOPER-FIRST, HIRING-READY (+ JOB MATCH) ─────────────── */}
      <section className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              Dual-Sided Value
            </Badge>
            <h2 className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]">
              Built for developers. Valued by hiring teams.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Developers hate writing self-promotional bios. Hiring managers hate guessing what
              candidates actually built. Gitoco fixes both sides.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* For Developers */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 dark:border-white/10">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-heading text-[20px] font-bold text-foreground">
                For Developers
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                Turn your existing GitHub commit history into a high-credibility portfolio in
                minutes. No manual writing, no designing from scratch.
              </p>
              <ul className="mt-6 space-y-3 text-[13.5px]">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Automatic tech stack extraction from package manifests</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Zero bio writer's block - AI writes structured project briefs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Choose which projects to highlight and keep total control</span>
                </li>
              </ul>
            </div>

            {/* For Hiring Teams */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 dark:border-white/10">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-heading text-[20px] font-bold text-foreground">
                For Recruiters & Clients
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                Get an executive-level summary of a candidate’s capabilities in 60 seconds with
                evidence-backed claims you can actually verify.
              </p>
              <ul className="mt-6 space-y-3 text-[13.5px]">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Evidence citations backed by real repository code</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Instant complexity scoring and role fit assessments</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Standardized portfolio documents across all candidates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Job Match Spotlight Box */}
          <div className="mt-10 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.05] via-primary/[0.02] to-card p-5 sm:p-10 dark:border-primary/40">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-2xl">
                <Badge className="bg-primary text-primary-foreground text-[11px]">
                  Feature Spotlight
                </Badge>
                <h3 className="mt-3 font-heading text-[22px] font-bold sm:text-[26px]">
                  Job Description Matching
                </h3>
                <p className="mt-2 text-[14px] sm:text-[14.5px] leading-relaxed text-muted-foreground">
                  Paste any job post requirements into Gitoco. Our engine matches your analyzed
                  repositories against role requirements, highlights your strongest projects, and
                  identifies potential skill gaps.
                </p>
              </div>
              <Link
                to="/job-match"
                className="group inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-7 text-[14.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Try Job Match
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. PRICING ────────────────────────────────────────────────── */}
      <section id="pricing" className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              Pricing
            </Badge>
            <h2
              className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]"
              data-testid="pricing-headline"
            >
              Simple pricing for developers today, built to scale with teams tomorrow.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              Start free, build your portfolio, and upgrade when you need more projects, deeper
              insights, and professional sharing tools.
            </p>
          </div>

          <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-5 sm:p-8 transition-colors duration-150 ${
                  plan.id === "teams" ? "md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 w-full" : ""
                } ${
                  plan.featured
                    ? "border-2 border-primary bg-card dark:border-primary/80 dark:bg-card/90"
                    : "border-border/80 bg-card/60 hover:border-border dark:border-white/10 dark:bg-card/40"
                }`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.featured && (
                  <Badge
                    variant="default"
                    className="mono absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                    data-testid="pricing-popular-badge"
                  >
                    Most Popular
                  </Badge>
                )}

                <h3
                  className="font-heading text-[20px] font-bold text-foreground"
                  data-testid={`pricing-name-${plan.id}`}
                >
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span
                    className="font-heading text-[38px] font-extrabold tracking-tight text-foreground"
                    data-testid={`pricing-price-${plan.id}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[14px] text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {plan.subtitle}
                </p>

                <ul
                  className="mt-8 flex-1 space-y-3.5 border-t border-border/70 pt-6"
                  data-testid={`pricing-features-${plan.id}`}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13.5px] leading-snug">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.featured ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-4">
                  {plan.id === "free" ? (
                    <Link
                      to="/dashboard"
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-7 text-[14.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                      data-testid="pricing-cta-free"
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        toast.info(
                          plan.id === "pro"
                            ? "Payments are not enabled in the contest demo."
                            : "Teams is coming soon."
                        )
                      }
                      className={
                        plan.id === "pro"
                          ? "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-7 text-[14.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                          : "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-border bg-transparent px-7 text-[14.5px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
                      }
                      data-testid={`pricing-cta-${plan.id}`}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[12.5px] text-muted-foreground/70">
            Contest demo - payments and Teams access are not enabled.
          </p>
        </div>
      </section>

      {/* ─── 9. FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="relative border-b border-border/70 py-16 sm:py-20 lg:py-28 bg-muted/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mono rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              FAQ
            </Badge>
            <h2
              className="mt-4 font-heading text-[32px] font-bold tracking-tight sm:text-[44px]"
              data-testid="faq-headline"
            >
              Frequently asked questions
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              Everything you need to know about how Gitoco turns GitHub projects into professional
              developer portfolios.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:items-start">
            {[0, 1].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-4">
                {FAQS.filter((_, i) => i % 2 === colIndex).map((item, i) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-colors duration-150 hover:border-primary/40 dark:border-white/10"
                    data-testid={`faq-item-${colIndex}-${i + 1}`}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[14.5px] sm:text-[15.5px] font-semibold [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 flex-1">{item.q}</span>
                      <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p
                      className="mt-3 max-w-prose text-[13.5px] sm:text-[14px] leading-relaxed text-muted-foreground"
                      data-testid={`faq-answer-${colIndex}-${i + 1}`}
                    >
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/80 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Badge
            variant="outline"
            className="mono rounded-full border-primary/30 bg-primary/8 px-3.5 py-1 text-[11px] font-medium uppercase tracking-widest text-primary"
          >
            Start in 2 minutes
          </Badge>

          <h2
            className="mt-6 font-heading text-[30px] font-extrabold tracking-tight sm:text-[46px] lg:text-[52px] leading-[1.1] text-foreground"
            data-testid="final-cta-headline"
          >
            Your best work is already on GitHub.
            <br />
            <span className="text-primary">Let AI tell its story.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17.5px]">
            Join developers who stopped writing unread resumes and started showcasing verified engineering evidence that gets noticed.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/dashboard"
              className="group inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-7 text-[14.5px] font-medium text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              data-testid="final-cta-btn"
            >
              <Github className="mr-2 h-4 w-4" /> Get Started Free
            </Link>
            <Link
              to="/job-match"
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-transparent px-7 text-[14.5px] font-medium text-foreground transition-all duration-150 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20 dark:hover:border-white/35 dark:hover:bg-white/[0.05]"
              data-testid="final-cta-job-match-btn"
            >
              Try Job Match
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/70 bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 sm:px-8 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-6">
            <Logo />
            <span>© {new Date().getFullYear()} Gitoco</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#product" className="hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>

          <p className="text-[12px] text-muted-foreground/70">
            Gitoco Contest Demo · GitHub repository data and AI insights are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
