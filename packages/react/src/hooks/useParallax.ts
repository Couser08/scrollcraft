'use client';

/**
 * 120 FPS Direct DOM Parallax Hook
 * Forwards React ref to the @scrollcraft/core ParallaxSolver.
 * Features:
 * - Autonomous viewport visibility culling via globalVisibilityManager
 * - SmartCompositor dynamic layer lifecycle
 * - Zero layout thrashing on scroll
 * Strictly under 650 LOC.
 */

import { useEffect } from 'react';
import {
  ticker,
  ParallaxSolver,
  GlobalResizeManager,
  TransformComposer,
  globalVisibilityManager,
} from '@scrollcraft/core';
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

    // Initialize Core Solver (SmartCompositor handles layer promotion dynamically)
    const solver = new ParallaxSolver(node, options);
    const taskId = `parallax-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    // Re-measure on window resize, element resize, and font readiness
    const measureGeometry = () => {
      if (isMounted) solver.measure();
    };
    const unobserveResize = GlobalResizeManager.observe(node, measureGeometry);
    window.addEventListener('resize', measureGeometry, { passive: true });
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measureGeometry();
      });
    }

    // Register strictly separated Ticker phases
    ticker.add(taskId, 'update', () => {
      const scrollOffset = options.direction === 'horizontal'
        ? (window.scrollX || window.pageXOffset)
        : (engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset));
      solver.update(scrollOffset);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    // Autonomous Viewport Culling
    const unobserveVisibility = globalVisibilityManager.observe(node, (isVisible) => {
      solver.setVisible(isVisible);
      if (isVisible) {
        // Re-measure on entering viewport to avoid stale geometry from initial load shifts
        solver.measure();
        ticker.resumeTask(taskId);
      } else {
        ticker.pauseTask(taskId);
      }
    });

    return () => {
      isMounted = false;
      window.removeEventListener('resize', measureGeometry);
      unobserveVisibility();
      unobserveResize();
      ticker.remove(taskId);
      solver.destroy();
    };
  }, [
    options.speed,
    options.direction,
    options.min,
    options.max,
    options.driver,
    reducedMotion,
    respectReducedMotion,
    targetRef,
    engine,
  ]);
}
