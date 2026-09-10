'use client';

/**
 * Real-Engine Interactive Velocity Marquee Sandbox
 * Mounts @scrollcraft/react <VelocityMarquee> component.
 * Demonstrates infinite modulo wrapping and dynamic scroll velocity acceleration.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { VelocityMarquee } from '@scrollcraft/react';
import { Activity, RefreshCw } from 'lucide-react';

export const MarqueePlayground: React.FC = () => {
  const [baseSpeed, setBaseSpeed] = useState<number>(1.2);
  const [velocityMultiplier, setVelocityMultiplier] = useState<number>(0.08);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [key, setKey] = useState(0);

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
            &lt;VelocityMarquee /&gt;
          </span>
        </div>
        <button
          onClick={() => {
            setBaseSpeed(1.2);
            setVelocityMultiplier(0.08);
            setDirection('left');
            setKey((k) => k + 1);
          }}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Base Crawl Speed</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{baseSpeed.toFixed(1)} px/f</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={baseSpeed}
              onChange={(e) => setBaseSpeed(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-100">Velocity Multiplier</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{velocityMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.2"
              step="0.01"
              value={velocityMultiplier}
              onChange={(e) => setVelocityMultiplier(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-100 block mb-1.5">
              Direction Flow
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('left')}
                className={`py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  direction === 'left'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] font-bold'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-100'
                }`}
              >
                ← Left
              </button>
              <button
                onClick={() => setDirection('right')}
                className={`py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  direction === 'right'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] font-bold'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-100'
                }`}
              >
                Right →
              </button>
            </div>
          </div>
        </div>

        {/* Live Velocity Marquee Stage Running Real Engine */}
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm overflow-hidden"
        >
          <div className="text-[11px] text-zinc-500 font-mono mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Scroll vertically in your window to trigger dynamic kinetic acceleration:</span>
          </div>

          <VelocityMarquee
            baseSpeed={baseSpeed}
            velocityMultiplier={velocityMultiplier}
            direction={direction}
            className="py-4 border-y border-white/10/80 select-none bg-[#080808]"
          >
            <div className="flex items-center gap-6 font-mono font-extrabold text-sm sm:text-base tracking-tight text-zinc-100">
              <span>SCROLLCRAFT</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="text-[#FF5A1F]">120 FPS KINETIC</span>
              <span className="w-2 h-2 rounded-full bg-zinc-300" />
              <span>ZERO JANK</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span className="text-zinc-400">GPU ACCELERATED</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
            </div>
          </VelocityMarquee>
        </div>
      </div>
    </div>
  );
};

