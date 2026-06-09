# HANDOFF — the Kineena Kang Gallery (neenasgallery)

**For:** Whichever Claude Code session opens this repo next.
**Last updated:** 2026-06-06 by the prior Claude session that built Phases 1 + 2.
**Read this first.** Then check the spec at `specs/kineena-kang-gallery/spec.md` for full detail.

---

## Where you are

You're in the project root of **the Kineena Kang Gallery** — a portfolio + Paint N Sip events site for artist Kineena Kang. The site is being built in 5 phases, defined in `specs/kineena-kang-gallery/spec.md`. **Phases 1 and 2 are complete.** Phase 3 is the next thing to build.

```
~/Desktop/Builds/neenasgallery/
├── HANDOFF.md                   ← you are here
├── specs/kineena-kang-gallery/
│   ├── spec.md                  ← the source of truth — 5 phases, Phase 1+2 checkboxes marked
│   └── logs/                    ← phase-1/, phase-2/ implementation + review-fix logs
├── src/
│   ├── app/                     ← layout.tsx, page.tsx (homepage built), globals.css
│   ├── components/
│   │   ├── site/                ← Nav, Footer, ContactSheet
│   │   ├── ui/                  ← reveal, webgl-canvas, canvas-inner, button, sheet, dialog, accordion
│   │   └── home/                ← Hero, ArtistIntro, FeaturedWorks, EventsTeaser, ClosingCta
│   ├── content/
│   │   ├── site.ts              ← brand constants
│   │   ├── works.ts             ← 43 typed painting entries — easy-add system
│   │   └── events.ts            ← typed Event schema + empty array — Phase 4 fills it
│   └── lib/utils.ts             ← cn() helper
├── public/
│   ├── art/                     ← 43 painting JPEGs + README (sacred — do not modify)
│   └── brand/kk-logo-banner.jpg ← actual KK brand banner (sacred)
├── CONTRIBUTING.md              ← easy-add docs (drop JPEG + 1 line in works.ts)
└── (next.config.ts, tsconfig.json, postcss.config.mjs, components.json, etc.)
```

Git: remote = `https://github.com/Harsha-Jagadish/neenasgallery.git`. Working tree has uncommitted changes from Phases 1+2 — **the user handles git, do not commit/push.**

---

## How to continue

Run the next phase via the implement skill:

```
/implement specs/kineena-kang-gallery/spec.md --phase 3
```

Phase 3 = the brand-defining phase: WebGL portfolio gallery at `/portfolio` with hover-distortion shaders + scroll-velocity warp, plus painting detail at `/portfolio/[slug]`. **Read `~/.claude/skills/threejs-art-portfolio/SKILL.md` first** — that skill is the canonical guide for this phase (file structure, shader patterns, performance budgets, accessibility rules).

After Phase 3: `/implement --phase 4` (Paint N Sip events), then `--phase 5` (about + contact + polish + Vercel deploy).

---

## What's been built (Phases 1 + 2)

### Phase 1 — Scaffold, Design System, Site Shell

- Next.js 16.2.7 + React 19.2 + Tailwind v4 (CSS-first) + shadcn (Base UI primitives)
- Three.js stack installed: `three`, `@react-three/fiber`, `@react-three/drei`, `lenis`
- Also: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`
- Palette tokens in `src/app/globals.css` `@theme`:
  - `--color-shell #faf7f1` (page background, warm off-white)
  - `--color-cream #f1ebde` (alternating section bg)
  - `--color-ink #1c1f24` (body text + headlines)
  - `--color-mint #cef0ef` (KK brand mint — sampled from actual logo banner)
  - `--color-mist #d8d3c8` (warm grey dividers/borders)
  - `--color-rust #a8553a` (warm rust accent — sparing use; **renamed from `--color-accent` in fix round 1 to escape shadcn's semantic remap**)
  - Tailwind utilities work directly: `bg-shell`, `text-ink`, `border-mist`, `text-rust`, etc.
- Fonts: **Cormorant Garamond** (display, weights 300-700) + **Inter** (body) via `next/font/google`. Apply `font-display` class for serif headlines; default body is Inter.
- `<Nav>` (`src/components/site/Nav.tsx`) — fixed top, transparent over hero, switches to `bg-shell/90 backdrop-blur` past 60vh, mobile hamburger via shadcn `Sheet`
- `<Footer>` (`src/components/site/Footer.tsx`) — server-rendered, 4-col on md+ (brand / Explore / Connect / Say-hello), auto-year
- `<Reveal delay={n}>` — Framer Motion scroll-reveal, opacity 0→1 + y 16→0, 600ms, easing `[0.22, 1, 0.36, 1]`, **reduced-motion no-op** (returns plain div with same className)
- `<WebGLCanvas>` — `'use client'` wrapper that dynamic-imports R3F's `<Canvas>` (`next/dynamic({ ssr: false })`), detects `prefers-reduced-motion` AND `WebGLRenderingContext` availability, renders `fallback` prop if either fails. Used in Phase 3.
- `<ContactSheet>` — shadcn `Sheet` (right-side) with form (name/email/phone/subject/message/optional date), light client validation, **NO real fetch** (Phase 6 — out of this spec — will wire Resend). Auto-closes 2.5s after submit. **Uses Base UI `SheetTrigger render={trigger}` pattern**, NOT cloneElement (Phase 1 fix round 1 corrected an a11y regression — the trigger now properly emits `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`).
- shadcn `Button` customized: `default` = `bg-ink text-shell`, `ghost` = transparent + underline-on-hover, **all variants square-cornered** (`rounded-none`). Sizes: `sm` (h-8), `default` (h-9), `lg` (h-11), `icon`.

### Phase 2 — Homepage

The homepage at `/` composes (in order):

1. **`<Hero>`** — full-viewport, mint top band (`h-1.5 bg-mint`), low-opacity KK monogram watermark, Cormorant headline *"Original paintings & Paint N Sip evenings on Vancouver Island."*, Inter sub-body, two CTAs (`View the work` → `/portfolio` + `Upcoming events →` → `/events`)
2. **`<ArtistIntro>`** — Cormorant italic pull-quote on cream
3. **`<FeaturedWorks>`** — 4-up grid pulling `featuredWorks.slice(0,4)` from `src/content/works.ts` (currently: Mountain Stream, Rose on Newsprint, Sunset Pier, Ocean in Her Hair). Each card links to `/portfolio` (will become `/portfolio/[slug]` after Phase 3)
4. **`<EventsTeaser>`** — empty-state "coming soon" card + ContactSheet "Notify me" trigger. **Real grid path is already wired** for when `events.ts` gains real entries in Phase 4 — switches automatically (horizontal scroll mobile / 3-up grid desktop)
5. **`<ClosingCta>`** — Cormorant headline + ContactSheet trigger
6. **`<Footer>`** (from layout)

Each below-hero section is wrapped in `<Reveal>`. Hero is not (above the fold).

Page metadata in `src/app/layout.tsx`: title template `"%s — Kineena Kang"`, artist-statement description, `openGraph.images` points at the first featured painting's JPEG.

---

## Pre-staged content — DO NOT OVERWRITE

These files were placed in the repo before Phase 1 ran. Every implementer prompt explicitly warns against touching them. **Verify intact** at the start of any agent run:

```bash
ls /Users/harsha/Desktop/Builds/neenasgallery/public/art/*.jpg | wc -l   # → 43
head -5 /Users/harsha/Desktop/Builds/neenasgallery/src/content/works.ts  # → catalog file
ls /Users/harsha/Desktop/Builds/neenasgallery/public/brand/kk-logo-banner.jpg
```

**`src/content/works.ts`** is the painting catalog — 43 entries, each `{ file, title, medium?, year?, orientation?, category?, featured?, description? }`. Helpers: `featuredWorks` (filters `featured: true`), `worksByCategory(cat)`, `worksByMedium(m)`, `mediums`, `categories`. The top of the file documents the easy-add workflow (drop JPEG into `public/art/`, add one entry).

Some painting titles are placeholders like `"Untitled, p7 #1"` — that's Kineena's eventual edit, **do not invent better titles in code**. Render `title ?? "Untitled"`.

**`src/content/events.ts`** is a stub — full schema + empty array + `upcomingEvents()` helper. Phase 4 will fill it with 3 seed Paint N Sip events.

---

## The artist (for tone-of-voice)

**Kineena Kang** — born Calgary, Alberta 2002 (24 in 2026), University of British Columbia alum. Mediums: acrylic primary, watercolor, pencil, charcoal, ink, mixed media, calligraphy. Mostly landscape paintings. **Artist Statement** and **Autobiography** (verbatim from PDF pages 19-20) are in `~/.claude/projects/-Users-harsha-Desktop-Builds/memory/project_neenasgallery.md` — Phase 5 puts them on `/about` unchanged.

Voice: editorial, restrained, gallery-catalog. Avoid SaaS / marketing copy. **No invented bio facts** (founder years, awards, etc.) beyond what's in the PDF.

---

## The sibling project — PCO (read for proven patterns)

**Private Charters Oahu** at `~/Desktop/Builds/pco/privatechartersoahu/` is a complete, shipped sibling site that uses the EXACT same stack (Next.js 16 + Tailwind v4 + shadcn Base UI + ContactSheet drawer pattern). When in doubt about a pattern, open the corresponding PCO file:

- `src/components/site/Nav.tsx` — scroll-aware nav, mobile Sheet
- `src/components/site/Footer.tsx` — server-component pattern, auto-year
- `src/components/site/ContactSheet.tsx` — Sheet drawer + form + confirmation, controlled state, **`SheetTrigger render={trigger}` Base UI pattern**
- `src/components/ui/reveal.tsx` — framer-motion + reduced-motion
- `src/components/ui/button.tsx` — Base UI button + cva variants
- `src/app/globals.css` — `@theme` palette + `@theme inline` shadcn semantic remap

**Do not copy PCO's copy/content** — different brand. Only structural patterns.

PCO is also on GitHub: `https://github.com/Harsha-Jagadish/privatechartersoahu`. Initial commit + push complete; Vercel deploy pending (user will do).

---

## Agents and skills installed

### Specialized agents at `~/.claude/agents/`

The PRIOR session created these — **they're now registered (your fresh session will see them)**:

- **`frontend-expert`** — React/Next.js/TS/Tailwind/shadcn. Use this for the homepage/portfolio/events implementer rounds. (Replaces falling back to `general-purpose`.)
- **`code-reviewer`** — diff-vs-AC reviewer. Use during review-fix loops.
- **`quality-gate-tester`** — runs lint/build/typecheck/tests. Used by the loop.
- **`fastapi-architect`** — Python/FastAPI work (not needed for KKG, but installed).

Plus the pre-existing `ai-dev-review-analyst` and `skill-reviewer`.

When `/implement` spawns its implementer, it should now auto-route TS/TSX files to `frontend-expert` instead of `general-purpose`. If for some reason it doesn't (mismatch in agent-selection.md), force it via the agent_type in the Agent call.

### Skills at `~/.claude/skills/`

The prior session added **`threejs-art-portfolio`** — covers vanilla Three.js + R3F + drei patterns, GLSL shader templates (image distortion, RGB split, scroll-velocity warp, gooey hover), Lenis integration, performance budgets, reduced-motion + no-WebGL fallback discipline, and a decision checklist. **Read this skill before Phase 3.** The Phase 3 spec section references it explicitly.

Other relevant skills already installed: `frontend-design`, `bencium-innovative-ux-designer`, `ui-ux-pro-max`, `shadcn-ui`, `21st-dev-builder-v2`, `react-best-practices`, `composition-patterns`, `web-design-guidelines`, `accesslint-audit`.

---

## Memory files

The prior session saved project memos at `~/.claude/projects/-Users-harsha-Desktop-Builds/memory/`:

- `project_neenasgallery.md` — full artist profile, verbatim artist statement, decisions made
- `project_pco.md` — the sibling project's context

You should read these on session start (they're auto-loaded via the auto-memory system).

---

## Known issues from the prior session

1. **macOS TCC cwd glitch on Node.** During Phase 2, the parent process lost permission to read its cwd (`EPERM uv_cwd` from Node), which broke `npm run dev` from inside Claude. Foreground `npm run build` worked at first, then broke too. **Solution:** restarting Claude from `~/Desktop/Builds/neenasgallery/` directly (or any path the process has access to) fixes it. **If you see EPERM uv_cwd, that's the issue** — tell the user to restart.

2. **Dev server port collisions.** PCO's last session left a dev server on port 3000 + tried 3456 + 3789. Use a fresh port (e.g., 4000) or kill stale processes: `lsof -ti :3000 :3456 :3789 | xargs -r kill -9`.

3. **First `npm run build` of any phase sometimes fails on Google Fonts fetch** (transient network). Retry once before treating as real.

---

## Quick reference — design conventions (mirror these or break them with intent)

| Layer | Rule |
|---|---|
| Palette | 6 tokens only (shell/cream/ink/mint/mist/rust). Never `text-gray-*` or Tailwind defaults. |
| Section rhythm | Alternate `bg-shell` / `bg-cream`. Padding `py-24 md:py-32 lg:py-40`. |
| Container | `max-w-[1200px] mx-auto px-6 md:px-10`. |
| Headlines | `font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]` |
| Eyebrows | `text-xs tracking-[0.2em] uppercase text-ink/55` |
| Body | `text-base md:text-lg leading-[1.7] text-ink/80` |
| Buttons | `<Button render={<Link href="..." />}>Label</Button>` (Base UI render prop) |
| ContactSheet trigger | `<ContactSheet trigger={<Button>Inquire</Button>} defaultSubject="..." defaultMessage="..." />` |
| Server vs Client | Server by default. `'use client'` only for hooks/state/browser APIs. |
| Images | `next/image` everywhere, explicit width/height or fill+sized parent, sizes attr, priority on LCP |
| Motion | Wrap below-fold sections in `<Reveal delay={i*0.08}>`. Respect reduced-motion. |
| Yacht/Hawaii/MANA refs | **None — that's PCO. Different brand.** |

---

## Quick reference — Phase 3 brief

(Full detail in `specs/kineena-kang-gallery/spec.md` Phase 3 section.)

- Route: `/portfolio` (server component reads searchParams, passes to client `<PortfolioPage>`)
- Detail route: `/portfolio/[slug]` (server, awaits params, calls `notFound()` if no match)
- Architecture: `<PortfolioPage>` (client, top-level) → `<WebGLCanvas fallback={<FallbackGrid/>}>` → `<Gallery3D>` (R3F Canvas + Lenis-driven ImagePlanes)
- Shader: hover distortion (radial noise at mouse), scroll-velocity UV stretch, optional RGB chromatic split
- **Fallback is mandatory**: reduced-motion + no-WebGL get a static `next/image` grid with identical filtering + click-to-detail
- Filter chips: medium + category (from `works.ts` helpers), URL-persisted via searchParams
- Lazy-load the Canvas (dynamic import), crossfade HTML grid → Canvas over 400ms
- DOM focus layer: each painting has a focusable sibling (`<a>` or drei's `<Html>`) for keyboard nav
- Image budget: ≤500KB per painting (some pre-staged JPEGs may need a one-time `sips` compress)

**Read `~/.claude/skills/threejs-art-portfolio/SKILL.md`** before spawning the Phase 3 implementer. The Phase 3 spec section's "Implementation Details" leans on it heavily.

---

## TL;DR

1. Read this file (done).
2. Read `specs/kineena-kang-gallery/spec.md` (skim, focus on Phase 3).
3. Read `~/.claude/skills/threejs-art-portfolio/SKILL.md`.
4. Run `/implement specs/kineena-kang-gallery/spec.md --phase 3`.
5. After Phase 3 converges: Phase 4 (events), Phase 5 (about/contact/deploy).
6. Throughout: pre-staged files sacred, no git, server-by-default, palette discipline, no PCO content.
