'use client';

/**
 * 120 FPS Sticky Pinning Hook with Layout Diagnostics & Zero-Lag Throttling
 * Forwards React ref to @scrollcraft/core PinSolver.
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { ticker, PinSolver } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { PinOptions } from '../types';

export interface UsePinReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  progress: number;
  pinOffsetY: number;
  isPinned: boolean;
}

export function usePin<T extends HTMLElement = HTMLDivElement>(
  targetRefOrOptions?: React.RefObject<T> | PinOptions,
  maybeOptions?: PinOptions
): UsePinReturn<T> {
  const isRefPassed =
    targetRefOrOptions && typeof targetRefOrOptions === 'object' && 'current' in targetRefOrOptions;

  const fallbackRef = useRef<T>(null);
  const targetRef = (isRefPassed
    ? (targetRefOrOptions as React.RefObject<T>)
    : fallbackRef) as React.RefObject<T>;

  const options = isRefPassed ? (maybeOptions ?? {}) : ((targetRefOrOptions as PinOptions) ?? {});
  const { top = 0, duration, onProgress, trackState = isRefPassed ? false : true } = options;

  const { engine } = useScrollCraft();

  const [progress, setProgress] = useState(0);
  const [pinOffsetY, setPinOffsetY] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  const progressRef = useRef(0);
  const taskIdRef = useRef<string>(`pin-${Math.random().toString(36).slice(2, 8)}`);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const node = targetRef.current;
    if (!node || typeof window === 'undefined') return;

    node.style.position = 'sticky';
    node.style.top = `${top}px`;

    // Dev diagnostic
    if (process.env.NODE_ENV !== 'production') {
      let parent = node.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const computed = window.getComputedStyle(parent);
        const overflow = computed.overflow + computed.overflowY + computed.overflowX;
        if (/(hidden|auto|scroll)/.test(overflow)) {
          console.warn(
            `[ScrollCraft] <Pin> element cannot stick because ancestor <${parent.tagName.toLowerCase()} class="${parent.className}"> has overflow: "${computed.overflow}". Remove the overflow property or place <Pin> outside this container.`
          );
          break;
        }
        parent = parent.parentElement;
      }
    }

    const solver = new PinSolver(node, {
      duration,
      topOffset: top,
    });

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

    const taskId = taskIdRef.current;

    ticker.add(taskId, 'update', () => {
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      const state = solver.update(scrollY);

      // Extract state for optional reactive tracking
      const nextProgress = state.progress;
      
      if (trackState && Math.abs(nextProgress - progressRef.current) > 0.008) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
        setPinOffsetY(state.pinOffsetY);
        setIsPinned(state.isPinned);
      } else {
        progressRef.current = nextProgress;
      }
      
      onProgressRef.current?.(nextProgress);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      window.removeEventListener('resize', measureGeometry);
      resizeObserver?.disconnect();
      ticker.remove(taskId);
      if (node) {
        node.style.position = '';
        node.style.top = '';
        node.style.transform = '';
      }
    };
  }, [top, duration, targetRef, trackState, engine]);

  return {
    ref: targetRef,
    progress,
    pinOffsetY,
    isPinned,
  };
}
