'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ScrollProgress, useScrollProgress } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { BookOpen, ChevronUp, ChevronDown, ArrowUp } from 'lucide-react';

export const ScrollProgressPlayground: React.FC = () => {
  const [barHeight, setBarHeight] = useState<number>(8); // px
  const [gradientTheme, setGradientTheme] = useState<'blue' | 'emerald' | 'purple'>('blue');

  const { progressValue, scrollYValue } = useScrollProgress();

  // DOM Refs for ZERO React re-render telemetry updates
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressFloatRef = useRef<HTMLSpanElement>(null);
  const scaleXRef = useRef<HTMLSpanElement>(null);
  const scrollYRef = useRef<HTMLSpanElement>(null);
  const dialCircleRef = useRef<SVGCircleElement>(null);
  const dialTextRef = useRef<HTMLSpanElement>(null);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  // Subscribe directly to Core ScrollValue observable. NO React setState called!
  useEffect(() => {
    const unsubProgress = progressValue.subscribe((progress) => {
      const normalized = Math.max(0, Math.min(1, progress));
      const percent = (normalized * 100).toFixed(1);

      if (progressTextRef.current) progressTextRef.current.textContent = `${percent}%`;
      if (progressFloatRef.current) progressFloatRef.current.textContent = normalized.toFixed(4);
      if (scaleXRef.current) scaleXRef.current.textContent = `scaleX(${normalized.toFixed(4)})`;
      if (scrollYRef.current) scrollYRef.current.textContent = `${Math.round(scrollYValue.get())}px`;

      if (dialCircleRef.current) {
        dialCircleRef.current.style.strokeDashoffset = `${circumference - normalized * circumference}px`;
      }
      if (dialTextRef.current) {
        dialTextRef.current.textContent = `${Math.round(normalized * 100)}%`;
      }
    });

    return () => {
      unsubProgress();
    };
  }, [progressValue, scrollYValue, circumference]);

  const handleScrollNudge = (delta: number) => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const gradients = {
    blue: 'from-blue-500 via-sky-400 to-indigo-500',
    emerald: 'from-emerald-500 via-teal-400 to-cyan-500',
    purple: 'from-purple-500 via-fuchsia-400 to-pink-500',
  };

  const codeSnippet = `<ScrollProgress
  className="h-[${barHeight}px] rounded-full bg-gradient-to-r ${gradients[gradientTheme]} shadow-lg"
/>`;

  return (
    <PlaygroundShell
      title="<ScrollProgress /> Primitive"
      badge="@scrollcraft/react"
      driverType="scroll-timeline"
      onReset={() => {
        setBarHeight(8);
        setGradientTheme('blue');
      }}
      codeSnippet={codeSnippet}
      codeFileName="ReadingProgressBar.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Bar Thickness</span>
              <span className="text-blue-400 font-semibold">{barHeight}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              value={barHeight}
              onChange={(e) => setBarHeight(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-300 block mb-1.5">
              Accent Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['blue', 'emerald', 'purple'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setGradientTheme(theme)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer capitalize ${
                    gradientTheme === theme
                      ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">
              Scroll Nudge (Page Travel)
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleScrollNudge(-250)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>-250px</span>
              </button>
              <button
                onClick={() => handleScrollNudge(250)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>+250px</span>
              </button>
              <button
                onClick={handleScrollToTop}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Raw Normalized Progress:</span>
            <span ref={progressFloatRef} className="text-blue-400 font-bold font-mono">
              0.0000
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">GPU scaleX Transform:</span>
            <span ref={scaleXRef} className="text-emerald-400 font-bold font-mono">
              scaleX(0.0000)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Window Scroll Y:</span>
            <span ref={scrollYRef} className="text-white font-mono">
              0px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Total Completion:</span>
            <span ref={progressTextRef} className="text-sky-400 font-bold font-mono">
              0.0%
            </span>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Real Library Component Stage */}
        <div className="p-4 rounded-xl bg-[#060608] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Real &lt;ScrollProgress /&gt; Tracker</span>
            </span>
            <span className="text-[10px] text-zinc-500">Driven by this page&apos;s scroll</span>
          </div>

          {/* Real Library Primitive from @scrollcraft/react */}
          <div className="w-full bg-zinc-900/80 rounded-full p-0.5 border border-zinc-800 overflow-hidden shadow-inner">
            <ScrollProgress
              className={`rounded-full bg-gradient-to-r ${gradients[gradientTheme]} shadow-lg transition-colors`}
              style={{ height: `${barHeight}px` }}
            />
          </div>
        </div>

        {/* Circular HUD Dial + Metric Card */}
        <div className="p-5 rounded-xl bg-[#060608] border border-zinc-800/60 flex items-center justify-between gap-6 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-zinc-800 fill-none"
                  strokeWidth="5"
                />
                <circle
                  ref={dialCircleRef}
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-blue-500 fill-none transition-[stroke-dashoffset] duration-75 ease-out"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span ref={dialTextRef} className="text-xs font-mono font-bold text-white">
                  0%
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Compositor-Linked Dial
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Directly subscribes to <code className="text-blue-400">useScrollProgress().progressValue</code>. No virtual DOM diffs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlaygroundShell>
  );
};
