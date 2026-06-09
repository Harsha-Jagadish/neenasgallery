# Phase 1 — Fix Round 1

**Date:** 2026-06-06
**Fixer agent ID:** a76da46be5b5368ca

## Findings Addressed (all RELATED)

- **M1** — ContactSheet trigger uses `<SheetTrigger render={trigger}>` (Base UI Option A); cloneElement removed; aria-haspopup/expanded/controls now emitted on the rendered Button.
- **M2** — Auto-close after submit via 2.5s `setTimeout` (useRef-tracked, cleaned up on unmount).
- **M3** — Error list keys now use field name, not message string.
- **S5** — Mobile hamburger SheetTrigger wrapped with `<Button variant="ghost" size="icon">` — inherits design-system focus ring + hover.
- **S6** — One-line intent comment above nav-bar CTAs documenting the `size="sm"` choice.
- **S8** — `--color-accent` renamed to `--color-rust` to escape the shadcn semantic remap. No callsites touched (zero references).

## Files Modified

- `src/components/site/ContactSheet.tsx`
- `src/components/site/Nav.tsx`
- `src/components/site/Footer.tsx`
- `src/app/globals.css`

## Gates (verified by orchestrator)

| Gate | Exit |
|---|---|
| `npm run lint` | 0 |
| `npx tsc --noEmit` | 0 |
| `npm run build` | 0 |
| Pre-staged: 43 paintings | ✓ |
| Pre-staged: works.ts intact | ✓ |
| `curl / \| grep -o aria-haspopup` | 3 ✓ |

## Deferred (low priority)

- S4 (Footer mailto key — benign)
- S7 (lucide README note — defer to Phase 5)
- S9, S10 (informational)
- N11–N16 (suggestions)

## Status

**CONVERGED.**
