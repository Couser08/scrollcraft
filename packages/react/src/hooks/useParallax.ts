'use client';

/**
 * 120 FPS Direct DOM Parallax Hook
 * Forwards React ref to the @scrollcraft/core ParallaxSolver.
 * Zero layout thrashing, intersection-based relative offsets.
 * Strictly under 650 LOC.
 */

import { useEffect } from 'react';
import { ticker, ParallaxSolver } from '@scrollcraft/core';
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
      node.style.transform = '';
      return;
    }

    node.style.willChange = 'transform';
    
    // Initialize Core Solver
    const solver = new ParallaxSolver(node, options);
    const taskId = `parallax-${Math.random().toString(36).slice(2, 8)}`;

    // Re-measure on resize and DOM mutations
    const measureGeometry = () => solver.measure();
    window.addEventListener('resize', measureGeometry, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measureGeometry());
      resizeObserver.observe(node);
      if (node.parentElement) {
        resizeObserver.observe(node.parentElement);
      }
    }

    // Register strictly separated Ticker phases
    ticker.add(taskId, 'update', () => {
      // Get global metrics from engine, NO DOM READS
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      solver.update(scrollY);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      window.removeEventListener('resize', measureGeometry);
      resizeObserver?.disconnect();
      ticker.remove(taskId);
      if (node) {
        node.style.willChange = '';
        node.style.transform = '';
      }
    };
  }, [options.speed, options.direction, options.min, options.max, reducedMotion, respectReducedMotion, targetRef, engine]);
}
