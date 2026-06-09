"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts a Lenis smooth-scroll instance and forwards Lenis scroll events
 * to ScrollTrigger.update so pin/scrub animations stay locked to the
 * smoothed scroll position. Renders nothing.
 *
 * Reverted to the manual rAF loop after the gsap.ticker.add integration
 * was found to interfere with scroll progression. The trade-off is the
 * homepage's StudioInterlude pin may feel marginally less smooth than
 * with the unified ticker, but the page actually scrolls.
 *
 * Only mount this on pages that need smooth scroll (homepage). /portfolio
 * uses native scroll — Lenis was hijacking wheel events without
 * advancing scroll there.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    let id: number;
    function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    }
    id = requestAnimationFrame(raf);

    return () => {
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(id);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
