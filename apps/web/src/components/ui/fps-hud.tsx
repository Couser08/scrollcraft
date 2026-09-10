'use client';

/**
 * Game-Dev Performance HUD Overlay
 * Live 120 FPS counter, frame delta time, scroll velocity and progress gauge.
 * Strictly under 650 LOC.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useScrollCraft } from '@scrollcraft/react';
import { Activity, Terminal } from 'lucide-react';

export const FpsHud: React.FC = () => {
  const { subscribe, getMetrics } = useScrollCraft();
  const [fps, setFps] = useState(60);
  const [isOpen, setIsOpen] = useState(false);
  const frameTime = Number((1000 / (fps || 1)).toFixed(1));

  const velocityElRef = useRef<HTMLSpanElement | null>(null);
  const scrollElRef = useRef<HTMLSpanElement | null>(null);
  const progressElRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const fpsTextRef = useRef<HTMLSpanElement | null>(null);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(60);

  // Subscribe to high-frequency metrics ONLY when telemetry HUD is open, writing directly to DOM
  useEffect(() => {
    if (!isOpen) return;

    const initial = getMetrics();
    if (velocityElRef.current) {
      velocityElRef.current.textContent = `${Math.abs(Math.round(initial.velocity))} px/s`;
    }
    if (scrollElRef.current) {
      scrollElRef.current.textContent = `${Math.round(initial.scroll)} px`;
    }
    if (progressElRef.current) {
      progressElRef.current.textContent = `${Math.round(initial.progress * 100)}%`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.min(initial.progress * 100, 100)}%`;
    }

    const unsubscribe = subscribe((m) => {
      if (velocityElRef.current) {
        velocityElRef.current.textContent = `${Math.abs(Math.round(m.velocity))} px/s`;
      }
      if (scrollElRef.current) {
        scrollElRef.current.textContent = `${Math.round(m.scroll)} px`;
      }
      if (progressElRef.current) {
        progressElRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.min(m.progress * 100, 100)}%`;
      }
    });

    return () => unsubscribe();
  }, [isOpen, subscribe, getMetrics]);

  useEffect(() => {
    let animId: number;

    const calculateFps = (now: number) => {
      frameCountRef.current++;
      const delta = now - lastTimeRef.current;

      if (delta >= 500) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        fpsRef.current = currentFps;
        
        // Zero-rerender DOM update for HUD
        if (fpsTextRef.current) {
          fpsTextRef.current.textContent = `${currentFps} FPS`;
          // Update color classes directly
          if (currentFps >= 55) fpsTextRef.current.className = 'px-2 py-0.5 rounded-md border font-bold text-emerald-400 border-emerald-500/30 bg-emerald-950/40 inline-block tabular-nums w-24 text-center';
          else if (currentFps >= 30) fpsTextRef.current.className = 'px-2 py-0.5 rounded-md border font-bold text-amber-400 border-amber-500/30 bg-amber-950/40 inline-block tabular-nums w-24 text-center';
          else fpsTextRef.current.className = 'px-2 py-0.5 rounded-md border font-bold text-rose-400 border-rose-500/30 bg-rose-950/40 inline-block tabular-nums w-24 text-center';
        }

        // Only use state for the collapsed pill button since we don't have a ref for it
        setFps(currentFps);
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const getFpsColor = () => {
    if (fps >= 55) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (fps >= 30) return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none font-mono text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all cursor-pointer ${getFpsColor()}`}
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold">{fps} FPS</span>
          <span className="text-[10px] text-zinc-400">({frameTime}ms)</span>
        </button>
      ) : (
        <div className="w-64 rounded-2xl bg-[#0e0f14]/95 border border-white/10 p-3.5 shadow-2xl backdrop-blur-2xl text-zinc-300 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Engine Metrics</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Framerate:</span>
              <span ref={fpsTextRef} className="px-2 py-0.5 rounded-md border font-bold text-emerald-400 border-emerald-500/30 bg-emerald-950/40 inline-block tabular-nums w-24 text-center">
                60 FPS
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Scroll Velocity:</span>
              <span ref={velocityElRef} className="font-bold text-blue-400 tabular-nums w-16 text-right">
                0 px/s
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Scroll Offset:</span>
              <span ref={scrollElRef} className="font-bold text-zinc-200 tabular-nums w-16 text-right">
                0 px
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Progress:</span>
              <span ref={progressElRef} className="font-bold text-emerald-400 tabular-nums w-16 text-right">
                0%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/5/10 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

