# Phase 1 — Code Review Round 1

**Date:** 2026-06-06
**Reviewer agent ID:** a815aa2fca01ab7aa
**Verdict:** NEEDS ATTENTION

## Findings Summary

| Severity | RELATED | PRE-EXISTING | Total |
|---|---|---|---|
| Must Fix | 3 | 0 | 3 |
| Should Fix | 7 | 0 | 7 |
| Suggestions | 6 | 0 | 6 |

## Must Fix (sending to fixer)

**M1.** ContactSheet `cloneElement` trigger pattern loses `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`. Use `SheetTrigger render={trigger}` (Base UI v1 pattern) OR clone in the missing aria attrs.

**M2.** ContactSheet doesn't reset/close after successful submit — user must manually close. Either auto-close 2-3s after submit OR reset form state immediately so re-open is clean.

**M3.** ContactSheet error list uses error message strings as `key` → React duplicate-key warning risk if two fields surface the same text. Use field-name as key.

## Should Fix (sending S5, S6, S8 to fixer)

**S5.** Nav mobile hamburger `<SheetTrigger>` is unstyled. Wrap with `render={<Button variant="ghost" size="icon" />}` for consistent focus-ring/hover.

**S6.** Inquire button heights inconsistent: nav uses `size="sm"` (h-8), footer uses `size="sm"`. Decide consistent CTA height across the site.

**S8.** `--color-accent` collision: `@theme inline` shadcn remap overrides rust (#a8553a) with mint. `bg-accent` resolves to mint, not rust. Rename rust to `--color-rust` so it survives, OR drop accent from the shadcn semantic remap if it's safe.

## Deferred (low priority)

- S4 Footer mailto key — benign
- S7 lucide-react version README note — defer to Phase 5 polish
- S9 RSC pattern concern — informational only
- S10 components.json baseColor — informational
- All Suggestions N11-N16

## Decision

Fix M1, M2, M3, S5, S6, S8 — 6 surgical changes.
