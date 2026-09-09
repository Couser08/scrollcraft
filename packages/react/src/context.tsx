'use client';

/**
 * ScrollCraft Root Provider & Zero-Rerender Context
 * Implements dual-layer architecture: direct DOM updates for 120 FPS motion
 * and useSyncExternalStore for selective reactive UI readouts.
 * Strictly under 650 LOC.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { InertiaEngine, ScrollMetrics } from '@scrollcraft/core';
import { ScrollContextValue, ScrollProviderProps } from './types';

const defaultMetrics: ScrollMetrics = {
  scroll: 0,
  limit: 0,
  velocity: 0,
  direction: 0,
  progress: 0,
  current: 0,
  target: 0,
  maxScroll: 0,
};

const ScrollContext = createContext<ScrollContextValue>({
  engine: null,
  scrollTo: () => {},
  resize: () => {},
  isReady: false,
  reducedMotion: false,
  getMetrics: () => defaultMetrics,
  subscribe: () => () => {},
});

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  smooth = true,
  autoResetOnRouteChange = false,
  autoRecalc = true,
  respectReducedMotion = true,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const engineRef = useRef<InertiaEngine | null>(null);

  // Serialize smooth prop to prevent referential-inequality re-init loops
  const smoothConfigKey = typeof smooth === 'object' ? JSON.stringify(smooth) : String(smooth);
  const smoothPropRef = useRef(smooth);
  smoothPropRef.current = smooth;

  // Initialize engine once without causing re-renders
  if (!engineRef.current && typeof window !== 'undefined') {
    const config = typeof smooth === 'object' ? smooth : {};
    engineRef.current = new InertiaEngine(config);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect user OS reduced motion preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMotionReduced = motionQuery.matches && respectReducedMotion;
    setReducedMotion(isMotionReduced);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches && respectReducedMotion);
    };
    motionQuery.addEventListener('change', onMotionChange);

    const activeSmooth = smoothPropRef.current;
    // Safely re-instantiate engine if cleared by React StrictMode cleanup pass
    if (!engineRef.current) {
      const config = typeof activeSmooth === 'object' ? activeSmooth : {};
      engineRef.current = new InertiaEngine(config);
    }

    const engine = engineRef.current;
    if (engine) {
      if (activeSmooth && !isMotionReduced) {
        engine.init();
      }
      setIsReady(true);
    }

    // Window resize handling (debounced via requestAnimationFrame, no body ResizeObserver loop)
    let resizeRafId: number | null = null;
    const handleResize = () => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        engine?.resize();
        resizeRafId = null;
      });
    };

    if (autoRecalc && typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize, { passive: true });

      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(() => {
          engine?.resize();
        });
      }
    }

    // Route change handling (non-destructive resize, opt-in reset to top)
    const handleRouteChange = (isPop: boolean) => {
      requestAnimationFrame(() => {
        if (!isPop && autoResetOnRouteChange) {
          engine?.scrollTo(0, { immediate: true });
        }
        engine?.resize();
      });
    };

    const onPopState = () => handleRouteChange(true);
    window.addEventListener('popstate', onPopState);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('popstate', onPopState);
      if (autoRecalc) {
        window.removeEventListener('resize', handleResize);
        if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      }
      engine?.destroy();
      engineRef.current = null;
    };
  }, [smoothConfigKey, autoResetOnRouteChange, autoRecalc, respectReducedMotion]);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (t: number) => number;
      }
    ) => {
      engineRef.current?.scrollTo(target, options);
    },
    []
  );

  const resize = useCallback(() => {
    engineRef.current?.resize();
  }, []);

  const getMetrics = useCallback(() => {
    return engineRef.current?.getMetrics() ?? defaultMetrics;
  }, []);

  const subscribe = useCallback((callback: (metrics: ScrollMetrics) => void) => {
    if (engineRef.current) {
      return engineRef.current.subscribe(callback);
    }
    callback(defaultMetrics);
    return () => {};
  }, []);

  const contextValue = useMemo<ScrollContextValue>(
    () => ({
      engine: engineRef.current,
      scrollTo,
      resize,
      isReady,
      reducedMotion,
      getMetrics,
      subscribe,
    }),
    [scrollTo, resize, isReady, reducedMotion, getMetrics, subscribe]
  );

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollCraft = (): ScrollContextValue => {
  return useContext(ScrollContext);
};

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  const recordA = a as Record<string, unknown>;
  const recordB = b as Record<string, unknown>;
  const keysA = Object.keys(recordA);
  const keysB = Object.keys(recordB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(recordB, key) || !Object.is(recordA[key], recordB[key])) {
      return false;
    }
  }
  return true;
}

export interface ScrollStateOptions {
  enabled?: boolean;
}

/**
 * Selective reactive state subscriber using useSyncExternalStore.
 * Allows components (like HUDs or percentage counters) to subscribe to specific metrics
 * without forcing root tree re-renders.
 */
export function useScrollState<T = ScrollMetrics>(
  selector?: (metrics: ScrollMetrics) => T,
  isEqual: (a: T, b: T) => boolean = shallowEqual,
  options: ScrollStateOptions = {}
): T {
  const { enabled = true } = options;
  const { subscribe, getMetrics } = useScrollCraft();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const isEqualRef = useRef(isEqual);
  isEqualRef.current = isEqual;

  const lastSelectedRef = useRef<{ hasValue: boolean; value: T; raw: ScrollMetrics } | null>(null);

  const getSnapshot = () => {
    if (!enabled) {
      if (!lastSelectedRef.current) {
        const currentSelector = selectorRef.current;
        const initial = currentSelector ? currentSelector(defaultMetrics) : (defaultMetrics as unknown as T);
        lastSelectedRef.current = { hasValue: true, value: initial, raw: defaultMetrics };
      }
      return lastSelectedRef.current.value;
    }

    const raw = getMetrics();
    const currentSelector = selectorRef.current;
    const nextSelected = currentSelector ? currentSelector(raw) : (raw as unknown as T);

    if (lastSelectedRef.current && lastSelectedRef.current.hasValue) {
      if (isEqualRef.current(lastSelectedRef.current.value, nextSelected)) {
        return lastSelectedRef.current.value;
      }
    }

    lastSelectedRef.current = { hasValue: true, value: nextSelected, raw };
    return nextSelected;
  };

  const cachedServerRef = useRef<{ hasValue: boolean; value: T } | null>(null);
  const getServerSnapshot = () => {
    if (!cachedServerRef.current) {
      const currentSelector = selectorRef.current;
      const val = currentSelector ? currentSelector(defaultMetrics) : (defaultMetrics as unknown as T);
      cachedServerRef.current = { hasValue: true, value: val };
    }
    return cachedServerRef.current.value;
  };

  const noopSubscribe = useCallback(() => () => {}, []);
  const activeSubscribe = enabled ? subscribe : noopSubscribe;

  return useSyncExternalStore(activeSubscribe, getSnapshot, getServerSnapshot);
}

