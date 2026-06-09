---
discovered_during: kineena-kang-gallery Phase 3 review
discovered_date: 2026-06-06
original_severity: Suggestion
area: ui-primitives
---

# Document rationale for eslint-disable in WebGLCanvas effect

## Issue Description
The `eslint-disable-next-line react-hooks/set-state-in-effect` directive in `webgl-canvas.tsx` lacks an inline rationale, leaving future maintainers without context for why the suppression is justified. The same pattern in `PortfolioPage.tsx` is documented; the primitive should match.

## Location
- File: src/components/ui/webgl-canvas.tsx (~line 46)
- Discovery context: noticed while reviewing Phase 3's PortfolioPage which uses the same pattern with documented rationale
- Review log path: specs/kineena-kang-gallery/logs/phase-3/04-review-round-1.md

## Severity
Suggestion (cosmetic, no functional impact)

## Remediation Approach
Add a one-line comment above the `eslint-disable-next-line` directive explaining that the suppression is required because WebGL support and reduced-motion detection depend on browser APIs (`window.WebGLRenderingContext`, `document.createElement`) that cannot run during render or on the server, so state must be set from within the effect after mount.

## Suggested File Changes
- src/components/ui/webgl-canvas.tsx — add a one-line rationale comment above the eslint-disable
