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

  // ══════════════════════════════════════════════════════════════════
  // GOLDEN BASELINE REGRESSION SAFETY: Legitimate values remain unchanged
  // ══════════════════════════════════════════════════════════════════
  it('preserves exact analytical known-good outputs for legitimate production values', () => {
    // 1. lerp golden baseline: 10 + (50 - 10) * 0.25 = 20
    expect(lerp(10, 50, 0.25)).toBe(20);
    expect(lerp(-100, 100, 0.75)).toBe(50);

    // 2. clamp golden baseline
    expect(clamp(45, 10, 40)).toBe(40);
    expect(clamp(5, 10, 40)).toBe(10);
    expect(clamp(25, 10, 40)).toBe(25);

    // 3. damp golden baseline: 100 + (0 - 100) * exp(-10 * 0.016) = 14.7856211...
    const dampResult = damp(0, 100, 10, 0.016);
    expect(dampResult).toBeCloseTo(14.78562, 4);

    // 4. mapRange golden baseline: maps [0, 100] -> [200, 400] at 50 to 300
    expect(mapRange(0, 100, 200, 400, 50)).toBe(300);
    expect(mapRange(-50, 50, 0, 1, 0)).toBe(0.5);

    // 5. springStep golden baseline:
    // With current=0, target=100, velocity=0, stiffness=100, damping=10, mass=1, dt=0.016:
    // delta = -100 -> springForce = 10000 -> acc = 10000
    // nextVel = 10000 * 0.016 = 160
    // nextPos = 160 * 0.016 = 2.56
    const config = { stiffness: 100, damping: 10, mass: 1, precision: 0.001 };
    const step1 = springStep(0, 100, 0, config, 0.016);
    expect(step1.velocity).toBe(160);
    expect(step1.position).toBe(2.56);
    expect(step1.settled).toBe(false);

    // Step 2 from (pos: 2.56, vel: 160):
    // delta = 2.56 - 100 = -97.44 -> springForce = 9744
    // dampingForce = -10 * 160 = -1600 -> acc = (9744 - 1600) / 1 = 8144
    // nextVel = 160 + 8144 * 0.016 = 290.304
    // nextPos = 2.56 + 290.304 * 0.016 = 7.204864
    const step2 = springStep(step1.position, 100, step1.velocity, config, 0.016);
    expect(step2.velocity).toBeCloseTo(290.304, 3);
    expect(step2.position).toBeCloseTo(7.204864, 5);
    expect(step2.settled).toBe(false);
  });
});
