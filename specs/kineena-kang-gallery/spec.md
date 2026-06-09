# Kineena Kang Gallery (neenasgallery)

## Overview

A portfolio + events site for artist **Kineena Kang** (brand: "the Kineena Kang Gallery", monogram KK). The site presents Kineena's body of work — 43 paintings pre-extracted from her existing PDF portfolio — in an editorial, WebGL-driven gallery, alongside a section for **Paint N Sip** events with quote-request flow. Visitors can browse paintings, read the artist statement, request commissions, or reserve spots at upcoming events.

The build leans into the artist statement's intent — *"art that pulls you back to take a second look or stop and stare for a while"* — through a scroll-driven Three.js gallery with image-distortion shaders on hover and scroll-velocity warp. Where most artist-portfolio sites flatten to thumbnail grids, this site makes the act of scrolling feel like walking through a gallery: planes drift, hovered pieces breathe, and ambient motion respects `prefers-reduced-motion`.

## Goals

- Present every painting in `src/content/works.ts` as a first-class WebGL plane with hover-distortion + scroll-velocity warp, falling back to a static `next/image` grid for reduced-motion and no-WebGL visitors.
- Make adding new paintings trivial: drop a JPEG into `public/art/`, add one entry to `works.ts`, ship. Same pattern for events.
- Funnel every primary CTA (Inquire about a piece, Reserve a Paint N Sip spot, Commission inquiry) into a single `ContactSheet` drawer that emails Kineena (Resend wiring deferred to a later session).
- Preserve Kineena's voice verbatim — the Artist Statement and Autobiography from the PDF go onto `/about` unchanged.
- Hit Lighthouse mobile **Performance ≥ 80** (WebGL portfolios rarely hit 90; document the tradeoff), **Accessibility ≥ 95**, **Best Practices ≥ 95**, **SEO ≥ 95**.
- Use the `threejs-art-portfolio` skill at `~/.claude/skills/threejs-art-portfolio/` during all WebGL phases — its performance budgets, shader patterns, and a11y rules are non-negotiable.

## Non-Goals

- **No e-commerce.** No print sales, no Stripe, no Eventbrite integration. Paintings have "Inquire" CTAs only; Paint N Sip events have "Reserve a spot" CTAs that open the ContactSheet.
- **No CMS.** Content is typed TypeScript constants (`works.ts`, `events.ts`). Sanity / Webflow / Contentful are out of scope.
- **No blog / journal.**
- **No multi-language support.** English only.
- **No real-time event-availability tracking.** "Reserve" is a quote-request, not a calendar booking.
- **No analytics, cookie banner, or sitemap automation** beyond a single `sitemap.ts` / `robots.ts`.
- **No virtual gallery walk** (first-person camera through a 3D room). The `threejs-art-portfolio` skill explicitly cautions against this for performance; we're using the simpler scroll-plane pattern instead.
- **No font swap after Phase 1.** Cormorant Garamond + a body grotesque are locked once the design system ships.
- **No invented painting titles in code.** The pre-extracted works carry filler titles like "Untitled, p7 #1"; Kineena edits real titles into `works.ts` later. The site must handle empty/placeholder titles gracefully.
- **No Resend wiring in this spec.** ContactSheet stores submission state locally and shows a confirmation. Phase 6 (out of this spec, to be picked up later) does the real Resend integration.

---

## Phase 1: Scaffold, Design System, and Site Shell

### Goal

Boot the Next.js 16 project with all dependencies (including Three.js stack), the design system (KK mint accent + cream/ink palette + Cormorant Garamond display), shared primitives (`Reveal`, `WebGLCanvas` lazy wrapper, `ContactSheet`), and the Nav + Footer rendered on every page. By the end of this phase, a stub homepage at `/` renders with the right fonts, palette, and chrome — but no homepage content yet (Phase 2). This phase establishes the foundation the next four phases build on.

### Acceptance Criteria

- [x] `npm install` succeeds. `npm run dev` boots and `/` renders with no console errors, no hydration warnings, no font flash.
- [x] Dependencies installed: `next@^16`, `react@^19`, `tailwindcss@^4`, `@tailwindcss/postcss`, `three`, `@react-three/fiber`, `@react-three/drei`, `lenis`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, shadcn baseline.
- [x] Color tokens in `globals.css` `@theme`: `--color-shell` (warm off-white #faf7f1), `--color-cream` (#f1ebde), `--color-ink` (deep neutral #1c1f24), `--color-mint` (KK brand mint, sampled from the logo banner — implementer used `#cef0ef`), `--color-mist` (warm grey divider #d8d3c8), `--color-rust` (subtle warm rust #a8553a — renamed from `--color-accent` to escape shadcn semantic remap). Usable as `bg-shell text-ink border-mist text-mint text-rust` etc.
- [x] Fonts: **Cormorant Garamond** (display) and **Inter** (body) loaded via `next/font/google` with `display: 'swap'`. Variables `--font-cormorant` and `--font-inter`. `@theme` exposes `--font-display` (Cormorant + serif fallback) and `--font-sans` (Inter + system-ui fallback). Default body = Inter; `font-display` class = Cormorant.
- [x] `<Nav>` (`src/components/site/Nav.tsx`) renders fixed at top: KK monogram + "the Kineena Kang Gallery" wordmark on the left, links right (`Work / Events / About / Contact`) + an `Inquire` button. Transparent over the homepage hero, switches to `bg-shell/90 backdrop-blur` once scrolled past 60vh. Mobile collapses to a hamburger that opens a slide-in shadcn `Sheet`.
- [x] `<Footer>` (`src/components/site/Footer.tsx`) renders at the bottom: wordmark, brief tagline, three columns (Explore links / Connect links / Contact CTA), auto-updating year. No physical address (Kineena's choice).
- [x] `<Reveal>` primitive at `src/components/ui/reveal.tsx` — Framer Motion scroll-reveal (opacity 0→1, y 16→0, 600ms, `[0.22, 1, 0.36, 1]` easing). Accepts `delay` prop. No-ops under `prefers-reduced-motion`.
- [x] `<WebGLCanvas>` primitive at `src/components/ui/webgl-canvas.tsx` — a `'use client'` wrapper that dynamically imports `@react-three/fiber`'s `<Canvas>` only when needed (`next/dynamic({ ssr: false })`), checks `prefers-reduced-motion` and `WebGLRenderingContext` availability, and renders `children` (the WebGL scene) inside `<Suspense>` with a slot for a fallback element. Used in Phase 3 — defined here so it's testable as a unit.
- [x] `<ContactSheet>` (`src/components/site/ContactSheet.tsx`) — shadcn `Sheet` drawer (right-side) with form fields: name, email, phone (optional), subject/event/piece (prefilled via prop), message, optional date. On submit: light client validation, then `setSubmitted(true)` and show a Cormorant confirmation "I'll be in touch soon. — Kineena". Auto-closes after 2.5s. NO real API call yet (Resend is out of this spec). Accepts `trigger` prop (any React element) and optional `defaultSubject` / `defaultMessage`.
- [x] shadcn initialized — `components.json` present, `src/components/ui/button.tsx` + `sheet.tsx` + `dialog.tsx` + `accordion.tsx` scaffolded. Button customized: `default` = `bg-ink text-shell`, `ghost` = `bg-transparent text-ink underline-offset-4 hover:underline`, square corners.
- [x] **Pre-staged files are NOT overwritten**: `public/art/*`, `public/art/README.md`, `public/brand/kk-logo-banner.jpg`, and `src/content/works.ts` are still present and intact after scaffolding.
- [x] `.env.local.example`, `.gitignore`, `README.md`, `CONTRIBUTING.md` exist at the repo root. `CONTRIBUTING.md` documents the easy-add system for paintings and (post-Phase 3) events.

### Files to Create/Modify

- `package.json` — all deps named above *(create)*
- `next.config.ts` — `images.remotePatterns` empty (we host everything locally), `experimental.ppr: false` *(create)*
- `tsconfig.json` — strict, `@/*` → `./src/*` *(create)*
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin *(create)*
- `components.json` — shadcn config: Neutral baseColor, CSS variables, `@/components/ui`, `@/lib/utils` *(create via `shadcn init`)*
- `src/app/layout.tsx` — root layout: Cormorant + Inter font variables, default `metadata` (title/desc/OG), mount `<Nav>` + `<Footer>` *(create)*
- `src/app/globals.css` — Tailwind v4 import, `@theme` palette + font tokens, base styles, `:focus-visible` ring color = mint *(create)*
- `src/app/page.tsx` — stub homepage: single Cormorant heading "the Kineena Kang Gallery" to verify wire-up. Replaced in Phase 2. *(create)*
- `src/components/site/Nav.tsx` *(create)*
- `src/components/site/Footer.tsx` *(create)*
- `src/components/site/ContactSheet.tsx` — defined now, consumed by every CTA from Phase 2 onward *(create)*
- `src/components/ui/reveal.tsx` *(create)*
- `src/components/ui/webgl-canvas.tsx` *(create)*
- `src/components/ui/button.tsx`, `sheet.tsx`, `dialog.tsx`, `accordion.tsx` — shadcn scaffold + variant customization on `button.tsx` *(create via `shadcn add`, modify button.tsx)*
- `src/lib/utils.ts` — `cn` helper *(create)*
- `src/content/site.ts` — brand constants: name, wordmark, tagline, nav items, social links (empty arrays for now), email placeholder *(create)*
- `CONTRIBUTING.md` — easy-add docs for paintings + events *(create)*
- `.env.local.example`, `.gitignore`, `README.md` *(create)*

### Implementation Details

**Scaffold sequence.** From inside the project dir (which already contains `.git/`, `public/`, `src/content/works.ts`):

```bash
npx create-next-app@latest tmp-scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbo
# Merge tmp-scaffold INTO the existing project without overwriting pre-staged files:
rsync -a --ignore-existing tmp-scaffold/ ./
# Then copy the scaffolded src/app/* in (they don't conflict with existing src/content)
cp -n tmp-scaffold/src/app/layout.tsx src/app/ 2>/dev/null
cp -n tmp-scaffold/src/app/globals.css src/app/ 2>/dev/null
cp -n tmp-scaffold/src/app/page.tsx src/app/ 2>/dev/null
rm -rf tmp-scaffold
```

Verify after: `ls public/art/ | wc -l` should still be 43, `cat src/content/works.ts | head -5` should still show the catalog file.

Then `npx shadcn@latest init` (defaults), `npx shadcn@latest add button sheet dialog accordion`.

Then `npm install three @react-three/fiber @react-three/drei lenis framer-motion`.

**Tailwind v4 verification.** Confirm `package.json` has `tailwindcss@^4` + `@tailwindcss/postcss`. If `create-next-app` lands on v3, upgrade via `npx @tailwindcss/upgrade@next`.

**Brand mint hex.** Sample the actual color from `public/brand/kk-logo-banner.jpg` using `sips -g pixelHeight -g pixelWidth public/brand/kk-logo-banner.jpg` to confirm dimensions, then read a pixel from the mint background area. A pale, slightly-cool mint around `#bfe1d5` should be correct. Document the sampled hex in `globals.css` and `CONTRIBUTING.md`.

**Typography wiring** (in `layout.tsx`):
```ts
import { Cormorant_Garamond, Inter } from 'next/font/google'
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap', weight: ['300','400','500','600','700'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
```
Apply `${cormorant.variable} ${inter.variable}` to `<html className>`. In `globals.css`:
```css
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-display: var(--font-cormorant), ui-serif, Georgia, "Times New Roman", serif;
}
body { font-family: var(--font-sans); color: var(--color-ink); background: var(--color-shell); }
```
Tailwind v4 will auto-emit `.font-display` from the `@theme` token — do NOT hand-write the utility class.

**Palette.** Exact tokens:
```css
--color-shell: #faf7f1;
--color-cream: #f1ebde;
--color-ink: #1c1f24;
--color-mint: #bfe1d5;      /* refine after sampling logo banner */
--color-mist: #d8d3c8;
--color-accent: #a8553a;    /* warm rust — for sparing hover/highlight only */
```
No pure black, no pure white, no Tailwind default greys.

**Nav scroll behavior.** `'use client'`. Use Framer Motion `useScroll` + `useMotionValueEvent`. Threshold = `window.innerHeight * 0.6` (mint banner reveal). Seed initial scroll state on mount (use the same `useEffect` pattern from PCO Nav, with `// eslint-disable-next-line react-hooks/set-state-in-effect` + rationale). Hamburger uses shadcn `Sheet` with a `<SheetTitle>` for a11y.

**ContactSheet API.** Same controlled-state + cloneElement pattern as PCO's ContactSheet. The `trigger` prop is any React element (typically a `<Button>`); we clone it to attach `onClick={() => setOpen(true)}` while preserving any pre-existing handler. Accepts `defaultSubject` (e.g. "Inquiry about *Mountain Stream*"), `defaultMessage` (optional prefill), and `eventDetails` (optional — when set, shows a small read-only card at the top of the form summarizing the event). Form fields: name, email, phone, message, optional date. Submit handler: validate → `setSubmitted(true)` → render confirmation. **No fetch.**

**WebGLCanvas primitive.** `'use client'`. Receives `children` (the Three.js scene) and optional `fallback` (rendered when WebGL is unavailable or reduced-motion is preferred):
```tsx
const reduced = useReducedMotion()
const [supported, setSupported] = useState<boolean | null>(null)
useEffect(() => {
  try {
    const c = document.createElement('canvas')
    setSupported(!!(c.getContext('webgl2') || c.getContext('webgl')))
  } catch { setSupported(false) }
}, [])
if (reduced || supported === false) return <>{fallback}</>
if (supported === null) return <>{fallback}</> // render fallback during detection
const Canvas = dynamic(() => import('./canvas-inner').then(m => m.CanvasInner), { ssr: false, loading: () => <>{fallback}</> })
return <Canvas>{children}</Canvas>
```
Where `canvas-inner.tsx` is a tiny `'use client'` module that imports R3F's `<Canvas>` and re-exports it — this isolates the R3F bundle so it lazy-loads. Phase 3 builds on this primitive.

**Reveal primitive.** Same as PCO: `useReducedMotion()` → no-op div; otherwise `motion.div` with `whileInView`, `viewport={{ once: true, margin: '-10%' }}`, `initial={{ opacity: 0, y: 16 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}`.

**Nav links** — `src/content/site.ts`:
```ts
export const site = {
  name: "the Kineena Kang Gallery",
  monogram: "KK",
  tagline: "Original paintings & Paint N Sip events.",
  nav: [
    { href: "/portfolio", label: "Work" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  email: "hello@kineenakang.com", // placeholder, Kineena updates
  social: { instagram: "", linkedin: "" }, // empty for now
} as const
```

**CONTRIBUTING.md** — should have two sections: "Adding a painting" (drop JPEG to `public/art/`, add one entry to `src/content/works.ts`) and "Adding a Paint N Sip event" (same pattern, `public/events/<file>.jpg` + entry in `src/content/events.ts` — `events.ts` doesn't exist yet but the doc establishes the contract for Phase 3).

**Skill usage.** Use the `shadcn-ui` skill for component scaffolding patterns. Use `react-best-practices` for Server vs Client component boundary decisions. The `threejs-art-portfolio` skill defines `<WebGLCanvas>`'s lazy-load + fallback discipline — follow it.

### Tests

Scaffold/presentation phase — no logic to unit-test. Verified by acceptance criteria + manual:
- `npm run dev` boots clean
- Browser: stub homepage shows Cormorant + Inter, palette tokens render
- Mobile (390px) — hamburger opens panel
- DevTools `prefers-reduced-motion: reduce` — Reveal becomes no-op
- `git status` after scaffold confirms `public/art/*` and `src/content/works.ts` are untouched

If `Nav`'s scroll-threshold math grows non-trivial, add a Vitest spec for the threshold logic.

### Deliverables

- [x] Booting Next.js 16 project with all dependencies installed
- [x] Design system (palette + fonts + reveal/contactsheet/webgl-canvas primitives) usable everywhere
- [x] Nav (with scroll + mobile) + Footer rendered on every page
- [x] Pre-staged assets confirmed intact (`public/art/`, `src/content/works.ts`)
- [x] `CONTRIBUTING.md` documenting the easy-add workflow
- [x] `.env.local.example`, `.gitignore`, `README.md` exist

---

## Phase 2: Homepage

### Goal

Compose the homepage at `/` — an editorial HTML composition that introduces Kineena, surfaces 3-4 featured paintings, teases the upcoming events, and funnels every CTA into the ContactSheet. No WebGL on this page (that's Phase 3's `/portfolio`); the homepage is a fast, photo-driven first impression that sets the gallery's brand tone.

### Acceptance Criteria

- [x] `/` renders in this order: Hero → Artist Intro → Featured Works (3-4 paintings from `worksByCategory` / `featuredWorks`) → Events Teaser → Closing CTA → Footer.
- [x] Hero: full-viewport-tall, KK monogram wordmark prominently displayed, Cormorant headline (e.g. "Original paintings & Paint N Sip evenings on Vancouver Island."), a tight sub-paragraph in Inter, and a single "View the work" CTA linking to `/portfolio`. The hero may render the KK mint banner from `public/brand/kk-logo-banner.jpg` as a small decorative element (subtle, top-center or behind the wordmark) but the dominant background is `bg-shell`.
- [x] Artist Intro section: a single Cormorant pull-quote (a tight one-sentence excerpt of the artist statement, e.g. *"My goal is to create works of art that evoke emotions."*) attributed to "— Kineena Kang" in small caps, on `bg-cream`.
- [x] Featured Works: 3-4 paintings from `src/content/works.ts` (filtered by `featured: true`). Each card: `<Image>` with proper `width`/`height`/`sizes`, title underneath in Cormorant + medium in Inter `text-xs uppercase tracking-widest text-ink/60`. Subtle hover zoom on the image. Click → `/portfolio` (Phase 3 will adjust to `/portfolio/[slug]`).
- [x] Events Teaser: serif headline "Upcoming Paint N Sip evenings.", brief one-line intro, a single horizontal scroll row (mobile) / 3-up grid (desktop) of the next 3 events from `src/content/events.ts` (stub file — Phase 3 fills it with real entries). For now, the row may render a single "Events coming soon — sign up to hear first" card with a ContactSheet CTA.
- [x] Closing CTA: full-bleed cream background, Cormorant headline ("Commission a piece. Reserve a Paint N Sip seat. Say hello."), single ContactSheet trigger.
- [x] Each below-hero section wrapped in `<Reveal>`. Hero is not wrapped (above the fold).
- [x] Every primary CTA opens the ContactSheet (except "View the work" → `/portfolio`).
- [x] No invented painting titles or prices anywhere — only what's in `works.ts` is shown.
- [x] Mobile (390px): Hero fills viewport, headline doesn't overflow (`max-w-[20ch]`), Featured Works stack to single column, Events Teaser becomes a horizontal scroll row.
- [x] `next build` succeeds; `npm run lint` and `npx tsc --noEmit` clean.

### Files to Create/Modify

- `src/app/page.tsx` *(modify)* — replace stub with full composition
- `src/components/home/Hero.tsx` *(create)*
- `src/components/home/ArtistIntro.tsx` *(create)*
- `src/components/home/FeaturedWorks.tsx` *(create — reads `featuredWorks` from `works.ts`)*
- `src/components/home/EventsTeaser.tsx` *(create — reads from `src/content/events.ts` stub)*
- `src/components/home/ClosingCta.tsx` *(create — reuses `<ContactSheet>`)*
- `src/content/events.ts` *(create — stub file: empty array + same type definitions Phase 3 will use)*
- `src/app/layout.tsx` *(modify)* — set page-level metadata: title "the Kineena Kang Gallery — Original paintings & Paint N Sip events", description from the artist statement, OG image = first featured painting

### Implementation Details

**Hero composition.** `bg-shell text-ink`. Centered layout. Inside `max-w-[1200px] mx-auto px-6 md:px-10`:
- Optional: a thin mint band at the very top (homage to the existing PDF banner) — `h-2 bg-mint w-full` absolutely positioned at the top edge of the hero, OR omit if it competes with Nav
- KK monogram (just "KK" in Cormorant ~12xl) as a watermark element, low opacity (~10%), positioned behind the headline
- Display headline: `font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-ink max-w-[20ch]`
- Sub-body: `mt-6 text-base md:text-lg leading-[1.7] text-ink/75 max-w-[55ch]` — a single short sentence
- CTA: `<Button render={<Link href="/portfolio" />}>View the work</Button>` (`default` variant — ink fill, shell text)

**Artist Intro pull-quote.** `bg-cream py-24 md:py-32`. Centered, narrow column (`max-w-[40rem]`). Single Cormorant italic line `font-display italic text-3xl md:text-4xl leading-snug text-ink`. Attribution below in `text-xs tracking-[0.2em] uppercase text-ink/55` reading "— Kineena Kang".

**Featured Works.** `bg-shell py-24 md:py-32 lg:py-40`. Eyebrow "Featured · From the catalog". Title-row "Selected works." in Cormorant `text-4xl md:text-5xl`. Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10`. Each card:
```tsx
<Link href="/portfolio" className="group block">
  <div className="relative aspect-[4/5] overflow-hidden bg-mist/30">
    <Image src={`/art/${work.file}`} alt={work.title ?? 'Untitled'} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
  </div>
  <h3 className="mt-4 font-display text-lg md:text-xl text-ink">{work.title ?? 'Untitled'}</h3>
  {work.medium && <p className="mt-1 text-xs uppercase tracking-widest text-ink/55">{work.medium}</p>}
</Link>
```
At the bottom of the section: a `Button ghost` "See all paintings →" linking to `/portfolio`.

**Events Teaser.** `bg-cream py-24 md:py-32`. Eyebrow "Coming up". Title "Upcoming Paint N Sip evenings." If `events.ts` returns an empty array (Phase 2 stub), render a single full-width card: image (a generic still-life painting from `works.ts` works fine here), Cormorant headline "Events coming soon", body line "Sign up to be the first to hear about the next Paint N Sip.", `<ContactSheet trigger={<Button>Notify me</Button>} defaultSubject="Notify me about Paint N Sip events" />`. If events.ts has entries, render the first 3 as cards (small image + date + venue + title + Reserve button).

**Closing CTA.** `bg-shell py-32 md:py-48`. Centered. Cormorant headline `text-4xl md:text-6xl`. Single `<ContactSheet>` trigger.

**Hero/section visual rhythm.** Sections alternate `bg-shell` and `bg-cream`. Generous padding. Container: `max-w-[1200px] mx-auto px-6 md:px-10`.

**Page metadata** (`src/app/layout.tsx`):
```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kineenakang.com'),
  title: { default: 'the Kineena Kang Gallery — Original paintings & Paint N Sip events', template: '%s — Kineena Kang' },
  description: '...artist statement excerpt...',
  openGraph: { images: [{ url: `/art/${featuredWorks[0].file}`, width: 1200, height: 800, alt: featuredWorks[0].title }] },
}
```

**Skill usage.** `frontend-design` + `bencium-innovative-ux-designer` to keep each section editorial-distinctive, not SaaS. `accesslint-audit` against `/` at end of phase.

### Tests

Presentation-heavy; verified via AC + manual:
- `npm run dev` and `next build` both succeed
- Visual check at 390px / 768px / 1280px
- ContactSheet opens from each CTA, fields work, submit shows confirmation
- `accesslint-audit` in fix mode against `/`

### Deliverables

- [x] Homepage `/` at full fidelity matching AC
- [x] `src/content/events.ts` stub created (typed, empty array — ready for Phase 3 to fill)
- [x] Featured Works section pulls from `worksByCategory` / `featuredWorks` helpers
- [x] All CTAs route correctly (View the work → `/portfolio`; Inquire/Reserve/Notify → ContactSheet)

---

## Phase 3: WebGL Portfolio Gallery + Painting Detail

### Goal

The brand-defining phase. Build the `/portfolio` WebGL gallery — scroll-driven plane gallery via React Three Fiber + drei + lenis, with image-distortion shader on hover and scroll-velocity warp. Reduced-motion and no-WebGL visitors get a static `next/image` grid fallback with identical filtering and detail-page navigation. Click a painting → `/portfolio/[slug]` detail page (large image, metadata, "Inquire about this piece" CTA).

This phase is large and uses the `threejs-art-portfolio` skill heavily — read it before starting.

### Acceptance Criteria

- [x] `/portfolio` renders the WebGL scroll gallery for all entries in `works`. Each painting is a textured plane that drifts vertically with scroll, breathing slightly with scroll velocity.
- [x] On hover, the hovered painting's plane displays a radial distortion centered at the mouse position (drei's noise displacement or hand-rolled `circle()` shader from `threejs-art-portfolio/SKILL.md`). Returns to flat over 400ms on `onPointerLeave`.
- [x] Scroll-velocity warp: the planes' UVs stretch along the scroll axis proportional to scroll velocity (clamped, lerped at 0.1). Subtle, not nauseating.
- [x] **Reduced-motion fallback**: under `prefers-reduced-motion: reduce`, the page renders a static `next/image` grid (4-col desktop, 2-col mobile) instead of the WebGL canvas. Same filtering, same click-to-detail behavior.
- [x] **No-WebGL fallback**: if `WebGLRenderingContext` is unavailable, same static grid renders (no console errors).
- [x] Keyboard navigation: every painting in the gallery is focusable via Tab. Pressing Enter on a focused painting opens its detail page. The WebGL scene must NOT trap focus — DOM-level focusable elements (one per painting, absolutely positioned over the canvas via the same scroll model) handle focus and click.
- [x] Filter UI: a slim row of filter chips at the top of the page — "All" (default), one per medium present in `mediums` helper, one per category in `categories` helper. Clicking a chip filters the displayed works in both WebGL and fallback modes. State stored in URL `?medium=acrylic&category=landscape`.
- [x] `/portfolio/[slug]` renders a detail page for the painting whose `file`-derived slug matches. Structure: full-width image (next/image, priority, max-h-[80vh] object-contain), Cormorant title, medium + year + category metadata row, optional description paragraph, "Inquire about this piece" `<ContactSheet>` trigger prefilled with `defaultSubject="Inquiry about *${title}*"`, "Back to the gallery" link.
- [x] If a slug doesn't match any work, render `not-found.tsx` (App Router default behavior with `notFound()`).
- [x] WebGL bundle is **lazy-loaded** — first-paint of `/portfolio` shows the static grid; the Canvas mounts after, then crossfades over 400ms.
- [ ] Lighthouse mobile on `/portfolio` production build: **Performance ≥ 70** (WebGL-heavy is acceptable), **Accessibility ≥ 95**.
- [x] Hero painting image budget: `hero.mp4` is N/A here, but each painting JPEG should be ≤500KB. We may need to optimize the 43 pre-extracted JPEGs (some are >500KB).

### Files to Create/Modify

- `src/app/portfolio/page.tsx` *(create — server component, reads works.ts, parses URL search params, renders client gallery component)*
- `src/app/portfolio/[slug]/page.tsx` *(create — server component, looks up work by slug, calls notFound() if missing, renders detail)*
- `src/components/portfolio/PortfolioPage.tsx` *(create — `'use client'`, top-level orchestrator: filter chips + Lenis provider + decides between WebGL and Fallback paths)*
- `src/components/portfolio/Gallery3D.tsx` *(create — `'use client'`, the actual R3F Canvas tree: Lenis-driven scroll, ImagePlane instances)*
- `src/components/portfolio/ImagePlane.tsx` *(create — single plane mesh, useTexture, custom shader material with `uHover`, `uVelocity`, `uMouse` uniforms, hover state via R3F pointer events)*
- `src/components/portfolio/shaders.ts` *(create — exports `vertexShader` and `fragmentShader` string constants per `threejs-art-portfolio/SKILL.md` Patterns 1+2+3)*
- `src/components/portfolio/FallbackGrid.tsx` *(create — static `next/image` grid for reduced-motion / no-WebGL / first-paint)*
- `src/components/portfolio/FilterChips.tsx` *(create — chip row reading from `mediums` + `categories` helpers, writes to URL search params via `useRouter` + `useSearchParams`)*
- `src/components/portfolio/Detail.tsx` *(create — detail page composition, reusable on `[slug]/page.tsx`)*
- `src/lib/slug.ts` *(create — helper: `slugify(file)` derives URL slug from `pNN-NN.jpg` or any kebab-case filename. Used by both server and client.)*

### Implementation Details

**File-to-slug derivation.** A painting's slug is its filename without the `.jpg` extension (e.g. `p02-01` from `p02-01.jpg`). When Kineena renames files to `mountain-stream-01.jpg`, the slug becomes `mountain-stream-01`. The `slugify()` helper just strips the extension. URL: `/portfolio/p02-01`.

**Server vs client split.**
- `src/app/portfolio/page.tsx` is a SERVER component. It reads `searchParams` (an awaited Promise in Next 16: `const { medium, category } = await searchParams`), filters `works` accordingly, then renders `<PortfolioPage works={filtered} medium={medium} category={category} />` (client).
- `src/app/portfolio/[slug]/page.tsx` is also SERVER. It awaits `params`, finds the matching work, calls `notFound()` if missing, then renders `<Detail work={work} />` (server can render Detail since Detail uses ContactSheet which is the only client part).
- Detail.tsx is mostly server; ContactSheet is client (already established).

**Lenis integration.** Mount Lenis at the PortfolioPage level (top of `<PortfolioPage>`):
```tsx
useEffect(() => {
  const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) })
  function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return () => lenis.destroy()
}, [])
```
Then pass Lenis's scroll/velocity values to Gallery3D via React context (or a tiny Zustand store — but Zustand adds a dep, so context is cleaner here).

**Gallery3D structure.**
```tsx
<WebGLCanvas fallback={<FallbackGrid works={works} />}>
  <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 50 }}>
    <Suspense fallback={null}>
      {works.map((w, i) => (
        <ImagePlane
          key={w.file}
          src={`/art/${w.file}`}
          slug={slugify(w.file)}
          position={[/* derived from index + lenis scroll */]}
        />
      ))}
    </Suspense>
  </Canvas>
</WebGLCanvas>
```
The position derivation is the meat — each plane has a base Y derived from its index (e.g. `-i * 5`), then the Lenis scroll value adds an offset to the whole scene. Use drei's `ScrollControls` OR roll your own with a `useFrame` that reads Lenis.

**ImagePlane shader uniforms.**
- `uTexture` — the painting texture (from `useTexture(src)`)
- `uHover` — 0..1, lerped on `onPointerEnter` / `onPointerLeave` (target 1 or 0, lerp inside `useFrame` for smoothness)
- `uMouse` — vec2, mouse position in UV space, updated in `useFrame` from R3F's `state.pointer`
- `uVelocity` — float, scroll velocity from Lenis, lerped

Shaders live in `shaders.ts` as exported template literals. See `threejs-art-portfolio/SKILL.md` Patterns 1–3 for the canonical implementations.

**DOM focus layer.** Each painting needs a focusable, keyboard-navigable DOM element. Use drei's `<Html>` component or render a parallel `<a href={`/portfolio/${slug}`} className="sr-only" tabIndex={0}>...</a>` list outside the Canvas, positioned absolutely with the same coordinate model. The `sr-only` list satisfies screen readers and keyboard users; mouse users interact with the Canvas.

**FallbackGrid.** Standard 4-col responsive grid:
```tsx
<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
  {works.map((w) => (
    <li key={w.file}>
      <Link href={`/portfolio/${slugify(w.file)}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist/30">
          <Image src={`/art/${w.file}`} alt={w.title ?? 'Untitled'} fill sizes="..." className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </div>
        <h3 className="mt-3 font-display text-base md:text-lg text-ink">{w.title ?? 'Untitled'}</h3>
        {w.medium && <p className="mt-1 text-xs uppercase tracking-widest text-ink/55">{w.medium}</p>}
      </Link>
    </li>
  ))}
</ul>
```

**Filter chips.** Use `useSearchParams()` + `useRouter()` to read/write URL state. Server component re-renders with the new filter via the server-side `searchParams` read. Chips show active state via `bg-mint text-ink` when selected.

**Image budget.** Inspect existing `public/art/*.jpg` sizes. If any exceed 500KB, downscale with `sips -Z 1600 -s formatOptions 78 public/art/*.jpg` (in-place compress to 1600px max + 78 quality). Run this as a one-off script — don't add it to the build.

**Skill usage (mandatory).** Use the `threejs-art-portfolio` skill throughout this phase. Especially:
- File structure (the SKILL.md "File structure" section maps almost 1:1 to the files above)
- Performance budgets (≤80KB R3F+three bundle gz, ≤50 draw calls, `dpr [1, 1.5]`)
- Accessibility (focus layer, alt text, reduced-motion fallback)
- Anti-patterns (no OrbitControls, no GLTF for 2D, dispose geometries on unmount)
- Loading choreography (HTML grid → Canvas mount → crossfade)

### Tests

- `src/lib/slug.test.ts` (Vitest) — slugify roundtrips for various filenames (kebab-case, with extension, etc.)
- `src/components/portfolio/FallbackGrid.test.tsx` (Vitest + RTL) — renders all works as links with correct hrefs
- `src/components/portfolio/FilterChips.test.tsx` (Vitest + RTL) — clicking a chip updates URL search params, active state matches URL on mount
- Manual: load `/portfolio` with WebGL, with WebGL disabled (DevTools), with reduced-motion enabled, on iOS Safari (the GLSL float-precision boss fight)
- Manual: keyboard-only navigation — Tab through paintings, Enter opens detail

### Deliverables

- [x] `/portfolio` WebGL gallery live with shader hover + scroll-velocity warp
- [x] Static fallback for reduced-motion / no-WebGL identical in filter behavior + click target
- [x] `/portfolio/[slug]` detail page for every work
- [x] Filter chips with URL persistence
- [x] All 43 paintings displayed; image budget ≤500KB each
- [x] Vitest suite passing for slug + FallbackGrid + FilterChips

---

## Phase 4: Paint N Sip Events

### Goal

Build `/events` — a listing of upcoming Paint N Sip events with the same easy-add content pattern as paintings. Each event card has a "Reserve a spot" button that opens the ContactSheet with the event details prefilled.

### Acceptance Criteria

- [ ] `src/content/events.ts` defines a typed `events: readonly Event[]` array with the same easy-add ergonomics as `works.ts`. Schema:
  ```ts
  interface Event {
    slug: string                 // URL-friendly id (kebab-case)
    title: string                // e.g. "Sip & Paint: Sunset Pier"
    date: string                 // ISO date "2026-07-12"
    time?: string                // e.g. "6:00 PM – 9:00 PM"
    venue: { name: string; city: string; address?: string }
    description: string          // 1-3 sentences
    image?: string               // /public/events/<file>.jpg or /art/<file>.jpg
    price?: string               // "$65/person" or "Inquire for pricing"
    capacity?: number            // optional
    spotsRemaining?: number      // optional
    rsvpUrl?: string             // optional external link override (Eventbrite etc.) — if absent, uses ContactSheet
  }
  ```
- [ ] Seed `events.ts` with **3 placeholder events** the user will edit:
  1. "Sip & Paint: Coastal Sunset" — Sat, July 12, 2026 · 6–9pm · The Studio, Vancouver · acrylic on canvas, all materials included · $65/person · 16 spots
  2. "Couples Night: Mountain Reflections" — Fri, Aug 8, 2026 · 7–10pm · Riverbend Wine Bar, Victoria · paint a pair, dinner add-on available · $145/couple · 12 spots
  3. "Calligraphy & Wine" — Sun, Sept 7, 2026 · 2–5pm · The Studio, Vancouver · brush lettering + a glass of something local · $55/person · 14 spots
- [ ] `/events` page renders: hero section (eyebrow "Coming up", Cormorant title "Paint N Sip evenings."), one-paragraph intro about what a Paint N Sip is, then a vertical stack of event cards (mobile) / 2-col grid (md+).
- [ ] Each event card: image left/top (aspect-[4/5] on mobile, aspect-square on desktop), date + venue in caps tracking-widest at top of text block, Cormorant title, description body, price line, capacity line (if set), "Reserve a spot" button opening the ContactSheet with `defaultSubject="Reserve: ${title}"` and `eventDetails={event}` so the form's read-only summary card shows the event.
- [ ] If `event.rsvpUrl` is set, the button is a `<Link>` to that URL instead of opening the ContactSheet.
- [ ] Past events are filtered out automatically (any event with `date` < today is hidden). A toggle "Past events" can show them — keep it simple, just hide them by default; no toggle in v1.
- [ ] Events with no `image` get a default placeholder — use one of the painting JPEGs (e.g. `p02-01.jpg`) as a graceful default.
- [ ] Homepage Events Teaser (Phase 2) now pulls real entries — update `EventsTeaser.tsx` to show the next 3 upcoming events from `events.ts`.
- [ ] `CONTRIBUTING.md` updated with an "Adding a Paint N Sip event" section.

### Files to Create/Modify

- `src/content/events.ts` *(modify — replace stub with full schema + 3 seed entries)*
- `src/app/events/page.tsx` *(create — server component composition)*
- `src/components/events/EventsHero.tsx` *(create — page hero)*
- `src/components/events/EventCard.tsx` *(create — reusable card, used on /events and /home EventsTeaser)*
- `src/components/home/EventsTeaser.tsx` *(modify — render real events via EventCard)*
- `src/components/site/ContactSheet.tsx` *(modify — accept optional `eventDetails` prop; if set, render a small read-only summary card above the form fields)*
- `public/events/.gitkeep` *(create — directory exists for event-specific photos)*
- `CONTRIBUTING.md` *(modify — add "Adding a Paint N Sip event" section)*

### Implementation Details

**Event card visual structure.**
```tsx
<article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-shell border border-mist/60 p-6 md:p-8">
  <div className="relative aspect-[4/5] md:aspect-square overflow-hidden bg-mist/30">
    <Image src={event.image ?? '/art/p02-01.jpg'} alt={event.title} fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
  </div>
  <div className="flex flex-col justify-between">
    <div>
      <p className="text-xs tracking-[0.2em] uppercase text-ink/55">
        {formatDate(event.date)} · {event.venue.city}
      </p>
      <h3 className="mt-3 font-display text-2xl md:text-3xl text-ink leading-tight">{event.title}</h3>
      <p className="mt-4 text-base leading-[1.7] text-ink/75">{event.description}</p>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {event.time && (<><dt className="text-ink/55">Time</dt><dd>{event.time}</dd></>)}
        {event.venue.name && (<><dt className="text-ink/55">Venue</dt><dd>{event.venue.name}</dd></>)}
        {event.price && (<><dt className="text-ink/55">Price</dt><dd>{event.price}</dd></>)}
        {event.spotsRemaining != null && (<><dt className="text-ink/55">Spots</dt><dd>{event.spotsRemaining} left</dd></>)}
      </dl>
    </div>
    <div className="mt-6">
      {event.rsvpUrl
        ? <Button render={<a href={event.rsvpUrl} target="_blank" rel="noreferrer" />}>Reserve a spot →</Button>
        : <ContactSheet trigger={<Button>Reserve a spot</Button>} defaultSubject={`Reserve: ${event.title}`} eventDetails={event} />}
    </div>
  </div>
</article>
```

**Date filtering.** Server component reads `events.ts`, filters `events.filter(e => new Date(e.date) >= startOfToday())`, sorts ascending by date. Past events are simply hidden — no toggle UI in v1.

**Date formatting.** Use `Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })` for display ("Sat, Jul 12, 2026"). Don't import `date-fns` — `Intl` covers it.

**ContactSheet `eventDetails` prop.** When set, render a small `bg-cream p-4 mb-6 text-sm` card at the top of the form showing event title, date, venue. Pre-fill the message field with `\nReserving for: ${title}\nDate: ${formatDate(date)}\nVenue: ${venue.name}, ${venue.city}\n` so the email Kineena receives has structured context even without form parsing.

**Events Teaser on homepage.** Replace the Phase 2 stub with a horizontal scroll row (mobile) / 3-up grid (desktop) of the next 3 events. If `events.length === 0` (empty array), keep the Phase 2 "Notify me" fallback.

**Seed event copy.** Use the exact 3 placeholders in the AC. These are plausible Paint N Sip events that read as real — they'll work as a launch state if Kineena doesn't have real events ready, and she swaps them out via `events.ts` once she does. Document this in `CONTRIBUTING.md`.

**Skill usage.** `frontend-design` for the EventCard composition. No new skills needed.

### Tests

- `src/content/events.test.ts` (Vitest) — verify events.ts is well-typed and parses, date filtering works, past events filtered out
- `src/components/events/EventCard.test.tsx` (Vitest + RTL) — renders with all fields, with optional fields missing, with rsvpUrl vs ContactSheet path
- Manual: click "Reserve" → ContactSheet opens with event summary card visible + prefilled message

### Deliverables

- [ ] `/events` page lists upcoming Paint N Sip events from `events.ts`
- [ ] 3 seed events created and rendering
- [ ] Homepage Events Teaser shows real entries
- [ ] ContactSheet event-prefill works end-to-end
- [ ] `CONTRIBUTING.md` documents the easy-add events workflow

---

## Phase 5: About + Contact + Polish + Deploy

### Goal

Wrap the site: `/about` (verbatim artist statement + autobiography), `/contact` (commission inquiry + email), polish across all pages (sitemap, robots, per-page metadata + OG images), Lighthouse + accesslint sweeps, and Vercel deploy prep. After this phase the site is ready for production.

### Acceptance Criteria

- [ ] `/about` renders the Artist Statement and Artist Autobiography verbatim from the PDF (text in `src/content/about.ts`). Layout: a soft cream column (`max-w-[60ch] mx-auto`), Cormorant section headings, Inter body. Optional photo of Kineena if she provides one — leave a placeholder section ready.
- [ ] `/contact` renders: Cormorant headline ("Commission a piece. Reserve a seat. Say hello."), brief intro paragraph, email displayed (mailto link), and a primary `<ContactSheet>` trigger ("Send a note"). No physical address.
- [ ] Each page exports its own `metadata` (title + description + OG image). OG images are page-appropriate stills from `public/art/`.
- [ ] `src/app/robots.ts` and `src/app/sitemap.ts` generate `/robots.txt` and `/sitemap.xml`. Sitemap includes all 6 page-level URLs + every `/portfolio/[slug]` URL derived from `works.ts`.
- [ ] Footer (built in Phase 1) is updated to link all 4 nav pages + Contact CTA. Year auto-updates.
- [ ] Lighthouse mobile on production build (`next build && next start`): Performance **≥ 80** (Phase 3 has WebGL), **≥ 90** on all non-portfolio pages. Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on every page.
- [ ] `accesslint-audit` in fix mode reports zero Issue-severity findings across all 6 routes.
- [ ] Visual consistency review: same palette / type scale / motion timing / button styles across all pages. No orphaned styles.
- [ ] Deploy-ready: README's Deploy section explains Vercel import + envvars (`NEXT_PUBLIC_SITE_URL`, Resend keys for the future Phase 6). Optional `vercel.json` only if defaults don't suffice.
- [ ] `next build` succeeds on a clean clone (`git clone … && npm install && npm run build`).

### Files to Create/Modify

- `src/app/about/page.tsx` *(create)*
- `src/app/contact/page.tsx` *(create)*
- `src/content/about.ts` *(create — exports `artistStatement` and `artistAutobiography` constants, verbatim from PDF)*
- `src/components/about/StatementBlock.tsx` *(create — reusable typography block, used in /about and possibly home ArtistIntro)*
- `src/app/sitemap.ts` *(create)*
- `src/app/robots.ts` *(create)*
- `src/components/site/Footer.tsx` *(modify — link all 4 pages + contact CTA)*
- `src/app/page.tsx`, `src/app/portfolio/page.tsx`, `src/app/portfolio/[slug]/page.tsx`, `src/app/events/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx` *(modify — add page-level `export const metadata` with unique title/desc/OG)*
- `public/og/*.jpg` *(create — 5 OG images, 1200×630 each, cropped from paintings)*
- `README.md` *(modify — Deploy section + envvar checklist)*
- `vercel.json` *(create-or-omit — only if needed)*

### Implementation Details

**About page composition.**
```tsx
<main className="bg-cream pt-[var(--nav-h)]">
  <section className="mx-auto max-w-[60ch] px-6 py-24 md:py-32">
    <p className="text-xs tracking-[0.2em] uppercase text-ink/55">About</p>
    <h1 className="mt-6 font-display text-4xl md:text-5xl text-ink">Artist Statement</h1>
    <div className="mt-8 space-y-5 text-base md:text-lg leading-[1.7] text-ink/85">
      {artistStatement.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
    </div>

    <h2 className="mt-16 font-display text-3xl md:text-4xl text-ink">Autobiography</h2>
    <div className="mt-6 space-y-5 text-base md:text-lg leading-[1.7] text-ink/85">
      {artistAutobiography.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
    </div>
  </section>
</main>
```

**Verbatim copy** (from PDF pp19-20 — DO NOT REWRITE, preserve grammar):

`artistStatement`:
> My goal is to create works of art that evoke emotions. I use colours to emulate moods or feelings that are personally significant to me. I want to create art that people can connect with. I have visited art galleries in France, Italy, the Netherlands, across Canada and The US to study different art styles and techniques. I'm inspired by art that pulls you back in back to take a second look or stop and stare for a while to appreciate fine, intricate details. I hope to create art that lingers in the mind and makes others feel the same awe that I have experienced while appreciating the beauty of artwork from around the world.

`artistAutobiography`:
> Born in Calgary, Alberta in 2002, I have been painting and drawing since I was young, beginning art classes at eight years old, and continuing with classes in high school and at the University of British Columbia. I primarily use acrylic paint, some water colour, as well as pencils and charcoal. I began with pencil drawings of people and animals, and then transitioned to landscape paintings inspired from nature I've seen and/or pictures that I or others have taken. The photo on the left is from a photo of a sunset in Nova Scotia. I gave away most of my paintings as gifts for family and friends, but I began doing commissioned landscape paintings including the creation of two illustrations for the GSS Graduate Education Report Video Project for the University of British Columbia. The link can be found here: bit.ly/45Vq8kQ

**Contact page composition.**
```tsx
<main className="bg-shell pt-[var(--nav-h)]">
  <section className="mx-auto max-w-[1200px] px-6 py-24 md:py-32 lg:py-40">
    <p className="text-xs tracking-[0.2em] uppercase text-ink/55">Contact</p>
    <h1 className="mt-6 max-w-[20ch] font-display text-4xl md:text-6xl lg:text-7xl text-ink leading-[1.05]">
      Say hello.
    </h1>
    <p className="mt-8 max-w-[55ch] text-base md:text-lg leading-[1.7] text-ink/80">
      Commission a piece. Reserve a Paint N Sip seat. Or just say hello — I'll get back within a few days.
    </p>
    <div className="mt-12 flex flex-col gap-3">
      <p className="text-xs tracking-[0.2em] uppercase text-ink/55">Email</p>
      <a href={`mailto:${site.email}`} className="text-base md:text-lg leading-[1.7] text-ink underline underline-offset-4 hover:text-accent w-fit">
        {site.email}
      </a>
    </div>
    <div className="mt-12">
      <ContactSheet trigger={<Button size="lg" className="px-6">Send a note</Button>} />
    </div>
  </section>
</main>
```

**Sitemap.** `src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'
import { works } from '@/content/works'
import { slugify } from '@/lib/slug'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kineenakang.com'
  const staticPages = ['', '/portfolio', '/events', '/about', '/contact'].map(p => ({ url: `${base}${p}`, lastModified: new Date() }))
  const workPages = works.map(w => ({ url: `${base}/portfolio/${slugify(w.file)}`, lastModified: new Date() }))
  return [...staticPages, ...workPages]
}
```

**OG images.** Generate 5 1200×630 crops from the most striking paintings:
- Homepage / default: featured painting hero
- /portfolio: a strong landscape
- /events: a painting that reads as "social"
- /about: a portrait or expressive piece
- /contact: a calm seascape

Use `sips` to crop+resize: `sips --resampleHeightWidth 630 1200 --cropToHeightWidth 630 1200 -s formatOptions 82 public/art/p03-01.jpg --out public/og/portfolio.jpg`.

**Lighthouse.** Run on `next start` build. Record per-page scores in the README. WebGL gallery is expected ≥80; all other pages ≥90.

**`accesslint-audit`.** Run in fix mode against each of the 6 routes. Address any Issue-severity findings.

**Deploy.** README's Deploy section:
```markdown
## Deploy

1. Connect repo to Vercel (https://vercel.com/new) — auto-detects Next.js
2. Environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://kineenakang.com`
   - `RESEND_API_KEY=` (Phase 6, not active yet)
   - `RESEND_FROM_EMAIL=info@kineenakang.com` (Phase 6)
   - `KINEENA_TO_EMAIL=info@kineenakang.com` (Phase 6)
3. Deploy. First build ~2 minutes.
4. Custom domain → Vercel Settings → Domains → add.
```

### Tests

- `src/content/about.test.ts` (Vitest) — verifies the verbatim text matches the PDF source (snapshot test against a fixture file)
- Manual page-by-page Lighthouse run on `next start` — document scores in README
- `accesslint-audit` skill run against each of 6 routes — no Issue-severity findings

### Deliverables

- [ ] `/about` and `/contact` pages live and matching design system
- [ ] Verbatim artist statement + autobiography preserved
- [ ] Per-page metadata + 5 OG images
- [ ] `sitemap.xml` and `robots.txt` generated, sitemap includes per-painting URLs
- [ ] Footer linked to all 4 pages + contact CTA
- [ ] Lighthouse scores documented in README (≥80 on `/portfolio`, ≥90 elsewhere)
- [ ] `accesslint-audit` clean on all 6 pages
- [ ] README "Deploy" section + envvar checklist
- [ ] Successful `vercel build` (ready to deploy on Vercel)
