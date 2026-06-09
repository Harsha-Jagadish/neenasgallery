"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { featuredWorks } from "@/content/works";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SLIDE_COUNT = 3;

/**
 * Gallery-wall presentation. Section pins for ~2.4× viewport while three
 * featured paintings take their turn — each shown WHOLE at natural aspect
 * (`object-contain`). Dark museum-wall surface, drop shadow, soft spotlight.
 *
 * Viewer signposts:
 *   - Big top-right counter ("VIEWING 01 OF 03 — FEATURED WORKS") so the
 *     user immediately knows the section will reveal three pieces.
 *   - Bottom progress hairline that fills rust as the user scrolls.
 *   - "Scroll to advance" mono-cap hint that fades after a few seconds.
 *
 * Smoothness: scrub: 1.2 (snappier than 1.0); crossfade windows widened so
 * the transition feels gradual instead of snappy.
 */
export function StudioInterlude() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);

  const picks = useMemo(() => {
    const landscapes = featuredWorks.filter(
      (w) => w.orientation === "landscape"
    );
    const others = featuredWorks.filter(
      (w) => w.orientation !== "landscape"
    );
    return [...landscapes, ...others].slice(0, SLIDE_COUNT);
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return;
      const slides = slidesRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      if (slides.length < SLIDE_COUNT) return;

      gsap.set(slides[0], { opacity: 1, scale: 1 });
      gsap.set(slides.slice(1), { opacity: 0, scale: 0.97 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: false,
          scrub: 1.2,
        },
      });

      // Widened crossfade windows (0.25→0.5 and 0.55→0.8) so transitions
      // feel gradual rather than sudden.
      tl.to(
        slides[0],
        { opacity: 0, scale: 0.97, ease: "power2.inOut", duration: 0.25 },
        0.25
      );
      tl.to(
        slides[1],
        { opacity: 1, scale: 1, ease: "power2.inOut", duration: 0.25 },
        0.25
      );

      tl.to(
        slides[1],
        { opacity: 0, scale: 0.97, ease: "power2.inOut", duration: 0.25 },
        0.55
      );
      tl.to(
        slides[2],
        { opacity: 1, scale: 1, ease: "power2.inOut", duration: 0.25 },
        0.55
      );

      // Scrubbed progress bar — fills rust 0 → 1 across the entire pin
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      );

      // Counter follow
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          const idx = p < 0.4 ? 0 : p < 0.7 ? 1 : 2;
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });

      // Fade the "scroll to advance" hint after 4s
      if (hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0,
          duration: 0.8,
          delay: 4,
          ease: "power2.out",
        });
      }
    },
    { scope: sectionRef }
  );

  if (picks.length === 0) return null;
  const current = picks[active];
  const currentMeta = [current.medium, current.year]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      ref={sectionRef}
      aria-label="From the studio"
      className="relative bg-ink"
      style={{ height: `${SLIDE_COUNT * 80}svh` }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden"
      >
        {/* Radial spotlight backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(241,235,222,0.10), transparent 60%)",
          }}
        />

        {/* Top row: eyebrow LEFT + prominent counter RIGHT */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-start justify-between gap-4 px-5 pt-12 sm:gap-6 sm:px-6 sm:pt-16 md:px-12 md:pt-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-shell/65 sm:text-[11px] sm:tracking-[0.32em]">
              <span className="text-shell/40">02 &mdash;</span> In the studio
            </p>
            <p className="mt-2 hidden font-mono text-[10px] uppercase tracking-[0.32em] text-shell/45 sm:block">
              Three featured works
            </p>
          </div>

          {/* Big, hard-to-miss counter */}
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-shell/45 sm:tracking-[0.32em]">
              Viewing
            </p>
            <p
              className="mt-1 font-display text-2xl leading-none tracking-tight text-shell sm:text-4xl md:text-5xl"
              style={{
                fontVariationSettings:
                  '"wght" 500, "SOFT" 30, "opsz" 96, "WONK" 0',
              }}
            >
              {String(active + 1).padStart(2, "0")}
              <span className="text-shell/35">
                {" "}
                / {String(picks.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>

        {/* Stacked painting frames */}
        <div className="relative flex flex-1 items-center justify-center px-6 md:px-12">
          {picks.map((w, i) => {
            const dims =
              w.orientation === "landscape"
                ? { width: 1500, height: 1200 }
                : w.orientation === "square"
                  ? { width: 1200, height: 1200 }
                  : { width: 1200, height: 1500 };
            return (
              <div
                key={w.file}
                ref={(el) => {
                  slidesRef.current[i] = el;
                }}
                className="absolute inset-0 flex items-center justify-center px-6 will-change-[opacity,transform] md:px-12"
              >
                <Image
                  src={`/art/${w.file}`}
                  alt={w.title ?? "Untitled"}
                  width={dims.width}
                  height={dims.height}
                  sizes="(min-width: 1024px) 72vw, 90vw"
                  priority={i === 0}
                  className="h-auto max-h-[56vh] w-auto max-w-[92vw] object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] sm:max-h-[64vh] sm:max-w-[86vw]"
                />
              </div>
            );
          })}
        </div>

        {/* Caption (active painting) */}
        <div className="relative z-10 mx-auto mt-2 flex w-full max-w-[1600px] items-end justify-between gap-6 px-6 md:px-12">
          <div key={current.file} className="caption-fade">
            <p
              className="font-display text-2xl italic leading-tight text-shell md:text-3xl"
              style={{
                fontVariationSettings:
                  '"wght" 400, "SOFT" 50, "opsz" 144, "WONK" 0',
              }}
            >
              {current.title ?? "Untitled"}
            </p>
            {currentMeta && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-shell/55">
                {currentMeta}
              </p>
            )}
          </div>
          <p
            ref={hintRef}
            className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-shell/55 md:block"
          >
            <span className="text-shell/35">&darr;</span> Scroll to advance
          </p>
        </div>

        {/* Bottom progress bar — fills rust as user scrolls through the pin.
            This is the key "you are not stuck, your scroll IS doing
            something" signal. */}
        <div className="relative z-10 mx-auto mt-8 mb-10 flex w-full max-w-[1600px] flex-col gap-3 px-6 md:mb-14 md:px-12">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-shell/40">
              Featured works
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-shell/40">
              {String(active + 1).padStart(2, "0")} &mdash;{" "}
              {String(picks.length).padStart(2, "0")}
            </p>
          </div>
          <div
            aria-hidden
            className="relative h-px w-full overflow-hidden bg-shell/15"
          >
            <span
              ref={progressRef}
              className="absolute inset-y-0 left-0 w-full origin-left bg-rust"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
