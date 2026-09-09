'use client';

/**
 * Zero-Rerender useScrollProgress Hook
 * Returns lightweight ScrollValue observables for 120 FPS updates.
 * Strictly under 650 LOC.
 */

import { useEffect, useRef } from 'react';
import { createScrollValue, ScrollValue } from '@scrollcraft/core';
import { useScrollCraft, useScrollState } from '../context';

export interface UseScrollProgressOptions {
  /**
   * If true, triggers React state re-renders via useSyncExternalStore.
   * Default: false (returns zero-rerender ScrollValue observables).
   */
  reactive?: boolean;
}

export function useScrollProgress(options: UseScrollProgressOptions = {}) {
  const { reactive = false } = options;
  const { subscribe } = useScrollCraft();

  const progressValueRef = useRef<ScrollValue<number> | null>(null);
  const scrollYValueRef = useRef<ScrollValue<number> | null>(null);

  if (!progressValueRef.current) {
    progressValueRef.current = createScrollValue(0);
    scrollYValueRef.current = createScrollValue(0);
  }

  useEffect(() => {
    const unsub = subscribe((metrics) => {
      progressValueRef.current?.set(metrics.progress);
      scrollYValueRef.current?.set(metrics.scroll);
    });

    return () => {
      unsub();
    };
  }, [subscribe]);

  const reactiveProgress = useScrollState((m) => m.progress, undefined, { enabled: reactive });
  const reactiveScrollY = useScrollState((m) => m.scroll, undefined, { enabled: reactive });

  const progressVal = progressValueRef.current ?? createScrollValue(0);
  const scrollYVal = scrollYValueRef.current ?? createScrollValue(0);

  return {
    /** Observable progress value (0 to 1) for zero-rerender subscriptions */
    progressValue: progressVal,
    /** Observable scroll position in pixels */
    scrollYValue: scrollYVal,
    /** Reactive progress number (only active if reactive: true) */
    progress: reactive ? (reactiveProgress as number) : progressVal.get(),
    /** Reactive scrollY number (only active if reactive: true) */
    scrollY: reactive ? (reactiveScrollY as number) : scrollYVal.get(),
  };
}
