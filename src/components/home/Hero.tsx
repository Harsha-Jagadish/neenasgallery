"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/content/site";

import { HeroEventReel } from "./HeroEventReel";

gsap.registerPlugin(useGSAP, SplitText);

const HEADLINE = "Original paintings & Paint N Sip evenings.";

/**
 * Two-column editorial hero.
 *   Left:  type-first headline (Fraunces variable, GSAP SplitText char reveal,
 *          scroll-driven `font-variation-settings` morph) + body + CTAs.
 *   Right: <HeroEventReel /> — cycling photos from previous Paint N Sip
 *          evenings, captioned underneath. Visual proof of the second half
 *          of the brand promise.
 *
 * On mobile the columns stack; reel sits between the body copy and the CTAs.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current) return;

      const split = SplitText.create(headlineRef.current, {
        type: "chars,words,lines",
        wordsClass: "split-word",
      });

      gsap.set(split.chars, { opacity: 0, y: 24, rotate: 3 });
      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.9,
        stagger: 0.018,
        ease: "power3.out",
        delay: 0.18,
      });

      gsap.from(".hero-fade", {
        opacity: 0,
        y: 10,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.05,
      });

      gsap.from(".hero-reel", {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.45,
      });

      gsap.from(".hero-scroll-cue", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.4,
      });

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-shell text-ink"
    >
      {/* Brand horizon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-mint"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1.5 h-16 bg-gradient-to-b from-mint/40 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 pt-[calc(var(--nav-h)+3rem)] pb-12 md:px-12">
        {/* Top row */}
        <div className="flex items-start justify-between gap-6">
          <p className="hero-fade font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
            <span className="text-ink/35">01 &mdash;</span> {site.name}
          </p>
          <p className="hero-fade font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55 text-right">
            Est. 2026
          </p>
        </div>

        {/* Two-column: headline+body left, reel right */}
        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-7">
            <h1
              ref={headlineRef}
              className="morph-headline max-w-[15ch] font-display text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.02em] text-ink"
              style={{
                fontVariationSettings:
                  '"wght" 400, "SOFT" 0, "opsz" 144, "WONK" 0',
              }}
            >
              {HEADLINE}
            </h1>

            <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <p className="hero-fade max-w-[36ch] text-sm leading-[1.65] text-ink/65 md:text-base">
                A working studio &mdash; landscapes, florals, portraits, and
                a standing invitation to spend an evening with brushes,
                friends, and a glass of something good.
              </p>
              <div className="hero-fade flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button size="lg" render={<Link href="/portfolio" />}>
                    View the work
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button
                    variant="ghost"
                    size="lg"
                    render={<Link href="/events" />}
                  >
                    Upcoming events &rarr;
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="hero-reel lg:col-span-5">
            <HeroEventReel />
          </div>
        </div>

        <div
          className="hero-scroll-cue flex items-center gap-3 md:absolute md:bottom-6 md:left-12"
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/40">
            Scroll
          </span>
          <span className="h-px w-12 bg-ink/30" />
        </div>
      </div>
    </section>
  );
}
