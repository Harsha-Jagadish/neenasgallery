# Phase 3 Round 1 — Review Analysis

**Context:** kineena-kang-gallery Phase 3 | Agent: frontend-expert | Round 1 (first review)
**Verdict:** NOT CONVERGED — 6 Must Fix + 12 Should Fix RELATED; 1 PRE-EXISTING suggestion deferred.

## Issue Themes

**1. WebGL/R3F lifecycle hygiene (4 findings: #2, #4, #6, #11)** — Must Fix dominated.
- Lenis `on("scroll")` unsubscribe ignored (#2)
- `shaderMaterial`/`planeGeometry` not disposed → GPU program leak across 43-plane filter remounts (#4)
- `absolute inset-0` collapses WebGLSection so `galleryHeight` is silently ignored (#6)
- `onReady` fires on a hardcoded 300ms timer instead of texture-load state (#11)

**2. React state-driven render perf (1 finding: #3)** — 60 Hz `setScrollState` re-renders the whole tree; needs ref/context.

**3. Spec-literal drift (4 findings: #1, #8, #13, #17)** — AC#9 not-found surface missing; lerp 0.06 ≠ AC#2's 400ms; count label ambiguous; straight quotes vs spec's `*${title}*`.

**4. Accessibility + pointer-event boundary (1 finding: #5)** — `sr-only` focusable-but-invisible; canvas overlay missing `pointer-events-none`.

**5. Shader math correctness (2 findings: #7, #18)** — Global `state.pointer` used where per-plane `e.uv` is required; `circle(blur=0.45 > radius=0.35)` inverts smoothstep.

**6. Dead code / over-engineered APIs (3 findings: #9, #10, #12)** — Clever Lenis type re-export; Suspense on non-async child; dual-arg `navigate` with unused branch.

**7. Layout/Markup defects (1 finding: #16)** — `Detail.tsx` triple-wrapper, no-op `max-h`, hardcoded 4:3 letterboxes portraits.

**8. Test hygiene (2 findings: #14, #15)** — Missing slug roundtrip property test; `URLSearchParams` vs `ReadonlyURLSearchParams` mock drift.

## Root Causes

### Spec Clarity
Strong on visual outcomes (AC#1, #2) but weak on engineering constraints. Lerp speed appeared as "400ms settle" prose — no numeric coefficient, no delta-time guidance, so the implementer picked a tutorial-default 0.06. AC#9 (not-found) buried among page-level ACs and overlooked.

### Prompt Completeness
The prompt did not enumerate R3F lifecycle requirements (geometry/material dispose, listener cleanup, `pointer-events-none` on overlay canvases) despite SKILL.md flagging them as non-negotiable. The implementer pattern-matched a "useFrame + state.pointer" tutorial without adapting to a multi-plane grid where per-plane UV is needed.

### Tool Adequacy
No checklist surfaced for "scroll-driven React state → ref/context migration." Implementer reached for `useState` because that's the obvious tool; no prompt-level nudge toward refs for per-frame data.

### Agent Capability Match
frontend-expert handled React/Next surfaces correctly (filter routing, Server Component split). The gap is consistently at the WebGL/DOM boundary — disposal, pointer events, layout sizing of absolutely-positioned canvas hosts. This is a recurring frontend-expert weak spot when R3F is in scope.

### Feedback Loop Gaps
**Test suite passed all gates yet missed 6 Must Fix.** Unit tests cover pure logic (slug, filter URLs) and DOM rendering, but cannot detect: GPU resource leaks, listener-leak-on-Fast-Refresh, scroll-tick re-render storms, collapsed-container layout bugs, shader edge-order inversions. **No visual regression, no R3F-instance-count assertion, no Lighthouse perf budget gate, no axe a11y gate.** Green tests created false confidence.

## Recurring Patterns (for memory / future prompts)

1. **R3F Lifecycle Checklist** — every shader/geometry primitive needs explicit `dispose()`; every external-lib listener (Lenis, GSAP, IntersectionObserver) needs to call its returned unsubscribe; canvas overlays need `pointer-events-none`.
2. **Per-frame data → ref, not state** — if a value updates inside `useFrame` or a scroll listener, it must live in a ref/imperative context, never `useState`.
3. **Spec literals must be numeric, not prose** — "400ms settle" → "lerp factor 0.12 at 60fps" or "use delta-time lerp targeting 400ms time constant."
4. **Absolutely-positioned canvas hosts need a sized parent** — `absolute inset-0` requires the parent to have explicit height, otherwise computed `galleryHeight` styles are dead.
5. **Mock fidelity** — Next.js hook mocks should match the readonly variants (`ReadonlyURLSearchParams`) the actual API returns.

## Gate-Coverage Note

The test suite's clean signal is misleading for WebGL-heavy work. Six Must Fix issues — including a GPU leak, a listener leak, a 60Hz re-render storm, and a collapsed-layout regression — all passed every existing gate. For future R3F-touching phases, gates must include: (a) renderer instance/program count assertion across mount-unmount cycles, (b) a render-count probe on the page tree during simulated scroll, (c) a Lighthouse or web-vitals budget, (d) axe-core a11y on focus/visibility for `sr-only` patterns. Without these, the green bar means "logic is right," not "the page works."
