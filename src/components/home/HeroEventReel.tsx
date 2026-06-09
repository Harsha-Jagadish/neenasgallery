"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PHOTOS = [
  { src: "/events/paint-n-sip-01.jpg", focus: "object-[60%_center]" },
  { src: "/events/paint-n-sip-02.jpg", focus: "object-[55%_center]" },
  { src: "/events/paint-n-sip-03.jpg", focus: "object-[50%_30%]" },
] as const;

const INTERVAL_MS = 4200;
const FADE_MS = 900;

/**
 * Cycling reel of photos from previous Paint N Sip evenings — lives in the
 * right column of the Hero. Auto-advances every ~4.2s with a slow crossfade.
 * Hover pauses; index dots show position; small caption underneath.
 *
 * `object-position` per photo so the focal point of each crop stays sensible
 * (group shot framed slightly above center; tables/lights centered).
 */
export function HeroEventReel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % PHOTOS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <figure
      className="relative flex flex-col gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist/25 shadow-[0_30px_60px_-20px_rgba(28,31,36,0.25)]">
        {PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 35vw, 90vw"
            priority={i === 0}
            className={`object-cover ${photo.focus}`}
            style={{
              opacity: idx === i ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-out`,
            }}
          />
        ))}

        {/* Index dots — bottom-left, mint = active */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show photo ${i + 1} of ${PHOTOS.length}`}
              className={`block h-1 cursor-pointer rounded-full transition-all duration-500 ${
                idx === i ? "w-8 bg-shell" : "w-2 bg-shell/60 hover:bg-shell"
              }`}
            />
          ))}
        </div>
      </div>

      <figcaption className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
        <span>
          <span className="text-ink/35">Paint N Sip &mdash;</span> previous
          evenings
        </span>
        <span className="text-ink/35">
          {String(idx + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}
