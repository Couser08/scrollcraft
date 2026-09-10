'use client';

import { useState, useEffect, useRef } from 'react';

export interface FpsMetrics {
  fps: number;
  frameTimeMs: number;
  status: 'perfect' | 'good' | 'lag';
  droppedFrames: number;
}

/**
 * Lightweight, zero-overhead FPS and frame latency monitor.
 * Measures delta between requestAnimationFrames without setInterval or main thread blocks.
 * Throttles React state updates to 300ms intervals to prevent observation overhead.
 */
export function useFpsMeter(isActive: boolean = true): FpsMetrics {
  const [metrics, setMetrics] = useState<FpsMetrics>({
    fps: 60,
    frameTimeMs: 16.6,
    status: 'perfect',
    droppedFrames: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSampleTimeRef = useRef(0);
  const droppedCountRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    lastTimeRef.current = performance.now();
    lastSampleTimeRef.current = performance.now();
    frameCountRef.current = 0;
    droppedCountRef.current = 0;

    const loop = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Track dropped frame if delta exceeds 24ms (i.e. < 41 FPS)
      if (delta > 24) {
        droppedCountRef.current += 1;
      }

      frameCountRef.current += 1;

      // Sample every 300ms for stable, zero-jitter UI display
      const elapsedSinceSample = now - lastSampleTimeRef.current;
      if (elapsedSinceSample >= 300) {
        const currentFps = Math.min(
          144,
          Math.round((frameCountRef.current * 1000) / elapsedSinceSample)
        );
        const avgFrameMs = parseFloat((elapsedSinceSample / frameCountRef.current).toFixed(1));

        let status: 'perfect' | 'good' | 'lag' = 'perfect';
        if (currentFps < 45) status = 'lag';
        else if (currentFps < 58) status = 'good';

        setMetrics({
          fps: currentFps,
          frameTimeMs: avgFrameMs,
          status,
          droppedFrames: droppedCountRef.current,
        });

        frameCountRef.current = 0;
        lastSampleTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isActive]);

  return metrics;
}
