import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransformSolver } from '../transform-solver';
import { DrawSolver } from '../draw-solver';
import { ticker } from '../ticker';

describe('Idle Dormancy & Settled State Verification', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 1000,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    (globalThis as any).document = {
      documentElement: { scrollHeight: 3000 },
      body: { scrollHeight: 3000 },
      createElement: () => ({ style: {}, setAttribute: vi.fn() }),
      head: { appendChild: vi.fn() },
      getElementById: vi.fn().mockReturnValue(null),
    };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  });

  it('TransformSolver reports isSettled correctly during and after scrub damping', () => {
    const el = {
      style: { transform: '' },
      getBoundingClientRect: () => ({ top: 500, height: 200 }),
    } as any;

    const solver = new TransformSolver(el, {
      start: 'top bottom',
      end: 'bottom top',
      scrub: 8,
      properties: { y: [0, 100] },
    });

    solver.measure();
    expect(solver.isSettled()).toBe(true);

    solver.update(300, 50, 0.016, false);
    expect(solver.isSettled()).toBe(false);

    // Simulate several damping frames until settled
    for (let i = 0; i < 60; i++) {
      solver.update(300, 0, 0.016, false);
    }

    expect(solver.isSettled()).toBe(true);
    solver.destroy();
  });

  it('DrawSolver reports isSettled correctly during scrub and trigger modes', () => {
    const svgPath = {
      style: { strokeDasharray: '', strokeDashoffset: '' },
      getTotalLength: () => 500,
      getBoundingClientRect: () => ({ top: 200, height: 100 }),
    } as any;

    const solver = new DrawSolver(svgPath, {
      start: 'top bottom',
      end: 'bottom top',
      scrub: 8,
    });

    solver.measure();
    expect(solver.isSettled()).toBe(true);

    // Scroll updates target
    solver.update(250, 20, 0.016, false);
    expect(solver.isSettled()).toBe(false);

    // Settle after frames
    for (let i = 0; i < 60; i++) {
      solver.update(250, 0, 0.016, false);
    }

    expect(solver.isSettled()).toBe(true);
    solver.destroy();
  });
});
