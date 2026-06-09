import Link from "next/link";

/**
 * Shown by Next.js when notFound() is called in the [slug] route —
 * i.e. when a URL slug doesn't match any work in the catalog.
 */
export default function NotFound() {
  return (
    <main className="bg-shell pt-[var(--nav-h)]">
      <div className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
        {/* Faint monogram watermark — mirrors the Hero treatment */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 left-4 select-none font-display text-[18rem] leading-none tracking-tight text-ink/[0.06] md:-top-10 md:left-8 md:text-[26rem]"
        >
          KK
        </span>

        <div className="relative mx-auto w-full max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/55">404</p>
          <h1 className="mt-6 max-w-[20ch] font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            This painting doesn&apos;t live here.
          </h1>
          <p className="mt-6 max-w-[45ch] text-base leading-[1.7] text-ink/70 md:text-lg">
            The work you&apos;re looking for may have moved or the link may be
            incorrect.
          </p>
          <div className="mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
            >
              &larr; Back to the gallery
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
