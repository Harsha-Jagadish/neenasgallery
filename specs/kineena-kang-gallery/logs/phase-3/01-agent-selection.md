# Phase 3 Agent Selection

**Date:** 2026-06-06

## Inputs
- `ai-dev-kit.config.json`: not present → auto-detect path
- Available agents at `~/.claude/agents/`: ai-dev-review-analyst, code-reviewer, fastapi-architect, frontend-expert, quality-gate-tester, skill-reviewer

## File-extension analysis
All Phase 3 files are `.tsx` / `.ts` under Next.js App Router + React 19. Single language/framework.

## Decision
**Single agent group: `frontend-expert`** — matches the agent's stated expertise (Next.js 14/16 App Router, React, TypeScript, Tailwind, Base UI). Used successfully for Phase 1 and Phase 2.

## Files assigned (10 from spec + 3 tests + tooling prereq)
- src/app/portfolio/page.tsx (create — server)
- src/app/portfolio/[slug]/page.tsx (create — server)
- src/components/portfolio/PortfolioPage.tsx (create — client)
- src/components/portfolio/Gallery3D.tsx (create — client, R3F)
- src/components/portfolio/ImagePlane.tsx (create — R3F mesh + shader uniforms)
- src/components/portfolio/shaders.ts (create — GLSL strings)
- src/components/portfolio/FallbackGrid.tsx (create — static next/image grid)
- src/components/portfolio/FilterChips.tsx (create — URL-state chips)
- src/components/portfolio/Detail.tsx (create — detail composition)
- src/lib/slug.ts (create — slugify helper)
- src/lib/slug.test.ts (create — Vitest)
- src/components/portfolio/FallbackGrid.test.tsx (create — Vitest + RTL)
- src/components/portfolio/FilterChips.test.tsx (create — Vitest + RTL)
- Tooling prereqs: vitest + jsdom + @testing-library/react + @testing-library/jest-dom + vitest.config.ts + package.json `test` script
- Image compress prereq: in-place `sips` on 5 oversized JPEGs
