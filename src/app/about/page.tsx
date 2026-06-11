import type { Metadata } from "next";

import { artistAutobiography, artistStatement } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artist statement and brief biography of Neena Kang — a working studio making landscapes, florals, portraits, and Paint N Sip events.",
};

/**
 * /about — verbatim Artist Statement + brief Autobiography from Kineena's
 * portfolio PDF. Cream surface, narrow editorial column, no nav-style noise.
 */
export default function AboutPage() {
  return (
    <main className="bg-cream pt-[var(--nav-h)]">
      <section className="mx-auto max-w-[62ch] px-6 py-24 md:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
          <span className="text-ink/35">&mdash;</span> About
        </p>

        <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.01em] text-ink md:text-5xl">
          Neena Kang.
        </h1>

        <div aria-hidden className="mt-12 h-px w-12 bg-mint" />

        <section className="mt-12">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">
            Artist statement
          </h2>
          <div className="mt-6 space-y-5 text-base leading-[1.75] text-ink/85 md:text-lg">
            {artistStatement.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div aria-hidden className="mt-16 h-px w-12 bg-mint" />

        <section className="mt-12">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">
            Biography
          </h2>
          <div className="mt-6 space-y-5 text-base leading-[1.75] text-ink/85 md:text-lg">
            {artistAutobiography.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
