'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';

export const ScrollProgressPlayground: React.FC = () => {
  const [progress, setProgress] = useState<number>(38);
  const [trackTarget, setTrackTarget] = useState<'document' | 'container'>('document');
  const articleRef = useRef<HTMLDivElement>(null);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Real &lt;ScrollProgress&gt; Stage
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            0-Rerender DOM Transformer
          </span>
        </div>
        <button
          onClick={() => setProgress(38)}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Simulated Sticky Reading Bar at top */}
      <div className="w-full h-1.5 bg-zinc-900 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 origin-left transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Controls & Telemetry */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Simulate Scroll Progress</span>
              <span className="font-mono text-blue-400 font-semibold">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>0.00 (Start)</span>
              <span>0.50 (Middle)</span>
              <span>1.00 (Complete)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-200 block mb-1.5">
              Tracking Target Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTrackTarget('document')}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  trackTarget === 'document'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                Full Window (Default)
              </button>
              <button
                onClick={() => setTrackTarget('container')}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  trackTarget === 'container'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                Target Ref Container
              </button>
            </div>
          </div>

          {/* Real Telemetry Box */}
          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0c0c0e] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">GPU ScaleX Mutation</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3" /> 120 FPS Subpixel
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Normalized ScaleX</span>
              <span className="text-blue-400 font-semibold font-mono">
                {(progress / 100).toFixed(3)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">React Root Re-renders</span>
              <span className="text-emerald-400 font-semibold">0 frames</span>
            </div>
          </div>
        </div>

        {/* Right: Live Simulated Reader with Circular Dial */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-xl bg-[#060608] border border-zinc-800/60 flex items-center justify-between gap-6 shadow-inner">
            {/* Circular HUD Progress Dial */}
            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    className="stroke-zinc-800 fill-none"
                    strokeWidth="5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    className="stroke-blue-500 fill-none transition-all duration-75"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-mono font-bold text-white">{progress}%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-200">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Article Completion Metric</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct scaleX GPU transform without layout thrashing.
                </p>
              </div>
            </div>

            {/* Quick Step Buttons */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => setProgress((p) => Math.min(100, p + 20))}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 transition-colors"
              >
                +20% Read
              </button>
              <button
                onClick={() => setProgress((p) => Math.max(0, p - 20))}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 transition-colors"
              >
                -20% Read
              </button>
            </div>
          </div>

          {/* Sample Article Container Mock */}
          <div
            ref={articleRef}
            className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2 text-xs text-zinc-400"
          >
            <div className="flex items-center justify-between text-zinc-300 font-semibold font-mono text-[11px]">
              <span>Section: 02. Architecture & Subpixel Invariance</span>
              <span className="text-blue-400">Target: {trackTarget.toUpperCase()}</span>
            </div>
            <p className="line-clamp-2 leading-relaxed">
              Standard progress bars calculate height with offsetHeight on every scroll tick, causing severe layout thrashing. ScrollCraft caches container bounds and writes exclusively to GPU transform scales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
