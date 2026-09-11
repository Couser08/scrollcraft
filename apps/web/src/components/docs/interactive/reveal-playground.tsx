'use client';

import React, { useState } from 'react';
import { Reveal } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Zap, Cpu, Box, RefreshCw } from 'lucide-react';

export const RevealPlayground: React.FC = () => {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [distance, setDistance] = useState<number>(32);
  const [duration, setDuration] = useState<number>(0.65);
  const [staggerDelay, setStaggerDelay] = useState<number>(0.12);
  const [threshold, setThreshold] = useState<number>(0.15);
  const [remountKey, setRemountKey] = useState<number>(0);

  const productionFeatures = [
    {
      id: '01',
      title: '120 FPS Subpixel Compositor',
      badge: 'Zero Jitter',
      desc: 'Transforms execute strictly on the GPU compositor thread without locking the V8 main thread.',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      metric: '120 Hz locked',
    },
    {
      id: '02',
      title: '0 Re-renders (Zero V8 GC)',
      badge: 'Zero Alloc',
      desc: 'Writes inline cubic-bezier styles directly to node refs. Bypasses React reconciliation.',
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      metric: '0 state diffs',
    },
    {
      id: '03',
      title: 'Headless asChild Slot',
      badge: 'Radix Pattern',
      desc: 'Zero dummy wrapper divs injected into your DOM tree. 100% compatible with Tailwind & CSS Grid.',
      icon: <Box className="w-4 h-4 text-purple-400" />,
      metric: '< 4.2 kB Brotli',
    },
  ];

  const codeSnippet = `<div className="flex flex-col gap-3">
  {features.map((item, idx) => (
    <Reveal
      key={item.id}
      direction="${direction}"
      distance={${distance}}
      duration={${duration.toFixed(2)}}
      delay={idx * ${staggerDelay.toFixed(2)}}
      threshold={${threshold.toFixed(2)}}
    >
      <Card {...item} />
    </Reveal>
  ))}
</div>`;

  return (
    <PlaygroundShell
      title="<Reveal /> Stagger Sandbox"
      badge="@scrollcraft/react"
      driverType="observer"
      onReset={() => {
        setDirection('up');
        setDistance(32);
        setDuration(0.65);
        setStaggerDelay(0.12);
        setThreshold(0.15);
        setRemountKey((k) => k + 1);
      }}
      codeSnippet={codeSnippet}
      codeFileName="RevealGrid.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-mono text-zinc-300 block mb-1.5">
              Entrance Direction
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => {
                    setDirection(dir);
                    setRemountKey((k) => k + 1);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer uppercase ${
                    direction === dir
                      ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Stagger Delay</span>
              <span className="text-blue-400 font-semibold">{staggerDelay.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.02"
              value={staggerDelay}
              onChange={(e) => {
                setStaggerDelay(Number(e.target.value));
                setRemountKey((k) => k + 1);
              }}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-300">Distance</span>
                <span className="text-blue-400 font-semibold">{distance}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="56"
                step="4"
                value={distance}
                onChange={(e) => {
                  setDistance(Number(e.target.value));
                  setRemountKey((k) => k + 1);
                }}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-300">Duration</span>
                <span className="text-blue-400 font-semibold">{duration.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.05"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value));
                  setRemountKey((k) => k + 1);
                }}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setRemountKey((k) => k + 1)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-mono text-blue-300 font-semibold transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replay Entrance Sequence</span>
            </button>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Intersection Engine:</span>
            <span className="text-emerald-400 font-bold font-mono">
              Single Shared Observer
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">CSS Hardware Layer:</span>
            <span className="text-blue-400 font-mono">translate3d + opacity</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Easing Curve:</span>
            <span className="text-white font-mono">cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Layout Recalculations:</span>
            <span className="text-emerald-400 font-semibold font-mono">0 forced reflows</span>
          </div>
        </>
      }
    >
      <div className="p-4 rounded-xl bg-[#060608] border border-zinc-800/60 min-h-[290px] flex flex-col justify-center">
        {/* Real <Reveal /> Primitives from @scrollcraft/react */}
        <div key={remountKey} className="flex flex-col gap-3">
          {productionFeatures.map((item, idx) => (
            <Reveal
              key={item.id}
              direction={direction}
              distance={distance}
              duration={duration}
              delay={idx * staggerDelay}
              threshold={threshold}
              once={false}
            >
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex items-start justify-between group hover:border-zinc-700 transition-colors">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-3 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.metric}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PlaygroundShell>
  );
};
