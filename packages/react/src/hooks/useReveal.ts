'use client';

/**
 * 120 FPS Direct DOM Reveal-on-Enter Hook
 * Subscribes to the single global intersection observer.
 * Strictly under 650 LOC.
 */

import { useEffect } from 'react';
import { revealObserver } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { RevealOptions } from '../types';

export function useReveal<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options: RevealOptions = {}
): void {
  const { respectReducedMotion = true } = options;
  const { reducedMotion } = useScrollCraft();

  useEffect(() => {
    const node = targetRef.current;
    if (!node || typeof window === 'undefined') return;

    if (reducedMotion && respectReducedMotion) {
      node.style.opacity = '1';
      node.style.transform = 'none';
      return;
    }

    revealObserver.observe(node, options);

    return () => {
      revealObserver.unobserve(node);
    };
  }, [
    options.direction,
    options.distance,
    options.duration,
    options.delay,
    options.threshold,
    options.once,
    reducedMotion,
    respectReducedMotion,
    targetRef,
  ]);
}
