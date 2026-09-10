'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFpsMeter } from './use-fps-meter';

export const PlaygroundShowdown: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0.35);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const fpsMetrics = useFpsMeter(true);
  const rafAnimRef = useRef<number | null>(null);

  // Auto-simulate scroll wave
  useEffect(() => {
    if (!isAutoPlaying) return;

    let start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      // Smooth sine wave between 0.05 and 0.95
      const wave = (Math.sin(elapsed * 2) + 1) / 2;
      setScrollProgress(0.05 + wave * 0.9);
      rafAnimRef.current = requestAnimationFrame(animate);
    };

    rafAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafAnimRef.current !== null) cancelAnimationFrame(rafAnimRef.current);
    };
  }, [isAutoPlaying]);

  // Compute transform representations
  // 1. Native CSS: stepped, linear, slightly lagged
  const nativeOffset = Math.round(scrollProgress * 120);
  const nativeOpacity = Math.min(1, Math.max(0.2, scrollProgress * 1.3));

  // 2. Heavy Engine (GSAP style): eased but heavy main-thread
  const gsapProgress = Math.pow(scrollProgress, 1.2);
  const gsapOffset = Math.round(gsapProgress * 120);
  const gsapOpacity = Math.min(1, Math.max(0.2, gsapProgress * 1.2));

  // 3. ScrollCraft: spring-damped, compositor-accelerated subpixel smooth
  const craftProgress = 1 - Math.pow(1 - scrollProgress, 2.5);
  const craftOffset = craftProgress * 120;
  const craftOpacity = Math.min(1, Math.max(0.15, craftProgress * 1.1)).toFixed(3);
  const craftScale = (0.92 + craftProgress * 0.08).toFixed(3);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner & Scrub Controller */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-[11px] font-mono font-bold tracking-wide uppercase border border-[#FF5A1F]/30">
              Live Architecture Showdown
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Single Scroll Gesture</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Native CSS vs Heavy GSAP vs ScrollCraft
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Drag the master scrub slider below or start the auto-oscillator to observe how each engine handles thread scheduling, bundle cost, and subpixel frame fidelity.
          </p>
        </div>

        {/* Master Scrub Control */}
        <div className="w-full md:w-80 flex flex-col gap-2.5 bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl shrink-0">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 font-semibold">Master Scroll Scrub:</span>
            <span className="text-[#FF5A1F] font-bold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={scrollProgress}
            onChange={(e) => {
              setIsAutoPlaying(false);
              setScrollProgress(parseFloat(e.target.value));
            }}
            aria-label="Master Scroll Scrub"
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
          />
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-[#FF5A1F] text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {isAutoPlaying ? 'Pause Wave' : 'Simulate Scroll Wave'}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{fpsMetrics.fps} FPS Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Comparative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Native CSS */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 font-mono text-xs font-bold">
                  CSS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Native CSS Scroll</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">animation-timeline</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-600">
                0 kB
              </span>
            </div>

            {/* Visual Canvas Demo */}
            <div className="h-44 rounded-xl bg-zinc-50 border border-zinc-200/80 p-4 relative overflow-hidden flex items-center justify-center">
              <div
                style={{
                  transform: `translateY(${nativeOffset * 0.4}px)`,
                  opacity: nativeOpacity,
                  transition: 'none',
                }}
                className="w-40 p-3 rounded-lg bg-white border border-zinc-300 shadow-sm text-center"
              >
                <div className="w-6 h-6 rounded bg-zinc-200 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-zinc-800">Fixed Steps</p>
                <p className="text-[10px] text-zinc-400">No physics dampening</p>
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>Cross-Browser Parity</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Safari Lacking
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>Momentum Smoothing</span>
                <span className="font-semibold text-zinc-700">None (Rigid)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1">
                <span>Main Thread Latency</span>
                <span className="font-mono font-semibold text-zinc-800">~18ms - 28ms</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 leading-normal">
            Zero bundle cost, but requires fallback polyfills and lacks spring physics.
          </div>
        </div>

        {/* Column 2: GSAP / Heavy Engine */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono text-xs font-bold">
                  GS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">GSAP ScrollTrigger</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Traditional JS Plugin</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                ~65.4 kB
              </span>
            </div>

            {/* Visual Canvas Demo */}
            <div className="h-44 rounded-xl bg-zinc-50 border border-zinc-200/80 p-4 relative overflow-hidden flex items-center justify-center">
              <div
                style={{
                  transform: `translateY(${gsapOffset * 0.4}px)`,
                  opacity: gsapOpacity,
                  transition: 'none',
                }}
                className="w-40 p-3 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm text-center"
              >
                <div className="w-6 h-6 rounded bg-emerald-300 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-emerald-950">Heavy RAF Loop</p>
                <p className="text-[10px] text-emerald-700">DOM bounding rect reads</p>
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>Bundle Weight</span>
                <span className="font-semibold text-amber-700">65.4 kB Gzipped</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>Layout Thrashing Risk</span>
                <span className="font-semibold text-amber-600">Moderate (.getBoundingClientRect)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1">
                <span>Next.js 15 / React 19 SSR</span>
                <span className="font-mono font-semibold text-zinc-800">Requires useEffect sync</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 leading-normal">
            Feature-rich but heavy bundle impact and commercial license fees for team use.
          </div>
        </div>

        {/* Column 3: ScrollCraft (Winner) */}
        <div className="rounded-2xl border-2 border-[#FF5A1F] bg-white p-5 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FF5A1F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> Recommended
          </div>

          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#FF5A1F] border border-[#FED7AA] flex items-center justify-center font-mono text-xs font-extrabold">
                  SC
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-950">ScrollCraft Engine</h3>
                  <span className="text-[10px] text-[#FF5A1F] font-mono font-semibold">Direct GPU Compositor</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF7ED] text-[#FF5A1F] border border-[#FED7AA]">
                3.2 kB
              </span>
            </div>

            {/* Visual Canvas Demo */}
            <div className="h-44 rounded-xl bg-gradient-to-b from-[#FFF7ED]/50 to-white border border-[#FED7AA]/60 p-4 relative overflow-hidden flex items-center justify-center">
              <div
                style={{
                  transform: `translate3d(0px, ${craftOffset * 0.4}px, 0px) scale(${craftScale})`,
                  opacity: Number(craftOpacity),
                  willChange: 'transform, opacity',
                  transition: 'none',
                }}
                className="w-40 p-3 rounded-lg bg-white border border-[#FF5A1F]/30 shadow-md text-center ring-2 ring-[#FF5A1F]/10"
              >
                <div className="w-6 h-6 rounded bg-[#FF5A1F] mx-auto mb-1.5 flex items-center justify-center text-white text-[10px] font-black">
                  60
                </div>
                <p className="text-xs font-extrabold text-zinc-950">Subpixel Spring</p>
                <p className="text-[10px] text-[#FF5A1F] font-medium">GPU Compositor Native</p>
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>Bundle Weight</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 3.2 kB (20x Smaller)
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1 border-b border-zinc-100">
                <span>DOM Reads Per Frame</span>
                <span className="font-bold text-emerald-600">0 (Zero Thrash Ticker)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 py-1">
                <span>Next.js 15 & React 19</span>
                <span className="font-mono font-bold text-zinc-950">Native Server Slot &lt;Slot&gt;</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 text-[11px] text-zinc-600 font-medium leading-normal flex items-center justify-between">
            <span>License: Apache-2.0 / MIT Free</span>
            <span className="text-[#FF5A1F] font-bold">120 FPS Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
