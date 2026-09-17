'use client';

/**
 * Magnetic Micro-Interaction Hook
 * Universal Dual API:
 *   - Headless: `const { ref } = useMagnetic<HTMLButtonElement>(options)`
 *   - Ref-Forwarding: `useMagnetic(existingRef, options)`
 *
 * Features:
 * - Spring physics with zero React virtual DOM re-renders
 * - Interactive spring scaling (`scale?: number`)
 * - Multi-layer 3D magnetic parallax (`innerTargetRef`, `innerStrength`)
 * - Captured-node closure cleanup preventing leaks
 * Strictly under 650 LOC.
 */

import { useEffect } from 'react';
import { MagneticSolver } from '@scrollcraft/core';
import type { MagneticOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

export type { MagneticOptions };

export interface UseMagneticReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options?: MagneticOptions
): UseMagneticReturn<T>;
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options?: MagneticOptions
): UseMagneticReturn<T>;
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  refOrOptions?: React.RefObject<T | null> | MagneticOptions,
  maybeOptions?: MagneticOptions
): UseMagneticReturn<T> {
  const { ref, options } = useDualRef<T, MagneticOptions>(refOrOptions, maybeOptions);

  useEffect(() => {
    const node = captureNode(ref);
    if (!node || typeof window === 'undefined') return;

    const solver = new MagneticSolver(node, options);

    let innerSolver: MagneticSolver | null = null;
    if (options.innerTargetRef) {
      const innerNode = captureNode(options.innerTargetRef);
      if (innerNode) {
        innerSolver = new MagneticSolver(innerNode, {
          ...options,
          strength: options.innerStrength ?? (options.strength ? options.strength * 1.5 : 0.5),
        });
      }
    }

    return () => {
      solver.destroy();
      innerSolver?.destroy();
    };
  }, [
    options.strength,
    options.radius,
    options.stiffness,
    options.damping,
    options.scale,
    options.innerStrength,
    options.innerTargetRef,
    ref,
  ]);

  return { ref };
}
