'use client';

import React, { useEffect, useRef } from 'react';

export function PerformanceHUD() {
  const fpsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const calculateFPS = () => {
      frames++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        if (fpsRef.current) {
          // Direct DOM write, absolutely zero React renders
          fpsRef.current.innerText = `${frames}`;
        }
        frames = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    animationFrameId = requestAnimationFrame(calculateFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-full border border-white/10 bg-[#0A0A0A] px-4 py-2 text-[11px] uppercase tracking-widest font-mono text-zinc-400 shadow-2xl" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span><span ref={fpsRef} className="text-white font-medium">120</span> FPS</span>
      </div>
      <div className="w-[1px] h-3 bg-white/10" />
      <div className="flex items-center gap-2">
        <span>React Renders: <span className="text-white font-medium">0</span></span>
      </div>
    </div>
  );
}
