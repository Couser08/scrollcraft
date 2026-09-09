'use client';

/**
 * High-performance useScrollProgress hook
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { useScrollCraft } from '../context';

export interface UseScrollProgressOptions {
  /** If true, updates React state on every frame. If false, returns a mutable ref to avoid re-renders */
  reactive?: boolean;
}

export function useScrollProgress(options: UseScrollProgressOptions = { reactive: true }) {
  const { metrics } = useScrollCraft();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = metrics.progress;
    if (options.reactive) {
      setProgress(metrics.progress);
    }
  }, [metrics.progress, options.reactive]);

  return {
    progress: options.reactive ? progress : progressRef.current,
    progressRef,
    scrollY: metrics.current,
    velocity: metrics.velocity,
    direction: metrics.direction,
  };
}
