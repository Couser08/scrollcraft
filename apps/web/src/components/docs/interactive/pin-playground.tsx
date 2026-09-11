'use client';

import React, { useState } from 'react';
import { Pin as PinIcon, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const PinPlayground: React.FC = () => {
  const [scrollSimulation, setScrollSimulation] = useState<number>(30);

  // When scrollSimulation is between 20% and 80%, the card is PINNED
  const isPinned = scrollSimulation >= 20 && scrollSimulation <= 80;

  // Visual card Y position
  let cardTranslateY = 0;
  if (scrollSimulation < 20) {
    cardTranslateY = (scrollSimulation / 20) * 40;
  } else if (scrollSimulation <= 80) {
    cardTranslateY = 40; // Locked in place!
  } else {
    cardTranslateY = 40 + ((scrollSimulation - 80) / 20) * 60; // Released
  }

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Interactive Pin Contract Stage
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            &lt;Pin /&gt;
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
              isPinned
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            {isPinned ? 'STATUS: PINNED (LOCKED)' : 'STATUS: UNPINNED (FLOW)'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Simulate Scroll Distance</span>
              <span className="font-mono text-blue-400 font-semibold">{scrollSimulation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scrollSimulation}
              onChange={(e) => setScrollSimulation(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>0% (Entry)</span>
              <span>20% - 80% (Pinned Zone)</span>
              <span>100% (Release)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScrollSimulation((s) => Math.max(0, s - 20))}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Step Back</span>
            </button>
            <button
              onClick={() => setScrollSimulation((s) => Math.min(100, s + 20))}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Step Forward</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0c0c0e] font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-white font-semibold pb-1 border-b border-zinc-800/60">
              <span className="flex items-center gap-1.5">
                <PinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Zero Dummy Spacers</span>
              </span>
              <span className="text-emerald-400 text-[10px]">Active</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              • Position: <code className="text-zinc-200">sticky top-0</code>
            </div>
            <div className="text-[11px] text-zinc-400">
              • Ancestor overflow diagnostic auto-scan
            </div>
            <div className="text-[11px] text-zinc-400">
              • Pin progress: <span className="text-blue-400 font-semibold">{isPinned ? Math.round(((scrollSimulation - 20) / 60) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Right Stage */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full h-[260px] rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden relative shadow-2xl p-4 flex flex-col justify-start">
            {/* Track boundary visualizer */}
            <div className="absolute inset-x-4 top-4 bottom-4 border border-dashed border-zinc-800 rounded-xl pointer-events-none flex items-start justify-end p-2">
              <span className="text-[10px] font-mono text-zinc-600">PIN TRACK BOUNDARY (200vh)</span>
            </div>

            {/* Pinned Element */}
            <div
              className={`relative z-10 p-5 rounded-xl border transition-all duration-150 w-full max-w-sm mx-auto shadow-2xl ${
                isPinned
                  ? 'bg-zinc-900 border-blue-500/50 shadow-blue-500/10'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              style={{
                transform: `translate3d(0, ${cardTranslateY}px, 0)`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPinned ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    {isPinned ? 'Locked in Viewport' : 'Free Scroll'}
                  </span>
                </div>
                {isPinned && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PINNED
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white">Sticky Narrative Headline</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Pin keeps this story anchor visible while surrounding content flows smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
