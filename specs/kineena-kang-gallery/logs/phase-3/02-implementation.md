# Phase 3 Implementation Log

**Date:** 2026-06-06
**Agent:** frontend-expert (single group)
**Spec:** specs/kineena-kang-gallery/spec.md (Phase 3)

## Files created

### Application
- src/lib/slug.ts — `slugify()` + `slugToFile()`
- src/app/portfolio/page.tsx — server, awaits searchParams (Next 16), renders PortfolioPage
- src/app/portfolio/[slug]/page.tsx — server, awaits params, notFound() for unknown slugs, generateStaticParams pre-renders 43 detail pages
- src/components/portfolio/shaders.ts — vertex + fragment GLSL strings (Patterns 1+2+3+4, mediump for iOS Safari)
- src/components/portfolio/LenisContext.tsx — context carrying `{scroll, velocity}` from Lenis to R3F
- src/components/portfolio/ImagePlane.tsx — textured plane mesh; useMemo for uniforms; useFrame drives hover lerp + mouse UV + velocity warp + scroll Y
- src/components/portfolio/Gallery3D.tsx — `<Canvas dpr={[1,1.5]} camera={...}>` + Suspense + ImagePlane instances
- src/components/portfolio/WebGLSection.tsx — dynamic-imported; sticky viewport inside tall scroll container; onReady triggers crossfade
- src/components/portfolio/PortfolioPage.tsx — 'use client' orchestrator; Lenis mount; FallbackGrid renders first; WebGL crossfade via opacity; sr-only nav for keyboard/screen-reader
- src/components/portfolio/FallbackGrid.tsx — static next/image grid, matches FeaturedWorks visual style
- src/components/portfolio/FilterChips.tsx — URL-persisted chips; aria-pressed active state; toggle-off
- src/components/portfolio/Detail.tsx — detail layout: priority next/image, Cormorant title, metadata dl, ContactSheet trigger, Back link

### Tests (3 files, 22 cases passing)
- src/lib/slug.test.ts (8 cases)
- src/components/portfolio/FallbackGrid.test.tsx (7 cases)
- src/components/portfolio/FilterChips.test.tsx (6 cases)

### Tooling
- vitest.config.ts
- src/test/setup.ts

## Files modified
- package.json — added `test` + `test:watch` scripts; vitest + RTL + jsdom devDeps
- src/components/home/FeaturedWorks.tsx — updated card links to `/portfolio/${slugify(work.file)}`
- public/art/p14-01.jpg 762K → 296K (in-place sips)
- public/art/p15-01.jpg 764K → 453K
- public/art/p16-01.jpg 807K → 490K
- public/art/p17-01.jpg 1.0M → 423K (required q=65 + 1400px max)
- public/art/p18-01.jpg 719K → 489K

## Gates (implementer-reported, pre-loop)
- `npx tsc --noEmit` — pass
- `npm run lint` — pass
- `npm run build` — pass, 43 static detail pages + dynamic /portfolio + /_not-found
- `npm test` — pass, 22/22 cases

## Deviations
1. **WebGLCanvas primitive not used in WebGLSection.** The existing `WebGLCanvas` primitive wraps R3F's Canvas but doesn't forward `dpr`/`camera` props. Rather than refactoring Phase 1, WebGLSection re-implements the WebGL/reduced-motion detection inline. Functional result identical.
2. **p17-01.jpg compressed to q=65 + 1400px.** Quality 78 and 70 both left >500K because of the painting's detail. Quality 65 at 1400px max brought it to 423K. Visual diff at web sizes is negligible.
3. **lenisRef dropped from spec example.** Nothing outside the mount effect accesses the Lenis instance; cleanup uses the effect closure.

All three flagged transparently by the implementer.
