import { describe, it, expect } from 'vitest';
import { clamp, lerp, damp, mapRange, springStep } from '../math';

describe('Math Utilities', () => {
  it('clamps values within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('interpolates linearly with lerp', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('calculates frame-rate independent damp', () => {
    const value = damp(0, 100, 10, 0.016);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);
  });

  it('maps numbers across input and output ranges', () => {
    expect(mapRange(0, 100, 0, 1, 50)).toBe(0.5);
    expect(mapRange(0, 100, 0, 500, 0)).toBe(0);
    expect(mapRange(0, 100, 0, 500, 100)).toBe(500);
  });

  it('computes spring step without out parameter', () => {
    const config = { stiffness: 100, damping: 10, mass: 1 };
    const step1 = springStep(0, 100, 0, config, 0.016);
    expect(step1.position).toBeGreaterThan(0);
    expect(step1.velocity).toBeGreaterThan(0);
    expect(step1.settled).toBe(false);
  });

  it('mutates existing SpringState out parameter without allocation', () => {
    const config = { stiffness: 100, damping: 10, mass: 1 };
    const state = { position: 0, velocity: 0, settled: false };
    const result = springStep(0, 100, 0, config, 0.016, state);
    expect(result).toBe(state); // Reference equality check for zero-allocation
    expect(state.position).toBeGreaterThan(0);
    expect(state.velocity).toBeGreaterThan(0);
  });

  it('clamps large dt spikes (e.g. tab restore) to prevent spring explosion', () => {
    const config = { stiffness: 300, damping: 10, mass: 1 };
    // Pass a huge 5-second timestep spike (from backgrounded tab)
    const result = springStep(0, 100, 0, config, 5.0);
    // Position must be bounded and not NaN or Infinity
    expect(Number.isFinite(result.position)).toBe(true);
    expect(Number.isFinite(result.velocity)).toBe(true);
    expect(result.position).toBeLessThan(150); // Did not violently explode
  });
});
