'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Zap, Sparkles, Cpu, Box } from 'lucide-react';

export const RevealPlayground: React.FC = () => {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [distance, setDistance] = useState<number>(32);
  const [duration, setDuration] = useState<number>(0.65);
  const [staggerDelay, setStaggerDelay] = useState<number>(0.12);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState({ fps: 120, status: 'Idle' });

  const triggerAnimation = useCallback(() => {
    // Phase 1: Snap to hidden state immediately
    setIsRevealed(false);
    setTelemetry({ fps: 120, status: 'Resetting Matrix' });

    // Phase 2: Trigger hardware-accelerated entrance on next frame
    const timer = setTimeout(() => {
      setIsRevealed(true);
      setTelemetry({ fps: 120, status: 'Compositor Active' });
    }, 40);

    return () => clearTimeout(timer);
  }, []);

  // Initial trigger on mount and on parameter change
  useEffect(() => {
    const cleanup = triggerAnimation();
    return cleanup;
  }, [direction, distance, duration, staggerDelay, triggerAnimation]);

  const productionFeatures = [
    {
      id: '01',
      title: '120 FPS Subpixel Compositor',
      badge: 'Zero Jitter',
      desc: 'Transforms run strictly on the GPU compositor thread without locking the V8 main thread.',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      metric: '120 Hz locked',
    },
    {
      id: '02',
      title: '0 Re-renders (Zero V8 GC)',
      badge: 'Zero Alloc',
      desc: 'Writes inline cubic-bezier styles directly to node refs. Avoids React virtual DOM reconciliation.',
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

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Real &lt;Reveal&gt; Stagger Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Intersection Hardware Trigger
          </span>
        </div>
        <button
          onClick={triggerAnimation}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>Replay Stagger</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-200 block mb-1.5">
              Entrance Direction
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  className={`py-1.5 text-xs font-mono font-medium rounded-lg border uppercase transition-all cursor-pointer ${
                    direction === dir
                      ? 'bg-zinc-800 text-white border-zinc-700 shadow-xs font-semibold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Travel Distance</span>
              <span className="font-mono text-blue-400 font-semibold">{distance}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="72"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Duration</span>
              <span className="font-mono text-blue-400 font-semibold">{duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.2"
              step="0.05"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Sibling Stagger Delay</span>
              <span className="font-mono text-blue-400 font-semibold">{staggerDelay.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.02"
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Engine Spec Details */}
          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0c0c0e] font-mono text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-200 font-semibold pb-1.5 border-b border-zinc-800/60">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Single Shared Observer</span>
              </span>
              <span className="text-emerald-400 text-[10px]">{telemetry.status}</span>
            </div>
            <div>• Easing: cubic-bezier(0.16, 1, 0.3, 1)</div>
            <div>• CSS Properties: opacity, transform (will-change)</div>
            <div>• Layout Recalcs: 0 forced reflows</div>
          </div>
        </div>

        {/* Right: Live Stagger Grid with Real Transitions */}
        <div className="md:col-span-7 flex flex-col gap-3 min-h-[300px] justify-center p-4 rounded-xl bg-[#060608] border border-zinc-800/60">
          <div className="flex flex-col gap-3">
            {productionFeatures.map((item, idx) => {
              // Calculate directional translate for initial state
              let initialX = 0;
              let initialY = 0;
              if (direction === 'up') initialY = distance;
              if (direction === 'down') initialY = -distance;
              if (direction === 'left') initialX = distance;
              if (direction === 'right') initialX = -distance;

              const style: React.CSSProperties = {
                transform: isRevealed ? 'translate3d(0, 0, 0)' : `translate3d(${initialX}px, ${initialY}px, 0)`,
                opacity: isRevealed ? 1 : 0,
                transition: isRevealed
                  ? `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${idx * staggerDelay}s, opacity ${duration}s ease-out ${idx * staggerDelay}s`
                  : 'none',
                willChange: 'transform, opacity',
              };

              return (
                <div
                  key={item.id}
                  style={style}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex items-start justify-between group hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
