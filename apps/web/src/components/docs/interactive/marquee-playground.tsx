'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VelocityMarquee, useScrollCraft } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Zap, ArrowLeftRight } from 'lucide-react';

export const MarqueePlayground: React.FC = () => {
  const [baseSpeed, setBaseSpeed] = useState<number>(1.5);
  const [velocityMultiplier, setVelocityMultiplier] = useState<number>(0.10);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const { subscribe } = useScrollCraft();

  // Telemetry DOM refs for ZERO React re-render updates
  const velocityRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const scrollPosRef = useRef<HTMLSpanElement>(null);

  // Subscribe directly to Core ScrollCraft engine metrics
  useEffect(() => {
    const unsub = subscribe((metrics) => {
      const v = Math.abs(metrics.velocity || 0) * 16; // px per frame at ~60fps
      if (velocityRef.current) {
        velocityRef.current.textContent = `${v.toFixed(1)} px/f`;
      }
      if (statusRef.current) {
        if (v > 12) {
          statusRef.current.textContent = 'HIGH FLING 🚀';
          statusRef.current.className = 'text-amber-400 font-bold font-mono';
        } else if (v > 3) {
          statusRef.current.textContent = 'ACCELERATING ⚡';
          statusRef.current.className = 'text-blue-400 font-bold font-mono';
        } else {
          statusRef.current.textContent = 'BASE CRUISE';
          statusRef.current.className = 'text-emerald-400 font-semibold font-mono';
        }
      }
      if (scrollPosRef.current) {
        scrollPosRef.current.textContent = `${Math.round(metrics.scroll)}px`;
      }
    });

    return () => {
      unsub();
    };
  }, [subscribe]);

  const handleScrollPulse = () => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: 380, behavior: 'smooth' });
    }
  };

  const codeSnippet = `<VelocityMarquee
  baseSpeed={${baseSpeed.toFixed(1)}}
  velocityMultiplier={${velocityMultiplier.toFixed(2)}}
  direction="${direction}"
>
  <div className="flex items-center gap-8 font-mono font-bold text-white tracking-wider">
    <span>SCROLLCRAFT</span>
    <span>120 FPS SUBPIXEL</span>
    <span>ZERO JANK MOTION</span>
    <span>DIRECT COMPOSITOR</span>
  </div>
</VelocityMarquee>`;

  return (
    <PlaygroundShell
      title="<VelocityMarquee /> Kinetic Sandbox"
      badge="@scrollcraft/react"
      driverType="ticker"
      onReset={() => {
        setBaseSpeed(1.5);
        setVelocityMultiplier(0.10);
        setDirection('left');
      }}
      codeSnippet={codeSnippet}
      codeFileName="KineticTicker.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Base Cruise Speed</span>
              <span className="text-blue-400 font-semibold">{baseSpeed.toFixed(1)} px/f</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.2"
              value={baseSpeed}
              onChange={(e) => setBaseSpeed(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Velocity Sensitivity</span>
              <span className="text-blue-400 font-semibold">{velocityMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.25"
              step="0.02"
              value={velocityMultiplier}
              onChange={(e) => setVelocityMultiplier(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setDirection((d) => (d === 'left' ? 'right' : 'left'))}
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
              <span>Scroll Pulse (Fling)</span>
            </button>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Live Kinetic Velocity:</span>
            <span ref={velocityRef} className="text-blue-400 font-bold font-mono">
              0.0 px/f
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Solver Motion State:</span>
            <span ref={statusRef} className="text-emerald-400 font-semibold font-mono">
              BASE CRUISE
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Page Scroll Position:</span>
            <span ref={scrollPosRef} className="text-white font-mono">
              0px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Continuous Modulo Wrap:</span>
            <span className="text-purple-400 font-semibold font-mono">Active (1 Clone)</span>
          </div>
        </>
      }
    >
      {/* Real VelocityMarquee from @scrollcraft/react */}
      <div className="w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-[#060608] py-5 relative shadow-inner">
        <VelocityMarquee
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
    </PlaygroundShell>
  );
};
