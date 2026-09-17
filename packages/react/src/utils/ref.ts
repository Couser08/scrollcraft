'use client';

/**
 * Universal Dual API & Captured-Node Ref Utilities for ScrollCraft React
 *
 * Implements:
 * 1. Universal Dual API (useHook(options) => ref OR useHook(ref, options))
 * 2. Captured-Node Closure Pattern:
 *    Guarantees that when consumers conditionally mount elements or swap forwarded refs,
 *    unobserve() and solver.destroy() run against the captured DOM node snapshot,
 *    strictly eliminating stale node memory leaks and null pointer exceptions.
 *
 * Strictly under 650 LOC.
 */

import React, { useRef } from 'react';

/**
 * Type guard checking if an argument is a React.RefObject
 */
export function isRefObject<T>(val: unknown): val is React.RefObject<T> {
  return val !== null && typeof val === 'object' && 'current' in val;
}

export interface DualRefResult<T extends Element = HTMLElement, O = Record<string, unknown>> {
  ref: React.RefObject<T | null>;
  options: O;
  isHeadless: boolean;
}

/**
 * Dispatches between headless invocation (`useHook(options)`) and ref-forwarding (`useHook(ref, options)`).
 */
export function useDualRef<T extends Element = HTMLElement, O extends object = Record<string, unknown>>(
  refOrOptions?: React.RefObject<T | null> | O,
  maybeOptions?: O,
  defaultOptions: O = {} as O
): DualRefResult<T, O> {
  const internalRef = useRef<T | null>(null);

  if (isRefObject<T | null>(refOrOptions)) {
    return {
      ref: refOrOptions,
      options: { ...defaultOptions, ...maybeOptions },
      isHeadless: false,
    };
  }

  return {
    ref: internalRef,
    options: { ...defaultOptions, ...(refOrOptions as O) },
    isHeadless: true,
  };
}

/**
 * Captures the current DOM element reference at effect execution time.
 * Prevents stale node memory leaks during conditional unmounts or ref swaps.
 */
export function captureNode<T extends Element = HTMLElement>(ref: React.RefObject<T | null>): T | null {
  return ref?.current ?? null;
}
