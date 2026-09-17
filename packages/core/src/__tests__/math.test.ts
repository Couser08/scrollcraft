import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  damp,
  mapRange,
  springStep,
  parseColorRgba,
  lerpColorRgba,
  rgbaString,
  colorDeltaExceeds,
  ColorRgba,
} from '../math';

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

  describe('Zero-GC Pre-Parsed Color Interpolation', () => {
    it('parses hex colors into normalized numeric RGBA tuples', () => {
      // 3-digit hex (#rgb)
      expect(parseColorRgba('#f00')).toEqual([255, 0, 0, 1]);
      // 4-digit hex (#rgba)
      const c4 = parseColorRgba('#f008');
      expect(c4[0]).toBe(255);
      expect(c4[1]).toBe(0);
      expect(c4[2]).toBe(0);
      expect(c4[3]).toBeCloseTo(0.5333, 3);
      // 6-digit hex (#rrggbb)
      expect(parseColorRgba('#00ff00')).toEqual([0, 255, 0, 1]);
      // 8-digit hex (#rrggbbaa)
      const c8 = parseColorRgba('#0000ff80');
      expect(c8[0]).toBe(0);
      expect(c8[1]).toBe(0);
      expect(c8[2]).toBe(255);
      expect(c8[3]).toBeCloseTo(128 / 255, 4);
    });

    it('parses rgb and rgba string variations', () => {
      expect(parseColorRgba('rgb(255, 128, 0)')).toEqual([255, 128, 0, 1]);
      expect(parseColorRgba('rgba(255, 128, 0, 0.5)')).toEqual([255, 128, 0, 0.5]);
      expect(parseColorRgba('rgb(100 200 50 / 0.75)')).toEqual([100, 200, 50, 0.75]);
    });

    it('handles special values (transparent, named colors, invalid input)', () => {
      expect(parseColorRgba('transparent')).toEqual([0, 0, 0, 0]);
      expect(parseColorRgba('white')).toEqual([255, 255, 255, 1]);
      expect(parseColorRgba('black')).toEqual([0, 0, 0, 1]);
      expect(parseColorRgba('red')).toEqual([255, 0, 0, 1]);
      expect(parseColorRgba('')).toEqual([0, 0, 0, 1]);
      expect(parseColorRgba(null as any)).toEqual([0, 0, 0, 1]);
      expect(parseColorRgba('not-a-color')).toEqual([0, 0, 0, 1]);
    });

    it('interpolates colors via pure arithmetic with zero allocations when passing out', () => {
      const red: ColorRgba = [255, 0, 0, 1];
      const blue: ColorRgba = [0, 0, 255, 0];
      const out: ColorRgba = [0, 0, 0, 0];

      const result = lerpColorRgba(red, blue, 0.5, out);
      expect(result).toBe(out); // Zero-allocation reference equality
      expect(out[0]).toBe(127.5);
      expect(out[1]).toBe(0);
      expect(out[2]).toBe(127.5);
      expect(out[3]).toBe(0.5);

      // Allocates new tuple if out is omitted
      const result2 = lerpColorRgba(red, blue, 0);
      expect(result2).toEqual([255, 0, 0, 1]);

      const result3 = lerpColorRgba(red, blue, 1);
      expect(result3).toEqual([0, 0, 255, 0]);
    });

    it('serializes RGBA tuple to valid CSS rgba string', () => {
      expect(rgbaString([255, 128, 0, 1])).toBe('rgba(255, 128, 0, 1)');
      expect(rgbaString([0, 255, 0, 0.5])).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('detects when color delta exceeds micro-epsilon threshold', () => {
      const c1: ColorRgba = [100, 100, 100, 0.5];
      const identical: ColorRgba = [100, 100, 100, 0.5];
      const imperceptible: ColorRgba = [100.2, 100.1, 100.2, 0.501];
      const perceptibleAlpha: ColorRgba = [100, 100, 100, 0.52];
      const perceptibleRgb: ColorRgba = [102, 100, 100, 0.5];

      expect(colorDeltaExceeds(c1, identical)).toBe(false);
      expect(colorDeltaExceeds(c1, imperceptible)).toBe(false);
      expect(colorDeltaExceeds(c1, perceptibleAlpha)).toBe(true);
      expect(colorDeltaExceeds(c1, perceptibleRgb)).toBe(true);
    });
  });
});
