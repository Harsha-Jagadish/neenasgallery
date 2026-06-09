import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Static paintings live in /public/art and are served via plain <img>
    // tags + next/image with no remote sources for now. Add remotePatterns
    // here if a CDN is wired up later.
    remotePatterns: [],
  },
  experimental: {
    // Wraps client-side navigation in document.startViewTransition() so the
    // browser does a cinematic crossfade between routes. Elements that share
    // a `view-transition-name` (e.g. catalog preview → detail hero) morph
    // smoothly. Unsupported browsers silently fall through to instant nav.
    viewTransition: true,
  },
};

export default nextConfig;
