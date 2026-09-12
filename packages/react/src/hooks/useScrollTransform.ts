'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import { TransformSolver, TransformSolverOptions, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export function useScrollTransform<T extends HTMLElement = HTMLDivElement>(
  options: Omit<TransformSolverOptions, 'onSnap'>
) {
  const elementRef = useRef<T>(null);
  const solverRef = useRef<TransformSolver | null>(null);
  const { subscribe, reducedMotion, scrollTo } = useScrollCraft();
  
  // Memoize options internally if needed, but for now we expect the user to pass a stable reference or we recreate.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onSnap = (targetScroll: number) => {
      scrollTo(targetScroll, { duration: 1 }); // Smooth scroll to target
    };

    const solver = new TransformSolver(element, { ...optionsRef.current, onSnap });
    solverRef.current = solver;

    const taskId = `transform-${Math.random().toString(36).slice(2, 8)}`;
    
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
  }, [reducedMotion, subscribe, scrollTo]); // Deliberately omit options to avoid re-binding if not memoized, though dynamic options might be needed later

  return elementRef;
}
