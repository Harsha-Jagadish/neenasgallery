"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { featuredWorks } from "@/content/works";
import { slugify } from "@/lib/slug";

/**
 * Editorial 4-up grid of `featured: true` paintings.
 *
 * Card treatment: subtle lift on hover (-translate-y-1), slow image zoom
 * (1.05), and a mint hairline that draws from the title to the right.
 * The whole row enters with a staggered scroll reveal.
 *
 * "See all paintings" sits below as a typographic link, not a button —
 * underline draws on hover, arrow translates right.
 */
export function FeaturedWorks() {
  const reduceMotion = useReducedMotion();
  const picks = featuredWorks.slice(0, 4);

  return (
    <section className="bg-shell py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/55">
              Featured &middot; From the catalog
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              Selected works.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/70 md:text-base">
            A small rotating selection from the studio &mdash; the rest of
            the catalog lives on the portfolio page.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {picks.map((work, i) => {
            const title = work.title ?? "Untitled";
            return (
              <motion.li
                key={work.file}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={
                  reduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: "-10%" }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: i * 0.08,
                      }
                }
              >
                <Link
                  href={`/portfolio/${slugify(work.file)}`}
                  className="group block transition-transform duration-500 ease-out hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-mist/30">
                    <Image
                      src={`/art/${work.file}`}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg text-ink md:text-xl">
                      {title}
                    </h3>
                    <span
                      aria-hidden
                      className="h-px w-6 origin-left scale-x-0 bg-mint transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </div>
                  {work.medium && (
                    <p className="mt-1 text-xs uppercase tracking-widest text-ink/55">
                      {work.medium}
                    </p>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 font-display text-lg text-ink md:text-xl"
          >
            <span className="relative">
              See all paintings
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
      </div>
    </section>
  );
}
