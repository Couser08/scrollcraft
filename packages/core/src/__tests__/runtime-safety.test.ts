import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFallbackReader } from '../fallback-reader';
import { ParallaxSolver } from '../parallax';
import { TextRevealSolver } from '../text-reveal';
import { ticker } from '../ticker';

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalRaf = globalThis.requestAnimationFrame;
const originalCancelRaf = globalThis.cancelAnimationFrame;

afterEach(() => {
  ticker.setErrorHandler(null);
  ticker.remove('runtime-safety-fault');
  ticker.remove('runtime-safety-survivor');
  Object.assign(globalThis, {
    window: originalWindow,
    document: originalDocument,
    requestAnimationFrame: originalRaf,
    cancelAnimationFrame: originalCancelRaf,
  });
});

describe('runtime safety', () => {
  it('keeps subsequent ticker tasks alive when one task throws', () => {
    const frames: FrameRequestCallback[] = [];
    Object.assign(globalThis, {
      window: { addEventListener: vi.fn(), scrollX: 0, scrollY: 0 },
      document: { addEventListener: vi.fn(), hidden: false },
      requestAnimationFrame: (callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelAnimationFrame: vi.fn(),
    });

    const report = vi.fn();
    const survivor = vi.fn();
    ticker.setErrorHandler(report);
    ticker.add('runtime-safety-fault', 'update', () => {
      throw new Error('intentional test failure');
    });
    ticker.add('runtime-safety-survivor', 'update', survivor);

    frames.shift()?.(16);

    expect(survivor).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith(expect.objectContaining({
      id: 'runtime-safety-fault',
      phase: 'update',
    }));
  });

  it('returns a safe no-op fallback reader during SSR', () => {
    Object.assign(globalThis, { window: undefined, document: undefined });
    const reader = createFallbackReader({} as Element);

    expect(reader.read()).toBe(0);
    expect(() => reader.destroy()).not.toThrow();
  });

  it('calculates horizontal parallax from horizontal geometry', () => {
    Object.assign(globalThis, {
      window: {
        scrollX: 100,
        pageXOffset: 100,
        innerWidth: 1000,
        scrollY: 0,
        pageYOffset: 0,
        innerHeight: 800,
      },
    });
    const element = {
      style: { transform: '' },
      getBoundingClientRect: () => ({ left: 300, top: 0, width: 200, height: 100 }),
    } as unknown as HTMLElement;
    const solver = new ParallaxSolver(element, { direction: 'horizontal', speed: 1 });

    expect(solver.update(100)).toMatchObject({ offset: 100 });
    solver.render();
    expect(element.style.transform).toContain('translate3d(100.00px, 0, 0)');
    solver.destroy();
  });

  it('keeps text reveal layout reads in measure while update uses scroll position', () => {
    Object.assign(globalThis, {
      window: { scrollY: 100, pageYOffset: 100, innerHeight: 1000 },
    });
    const character = { style: { opacity: '' } } as unknown as HTMLElement;
    const container = {
      getBoundingClientRect: () => ({ top: 700 }),
    } as unknown as HTMLElement;
    const solver = new TextRevealSolver(container, [character]);

    solver.measure();
    solver.update(100, 1000);
    solver.render();
    const beforeScroll = Number(character.style.opacity);

    solver.update(700, 1000);
    solver.render();
    expect(Number(character.style.opacity)).toBeGreaterThan(beforeScroll);
  });
});
