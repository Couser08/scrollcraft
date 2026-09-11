'use client';

/**
 * 120 FPS Direct DOM Parallax Hook
 * Forwards React ref to the @scrollcraft/core ParallaxSolver.
 * Zero layout thrashing, intersection-based relative offsets.
 * Strictly under 650 LOC.
 */

import { useEffect } from 'react';
import { ticker, ParallaxSolver, GlobalResizeManager, TransformComposer } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { ParallaxOptions } from '../types';

export function useParallax<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options: ParallaxOptions = {}
): void {
  const { respectReducedMotion = true } = options;
  const { reducedMotion, engine } = useScrollCraft();

  useEffect(() => {
    const node = targetRef.current;
    if (!node || typeof window === 'undefined') return;

    if (reducedMotion && respectReducedMotion) {
      if (node) {
        TransformComposer.clear(node, 'parallax');
      }
      return;
    }

    node.style.willChange = 'transform';
    
    // Initialize Core Solver
    const solver = new ParallaxSolver(node, options);
    const taskId = `parallax-${Math.random().toString(36).slice(2, 8)}`;

    // Re-measure on window resize and font readiness (zero layout reads on scroll)
    const measureGeometry = () => solver.measure();
    const unobserve = GlobalResizeManager.observe(node, measureGeometry);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measureGeometry);
    }

    // Register strictly separated Ticker phases
    ticker.add(taskId, 'update', () => {
      // Get global metrics from engine, NO DOM READS
      const scrollOffset = options.direction === 'horizontal'
        ? (window.scrollX || window.pageXOffset)
        : (engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset));
      solver.update(scrollOffset);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      unobserve();
      ticker.remove(taskId);
      solver.destroy();
      if (node) {
        node.style.willChange = '';
      }
    };
  }, [options.speed, options.direction, options.min, options.max, options.driver, reducedMotion, respectReducedMotion, targetRef, engine]);
}
