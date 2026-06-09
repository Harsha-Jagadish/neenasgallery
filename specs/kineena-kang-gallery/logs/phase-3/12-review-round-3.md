# Phase 3 — Round 3 Code Review

**Date:** 2026-06-06
**Agent:** code-reviewer
**Verdict:** NOT CONVERGED — 1 new RELATED Must Fix; round-2 fixes otherwise clean.

## Round-2 resolution verification

| ID | Status |
|---|---|
| MF-1 (R2) layout swap | ✅ RESOLVED |
| MF-2 (R2) pointer-events mirror | ✅ RESOLVED |
| MF-3 (R2) useSyncExternalStore | ✅ RESOLVED |
| SF-4 ErrorBoundary | ⚠️ **REGRESSED** — error path now hides FallbackGrid instead of restoring it |
| SF-5..SF-11 + SF-6 | ✅ ALL RESOLVED |

## Findings Summary

| Severity | RELATED | PRE-EXISTING |
|---|---|---|
| Must Fix | 1 | 0 |
| Should Fix | 0 | 0 |
| Suggestion | 0 | 0 |

## Must Fix (RELATED)

1. **`Gallery3D.tsx:46-63` + `PortfolioPage.tsx:167-178` — Error pathway makes the empty WebGL wrapper authoritative.**

   `CanvasErrorBoundary.componentDidCatch` calls `onError → onReady → setCanvasReady(true)`. Per the round-2 layout swap, `canvasReady=true` makes the WebGL wrapper `position:static, opacity:1` (drives scrollHeight) and pushes FallbackGrid to `position:absolute, opacity:0, pointer-events:none` (hidden, no focusable links).

   On a texture-load failure (e.g., 404), the result is a blank `works.length * 520px` region with no fallback visible. SF-4's intent was the opposite — keep FallbackGrid authoritative on error.

   **Fix approach:** introduce a separate error state (`canvasError`) that, when set, forces `showWebGL = false` (or equivalent). Use the existing no-WebGL branch (PortfolioPage.tsx:200-202) which renders only the FallbackGrid. Wire `CanvasErrorBoundary.onError` to `setCanvasError(true)` rather than `setCanvasReady(true)`.

## Sanity glance — no new defects in unchanged files
- src/lib/slug.ts + tests
- src/app/portfolio/[slug]/page.tsx + not-found.tsx
- src/app/portfolio/page.tsx
- src/components/portfolio/FallbackGrid.tsx + shaders.ts + LenisContext.tsx + Detail.tsx + FilterChips.tsx

## Triage Outcome

NOT CONVERGED. 1 RELATED Must Fix. Narrow fix round.
No PRE-EXISTING this round.
