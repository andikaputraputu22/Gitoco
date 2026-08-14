import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  FileText,
  Layers,
  ScanSearch,
  Sparkles,
  Target,
} from "lucide-react";
import { Github } from "@/components/GithubIcon";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { n: "01", title: "Connect GitHub", body: "Link your account and we pull in your public repositories with their metadata." },
  { n: "02", title: "Select your best projects", body: "Pick the work you actually want recruiters and clients to read about." },
  { n: "03", title: "Let AI understand your work", body: "We detect technologies, architecture patterns, features and engineering practices." },
  { n: "04", title: "Generate your portfolio", body: "Get a polished portfolio plus resume-ready descriptions in three templates." },
];

const FEATURES = [
  { icon: ScanSearch, title: "AI Project Analysis", body: "Every repository is read for purpose, structure and depth — not just a README summary.", span: "lg:col-span-2" },
  { icon: Layers, title: "Automatic Tech Stack Detection", body: "Languages, frameworks and libraries surfaced as clean, recruiter-readable badges." },
  { icon: BrainCircuit, title: "Engineering Insights", body: "Architecture patterns, state management and testing practices called out explicitly." },
  { icon: Sparkles, title: "Portfolio Generation", body: "A real portfolio site with three switchable templates, generated from your projects.", span: "lg:col-span-2" },
  { icon: FileText, title: "Resume-ready Descriptions", body: "Bullet points you can paste straight into a CV or LinkedIn profile." },
  { icon: Target, title: "Job Matching", body: "Paste a job description and see your match score, strengths and gaps." },
];

const PIPELINE = [
  { label: "GitHub Repository", meta: "andikadev/oboeru", tone: "text-muted-foreground" },
  { label: "AI Analysis", meta: "Clean Architecture · MVVM · Room", tone: "text-primary" },
  { label: "Professional Portfolio", meta: "Published · Advanced complexity", tone: "text-[var(--success)]" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-[14px] text-muted-foreground md:flex">
            <a href="#product" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-product">Product</a>
            <a href="#how-it-works" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-how-it-works">How It Works</a>
            <a href="#features" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-features">Features</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle testId="theme-toggle-landing" />
            <Link to="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })} data-testid="sign-in-btn">
              Sign In
            </Link>
            <Link to="/dashboard" className={buttonVariants({ size: "sm" }) + " rounded-full"} data-testid="get-started-btn">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="product" className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-[0.35]" />
        <div className="pointer-events-none absolute -left-40 top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-primary/12 blur-[110px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <Badge variant="outline" className="mono gap-1.5 rounded-full border-primary/30 bg-primary/8 py-1 text-[11px] text-primary" data-testid="hero-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> DEMO PROTOTYPE · SIMULATED AI
            </Badge>
            <h1 className="mt-6 font-heading text-[38px] font-semibold leading-[1.06] sm:text-[52px]" data-testid="hero-headline">
              Turn your GitHub into a portfolio that{" "}
              <span className="relative inline-block text-primary">
                gets noticed.
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/30" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground" data-testid="hero-subtext">
              GitFolio AI analyzes your projects and transforms your code, technologies, and engineering
              experience into a professional portfolio built for recruiters and clients.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/dashboard" className={buttonVariants({ size: "lg" }) + " rounded-full px-7"} data-testid="build-my-portfolio-btn">
                Build My Portfolio <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <a href="#how-it-works" className={buttonVariants({ variant: "outline", size: "lg" }) + " rounded-full px-7"} data-testid="see-how-it-works-btn">
                See How It Works
              </a>
            </div>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["10,000+", "projects analyzed"],
                ["Built for", "developers"],
                ["Ready in", "minutes"],
              ].map(([big, small]) => (
                <div key={small}>
                  <dt className="font-heading text-[20px] font-semibold">{big}</dt>
                  <dd className="text-[13px] text-muted-foreground">{small}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12px] text-muted-foreground/70">Illustrative demo statistics.</p>
          </div>

          {/* Hero visual: repo → AI → portfolio */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-primary/6 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-[var(--ink)] shadow-2xl" data-testid="hero-visual">
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <span className="mono ml-2 text-[11px] text-slate-500">gitfolio · pipeline</span>
              </div>
              <div className="space-y-4 p-6">
                {PIPELINE.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * i, duration: 0.5 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-slate-100">{step.label}</span>
                      <Check className={`h-4 w-4 ${step.tone}`} />
                    </div>
                    <p className={`mono mt-1 text-[12px] ${step.tone}`}>{step.meta}</p>
                    {i < PIPELINE.length - 1 && (
                      <div className="mx-auto mt-4 h-5 w-px bg-gradient-to-b from-white/25 to-transparent" />
                    )}
                  </motion.div>
                ))}
                <div className="mono rounded-xl bg-black/40 p-4 text-[12px] leading-relaxed">
                  <span className="text-[#C084FC]">insight</span>
                  <span className="text-slate-500">.complexity = </span>
                  <span className="text-[#4ADE80]">"Advanced"</span>
                  <br />
                  <span className="text-[#C084FC]">insight</span>
                  <span className="text-slate-500">.roles = [</span>
                  <span className="text-[#4ADE80]">"Android Engineer"</span>
                  <span className="text-slate-500">]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <div className="max-w-xl">
            <p className="mono text-[12px] uppercase tracking-[0.16em] text-primary">How it works</p>
            <h2 className="mt-3 font-heading text-[30px] font-semibold leading-tight sm:text-[36px]">
              Four steps from repository to hireable story.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="group bg-card p-7 transition-colors duration-200 hover:bg-accent" data-testid={`how-step-${s.n}`}>
                <span className="mono text-[13px] font-semibold text-primary">{s.n}</span>
                <h3 className="mt-4 font-heading text-[17px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="mono text-[12px] uppercase tracking-[0.16em] text-primary">Features</p>
              <h2 className="mt-3 font-heading text-[30px] font-semibold leading-tight sm:text-[36px]">
                Everything a recruiter needs to say yes.
              </h2>
            </div>
            <Link to="/dashboard" className={buttonVariants({ variant: "outline" }) + " rounded-full"} data-testid="features-cta-btn">
              Try the demo <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`card-hover rounded-2xl border border-border bg-card p-7 ${f.span ?? ""}`}
                data-testid={`feature-card-${f.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-[17px] font-semibold">{f.title}</h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-30" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-left lg:py-32">
          <h2 className="font-heading text-[32px] font-semibold leading-tight sm:text-[42px]" data-testid="final-cta-headline">
            Your best work is already on GitHub.
            <br />
            <span className="text-primary">Let AI tell its story.</span>
          </h2>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/dashboard" className={buttonVariants({ size: "lg" }) + " rounded-full px-7"} data-testid="final-cta-btn">
              <Github className="mr-2 h-4 w-4" /> Build My Portfolio
            </Link>
            <Link to="/job-match" className={buttonVariants({ variant: "outline", size: "lg" }) + " rounded-full px-7"} data-testid="final-cta-job-match-btn">
              Try Job Match
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[13px] text-muted-foreground">
          <Logo />
          <p>GitFolio AI — contest prototype. Repository data and AI output are simulated.</p>
        </div>
      </footer>
    </div>
  );
}
