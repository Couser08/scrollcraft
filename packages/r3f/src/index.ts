/**
 * @scrollcraft/r3f - React Three Fiber Bridge
 * Strictly under 650 LOC.
 */

import { useRef, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { createTimelineReader } from './createTimelineReader';
import { createFallbackReader } from '@scrollcraft/core';

export interface Scroll3DMetrics {
  progress: number;
  velocity: number;
  direction: 1 | -1 | 0;
}

export function useScroll3D(
  target: Element | null,
  options?: { axis?: 'block' | 'inline' }
) {
  // Graceful error if called outside R3F <Canvas>
  try {
    useThree();
  } catch (e) {
    throw new Error('[ScrollCraft] useScroll3D must be called inside a <Canvas> component.');
  }

  // Mutable refs to prevent React state invalidation loops inside useFrame
  const metrics = useRef<Scroll3DMetrics>({ progress: 0, velocity: 0, direction: 0 });
  const prevProgress = useRef(0);
  
  const readerRef = useRef<{ read: () => number; destroy: () => void } | null>(null);

  // useLayoutEffect is critical for synchronously attaching to DOM before painting,
  // but we must guard against SSR context (Next.js)
  const useSafeLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

  useSafeLayoutEffect(() => {
    if (!target) return;

    // Feature Detection + Fallback Strategy (Tier 1 vs Tier 2)
    const reader = createTimelineReader(target, options?.axis) ?? createFallbackReader(target, options?.axis);
    readerRef.current = reader;

    return () => {
      // Memory cleanup: WAAPI dummy animations will leak if not canceled
      reader.destroy();
      readerRef.current = null;
    };
  }, [target, options?.axis]);

  // The consumer explicitly calls this tick() function inside their R3F useFrame.
  // This guarantees we never double-pump the RequestAnimationFrame loop.
  const tick = (): Scroll3DMetrics => {
    if (!readerRef.current) return metrics.current;

    const p = readerRef.current.read();
    const v = p - prevProgress.current;
    
    metrics.current.progress = p;
    metrics.current.velocity = v;
    metrics.current.direction = v > 0 ? 1 : v < 0 ? -1 : 0;
    
    prevProgress.current = p;
    
    return metrics.current;
  };

  return { metrics, tick };
}

export * from './createTimelineReader';
