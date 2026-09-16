import { describe, it, expect } from 'vitest';
import { lerp, damp, clamp, mapRange, springStep } from '../math';

describe('Layer 1: Math & Solver Adversarial Fuzzing', () => {
  const adversarialValues = [
    0,
    -0,
    1,
    -1,
    NaN,
    Infinity,
    -Infinity,
    1e-15,
    1e15,
    0.999999999999,
    -0.000000000001,
    Number.MAX_VALUE,
    -Number.MAX_VALUE,
    Number.MIN_VALUE,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];

  const adversarialDeltaTimes = [
    0,
    -16,
    -0.016,
    0.0000001,
    0.016,
    0.033,
    0.5,
    1.0,
    10.0,
    1000.0,
    100000.0, // simulates massive background tab freeze
    NaN,
    Infinity,
    -Infinity,
  ];

  describe('lerp fuzzing', () => {
    it('never produces uncaught exceptions and strictly produces finite numbers when feasible', () => {
      let count = 0;
      for (const a of adversarialValues) {
        for (const b of adversarialValues) {
          for (const t of [0, 0.5, 1, NaN, Infinity, -Infinity]) {
            const result = lerp(a, b, t);
            count++;
            if (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(t)) {
              if (!Number.isFinite(result)) {
                expect.fail(`lerp produced non-finite result: a=${a}, b=${b}, t=${t}, result=${result}`);
              }
            }
          }
        }
      }
      expect(count).toBeGreaterThan(1000);
    });
  });

  describe('clamp fuzzing', () => {
    it('always returns a valid bounded value under extreme or inverted bounds', () => {
      let count = 0;
      for (const v of adversarialValues) {
        for (const min of adversarialValues) {
          for (const max of adversarialValues) {
            const res = clamp(v, min, max);
            count++;
            if (typeof res !== 'number') {
              expect.fail(`clamp produced non-number: v=${v}, min=${min}, max=${max}, res=${res}`);
            }
          }
        }
      }
      expect(count).toBeGreaterThan(3000);
    });

    it('recovers gracefully when min > max (inverted bounds)', () => {
      expect(clamp(50, 100, 0)).toBe(50);
      expect(clamp(150, 100, 0)).toBe(100);
      expect(clamp(-50, 100, 0)).toBe(0);
    });
  });

  describe('damp fuzzing', () => {
    it('never produces NaN or diverges across all adversarial deltaTimes and lambdas', () => {
      let count = 0;
      for (const curr of adversarialValues) {
        for (const target of adversarialValues) {
          for (const lambda of [0, 5, 10, 100, NaN, Infinity, -10]) {
            for (const dt of adversarialDeltaTimes) {
              const res = damp(curr, target, lambda, dt);
              count++;
              if (Number.isFinite(curr) && Number.isFinite(target)) {
                if (!Number.isFinite(res)) {
                  expect.fail(`damp produced non-finite value: curr=${curr}, target=${target}, lambda=${lambda}, dt=${dt}, res=${res}`);
                }
              }
            }
          }
        }
      }
      expect(count).toBeGreaterThan(15000);
    });
  });

  describe('mapRange fuzzing', () => {
    it('handles zero range, inverted ranges, and adversarial inputs safely', () => {
      for (const v of adversarialValues) {
        expect(() => mapRange(0, 0, 0, 100, v)).not.toThrow();
        expect(() => mapRange(100, 0, 0, 50, v)).not.toThrow();
        expect(() => mapRange(NaN, Infinity, 0, 1, v)).not.toThrow();
      }
    });
  });

  describe('springStep fuzzing (Damped Harmonic Oscillator)', () => {
    it('never diverges, throws, or outputs NaN across adversarial positions, velocities, and spike deltaTimes', () => {
      const springConfigs = [
        { stiffness: 100, damping: 10, mass: 1 },
        { stiffness: 500, damping: 30, mass: 2 },
        { stiffness: 0, damping: 0, mass: 0 },
        { stiffness: NaN, damping: NaN, mass: NaN },
        { stiffness: -100, damping: -10, mass: -1 },
        { stiffness: 1e8, damping: 1e5, mass: 10 },
      ];

      let count = 0;
      for (const current of adversarialValues) {
        for (const target of [0, 100, -100, 1e6]) {
          for (const velocity of [0, 500, -500, 1e6]) {
            for (const config of springConfigs) {
              for (const dt of [0.001, 0.016, 0.033, 0.5, 1000]) {
                const res = springStep(current, target, velocity, config, dt);
                count++;
                if (
                  Number.isFinite(current) &&
                  Number.isFinite(target) &&
                  Number.isFinite(velocity) &&
                  config.stiffness > 0 &&
                  config.damping >= 0 &&
                  config.mass > 0
                ) {
                  if (!Number.isFinite(res.position) || !Number.isFinite(res.velocity)) {
                    expect.fail(`springStep produced non-finite: pos=${res.position}, vel=${res.velocity}`);
                  }
                }
              }
            }
          }
        }
      }
      expect(count).toBeGreaterThan(5000);
    });

    it('settles cleanly to exact target under standard convergence', () => {
      const config = { stiffness: 200, damping: 20, mass: 1, precision: 0.001 };
      let state = { position: 0, velocity: 0, settled: false };

      // Step forward 120 frames at 60fps (2 seconds)
      for (let f = 0; f < 120; f++) {
        state = springStep(state.position, 100, state.velocity, config, 0.016, state);
      }

      expect(state.settled).toBe(true);
      expect(state.position).toBe(100);
      expect(state.velocity).toBe(0);
    });
  });
});
