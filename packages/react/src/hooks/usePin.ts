'use client';

/**
 * usePin Hook for Declarative Scroll Pinning
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { PinOptions, PinSolver, PinState } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export function usePin<T extends HTMLElement = HTMLDivElement>(options: PinOptions = {}) {
  const elementRef = useRef<T | null>(null);
  const solverRef = useRef<PinSolver | null>(null);
  const [pinState, setPinState] = useState<PinState>({
    isPinned: false,
    progress: 0,
    pinOffsetY: 0,
  });

  const { metrics } = useScrollCraft();

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    solverRef.current = new PinSolver(el, {
      ...options,
      onProgress: (p) => {
        options.onProgress?.(p);
      },
    });

    const handleResize = () => {
      solverRef.current?.measure();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (el) el.style.transform = '';
    };
  }, [options.duration, options.topOffset]);

  useEffect(() => {
    if (!solverRef.current) return;
    const nextState = solverRef.current.update(metrics.current);
    solverRef.current.render();
    setPinState(nextState);
  }, [metrics.current]);

  return {
    ref: elementRef,
    isPinned: pinState.isPinned,
    progress: pinState.progress,
    pinOffsetY: pinState.pinOffsetY,
  };
}
