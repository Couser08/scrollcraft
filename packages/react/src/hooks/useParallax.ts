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

    // Re-measure on window resize and font readiness
    const measureGeometry = () => solver.measure();
    const unobserveResize = GlobalResizeManager.observe(node, measureGeometry);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measureGeometry);
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
        ticker.resumeTask(taskId);
      } else {
        ticker.pauseTask(taskId);
      }
    });

    return () => {
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
