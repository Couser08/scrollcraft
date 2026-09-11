'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Parallax, useScrollCraft } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Layers, ArrowUpDown, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';

export const ParallaxPlayground: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0.25);
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');

  const { subscribe } = useScrollCraft();

  // Telemetry DOM refs (0 React re-renders during scroll)
  const layer1Ref = useRef<HTMLSpanElement>(null);
  const layer2Ref = useRef<HTMLSpanElement>(null);
  const layer3Ref = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = subscribe((metrics) => {
      const s = metrics.scroll;
      if (layer1Ref.current) layer1Ref.current.textContent = `${(s * speed * 0.4).toFixed(1)} px`;
      if (layer2Ref.current) layer2Ref.current.textContent = `${(-s * speed * 0.9).toFixed(1)} px`;
      if (layer3Ref.current) layer3Ref.current.textContent = `${(s * speed * 1.6).toFixed(1)} px`;
      if (scrollRef.current) scrollRef.current.textContent = `${Math.round(s)} px`;
    });

    return () => {
      unsub();
    };
  }, [subscribe, speed]);

  const handleScrollStep = (delta: number) => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  const codeSnippet = `<div className="relative h-[320px] overflow-hidden rounded-2xl">
  {/* Layer 1: Background Lag */}
  <Parallax speed={${(speed * 0.4).toFixed(2)}} direction="${direction}">
    <BackgroundLayer />
  </Parallax>

  {/* Layer 2: Main Floating Card (Reverse Offset) */}
  <Parallax speed={${(-speed * 0.9).toFixed(2)}} direction="${direction}">
    <FocusCard />
  </Parallax>

  {/* Layer 3: Foreground Kinetic Accent */}
  <Parallax speed={${(speed * 1.6).toFixed(2)}} direction="${direction}">
    <FloatingPill />
  </Parallax>
</div>`;

  return (
    <PlaygroundShell
      title="<Parallax /> Multi-Layer Sandbox"
      badge="@scrollcraft/react"
      driverType="view-timeline"
      onReset={() => {
        setSpeed(0.25);
        setDirection('vertical');
      }}
      codeSnippet={codeSnippet}
      codeFileName="ParallaxHero.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Speed Multiplier</span>
              <span className="text-blue-400 font-semibold">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>0.05 (Subtle)</span>
              <span>0.25 (Balanced)</span>
              <span>0.60 (Dramatic)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-300 block mb-1.5">
              Motion Axis
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('vertical')}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  direction === 'vertical'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <ArrowUpDown className="w-3 h-3 text-blue-400" />
                <span>Vertical</span>
              </button>
              <button
                onClick={() => setDirection('horizontal')}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  direction === 'horizontal'
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <ArrowLeftRight className="w-3 h-3 text-blue-400" />
                <span>Horizontal</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">
              Scroll Page Driver Nudge
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleScrollStep(-200)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Scroll Up</span>
              </button>
              <button
                onClick={() => handleScrollStep(200)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Scroll Down</span>
              </button>
            </div>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Layer 1 (Background):</span>
            <span ref={layer1Ref} className="text-blue-400 font-mono">
              0.0 px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Layer 2 (Focus Card):</span>
            <span ref={layer2Ref} className="text-emerald-400 font-mono">
              0.0 px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Layer 3 (Foreground Pill):</span>
            <span ref={layer3Ref} className="text-purple-400 font-mono">
              0.0 px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Window Scroll Y:</span>
            <span ref={scrollRef} className="text-white font-mono">
              0 px
            </span>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Scroll this documentation page to see all 3 real layers displace:</span>
        </div>

        {/* Real <Parallax /> Primitives from @scrollcraft/react */}
        <div className="w-full h-[320px] rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden relative shadow-2xl flex items-center justify-center p-6">
          {/* Layer 1: Background Landscape */}
          <Parallax
            asChild
            speed={speed * 0.4}
            direction={direction}
          >
            <div className="absolute inset-0 opacity-40 filter brightness-90 pointer-events-none scale-110">
              <Image
                src="/images/cta-mountains.jpg"
                alt="Scenic Parallax Background"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          </Parallax>

          {/* Layer 2: Main Floating Card */}
          <Parallax
            asChild
            speed={-speed * 0.9}
            direction={direction}
          >
            <div className="relative z-10 p-6 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 shadow-2xl text-center max-w-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold mb-2">
                <Layers className="w-3 h-3" />
                <span>Real Parallax Primitive</span>
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                Direct Compositor Writes
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Relative speed ratio <span className="text-blue-400 font-mono font-semibold">{(-speed * 0.9).toFixed(2)}x</span> on page scroll.
              </p>
            </div>
          </Parallax>

          {/* Layer 3: Foreground Kinetic Pill */}
          <Parallax
            asChild
            speed={speed * 1.6}
            direction={direction}
          >
            <div className="absolute bottom-6 right-6 z-20 px-3 py-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-zinc-700 text-white font-mono text-[10px] shadow-2xl">
              <span className="text-blue-400 font-bold">120 FPS </span>
              GPU translate3d
            </div>
          </Parallax>
        </div>
      </div>
    </PlaygroundShell>
  );
};
