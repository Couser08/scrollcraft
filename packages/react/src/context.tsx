'use client';

/**
 * ScrollCraft Root Provider & Context
 * Strictly under 650 LOC.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { InertiaEngine, ScrollMetrics } from '@scrollcraft/core';
import { ScrollContextValue, ScrollProviderProps } from './types';

const defaultMetrics: ScrollMetrics = {
  current: 0,
  target: 0,
  velocity: 0,
  direction: 0,
  progress: 0,
  maxScroll: 0,
};

const ScrollContext = createContext<ScrollContextValue>({
  metrics: defaultMetrics,
  scrollTo: () => {},
  isReady: false,
});

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  smooth = true,
}) => {
  const [metrics, setMetrics] = useState<ScrollMetrics>(defaultMetrics);
  const [isReady, setIsReady] = useState(false);

  const engine = useMemo(() => {
    if (typeof window === 'undefined' || !smooth) return null;
    const config = typeof smooth === 'object' ? smooth : {};
    return new InertiaEngine(config);
  }, [smooth]);

  useEffect(() => {
    if (!engine) {
      setIsReady(true);
      return;
    }

    engine.init();
    setIsReady(true);

    const unsubscribe = engine.subscribe((newMetrics) => {
      // Direct update for listeners
      setMetrics({ ...newMetrics });
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const scrollTo = (y: number, immediate: boolean = false) => {
    if (engine) {
      engine.scrollTo(y, immediate);
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    }
  };

  const contextValue = useMemo(
    () => ({
      metrics,
      scrollTo,
      isReady,
    }),
    [metrics, isReady]
  );

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};

export function useScrollCraft(): ScrollContextValue {
  return useContext(ScrollContext);
}
