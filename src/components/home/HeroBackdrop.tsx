"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import { WebGLCanvas } from "@/components/ui/webgl-canvas";

// Vertex: tiny ambient drift in screen-plane; subtle, almost imperceptible.
const VERT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.x += sin(uTime * 0.30 + position.y * 2.0) * 0.012;
    p.y += cos(uTime * 0.25 + position.x * 2.0) * 0.010;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// Fragment: radial pull toward the cursor (UV-space) + faint chromatic split.
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2  uMouse;

  float circle(vec2 p, vec2 c, float r, float blur) {
    return smoothstep(r, r - blur, distance(p, c));
  }

  void main() {
    vec2 uv = vUv;
    float d = circle(uv, uMouse, 0.35, 0.20);
    uv += (uv - uMouse) * d * 0.10;

    // restrained RGB split — reads as "expensive print," not "glitch art"
    float o = 0.0025;
    float r = texture2D(uTexture, uv + vec2(o, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(o, 0.0)).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

interface BackdropPlaneProps {
  src: string;
}

function BackdropPlane({ src }: BackdropPlaneProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(src);
  const { viewport } = useThree();

  // Smoothed mouse position in [0, 1] UV space.
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  // Window-level pointer tracking — the canvas has pointer-events-none so we
  // can't rely on R3F's onPointerMove. This wires it ourselves.
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.tx = e.clientX / window.innerWidth;
      // y is flipped because UV origin is bottom-left
      mouse.current.ty = 1 - e.clientY / window.innerHeight;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [texture]
  );

  // Dispose on unmount — same lifecycle discipline as ImagePlane.
  useEffect(
    () => () => {
      matRef.current?.dispose();
      meshRef.current?.geometry.dispose();
    },
    []
  );

  useFrame((_state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;

    // Smooth pursuit so the cursor feels weighted, not snappy.
    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      mouse.current.tx,
      0.04
    );
    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      mouse.current.ty,
      0.04
    );
    matRef.current.uniforms.uMouse.value.set(
      mouse.current.x,
      mouse.current.y
    );
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface HeroBackdropProps {
  /** Public URL of the painting to render (e.g. `/art/p02-01.jpg`). */
  src: string;
}

/**
 * Ambient WebGL plane that sits behind the Hero text. Renders a featured
 * painting with a slow drift + faint cursor-pulled distortion + chromatic
 * split. Falls back to nothing (the Hero looks complete without it) on
 * reduced-motion or no-WebGL.
 *
 * The wrapper is `pointer-events-none` so the Hero's CTAs receive clicks
 * cleanly — pointer tracking happens via a window listener instead.
 */
export function HeroBackdrop({ src }: HeroBackdropProps) {
  return (
    <WebGLCanvas wrapperClassName="absolute inset-0 -z-10 opacity-25 pointer-events-none">
      <BackdropPlane src={src} />
    </WebGLCanvas>
  );
}
