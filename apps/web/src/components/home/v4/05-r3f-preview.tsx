'use client';

/**
 * ScrollCraft Section 5: R3F Preview (Alpha)
 * - Headline: "Now leaking into the third dimension."
 * - Prominent corner Alpha badge.
 * - Rotating geometric wireframe tracking scroll progress via R3F Canvas / useScroll3D.
 */

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Reveal, useScrollCraft } from '@scrollcraft/react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const R3F_CODE = `import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import type { Mesh } from 'three';

export function KineticMesh({ target }: { target: HTMLElement | null }) {
  const meshRef = useRef<Mesh>(null);
  
  // Pull-based metrics reader: never double-pumps RAF
  const { tick } = useScroll3D(target, { axis: 'block' });

  useFrame(() => {
    const { progress, velocity } = tick();
    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2;
      meshRef.current.rotation.x = velocity * 0.5 + progress * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 2]} />
      <meshStandardMaterial wireframe color="#38bdf8" />
    </mesh>
  );
}`;

// Dynamic Canvas loader to keep client bundle lean and avoid SSR hydration mismatch
const KineticCanvas = dynamic(
  () =>
    import('@react-three/fiber').then((fiber) => {
      const Canvas = fiber.Canvas;
      const useFrame = fiber.useFrame;

      function WireframeMesh({ progress, velocity }: { progress: number; velocity: number }) {
        const meshRef = useRef<any>(null);

        useFrame(() => {
          if (meshRef.current) {
            meshRef.current.rotation.y = progress * Math.PI * 2;
            meshRef.current.rotation.x = velocity * 0.4 + progress * Math.PI * 0.5;
            meshRef.current.rotation.z = progress * 0.5;
          }
        });

        return (
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <icosahedronGeometry args={[2.2, 2]} />
            <meshStandardMaterial wireframe color="#38bdf8" />
          </mesh>
        );
      }

      return function Scene({ progress, velocity }: { progress: number; velocity: number }) {
        return (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full">
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <WireframeMesh progress={progress} velocity={velocity} />
          </Canvas>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-pulse">Mounting WebGL Context...</span>
      </div>
    ),
  }
);

export function R3FPreviewSection() {
  const [metrics, setMetrics] = useState({ progress: 0, velocity: 0 });
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    const unsub = subscribe((m) => {
      setMetrics({
        progress: m.progress || 0,
        velocity: m.velocity || 0,
      });
    });
    return () => unsub();
  }, [subscribe]);

  return (
    <section id="r3f" className="relative w-full bg-[#050505] py-24 sm:py-32 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="down" distance={15}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold uppercase tracking-wider">Alpha Preview</span>
              <span className="text-zinc-500">&bull;</span>
              <span>@scrollcraft/r3f</span>
            </div>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Now leaking into the <br />
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                third dimension.
              </span>
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans">
              Pull-based scroll metrics synchronization for React Three Fiber. Synchronize 3D meshes without double-pumping RequestAnimationFrame.
            </p>
          </Reveal>
        </div>

        {/* Split Showcase Panel */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Hook Code Snippet */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-mono font-bold text-white">useScroll3D()</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold uppercase">
                    Alpha
                  </span>
                </div>
                <Link
                  href="/docs#r3f"
                  className="text-xs font-mono text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <span>R3F Docs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Invoke <code className="text-red-400 font-mono">tick()</code> inside your native R3F <code className="text-zinc-300 font-mono">useFrame</code> loop. Pulls latest scroll delta synchronously on the render tick.
              </p>

              <CodeViewer code={R3F_CODE} fileName="use-scroll-3d.tsx" />
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Three.js &bull; @react-three/fiber</span>
              <span>Zero RAF Double-Pumping</span>
            </div>
          </div>

          {/* Right: Live Interactive 3D Canvas Preview */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-[#070709] p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[420px]">
            
            {/* Corner Alpha Banner */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono text-red-400 backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span className="font-bold uppercase tracking-wider">Alpha &bull; Active Preview</span>
            </div>

            {/* Canvas Stage */}
            <div className="relative w-full h-[320px] rounded-xl bg-zinc-950/90 border border-zinc-800/80 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0284c715,transparent_70%)] pointer-events-none" />
              
              <KineticCanvas progress={metrics.progress} velocity={metrics.velocity} />

              {/* Scroll prompt hint overlay */}
              <div className="absolute bottom-3 inset-x-0 text-center text-[10px] font-mono text-zinc-500 pointer-events-none">
                &uarr;&darr; Scroll viewport to rotate wireframe mesh
              </div>
            </div>

            {/* Metrics HUD Footer */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Rotation Y</span>
                <span className="text-sky-400 font-bold">{(metrics.progress * 360).toFixed(0)}&deg;</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Velocity Tilt</span>
                <span className="text-red-400 font-bold">{(metrics.velocity * 10).toFixed(1)}&deg;</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
