'use client';

/**
 * Magnetic Micro-Interaction Hook
 * Passes ref to Core MagneticSolver for true zero-rerender spring physics.
 * Strictly under 650 LOC.
 */

import { useEffect, useRef } from 'react';
import { MagneticSolver } from '@scrollcraft/core';

export interface MagneticOptions {
  strength?: number;
  radius?: number;
  stiffness?: number;
  damping?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof window === 'undefined') return;

    const solver = new MagneticSolver(node, options);

    return () => {
      solver.destroy();
    };
  }, [options.strength, options.radius, options.stiffness, options.damping]);

  return {
    ref: elementRef,
    // Note: No more reactive style or bind needed here! The MagneticSolver handles DOM listeners and transforms directly.
  };
}
