'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HorizontalScroll, useScrollCraft } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Zap, Layers } from 'lucide-react';

const SLIDES = [
  {
    id: '01',
    title: 'Compositor Acceleration',
    desc: 'Hardware translate3d pipeline with zero layout thrashing or main-thread lockup.',
    tag: '120 FPS',
  },
  {
    id: '02',
    title: 'Headless asChild Slot',
    desc: 'No dummy wrapper divs injected. Seamless CSS Grid and Flexbox compatibility.',
    tag: 'Radix Pattern',
  },
  {
    id: '03',
    title: 'Native ViewTimeline',
    desc: 'Compositor-level execution on Chromium browsers with 0 kB JS execution cost.',
    tag: 'CSS Spec',
  },
  {
    id: '04',
    title: 'Dual-Layer Reduced Motion',
    desc: 'Automated OS accessibility detection with immediate static fallback.',
    tag: 'A11y First',
  },
];

export const HorizontalPlayground: React.FC = () => {
  const [speed, setSpeed] = useState<number>(2.0); // 200vh scroll budget

  const sectionRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const directionRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);

  const { subscribe } = useScrollCraft();

  // Telemetry updates strictly via DOM refs (ZERO React re-renders on scroll)
  useEffect(() => {
    const unsub = subscribe((metrics) => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDistance = rect.height - windowH;

      if (totalDistance <= 0) return;

      const scrolledPast = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalDistance));
      const approxTrackWidth = 1280 - (typeof window !== 'undefined' ? window.innerWidth : 1000);
      const offsetPx = -(progress * Math.max(0, approxTrackWidth));

      if (offsetRef.current) offsetRef.current.textContent = `${offsetPx.toFixed(1)} px`;
      if (progressRef.current) progressRef.current.textContent = `${(progress * 100).toFixed(1)}%`;
      if (directionRef.current) {
        directionRef.current.textContent =
          metrics.direction > 0 ? 'EAST →' : metrics.direction < 0 ? 'WEST ←' : 'RESTING';
      }
      if (stateRef.current) {
        if (progress > 0 && progress < 0.99) {
          stateRef.current.textContent = 'STICKY ACTIVE';
          stateRef.current.className = 'text-emerald-400 font-semibold font-mono';
        } else if (progress >= 0.99) {
          stateRef.current.textContent = 'SECTION RELEASED';
          stateRef.current.className = 'text-blue-400 font-semibold font-mono';
        } else {
          stateRef.current.textContent = 'STANDBY';
          stateRef.current.className = 'text-zinc-400 font-mono';
        }
      }
    });

    return () => {
      unsub();
    };
  }, [subscribe]);

  const handleScrollToProgress = (targetFraction: number) => {
    const el = sectionRef.current;
    if (!el || typeof window === 'undefined') return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const elTop = rect.top + scrollTop;
    const totalDistance = rect.height - window.innerHeight;
    const targetScrollY = elTop + targetFraction * totalDistance;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const codeSnippet = `<HorizontalScroll
  speed={${speed.toFixed(1)}}
  className="w-full bg-[#050507]"
>
  <div className="flex gap-6 items-center px-8 py-12">
    {SLIDES.map((slide) => (
      <Card key={slide.id} {...slide} />
    ))}
  </div>
</HorizontalScroll>`;

  return (
    <PlaygroundShell
      title="<HorizontalScroll /> Layout Primitive"
      badge="@scrollcraft/react"
      driverType="view-timeline"
      onReset={() => setSpeed(2.0)}
      codeSnippet={codeSnippet}
      codeFileName="ProjectGallery.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Vertical Scroll Budget</span>
              <span className="text-blue-400 font-semibold">{speed.toFixed(1)}x ({(speed * 100).toFixed(0)}vh)</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="3.0"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>1.5x (Fast Scrub)</span>
              <span>2.0x (Standard)</span>
              <span>3.0x (Generous)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">
              Quick Stage Scrub Nudge
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleScrollToProgress(0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Start (0%)
              </button>
              <button
                onClick={() => handleScrollToProgress(0.5)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Mid (50%)
              </button>
              <button
                onClick={() => handleScrollToProgress(1.0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                End (100%)
              </button>
            </div>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Track Offset X:</span>
            <span ref={offsetRef} className="text-blue-400 font-bold font-mono">
              0.0 px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Section Scrub Progress:</span>
            <span ref={progressRef} className="text-emerald-400 font-bold font-mono">
              0.0%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Scroll Direction:</span>
            <span ref={directionRef} className="text-white font-mono">
              RESTING
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Sticky State:</span>
            <span ref={stateRef} className="text-zinc-400 font-mono">
              STANDBY
            </span>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Vertical Scroll → Horizontal Track Translation</span>
          </span>
          <span className="text-zinc-500">Scroll down to scrub cards</span>
        </div>

        {/* Real <HorizontalScroll /> from @scrollcraft/react */}
        <div
          ref={sectionRef}
          className="rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden shadow-inner relative"
        >
          <HorizontalScroll
            speed={speed}
            stickyClassName="sticky top-20 h-[380px] w-full overflow-hidden flex items-center"
            className="w-full"
            innerClassName="gap-5 px-6"
          >
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="w-72 sm:w-80 shrink-0 p-6 rounded-2xl border border-zinc-800/90 bg-[#0d0d10] shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-400">{slide.id}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {slide.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{slide.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{slide.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>STICKY BUDGET: {(speed * 100).toFixed(0)}vh</span>
                  <Zap className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            ))}
          </HorizontalScroll>
        </div>
      </div>
    </PlaygroundShell>
  );
};
