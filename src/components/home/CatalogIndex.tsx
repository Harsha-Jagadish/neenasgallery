import Image from "next/image";
import Link from "next/link";

import { featuredWorks } from "@/content/works";
import { slugify } from "@/lib/slug";

/**
 * Auto-scrolling horizontal catalog. The row cycles left infinitely via a
 * pure CSS keyframe (`catalog-marquee`) — vertical scroll passes through
 * the section naturally, no pin, no hijack. Hover pauses the loop so you
 * can read; click any card to open detail.
 *
 * Cards keep their mixed widths (landscape vs portrait) for asymmetric
 * rhythm. Doubled card list makes the keyframe's -50% translate seamless.
 */
export function CatalogIndex() {
  const picks = featuredWorks.slice(0, 6);
  // Duplicate so translateX(-50%) loops seamlessly.
  const doubled = [...picks, ...picks];

  return (
    <section className="relative overflow-hidden bg-shell py-20 md:py-28">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
            <span className="text-ink/35">03 &mdash;</span> Catalog
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            Selected works.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink/65 md:text-base">
          A rotating selection from the studio &mdash; hover to pause the
          loop, click any piece to see it whole.
        </p>
      </div>

      {/* Auto-scrolling row. -mx wrapper bleeds to the viewport edges so the
          marquee feels infinite even on narrow viewports. */}
      <div className="mt-14 overflow-hidden md:mt-20">
        <div
          className="catalog-marquee flex w-max items-end gap-6 will-change-transform sm:gap-10 md:gap-16"
          style={{ paddingLeft: "6vw" }}
        >
          {doubled.map((work, i) => {
            const title = work.title ?? "Untitled";
            const slug = slugify(work.file);
            const meta = [work.medium, work.year]
              .filter(Boolean)
              .join(" · ");
            const isLandscape = work.orientation === "landscape";
            const widthClass = isLandscape
              ? "w-[78vw] sm:w-[58vw] md:w-[42vw]"
              : "w-[55vw] sm:w-[42vw] md:w-[24vw]";

            return (
              <Link
                key={`${work.file}-${i}`}
                href={`/portfolio/${slug}`}
                aria-hidden={i >= picks.length}
                tabIndex={i >= picks.length ? -1 : 0}
                className={`group relative block shrink-0 ${widthClass}`}
              >
                <div
                  className="relative h-[55vh] overflow-hidden bg-mist/30"
                  style={{ viewTransitionName: i < picks.length ? `painting-${slug}` : undefined }}
                >
                  <Image
                    src={`/art/${work.file}`}
                    alt={i < picks.length ? title : ""}
                    fill
                    sizes={isLandscape ? "45vw" : "26vw"}
                    priority={i === 0}
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/40">
                      {String((i % picks.length) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-ink md:text-2xl">
                      {title}
                    </h3>
                  </div>
                  {meta && (
                    <p className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55 md:block">
                      {meta}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer link */}
      <div className="mx-auto mt-16 flex w-full max-w-[1600px] justify-end px-6 md:mt-20 md:px-12">
        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-3 font-display text-lg text-ink md:text-xl"
        >
          <span className="relative">
            See the full catalog
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </span>
          <span
            aria-hidden
            className="transition-transform duration-500 ease-out group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
