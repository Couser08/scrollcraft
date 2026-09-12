'use client';

import { useEffect, useRef } from 'react';
import { useScrollCraft } from '../context';

export interface RenderTrackerReport {
  /** Total number of times this component has rendered */
  renderCount: number;
  /** Number of times this component rendered while scroll velocity was non-zero */
  rendersWhileScrolling: number;
  /** True if component re-rendered during active scrolling */
  isViolating: boolean;
}

/**
 * ScrollCraft Zero-Rerender Audit Tracker
 * Audits component lifecycles to detect accidental React Virtual DOM thrashing during active gestures.
 * 
 * Guarantees:
 * - Reads scroll velocity via imperative subscription without triggering re-renders.
 * - Tracks re-renders synchronously without scheduling additional state updates.
 * - In non-production environments, logs actionable guidance when scroll re-renders are detected.
 */
export function useRenderTracker(componentName: string, enabled: boolean = true): RenderTrackerReport {
  const { subscribe, getMetrics } = useScrollCraft();
  const renderCountRef = useRef(0);
  const scrollRendersRef = useRef(0);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const unsub = subscribe((metrics) => {
      isScrollingRef.current = Math.abs(metrics.velocity) > 0.1;
    });
    return unsub;
  }, [subscribe, enabled]);

  if (enabled) {
    renderCountRef.current++;
    const currentVelocity = getMetrics ? Math.abs(getMetrics().velocity) : 0;
    if (isScrollingRef.current || currentVelocity > 0.1) {
      scrollRendersRef.current++;
      if (
        typeof process !== 'undefined' &&
        process.env?.NODE_ENV !== 'production' &&
        scrollRendersRef.current === 3 &&
        typeof console !== 'undefined'
      ) {
        console.warn(
          `[ScrollCraft Audit] <${componentName}> has re-rendered ${scrollRendersRef.current} times during active scroll! ` +
          `Ensure scroll metrics are applied via direct DOM refs or useSyncExternalStore selectors rather than useState in scroll listeners.`
        );
      }
    }
  }

  return {
    renderCount: renderCountRef.current,
    rendersWhileScrolling: scrollRendersRef.current,
    isViolating: scrollRendersRef.current > 0,
  };
}
