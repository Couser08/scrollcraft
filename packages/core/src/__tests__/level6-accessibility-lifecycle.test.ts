/**
 * Level 6 Hardening Test Suite:
 * - MotionPreferenceStore & WCAG 2.1 AAA Accessibility
 * - InputNormalizer OS Detection & Discrete Wheel Classification
 * - HistoryRestoreStore LRU Session Storage Registry
 * - Solvers & Inertia Engine Compliance under Reduced Motion
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  motionStore,
  MotionPreferenceStore,
  inputNormalizer,
  InputNormalizer,
  historyStore,
  HistoryRestoreStore,
  ParallaxSolver,
  RevealSolver,
  InertiaEngine,
  ticker,
} from '../index';

describe('Level 6: Accessibility, Lifecycle & Hardware Input Hardening', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalWheelEvent = (globalThis as any).WheelEvent;
  const originalIntersectionObserver = (globalThis as any).IntersectionObserver;

  let docAttrs: Record<string, string> = {};

  beforeEach(() => {
    docAttrs = {};

    class MockWheelEvent {
      public type: string;
      public deltaY: number;
      public deltaX: number;
      public deltaMode: number;
      constructor(type: string, init?: { deltaY?: number; deltaX?: number; deltaMode?: number }) {
        this.type = type;
        this.deltaY = init?.deltaY ?? 0;
        this.deltaX = init?.deltaX ?? 0;
        this.deltaMode = init?.deltaMode ?? 0;
      }
    }

    const mockDocElement = {
      scrollHeight: 3000,
      setAttribute: vi.fn((k: string, v: string) => {
        docAttrs[k] = String(v);
      }),
      getAttribute: vi.fn((k: string) => docAttrs[k] ?? null),
      removeAttribute: vi.fn((k: string) => {
        delete docAttrs[k];
      }),
    };

    const mockBody = {
      scrollHeight: 3000,
      appendChild: vi.fn((child: any) => child),
      removeChild: vi.fn((child: any) => child),
    };

    const createMockElement = (tag: string) => {
      const attrs: Record<string, string> = {};
      const el: any = {
        tagName: tag.toUpperCase(),
        style: {
          transform: '',
          opacity: '',
          transition: '',
          willChange: '',
          filter: '',
        },
        parentElement: null,
        setAttribute: vi.fn((k: string, v: string) => {
          attrs[k] = String(v);
        }),
        getAttribute: vi.fn((k: string) => attrs[k] ?? null),
        removeAttribute: vi.fn((k: string) => {
          delete attrs[k];
        }),
        appendChild: vi.fn((c: any) => {
          c.parentElement = el;
          return c;
        }),
        removeChild: vi.fn((c: any) => {
          c.parentElement = null;
          return c;
        }),
        getBoundingClientRect: vi.fn(() => ({
          top: 100,
          bottom: 200,
          left: 0,
          right: 200,
          width: 200,
          height: 100,
          x: 0,
          y: 100,
        })),
      };
      return el;
    };

    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    const mockWin: any = {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 1000,
      innerWidth: 1200,
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matchMedia: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      document: {
        documentElement: mockDocElement,
        body: mockBody,
        createElement: createMockElement,
      },
    };

    Object.assign(globalThis, {
      window: mockWin,
      WheelEvent: MockWheelEvent,
      IntersectionObserver: MockIntersectionObserver,
      document: mockWin.document,
    });

    motionStore.reset();
    inputNormalizer.reset();
    historyStore.clear();
    ticker.stop();
  });

  afterEach(() => {
    motionStore.reset();
    inputNormalizer.reset();
    historyStore.clear();
    ticker.stop();
    vi.restoreAllMocks();

    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
      WheelEvent: originalWheelEvent,
      IntersectionObserver: originalIntersectionObserver,
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1: MOTION PREFERENCE STORE (WCAG 2.1 AAA)
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 1: MotionPreferenceStore (WCAG 2.1 AAA Compliance)', () => {
    it('initializes as singleton with system mode by default', () => {
      const instance = MotionPreferenceStore.get();
      expect(instance).toBe(motionStore);
      expect(motionStore.getMode()).toBe('system');
    });

    it('sets and clears data-scrollcraft-reduced-motion attribute on html element', () => {
      motionStore.setOverride('reduce');
      expect(document.documentElement.getAttribute('data-scrollcraft-reduced-motion')).toBe('true');

      motionStore.setOverride('no-preference');
      expect(document.documentElement.getAttribute('data-scrollcraft-reduced-motion')).toBe('false');
    });

    it('manual override takes precedence over system preference', () => {
      motionStore.setOverride('reduce');
      expect(motionStore.isReduced()).toBe(true);

      motionStore.setOverride('no-preference');
      expect(motionStore.isReduced()).toBe(false);

      motionStore.setOverride('system');
      expect(typeof motionStore.isReduced()).toBe('boolean');
    });

    it('notifies subscribers immediately and on subsequent preference change', () => {
      const listener = vi.fn();
      const unsub = motionStore.subscribe(listener);

      // Initial call
      expect(listener).toHaveBeenCalledTimes(1);

      motionStore.setOverride('reduce');
      expect(listener).toHaveBeenCalledWith(true);

      motionStore.setOverride('no-preference');
      expect(listener).toHaveBeenCalledWith(false);

      unsub();
      motionStore.setOverride('reduce');
      // No further calls after unsubscribe
      expect(listener).toHaveBeenCalledTimes(3);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2: INPUT NORMALIZER & OS MULTIPLIER TUNING
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 2: InputNormalizer & Hardware Classification', () => {
    it('detects OS platform from navigator environment', () => {
      const os = inputNormalizer.getOS();
      expect(['windows', 'mac', 'linux', 'other']).toContain(os);
    });

    it('classifies DOM_DELTA_LINE (deltaMode=1) as discrete-wheel', () => {
      const event = new WheelEvent('wheel', { deltaY: 3, deltaMode: 1 });
      const classified = inputNormalizer.analyzeWheelEvent(event);
      expect(classified).toBe('discrete-wheel');
      expect(inputNormalizer.getRecommendedMultiplier()).toBe(1.18);
    });

    it('classifies integer stepped delta >= 100 as discrete-wheel', () => {
      const event = new WheelEvent('wheel', { deltaY: 120, deltaMode: 0 });
      const classified = inputNormalizer.analyzeWheelEvent(event);
      expect(classified).toBe('discrete-wheel');
      expect(inputNormalizer.getRecommendedMultiplier()).toBe(1.18);
    });

    it('classifies fractional subpixel deltas as precision-touchpad', () => {
      inputNormalizer.reset('mac');
      const event = new WheelEvent('wheel', { deltaY: 14.35, deltaMode: 0 });
      const classified = inputNormalizer.analyzeWheelEvent(event);
      expect(classified).toBe('precision-touchpad');
      expect(inputNormalizer.getRecommendedMultiplier()).toBe(1.0);
    });

    it('recommends default 1.18 for Windows and 1.0 for Mac before wheel events arrive', () => {
      inputNormalizer.reset('windows');
      expect(inputNormalizer.getRecommendedMultiplier()).toBe(1.18);

      inputNormalizer.reset('mac');
      expect(inputNormalizer.getRecommendedMultiplier()).toBe(1.0);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 3: HISTORY RESTORE STORE (LRU & SESSIONSTORAGE)
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 3: HistoryRestoreStore (LRU Session Restoration)', () => {
    it('normalizes route keys consistently across trailing slashes and origin', () => {
      expect(historyStore.normalizeKey('/docs/')).toBe('/docs');
      expect(historyStore.normalizeKey('/docs?tab=hooks')).toBe('/docs?tab=hooks');
      expect(historyStore.normalizeKey('https://scrollcraft.dev/showcase/')).toBe('/showcase');
      expect(historyStore.normalizeKey('')).toBe('/');
    });

    it('saves and retrieves scroll positions with numeric rounding', () => {
      historyStore.save('/docs', 450.8);
      expect(historyStore.get('/docs')).toBe(451);
      expect(historyStore.get('/unknown')).toBeNull();
    });

    it('removes specific keys and clears all records', () => {
      historyStore.save('/a', 100);
      historyStore.save('/b', 200);

      historyStore.remove('/a');
      expect(historyStore.get('/a')).toBeNull();
      expect(historyStore.get('/b')).toBe(200);

      historyStore.clear();
      expect(historyStore.get('/b')).toBeNull();
    });

    it('enforces 50-route LRU ceiling without unbounded memory growth', () => {
      for (let i = 0; i < 60; i++) {
        historyStore.save(`/route-${i}`, i * 10);
      }
      // Oldest routes (0 to 9) should be evicted
      expect(historyStore.get('/route-0')).toBeNull();
      expect(historyStore.get('/route-9')).toBeNull();
      // Most recent routes should be intact
      expect(historyStore.get('/route-59')).toBe(590);
      expect(historyStore.get('/route-50')).toBe(500);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 4: SOLVER COMPLIANCE UNDER REDUCED MOTION
  // ══════════════════════════════════════════════════════════════════════════
  describe('Step 4: Solvers & Inertia Engine Reduced Motion Compliance', () => {
    it('ParallaxSolver clamps displacement to 0px when motion is reduced', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      const solver = new ParallaxSolver(el, { speed: 0.5, driver: 'js' });

      // Normal mode: displacement occurs
      const state1 = solver.update(500);
      expect(state1.offset).not.toBe(0);

      // Reduced motion: displacement clamped to 0px
      motionStore.setOverride('reduce');
      const state2 = solver.update(500);
      expect(state2.offset).toBe(0);

      solver.render();
      expect(el.style.transform).toBe('');

      solver.destroy();
      document.body.removeChild(el);
    });

    it('RevealSolver instantly makes element visible with opacity:1 without animation when reduced', () => {
      motionStore.setOverride('reduce');
      const el = document.createElement('div');
      document.body.appendChild(el);

      const onReveal = vi.fn();
      const solver = RevealSolver.get();
      solver.observe(el, { direction: 'up', distance: 40, onReveal });

      expect(el.style.opacity).toBe('1');
      expect(el.style.transition).toBe('none');
      expect(onReveal).toHaveBeenCalledTimes(1);

      document.body.removeChild(el);
    });

    it('InertiaEngine auto-tunes wheelMultiplier based on InputNormalizer and respects reduced motion', () => {
      inputNormalizer.reset('windows');
      const engine = new InertiaEngine({ wheelMultiplier: 'auto' });
      expect((engine as any).config.wheelMultiplier).toBe(1.18);

      // Under reduced motion, Lenis instance is halted while metrics remain accessible
      motionStore.setOverride('reduce');
      const reducedEngine = new InertiaEngine({ respectReducedMotion: true });
      reducedEngine.init();

      expect(reducedEngine.getLenis()).toBeNull();
      expect(reducedEngine.getMetrics()).toBeDefined();

      reducedEngine.destroy();
    });
  });
});
