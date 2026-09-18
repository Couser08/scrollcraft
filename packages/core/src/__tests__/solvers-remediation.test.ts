import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HorizontalScrollSolver } from '../horizontal';
import { InertiaEngine } from '../inertia';
import { ScrollValue } from '../scroll-value';
import { TransformSolver } from '../transform-solver';
import { DrawSolver } from '../draw-solver';
import { TextRevealSolver } from '../text-reveal';
import { StackedCardsSolver } from '../stacked-cards-solver';
import { GlobalRevealObserver } from '../reveal';
import { TransformComposer } from '../dom';

describe('Remediation: Solvers & Runtime Resilience', () => {
  let mockWindow: {
    scrollY: number;
    pageYOffset: number;
    innerHeight: number;
    innerWidth: number;
    devicePixelRatio: number;
  };

  const elementsMap = new Map<string, unknown>();

  beforeEach(() => {
    elementsMap.clear();
    mockWindow = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 1000,
      innerWidth: 1000,
      devicePixelRatio: 1,
    };
    vi.stubGlobal('window', mockWindow);

    const mockDoc = {
      createElement: (tag: string) => {
        const el = {
          tagName: tag.toUpperCase(),
          id: '',
          textContent: '',
          style: {},
          parentNode: null as unknown,
        };
        return el;
      },
      head: {
        appendChild: (el: { id?: string; parentNode?: unknown }) => {
          el.parentNode = mockDoc.head;
          if (el.id) elementsMap.set(el.id, el);
        },
        removeChild: (el: { id?: string; parentNode?: unknown }) => {
          el.parentNode = null;
          if (el.id) elementsMap.delete(el.id);
        },
      },
      getElementById: (id: string) => elementsMap.get(id) || null,
    };
    vi.stubGlobal('document', mockDoc);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('H-01: Horizontal Scroll Speed Option', () => {
    it('applies speed multiplier to effective scroll distance and progress in JS driver', () => {
      // 2 identical sections: height 3000px, windowHeight 1000px => maxScrollDistance = 2000px
      // trackWidth = 2000px
      const createSection = (speed: number) => {
        const element = {
          style: {} as Record<string, string>,
          getBoundingClientRect: () => ({ top: 0, height: 3000 }),
        } as unknown as HTMLElement;

        const innerContainer = {
          style: {} as Record<string, string>,
          scrollWidth: 3000,
        } as unknown as HTMLElement;

        const solver = new HorizontalScrollSolver(element, innerContainer, {
          driver: 'js',
          speed,
        });

        solver.measure();
        return { element, innerContainer, solver };
      };

      const sectionSpeed1 = createSection(1);
      const sectionSpeed2 = createSection(2);

      // Scroll 500px down:
      // For speed 1: effectiveScrollDistance = 2000. Progress = 500 / 2000 = 0.25. Offset = -0.25 * 2000 = -500
      // For speed 2: effectiveScrollDistance = 2000 / 2 = 1000. Progress = 500 / 1000 = 0.50. Offset = -0.50 * 2000 = -1000
      const state1 = sectionSpeed1.solver.update(500);
      const state2 = sectionSpeed2.solver.update(500);

      expect(state1.progress).toBeCloseTo(0.25, 4);
      expect(state1.offset).toBeCloseTo(-500, 2);

      expect(state2.progress).toBeCloseTo(0.50, 4);
      expect(state2.offset).toBeCloseTo(-1000, 2);

      // Verify that speed 2 reached 2x progress compared to speed 1
      expect(state2.progress).toBe(state1.progress * 2);

      sectionSpeed1.solver.destroy();
      sectionSpeed2.solver.destroy();
    });

    it('generates scaled keyframes and cleans up unique style elements in Native driver', () => {
      const element = {
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 0, height: 3000 }),
      } as unknown as HTMLElement;

      const innerContainer = {
        style: {
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        } as unknown as CSSStyleDeclaration,
        scrollWidth: 3000,
      } as unknown as HTMLElement;

      const solver = new HorizontalScrollSolver(element, innerContainer, {
        driver: 'native',
        speed: 2,
      });

      solver.measure();

      // Check that animationName is set and unique
      const animName = (innerContainer.style as unknown as Record<string, string>).animationName;
      expect(animName).toMatch(/^sc-horizontal-slide-/);

      const styleEl = document.getElementById(`sc-horizontal-style-${animName}`) as HTMLStyleElement;
      expect(styleEl).not.toBeNull();
      // At speed: 2, 100 / 2 = 50.000%
      expect(styleEl.textContent).toContain('50.000%, 100% { transform: translate3d(var(--sc-slide-end, 0px), 0, 0); }');

      solver.destroy();
      // Style element should be cleanly removed from DOM
      expect(document.getElementById(`sc-horizontal-style-${animName}`)).toBeNull();
    });
  });

  describe('M-02: Inertia and ScrollValue Subscriber Error Isolation', () => {
    it('isolates throwing subscribers in InertiaEngine without stopping subsequent subscribers', () => {
      const engine = new InertiaEngine();
      const survivorSpy = vi.fn();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Subscriber 1 throws on every call
      engine.subscribe(() => {
        throw new Error('Subscriber 1 exploded!');
      });

      // Subscriber 2 is healthy
      engine.subscribe(survivorSpy);

      // Initial call should have delivered to survivorSpy
      expect(survivorSpy).toHaveBeenCalled();
      survivorSpy.mockClear();

      // Trigger scroll event update via onLenisScroll
      (engine as unknown as { onLenisScroll: (e: Record<string, unknown>) => void }).onLenisScroll({
        scroll: 200,
        velocity: 5,
        limit: 1000,
      });

      // Survivor must still have received the notification
      expect(survivorSpy).toHaveBeenCalledTimes(1);
      expect(survivorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          scroll: 200,
          velocity: 5,
        })
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      engine.destroy();
      consoleErrorSpy.mockRestore();
    });

    it('isolates throwing subscribers in ScrollValue and handles unsubscriptions during notify', () => {
      const val = new ScrollValue(10);
      const survivorSpy = vi.fn();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      val.subscribe(() => {
        throw new Error('ScrollValue subscriber crashed!');
      });

      const unsubSurvivor = val.subscribe(survivorSpy);
      expect(survivorSpy).toHaveBeenCalledWith(10);
      survivorSpy.mockClear();

      // Updating value should not crash despite first subscriber throwing
      val.set(20);
      expect(survivorSpy).toHaveBeenCalledWith(20);

      // Mutation during notify test
      let unsubSelf: (() => void) | null = null;
      unsubSelf = val.subscribe(() => {
        if (unsubSelf) unsubSelf(); // Unsubscribe inside notify callback
      });

      expect(() => val.set(30)).not.toThrow();

      unsubSurvivor();
      val.destroy();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('M-03: TransformSolver Style Preservation on Destroy', () => {
    it('preserves pre-existing caller inline styles after solver destruction', () => {
      const element = {
        style: {
          transform: '',
          opacity: '0.8',
          filter: 'blur(4px)',
          borderRadius: '12px',
          willChange: 'transform',
        },
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(element, {
        start: 'top bottom',
        end: 'bottom top',
        properties: {
          y: [0, 100],
          scale: [1, 1.5],
        },
        scrub: false,
      });

      solver.measure();
      solver.update(100, 0, 0.016);
      solver.render();

      // Transform was composed
      expect(element.style.transform).toContain('translate3d');

      // Pre-existing styles must NOT have been modified since properties did not animate them
      expect(element.style.opacity).toBe('0.8');
      expect(element.style.filter).toBe('blur(4px)');
      expect(element.style.borderRadius).toBe('12px');

      solver.destroy();

      // On destroy, pre-existing inline styles MUST still be intact!
      expect(element.style.opacity).toBe('0.8');
      expect(element.style.filter).toBe('blur(4px)');
      expect(element.style.borderRadius).toBe('12px');
      expect(element.style.willChange).toBe('transform');
    });

    it('restores original caller values when animated property is destroyed', () => {
      const element = {
        style: {
          transform: '',
          opacity: '0.5',
          filter: 'blur(2px)',
          borderRadius: '',
          willChange: '',
        },
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(element, {
        start: 'top bottom',
        end: 'bottom top',
        properties: {
          opacity: [0.5, 1],
          blur: [2, 10],
        },
        scrub: false,
      });

      solver.measure();
      solver.update(600, 0, 0.016);
      solver.render();

      // Mutated values
      expect(Number(element.style.opacity)).toBeGreaterThan(0.5);
      expect(element.style.filter).toContain('blur');

      solver.destroy();

      // Must be restored back to initial values
      expect(element.style.opacity).toBe('0.5');
      expect(element.style.filter).toBe('blur(2px)');
    });

    it('preserves SVG stroke styles in DrawSolver on destroy', () => {
      const element = {
        style: {
          strokeDasharray: '10 10',
          strokeDashoffset: '5',
        },
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
        getTotalLength: () => 1000,
      } as unknown as SVGGeometryElement;

      const solver = new DrawSolver(element, { scrub: false });
      solver.measure();
      solver.destroy();

      expect(element.style.strokeDasharray).toBe('10 10');
      expect(element.style.strokeDashoffset).toBe('5');
    });

    it('preserves initial character opacities in TextRevealSolver on destroy', () => {
      const container = {
        getBoundingClientRect: () => ({ top: 500, height: 200 }),
      } as unknown as HTMLElement;

      const charA = { style: { opacity: '0.4' } } as unknown as HTMLElement;
      const charB = { style: { opacity: '0.7' } } as unknown as HTMLElement;

      const solver = new TextRevealSolver(container, [charA, charB]);
      solver.measure();
      solver.update(500, 1000);
      solver.render();

      solver.destroy();

      expect(charA.style.opacity).toBe('0.4');
      expect(charB.style.opacity).toBe('0.7');
    });
  });

  describe('M-07: Reveal once Fast-Path Lifecycle & Cleanup', () => {
    it('retains entry for already-past elements and restores styles on unobserve', () => {
      const revealManager = GlobalRevealObserver.get();

      const element = {
        style: {
          opacity: '0.3',
          transition: 'color 0.2s',
          willChange: 'auto',
          transform: '',
        },
        getBoundingClientRect: () => ({ top: -500, bottom: -100, height: 400 }),
      } as unknown as HTMLElement;

      // Element is above viewport (rect.bottom < 0), once: true
      revealManager.observe(element, { once: true });

      // Fast path triggers revealed state instantly
      expect(element.style.opacity).toBe('1');
      expect(element.style.transform).toContain('translate3d(0, 0, 0)');

      // Calling unobserve() MUST find the entry and restore initial styles
      revealManager.unobserve(element);

      expect(element.style.opacity).toBe('0.3');
      expect(element.style.transition).toBe('color 0.2s');
      expect(element.style.willChange).toBe('auto');
      expect(element.style.transform).toBe('');
    });
  });

  describe('M-08: Container-Aware HorizontalScroll, StackedCards offsetTop & TextReveal Reading Zone', () => {
    it('uses innerContainer.parentElement.clientWidth to prevent slide cut off in bounded containers', () => {
      // Container width is 1200px (e.g. max-w-7xl), window is 1920px wide
      mockWindow.innerWidth = 1920;

      const element = {
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 0, height: 3000 }),
      } as unknown as HTMLElement;

      const parentWrapper = {
        clientWidth: 1200,
      };

      const innerContainer = {
        style: {} as Record<string, string>,
        scrollWidth: 3500,
        parentElement: parentWrapper,
      } as unknown as HTMLElement;

      const solver = new HorizontalScrollSolver(element, innerContainer, { driver: 'js' });
      solver.measure();

      // At scroll completion (scrollY = 2000), offset must travel:
      // -(3500 - 1200) = -2300px.
      // (If it incorrectly used window.innerWidth=1920, it would be -(3500 - 1920) = -1580px, under-translating by 720px!)
      const state = solver.update(2000);
      expect(state.progress).toBe(1);
      expect(state.offset).toBeCloseTo(-2300, 2);
    });

    it('computes StackedCards pinStartY accurately using card offsetTop in DOM layout', () => {
      const container = {
        offsetHeight: 3000,
        getBoundingClientRect: () => ({ top: 500, height: 3000 }),
      } as unknown as HTMLElement;

      const card0 = {
        offsetHeight: 300,
        offsetTop: 0,
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 500, height: 300 }),
      } as unknown as HTMLElement;

      const card1 = {
        offsetHeight: 300,
        offsetTop: 700, // 300px card0 + 400px spacer
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 1200, height: 300 }),
      } as unknown as HTMLElement;

      const solver = new StackedCardsSolver(container, [card0, card1], {
        top: 100,
        offset: 40,
        cardDistance: 400,
      });

      solver.measure();
      const states = solver.getCardsState();
      expect(states).toHaveLength(2);

      // Scroll to 1060px: Card 1 pins on Card 0
      solver.update(1060);
      solver.render();

      expect(card0.style.pointerEvents).toBe('none');
      expect(card1.style.pointerEvents).toBe('auto');

      solver.destroy();
    });

    it('keeps characters pristine at taskbar (viewport bottom) and reveals within reading zone', () => {
      mockWindow.innerHeight = 1000;

      const container = {
        getBoundingClientRect: () => ({ top: 1000 }), // exactly at bottom boundary
      } as unknown as HTMLElement;

      const char = {
        style: { opacity: '' },
      } as unknown as HTMLElement;

      const solver = new TextRevealSolver(container, [char], {
        baseOpacity: 0.1,
        triggerStart: 0.80,
        triggerEnd: 0.25,
      });

      solver.measure();

      // At scrollY = 0: container is at viewportTop = 1000 (at bottom taskbar edge)
      // Since triggerStart is 0.80 (800px), progress must be 0!
      solver.update(0, 1000);
      solver.render();

      expect(char.style.opacity).toBe('0.1');

      // Scroll so container is well inside viewport (viewportTop = 525px, halfway between 800 and 250)
      solver.update(475, 1000);
      solver.render();

      expect(Number(char.style.opacity)).toBeGreaterThan(0.1);
      expect(Number(char.style.opacity)).toBeLessThan(1.0);

      solver.destroy();
    });
  });
});

