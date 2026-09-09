'use client';

/**
 * useScrollTransform hook for mapping progress to ranges
 * Strictly under 650 LOC.
 */

import { useMemo } from 'react';
import { mapRange } from '@scrollcraft/core';

export function useScrollTransform(
  progress: number,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  return useMemo(() => {
    return mapRange(inputRange[0], inputRange[1], outputRange[0], outputRange[1], progress);
  }, [progress, inputRange[0], inputRange[1], outputRange[0], outputRange[1]]);
}
