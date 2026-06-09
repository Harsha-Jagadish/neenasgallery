import { mediums } from "@/content/works";

/**
 * Infinite horizontal marquee of mediums. Reads as a "chapter break"
 * between StudioInterlude and the catalog index — gives the page a
 * horizontal rhythm instead of pure top-to-bottom column.
 *
 * Pure CSS animation; pauses under reduced-motion via globals.css media query.
 */
export function MediumMarquee() {
  // Doubling the items lets the keyframes translate by -50% for a seamless loop.
  const items = mediums.map((m) => m.replace(/-/g, " ").toUpperCase());
  const doubled = [...items, ...items];

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-ink/10 bg-shell py-8 md:py-12"
    >
      <div className="marquee-track flex gap-16 whitespace-nowrap will-change-transform md:gap-24">
        {doubled.map((label, i) => (
          <span key={i} className="flex shrink-0 items-center gap-16 md:gap-24">
            <span
              className="font-display text-3xl tracking-[-0.01em] text-ink/85 md:text-5xl"
              style={{
                fontVariationSettings:
                  '"wght" 400, "SOFT" 30, "opsz" 144, "WONK" 0',
              }}
            >
              {label}
            </span>
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-rust"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
