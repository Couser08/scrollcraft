/**
 * Level 7 Hardening Test Suite:
 * - 120Hz-Aware Exponential Smoothing (Framerate Invariance)
 * - Velocity-Aware Kinetic Snap Release & Projection
 * - Optional Spring-Mode Physics & Settling Detection
 * - Sub-Pixel Physical Grid Snapping (DPR 1x, 2x Retina, 3x Phone)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  lerp,
  lerpToLambda,
  lambdaToLerpFactor,
  exponentialLerp,
  calculateVelocitySnapTarget,
  snapToDevicePixel,
  formatDevicePixel,
  springStep,
  InertiaEngine,
  PinSolver,
  TransformComposer,
  ticker,
} from '../index';

describe('Level 7: Engine Smoothness & Framerate Invariance Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    class MockWindow {}
    const mockWin: any = {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 2,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
      scrollTo: vi.fn(),
    };

    const mockDoc: any = {
      documentElement: {
        scrollHeight: 3000,
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
      },
      body: {
        scrollHeight: 3000,
      },
      createElement: vi.fn(() => ({
        style: {},
        getBoundingClientRect: () => ({ top: 100, bottom: 500, left: 0, right: 200 }),
      })),
    };

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      document: mockDoc,
    });

    ticker.stop();
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
    ticker.stop();
    vi.restoreAllMocks();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1: 120HZ-AWARE EXPONENTIAL SMOOTHING (FRAMERATE INVARIANCE)
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 1: 120Hz-Aware Exponential Smoothing', () => {
    it('round-trips lerp60 to lambda and back with high precision', () => {
      const lerpFactor = 0.1;
      const lambda = lerpToLambda(lerpFactor);
      const recovered = lambdaToLerpFactor(lambda);
      expect(Math.abs(recovered - lerpFactor)).toBeLessThan(1e-6);
    });

    it('guarantees identical 1-second physics decay across 60Hz, 120Hz, and 240Hz monitors', () => {
      const target = 1000;
      const lerp60 = 0.1;

      // 60Hz: 60 iterations with dt = 1/60s (16.666ms)
      let pos60 = 0;
      const dt60 = 1 / 60;
      for (let i = 0; i < 60; i++) {
        pos60 = exponentialLerp(pos60, target, lerp60, dt60);
      }

      // 120Hz: 120 iterations with dt = 1/120s (8.333ms)
      let pos120 = 0;
      const dt120 = 1 / 120;
      for (let i = 0; i < 120; i++) {
        pos120 = exponentialLerp(pos120, target, lerp60, dt120);
      }

      // 240Hz: 240 iterations with dt = 1/240s (4.166ms)
      let pos240 = 0;
      const dt240 = 1 / 240;
      for (let i = 0; i < 240; i++) {
        pos240 = exponentialLerp(pos240, target, lerp60, dt240);
      }

      // Assert decay values match within 0.001% numerical tolerance
      expect(Math.abs(pos60 - pos120)).toBeLessThan(0.01);
      expect(Math.abs(pos60 - pos240)).toBeLessThan(0.01);

      // Contrast with naive lerp which drastically diverges across refresh rates
      let naive60 = 0;
      for (let i = 0; i < 60; i++) naive60 = lerp(naive60, target, lerp60);
      let naive120 = 0;
      for (let i = 0; i < 120; i++) naive120 = lerp(naive120, target, lerp60);

      // Naive lerp at 120Hz has 99.999% converged vs 99.82% at 60Hz (over 1.7px difference on 1000px)
      expect(Math.abs(naive60 - naive120)).toBeGreaterThan(1.5);
    });

    it('safely handles non-finite inputs and tab-switch lag spikes (large dt)', () => {
      expect(exponentialLerp(NaN, 100, 0.1, 0.016)).toBe(100);
      expect(exponentialLerp(50, Infinity, 0.1, 0.016)).toBe(50);
      // Large dt (e.g. 5 seconds lag spike) is clamped so it smoothly snaps to target without NaN or overshoot
      const lagged = exponentialLerp(0, 100, 0.1, 5.0);
      expect(lagged).toBeGreaterThan(0);
      expect(lagged).toBeLessThanOrEqual(100);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2: VELOCITY-AWARE SNAP RELEASE & KINETIC PROJECTION
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 2: Velocity-Aware Snap Release & Kinetic Projection', () => {
    const snapPoints = [0, 500, 1000, 1500, 2000];

    it('releases snap lock completely during fast flings (> releaseThreshold)', () => {
      // Velocity is 400 px/s (well above default 150 px/s threshold)
      const target = calculateVelocitySnapTarget(550, 400, snapPoints, { releaseThreshold: 150 });
      expect(target).toBeNull();
    });

    it('directionally projects stopping position during settling forward crawl', () => {
      // Current is at 450, moving forward with velocity 100 px/s
      // Projected position = 450 + 100 * 0.2s = 470 -> snaps to 500
      const target = calculateVelocitySnapTarget(450, 100, snapPoints, {
        releaseThreshold: 150,
        inertiaHorizon: 0.2,
      });
      expect(target).toBe(500);
    });

    it('directionally projects stopping position during settling backward crawl', () => {
      // Current is at 550, moving backward with velocity -100 px/s
      // Projected position = 550 - 100 * 0.2s = 530 -> snaps back to 500
      const target = calculateVelocitySnapTarget(550, -100, snapPoints, {
        releaseThreshold: 150,
        inertiaHorizon: 0.2,
      });
      expect(target).toBe(500);
    });

    it('snaps to closest anchor when stationary (velocity = 0)', () => {
      expect(calculateVelocitySnapTarget(480, 0, snapPoints)).toBe(500);
      expect(calculateVelocitySnapTarget(200, 0, snapPoints)).toBe(0);
      expect(calculateVelocitySnapTarget(1400, 0, snapPoints)).toBe(1500);
    });

    it('respects minBound and maxBound boundaries', () => {
      const target = calculateVelocitySnapTarget(50, -80, snapPoints, {
        minBound: 0,
        maxBound: 2000,
        inertiaHorizon: 1.0,
      });
      expect(target).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 3: OPTIONAL SPRING-MODE PHYSICS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 3: Optional Spring-Mode Physics', () => {
    it('executes harmonic springStep and converges toward target', () => {
      const config = { stiffness: 150, damping: 15, mass: 1, precision: 0.05 };
      let state = { position: 0, velocity: 0, settled: false };

      for (let i = 0; i < 40; i++) {
        state = springStep(state.position, 500, state.velocity, config, 0.016, state);
      }

      // After 40 steps (~0.64s), critically damped spring reaches target neighborhood
      expect(state.position).toBeGreaterThan(450);
      expect(state.position).toBeLessThanOrEqual(500.1);
    });

    it('flags settled=true and zeroes velocity once precision threshold is reached', () => {
      const config = { stiffness: 200, damping: 20, mass: 1, precision: 0.1 };
      let state = { position: 499.999, velocity: 0.001, settled: false };

      state = springStep(state.position, 500, state.velocity, config, 0.016, state);
      expect(state.settled).toBe(true);
      expect(state.position).toBe(500);
      expect(state.velocity).toBe(0);
    });

    it('InertiaEngine initializes in spring mode without crashing', () => {
      const engine = new InertiaEngine({
        physicsMode: 'spring',
        spring: { stiffness: 100, damping: 12 },
      });
      expect((engine as any).config.physicsMode).toBe('spring');
      expect((engine as any).springConfig).toBeDefined();
      expect((engine as any).springConfig.stiffness).toBe(100);
      engine.destroy();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 4: SUB-PIXEL PHYSICAL GRID ROUNDING (snapToDevicePixel)
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 4: Sub-Pixel Physical Grid Snapping', () => {
    it('snaps to integer grid on 1x DPI displays', () => {
      expect(snapToDevicePixel(12.2, 1)).toBe(12);
      expect(snapToDevicePixel(12.5, 1)).toBe(13);
      expect(snapToDevicePixel(12.8, 1)).toBe(13);
    });

    it('snaps to half-pixel grid on 2x Retina displays', () => {
      expect(snapToDevicePixel(12.2, 2)).toBe(12.0);
      expect(snapToDevicePixel(12.3, 2)).toBe(12.5);
      expect(snapToDevicePixel(12.7, 2)).toBe(12.5);
      expect(snapToDevicePixel(12.8, 2)).toBe(13.0);
    });

    it('snaps to third-pixel grid on 3x Mobile displays', () => {
      const snapped = snapToDevicePixel(10.15, 3);
      // Nearest 1/3 is 10.333333... or 10.0
      expect(snapped).toBeCloseTo(10.0, 1);
    });

    it('formats clean CSS pixel string via formatDevicePixel', () => {
      expect(formatDevicePixel(14.289, 2)).toBe('14.50px');
      expect(formatDevicePixel(20.01, 1)).toBe('20px');
    });

    it('PinSolver applies snapped coordinates to translate3d in render()', () => {
      const el: any = {
        style: {},
        getBoundingClientRect: () => ({ top: 0, bottom: 400 }),
      };
      const solver = new PinSolver(el, { duration: 400 });
      solver.update(124.36);
      solver.render();

      const transform = TransformComposer.get(el);
      // On mock DPR=2: 124.36 snaps to 124.50px
      expect(transform).toBe('translate3d(0px, 124.50px, 0px)');
      solver.destroy();
    });
  });
});
