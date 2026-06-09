# Contributing

This site is built to be edited by hand. There is no CMS, no build step for
content, and no manifest to regenerate. Two flows you'll actually use:

---

## Adding a painting

1. **Drop the JPEG into `public/art/`.**
   Use a kebab-case filename — it becomes the URL slug.
   Recommended: ≤1600px on the long edge, JPEG, ≤500KB.

   ```
   public/art/mountain-stream-01.jpg
   ```

2. **Add one entry to `src/content/works.ts`.**
   Only `file` is strictly required; everything else is optional and falls
   back to sensible defaults.

   ```ts
   {
     file: "mountain-stream-01.jpg",   // matches /public/art/<file>
     title: "Mountain Stream",          // optional, defaults to "Untitled"
     year: 2024,                        // optional
     medium: "acrylic",                 // optional
     orientation: "landscape",          // optional, auto-inferred from dims
     category: "landscape",             // optional grouping label
     featured: true,                    // optional, surfaces on the homepage
     description: "...",                // optional 1–2 sentence note
   }
   ```

3. **Done.** The portfolio page picks it up automatically on next build / dev
   reload — no script to run, no manifest to regen.

### Replacing a painting

Overwrite the file under the same name, or drop a new file and update the
matching entry's `file`. Browser-side caching may need a hard refresh.

---

## Adding a Paint N Sip event *(planned — Phase 3)*

Phase 3 will introduce `src/content/events.ts` with the same drop-in
ergonomics. Planned schema (subject to refinement):

```ts
{
  slug: "spring-paint-n-sip-2026",       // URL slug
  title: "Spring Paint N Sip",
  date: "2026-04-12",                     // ISO 8601
  time: "6:00pm – 8:30pm",
  venue: "Studio · Anaheim Hills",
  address: "...",                         // optional
  capacity: 12,                           // seats
  price: 65,                              // USD
  description: "...",                     // 2–3 sentence pitch
  image: "spring-2026.jpg",               // /public/events/<image>
  status: "open" | "waitlist" | "sold-out" | "past",
  signupUrl: "https://..."                // external ticketing
}
```

Same idea: drop an image into `public/events/`, add one entry to
`src/content/events.ts`, done.

---

## Code conventions

- **Server components by default.** Add `"use client"` only when you need
  state, refs, browser APIs, or framer-motion interactivity.
- **Tailwind v4 only** — palette and font tokens live in `src/app/globals.css`
  under `@theme`. Do not add a `tailwind.config.*` file.
- **Components folder layout:** site chrome under `src/components/site/`,
  reusable primitives under `src/components/ui/`.
- **No emoji in source files** unless explicitly part of UI copy.
