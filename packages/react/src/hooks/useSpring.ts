'use client';

/**
 * In-House Spring Physics Hook for Micro-Interactions
 * Powered by analytical harmonic oscillator math in @scrollcraft/core.
 * Zero external dependencies. Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import { springStep, SpringConfig } from '@scrollcraft/core';

const defaultSpringConfig: SpringConfig = {
  stiffness: 180,
  damping: 18,
  mass: 1,
  precision: 0.001,
};

export function useSpring(
  targetValue: number,
  config: Partial<SpringConfig> = {}
): number {
  const [value, setValue] = useState(targetValue);
  const stateRef = useRef({
    current: targetValue,
    velocity: 0,
    target: targetValue,
  });

  const mergedConfig = useRef<SpringConfig>({
    ...defaultSpringConfig,
    ...config,
  });

  useEffect(() => {
    stateRef.current.target = targetValue;
  }, [targetValue]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const res = springStep(
        stateRef.current.current,
        stateRef.current.target,
        stateRef.current.velocity,
        mergedConfig.current,
        dt
      );

      stateRef.current.current = res.position;
      stateRef.current.velocity = res.velocity;

      setValue(res.position);

      if (!res.settled) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [targetValue]);

  return value;
}
