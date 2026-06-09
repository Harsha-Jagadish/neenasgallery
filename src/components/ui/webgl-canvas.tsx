"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// Pull R3F's <Canvas> in client-only — keeps three.js out of the server bundle
// and away from SSR (which would crash on `window`).
const Canvas = dynamic(
  () => import("@/components/ui/canvas-inner").then((m) => m.Canvas),
  { ssr: false }
);

export interface WebGLCanvasProps {
  /** The R3F scene — meshes, lights, custom shader materials. */
  children: React.ReactNode;
  /** Optional fallback shown when WebGL is unavailable or reduced-motion is on. */
  fallback?: React.ReactNode;
  /** Forwarded to the <Canvas>. */
  className?: string;
  /** Forwarded to the wrapping <div>. */
  wrapperClassName?: string;
}

/**
 * Lazy wrapper around React-Three-Fiber's <Canvas>.
 *
 * - Bails out entirely if `prefers-reduced-motion` is set.
 * - Bails out if the browser has no `WebGLRenderingContext`.
 * - Wraps children in <Suspense> with the provided `fallback`.
 *
 * The fallback ALSO renders during the initial paint, so static content is
 * always visible — the canvas swaps in once it's ready.
 */
export function WebGLCanvas({
  children,
  fallback = null,
  className,
  wrapperClassName,
}: WebGLCanvasProps) {
  const reduceMotion = useReducedMotion();
  const [supported, setSupported] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(
      typeof window.WebGLRenderingContext !== "undefined" &&
        (() => {
          try {
            const c = document.createElement("canvas");
            return Boolean(
              c.getContext("webgl") || c.getContext("experimental-webgl")
            );
          } catch {
            return false;
          }
        })()
    );
  }, []);

  if (reduceMotion || supported === false) {
    return <div className={wrapperClassName}>{fallback}</div>;
  }

  // While we're still detecting (supported === null) we render the fallback
  // so the layout slot is always populated.
  return (
    <div className={wrapperClassName}>
      {supported ? (
        <React.Suspense fallback={fallback}>
          <Canvas className={className}>{children}</Canvas>
        </React.Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
