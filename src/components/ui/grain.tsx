import { cn } from "@/lib/utils";

interface GrainProps {
  /** Opacity 0..1. Default 0.04 — felt, not seen. */
  opacity?: number;
  /** Base frequency for the turbulence (higher = finer grain). Default 0.9. */
  frequency?: number;
  className?: string;
}

/**
 * SVG `feTurbulence` grain overlay. Sits absolutely inside its parent (parent
 * needs `relative`), pointer-events disabled, blends as plain alpha so the
 * underlying palette stays true.
 *
 * Use sparingly — one or two surfaces per page. The point is gallery-print
 * texture, not "noise filter."
 */
export function Grain({
  opacity = 0.04,
  frequency = 0.9,
  className,
}: GrainProps) {
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply",
        className
      )}
      style={{ opacity }}
    >
      <filter id="kk-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.85 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#kk-grain)" />
    </svg>
  );
}
