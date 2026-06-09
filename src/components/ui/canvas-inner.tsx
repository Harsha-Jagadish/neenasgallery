"use client";

// Tiny client-only module that re-exports React-Three-Fiber's <Canvas>.
// Lives in its own file so the outer <WebGLCanvas> wrapper can pull it in
// via `next/dynamic({ ssr: false })` without bundling R3F on the server.

export { Canvas } from "@react-three/fiber";
