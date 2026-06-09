"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";

import { site } from "@/content/site";
import { ContactSheet } from "@/components/site/ContactSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MESH_COLORS = ["#1c1f24", "#a8553a", "#cef0ef", "#1c1f24"];

/**
 * Two-anchor nav:
 *   - Top-left: KK monogram (home link). Inverts against any bg via
 *     `mix-blend-difference`, so it reads on light Hero and dark Interlude
 *     without scroll-state logic.
 *   - Bottom-right: a high-contrast floating capsule labelled "MENU" with
 *     a mint accent dot + slow attention-pulse. Always discoverable.
 *
 * The Menu opens a fullscreen takeover: dark ink surface, slow brand-palette
 * MeshGradient backdrop, massive numbered Fraunces menu items (mint on hover),
 * mailto and ContactSheet at the bottom. Esc + close-button dismiss; body
 * scroll is locked while open.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* === Top-left monogram (mix-blend-difference, inverts on dark sections) === */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mix-blend-difference">
        <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-7">
          <Link
            href="/"
            aria-label={site.name}
            className="font-display text-xl tracking-[0.04em] text-shell focus-visible:outline-2 focus-visible:outline-shell focus-visible:outline-offset-4 md:text-2xl"
            style={{
              fontVariationSettings:
                '"wght" 600, "SOFT" 0, "opsz" 24, "WONK" 0',
            }}
          >
            {site.monogram}
          </Link>
          <span aria-hidden />
        </div>
      </div>

      {/* === Floating bottom-right MENU pill — bigger + always-pulsing === */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className={cn(
          "group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-mint/40 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-shell shadow-[0_14px_45px_-10px_rgba(28,31,36,0.55)] transition-all duration-300 hover:scale-105 hover:bg-rust hover:shadow-[0_18px_55px_-10px_rgba(168,85,58,0.55)] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4 sm:gap-3 sm:px-6 sm:py-4 sm:text-[13px] md:bottom-8 md:right-8 md:px-7",
          !open && !reduceMotion && "menu-pulse"
        )}
      >
        <span
          aria-hidden
          className="relative flex h-3 w-3 items-center justify-center"
        >
          <span
            aria-hidden
            className="absolute h-3 w-px bg-mint transition-transform duration-300 group-hover:rotate-180"
          />
          <span
            aria-hidden
            className="absolute h-px w-3 bg-mint"
          />
        </span>
        Menu
      </button>

      {/* === Fullscreen overlay === */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink text-shell"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {!reduceMotion && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{ filter: "blur(70px)" }}
              >
                <MeshGradient
                  colors={MESH_COLORS}
                  distortion={0.7}
                  swirl={0.35}
                  grainMixer={0.2}
                  grainOverlay={0.0}
                  speed={0.5}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

            <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-5 md:px-12 md:py-7">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  aria-label={site.name}
                  className="font-display text-xl tracking-[0.04em] text-shell md:text-2xl"
                  style={{
                    fontVariationSettings:
                      '"wght" 600, "SOFT" 0, "opsz" 24, "WONK" 0',
                  }}
                >
                  {site.monogram}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-shell focus-visible:outline-2 focus-visible:outline-shell focus-visible:outline-offset-4"
                  aria-label="Close menu"
                >
                  Close
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-rust transition-transform duration-300 group-hover:scale-150"
                  />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center">
                <ul className="space-y-1 md:space-y-3">
                  {site.nav.map((item, i) => (
                    <NavOverlayItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      index={i + 1}
                      onSelect={() => setOpen(false)}
                      delay={reduceMotion ? 0 : 0.08 + i * 0.06}
                    />
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col items-start justify-between gap-6 border-t border-shell/15 pt-6 md:flex-row md:items-end">
                <ContactSheet
                  defaultSubject="Hello from the gallery site"
                  trigger={
                    <Button
                      variant="default"
                      onClick={() => setOpen(false)}
                      className="bg-shell text-ink hover:bg-shell/90 focus-visible:outline-shell"
                    >
                      Start a conversation
                    </Button>
                  }
                />
                <a
                  href={`mailto:${site.email}`}
                  className="font-mono text-[11px] uppercase tracking-[0.32em] text-shell/70 hover:text-shell"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavOverlayItemProps {
  href: string;
  label: string;
  index: number;
  delay: number;
  onSelect: () => void;
}

function NavOverlayItem({
  href,
  label,
  index,
  delay,
  onSelect,
}: NavOverlayItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className="block"
    >
      <Link
        href={href}
        onClick={onSelect}
        className="group flex items-baseline gap-6 py-2 md:gap-10 md:py-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-shell/40 transition-colors duration-300 group-hover:text-mint">
          {String(index).padStart(2, "0")}
        </span>
        <span
          className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.92] tracking-[-0.02em] text-shell transition-all duration-500 group-hover:text-mint"
          style={{
            fontVariationSettings:
              '"wght" 500, "SOFT" 60, "opsz" 144, "WONK" 0',
          }}
        >
          {label}
        </span>
      </Link>
    </motion.li>
  );
}
