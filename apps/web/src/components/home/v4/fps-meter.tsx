'use client';

import React, { useEffect, useRef } from 'react';

export function FPSMeter() {
  const fpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    const history: number[] = new Array(60).fill(16.7);
    let historyIdx = 0;

    const tick = (currentTime: number) => {
      frameCount++;
      const delta = currentTime - lastTime;

      // Update every ~500ms
      if (delta >= 500) {
        const fps = Math.min(Math.round((frameCount * 1000) / delta), 120);
        const ms = (delta / frameCount).toFixed(1);

        if (fpsRef.current) fpsRef.current.innerText = `${fps}`;
        if (msRef.current) msRef.current.innerText = `${ms} ms`;

        lastTime = currentTime;
        frameCount = 0;
      }

      // Record frame time for graph
      history[historyIdx] = delta / frameCount || 16.7;
      historyIdx = (historyIdx + 1) % history.length;

      // Draw graph
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          ctx.clearRect(0, 0, w, h);
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let i = 0; i < history.length; i++) {
            const idx = (historyIdx + i) % history.length;
            const val = history[idx];
            // Normalize roughly around 16.7ms. Higher ms = lower line
            const normalized = Math.max(0, Math.min(1, (val - 8) / 20));
            ctx.lineTo((i / history.length) * w, h - (1 - normalized) * h * 0.8);
          }
          ctx.lineTo(w, h);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // blue-500/20
          ctx.fill();
          
          ctx.beginPath();
          for (let i = 0; i < history.length; i++) {
            const idx = (historyIdx + i) % history.length;
            const val = history[idx];
            const normalized = Math.max(0, Math.min(1, (val - 8) / 20));
            const y = h - (1 - normalized) * h * 0.8;
            if (i === 0) ctx.moveTo(0, y);
            else ctx.lineTo((i / history.length) * w, y);
          }
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-4 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 shadow-2xl font-mono text-[10px] text-zinc-400">
        
        {/* FPS Indicator */}
        <div className="flex flex-col gap-1 items-center min-w-[48px]">
          <div className="flex items-center gap-1.5 font-sans">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-white font-bold text-sm tracking-tight" ref={fpsRef}>120</span>
            <span className="text-zinc-500 text-xs font-semibold">FPS</span>
          </div>
          <span ref={msRef}>16.7 ms</span>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Waveform Graph */}
        <div className="w-16 h-8 opacity-80 flex items-end ml-2">
          <canvas ref={canvasRef} width={64} height={32} className="w-full h-full" />
        </div>

      </div>
    </div>
  );
}
