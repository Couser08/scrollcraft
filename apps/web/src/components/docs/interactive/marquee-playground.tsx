'use client';

import React, { useState } from 'react';
import { VelocityMarquee } from '@scrollcraft/react';
import { Activity, RefreshCw, Zap, ArrowLeftRight } from 'lucide-react';

export const MarqueePlayground: React.FC = () => {
  const [baseSpeed, setBaseSpeed] = useState<number>(1.5);
  const [velocityMultiplier, setVelocityMultiplier] = useState<number>(0.1);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [key, setKey] = useState<number>(0);

  const handleScrollPulse = () => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Real &lt;VelocityMarquee&gt; Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            @scrollcraft/react
          </span>
        </div>
        <button
          onClick={() => {
            setBaseSpeed(1.5);
            setVelocityMultiplier(0.1);
            setDirection('left');
            setKey((k) => k + 1);
          }}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
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
              <span className="font-medium text-zinc-200">Base Crawl Speed</span>
              <span className="font-mono text-blue-400 font-semibold">{baseSpeed.toFixed(1)} px/f</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.2"
              value={baseSpeed}
              onChange={(e) => {
                setBaseSpeed(Number(e.target.value));
                setKey((k) => k + 1);
              }}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Velocity Multiplier</span>
              <span className="font-mono text-blue-400 font-semibold">
                {velocityMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.02"
              value={velocityMultiplier}
              onChange={(e) => {
                setVelocityMultiplier(Number(e.target.value));
                setKey((k) => k + 1);
              }}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button
              onClick={() => {
                setDirection((d) => (d === 'left' ? 'right' : 'left'));
                setKey((k) => k + 1);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
              <span>{direction.toUpperCase()}</span>
            </button>

            <button
              onClick={handleScrollPulse}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-mono text-blue-300 font-semibold transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Scroll Pulse</span>
            </button>
          </div>
        </div>

        {/* Live Running Real Library Marquee Primitive */}
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-[#060608] py-5 relative shadow-inner">
          <VelocityMarquee
            key={key}
            baseSpeed={baseSpeed}
            velocityMultiplier={velocityMultiplier}
            direction={direction}
          >
            <div className="flex items-center gap-8 font-mono text-sm sm:text-base font-bold text-white tracking-wider">
              <span>SCROLLCRAFT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-zinc-400">120 FPS SUBPIXEL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-zinc-200">ZERO JANK MOTION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-zinc-400">DIRECT COMPOSITOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
          </VelocityMarquee>
        </div>

        {/* Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kinetic Solver:</span>
            <span className="text-white font-bold">Modulo Wrap Active</span>
          </div>
          <div className="text-zinc-500">
            Scroll this page or click &ldquo;Scroll Pulse&rdquo; to experience real velocity acceleration!
          </div>
        </div>
      </div>
    </div>
  );
};
