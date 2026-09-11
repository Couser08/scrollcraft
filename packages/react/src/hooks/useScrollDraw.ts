'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import { DrawSolver, DrawSolverOptions, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export function useScrollDraw<T extends SVGGeometryElement = SVGPathElement>(
  options: DrawSolverOptions
) {
  const elementRef = useRef<T>(null);
  const solverRef = useRef<DrawSolver | null>(null);
  const { subscribe, reducedMotion } = useScrollCraft();

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const solver = new DrawSolver(element, optionsRef.current);
    solverRef.current = solver;

    const taskId = `draw-${Math.random().toString(36).slice(2, 8)}`;
    
    const measureGeometry = () => solver.measure();
    window.addEventListener('resize', measureGeometry, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measureGeometry());
      resizeObserver.observe(element);
      if (element.parentElement) {
        resizeObserver.observe(element.parentElement);
      }
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
      window.removeEventListener('resize', measureGeometry);
      resizeObserver?.disconnect();
      ticker.remove(`${taskId}-update`);
      ticker.remove(`${taskId}-render`);
      solver.destroy();
      if (element) {
        element.style.strokeDasharray = '';
        element.style.strokeDashoffset = '';
      }
      solverRef.current = null;
    };
  }, [reducedMotion, subscribe]);

  return elementRef;
}
