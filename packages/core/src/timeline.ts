/**
 * Timeline Choreography Solver for ScrollCraft
 * Interpolates multi-element, multi-property keyframes across scroll progress.
 * Strictly under 650 LOC.
 */

import { mapRange, clamp } from './math';

export interface KeyframeSegment {
  from: number; // 0.0 to 1.0
  to: number;   // 0.0 to 1.0
  startValue: number;
  endValue: number;
}

export type PropertyTimeline = Record<string, KeyframeSegment[]>;

export class TimelineSolver {
  /**
   * Evaluates a single keyframe track at given progress t (0.0 to 1.0)
   */
  public static evaluateSegment(segments: KeyframeSegment[], progress: number): number {
    if (segments.length === 0) return 0;

    const clampedProgress = clamp(progress, 0, 1);

    // If before first segment
    if (clampedProgress <= segments[0].from) {
      return segments[0].startValue;
    }

    // If after last segment
    const last = segments[segments.length - 1];
    if (clampedProgress >= last.to) {
      return last.endValue;
    }

    // Find active segment
    for (const seg of segments) {
      if (clampedProgress >= seg.from && clampedProgress <= seg.to) {
        return mapRange(seg.from, seg.to, seg.startValue, seg.endValue, clampedProgress);
      }
    }

    return segments[0].startValue;
  }

  /**
   * Evaluates multiple animated properties simultaneously
   */
  public static evaluateTimeline(
    timeline: PropertyTimeline,
    progress: number
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [prop, segments] of Object.entries(timeline)) {
      result[prop] = this.evaluateSegment(segments, progress);
    }
    return result;
  }
}
