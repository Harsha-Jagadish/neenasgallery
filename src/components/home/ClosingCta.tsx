"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";

import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";
import { Magnetic } from "@/components/ui/magnetic";

const HEADLINE =
  "Commission a piece. Reserve a Paint N Sip seat. Say hello.";

// Brand palette for the morphing mesh — mint, rust, cream, shell.
const MESH_COLORS = ["#cef0ef", "#a8553a", "#f1ebde", "#faf7f1"];

/**
 * Final beat of the homepage. A slow-morphing brand-palette mesh gradient
 * (@paper-design/shaders-react) sits behind the type at low opacity for an
 * atmospheric "lit room" feel — the page exhales into color before the
 * footer. Catalog-numbered eyebrow, word-stagger headline, magnetic CTA.
 */
export function ClosingCta() {
  const reduceMotion = useReducedMotion();
  const words = HEADLINE.split(" ");

  return (
    <section className="relative overflow-hidden bg-shell py-32 md:py-48">
      {/* MeshGradient atmospheric backdrop — silent on reduced-motion */}
      {!reduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{ filter: "blur(40px)" }}
        >
          <MeshGradient
            colors={MESH_COLORS}
            distortion={0.55}
            swirl={0.25}
            grainMixer={0.15}
            grainOverlay={0.0}
            speed={0.35}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-[1200px] px-6 text-center md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
          <span className="text-ink/35">06 &mdash;</span> Say hello
        </p>

        <div aria-hidden className="mx-auto mt-10 h-px w-12 bg-mint" />

        <h2 className="mx-auto mt-12 max-w-[20ch] font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-6xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: "0.35em" }}
              whileInView={
                reduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-15%" }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1] as const,
                      delay: 0.15 + i * 0.05,
                    }
              }
              className="inline-block"
              style={{ marginRight: "0.22em" }}
            >
              {w}
            </motion.span>
          ))}
        </h2>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 1.05 }
          }
          className="mt-12 flex justify-center"
        >
          <Magnetic>
            <ContactSheet
              defaultSubject="Hello from the gallery site"
              trigger={<Button size="lg">Start a conversation</Button>}
            />
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
