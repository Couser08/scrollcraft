'use client';

/**
 * Direct DOM Parallax Hook (Zero-Rerender Subpixel Transforms)
 * Universal Dual API:
 *   - Headless: `const ref = useParallax<HTMLDivElement>(options)`
 *   - Ref-Forwarding: `useParallax(existingRef, options)`
 *
 * Features:
 * - Autonomous viewport visibility culling via globalVisibilityManager
 * - SmartCompositor dynamic layer lifecycle
 * - Zero layout thrashing on scroll
 * - Resilient layout shift detection (ResizeObserver, font ready, image load)
 * - Auto-hero anti-jump (`origin="auto"`) and bleed prevention (`bleed={true}`)
 * - Strictly 0 React re-renders during scroll
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
import { useDualRef, captureNode } from '../utils/ref';

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options?: ParallaxOptions
): React.RefObject<T | null>;
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: ParallaxOptions
): void;
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  refOrOptions?: React.RefObject<T | null> | ParallaxOptions,
  maybeOptions?: ParallaxOptions
): React.RefObject<T | null> | void {
  const { ref, options, isHeadless } = useDualRef<T, ParallaxOptions>(refOrOptions, maybeOptions);
  const { respectReducedMotion = true } = options;
  const { reducedMotion, engine } = useScrollCraft();

  useEffect(() => {
    const node = captureNode(ref);
    if (!node || typeof window === 'undefined') return;

    if (reducedMotion && respectReducedMotion) {
      TransformComposer.clear(node, 'parallax');
      return;
    }

    // Initialize Core Solver (SmartCompositor handles layer promotion dynamically)
    const solver = new ParallaxSolver(node, options);
    const taskId = `parallax-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    // Re-measure on window resize, element resize, font readiness, and image load
    const measureGeometry = () => {
      if (isMounted) solver.measure();
    };
    const unobserveResize = GlobalResizeManager.observe(node, measureGeometry);
    window.addEventListener('resize', measureGeometry, { passive: true });
    window.addEventListener('load', measureGeometry, { passive: true });

    // Capture image load events across the document to update animationRange upon layout shifts
    const onImageLoad = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === 'IMG') {
        measureGeometry();
      }
    };
    window.addEventListener('load', onImageLoad, { capture: true, passive: true });

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
      window.removeEventListener('load', measureGeometry);
      window.removeEventListener('load', onImageLoad, true);
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
    options.origin,
    options.bleed,
    options.scale,
    options.rotate,
    options.driver,
    reducedMotion,
    respectReducedMotion,
    ref,
    engine,
  ]);

  if (isHeadless) {
    return ref;
  }
}
