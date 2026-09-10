'use client';

/**
 * Real-Engine Interactive Reveal & Stagger Sandbox
 * Directly mounts @scrollcraft/react <Reveal> primitives.
 * Tests hardware-accelerated intersection transitions and stagger sequences.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { Reveal } from '@scrollcraft/react';
import { RotateCcw, Zap } from 'lucide-react';

export const RevealPlayground: React.FC = () => {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [distance, setDistance] = useState<number>(24);
  const [duration, setDuration] = useState<number>(0.6);
  const [staggerKey, setStaggerKey] = useState<number>(0);

  const triggerReplay = () => {
    setStaggerKey((prev) => prev + 1);
  };

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
            @scrollcraft/react &lt;Reveal /&gt;
          </span>
        </div>
        <button
          onClick={triggerReplay}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0A] hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Trigger Stagger</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-100 block mb-1.5">
              Entrance Direction
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => {
                    setDirection(dir);
                    triggerReplay();
                  }}
                  className={`py-1.5 text-xs font-mono font-medium rounded-lg border uppercase transition-all cursor-pointer ${
                    direction === dir
                      ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] font-bold shadow-xs'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-100'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Travel Distance</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{distance}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Duration</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{duration}s</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.2"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>

          {/* Engine Spec Details */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 font-mono text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-100 font-semibold pb-1 border-b border-white/10">
              <span>Shared IntersectionObserver</span>
              <span className="text-[#16A34A]">Active</span>
            </div>
            <div>• Single observer for all items</div>
            <div>• Zero layout thrashing or geometry reads</div>
            <div>• Stagger intervals: 0.12s per sibling</div>
          </div>
        </div>

        {/* Right: Live Stagger Grid Rendering Real <Reveal> Primitives */}
        <div className="md:col-span-7 flex flex-col gap-3 min-h-[260px] justify-center">
          <div key={staggerKey} className="flex flex-col gap-3">
            {[
              { id: '01', title: 'Hardware-Accelerated Opacity', desc: 'Runs on compositor layer without main-thread locking.' },
              { id: '02', title: 'Radix asChild Composition', desc: 'No wrapper divs — styles merge onto child element directly.' },
              { id: '03', title: 'Decoupled Scroll Pipeline', desc: 'Does not poll scroll positions on every frame.' },
            ].map((card, idx) => (
              <Reveal
                key={`${staggerKey}-${card.id}`}
                asChild
                direction={direction}
                distance={distance}
                duration={duration}
                delay={idx * 0.12}
                once={false}
              >
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-xs flex items-center justify-between group hover:border-[#FF5A1F]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] font-mono font-bold text-xs flex items-center justify-center border border-[#FFEDD5]">
                      {card.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">{card.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{card.desc}</p>
                    </div>
                  </div>
                  <Zap className="w-3.5 h-3.5 text-[#16A34A] opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

