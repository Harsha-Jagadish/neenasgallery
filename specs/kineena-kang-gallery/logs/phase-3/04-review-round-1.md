# Phase 3 — Round 1 Code Review

**Date:** 2026-06-06
**Agent:** code-reviewer
**Scope:** Phase 3 files only (Phase 1/2 surfaces tagged `[PRE-EXISTING]` if encountered)

## Findings Summary

| Severity | RELATED | PRE-EXISTING |
|---|---|---|
| Must Fix | 6 | 0 |
| Should Fix | 12 | 0 |
| Suggestion | 5 | 1 |

## Must Fix (RELATED)

1. **`src/app/portfolio/[slug]/not-found.tsx` missing** — AC#9 calls for a custom not-found surface; only the framework default exists.
2. **`PortfolioPage.tsx:72-74` — Lenis `on("scroll", …)` listener never unsubscribed.** Returns an unsubscribe fn; cleanup only calls `destroy()`. Stale closure risk on Fast Refresh.
3. **`PortfolioPage.tsx:57-86` — `setScrollState` on every scroll tick** triggers 60Hz re-render of the whole portfolio tree (filter chips, sr-only nav, 43-card FallbackGrid). Will tank Lighthouse Performance. Should use a ref-based context that updates imperatively.
4. **`ImagePlane.tsx:32-41` — GPU resource leak.** `<shaderMaterial>`/`<planeGeometry>` not disposed on unmount; with 43 planes mounting/unmounting across filter changes, WebGL programs accumulate. SKILL.md explicitly lists this as non-negotiable.
5. **`ImagePlane.tsx:80` + `PortfolioPage.tsx:120,144-153` — no visible focus indicator + pointer-events leak.** `sr-only` nav is focusable but invisible (AC#6 visually broken). Canvas overlay lacks `pointer-events-none` so grid receives stray clicks.
6. **`PortfolioPage.tsx:144-145` — `absolute inset-0` collapses WebGL section to grid intrinsic height.** WebGLSection's `height: galleryHeight` is ignored, so scroll travel is too short and AC#1 ("planes drift vertically with scroll") visibly under-travels.

## Should Fix (RELATED)

7. `ImagePlane.tsx:55-59` — `state.pointer` (global canvas pointer) used as `uMouse`; should use `onPointerMove` with `e.uv` for per-plane local UV.
8. `ImagePlane.tsx:47-51` — lerp factor `0.06` settles in ~800ms, not the spec'd 400ms (AC#2). Use ~0.12 or delta-time lerp.
9. `PortfolioPage.tsx:5` — `import Lenis, { type default as Lenis_ }` is needlessly clever; `Lenis` itself works as a type.
10. `PortfolioPage.tsx:106-113` — `<Suspense>` around `FilterChips` is dead code on this dynamic route.
11. `WebGLSection.tsx:26-31` — `onReady` fires after a 300ms timer regardless of texture-load state; will fade in blank planes on slow networks (AC#10 says crossfade after Canvas mounts).
12. `FilterChips.tsx:34-46` — dual-arg `navigate(medium, category)` API exercises a never-used both-set branch.
13. `PortfolioPage.tsx:101-104` — "N paintings — filtered" shows the filtered count without giving the user the unfiltered total.
14. `slug.test.ts` — missing roundtrip property test (`slugify(slugToFile(x)) === x`).
15. `FilterChips.test.tsx:11` — `useSearchParams` mocked as `URLSearchParams`, not `ReadonlyURLSearchParams`.
16. `Detail.tsx:26-40` — triple-wrapper for a single `next/image`; outer `max-h-[80vh]` is a no-op; hard-coded 4:3 width/height letterboxes portrait paintings.
17. `Detail.tsx:73` — `defaultSubject` uses straight quotes; AC#8 literal is asterisks `*${title}*` (minor spec drift).
18. `shaders.ts:48` — `circle(uv, uMouse, 0.35, 0.45)` has `blur > radius`, which inverts the smoothstep edge order — visual sanity check needed.

## Suggestions (RELATED)

19. `portfolio/page.tsx:23` — type widening via `as readonly (typeof works)[number][]` is unclear; prefer `let filtered: readonly Work[] = works`.
20. `portfolio/page.tsx:26` — `medium as Medium` is an unchecked cast on raw URL input; validate against `mediums` helper.
21. `Gallery3D.tsx:34-41` — orientation→aspect ternary should be a named helper.
22. `Detail.tsx:55-56` — `capitalize` + `.replace(/-/g, " ")` is a presentation hack for `mixed-media`.
23. `slug.ts:9-11` — JSDoc examples miss the `some.file.jpg → some.file` surprise case (which the test covers).

## Suggestions (PRE-EXISTING)

24. `WebGLCanvas.tsx:46` — `// eslint-disable-next-line react-hooks/set-state-in-effect` without inline rationale. Generates deficiency spec.

## Triage Outcome

- **NOT CONVERGED.** RELATED Must Fix and Should Fix exist; fix round needed.
- Send only RELATED Must Fix + Should Fix to the fixer. Suggestions deferred to a possible bonus round.
- Generate deficiency spec for the 1 PRE-EXISTING suggestion (item 24).
- Spawn analyst in background for pattern tracking.
