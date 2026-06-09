# Phase 3 — Round 2 Fix

**Date:** 2026-06-06
**Agent:** frontend-expert (fixer)
**Findings addressed:** 3 Must Fix RELATED + 8 Should Fix RELATED. Suggestions deferred.
**Pre-existing filtered:** 0

## Files modified
- `src/components/portfolio/PortfolioPage.tsx` — MF-1 (FallbackGrid wrapper now `position:absolute inset:0 opacity:0 pointer-events:none` post-ready; WebGL wrapper inverts symmetry pre-ready), MF-2 (pointer-events mirroring on both wrappers), MF-3 (`useWebGLSupported` rewritten as `useSyncExternalStore`; eslint-disable removed), SF-10 (`reduceMotion === false` explicit gate), passes `activeMedium`/`activeCategory` to WebGLSection
- `src/components/portfolio/Gallery3D.tsx` — exported `PLANE_GAP` + `PX_PER_PLANE` constants, added `CanvasErrorBoundary` around `<Suspense>` (SF-4), composite key including filter state (SF-9), accepts `activeMedium`/`activeCategory` props
- `src/components/portfolio/WebGLSection.tsx` — `galleryHeight = works.length * PX_PER_PLANE`, forwards filter state
- `src/components/portfolio/ImagePlane.tsx` — SF-8 (`SCROLL_TO_UNIT = PLANE_GAP / PX_PER_PLANE ≈ 0.01058`; verified `scroll=520 → ΔY = PLANE_GAP`), SF-5 (`onPointerDown` capture + `CLICK_SLOP_PX` guard on click)
- `src/components/portfolio/Detail.tsx` — SF-7 (dropped `max-h-[80vh]`, used `max-w-[1100px] mx-auto`)
- `src/components/portfolio/FilterChips.test.tsx` — SF-11 (clear all keys in `beforeEach`)

## Implementer-reported gates (post-fix)
- typecheck: PASS
- lint: PASS (no eslint-disable lines remain in PortfolioPage.tsx)
- test: PASS (3 files, 25 tests)
- build: PASS (48 pages)

## Implementer's layout state trace (for verification)
- `canvasReady=false`: FallbackGrid wrapper `position:static opacity:1 pointerEvents:auto`; WebGL wrapper `position:absolute inset:0 opacity:0 pointerEvents:none`. scrollHeight = FallbackGrid height. Clicks reach grid links.
- `canvasReady=true`: WebGL wrapper `position:static opacity:1 pointerEvents:auto`; FallbackGrid wrapper `position:absolute inset:0 opacity:0 pointerEvents:none`. scrollHeight = `works.length * PX_PER_PLANE`. FallbackGrid adds nothing to flow.

## Deviations
1. SF-6 marked resolved (covered by MF-2).
2. Removed an unused `PLANE_W_CONST` alias from round-1 (lint-workaround that became dead code).
