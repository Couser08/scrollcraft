'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import { DrawSolver, DrawSolverOptions, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export function useScrollDraw<T extends SVGGeometryElement = SVGPathElement>(
  options: DrawSolverOptions
) {
  const elementRef = useRef<T>(null);
  const solverRef = useRef<DrawSolver | null>(null);
  const { subscribe, reducedMotion } = useScrollCraft();

  // Serialize options to a stable key to support dynamic re-configuration without churning on object identity
  const optionsKey = JSON.stringify(options);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const solver = new DrawSolver(element, options);
    solverRef.current = solver;

    const taskId = `draw-${Math.random().toString(36).slice(2, 8)}`;
    
    const measureGeometry = () => solver.measure();
    const unobserveElement = GlobalResizeManager.observe(element, measureGeometry);
    const unobserveParent = element.parentElement
      ? GlobalResizeManager.observe(element.parentElement, measureGeometry)
      : () => {};
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measureGeometry);
    }

    let currentScroll = 0;
    let currentVelocity = 0;

    const unsubscribe = subscribe((metrics) => {
      currentScroll = metrics.scroll;
      currentVelocity = metrics.velocity;
    });

    ticker.add(`${taskId}-update`, 'update', (dt) => {
      solver.update(currentScroll, currentVelocity, dt, reducedMotion);
    });

    ticker.add(`${taskId}-render`, 'render', () => {
      solver.render();
    });

    // Initial measurement
    solver.measure();

    return () => {
      unsubscribe();
      unobserveElement();
      unobserveParent();
      ticker.remove(`${taskId}-update`);
      ticker.remove(`${taskId}-render`);
      solver.destroy();
      solverRef.current = null;
    };
  }, [reducedMotion, subscribe, optionsKey]);

  return elementRef;
}
