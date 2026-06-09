# the Kineena Kang Gallery

An editorial gallery site for Kineena Kang's original paintings and Paint N Sip
events — Next.js 16 + Tailwind v4 + Three.js (R3F), built on shadcn / Base UI.

## Stack

- **Next.js 16** (App Router, RSC by default)
- **React 19** + **Tailwind v4** (`@theme` tokens, no `tailwind.config`)
- **shadcn / Base UI** primitives (Sheet, Dialog, Accordion, Button)
- **Framer Motion** for scroll-reveal + nav chrome
- **Three.js / React-Three-Fiber / drei** (used from Phase 3 onward)
- **Lenis** smooth scroll
- **Cormorant Garamond** (display) + **Inter** (body) via `next/font`

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Project layout

```
src/
  app/                    # App Router pages + globals.css
  components/
    site/                 # Nav, Footer, ContactSheet — site chrome
    ui/                   # shadcn primitives + Reveal + WebGLCanvas
  content/
    site.ts               # nav strings, brand name, email
    works.ts              # painting catalog (edit this to add paintings)
  lib/utils.ts            # cn() helper
public/
  art/                    # painting JPEGs (one entry per file in works.ts)
  brand/kk-logo-banner.jpg
```

## Adding content

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) — adding a painting is two steps:
drop the JPEG into `public/art/`, then add one entry to `src/content/works.ts`.

## Scripts

| | |
|-|-|
| `npm run dev` | Local dev at `:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment

Copy `.env.local.example` to `.env.local` and fill in any values you need
(only `NEXT_PUBLIC_SITE_URL` is consumed by Phase 1).
