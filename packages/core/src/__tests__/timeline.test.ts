import { describe, it, expect } from 'vitest';
import { TimelineSolver, PropertyTimeline } from '../timeline';

describe('TimelineSolver', () => {
  const timeline: PropertyTimeline = {
    opacity: [
      { from: 0, to: 0.5, startValue: 0, endValue: 1 },
      { from: 0.5, to: 1, startValue: 1, endValue: 0 },
    ],
    scale: [
      { from: 0, to: 1, startValue: 1, endValue: 2 },
    ],
  };

  it('evaluates timeline segments correctly', () => {
    const at0 = TimelineSolver.evaluateTimeline(timeline, 0);
    expect(at0.opacity).toBe(0);
    expect(at0.scale).toBe(1);

    const atHalf = TimelineSolver.evaluateTimeline(timeline, 0.5);
    expect(atHalf.opacity).toBe(1);
    expect(atHalf.scale).toBe(1.5);

    const at1 = TimelineSolver.evaluateTimeline(timeline, 1);
    expect(at1.opacity).toBe(0);
    expect(at1.scale).toBe(2);
  });

  it('mutates existing out object without allocations', () => {
    const reusableOut: Record<string, number> = {};
    const result = TimelineSolver.evaluateTimeline(timeline, 0.5, reusableOut);

    expect(result).toBe(reusableOut);
    expect(reusableOut.opacity).toBe(1);
    expect(reusableOut.scale).toBe(1.5);
  });
});
