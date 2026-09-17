'use client';

/**
 * Universal SVG Geometry Scroll Draw Hook
 * Universal Dual API:
 *   - Headless: `const ref = useScrollDraw<SVGPathElement>(options)`
 *   - Ref-Forwarding: `useScrollDraw(existingRef, options)`
 *
 * Features:
 * - Universal SVG geometry support (<path>, <circle>, <rect>, <line>, <polyline>, <polygon>)
 * - Custom dashArray patterns and zero-rerender `onDrawProgress` callback
 * - Smooth physics-based scrubbing or one-shot play
 * - Captured-node closure cleanup preventing leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useLayoutEffect } from 'react';
import { DrawSolver, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { ScrollDrawOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

export function useScrollDraw<T extends SVGGeometryElement = SVGPathElement>(
  options?: ScrollDrawOptions
): React.RefObject<T | null>;
export function useScrollDraw<T extends SVGGeometryElement = SVGPathElement>(
  targetRef: React.RefObject<T | null>,
  options?: ScrollDrawOptions
): void;
export function useScrollDraw<T extends SVGGeometryElement = SVGPathElement>(
  refOrOptions?: React.RefObject<T | null> | ScrollDrawOptions,
  maybeOptions?: ScrollDrawOptions
): React.RefObject<T | null> | void {
  const { ref, options, isHeadless } = useDualRef<T, ScrollDrawOptions>(refOrOptions, maybeOptions);
  const solverRef = useRef<DrawSolver | null>(null);
  const { subscribe, reducedMotion } = useScrollCraft();

  const optionsKey = JSON.stringify({
    start: options.start,
    end: options.end,
    scrub: options.scrub,
    direction: options.direction,
    dashArray: options.dashArray,
    markers: options.markers,
  });

  const onDrawProgressRef = useRef(options.onDrawProgress);
  onDrawProgressRef.current = options.onDrawProgress;

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = captureNode(ref);
    if (!element) return;

    const solver = new DrawSolver(element, options);
    solverRef.current = solver;

    if (options.dashArray) {
      element.style.strokeDasharray = options.dashArray;
    }

    const taskId = `draw-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    const measureGeometry = () => {
      if (isMounted) solver.measure();
    };
    const unobserveElement = GlobalResizeManager.observe(element, measureGeometry);
    const unobserveParent = element.parentElement
      ? GlobalResizeManager.observe(element.parentElement, measureGeometry)
      : () => {};
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measureGeometry();
      });
    }

    let currentScroll = 0;
    let currentVelocity = 0;

    const unsubscribe = subscribe((metrics) => {
      currentScroll = metrics.scroll;
      currentVelocity = metrics.velocity;
    });

    ticker.add(`${taskId}-update`, 'update', (dt) => {
      solver.update(currentScroll, currentVelocity, dt, reducedMotion);
      onDrawProgressRef.current?.(solver.getProgress());
    });

    ticker.add(`${taskId}-render`, 'render', () => {
      solver.render();
    });

    solver.measure();

    return () => {
      isMounted = false;
      unsubscribe();
      unobserveElement();
      unobserveParent();
      ticker.remove(`${taskId}-update`);
      ticker.remove(`${taskId}-render`);
      solver.destroy();
      solverRef.current = null;
    };
  }, [reducedMotion, subscribe, optionsKey, ref]);

  if (isHeadless) {
    return ref;
  }
}
