'use client';

/**
 * Interactive 3D Perspective & R3F Bridge Visualizer
 * Visualizes useScroll3D pull-based metrics (progress, velocity, direction)
 * and the Tier 1 WAAPI vs Tier 2 JS Fallback reader.
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo } from 'react';
import { Box, Activity } from 'lucide-react';

export const Scroll3DPlayground: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(35); // 0 to 100
  const [prevPosition, setPrevPosition] = useState<number>(35);
  const [tierMode, setTierMode] = useState<'tier1' | 'tier2'>('tier1');

  // Derive metrics like useScroll3D tick()
  const progress = scrollPosition / 100;
  const velocity = (scrollPosition - prevPosition) / 100;
  const direction = velocity > 0 ? 1 : velocity < 0 ? -1 : 0;

  const handleSliderChange = (newVal: number) => {
    setPrevPosition(scrollPosition);
    setScrollPosition(newVal);
  };

  // 3D Rotation transforms calculated synchronously
  const cubeTransforms = useMemo(() => {
    const rotateX = Math.round(15 + progress * 50);
    const rotateY = Math.round(-25 + progress * 120);
    const scale = (0.95 + progress * 0.15).toFixed(2);
    return `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }, [progress]);

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
            @scrollcraft/r3f Bridge Simulator
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FFEDD5] font-semibold">
            Zero RAF Conflicts
          </span>
        </div>

        {/* Tier Mode Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setTierMode('tier1')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              tierMode === 'tier1'
                ? 'bg-white/5 text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Tier 1: WAAPI Bridge
          </button>
          <button
            onClick={() => setTierMode('tier2')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              tierMode === 'tier2'
                ? 'bg-white/5 text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Tier 2: JS Fallback
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Controls & Metrics */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Virtual ViewTimeline Progress</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{Math.round(progress * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scrollPosition}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1 font-mono">
              <span>0.0 (Entry)</span>
              <span>0.5 (Center)</span>
              <span>1.0 (Exit)</span>
            </div>
          </div>

          {/* Real-time useScroll3D Metrics Box */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 shadow-xs font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] border-b border-white/10 pb-2 font-sans font-semibold text-zinc-100">
              <span>useScroll3D metrics.current</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                <Activity className="w-3 h-3 animate-pulse" />
                Synchronous
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>progress:</span>
              <span className="text-zinc-100 font-semibold">{progress.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>velocity:</span>
              <span className="text-zinc-100 font-semibold">{velocity.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>direction:</span>
              <span className="text-zinc-100 font-semibold">
                {direction === 1 ? '+1 (Forward)' : direction === -1 ? '-1 (Backward)' : '0 (Idle)'}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-1 border-t border-dashed border-white/10">
              <span>active engine:</span>
              <span className="text-[#FF5A1F] font-semibold">
                {tierMode === 'tier1' ? 'probe.currentTime' : 'ResizeObserver Fallback'}
              </span>
            </div>
          </div>
        </div>

        {/* 3D Visual Canvas */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <div className="relative h-64 sm:h-72 rounded-xl border border-white/10 bg-gradient-to-b from-[#FAFAF9] to-white overflow-hidden flex items-center justify-center p-6 shadow-inner">
            {/* Background Grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #D1D5DB 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* 3D Kinetic Isometric Box Simulation */}
            <div
              className="relative transition-transform duration-75 select-none"
              style={{
                transform: cubeTransforms,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front Face */}
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-white to-[#FAFAF9] border-2 border-[#FF5A1F] shadow-2xl flex flex-col items-center justify-center p-4 text-center">
                <span className="p-2 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] mb-2 shadow-xs">
                  <Box className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold text-zinc-100">Three.js Mesh</span>
                <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  useFrame(tick)
                </span>
              </div>
            </div>

            {/* Floating Telemetry Pill */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0A0A]/90 backdrop-blur-sm text-white text-[11px] font-mono">
              <span className="text-[#9CA3AF]">R3F hook call:</span>
              <span className="text-emerald-400 font-semibold truncate ml-2">
                const &#123; tick &#125; = useScroll3D(canvasRef)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

