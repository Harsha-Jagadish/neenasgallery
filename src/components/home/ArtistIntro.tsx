"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/**
 * Quote rendered as five visually distinct lines for editorial rhythm
 * (instead of a single paragraph that just wraps).
 */
const QUOTE_LINES = [
  "My goal is to create",
  "works of art that",
  "evoke emotions —",
  "quiet, surprised,",
  "alive.",
];

/**
 * Artist statement as a hero moment, not a passive divider.
 *
 * Layout: asymmetric editorial grid.
 *   Left rail:  massive "04" Fraunces watermark + vertical mono label
 *               "ARTIST STATEMENT" + mint accent line.
 *   Right:      huge serif quote (clamp 2.5rem → 5.5rem) broken into 5
 *               deliberate lines, each revealed via GSAP SplitText word
 *               stagger on scroll-into-view.
 *   Bottom:     "— Kineena Kang" attribution + "Read the full statement →"
 *               link to /about.
 *
 * Background: bg-cream (distinct from CatalogIndex shell above and
 * EventsTeaser shell below — breaks both adjacency-merges).
 */
export function ArtistIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRef = useRef<HTMLSpanElement>(null);
  const sideLabelRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Per-line GSAP SplitText reveal, fired once when section enters view.
      const splits: SplitText[] = [];
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const split = SplitText.create(line, {
          type: "words,chars",
        });
        splits.push(split);
        gsap.set(split.words, { opacity: 0, y: "0.5em", rotate: 2 });
        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          delay: i * 0.12,
        });
      });

      // Big "04" number scales in
      if (numberRef.current) {
        gsap.from(numberRef.current, {
          opacity: 0,
          scale: 0.92,
          y: 16,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }

      // Vertical side label fade
      if (sideLabelRef.current) {
        gsap.from(sideLabelRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }

      // Footer (attribution + read-more) fades in last
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }

      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-cream py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-12 lg:gap-16">
        {/* Left rail: number + vertical label */}
        <aside className="relative flex flex-col gap-6 lg:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
            <span className="text-ink/35">04 &mdash;</span> Artist statement
          </p>
          <div aria-hidden className="h-px w-12 bg-mint" />

          {/* Massive "04" watermark */}
          <span
            ref={numberRef}
            aria-hidden
            className="mt-6 inline-block font-display text-[clamp(8rem,18vw,16rem)] leading-[0.85] tracking-[-0.04em] text-ink/12"
            style={{
              fontVariationSettings:
                '"wght" 500, "SOFT" 100, "opsz" 144, "WONK" 1',
            }}
          >
            04
          </span>

          {/* Vertical side label */}
          <p
            ref={sideLabelRef}
            aria-hidden
            className="mt-4 origin-top-left whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.45em] text-ink/45 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:[writing-mode:vertical-rl] lg:rotate-180"
          >
            One quiet conviction
          </p>
        </aside>

        {/* Right: massive quote rendered as deliberate lines */}
        <div className="flex flex-col justify-center lg:col-span-9 lg:py-12">
          <blockquote
            className="font-display text-[clamp(2.25rem,5.5vw,5.5rem)] italic leading-[1.05] tracking-[-0.02em] text-ink"
            style={{
              fontVariationSettings:
                '"wght" 400, "SOFT" 70, "opsz" 144, "WONK" 0',
            }}
          >
            {QUOTE_LINES.map((line, i) => (
              <span
                key={i}
                ref={(el) => {
                  linesRef.current[i] = el;
                }}
                className="block"
              >
                {line}
              </span>
            ))}
          </blockquote>

          {/* Footer: attribution + read-more link */}
          <div
            ref={footerRef}
            className="mt-16 flex flex-col items-start gap-8 border-t border-ink/15 pt-8 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-10"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/40">
                Statement by
              </p>
              <p className="mt-2 font-display text-2xl tracking-tight text-ink md:text-3xl">
                Kineena Kang
              </p>
            </div>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-ink/70 hover:text-ink"
            >
              <span className="relative">
                Read the full statement
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
      </div>
    </section>
  );
}
