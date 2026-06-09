# `/public/art/`

Catalog of artwork images served directly by Next.js (URL: `/art/<filename>`).

## Adding a new painting (the easy way)

1. Drop the JPEG here. Use kebab-case (e.g. `mountain-stream-01.jpg`). Target ≤1600px wide, JPEG, ≤500KB.
2. Add **one entry** to `/src/content/works.ts` referencing the file:
   ```ts
   { file: "mountain-stream-01.jpg", title: "Mountain Stream", medium: "acrylic" }
   ```
3. Done. The portfolio picks it up automatically. No build script, no manifest regen.

## Replacing an existing painting

- Drop the new file with the same filename (overwrite).
- Or use a new filename and update the entry in `works.ts`.

## File provenance

Initial 43 paintings (filenames `pNN-NN.jpg`) were extracted from `Art Portfolio.pdf` on 2026-06-06.
Filenames preserve their PDF page + position so the source is traceable. Rename freely as cleaner
titles become available; just update the `file` field in `works.ts` to match.
