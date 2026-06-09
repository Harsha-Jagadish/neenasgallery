# Phase 3 Spec Validation

**Date:** 2026-06-06
**Validator:** Explore agent (Step 1c of /implement pipeline)

## Result

**Status:** 2 warnings (non-blocking, but require implementer awareness)

## Warnings

### Check 3 — Test file coverage / Vitest setup
- Spec Tests subsection mentions:
  - `src/lib/slug.test.ts`
  - `src/components/portfolio/FallbackGrid.test.tsx`
  - `src/components/portfolio/FilterChips.test.tsx`
- These are NOT listed in "Files to Create/Modify" — documentation gap.
- Vitest is NOT configured in `package.json`. No `vitest` dev dep, no `test` script.
- **Implication:** implementer must either set up Vitest + jsdom + RTL OR skip tests and call this out. Setting up Vitest is the right call since the spec deliverables list "Vitest suite passing for slug + FallbackGrid + FilterChips."

### Check 7 — Image budget (AC says ≤500KB per painting JPEG)
Five files exceed budget:
- `p14-01.jpg` — 762K
- `p15-01.jpg` — 764K
- `p16-01.jpg` — 807K
- `p17-01.jpg` — 1.0M
- `p18-01.jpg` — 719K

**Implication:** spec calls for a one-off `sips -Z 1600 -s formatOptions 78 public/art/*.jpg` compress before Phase 3 ships. Implementer should run this on the 5 oversized files (in-place compress).

## Checks that passed

- Check 1: Data sources — `works.ts` helpers (mediums, categories, featuredWorks, worksByCategory, worksByMedium) all present and populated.
- Check 2: Content format — `description` is plain text, no markdown renderer needed.
- Check 4: Cross-component consistency — `FeaturedWorks.tsx` uses `aspect-[4/5]`, `scale-[1.03]` hover, Cormorant title + uppercase tracking-widest medium. FallbackGrid should match. `ContactSheet` API confirmed.
- Check 5: Extractions — N/A.
- Check 6: Pre-staged content — 43 JPEGs, all kebab-case-safe filenames.
- Check 8: Primitives — `reveal.tsx`, `webgl-canvas.tsx`, `canvas-inner.tsx` all present from Phase 1.
