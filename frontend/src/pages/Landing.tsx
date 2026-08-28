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
import { toast } from "sonner";
import { Github } from "@/components/GithubIcon";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { n: "01", title: "Connect GitHub", body: "Link your account and we pull in your public repositories with their metadata." },
  { n: "02", title: "Select your best projects", body: "Pick the work you actually want recruiters and clients to read about." },
  { n: "03", title: "Let AI understand your work", body: "We detect technologies, architecture patterns, features and engineering practices." },
  { n: "04", title: "Generate your portfolio", body: "Publish a professional portfolio that showcases your projects, engineering strengths, and evidence — ready for recruiters and clients." },
];

const FEATURES = [
  { icon: ScanSearch, title: "AI Project Analysis", body: "Every repository is read for purpose, structure and depth — not just a README summary.", span: "lg:col-span-2" },
  { icon: Layers, title: "Automatic Tech Stack Detection", body: "Languages, frameworks and libraries surfaced as clean, recruiter-readable badges." },
  { icon: BrainCircuit, title: "Engineering Evidence", body: "Go beyond skill lists. Gitoco connects engineering insights to evidence found in a developer's project structure and implementation." },
  { icon: Sparkles, title: "Portfolio Generation", body: "A real portfolio site with three switchable templates, generated from your projects.", span: "lg:col-span-2" },
  { icon: FileText, title: "Clearer Hiring Context", body: "Help recruiters and hiring teams understand what a developer has actually built without digging through repositories manually." },
  { icon: Target, title: "Job Matching", body: "Paste a job description and see your match score, strengths and gaps." },
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

const PIPELINE = [
  { label: "GitHub Repository", meta: "andikaputraputu/oboeru", tone: "text-muted-foreground" },
  { label: "AI Analysis", meta: "Clean Architecture · MVVM · Room", tone: "text-primary" },
  { label: "Professional Portfolio", meta: "Published · Advanced complexity", tone: "text-[var(--success)]" },
];

const sec =
  " cursor-pointer rounded-full border border-foreground/25! bg-background text-foreground hover:border-foreground/45! hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/20! dark:bg-transparent dark:hover:border-white/35! dark:hover:bg-white/10";

export default function Landing(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-[14px] text-muted-foreground md:flex">
            <a href="#product" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-product">Product</a>
            <a href="#how-it-works" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-how-it-works">How It Works</a>
            <a href="#features" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-features">Features</a>
            <a href="#pricing" className="transition-colors duration-200 hover:text-foreground" data-testid="nav-link-pricing">Pricing</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle testId="theme-toggle-landing" />
            <Link to="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" }) + " cursor-pointer rounded-full border border-foreground/20! text-foreground hover:border-foreground/40! hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15! dark:hover:border-white/30! dark:hover:bg-white/10"} data-testid="sign-in-btn">
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
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> CONTEST DEMO · SIMULATED AI
            </Badge>
            <h1 className="mt-6 font-heading text-[38px] font-semibold leading-[1.06] sm:text-[52px]" data-testid="hero-headline">
              Turn your GitHub into a portfolio that{" "}
              <span className="relative inline-block text-primary">
                gets noticed.
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/30" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground" data-testid="hero-subtext">
              Gitoco analyzes your projects, engineering decisions, and technical evidence to build a
              professional portfolio that helps you showcase your work — and gives hiring teams
              clearer context to understand it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/dashboard" className={buttonVariants({ size: "lg" }) + " rounded-full px-7"} data-testid="build-my-portfolio-btn">
                Build My Portfolio <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <a href="#how-it-works" className={buttonVariants({ variant: "outline", size: "lg" }) + " px-7" + sec} data-testid="see-how-it-works-btn">
                See How It Works
              </a>
            </div>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["AI-powered", "projects analyzed"],
                ["Developer-first.", "Hiring-ready."],
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
                <span className="mono ml-2 text-[11px] text-slate-500">gitoco · pipeline</span>
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
                Don't just list your skills. Show the work behind them.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Gitoco surfaces engineering evidence from your projects, helping developers build more
                credible portfolios and giving hiring teams clearer context.
              </p>
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


      {/* PRICING */}
      <section id="pricing" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="mono text-[12px] uppercase tracking-[0.16em] text-primary">Pricing</p>
            <h2 className="mt-3 font-heading text-[30px] font-semibold leading-tight sm:text-[36px]" data-testid="pricing-headline">
              Simple pricing for developers today, built to scale with teams tomorrow.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Start free, build your portfolio, and upgrade when you need more projects, deeper
              insights, and professional sharing tools.
            </p>
          </div>

          <div className="mt-14 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 ${
                  plan.featured ? "border-primary/45 ring-1 ring-primary/15" : "border-border"
                }`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.featured && (
                  <Badge
                    variant="outline"
                    className="mono absolute right-6 top-6 rounded-full border-primary/30 bg-primary/8 text-[10px] uppercase tracking-[0.14em] text-primary"
                    data-testid="pricing-popular-badge"
                  >
                    Most popular
                  </Badge>
                )}
                <h3 className="font-heading text-[18px] font-semibold" data-testid={`pricing-name-${plan.id}`}>
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-heading text-[30px] font-semibold" data-testid={`pricing-price-${plan.id}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[13px] text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{plan.subtitle}</p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pb-1 pt-6" data-testid={`pricing-features-${plan.id}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 md:mt-auto md:pt-7">
                  {plan.id === "free" ? (
                    <Link
                      to="/dashboard"
                      className={buttonVariants({ size: "lg" }) + " w-full rounded-full"}
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
                            : "Teams is coming soon.",
                        )
                      }
                      className={
                        buttonVariants({ variant: plan.id === "pro" ? "default" : "outline", size: "lg" }) +
                        " w-full" +
                        (plan.id === "pro" ? " rounded-full" : sec)
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

          <p className="mt-6 text-[12px] text-muted-foreground/70">
            Contest demo — payments and Teams access are not enabled.
          </p>
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
            <Link to="/job-match" className={buttonVariants({ variant: "outline", size: "lg" }) + " px-7" + sec} data-testid="final-cta-job-match-btn">
              Try Job Match
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[13px] text-muted-foreground">
          <Logo />
          <p>Gitoco — Contest Demo · GitHub repository data and AI insights are simulated.</p>
        </div>
      </footer>
    </div>
  );
}
