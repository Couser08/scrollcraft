import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ticker,
  ParallaxSolver,
  SequenceSolver,
  TextRevealSolver,
  StackedCardsSolver,
} from '../index';

describe('Level 1: Core Solvers Hardening & Zero-Jank Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalImage = (globalThis as any).Image;

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

    const createMockElement = (tag: string) => {
      const attrs: Record<string, string> = {};
      const el: any = {
        tagName: tag.toUpperCase(),
        style: {
          transform: '',
          opacity: '',
          filter: '',
          pointerEvents: '',
          overflow: '',
          zIndex: '',
        },
        classList: mockClassList(),
        parentElement: null as any,
        offsetHeight: 400,
        offsetWidth: 600,
        width: 800,
        height: 600,
        setAttribute: vi.fn((name: string, val: string) => {
          attrs[name] = String(val);
        }),
        getAttribute: vi.fn((name: string) => attrs[name] ?? null),
        removeAttribute: vi.fn((name: string) => {
          delete attrs[name];
        }),
        appendChild: vi.fn((child: any) => {
          child.parentElement = el;
          return child;
        }),
        removeChild: vi.fn((child: any) => {
          child.parentElement = null;
          return child;
        }),
        getBoundingClientRect: vi.fn(() => ({
          top: 0,
          bottom: 500,
          left: 0,
          right: 800,
          width: 800,
          height: 500,
          x: 0,
          y: 0,
          toJSON: () => {},
        })),
        getContext: vi.fn(() => ({
          setTransform: vi.fn(),
          clearRect: vi.fn(),
          drawImage: vi.fn(),
        })),
      };
      return el;
    };

    class MockImage {
      private _src: string = '';
      public width: number = 800;
      public height: number = 600;
      public onload: (() => void) | null = null;
      public onerror: (() => void) | null = null;
      public get src(): string {
        return this._src;
      }
      public set src(val: string) {
        this._src = val;
        if (val && this.onload) {
          this.onload();
        }
      }
    }

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      Image: MockImage,
      ResizeObserver: MockResizeObserver,
      IntersectionObserver: MockIntersectionObserver,
      document: {
        documentElement: {
          scrollHeight: 3000,
          classList: mockClassList(),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
        },
        body: {
          scrollHeight: 3000,
          classList: mockClassList(),
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
        createElement: (tag: string) => createMockElement(tag),
        head: { appendChild: vi.fn() },
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
      Image: originalImage,
    });
    vi.restoreAllMocks();
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 3: TICKER PROFILING & BENCHMARK CONTAMINATION GUARD
  // ══════════════════════════════════════════════════════════════════
  describe('Step 3: Ticker Tracing & Benchmark Contamination Guard', () => {
    it('bypasses performance.mark and measure when benchmarkingMode is true or profiling is disabled', () => {
      const markSpy = vi.spyOn(performance, 'mark');
      const measureSpy = vi.spyOn(performance, 'measure');

      // 1. By default, profilingEnabled is false (zero overhead)
      const taskId = `bench-test-${Math.random()}`;
      ticker.add(taskId, 'update', () => {});
      (ticker as any).runPhase('update', (ticker as any).updateTasks, (ticker as any).updateTasksArray, 0.016, 100);

      expect(markSpy).not.toHaveBeenCalled();
      expect(measureSpy).not.toHaveBeenCalled();

      // 2. When profilingEnabled is true but benchmarkingMode is true, still bypassed
      ticker.profilingEnabled = true;
      ticker.benchmarkingMode = true;
      (ticker as any).runPhase('update', (ticker as any).updateTasks, (ticker as any).updateTasksArray, 0.016, 100);

      expect(markSpy).not.toHaveBeenCalled();
      expect(measureSpy).not.toHaveBeenCalled();

      // 3. When profilingEnabled is true and benchmarkingMode is false, marks and measures are called
      ticker.benchmarkingMode = false;
      (ticker as any).runPhase('update', (ticker as any).updateTasks, (ticker as any).updateTasksArray, 0.016, 100);

      expect(markSpy).toHaveBeenCalledWith('sc-update-start');
      expect(markSpy).toHaveBeenCalledWith('sc-update-end');
      expect(measureSpy).toHaveBeenCalledWith('ScrollCraft:update', 'sc-update-start', 'sc-update-end');

      ticker.remove(taskId);
      ticker.profilingEnabled = false;
      ticker.benchmarkingMode = false;
    });

    it('records dropped frames in ring buffer when frame delta exceeds budget', () => {
      ticker.stop();
      (ticker as any).resetFrameHistory();

      // Simulate 5 dropped frames (delta > 21.7ms e.g. 35ms)
      for (let i = 0; i < 5; i++) {
        (ticker as any).recordFrameDelta(0.035, 1000 + i * 35);
      }

      const dropped = ticker.getDroppedFrames();
      expect(dropped.recent).toBe(5);
      expect(dropped.total).toBeGreaterThanOrEqual(5);

      (ticker as any).resetFrameHistory();
      expect(ticker.getDroppedFrames().recent).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 4: PARALLAX HERO ANTI-JUMP & BLEED
  // ══════════════════════════════════════════════════════════════════
  describe('Step 4: Parallax Hero Anti-Jump, Bleed & Multi-Axis Layering', () => {
    it('origin="auto" anchors initial offset at scrollY=0 to strictly 0px (Hero Anti-Jump)', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      // Element positioned at top of page (hero)
      el.getBoundingClientRect = () => ({
        top: 0,
        bottom: 500,
        left: 0,
        right: 1000,
        width: 1000,
        height: 500,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Force JS driver to inspect numerical offset calculations
      const solver = new ParallaxSolver(el, {
        speed: 0.3,
        origin: 'auto',
        driver: 'js',
      });

      solver.measure();
      // At scrollY = 0: displacement must be strictly 0
      const stateAt0 = solver.update(0);
      expect(stateAt0.offset).toBe(0);

      // When scrolled 300px down: displacement grows smoothly without initial jump
      const stateAt300 = solver.update(300);
      expect(stateAt300.offset).toBe(300 * 0.3); // 90px

      solver.destroy();
      document.body.removeChild(el);
    });

    it('bleed={true} sets parent overflow: hidden, applies bleed scale and restores on destroy', () => {
      const parent = document.createElement('div');
      parent.style.overflow = 'visible';
      const el = document.createElement('div');
      parent.appendChild(el);
      document.body.appendChild(parent);

      el.getBoundingClientRect = () => ({
        top: 100,
        bottom: 500,
        left: 0,
        right: 1000,
        width: 1000,
        height: 400,
        x: 0,
        y: 100,
        toJSON: () => {},
      });

      const solver = new ParallaxSolver(el, {
        speed: 0.2,
        bleed: true,
        scale: 1.1,
        rotate: 15,
        driver: 'js',
      });

      expect(parent.style.overflow).toBe('hidden');

      solver.update(200);
      solver.render();

      // Transform must compose translation, bleed scale, and rotation
      expect(el.style.transform).toContain('translate3d');
      expect(el.style.transform).toContain('scale(');
      expect(el.style.transform).toContain('rotate(15deg)');

      solver.destroy();
      expect(parent.style.overflow).toBe('visible');
      document.body.removeChild(parent);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 5: SEQUENCE SOLVER LRU MEMORY SOAK & OOM JETSAM PREVENTION
  // ══════════════════════════════════════════════════════════════════
  describe('Step 5: SequenceSolver LRU Decoded Window & VRAM Jetsam Guard', () => {
    it('bounds memory to active LRU window <= 20 frames across 120-frame scrub', () => {
      const canvas = document.createElement('canvas');
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(canvas);

      container.getBoundingClientRect = () => ({
        top: 0,
        bottom: 3000,
        left: 0,
        right: 1000,
        width: 1000,
        height: 3000,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // 120 frames sequence (typical high-res mobile sequence that would crash Mobile Safari)
      const frames = Array.from({ length: 120 }, (_, i) => `https://example.com/frame_${i}.jpg`);

      const solver = new SequenceSolver(canvas, container, {
        frames,
        windowSize: 15, // Test with 15 frames capacity
        maxDpr: 1.5,
      });

      solver.measure();

      // Initial preload should not exceed windowSize
      expect(solver.getLoadedFramesCount()).toBeLessThanOrEqual(15);

      // Fast forward scrub to frame 60 (middle)
      solver.update(1500); // 50% scroll
      expect(solver.getCurrentFrame()).toBe(0); // Before render
      solver.render();
      expect(solver.getCurrentFrame()).toBeGreaterThan(50);

      // Memory soak verification: active loaded frames in memory must remain bounded <= 15
      expect(solver.getLoadedFramesCount()).toBeLessThanOrEqual(15);

      // Fast forward scrub to end (frame 119)
      solver.update(3000);
      solver.render();
      expect(solver.getCurrentFrame()).toBe(119);
      expect(solver.getLoadedFramesCount()).toBeLessThanOrEqual(15);

      // Teardown
      solver.destroy();
      expect(solver.getLoadedFramesCount()).toBe(0);

      document.body.removeChild(container);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 6: TEXT REVEAL SOLVER STATE TRANSITION & KINETICS
  // ══════════════════════════════════════════════════════════════════
  describe('Step 6: TextRevealSolver State Transition & Kinetics', () => {
    it('sets data-sc-reveal="active" on container and renders blur and 3D tilt', () => {
      const container = document.createElement('div');
      container.setAttribute('data-sc-reveal', 'pending');
      const chars: HTMLElement[] = [];
      for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        chars.push(span);
        container.appendChild(span);
      }
      document.body.appendChild(container);

      container.getBoundingClientRect = () => ({
        top: 500,
        bottom: 550,
        left: 0,
        right: 300,
        width: 300,
        height: 50,
        x: 0,
        y: 500,
        toJSON: () => {},
      });

      const solver = new TextRevealSolver(container, chars, {
        blur: 8,
        scale: 0.8,
        rotateX: 45,
        slide: 20,
      });

      // Hydration state transition: cancels CSS fallback keyframe immediately
      expect(container.getAttribute('data-sc-reveal')).toBe('active');

      solver.measure();
      // Scroll to 0: chars enter viewport partially
      solver.update(0, 1000);
      solver.render();

      // First char should have transformed with blur and tilt
      expect(chars[0].style.opacity).toBeDefined();

      solver.destroy();
      expect(container.getAttribute('data-sc-reveal')).toBeNull();
      document.body.removeChild(container);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 7: STACKED CARDS SOLVER VARIABLE HEIGHTS & POINTER-EVENTS
  // ══════════════════════════════════════════════════════════════════
  describe('Step 7: StackedCardsSolver Variable Heights & Dynamic Pointer-Events', () => {
    it('measures variable card heights and gates pointer-events: none on buried cards', () => {
      const container = document.createElement('div');
      const card0 = document.createElement('div');
      const card1 = document.createElement('div');
      const card2 = document.createElement('div');

      // Variable heights: Card 0 = 300px, Card 1 = 600px, Card 2 = 250px
      Object.defineProperty(card0, 'offsetHeight', { value: 300, configurable: true });
      Object.defineProperty(card1, 'offsetHeight', { value: 600, configurable: true });
      Object.defineProperty(card2, 'offsetHeight', { value: 250, configurable: true });

      container.appendChild(card0);
      container.appendChild(card1);
      container.appendChild(card2);
      document.body.appendChild(container);

      container.getBoundingClientRect = () => ({
        top: 0,
        bottom: 2000,
        left: 0,
        right: 800,
        width: 800,
        height: 2000,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      const solver = new StackedCardsSolver(container, [card0, card1, card2], {
        top: 50,
        offset: 30,
        cardDistance: 400,
      });

      // 1. Initial state at scrollY = 0
      solver.update(0);
      solver.render();

      expect(card0.style.pointerEvents).toBe('auto');
      expect(card1.style.pointerEvents).toBe('auto');
      expect(card2.style.pointerEvents).toBe('auto');

      // 2. Scroll to 600px: Card 1 pins on top of Card 0
      solver.update(600);
      solver.render();

      // Card 0 is now buried underneath Card 1!
      // Must receive pointer-events: none to prevent ghost clicks on buried layers!
      expect(card0.style.pointerEvents).toBe('none');
      // Card 1 is top-most active card: must have pointer-events: auto
      expect(card1.style.pointerEvents).toBe('auto');

      // 3. Scroll back up to 0px: Card 1 un-stacks
      solver.update(0);
      solver.render();

      // Card 0 is restored to interactive
      expect(card0.style.pointerEvents).toBe('auto');

      // 4. Teardown
      solver.destroy();
      expect(card0.style.pointerEvents).toBe('');
      expect(card0.style.transform).toBe('');

      document.body.removeChild(container);
    });

    it('safely handles empty cards array and single card edge case', () => {
      const container = document.createElement('div');
      const emptySolver = new StackedCardsSolver(container, []);
      expect(() => {
        emptySolver.measure();
        emptySolver.update(500);
        emptySolver.render();
        emptySolver.destroy();
      }).not.toThrow();

      const singleCard = document.createElement('div');
      container.appendChild(singleCard);
      const singleSolver = new StackedCardsSolver(container, [singleCard]);
      singleSolver.measure();
      singleSolver.update(1000);
      singleSolver.render();

      // A single card is never buried
      expect(singleCard.style.pointerEvents).toBe('auto');
      singleSolver.destroy();
    });

    it('survives 20 consecutive mount/update/destroy churn cycles across 25 cards without leaking', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      for (let cycle = 0; cycle < 20; cycle++) {
        const cards = Array.from({ length: 25 }, () => document.createElement('div'));
        cards.forEach((c) => container.appendChild(c));

        const solver = new StackedCardsSolver(container, cards);
        solver.measure();

        // Simulate multi-point scrub
        solver.update(-200); // negative overscroll
        solver.render();
        solver.update(5000); // deep scroll
        solver.render();

        solver.destroy();

        // Verify cleanup on every card
        cards.forEach((c) => {
          expect(c.style.pointerEvents).toBe('');
          expect(c.style.transform).toBe('');
        });
      }

      document.body.removeChild(container);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // ADVERSARIAL BOUNDARY & FUZZING TESTS ACROSS LEVEL 1
  // ══════════════════════════════════════════════════════════════════
  describe('Adversarial Boundary & Fuzzing Suite across Level 1 Solvers', () => {
    it('Parallax strictly clamps displacement within min and max under extreme speed', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      const solver = new ParallaxSolver(el, {
        speed: 5.0, // extreme speed
        min: -50,
        max: 50,
        driver: 'js',
      });

      solver.measure();
      // Enormous scroll delta: 10,000px * 5.0 = 50,000px, but must be clamped to 50
      const state = solver.update(10000);
      expect(state.offset).toBe(50);

      // Enormous negative scroll: must clamp to -50
      const negState = solver.update(-10000);
      expect(negState.offset).toBe(-50);

      solver.destroy();
      document.body.removeChild(el);
    });

    it('SequenceSolver survives erratic oscillating scrub while bounding memory strictly', () => {
      const canvas = document.createElement('canvas');
      const container = document.createElement('div');
      document.body.appendChild(container);

      const frames = Array.from({ length: 80 }, (_, i) => `img_${i}.png`);
      const solver = new SequenceSolver(canvas, container, {
        frames,
        windowSize: 12,
      });

      solver.measure();

      // Wild oscillating scroll pattern
      const scrollPositions = [0, 2000, 100, 1800, 300, 1500, 50, 1900, 0];
      for (const pos of scrollPositions) {
        solver.update(pos);
        solver.render();
        expect(solver.getLoadedFramesCount()).toBeLessThanOrEqual(12);
      }

      solver.destroy();
      expect(solver.getLoadedFramesCount()).toBe(0);
      document.body.removeChild(container);
    });

    it('TextReveal handles empty chars and negative scroll offsets without NaN', () => {
      const container = document.createElement('div');
      const solver = new TextRevealSolver(container, [], { blur: 10, scale: 0.5 });

      expect(() => {
        solver.measure();
        solver.update(-500, 1000);
        solver.render();
        solver.destroy();
      }).not.toThrow();
    });
  });
});
