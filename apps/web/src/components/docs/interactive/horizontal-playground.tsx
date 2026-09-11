'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const SLIDES = [
  { id: '01', title: 'Compositor Acceleration', desc: 'Hardware translate3d pipeline with zero layout thrashing or main-thread lockup.', tag: '120 FPS' },
  { id: '02', title: 'Headless asChild Slot', desc: 'No dummy wrapper divs injected. Seamless CSS Grid and Flexbox compatibility.', tag: 'Radix Pattern' },
  { id: '03', title: 'Native ViewTimeline', desc: 'Compositor-level execution on Chromium browsers with 0 kB JS execution cost.', tag: 'CSS Spec' },
  { id: '04', title: 'Dual-Layer Reduced Motion', desc: 'Automated OS accessibility detection with immediate static fallback.', tag: 'A11y First' },
];

export const HorizontalPlayground: React.FC = () => {
  const [scrubProgress, setScrubProgress] = useState(0);

  // Translate progress into pixel displacement across cards
  const maxSlideDistance = 420;
  const currentOffset = -(scrubProgress / 100) * maxSlideDistance;

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Interactive Horizontal Gallery
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            &lt;HorizontalScroll /&gt;
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Scroll Scrub: <strong className="text-blue-400">{Math.round(scrubProgress)}%</strong>
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-200">Simulate Vertical Scroll Travel</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScrubProgress((p) => Math.max(0, p - 25))}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Previous card"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setScrubProgress((p) => Math.min(100, p + 25))}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Next card"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scrubProgress}
            onChange={(e) => setScrubProgress(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Viewport Strip */}
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-[#060608] p-4 relative shadow-inner">
          <div
            className="flex gap-4 transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: `translate3d(${currentOffset}px, 0px, 0px)` }}
          >
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="w-72 sm:w-80 shrink-0 p-5 rounded-xl border border-zinc-800/80 bg-[#0d0d10] shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-400">{slide.id}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {slide.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{slide.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{slide.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>STICKY BUDGET: 250vh</span>
                  <Zap className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
