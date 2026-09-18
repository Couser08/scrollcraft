'use client';

/**
 * 120 FPS Sticky Pinning Hook with Layout Diagnostics & Zero-Lag Throttling
 * Universal Dual API:
 *   - Headless: `const { ref, progressValue } = usePin<HTMLDivElement>(options)`
 *   - Ref-Forwarding: `usePin(existingRef, options)`
 *
 * Features:
 * - GSAP 4-state lifecycle: onEnter, onLeave, onEnterBack, onLeaveBack (0 re-renders)
 * - Auto-spacing placeholder track height generation (`pinSpacing: boolean | number`)
 * - Zero-rerender observable `progressValue: ScrollValue<number>`
 * - Captured-node closure cleanup preventing stale node leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { ticker, PinSolver, GlobalResizeManager, createScrollValue, ScrollValue } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { PinOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

export interface UsePinReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  progress: number;
  pinOffsetY: number;
  isPinned: boolean;
  progressValue: ScrollValue<number>;
}

export function usePin<T extends HTMLElement = HTMLDivElement>(
  options?: PinOptions
): UsePinReturn<T>;
export function usePin<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: PinOptions
): UsePinReturn<T>;
export function usePin<T extends HTMLElement = HTMLDivElement>(
  refOrOptions?: React.RefObject<T | null> | PinOptions,
  maybeOptions?: PinOptions
): UsePinReturn<T> {
  const { ref, options } = useDualRef<T, PinOptions>(refOrOptions, maybeOptions);
  const {
    top = 0,
    duration,
    onProgress,
    trackState = false,
    pinSpacing,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    progressValue: externalProgressValue,
  } = options;

  const { engine } = useScrollCraft();

  const [progress, setProgress] = useState(0);
  const [pinOffsetY, setPinOffsetY] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  const progressRef = useRef(0);
  const taskIdRef = useRef<string>(`pin-${Math.random().toString(36).slice(2, 8)}`);
  const internalProgressValue = useRef<ScrollValue<number> | null>(null);

  if (!internalProgressValue.current) {
    internalProgressValue.current = (externalProgressValue as ScrollValue<number>) ?? createScrollValue(0);
  }

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;
  const onEnterBackRef = useRef(onEnterBack);
  onEnterBackRef.current = onEnterBack;
  const onLeaveBackRef = useRef(onLeaveBack);
  onLeaveBackRef.current = onLeaveBack;

  useEffect(() => {
    const node = captureNode(ref);
    if (!node || typeof window === 'undefined') return;

    let isMounted = true;

    node.style.position = 'sticky';
    node.style.top = `${top}px`;

    // Auto-spacing placeholder track generation when pinSpacing is enabled
    let spacerElement: HTMLDivElement | null = null;
    if (pinSpacing) {
      spacerElement = document.createElement('div');
      spacerElement.setAttribute('data-sc-pin-spacer', 'true');
      spacerElement.style.display = 'block';
      spacerElement.style.pointerEvents = 'none';
      spacerElement.style.visibility = 'hidden';
      const spacerHeight = typeof pinSpacing === 'number'
        ? pinSpacing
        : (duration ?? window.innerHeight);
      spacerElement.style.height = `${spacerHeight}px`;
      node.parentNode?.insertBefore(spacerElement, node.nextSibling);
    }

    // Dev diagnostic for overflow containers breaking position: sticky
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
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
      bottomOffset: options.bottom,
      disableTransform: options.disableTransform ?? true,
    });

    const measureGeometry = () => {
      if (isMounted) solver.measure();
    };
    const unobserve = GlobalResizeManager.observe(node, measureGeometry);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measureGeometry();
      });
    }

    const taskId = taskIdRef.current;
    let zoneState: 'before' | 'inside' | 'after' = 'before';

    ticker.add(taskId, 'update', () => {
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      const state = solver.update(scrollY);
      const nextProgress = state.progress;

      // Update zero-rerender observable
      internalProgressValue.current?.set(nextProgress);

      // GSAP 4-State Lifecycle transitions
      let nextZone: 'before' | 'inside' | 'after' = 'before';
      if (nextProgress > 0 && nextProgress < 1) {
        nextZone = 'inside';
      } else if (nextProgress >= 1) {
        nextZone = 'after';
      }

      if (zoneState !== nextZone) {
        if (zoneState === 'before' && nextZone === 'inside') {
          onEnterRef.current?.();
        } else if (zoneState === 'inside' && nextZone === 'after') {
          onLeaveRef.current?.();
        } else if (zoneState === 'after' && nextZone === 'inside') {
          onEnterBackRef.current?.();
        } else if (zoneState === 'inside' && nextZone === 'before') {
          onLeaveBackRef.current?.();
        }
        zoneState = nextZone;
      }

      // Extract state for optional reactive tracking
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
      isMounted = false;
      unobserve();
      ticker.remove(taskId);
      solver.destroy();
      if (spacerElement) {
        spacerElement.remove();
      }
      node.style.position = '';
      node.style.top = '';
    };
  }, [
    top,
    options.bottom,
    duration,
    options.disableTransform,
    pinSpacing,
    trackState,
    ref,
    engine,
  ]);

  return {
    ref,
    progress,
    pinOffsetY,
    isPinned,
    progressValue: internalProgressValue.current ?? createScrollValue(0),
  };
}
