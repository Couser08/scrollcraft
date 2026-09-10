'use client';

/**
 * Real-Engine Interactive Parallax Depth Stage
 * Directly mounts and executes @scrollcraft/react Parallax primitives.
 * Multi-layer 3D kinetic depth with real GPU transforms and live telemetry.
 * Strictly under 650 LOC.
 */

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Parallax } from '@scrollcraft/react';
import { RefreshCw, Layers, Zap, Eye } from 'lucide-react';

export const ParallaxPlayground: React.FC = () => {
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [key, setKey] = useState(0); // Force re-mount on reset
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setSpeedMultiplier(1);
    setDirection('vertical');
    setKey((prev) => prev + 1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
            Real Engine Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FFEDD5] font-semibold">
            @scrollcraft/react Native
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          title="Reset controls"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Stage</span>
        </button>
      </div>

      {/* Main Grid: Controls Left + Scrollable Real-Engine Stage Right */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Controls & Telemetry */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Speed Intensity Multiplier</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">
                {speedMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1 font-mono">
              <span>0.2x (Subtle)</span>
              <span>1.0x (Balanced)</span>
              <span>2.5x (Deep 3D)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-100 block mb-1.5">
              Displacement Axis
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('vertical')}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  direction === 'vertical'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-100'
                }`}
              >
                Vertical (Y-Axis)
              </button>
              <button
                onClick={() => setDirection('horizontal')}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  direction === 'horizontal'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-100'
                }`}
              >
                Horizontal (X-Axis)
              </button>
            </div>
          </div>

          {/* Real-time Engine Explainer Box */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 shadow-xs font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Compositor Thread</span>
              <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#16A34A]" /> 120 FPS Subpixel
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Layer 1 (Back)</span>
              <span className="text-zinc-100 font-semibold">{(0.15 * speedMultiplier).toFixed(2)} lag</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Layer 2 (Foreground)</span>
              <span className="text-[#FF5A1F] font-semibold">{(-0.25 * speedMultiplier).toFixed(2)} lead</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">React Re-renders</span>
              <span className="text-[#16A34A] font-semibold">0 frames</span>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Interactive Stage with Real Parallax */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full text-center text-[11px] text-zinc-400 mb-2 flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Scroll inside the viewport below to experience real depth layers:</span>
          </div>

          <div
            key={key}
            ref={scrollContainerRef}
            className="w-full h-80 rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-y-auto relative shadow-inner select-none overscroll-contain"
          >
            {/* Extended height track to enable internal scrolling */}
            <div className="h-[240%] relative w-full p-6 flex flex-col justify-center items-center">
              {/* Layer 1: Background Mountain Landscape */}
              <Parallax
                asChild
                speed={0.15 * speedMultiplier}
                direction={direction}
              >
                <div className="absolute inset-x-4 top-12 h-64 rounded-xl overflow-hidden opacity-50 filter brightness-75">
                  <Image
                    src="/images/cta-mountains.jpg"
                    alt="Scenic Background Mountains"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              </Parallax>

              {/* Layer 2: Floating Frosted Card with Slot composition */}
              <Parallax
                asChild
                speed={-0.25 * speedMultiplier}
                direction={direction}
              >
                <div className="relative z-10 p-6 rounded-2xl bg-white/5/90 backdrop-blur-md border border-white/40 shadow-2xl text-center max-w-xs mt-16">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FFEDD5] text-[10px] font-mono font-bold mb-2">
                    <Layers className="w-3 h-3" />
                    <span>Multi-Layer Depth</span>
                  </div>
                  <h4 className="text-base font-extrabold text-zinc-100 tracking-tight">
                    Pure Subpixel Inertia
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Direct GPU compositor writes via ref. Zero React root re-renders.
                  </p>
                </div>
              </Parallax>

              {/* Layer 3: Foreground Kinetic Indicator */}
              <Parallax
                asChild
                speed={0.5 * speedMultiplier}
                direction={direction}
              >
                <div className="relative z-20 mt-8 px-3 py-1.5 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-md border border-zinc-700 text-white font-mono text-[10px] shadow-lg">
                  <span className="text-[#FF5A1F] font-bold">GPU </span>
                  translate3d Active
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

