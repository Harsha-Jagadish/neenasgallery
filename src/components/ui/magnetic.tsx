"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  /** Pull radius in px (cursor enters this region → element starts moving). Default 110. */
  radius?: number;
  /** Strength: 0 = no movement, 1 = full follow. Default 0.28. */
  strength?: number;
  className?: string;
}

/**
 * Wraps a single interactive element (button, link) with a magnetic hover —
 * the element lerps toward the cursor when the cursor enters a small radius
 * around it. Subtle: not "spring-bouncy," more "weighted attention."
 *
 * Reduced-motion: pass-through, no transform.
 *
 * Transform target is a child wrapper, not the child itself, so consumer's
 * styles (focus rings, shadows) stay anchored to the layout box.
 */
export function Magnetic({
  children,
  radius = 110,
  strength = 0.28,
  className,
}: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const moverRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const wrapper = wrapperRef.current;
    const mover = moverRef.current;
    if (!wrapper || !mover) return;

    let raf = 0;
    let cx = 0;
    let cy = 0; // current offset
    let tx = 0;
    let ty = 0; // target offset

    function tick() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (mover) {
        mover.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function onMove(e: MouseEvent) {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const ex = rect.left + rect.width / 2;
      const ey = rect.top + rect.height / 2;
      const dx = e.clientX - ex;
      const dy = e.clientY - ey;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0;
        ty = 0;
      }
    }

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [radius, strength, reduceMotion]);

  return (
    <span ref={wrapperRef} className={className} style={{ display: "inline-block" }}>
      <span ref={moverRef} style={{ display: "inline-block", willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
