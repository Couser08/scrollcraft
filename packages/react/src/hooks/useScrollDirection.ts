'use client';

/**
 * useScrollDirection Hook with iOS Safari Rubber-Band Bounce Guard & Hysteresis
 * Universal Dual API:
 *   - Headless: `const { direction, isAtTop, ref } = useScrollDirection<HTMLElement>(options)`
 *   - Ref-Forwarding / Direct DOM Auto-Hide: `useScrollDirection(navbarRef, options)`
 *
 * Features:
 * - iOS Safari Rubber-Band Bounce Guard (scrollY <= 0 locks to 'up' and isAtTop=true)
 * - Dual-threshold directional hysteresis (15px down, 25px up)
 * - Direct GPU compositor auto-hide writes with 0 React re-renders via TransformComposer
 * - Captured-node closure cleanup preventing leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { TransformComposer } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { ScrollDirectionOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

export interface UseScrollDirectionReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  direction: 'up' | 'down';
  isAtTop: boolean;
}

export function useScrollDirection<T extends HTMLElement = HTMLElement>(
  options?: ScrollDirectionOptions
): UseScrollDirectionReturn<T>;
export function useScrollDirection<T extends HTMLElement = HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options?: ScrollDirectionOptions
): UseScrollDirectionReturn<T>;
export function useScrollDirection<T extends HTMLElement = HTMLElement>(
  refOrOptions?: React.RefObject<T | null> | ScrollDirectionOptions,
  maybeOptions?: ScrollDirectionOptions
): UseScrollDirectionReturn<T> {
  const { ref, options } = useDualRef<T, ScrollDirectionOptions>(refOrOptions, maybeOptions);
  const {
    thresholdDown = 15,
    thresholdUp = 25,
    hideTransform = 'translate3d(0, -100%, 0)',
    onDirectionChange,
  } = options;

  const { subscribe } = useScrollCraft();

  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);

  const directionRef = useRef<'up' | 'down'>('up');
  const isAtTopRef = useRef(true);
  const onDirectionChangeRef = useRef(onDirectionChange);
  onDirectionChangeRef.current = onDirectionChange;

  useEffect(() => {
    const node = captureNode(ref);

    let lastScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;
    let accumulatedDown = 0;
    let accumulatedUp = 0;

    const setVisibility = (dir: 'up' | 'down', atTop: boolean) => {
      const changed = directionRef.current !== dir || isAtTopRef.current !== atTop;
      directionRef.current = dir;
      isAtTopRef.current = atTop;

      if (node) {
        if (dir === 'down' && !atTop) {
          TransformComposer.set(node, 'direction', hideTransform);
        } else {
          TransformComposer.set(node, 'direction', 'translate3d(0, 0, 0)');
        }
      }

      if (changed) {
        setDirection(dir);
        setIsAtTop(atTop);
        onDirectionChangeRef.current?.(dir, atTop);
      }
    };

    const unsub = subscribe((metrics) => {
      const scrollY = metrics.scroll;
      const delta = scrollY - lastScrollY;

      // 1. iOS Safari Rubber-Band Overscroll Guard (Top)
      if (scrollY <= 0) {
        accumulatedDown = 0;
        accumulatedUp = 0;
        setVisibility('up', true);
        lastScrollY = 0;
        return;
      }

      // 2. iOS Safari Rubber-Band Overscroll Guard (Bottom)
      if (metrics.maxScroll > 0 && scrollY >= metrics.maxScroll) {
        lastScrollY = scrollY;
        return;
      }

      // 3. Dual-Threshold Hysteresis Calculation
      if (delta > 0) {
        // Scrolling downward
        accumulatedUp = 0;
        accumulatedDown += delta;
        if (accumulatedDown >= thresholdDown) {
          setVisibility('down', false);
        }
      } else if (delta < 0) {
        // Scrolling upward
        accumulatedDown = 0;
        accumulatedUp += Math.abs(delta);
        if (accumulatedUp >= thresholdUp) {
          setVisibility('up', false);
        }
      }

      lastScrollY = scrollY;
    });

    return () => {
      unsub();
      if (node) {
        TransformComposer.clear(node, 'direction');
      }
    };
  }, [
    thresholdDown,
    thresholdUp,
    hideTransform,
    ref,
    subscribe,
  ]);

  return {
    ref,
    direction,
    isAtTop,
  };
}
