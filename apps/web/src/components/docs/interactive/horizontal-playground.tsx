'use client';

/**
 * Real-Engine Interactive Horizontal Gallery Scrub Sandbox
 * Demonstrates pinning vertical scroll and converting it to horizontal card sliding.
 * Strictly under 650 LOC.
 */

import React, { useState, useRef } from 'react';
import { Zap } from 'lucide-react';

const SLIDES = [
  { id: '01', title: 'Compositor Acceleration', desc: 'Hardware translate3d pipeline with zero layout thrashing.', tag: '120 FPS' },
  { id: '02', title: 'Headless asChild Slot', desc: 'No wrapper divs injected. Seamless CSS Grid compatibility.', tag: 'Radix Pattern' },
  { id: '03', title: 'Native ViewTimeline', desc: 'Compositor-level execution on Chromium browsers with 0 kB JS cost.', tag: 'CSS Spec' },
  { id: '04', title: 'Dual-Layer Reduced Motion', desc: 'Automated OS accessibility detection with immediate fallback.', tag: 'A11y First' },
];

export const HorizontalPlayground: React.FC = () => {
  const [scrubProgress, setScrubProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Translate progress into pixel displacement across cards
  // 4 cards of width 240px + 16px gap = ~1000px total width
  const maxSlideDistance = 450;
  const currentOffset = -(scrubProgress / 100) * maxSlideDistance;

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
            Real Engine Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FFEDD5] font-semibold">
            &lt;HorizontalScroll /&gt;
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Scrub Progress: <strong className="text-[#FF5A1F]">{scrubProgress}%</strong>
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-100">Simulated Vertical Scroll Scrub</span>
            <span className="font-mono text-zinc-500">Slide 1 of 4</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scrubProgress}
            onChange={(e) => setScrubProgress(Number(e.target.value))}
            className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1 font-mono">
            <span>Entry (0%)</span>
            <span>Midpoint (50%)</span>
            <span>Exit (100%)</span>
          </div>
        </div>

        {/* Sliding Horizontal Viewport */}
        <div className="relative w-full h-56 rounded-2xl bg-[#0A0A0A] p-5 overflow-hidden shadow-inner flex items-center">
          <div
            ref={containerRef}
            style={{
              transform: `translate3d(${currentOffset}px, 0px, 0px)`,
              willChange: 'transform',
            }}
            className="flex gap-4 select-none transition-transform duration-100 ease-out"
          >
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="w-64 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#FF5A1F]">{slide.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {slide.tag}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mt-2">{slide.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{slide.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
                  <Zap className="w-3 h-3 text-[#16A34A]" />
                  <span>Hardware Subpixel Interpolation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

