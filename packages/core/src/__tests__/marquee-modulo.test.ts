import { describe, it, expect, vi } from 'vitest';
import { VelocityMarqueeSolver } from '../marquee';

describe('VelocityMarqueeSolver Modulo Wrap & Safety', () => {
  it('guards safely against zero or negative element width without throwing or NaN', () => {
    const el = {
      firstElementChild: {
        getBoundingClientRect: () => ({ width: 0 }),
      },
    } as any;

    const solver = new VelocityMarqueeSolver(el, { baseSpeed: 2 });
    solver.measure();

    const state = solver.update(0, 50, 0.016);
    expect(state.position).toBe(0);
    expect(Number.isNaN(state.position)).toBe(false);
  });

  it('handles extreme velocity flick (> 5000px/s) smoothly without jumping outside [0, -width]', () => {
    const width = 400;
    const el = {
      firstElementChild: {
        getBoundingClientRect: () => ({ width }),
      },
    } as any;

    const solver = new VelocityMarqueeSolver(el, {
      baseSpeed: 2,
      velocityMultiplier: 0.1,
      maxSpeed: 50,
      direction: 'left',
    });
    solver.measure();

    // High velocity tick simulating violent flick
    for (let frame = 0; frame < 10; frame++) {
      const state = solver.update(0, 8000, 0.05);
      // Position must always be bounded strictly within (-width, 0]
      expect(state.position).toBeLessThanOrEqual(0);
      expect(state.position).toBeGreaterThan(-width);
    }
  });

  it('wraps correctly in rightward direction', () => {
    const width = 300;
    const el = {
      firstElementChild: {
        getBoundingClientRect: () => ({ width }),
      },
    } as any;

    const solver = new VelocityMarqueeSolver(el, {
      baseSpeed: 3,
      direction: 'right',
    });
    solver.measure();

    for (let frame = 0; frame < 20; frame++) {
      const state = solver.update(0, 100, 0.016);
      expect(state.position).toBeLessThan(0);
      expect(state.position).toBeGreaterThanOrEqual(-width);
    }
  });
});
