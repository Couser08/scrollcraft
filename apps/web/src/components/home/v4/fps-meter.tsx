'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScrollCraftTier } from '@scrollcraft/react';

export function FPSMeter() {
  const [collapsed, setCollapsed] = useState(false);
  const tier = useScrollCraftTier();

  const collapsedFpsRef = useRef<HTMLSpanElement>(null);
  const expandedFpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();
    let lastSampleTime = performance.now();
    let frameCount = 0;

    const historySize = 48;
    const history = new Array(historySize).fill(16.7);
    let historyIdx = 0;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      // Filter out background tab pauses (> 500ms)
      if (delta > 0 && delta < 500) {
        history[historyIdx] = delta;
        historyIdx = (historyIdx + 1) % historySize;
        frameCount++;
      }

      // Update text readouts every 150ms for a lively, responsive meter
      if (now - lastSampleTime >= 150) {
        const sampleDelta = now - lastSampleTime;
        const currentFps = Math.round((frameCount * 1000) / sampleDelta);
        const avgFrameMs = frameCount > 0 ? (sampleDelta / frameCount).toFixed(1) : '16.7';

        const displayFps = Math.max(1, Math.min(360, currentFps));

        if (expandedFpsRef.current) {
          expandedFpsRef.current.innerText = `${displayFps}`;
        }
        if (collapsedFpsRef.current) {
          collapsedFpsRef.current.innerText = `${displayFps}`;
        }
        if (msRef.current) {
          msRef.current.innerText = `${avgFrameMs} ms`;
        }

        frameCount = 0;
        lastSampleTime = now;
      }

      // Draw real-time frame timeline oscilloscope
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // Baseline 60Hz / 120Hz reference line (16.7ms or 8.3ms)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.moveTo(0, h * 0.5);
          ctx.lineTo(w, h * 0.5);
          ctx.stroke();

          // Draw area fill
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let i = 0; i < historySize; i++) {
            const idx = (historyIdx + i) % historySize;
            const val = history[idx];
            // Normalize: 0ms is bottom, 33.3ms (30 FPS) is top
            const norm = Math.max(0, Math.min(1, val / 33.3));
            const y = h - norm * (h - 2);
            const x = (i / (historySize - 1)) * w;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
          ctx.fill();

          // Draw stroke line
          ctx.beginPath();
          for (let i = 0; i < historySize; i++) {
            const idx = (historyIdx + i) % historySize;
            const val = history[idx];
            const norm = Math.max(0, Math.min(1, val / 33.3));
            const y = h - norm * (h - 2);
            const x = (i / (historySize - 1)) * w;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <aside aria-label="FPS performance monitor" className="fixed bottom-6 right-6 z-50 select-none">
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-zinc-300 font-mono text-[11px] shadow-2xl hover:bg-zinc-900 transition-colors backdrop-blur-md cursor-pointer"
          title="Expand FPS Monitor"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)] animate-pulse" />
          <span ref={collapsedFpsRef}>120</span> FPS
          <span className="text-[9px] uppercase tracking-wider text-zinc-500">({tier})</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-zinc-950/90 border border-zinc-800 rounded-full px-4 py-2 shadow-2xl font-mono text-[10px] text-zinc-400 backdrop-blur-md">
          {/* FPS Indicator */}
          <div className="flex flex-col gap-0.5 items-center min-w-[50px]">
            <div className="flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)] animate-pulse" />
              <span className="text-white font-bold text-sm tracking-tight" ref={expandedFpsRef}>
                120
              </span>
              <span className="text-zinc-500 text-xs font-semibold">FPS</span>
            </div>
            <span ref={msRef} className="text-zinc-400 text-[10px]">16.7 ms</span>
          </div>

          <div className="w-[1px] h-7 bg-zinc-800" />

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

          <div className="w-[1px] h-7 bg-zinc-800" />

          {/* Real-time Oscilloscope Waveform */}
          <div className="w-16 h-7 flex items-end">
            <canvas ref={canvasRef} width={64} height={28} className="w-full h-full rounded" />
          </div>

          {/* Minimize button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="w-5 h-5 ml-1 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
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
