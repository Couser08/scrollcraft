/**
 * Layer 5 — Memory Soak / Zero-Leak Invariant Test Suite
 * Validates that repeatedly mounting, running, and destroying solvers,
 * ticker tasks, markers, and transform compositions yields ZERO leaks.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ticker } from '../ticker';
import { ParallaxSolver } from '../parallax';
import { PinSolver } from '../pinning';
import { TriggerRegistry, MarkerManager } from '../markers';
import { TransformComposer } from '../dom';

describe('Layer 5: Engine Memory Soak & Zero-Leak Invariant', () => {
  let ticker: Ticker;
  let registry: TriggerRegistry;
  let markerMgr: MarkerManager;

  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCancelRaf = globalThis.cancelAnimationFrame;

  beforeEach(() => {
    Object.assign(globalThis, {
      window: {
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
      },
      document: {
        documentElement: { scrollHeight: 20000 },
        body: {
          scrollHeight: 20000,
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {
            setProperty: vi.fn(),
            removeProperty: vi.fn(),
          },
          classList: {
            add: vi.fn(),
            remove: vi.fn(),
            contains: vi.fn().mockReturnValue(false),
          },
          setAttribute: vi.fn(),
          appendChild: vi.fn(),
          remove: vi.fn(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
      },
      requestAnimationFrame: (_cb: FrameRequestCallback) => 1,
      cancelAnimationFrame: vi.fn(),
    });

    ticker = Ticker.get();
    registry = TriggerRegistry.get();
    markerMgr = MarkerManager.get();
  });

  afterEach(() => {
    ticker.stop();
    markerMgr.destroy();
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
      requestAnimationFrame: originalRaf,
      cancelAnimationFrame: originalCancelRaf,
    });
  });

  it('SOAK: 20 consecutive mount/update/destroy cycles of 50 Parallax + 50 Pin solvers leave 0 residual tasks', () => {
    const CYCLES = 20;
    const INSTANCES_PER_CYCLE = 50;

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      const parallaxSolvers: ParallaxSolver[] = [];
      const pinSolvers: PinSolver[] = [];
      const taskIds: string[] = [];

      for (let i = 0; i < INSTANCES_PER_CYCLE; i++) {
        const pEl = {
          style: { transform: '' },
          getBoundingClientRect: () => ({
            top: i * 50,
            left: 0,
            width: 200,
            height: 100,
          }),
        } as unknown as HTMLElement;

        const pinEl = {
          style: { transform: '' },
          getBoundingClientRect: () => ({
            top: i * 100,
            left: 0,
            width: 300,
            height: 200,
          }),
        } as unknown as HTMLElement;

        const pSolver = new ParallaxSolver(pEl, { speed: 0.3 });
        const pinSolver = new PinSolver(pinEl, { duration: 600 });

        parallaxSolvers.push(pSolver);
        pinSolvers.push(pinSolver);

        const pTaskId = `p-task-c${cycle}-${i}`;
        const pinTaskId = `pin-task-c${cycle}-${i}`;
        taskIds.push(pTaskId, pinTaskId);

        ticker.add(pTaskId, 'update', () => pSolver.update(cycle * 100 + i));
        ticker.add(pinTaskId, 'update', () => pinSolver.update(cycle * 100 + i));
      }

      // Verify tasks are running
      expect(ticker.hasActiveTasks()).toBe(true);

      // Simulate scroll updates
      for (let s = 0; s < 5; s++) {
        for (let i = 0; i < INSTANCES_PER_CYCLE; i++) {
          parallaxSolvers[i].update(s * 50);
          parallaxSolvers[i].render();
          pinSolvers[i].update(s * 50);
          pinSolvers[i].render();
        }
      }

      // Teardown cycle
      for (const p of parallaxSolvers) p.destroy();
      for (const pin of pinSolvers) pin.destroy();
      for (const id of taskIds) ticker.remove(id);

      // Assert zero residual active tasks after teardown in every cycle
      expect(ticker.hasActiveTasks()).toBe(false);
    }

    // Final verification: ticker must be halted and idle
    expect(ticker.hasActiveTasks()).toBe(false);
  });

  it('SOAK: 20 cycles of TriggerRegistry churn with 100 triggers leaves 0 orphaned records and listeners', () => {
    const CYCLES = 20;
    const TRIGGERS_PER_CYCLE = 100;

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      const unsubs: Array<() => void> = [];

      // Add dynamic listeners
      for (let l = 0; l < 5; l++) {
        unsubs.push(registry.subscribe(vi.fn()));
      }

      // Register triggers
      for (let i = 0; i < TRIGGERS_PER_CYCLE; i++) {
        const id = `soak-trig-c${cycle}-${i}`;
        registry.register({
          id,
          type: 'transform',
          element: {} as Element,
          startTrigger: 'top center',
          endTrigger: 'bottom center',
          startY: i * 20,
          endY: i * 20 + 500,
          progress: 0,
          markers: false,
        });
      }

      expect(registry.getAll().length).toBe(TRIGGERS_PER_CYCLE);

      // Mutate progress & bounds
      for (let i = 0; i < TRIGGERS_PER_CYCLE; i++) {
        const id = `soak-trig-c${cycle}-${i}`;
        registry.updateProgress(id, 0.75);
        registry.updateBounds(id, i * 20 + 10, i * 20 + 510);
      }

      // Unregister all triggers
      for (let i = 0; i < TRIGGERS_PER_CYCLE; i++) {
        registry.unregister(`soak-trig-c${cycle}-${i}`);
      }

      // Unsubscribe all listeners
      for (const unsub of unsubs) {
        unsub();
      }

      expect(registry.getAll().length).toBe(0);
    }

    expect(registry.getAll()).toHaveLength(0);
  });

  it('SOAK: TransformComposer clears all owners across 500 nodes without residual transforms', () => {
    const NODES = 500;
    const elements: HTMLElement[] = [];

    for (let i = 0; i < NODES; i++) {
      const el = {
        style: { transform: 'scale(1)' },
      } as unknown as HTMLElement;
      elements.push(el);

      TransformComposer.set(el, 'parallax', 'translate3d(0, 50px, 0)');
      TransformComposer.set(el, 'pin', 'translate3d(0, 100px, 0)');
      TransformComposer.set(el, 'magnetic', 'translate3d(5px, 0, 0)');
    }

    // Verify all 3 owners applied
    for (const el of elements) {
      expect(el.style.transform).toContain('scale(1)');
      expect(el.style.transform).toContain('50px');
      expect(el.style.transform).toContain('100px');
      expect(el.style.transform).toContain('5px');
    }

    // Clear all owners
    for (const el of elements) {
      TransformComposer.clear(el, 'parallax');
      TransformComposer.clear(el, 'pin');
      TransformComposer.clear(el, 'magnetic');
    }

    // Must be completely restored to initial scale(1)
    for (const el of elements) {
      expect(el.style.transform).toBe('scale(1)');
    }
  });

  it('SOAK: Memory footprint remains bounded across 20 cycles', () => {
    const makeMockEl = () =>
      ({
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 }),
      } as unknown as HTMLElement);

    // Warmup cycle to let V8 compile hot paths
    for (let i = 0; i < 20; i++) {
      const p = new ParallaxSolver(makeMockEl(), { speed: 0.5 });
      p.update(100);
      p.destroy();
    }

    if (typeof globalThis.gc === 'function') {
      globalThis.gc();
    }

    const baselineHeap = process.memoryUsage ? process.memoryUsage().heapUsed : 0;

    for (let cycle = 0; cycle < 20; cycle++) {
      const solvers = Array.from({ length: 30 }, () =>
        new ParallaxSolver(makeMockEl(), { speed: 0.2 })
      );
      for (const s of solvers) {
        s.update(cycle * 50);
        s.destroy();
      }
    }

    if (typeof globalThis.gc === 'function') {
      globalThis.gc();
    }

    const finalHeap = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
    const deltaMB = (finalHeap - baselineHeap) / (1024 * 1024);

    // Delta across 20 cycles of 30 solvers must not expand by more than 15MB
    expect(deltaMB).toBeLessThan(15);
  });
});
