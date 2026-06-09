# Phase 3 — Round 1 Fix

**Date:** 2026-06-06
**Agent:** frontend-expert (fixer)
**Findings addressed:** 6 Must Fix RELATED + 12 Should Fix RELATED. Suggestions deferred.
**Pre-existing filtered:** 1 (routed to deficiency spec)

## Files modified
- `src/app/portfolio/[slug]/not-found.tsx` (created) — MF-1
- `src/components/portfolio/LenisContext.tsx` — MF-3 (ref-based context; `useLenisScrollRef` + `useLenisScrollState` hooks)
- `src/components/portfolio/PortfolioPage.tsx` — MF-2 (listener unsubscribe), MF-3 (ref mutation), MF-6 (layout flow), MF-5 (FallbackGrid opacity-0 stays focusable), SF-9 (drop Lenis_ alias), SF-10 (drop Suspense), SF-13 (X of Y count)
- `src/components/portfolio/ImagePlane.tsx` — MF-4 (dispose), MF-3 (ref consumer), SF-7 (e.uv pointer), SF-8 (delta-time lerp)
- `src/components/portfolio/Gallery3D.tsx` — SF-11 (ReadySignal inside Suspense fires onReady on actual mount)
- `src/components/portfolio/WebGLSection.tsx` — SF-11 (removed 300ms timer)
- `src/components/portfolio/FilterChips.tsx` — SF-12 (split into toggleMedium + toggleCategory)
- `src/components/portfolio/Detail.tsx` — SF-16 (single sized container + Image fill), SF-17 (asterisks in defaultSubject)
- `src/components/portfolio/shaders.ts` — SF-18 (circle args 0.3, 0.2 — blur < radius)
- `src/lib/slug.test.ts` — SF-14 (roundtrip property tests; 25 cases total)
- `src/components/portfolio/FilterChips.test.tsx` — SF-15 (cast through unknown for ReadonlyURLSearchParams)

## Implementer-reported gates (post-fix)
- typecheck: PASS
- lint: PASS (0 errors, 0 warnings)
- test: PASS (3 files, 25 tests — up from 22)
- build: PASS (48 static pages — 43 [slug] + 5 page-level routes)

## Deviations (transparency)
1. **MF-5** — picked the simpler "FallbackGrid stays mounted at opacity-0" path (offered as a fallback approach in the fix prompt); per-plane world-space focus mapping was avoided per the explicit fallback license.
2. **MF-6 layout transition** — pre-ready: WebGLSection is `position: absolute; inset: 0` (no layout height; FallbackGrid drives scroll height). Post-ready: switches to `position: static` (in flow) + FallbackGrid → `opacity-0`. Avoids unmount/remount flash while still giving Lenis the right scroll travel.
3. **SF-11 ReadySignal** — placed inside `Gallery3D` rather than `WebGLSection` because the `<Suspense>` boundary lives in `Gallery3D`.

Result going into round 2: gates re-run from orchestrator side, then a fresh code review against the diff for any regressions introduced by the fixes.
