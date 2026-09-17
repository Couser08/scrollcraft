import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useState } from 'react';
import { renderToString } from 'react-dom/server';
import {
  historyStore,
  motionStore,
} from '@scrollcraft/core';
import {
  ScrollProvider,
  useScrollCraft,
  useScrollRestoration,
} from '../index';

describe('Level 6: React Scroll Restoration & Motion Preference Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  let listeners: Record<string, Function[]> = {};

  beforeEach(() => {
    listeners = {};
    historyStore.clear();
    motionStore.reset();

    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 1,
      location: {
        pathname: '/docs',
        search: '?v=1',
        hash: '',
      },
      addEventListener: vi.fn((event: string, fn: Function) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(fn);
      }),
      removeEventListener: vi.fn((event: string, fn: Function) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((cb) => cb !== fn);
        }
      }),
      scrollTo: vi.fn((x: number | ScrollToOptions, y?: number) => {
        if (typeof x === 'object') {
          mockWin.scrollY = x.top ?? 0;
        } else {
          mockWin.scrollY = y ?? 0;
        }
      }),
      requestAnimationFrame: vi.fn((fn: Function) => {
        fn();
        return 1;
      }),
      cancelAnimationFrame: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });

    const mockClassList = () => ({
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      [Symbol.iterator]: function* () {},
    });

    const mockDoc = {
      documentElement: {
        scrollHeight: 2400,
        classList: mockClassList(),
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
      },
      body: {
        scrollHeight: 2400,
        classList: mockClassList(),
      },
      createElement: (tag: string) => ({
        tagName: tag.toUpperCase(),
        style: {},
        setAttribute: vi.fn(),
        classList: mockClassList(),
      }),
      querySelector: vi.fn((selector: string) => {
        if (selector === '#pricing') {
          return {
            getBoundingClientRect: () => ({ top: 850, bottom: 1200 }),
          };
        }
        return null;
      }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      fonts: { ready: Promise.resolve() },
    };

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      document: mockDoc,
      requestAnimationFrame: mockWin.requestAnimationFrame,
      cancelAnimationFrame: mockWin.cancelAnimationFrame,
    });
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
    delete (globalThis as any).requestAnimationFrame;
    delete (globalThis as any).cancelAnimationFrame;
    historyStore.clear();
    motionStore.reset();
    vi.restoreAllMocks();
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 1: useScrollRestoration BASIC API & SSR SAFETY
  // ══════════════════════════════════════════════════════════════════
  describe('Step 1: useScrollRestoration Basic API & SSR Safety', () => {
    it('renders cleanly in SSR without errors and returns stable API shape', () => {
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({ routeKey: '/docs' });
        return <div data-testid="test">Docs Page</div>;
      }

      const html = renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      expect(html).toContain('Docs Page');
      expect(hookOutput).not.toBeNull();
      expect(typeof hookOutput.savePosition).toBe('function');
      expect(typeof hookOutput.restorePosition).toBe('function');
      expect(typeof hookOutput.resetToTop).toBe('function');
      expect(hookOutput.savedPosition).toBeNull();
    });

    it('falls back gracefully when routeKey is omitted', () => {
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration();
        return <div>Auto Key</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      expect(hookOutput).not.toBeNull();
      expect(typeof hookOutput.savePosition).toBe('function');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 2: MANUAL CONTROLS & PERSISTENCE
  // ══════════════════════════════════════════════════════════════════
  describe('Step 2: Manual Position Saving and Reset', () => {
    it('manually saves scroll position to historyStore', () => {
      (globalThis.window as any).scrollY = 720;
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({ routeKey: '/blog/post-1' });
        return <div>Blog</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      hookOutput.savePosition();
      expect(historyStore.get('/blog/post-1')).toBe(720);
    });

    it('resetToTop() scrolls window to (0, 0)', () => {
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({ routeKey: '/showcase' });
        return <div>Showcase</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      hookOutput.resetToTop();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('manual restorePosition() reads saved historyStore record', () => {
      historyStore.save('/about', 430);
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({ routeKey: '/about' });
        return <div>About</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      expect(hookOutput.savedPosition).toBe(430);
      hookOutput.restorePosition();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 430);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 3: HASH NAVIGATION & TARGET RESOLUTION
  // ══════════════════════════════════════════════════════════════════
  describe('Step 3: Hash Navigation & Custom Target Resolvers', () => {
    it('scrolls to hash anchor offset when window.location.hash is present', () => {
      (globalThis.window as any).location.hash = '#pricing';
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({ routeKey: '/pricing' });
        return <div>Pricing</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      hookOutput.restorePosition();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 850);
    });

    it('honors getScrollTarget override when provided', () => {
      let hookOutput: any = null;

      function Consumer() {
        hookOutput = useScrollRestoration({
          routeKey: '/dashboard',
          getScrollTarget: (key) => 1250,
        });
        return <div>Dashboard</div>;
      }

      renderToString(
        <ScrollProvider>
          <Consumer />
        </ScrollProvider>
      );

      hookOutput.restorePosition();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 1250);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 4: REDUCED MOTION & SCROLLPROVIDER INTEGRATION
  // ══════════════════════════════════════════════════════════════════
  describe('Step 4: ScrollProvider Reduced Motion & Store Sync', () => {
    it('exposes reducedMotion in useScrollCraft context when motionOverride is reduce', () => {
      let isReduced = false;

      function MotionConsumer() {
        const { reducedMotion } = useScrollCraft();
        isReduced = reducedMotion;
        return <div>Motion Consumer</div>;
      }

      renderToString(
        <ScrollProvider motionOverride="reduce">
          <MotionConsumer />
        </ScrollProvider>
      );

      expect(isReduced).toBe(true);
      expect(motionStore.isReduced()).toBe(true);
    });

    it('exposes reducedMotion=false when motionOverride is no-preference', () => {
      let isReduced = true;

      function MotionConsumer() {
        const { reducedMotion } = useScrollCraft();
        isReduced = reducedMotion;
        return <div>Motion Consumer</div>;
      }

      renderToString(
        <ScrollProvider motionOverride="no-preference">
          <MotionConsumer />
        </ScrollProvider>
      );

      expect(isReduced).toBe(false);
      expect(motionStore.isReduced()).toBe(false);
    });
  });
});
