# Gitoco — living spec

Contest prototype. "Turn your GitHub into a professional developer portfolio."

## Stack / architecture
- Frontend-only product logic (user choice): all repo + AI data is **mocked** in `frontend/src/lib/mock.ts`.
- App state persists to `localStorage` key `gitfolio.state.v1` via `frontend/src/lib/store.tsx` (`AppStateProvider` / `useApp`).
- Theme: `frontend/src/lib/theme.ts`, `localStorage` key `gitfolio.theme` (internal key, unchanged), default **light** for a new visitor; OS preference is deliberately ignored; a stored choice always wins. Toggles `.dark` on `<html>`.
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
| `/portfolio` | Generate + preview portfolio, 3 switchable templates, Export PDF, Publish |
| `/portfolio/:handle` | **Public** standalone portfolio page (no dashboard chrome) |
| `/job-match` | Paste job description → simulated match score |
| `/settings` | Profile, default template, theme, GitHub status, reset demo |

## State model (`AppState`)
`connected`, `analyzedIds: string[]`, `template: minimal|professional|modern`, `portfolioGenerated`, `published`, `jobMatch`, `jobDescription`, `headline`.

Derived stats: analysed count, portfolio completion % (connected 20 + 15/project capped 45 + generated 25 + jobMatch 10), technologies detected, job score.

## Mock data
Developer: I Putu Andika Putra (@andikaputraputu), andikaputraputu@gitoco.com. Repos: `oboeru`, `ananka`, `newsstream` (recommended) + `kanjiflow`, `warungapi`, `dotfiles`. Each has a matching `Insight` (overview, techStack, architecture, features, strengths, complexity, roles, resumeBullets, scores).

## Key flow (demo happy path)
Landing → Get Started → Dashboard (empty) → Connect GitHub modal → Authorise → `/repositories` (3 recommended pre-checked) → Analyze Selected Projects → `/analyzing` → `/insights/oboeru` → Generate My Portfolio → `/portfolio` (Generate → template switching → Export PDF → Publish Portfolio → `/portfolio/andikaputraputu`) → `/job-match` (Use sample role → Analyze).

## Extension points
- `analyzeJobMatch()` and `getInsight()` in `mock.ts` are the seams to replace with real OpenAI calls.
- `ConnectGitHubModal` is the seam for real GitHub OAuth.
- `buildPortfolio()` in `frontend/src/lib/portfolio.ts` is the single seam for real portfolio data — the preview and the PDF both read its output, so swapping the source updates both at once.

## Portfolio + PDF architecture (single source of truth)
`frontend/src/lib/portfolio.ts` owns the portfolio document and the template system:
- `buildPortfolio(repos, template)` -> `PortfolioData`: name, title, summary, location, email, handle, githubUrl, portfolioUrl, skills, projects[{name, title, blurb, tech, features, highlights, githubUrl}].
- `TEMPLATES` — per-template `labels` (section captions + GitHub link text) and `tokens` (page/surface/ink/body/muted/faint/rule/accent/pill colours, `serif`, `header`, `skillStyle`, `numbered`, `showFeatures`, `projectHeading`, `dark`).
- Shared helpers: `heroLine()` (Modern's merged title+summary line) and `projectHeading()` (Minimal/Modern show the short repo name, Professional the full insight title).
- `SECTION_ORDER` = summary -> skills -> work -> contact.

`components/PortfolioDocumentView.tsx` renders the document (the three template components) and is shared verbatim by the dashboard preview and the public page, so the published page is the same markup the user reviewed.

Two renderers consume the data:
1. **Live preview** (`pages/PortfolioPreview.tsx`) — no hardcoded portfolio copy, labels or colours; token values are applied as inline styles so the portfolio keeps its own palette regardless of the app's light/dark theme.
2. **PDF export** (`lib/pdf.ts`) — print mechanics only (A4 210x297mm, 20mm margins, wrapping, page breaks, `fitText()` margin guard). It reproduces the selected template's identity: Minimal = white page/serif/editorial rules, Professional = white header band + white rounded cards + pill chips + KEY FEATURES list, Modern = dark page + accent label + numbered dark panels. The template shown in the preview is the template exported.

Print-only adaptations (deliberate): fixed A4 instead of responsive widths, single-column bullet reflow, page breaks that keep each project block whole (6mm seam guard), and a footer with name + portfolio URL + `n / total` on every page. Nothing appears in the PDF that isn't in the preview.

### Avatar in the Professional PDF
`lib/image.ts` → `loadRoundedImage(url)` draws the remote avatar into a canvas with a rounded-square clip and cover-crop (matching the preview's `rounded-2xl object-cover`) and returns a PNG data URL. `ExportPdfDialog` awaits it during the "Preparing portfolio" step and passes it to `generatePortfolioPdf(data, { avatar })`, because jsPDF draws synchronously and cannot fetch. The photo is embedded only when the template's header style is `band` (Professional) — Minimal and Modern previews show no photo, so their PDFs contain no image object. If the image fails (CORS, offline, 4s timeout) it resolves to null and the header simply reflows to the left margin; the export still succeeds.

## PDF export UI
`frontend/src/components/ExportPdfDialog.tsx`: "Export PDF" button on `/portfolio` -> 4-step progress (Preparing portfolio -> Formatting document -> Generating PDF -> PDF ready) -> success "Your portfolio PDF is ready." with **Download PDF** and **Preview PDF** (opens a new tab, falls back to download). Library: `jspdf` — real vector PDF, selectable text, clickable links, never a screenshot.


## Public portfolio URL (simulated)
- "Publish Portfolio" on `/portfolio` opens `components/PublishDialog.tsx`: 3-step animation (Preparing portfolio -> Creating public page -> Publishing portfolio) -> success "Your portfolio is live!" showing `gitoco.com/<handle>` with **Open Portfolio** (navigates to `/portfolio/<handle>`) and **Copy Link** (writes `https://gitoco.com/<handle>` to the clipboard).
- Publishing sets `published: true` in local state; the preview then shows a persistent "Live at ..." banner with a View public page link and the button becomes "Republish". `Settings -> Reset demo data` clears it.
- `pages/PublicPortfolio.tsx` (`/portfolio/:handle`) renders `PortfolioDocumentView` with no dashboard chrome — no sidebar, topbar, template selector or export/publish controls — plus a subtle footer with the portfolio URL and "Built with Gitoco". It uses the same state and selected template as the preview, and is responsive (verified: no horizontal overflow at 390px).
- If nothing is generated in the session, or the handle doesn't match, it shows an "isn't published" state with a link back to the dashboard. The public URL is simulated: no persistence, no hosting, no backend — it is served from the local session only.
- Naming deviation from the brief: the brief said `devfolio.ai/andika` and "Built with Devfolio AI", but the app is branded **Gitoco**, so the URL is `gitoco.com/andikaputraputu` (the developer's real handle) and the footer reads "Built with Gitoco".


## Branding & demo identity
- Product name is **Gitoco** everywhere in user-facing text (landing, logo, nav, dashboard, sidebar, dialogs, empty/loading/success states, public page footer, document title + meta description, PDF `creator` metadata). GitHub is untouched — it remains the external platform being analysed.
- Demo identity: **I Putu Andika Putra**, `@andikaputraputu`, `andikaputraputu@gitoco.com`, repos under `github.com/andikaputraputu/...`, public URL `gitoco.com/andikaputraputu` (served at `/portfolio/andikaputraputu`). The dashboard greeting uses the short `DEVELOPER.name` ("Andika").
- Internal `localStorage` keys (`gitfolio.state.v1`, `gitfolio.theme`) were intentionally left alone — they are not user-facing and renaming them would discard existing sessions.
- **Header GitHub identity is gated on `state.connected`.** Before connecting, the top-right shows a neutral dashed placeholder avatar (`user-profile-placeholder`) with "Not connected" — no name, no handle, no photo. After the simulated connect it swaps to the mock GitHub identity: avatar + "I Putu Andika Putra" + "@andikaputraputu" (`header-avatar`, `header-profile-name`, `header-profile-handle`), updating immediately with no refresh. The state is persisted in `localStorage`, so it survives navigation and reloads across the whole flow; `Settings -> Reset demo data` returns the header to the placeholder. There is no separate "Disconnect GitHub" action.
- Header notifications and the profile/avatar are **intentionally inactive** in this prototype: rendered as non-interactive `<span>`s with `aria-disabled`, `cursor-not-allowed`, a tooltip and reduced opacity. No dropdown, no route change, no console warning. The notification dot remains as a visual demo element. Avatar + demo name stay visible.

## Credentials
None — no login gate anywhere.
