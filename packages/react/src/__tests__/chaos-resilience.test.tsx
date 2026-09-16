import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ticker,
  ParallaxSolver,
  GlobalResizeManager,
  globalVisibilityManager,
  Capabilities,
} from '@scrollcraft/core';
import { useParallax } from '../hooks/useParallax';

describe('Layer 2: Chaos-Unit Resilience Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 100,
      scrollX: 0,
      pageYOffset: 100,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
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
        documentElement: {
          scrollHeight: 3000,
          classList: mockClassList(),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
        },
        body: { scrollHeight: 3000, classList: mockClassList() },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
          classList: mockClassList(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
        fonts: { ready: Promise.resolve() },
      },
    });
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
    vi.restoreAllMocks();
  });

  describe('Rapid Mount/Unmount Storm (50x)', () => {
    it('survives 50 rapid mount/unmount lifecycles without task leaks even with delayed fonts.ready', async () => {
      let resolveFonts: () => void = () => {};
      const delayedFontPromise = new Promise<void>((resolve) => {
        resolveFonts = resolve;
      });

      // Stub document.fonts with artificially delayed promise
      (document as unknown as { fonts: { ready: Promise<void> } }).fonts = {
        ready: delayedFontPromise,
      };

      const initialTaskCount = (ticker as unknown as { tasks: Map<string, unknown> }).tasks?.size ?? 0;
      const cleanups: (() => void)[] = [];

      // 50 rapid mount and unmount cycles
      for (let i = 0; i < 50; i++) {
        const element = {
          tagName: 'DIV',
          style: { transform: '' } as Record<string, string>,
          classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
          getBoundingClientRect: () => ({ top: 300 + i, left: 0, width: 200, height: 100 }),
        } as unknown as HTMLElement;

        const solver = new ParallaxSolver(element, { speed: 0.25 });
        const taskId = `chaos-storm-${i}`;
        ticker.add(taskId, 'update', () => solver.update(100));
        ticker.add(taskId, 'render', () => solver.render());

        // Immediately queue teardown
        cleanups.push(() => {
          ticker.remove(taskId);
          solver.destroy();
        });
      }

      // Execute all unmounts rapidly
      for (const cleanup of cleanups) {
        cleanup();
      }

      // Now resolve font readiness after components are unmounted
      resolveFonts();
      await delayedFontPromise;

      // Verify all tasks are completely purged
      const finalTaskCount = (ticker as unknown as { tasks: Map<string, unknown> }).tasks?.size ?? 0;
      expect(finalTaskCount).toBe(initialTaskCount);
    });
  });

  describe('StrictMode Double-Invoke Emulation', () => {
    it('cleans up observers and central ticker tasks across StrictMode mount -> unmount -> remount cycles', () => {
      const resizeUnobserveSpy = vi.spyOn(GlobalResizeManager, 'unobserve');
      const element = {
        tagName: 'DIV',
        style: {
          transform: '',
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        } as unknown as CSSStyleDeclaration,
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        getBoundingClientRect: () => ({ top: 200, left: 0, width: 100, height: 100 }),
      } as unknown as HTMLElement;

      // Mount 1
      const solver1 = new ParallaxSolver(element, { speed: 0.5 });
      const taskId1 = 'strictmode-sim-1';
      ticker.add(taskId1, 'update', () => solver1.update(100));
      const unobserve1 = GlobalResizeManager.observe(element, () => solver1.measure());

      // Unmount 1
      ticker.remove(taskId1);
      unobserve1();
      solver1.destroy();

      // Remount 2
      const solver2 = new ParallaxSolver(element, { speed: 0.5 });
      const taskId2 = 'strictmode-sim-2';
      ticker.add(taskId2, 'update', () => solver2.update(100));
      const unobserve2 = GlobalResizeManager.observe(element, () => solver2.measure());

      // Final Unmount
      ticker.remove(taskId2);
      unobserve2();
      solver2.destroy();

      expect(resizeUnobserveSpy).toHaveBeenCalledTimes(2);
      const updateTasks = (ticker as unknown as { updateTasks: Map<string, unknown> }).updateTasks;
      expect(updateTasks.has(taskId1)).toBe(false);
      expect(updateTasks.has(taskId2)).toBe(false);
    });
  });

  describe('Resize Storm Resilience', () => {
    it('safely handles 100 rapid-fire resize callbacks without crashing or unbounded recursion', () => {
      const element = {
        tagName: 'DIV',
        style: {
          transform: '',
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        } as unknown as CSSStyleDeclaration,
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        getBoundingClientRect: () => ({ top: 200, left: 0, width: 100, height: 100 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(element, { speed: 0.3 });
      const unobserve = GlobalResizeManager.observe(element, () => solver.measure());

      expect(() => {
        for (let i = 0; i < 100; i++) {
          solver.measure();
        }
      }).not.toThrow();

      unobserve();
      solver.destroy();
    });
  });

  describe('Driver Mid-Scroll Dynamic Switch', () => {
    it('seamlessly transitions from native to js driver without orphaned transforms or DOM errors', () => {
      const classes = new Set<string>();
      const customProps: Record<string, string> = {};
      const element = {
        tagName: 'DIV',
        style: {
          animationTimeline: '',
          animationRange: '',
          animationName: '',
          animationFillMode: '',
          animationTimingFunction: '',
          transform: '',
          setProperty: vi.fn((k: string, v: string) => { customProps[k] = v; }),
          removeProperty: vi.fn((k: string) => { delete customProps[k]; }),
        } as unknown as CSSStyleDeclaration,
        classList: {
          add: vi.fn((c: string) => classes.add(c)),
          remove: vi.fn((c: string) => classes.delete(c)),
          contains: vi.fn((c: string) => classes.has(c)),
        },
        getBoundingClientRect: () => ({ top: 400, left: 0, width: 200, height: 200 }),
      } as unknown as HTMLElement;

      // Start with Native Driver
      let solver = new ParallaxSolver(element, { driver: 'native', speed: 0.25 });
      expect(solver.getDriverType()).toBe('native');
      expect(classes.has('sc-parallax-target')).toBe(true);

      // Scroll changes while active
      solver.update(200);

      // Mid-scroll switch: Destroy native solver and instantiate JS solver
      solver.destroy();
      expect(classes.has('sc-parallax-target')).toBe(false);
      expect(element.style.animationTimeline).toBe('');

      // Replace with JS Driver
      solver = new ParallaxSolver(element, { driver: 'js', speed: 0.25 });
      expect(solver.getDriverType()).toBe('js');

      // Update and render with JS solver
      solver.update(300);
      solver.render();
      expect(element.style.transform).toContain('translate3d');

      solver.destroy();
    });
  });
});
