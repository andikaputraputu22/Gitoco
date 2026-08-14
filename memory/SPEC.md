# GitFolio AI — living spec

Contest prototype. "Turn your GitHub into a professional developer portfolio."

## Stack / architecture
- Frontend-only product logic (user choice): all repo + AI data is **mocked** in `frontend/src/lib/mock.ts`.
- App state persists to `localStorage` key `gitfolio.state.v1` via `frontend/src/lib/store.tsx` (`AppStateProvider` / `useApp`).
- Theme: `frontend/src/lib/theme.ts`, `localStorage` key `gitfolio.theme`, default **dark**; toggles `.dark` on `<html>`.
- Backend is the untouched template skeleton (`/api/`, `/api/status`). No app endpoints — nothing in the UI calls the API.
- No auth. "Sign In" / "Get Started" go straight to `/dashboard`.

## Routes
| Path | Page |
|---|---|
| `/` | Landing (hero, how it works, features, final CTA) |
| `/dashboard` | Overview: stats, connect banner/empty state, featured projects, quick actions |
| `/repositories` | Multi-select repo picker → "Analyze Selected Projects" |
| `/analyzing` | Simulated 6-step AI analysis, then redirects to `/insights/<first id>` |
| `/insights/:id` | AI project insight report |
| `/projects` | My Projects list of analysed repos |
| `/portfolio` | Generate + preview portfolio, 3 switchable templates |
| `/job-match` | Paste job description → simulated match score |
| `/settings` | Profile, default template, theme, GitHub status, reset demo |

## State model (`AppState`)
`connected`, `analyzedIds: string[]`, `template: minimal|professional|modern`, `portfolioGenerated`, `jobMatch`, `jobDescription`, `headline`.

Derived stats: analysed count, portfolio completion % (connected 20 + 15/project capped 45 + generated 25 + jobMatch 10), technologies detected, job score.

## Mock data
Developer: Andika Pratama (@andikadev). Repos: `oboeru`, `ananka`, `newsstream` (recommended) + `kanjiflow`, `warungapi`, `dotfiles`. Each has a matching `Insight` (overview, techStack, architecture, features, strengths, complexity, roles, resumeBullets, scores).

## Key flow (demo happy path)
Landing → Get Started → Dashboard (empty) → Connect GitHub modal → Authorise → `/repositories` (3 recommended pre-checked) → Analyze Selected Projects → `/analyzing` → `/insights/oboeru` → Generate My Portfolio → `/portfolio` (Generate → template switching) → `/job-match` (Use sample role → Analyze).

## Extension points
- `analyzeJobMatch()` and `getInsight()` in `mock.ts` are the seams to replace with real OpenAI calls.
- `ConnectGitHubModal` is the seam for real GitHub OAuth.
- `generatePortfolioPdf(data: PortfolioDocument)` in `frontend/src/lib/pdf.ts` is pure — feed it a `PortfolioDocument` built from real API data and nothing in the module changes.

## PDF export (client-side, no backend)
- Library: `jspdf` (added dependency). Real vector PDF with selectable text and clickable links — not a screenshot.
- `frontend/src/lib/pdf.ts`: A4 (210×297mm), 20mm margins, per-template themes — Minimal (Times, editorial rules), Professional (Helvetica, header band + filled project cards), Modern (dark header band, numbered projects). Includes name, title, summary, skills, projects (description, engineering highlights = strengths + architecture, tech stack, GitHub link) and contact.
- Page discipline: each project block is measured and drawn through one code path, so a block that would land on a page seam moves to the next page whole (6mm guard). `fitText()` shrinks single-line strings (header meta, footer) so nothing can cross a margin. Footer with developer name + portfolio URL + `n / total` is stamped on every page.
- `frontend/src/components/ExportPdfDialog.tsx`: "Export PDF" button on `/portfolio` → 4-step progress (Preparing portfolio → Formatting document → Generating PDF → PDF ready) → success state "Your portfolio PDF is ready." with **Download PDF** and **Preview PDF** (new tab, falls back to download).
- The document is built at export time from the currently selected template + previewed projects, so PDF and preview can't drift.


## Credentials
None — no login gate anywhere.
