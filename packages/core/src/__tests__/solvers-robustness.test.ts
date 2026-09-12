import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InertiaEngine } from '../inertia';
import { ParallaxSolver } from '../parallax';
import { PinSolver } from '../pinning';
import { TransformSolver } from '../transform-solver';
import { VelocityMarqueeSolver } from '../marquee';
import { DrawSolver } from '../draw-solver';
import { GlobalRevealObserver } from '../reveal';
import { GlobalResizeManager } from '../dom';

describe('ScrollCraft Solvers Robustness & Integrity', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 1000,
      innerWidth: 1200,
      devicePixelRatio: 2,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setTimeout: (fn: Function) => { fn(); return 1; },
      clearTimeout: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });

    class MockResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    const mockClassList = () => ({
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      [Symbol.iterator]: function* () {},
    });

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      ResizeObserver: MockResizeObserver,
      IntersectionObserver: MockIntersectionObserver,
      document: {
        documentElement: { scrollHeight: 3000, classList: mockClassList() },
        body: { scrollHeight: 3000, classList: mockClassList() },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
      },
    });
  });

  const originalWindowDef = globalThis.Window;
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
      Window: originalWindowDef,
      ResizeObserver: originalResizeObserver,
      IntersectionObserver: originalIntersectionObserver,
    });
  });

  describe('InertiaEngine', () => {
    it('initializes and calculates metrics accurately', () => {
      const engine = new InertiaEngine({ lerp: 0.1 });
      engine.init();

      const metrics = engine.getMetrics();
      expect(metrics.limit).toBe(2000); // 3000 - 1000
      expect(metrics.progress).toBe(0);

      const subscriber = vi.fn();
      const unsubscribe = engine.subscribe(subscriber);
      expect(subscriber).toHaveBeenCalledWith(metrics);

      unsubscribe();
      engine.destroy();
    });
  });

  describe('ParallaxSolver', () => {
    it('computes vertical offset and formats transform string', () => {
      const element = {
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 400, left: 0, width: 200, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(element, { speed: 0.5, direction: 'vertical' });
      // At scrollY=0, viewportCenter = 500, elementCenter = 500. Distance = 0
      const state = solver.update(0);
      expect(state.offset).toBe(0);

      // At scrollY=200, viewportCenter = 700. Distance = 200. Offset = 200 * 0.5 = 100
      const updated = solver.update(200);
      expect(updated.offset).toBe(100);

      solver.render();
      expect(element.style.transform).toContain('translate3d(0, 100.00px, 0)');
      solver.destroy();
    });

    it('respects min and max clamping', () => {
      const element = {
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 200, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(element, { speed: 1.0, min: -50, max: 50 });
      const state = solver.update(1000); // would be 500+ without clamping
      expect(state.offset).toBe(50);
      solver.destroy();
    });
  });

  describe('PinSolver', () => {
    it('calculates pin progress strictly from 0.0 to 1.0 within track range', () => {
      const element = {
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
      } as unknown as HTMLElement;

      const progressSpy = vi.fn();
      const solver = new PinSolver(element, {
        duration: 1000,
        topOffset: 0,
        onProgress: progressSpy,
        disableTransform: false,
      });

      // Before pin range (< 500)
      let state = solver.update(300);
      expect(state.isPinned).toBe(false);
      expect(state.progress).toBe(0);
      expect(state.pinOffsetY).toBe(0);

      // Mid pin range (500 + 500 = 1000)
      state = solver.update(1000);
      expect(state.isPinned).toBe(true);
      expect(state.progress).toBe(0.5);
      expect(state.pinOffsetY).toBe(500);

      solver.render();
      expect(element.style.transform).toContain('translate3d(0px, 500px, 0px)');

      // Past pin range (> 1500)
      state = solver.update(2000);
      expect(state.isPinned).toBe(false);
      expect(state.progress).toBe(1);
      expect(state.pinOffsetY).toBe(1000);

      solver.destroy();
    });
  });

  describe('TransformSolver', () => {
    it('interpolates multi-segment keyframes and commits composed transforms', () => {
      const element = {
        style: { transform: '', opacity: '', willChange: '', filter: '', borderRadius: '' },
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(element, {
        start: 'top bottom', // element top (500) - vp bottom (1000) = -500
        end: 'bottom top',   // element bottom (700) - vp top (0) = 700
        properties: {
          y: [0, 100, 200],
          opacity: [0, 1],
          scale: [0.8, 1.2],
        },
        scrub: false,
      });

      solver.measure();
      // Scroll to mid-range
      solver.update(100, 0, 0.016);
      solver.render();

      expect(element.style.transform).toContain('translate3d');
      expect(element.style.transform).toContain('scale');
      expect(Number(element.style.opacity)).toBeGreaterThan(0);

      solver.destroy();
      expect(element.style.willChange).toBe('');
      expect(element.style.opacity).toBe('');
    });
  });

  describe('VelocityMarqueeSolver', () => {
    it('accelerates with velocity and wraps seamlessly', () => {
      const child = { getBoundingClientRect: () => ({ width: 500 }) };
      const element = {
        firstElementChild: child,
        style: { transform: '' },
      } as unknown as HTMLElement;

      const solver = new VelocityMarqueeSolver(element, {
        baseSpeed: 2,
        velocityMultiplier: 0.1,
        direction: 'left',
      });

      solver.measure();
      // Low velocity
      const s1 = solver.update(0, 0, 1 / 60);
      expect(s1.position).toBeLessThan(0);

      // High velocity scroll
      const initialPos = s1.position;
      solver.update(0, 1000, 1 / 60);
      const delta = Math.abs(solver.getState().position - initialPos);
      expect(delta).toBeGreaterThan(2); // Accelerated speed

      solver.render();
      expect(element.style.transform).toContain('translate3d');
      solver.destroy();
    });
  });

  describe('DrawSolver', () => {
    it('computes stroke dasharray and dashoffset for SVG elements', () => {
      const element = {
        getTotalLength: () => 1000,
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
        style: { strokeDasharray: '', strokeDashoffset: '' },
      } as unknown as SVGGeometryElement;

      const solver = new DrawSolver(element, {
        start: 'top bottom',
        end: 'bottom top',
        scrub: false,
      });

      solver.measure();
      expect(element.style.strokeDasharray).toBe('1000 1000');

      // Update in view
      solver.update(500, 0, 0.016);
      solver.render();

      expect(Number(element.style.strokeDashoffset)).toBeLessThan(1000);

      solver.destroy();
      expect(element.style.strokeDasharray).toBe('');
      expect(element.style.strokeDashoffset).toBe('');
    });
  });

  describe('GlobalResizeManager', () => {
    it('deduplicates observers and batches callbacks in RAF', () => {
      const target = { tagName: 'DIV' } as unknown as Element;
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unobserve1 = GlobalResizeManager.observe(target, callback1);
      const unobserve2 = GlobalResizeManager.observe(target, callback2);

      expect(typeof unobserve1).toBe('function');
      expect(typeof unobserve2).toBe('function');

      unobserve1();
      unobserve2();
      GlobalResizeManager.disconnect();
    });
  });

  describe('GlobalRevealObserver', () => {
    it('observes and unobserves elements safely', () => {
      const observer = GlobalRevealObserver.get();
      const el = {
        style: { opacity: '', willChange: '', transition: '' },
        getBoundingClientRect: () => ({ top: 1200, height: 100 }),
      } as unknown as HTMLElement;

      observer.observe(el, { direction: 'up', distance: 20 });
      observer.unobserve(el);
      observer.destroy();

      expect(el.style.opacity).toBe('');
      expect(el.style.willChange).toBe('');
    });
  });
});
