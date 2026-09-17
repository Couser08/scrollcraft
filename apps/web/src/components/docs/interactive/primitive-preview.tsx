'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';

interface PrimitivePreviewProps {
  primitiveId: string;
}

export const PrimitivePreview: React.FC<PrimitivePreviewProps> = ({ primitiveId }) => {
  const [scrub, setScrub] = useState(0.35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const [burstVelocity, setBurstVelocity] = useState(0);

  // Auto-play / scrubbing animation loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;
    let dir = 1;
    const step = () => {
      setScrub((prev) => {
        let next = prev + 0.006 * dir;
        if (next >= 1) {
          next = 1;
          dir = -1;
        } else if (next <= 0) {
          next = 0;
          dir = 1;
        }
        return next;
      });
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // Velocity decay for marquee burst
  useEffect(() => {
    if (burstVelocity <= 0) return;
    const timer = setInterval(() => {
      setBurstVelocity((v) => Math.max(0, v - 1.5));
    }, 50);
    return () => clearInterval(timer);
  }, [burstVelocity]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0d] overflow-hidden p-6 shadow-2xl space-y-5 not-prose">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
            Interactive Live Demonstration
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            Direct GPU Simulation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            {isPlaying ? <RotateCcw className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isPlaying ? 'Pause' : 'Auto Scrub'}</span>
          </button>
          <button
            onClick={() => {
              setScrub(0);
              setRevealed(false);
              setTimeout(() => setRevealed(true), 150);
            }}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
            title="Reset position"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>Simulated Scroll Progress: <strong className="text-violet-400">{(scrub * 100).toFixed(0)}%</strong></span>
          <span>Matrix Offset: <strong className="text-cyan-400">{(scrub * 120).toFixed(1)}px</strong></span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.005"
          value={scrub}
          onChange={(e) => {
            setIsPlaying(false);
            setScrub(parseFloat(e.target.value));
          }}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
      </div>

      {/* Dynamic Interactive Stage based on Primitive */}
      <div className="relative min-h-[220px] rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden flex items-center justify-center p-6 select-none">
        {/* 1. Stacked Cards */}
        {primitiveId === 'stacked-cards' && (
          <div className="relative w-full max-w-sm h-48 flex items-center justify-center">
            {[0, 1, 2, 3].map((idx) => {
              const activeIdx = Math.min(3, Math.floor(scrub * 4));
              const isBuried = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              const translateY = Math.max(0, (idx - scrub * 3) * 20);
              const scale = Math.max(0.85, 1 - Math.abs(idx - activeIdx) * 0.04);
              const opacity = isBuried ? 0.35 : isCurrent ? 1 : 0.75;
              const pointerEvents = isCurrent ? 'auto' : 'none';

              return (
                <div
                  key={idx}
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    opacity,
                    zIndex: 10 - idx,
                    pointerEvents: pointerEvents as any,
                  }}
                  className={`absolute inset-x-0 h-36 rounded-xl p-5 border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-gradient-to-br from-zinc-850 to-zinc-900 border-violet-500/50 shadow-violet-500/10'
                      : 'bg-zinc-900/90 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-violet-400">Layer 0{idx + 1}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {isCurrent ? 'ACTIVE' : isBuried ? 'BURIED' : 'UPCOMING'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dynamic 3D Stacking Card</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Scale: {scale.toFixed(2)} &bull; Y: {translateY.toFixed(0)}px</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Text Reveal */}
        {primitiveId === 'text-reveal' && (
          <div className="max-w-md text-center space-y-3">
            <p className="text-2xl font-bold tracking-tight leading-relaxed">
              {'Engineered for extreme frame fidelity and zero layout recalculations.'.split(' ').map((word, i, arr) => {
                const threshold = i / arr.length;
                const isLit = scrub >= threshold;
                const wordOpacity = Math.min(1, Math.max(0.15, (scrub - threshold) * 5 + 0.15));
                const wordY = Math.max(0, (1 - (scrub - threshold) * 4) * 8);

                return (
                  <span
                    key={i}
                    style={{
                      opacity: wordOpacity,
                      transform: `translateY(${isLit ? wordY : 8}px)`,
                      display: 'inline-block',
                    }}
                    className={`mr-2 transition-transform duration-75 ${
                      isLit ? 'text-white font-extrabold' : 'text-zinc-600 font-normal'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
            <span className="text-[11px] font-mono text-cyan-400 block">
              Token granularity: &apos;word&apos; &bull; CSS fallback armed: 1,200ms
            </span>
          </div>
        )}

        {/* 3. Scroll Transform */}
        {primitiveId === 'scroll-transform' && (
          <div
            style={{
              transform: `perspective(800px) rotateY(${(scrub - 0.5) * -40}deg) scale(${0.85 + scrub * 0.3}) rotateZ(${(scrub - 0.5) * 8}deg)`,
              opacity: 0.4 + scrub * 0.6,
            }}
            className="w-56 h-36 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 p-6 text-white shadow-2xl flex flex-col justify-between transition-transform duration-75"
          >
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>GPU Morph</span>
              <span>{((scrub - 0.5) * -40).toFixed(0)}&deg; Y</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Multi-Axis Compositor</p>
              <p className="text-[11px] text-zinc-200 mt-1">Scale: {(0.85 + scrub * 0.3).toFixed(2)}x</p>
            </div>
          </div>
        )}

        {/* 4. Scroll Draw */}
        {primitiveId === 'scroll-draw' && (
          <div className="w-full max-w-sm flex flex-col items-center gap-3">
            <svg viewBox="0 0 400 120" className="w-full h-28 overflow-visible">
              <path
                d="M 20 60 C 120 10, 180 110, 280 60 S 380 10, 380 60"
                fill="none"
                stroke="#27272a"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 20 60 C 120 10, 180 110, 280 60 S 380 10, 380 60"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="420"
                strokeDashoffset={`${(1 - scrub) * 420}`}
                className="transition-[stroke-dashoffset] duration-75"
              />
            </svg>
            <span className="text-[11px] font-mono text-zinc-400">
              strokeDashoffset: <strong className="text-violet-400">{((1 - scrub) * 420).toFixed(0)}px</strong> / 420px totalLength
            </span>
          </div>
        )}

        {/* 5. Scroll Inspector */}
        {primitiveId === 'scroll-inspector' && (
          <div className="w-full max-w-md rounded-xl bg-black/90 border border-zinc-800 p-4 font-mono text-xs text-zinc-300 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>ScrollCraft Studio &bull; Frame Telemetry</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                120.0 FPS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">FRAME DROPS</span>
                <strong className="text-emerald-400 text-sm">0</strong>
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">FRAME TIME</span>
                <strong className="text-cyan-400 text-sm">0.73ms</strong>
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">TICKER TASKS</span>
                <strong className="text-violet-400 text-sm">3 Active</strong>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
              <span>Zero-power Idle Sleep: <strong className="text-zinc-300">ARMED</strong></span>
              <span>Sub-pixel grid: <strong className="text-zinc-300">1/2 DPR</strong></span>
            </div>
          </div>
        )}

        {/* 6. Parallax */}
        {primitiveId === 'parallax' && (
          <div className="relative w-full max-w-xs h-36 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
            <div
              style={{ transform: `translateY(${(scrub - 0.5) * -35}px)` }}
              className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-zinc-950 opacity-80"
            />
            <div
              style={{ transform: `translateY(${(scrub - 0.5) * 45}px)` }}
              className="relative z-10 text-center px-4 py-2 rounded-lg bg-zinc-900/90 border border-zinc-700 shadow-xl"
            >
              <span className="text-xs font-mono text-violet-400 block font-bold">Foreground (speed: +0.15)</span>
              <span className="text-xs text-white font-bold">Subpixel Offset: {((scrub - 0.5) * 45).toFixed(1)}px</span>
            </div>
          </div>
        )}

        {/* 7. Reveal */}
        {primitiveId === 'reveal' && (
          <div
            style={{
              opacity: revealed && scrub >= 0.2 ? 1 : 0.15,
              transform: `translateY(${revealed && scrub >= 0.2 ? 0 : 28}px)`,
            }}
            className="p-6 rounded-xl bg-zinc-900 border border-violet-500/40 shadow-xl text-center space-y-2 transition-all duration-300 max-w-xs"
          >
            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-mono font-bold uppercase">
              {scrub >= 0.2 ? 'INTERSECTED (THRESHOLD 0.15)' : 'PENDING ENTRANCE'}
            </span>
            <h4 className="text-base font-bold text-white">Direct GPU Reveal</h4>
            <p className="text-xs text-zinc-400">Promoted to GPU layer on viewport intersection.</p>
          </div>
        )}

        {/* 8. Pin */}
        {primitiveId === 'pin' && (
          <div className="w-full max-w-sm space-y-3 text-center">
            <div className={`p-5 rounded-xl border transition-all duration-200 ${
              scrub >= 0.25 && scrub <= 0.75
                ? 'bg-violet-950/40 border-violet-500 shadow-lg shadow-violet-500/10'
                : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">PIN STATUS:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  scrub >= 0.25 && scrub <= 0.75 ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {scrub >= 0.25 && scrub <= 0.75 ? 'LOCKED IN VIEWPORT' : 'FLOWING IN FLOW'}
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Pinned Range: <strong className="text-violet-400">25% &rarr; 75%</strong> ({((Math.max(0, Math.min(1, (scrub - 0.25) / 0.5))) * 100).toFixed(0)}% Scrubbed)
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block">
              pinSpacing: true &bull; Zero synthetic spacer wrapper divs
            </span>
          </div>
        )}

        {/* 9. Scroll Progress */}
        {primitiveId === 'scroll-progress' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
              <div
                style={{ width: `${scrub * 100}%` }}
                className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-75"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">NORMALIZED PROGRESS</span>
                <strong className="text-violet-400 text-sm">{scrub.toFixed(3)}</strong>
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">SCROLL DIRECTION</span>
                <strong className="text-cyan-400 text-sm">{scrub > 0.5 ? '+1 (DOWN)' : '-1 (UP)'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 10. Velocity Marquee */}
        {primitiveId === 'velocity-marquee' && (
          <div className="w-full space-y-3">
            <div className="overflow-hidden whitespace-nowrap py-3 border-y border-zinc-800 bg-black/60 rounded">
              <div
                style={{
                  transform: `translateX(-${((scrub * 300 + burstVelocity * 10) % 200)}px)`,
                }}
                className="inline-block text-sm font-mono tracking-widest text-zinc-200 transition-transform duration-75"
              >
                120 FPS DIRECT GPU &bull; KINETIC VELOCITY TUNER &bull; SUBPIXEL COMPOSITOR &bull; ZERO VIRTUAL DOM RE-RENDERS &bull;&nbsp;
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => setBurstVelocity((v) => Math.min(50, v + 18))}
                className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer transition-colors"
              >
                + Fling Scroll Burst
              </button>
              <span className="text-zinc-400">
                Velocity: <strong className="text-cyan-400">{(1.2 + burstVelocity).toFixed(1)} px/frame</strong>
              </span>
            </div>
          </div>
        )}

        {/* 11. Horizontal Scroll */}
        {primitiveId === 'horizontal-scroll' && (
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-800 p-2 bg-black">
            <div
              style={{ transform: `translateX(-${scrub * 180}px)` }}
              className="flex gap-3 transition-transform duration-75 w-[500px]"
            >
              {[1, 2, 3].map((card) => (
                <div key={card} className="w-36 h-28 rounded-lg bg-zinc-900 border border-zinc-800 p-3 shrink-0 flex flex-col justify-between">
                  <span className="text-xs font-mono text-violet-400 font-bold">Panel 0{card}</span>
                  <span className="text-[11px] text-zinc-400">Horizontal translation mapped to vertical scroll</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. Scroll Sequence */}
        {primitiveId === 'scroll-sequence' && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-36 h-36 rounded-2xl bg-zinc-900 border border-violet-500/30 flex items-center justify-center p-4 shadow-xl">
              <div
                style={{ transform: `rotate(${scrub * 360}deg)` }}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-violet-400 flex items-center justify-center text-xs font-mono text-white transition-transform duration-75"
              >
                Frame {Math.floor(scrub * 60) + 1}/60
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              HTML5 Canvas Buffer &bull; DPR Capped: 1.5x
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
