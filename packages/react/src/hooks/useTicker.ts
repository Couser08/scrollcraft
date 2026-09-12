'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ticker, TickerCallback, TickerPhase } from '@scrollcraft/core';

export interface UseTickerOptions {
  /** Phase in the 3-stage game loop: 'measure' | 'update' | 'render'. Default: 'update' */
  phase?: TickerPhase;
  /** Whether the task is actively scheduled. When false, task is removed to permit Idle Sleep. Default: true */
  enabled?: boolean;
}

/**
 * Developer-Facing Autonomous Ticker Hook
 * Hooks callbacks into ScrollCraft's centralized 120 FPS game loop without spawning
 * competing requestAnimationFrame loops.
 * 
 * Guarantees:
 * - Direct execution inside the requested TickerPhase ('measure' | 'update' | 'render').
 * - Zero task thrashing: stable ref ensures callback identity changes do not re-bind tasks.
 * - Full SSR and React 19 StrictMode safety.
 * - Zero-allocation teardown on component unmount.
 */
export function useTicker(
  callback: TickerCallback,
  options?: UseTickerOptions | TickerPhase
): void {
  const phase: TickerPhase = typeof options === 'string' ? options : (options?.phase ?? 'update');
  const enabled = typeof options === 'object' ? (options.enabled ?? true) : true;

  const callbackRef = useRef<TickerCallback>(callback);
  callbackRef.current = callback;

  const idRef = useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = `sc-hook-${Math.random().toString(36).slice(2, 9)}`;
  }

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;

    const taskId = idRef.current!;
    const wrappedCallback: TickerCallback = (dt, elapsed, current) => {
      callbackRef.current(dt, elapsed, current);
    };

    ticker.add(taskId, phase, wrappedCallback);

    return () => {
      ticker.remove(taskId, phase);
    };
  }, [phase, enabled]);
}
