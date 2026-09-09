'use client';

/**
 * Interactive Parallax Playground Component
 * Provides live visual intuition for parallax speeds, axes, and compositor transforms.
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo } from 'react';
import { RefreshCw, ArrowUpDown, ArrowLeftRight, Sparkles } from 'lucide-react';

export const ParallaxPlayground: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0.2);
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [scrollProgress, setScrollProgress] = useState<number>(50); // 0 to 100

  // Calculate simulated pixel displacement based on a virtual 400px container
  const displacement = useMemo(() => {
    // Center is progress = 50%
    const normalizedDelta = (scrollProgress - 50) * 4; // -200px to +200px travel
    return Math.round(normalizedDelta * speed);
  }, [scrollProgress, speed]);

  const transformStyle = useMemo(() => {
    if (direction === 'vertical') {
      return `translate3d(0px, ${displacement}px, 0px)`;
    }
    return `translate3d(${displacement}px, 0px, 0px)`;
  }, [direction, displacement]);

  return (
    <div className="my-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF9] overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            Interactive Visualizer
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF5A1F] border border-[#FFEDD5] font-semibold">
            Live Compositor Math
          </span>
        </div>
        <button
          onClick={() => {
            setSpeed(0.2);
            setDirection('vertical');
            setScrollProgress(50);
          }}
          className="flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors cursor-pointer"
          title="Reset controls"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Interactive Controls & Viewport Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0A0A0A]">Virtual Scroll Position</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{scrollProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scrollProgress}
              onChange={(e) => setScrollProgress(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1 font-mono">
              <span>Top (0%)</span>
              <span>Center</span>
              <span>Bottom (100%)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0A0A0A]">Speed Multiplier</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">
                {speed > 0 ? `+${speed}` : speed}
              </span>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1">
              <span>-0.5 (Accelerate)</span>
              <span>0.0 (Static)</span>
              <span>+0.5 (Lag behind)</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-[#0A0A0A] block mb-1.5">Displacement Axis</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('vertical')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  direction === 'vertical'
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#0A0A0A]'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Vertical</span>
              </button>
              <button
                type="button"
                onClick={() => setDirection('horizontal')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  direction === 'horizontal'
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#0A0A0A]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Horizontal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Simulated Viewport */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <div className="relative h-56 sm:h-64 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center shadow-inner">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #D1D5DB 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Viewport Centerline */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-[#E5E7EB] pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-[#E5E7EB] pointer-events-none" />

            {/* Ambient Background Object (Lags or stays behind) */}
            <div
              className="absolute w-28 h-28 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] -z-0 transition-transform duration-75"
              style={{
                transform:
                  direction === 'vertical'
                    ? `translate3d(0px, ${Math.round(displacement * 0.4)}px, 0px)`
                    : `translate3d(${Math.round(displacement * 0.4)}px, 0px, 0px)`,
              }}
            />

            {/* Animated Target Element */}
            <div
              className="relative z-10 w-44 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-md transition-transform duration-75 select-none"
              style={{
                transform: transformStyle,
                willChange: 'transform',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1 rounded-md bg-[#FFF7ED] text-[#FF5A1F]">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="font-semibold text-xs text-[#0A0A0A]">
                  Kinetic Target
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                Delta: <span className="font-mono font-semibold text-[#0A0A0A]">{displacement > 0 ? `+${displacement}` : displacement}px</span>
              </div>
            </div>

            {/* Real-time Math HUD Badge */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0A0A]/90 backdrop-blur-sm text-white text-[11px] font-mono">
              <span className="text-[#9CA3AF]">GPU write:</span>
              <span className="text-[#FF5A1F] truncate ml-2 font-semibold">
                style.transform = &quot;{transformStyle}&quot;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
