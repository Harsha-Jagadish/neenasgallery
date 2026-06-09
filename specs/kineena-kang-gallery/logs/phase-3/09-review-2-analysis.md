# Phase 3 Round 2 — Review Analysis

**Context:** kineena-kang-gallery Phase 3 | Agent: frontend-expert | Round 2 (prior: 1 round, fixed shader UV, disposal, Lenis unsubscribe, scroll-state ref migration, spec literals)
**Verdict:** NOT CONVERGED — 3 Must Fix + 8 Should Fix RELATED. Two of three Must Fix are R1 regressions (MF-5, MF-6).

## Issue Themes

**1. Round-1 fix regressions (2 Must Fix: MF-5, MF-6)** — fixer described the right plan in comments but only partially executed it. MF-6: WebGLSection was flipped absolute→static, but FallbackGrid stayed in normal flow next to it instead of being lifted to absolute, so scroll height is still wrong. MF-5: FallbackGrid kept mounted at opacity-0 for focus, but the absolute-positioned pre-ready WebGLSection wrapper still has no `pointer-events: none`, so it eats every click during multi-second texture load.

**2. Lint-rule silencing instead of learning the pattern (1 Must Fix)** — `useWebGLSupported` triggered `set-state-in-effect`; fixer applied `eslint-disable` rather than `useSyncExternalStore` or a window-guarded lazy initializer. Project convention prohibits silencing real warnings.

**3. R3F interaction-model gaps (3 Should Fix)** — no error boundary around Gallery3D Suspense (one bad texture suspends forever); ImagePlane click conflated with Lenis scroll-drag; null `useReducedMotion()` causes brief WebGL flash for reduced-motion users.

**4. Layout / mount-state edge cases (3 Should Fix)** — dynamic-import `loading: null` + pre-ready overlay = invisible-uninteractable window; Detail.tsx aspect vs `max-h` conflict on wide-short viewports; filter remount produces sticky hover frame on reconciled planes.

**5. Coordinate-system drift (1 Should Fix)** — scroll-to-plane uses `scroll * 0.001` against 5.5-unit gaps, demanding ~5500px scroll per plane. The two layers were tuned independently.

**6. Test hygiene (1 Should Fix)** — FilterChips mock-reset is brittle.

## Root Causes

### Spec Clarity
Adequate this round. The regressions are not spec gaps; they are execution gaps. Spec did not need to dictate which element gets `pointer-events: none`, but the round-1 analysis recommendation could have been more prescriptive.

### Prompt Completeness
The round-1 fix prompt accepted the fixer's narrative ("absolute-position FallbackGrid on top once canvas is ready") without requiring a post-fix layout assertion. No "show the final DOM tree with computed positions" step. The lint-disable Must Fix indicates the prompt also did not enumerate the project's no-silenced-warnings convention or list React 19 patterns (`useSyncExternalStore`) for external/browser state.

### Tool Adequacy
No scroll-height check, no pointer-event interception probe, no React-19 hook pattern reference sheet. The fixer had no cheap way to verify "the pre-ready overlay does not intercept clicks" before claiming done.

### Agent Capability Match
frontend-expert continues to struggle at the same boundary the R1 analysis flagged: CSS layout of conditionally-rendered absolute/static canvas hosts. R2 adds a second recurring weak spot — preferring `eslint-disable` to learning the modern React pattern. Both are habit-shaped, not knowledge-shaped.

### Feedback Loop Gaps
No gate verifies "the absolute-positioned overlay actually layers correctly and does not eat clicks." A simple Playwright probe ("click a FallbackGrid link during the pre-ready window, assert navigation") would have caught MF-5 instantly. Scroll-height assertion would have caught MF-6.

## New Patterns Surfaced This Round (for memory / future R3F prompts)

1. **Comment-vs-code drift on layout fixes** — when a fix involves swapping which sibling is `absolute` and which is static, require the fixer to paste the final layout (or a 4-line ASCII tree) into the fix log. Plan-stated-in-comments is not verification.
2. **Click-vs-drag boundary** — any 3D scene wired to a scroll library (Lenis, Locomotive) needs an explicit click-threshold (`pointerdown→pointerup` distance + time) before nav fires.
3. **Error boundary discipline around Suspense** — any `<Suspense>` whose children load external resources (textures, models, fonts) needs a sibling error boundary; otherwise one bad asset hangs the route.
4. **Null-state booleans are a third value** — `useReducedMotion()` returns `null` until first paint; treating it as falsy (or truthy) silently flashes the wrong UI. Default branch must handle null explicitly.
5. **Scroll-to-world coordinate alignment** — when scroll pixels drive a 3D camera, the multiplier and the world-unit gap must be defined together, ideally as one derived constant.
6. **Project convention: no `eslint-disable` on real warnings** — must appear in every frontend-expert prompt going forward; pair with the React 19 pattern (`useSyncExternalStore` for external/browser state, lazy `useState` initializer for one-shot SSR-safe reads).
7. **Dynamic-import `loading: null` + opacity-0 overlay = invisible dead zone** — at least one of the two must be interactive or absent.

## Round Budget Strategy (Round 3 of 5)

Two of three remaining Must Fix items are "round-1 fix didn't fix the thing." To avoid a third regression:

- **Prescribe the exact DOM/CSS end-state**, not the intent. For MF-6: "after fix, WebGLSection is `position: static` with `height: galleryHeight`; FallbackGrid is `position: absolute inset-0 pointer-events-none opacity-0` once `webglReady === true`, and `position: static pointer-events: auto opacity-100` while `webglReady === false`." No interpretation room.
- **Require a verification artifact** in the fix log: pasted computed styles for both elements in both states, or a Playwright snippet asserting it.
- **Forbid `eslint-disable`** in the prompt explicitly; cite `useSyncExternalStore` by name for the WebGL-support hook.
- **Bundle the three Must Fix together** with one combined acceptance check so the fixer cannot ship a partial fix that breaks the other.

With prescribed end-state, verification artifact, and a single combined acceptance, round 3 should close all three Must Fix and leave rounds 4–5 for Should Fix triage. If round 3 produces another regression on the same surface, escalate: this is a frontend-expert capability ceiling at the React-CSS-WebGL three-way boundary, and the work should move to a more senior model or be split (CSS layout to one fixer, hook rewrite to another).
