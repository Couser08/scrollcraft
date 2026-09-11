'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Parallax } from '@scrollcraft/react';
import { RefreshCw, Layers, ArrowUpDown, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';

export const ParallaxPlayground: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0.2);
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [key, setKey] = useState<number>(0);

  const handleReset = () => {
    setSpeed(0.2);
    setDirection('vertical');
    setKey((prev) => prev + 1);
  };

  const handleScrollStep = (delta: number) => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Real &lt;Parallax&gt; Engine Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            @scrollcraft/react
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
          title="Reset controls"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Grid: Controls Left + Real Parallax Showcase Right */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Speed Ratio</span>
              <span className="font-mono text-blue-400 font-semibold">{speed.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={speed}
              onChange={(e) => {
                setSpeed(Number(e.target.value));
                setKey((k) => k + 1);
              }}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>0.05 (Subtle)</span>
              <span>0.20 (Standard)</span>
              <span>0.60 (Deep 3D)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-200 block mb-1.5">
              Displacement Axis
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setDirection('vertical');
                  setKey((k) => k + 1);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  direction === 'vertical'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <ArrowUpDown className="w-3 h-3 text-blue-400" />
                <span>Vertical</span>
              </button>
              <button
                onClick={() => {
                  setDirection('horizontal');
                  setKey((k) => k + 1);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  direction === 'horizontal'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <ArrowLeftRight className="w-3 h-3 text-blue-400" />
                <span>Horizontal</span>
              </button>
            </div>
          </div>

          {/* Quick Page Scroll Driver */}
          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">Page Scroll Driver:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleScrollStep(-180)}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3 h-3" />
                <span>Scroll Up</span>
              </button>
              <button
                onClick={() => handleScrollStep(180)}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3 h-3" />
                <span>Scroll Down</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real @scrollcraft/react <Parallax> Stage */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full text-left text-[11px] text-zinc-400 mb-2 font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Scroll this page to see the 3 real &lt;Parallax&gt; layers move:</span>
          </div>

          <div
            key={key}
            className="w-full h-[320px] rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden relative shadow-2xl flex items-center justify-center p-6"
          >
            {/* Real Library Primitive - Layer 1: Background Landscape */}
            <Parallax
              asChild
              speed={speed * 0.8}
              direction={direction}
            >
              <div className="absolute inset-0 opacity-40 filter brightness-90 pointer-events-none scale-110">
                <Image
                  src="/images/cta-mountains.jpg"
                  alt="Scenic Parallax Background"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
            </Parallax>

            {/* Real Library Primitive - Layer 2: Main Floating Card */}
            <Parallax
              asChild
              speed={-speed * 1.2}
              direction={direction}
            >
              <div className="relative z-10 p-6 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 shadow-2xl text-center max-w-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold mb-2">
                  <Layers className="w-3 h-3" />
                  <span>Real Parallax Primitive</span>
                </div>
                <h4 className="text-base font-extrabold text-white tracking-tight">
                  Direct Compositor Writes
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Translating with speed <span className="text-blue-400 font-mono font-semibold">{(-speed * 1.2).toFixed(2)}</span> on page scroll. Zero re-renders!
                </p>
              </div>
            </Parallax>

            {/* Real Library Primitive - Layer 3: Foreground Kinetic Pill */}
            <Parallax
              asChild
              speed={speed * 1.8}
              direction={direction}
            >
              <div className="absolute bottom-6 right-6 z-20 px-3 py-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-zinc-700 text-white font-mono text-[10px] shadow-2xl">
                <span className="text-blue-400 font-bold">120 FPS </span>
                GPU translate3d
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </div>
  );
};
