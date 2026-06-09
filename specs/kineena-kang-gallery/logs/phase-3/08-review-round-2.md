# Phase 3 — Round 2 Code Review

**Date:** 2026-06-06
**Agent:** code-reviewer
**Verdict:** NOT CONVERGED — MF-5 and MF-6 regressions persist; 1 new Must Fix introduced; 8 Should Fix RELATED.

## Round-1 resolution verification

| Round-1 ID | Status |
|---|---|
| MF-1 not-found.tsx | ✅ RESOLVED |
| MF-2 Lenis unsubscribe | ✅ RESOLVED |
| MF-3 ref-based context | ✅ RESOLVED |
| MF-4 disposal | ✅ RESOLVED |
| MF-5 focus + pointer-events | ⚠️ PARTIALLY (regression on pre-ready click-through) |
| MF-6 scroll height layout | ❌ NOT RESOLVED |
| SF-7..18 | ✅ ALL RESOLVED |

## Findings Summary

| Severity | RELATED | PRE-EXISTING |
|---|---|---|
| Must Fix | 3 | 0 |
| Should Fix | 8 | 0 |
| Suggestion | 4 | 0 |

## Must Fix (RELATED)

1. **`PortfolioPage.tsx:159-174` — MF-6 not actually fixed.** Post-ready, WebGLSection switches to `position: static`, but the FallbackGrid wrapper is ALSO in normal flow with no position change. Both stack vertically, so the document's scrollable height becomes `fallbackGridHeight + galleryHeight`. The comment on line 156 describes behavior the code doesn't implement. Switch FallbackGrid wrapper to `position: absolute; inset: 0; pointer-events: none` when `canvasReady`.

2. **`PortfolioPage.tsx:159-174` — MF-5 regression: pre-ready clicks on FallbackGrid blocked.** Before `canvasReady`, WebGLSection wrapper is `position: absolute; inset: 0; opacity: 0` but has NO `pointer-events: none`. It covers FallbackGrid and intercepts all clicks during the (potentially multi-second) texture load. Add `pointerEvents: canvasReady ? "auto" : "none"` to the WebGL wrapper. Mirror post-ready on FallbackGrid wrapper.

3. **`PortfolioPage.tsx:30-31` — `react-hooks/set-state-in-effect` silenced instead of fixed.** Project convention prohibits silencing real lint warnings. Replace `useWebGLSupported` with `useSyncExternalStore` (server snapshot `() => null`, client snapshot probes WebGL once) OR a `useState` initializer guarded by `typeof window`.

## Should Fix (RELATED)

4. `Gallery3D.tsx:21-26` — no React error boundary around `<Suspense>`. A single 404 texture leaves the boundary suspended forever and the FallbackGrid is already opacity-0 post-ready (when the canvas isn't actually ready). Wrap with an error boundary that calls `onReady` on error.

5. `ImagePlane.tsx:103` — `onClick` fires on any click on the plane, including a scroll-drag that ends on it. Track pointer-down/up positions; only navigate if displacement <6px.

6. `PortfolioPage.tsx:14-17` — Dynamic-import `loading: () => null` + pre-ready absolute overlay = worst window: nothing visible, nothing clickable. Covered if MF #2 is fixed (pre-ready pointer-events-none on WebGL wrapper).

7. `Detail.tsx:32` — `max-h-[80vh]` + `aspect-[…]` conflict on wide-short viewports. Drop `max-h-[80vh]` and constrain via `max-w-[…]` + mx-auto.

8. `ImagePlane.tsx:78` — scroll-to-plane multiplier mismatch. `position.y = baseY + scroll * 0.001` with `PLANE_GAP = 5.5` and `galleryHeight = works.length * 520px` means 520px of scroll advances 0.52 unit, but planes are 5.5 unit apart. User scrolls a full plane gap (~5500px) per plane in 3D. Align: `scroll * (PLANE_GAP / 520)` ≈ `scroll * 0.0106`.

9. `Gallery3D.tsx:34-60` — filter changes reconcile planes in-place but `baseY={-i * PLANE_GAP}` changes per filter, causing a frame of sticky hover state on indices that moved. Minor — but worth a `key={`${w.file}-${activeMedium ?? "_"}-${activeCategory ?? "_"}`}` to force remount.

10. `PortfolioPage.tsx:64` — `useReducedMotion()` returns `boolean | null`; `!reduceMotion === true` when null, so `showWebGL` is briefly true for reduced-motion users during the first paint. Gate on `reduceMotion === false` explicitly.

11. `FilterChips.test.tsx:14-16` — `beforeEach` only resets `medium` and `category` on the shared `URLSearchParams`. Brittle for future params. Use `Array.from(rawSearchParams.keys()).forEach(k => rawSearchParams.delete(k))`.

## Suggestions (RELATED)

12. `slug.ts:17-19` — `slugToFile` always appends `.jpg`; note the uppercase-`.JPG` asymmetry in a comment.
13. `PortfolioPage.tsx:25-39` — null the throwaway `<canvas>` local at function end (iOS Safari canvas leak insurance).
14. `Detail.tsx:59` — `replace(/-/g, " ")` is fine today but brittle for future categories with other punctuation.
15. `Gallery3D.tsx:48-54` — orientation→aspect ternary → small lookup table.
16. `ImagePlane.tsx:55-58` — magic constants `0.001` and `2.5` should be named (`HOVER_LERP_RATE`).

## Triage Outcome

- NOT CONVERGED. 3 RELATED Must Fix + 8 RELATED Should Fix. Send to fixer.
- No PRE-EXISTING findings this round.
- Spawn analyst (background).
