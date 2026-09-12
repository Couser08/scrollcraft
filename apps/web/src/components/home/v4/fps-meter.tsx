'use client';

import React, { useRef, useState } from 'react';
import { useScrollCraftTier, useTicker } from '@scrollcraft/react';

export function FPSMeter() {
  const [collapsed, setCollapsed] = useState(false);
  const tier = useScrollCraftTier();
  const tierRef = useRef(tier);
  tierRef.current = tier;

  const collapsedRef = useRef(collapsed);
  collapsedRef.current = collapsed;

  const fpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const lastDrawTimeRef = useRef(0);
  const historyRef = useRef<number[]>(new Array(60).fill(16.7));
  const historyIdxRef = useRef(0);

  // Synchronized directly with ScrollCraft's centralized 120 FPS game loop
  useTicker(
    (_dt, _elapsed, currentTime) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
        lastFrameTimeRef.current = currentTime;
        lastDrawTimeRef.current = currentTime;
      }

      frameCountRef.current++;
      const frameDelta = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Record actual frame delta for graph
      const history = historyRef.current;
      let historyIdx = historyIdxRef.current;
      history[historyIdx] = frameDelta > 0 ? frameDelta : 16.7;
      historyIdxRef.current = (historyIdx + 1) % history.length;

      const delta = currentTime - lastTimeRef.current;

      // Update FPS readout every ~350ms
      if (delta >= 350) {
        const rawFps = Math.round((frameCountRef.current * 1000) / delta);
        const fps = Math.min(rawFps, 360); // Cap at 360Hz pro displays
        const ms = (delta / frameCountRef.current).toFixed(1);

        if (fpsRef.current) fpsRef.current.innerText = `${fps}`;
        if (msRef.current) msRef.current.innerText = `${ms} ms`;

        lastTimeRef.current = currentTime;
        frameCountRef.current = 0;
      }

      // Throttle canvas draw dynamically based on performance tier:
      // High: 100ms, Low/Software: 400ms (saves CPU rasterizer cycles)
      const drawThrottle = tierRef.current === 'low' ? 400 : 100;
      if (!collapsedRef.current && currentTime - lastDrawTimeRef.current >= drawThrottle && canvasRef.current) {
        lastDrawTimeRef.current = currentTime;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          ctx.clearRect(0, 0, w, h);
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let i = 0; i < history.length; i++) {
            const idx = (historyIdxRef.current + i) % history.length;
            const val = history[idx];
            const normalized = Math.max(0, Math.min(1, (val - 4) / 24));
            ctx.lineTo((i / history.length) * w, h - (1 - normalized) * h * 0.8);
          }
          ctx.lineTo(w, h);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
          ctx.fill();
          
          ctx.beginPath();
          for (let i = 0; i < history.length; i++) {
            const idx = (historyIdxRef.current + i) % history.length;
            const val = history[idx];
            const normalized = Math.max(0, Math.min(1, (val - 4) / 24));
            const y = h - (1 - normalized) * h * 0.8;
            if (i === 0) ctx.moveTo(0, y);
            else ctx.lineTo((i / history.length) * w, y);
          }
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    },
    { phase: 'render', enabled: !collapsed }
  );

  return (
    <aside aria-label="FPS performance monitor" className="fixed bottom-6 right-6 z-50 select-none">
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-surface border border-white/15 text-zinc-300 font-mono text-[11px] shadow-2xl hover:bg-white/10 transition-colors"
          title="Expand FPS Monitor"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
          <span ref={fpsRef}>120</span> FPS
          <span className="text-[9px] uppercase tracking-wider text-zinc-400">({tier})</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 glass-surface border border-white/15 rounded-full px-4 py-2.5 shadow-2xl font-mono text-[10px] text-zinc-400">
          {/* FPS Indicator */}
          <div className="flex flex-col gap-0.5 items-center min-w-[48px]">
            <div className="flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
              <span className="text-white font-bold text-sm tracking-tight" ref={fpsRef}>120</span>
              <span className="text-zinc-500 text-xs font-semibold">FPS</span>
            </div>
            <span ref={msRef}>16.7 ms</span>
          </div>

          <div className="w-[1px] h-7 bg-white/10" />

          {/* Tier Badge */}
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${
              tier === 'high'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : tier === 'low'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
            }`}
          >
            {tier}
          </span>

          <div className="w-[1px] h-7 bg-white/10" />

          {/* Waveform Graph */}
          <div className="w-14 h-7 opacity-85 flex items-end">
            <canvas ref={canvasRef} width={56} height={28} className="w-full h-full" />
          </div>

          {/* Minimize button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="w-5 h-5 ml-1 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Minimize Monitor"
            aria-label="Minimize FPS Monitor"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
