'use client';

import React, { useState, useMemo } from 'react';
import { Box, Activity, RotateCcw, Sliders, ShieldCheck } from 'lucide-react';
import { ExampleSourceViewer } from './example-source-viewer';

const R3F_SOURCE_CODE = `import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';

function ProductMesh({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Single Unified RAF Loop: pull metrics synchronously inside useFrame
  const { tick } = useScroll3D(targetRef.current);

  useFrame(() => {
    // Zero React re-renders, zero RAF double-pumping
    const { progress, velocity } = tick();

    meshRef.current.rotation.y = progress * Math.PI * 2;
    meshRef.current.rotation.x = velocity * 0.4;
    meshRef.current.position.z = Math.sin(progress * Math.PI) * 1.5;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial metalness={0.8} roughness={0.2} color="#3b82f6" />
    </mesh>
  );
}

export function SpatialProduct3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="h-[250vh] relative">
      <Canvas className="sticky top-0 h-screen">
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} />
        <ProductMesh targetRef={containerRef} />
      </Canvas>
    </div>
  );
}`;

export const ProofR3FSpatial: React.FC = () => {
  const [scrollValue, setScrollValue] = useState<number>(38);
  const [readerMode, setReaderMode] = useState<'tier1' | 'tier2'>('tier1');
  const [autoScrub, setAutoScrub] = useState<boolean>(false);

  // Derived synchronous metrics (mirrors useScroll3D mutable ref architecture)
  const progress = scrollValue / 100;
  const velocity = ((scrollValue - 38) / 100) * 0.6;
  const direction = velocity > 0 ? 1 : velocity < 0 ? -1 : 0;

  // 3D Spatial Geometry Matrix Calculation (Synchronous, zero jitter)
  const productTransform = useMemo(() => {
    const rotX = Math.round(18 + progress * 45);
    const rotY = Math.round(-30 + progress * 140);
    const rotZ = Math.round(progress * 20);
    const scale = (0.92 + Math.sin(progress * Math.PI) * 0.16).toFixed(2);
    return `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
  }, [progress]);

  // Auto scrub toggle
  React.useEffect(() => {
    if (!autoScrub) return;
    let dir = 1;
    let cur = scrollValue;
    const interval = setInterval(() => {
      cur += dir * 1.5;
      if (cur >= 100) {
        cur = 100;
        dir = -1;
      } else if (cur <= 0) {
        cur = 0;
        dir = 1;
      }
      setScrollValue(Math.round(cur));
    }, 25);
    return () => clearInterval(interval);
  }, [autoScrub, scrollValue]);

  return (
    <div id="example-r3f" className="w-full rounded-3xl border border-white/10 bg-[#08080a] p-5 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-cyan-600/10 blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">
              Axis 03 &bull; React Three Fiber Native
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Single Unified RAF Loop
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            R3F Scroll-Linked 3D Synchronizer
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Proves the differentiator nobody else has: GSAP and Lenis have zero native R3F integration and cause
            destructive RAF double-pumping. ScrollCraft provides a pure pull-based <code className="text-cyan-400 font-mono">useScroll3D</code> reader.
          </p>
        </div>

        {/* Engine Mode Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setReaderMode('tier1')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              readerMode === 'tier1'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tier 1: WAAPI Probe
          </button>
          <button
            type="button"
            onClick={() => setReaderMode('tier2')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              readerMode === 'tier2'
                ? 'bg-white/10 text-white font-bold border border-white/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tier 2: JS Fallback
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-6 rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Telemetry & Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Real-time Synchronous Metrics Box */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#090b12] shadow-xl space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-sans font-bold text-white flex items-center gap-1.5 text-xs">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                useScroll3D Mutable Metrics
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Zero React Re-render</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>progress:</span>
              <span className="text-white font-bold">{progress.toFixed(3)} ({Math.round(progress * 100)}%)</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>velocity:</span>
              <span className="text-cyan-300 font-bold">{velocity.toFixed(3)}</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>direction:</span>
              <span className="text-white font-bold">
                {direction === 1 ? '+1 (Forward)' : direction === -1 ? '-1 (Backward)' : '0 (Idle)'}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400 pt-2 border-t border-dashed border-white/10">
              <span>reader driver:</span>
              <span className="text-cyan-400 font-bold truncate">
                {readerMode === 'tier1' ? 'probe.currentTime (WAAPI)' : 'Fallback DOM Reader'}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>R3F loop status:</span>
              <span className="text-emerald-400 font-bold">1 Single Loop (No Double Pump)</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>hook latency:</span>
              <span className="text-emerald-400 font-bold">&lt; 0.02ms / tick</span>
            </div>
          </div>

          {/* Interactive Scrub Control */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Scroll Scrub Position
              </span>
              <span className="font-mono text-cyan-400 text-[11px]">
                {scrollValue}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={scrollValue}
              onChange={(e) => setScrollValue(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setAutoScrub(!autoScrub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  autoScrub
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300'
                }`}
              >
                <RotateCcw className={`w-3 h-3 ${autoScrub ? 'animate-spin' : ''}`} />
                <span>{autoScrub ? 'Stop Auto Orbit' : 'Auto Orbit Simulation'}</span>
              </button>
              <span className="text-[10px] text-zinc-500 font-mono">
                Continuous 60FPS tick
              </span>
            </div>
          </div>

          {/* Technical Differentiation Box */}
          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-[11px] text-zinc-400 leading-normal flex items-start gap-2">
            <span className="text-cyan-400 font-bold text-xs mt-0.5">&gt;</span>
            <span>
              <strong className="text-zinc-200">The Problem Solved:</strong> WebGL canvases have their own requestAnimationFrame loop. Passing React state on scroll causes 60 re-renders per second. ScrollCraft&apos;s <code className="text-cyan-400">tick()</code> pulls directly from mutable refs with zero re-renders.
            </span>
          </div>

        </div>

        {/* Right 3D Spatial Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/3] max-h-[380px] rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950 to-black overflow-hidden flex items-center justify-center p-8 shadow-2xl">
            
            {/* Spatial Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Glowing Focal Point */}
            <div className="absolute w-44 h-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            {/* 3D Kinetic Isometric Product Core */}
            <div
              className="relative transition-transform duration-75 select-none"
              style={{
                transform: productTransform,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Central Metallic Cube Core */}
              <div className="w-36 sm:w-44 h-36 sm:h-44 rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center p-5 text-center relative overflow-hidden">
                {/* Circuit lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                <span className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-2 shadow-lg border border-cyan-500/30">
                  <Box className="w-8 h-8" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Three.js Spatial Core
                </span>
                <span className="text-[10px] font-mono text-cyan-300 mt-1">
                  useFrame(tick)
                </span>
              </div>
            </div>

            {/* Floating Telemetry Badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono">
              <span className="text-zinc-400">R3F invocation:</span>
              <span className="text-cyan-400 font-semibold truncate ml-2">
                const &#123; tick &#125; = useScroll3D(canvasRef)
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Code Reveal Panel */}
      <ExampleSourceViewer
        fileName="SpatialProduct3D.tsx"
        code={R3F_SOURCE_CODE}
      />
    </div>
  );
};
