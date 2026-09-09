'use client';

/**
 * useScrollTimeline Hook for Multi-Keyframe Choreography
 * Strictly under 650 LOC.
 */

import { useMemo } from 'react';
import { PropertyTimeline, TimelineSolver } from '@scrollcraft/core';

export function useScrollTimeline(
  progress: number,
  timeline: PropertyTimeline
): Record<string, number> {
  return useMemo(() => {
    return TimelineSolver.evaluateTimeline(timeline, progress);
  }, [progress, timeline]);
}
