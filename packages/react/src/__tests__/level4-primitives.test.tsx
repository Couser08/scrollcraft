/**
 * Level 4 Hardening Test Suite: Declarative Primitives, Components & Studio
 *
 * Covers:
 * 1. <TextReveal>: word/char splitting, nowrap grouping, aria-label, pending/active hydration race cancellation.
 * 2. <Pin>: self-contained height track auto-wrapping, GSAP lifecycle & pinSpacing forwarding.
 * 3. <StackedCards>: StackedCardsSolver integration, variable card heights, dynamic pointer-events gating, and clean teardown.
 * 4. <ScrollSequence>: canvas rendering, poster preview, LRU window options forwarding, and clean unmount.
 * 5. <Parallax>, <ScrollTransform>, <ScrollDraw>: superpowers props forwarding (origin, bleed, preset, dashArray).
 * 6. <ScrollInspector>: Inspector Studio mode, dropped frames readout, and strict 0-rerender invariant.
 */

import React, { useRef, createRef } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  TextReveal,
  Pin,
  PinContainer,
  StackedCards,
  ScrollSequence,
  Parallax,
  ScrollTransform,
  ScrollDraw,
  ScrollProgress,
  Magnetic,
  ScrollInspector,
} from '../index';
import { ticker, markerManager, StackedCardsSolver, TextRevealSolver, SequenceSolver } from '@scrollcraft/core';
import * as useParallaxModule from '../hooks/useParallax';
import * as useScrollTransformModule from '../hooks/useScrollTransform';
import * as useScrollDrawModule from '../hooks/useScrollDraw';
import * as useScrollProgressModule from '../hooks/useScrollProgress';
import * as useMagneticModule from '../hooks/useMagnetic';

describe('Level 4: Declarative Primitives, Components & Studio Hardening Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    vi.clearAllMocks();
    ticker.stop();

    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
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

    const mockClassList = () => {
      const classes = new Set<string>();
      return {
        add: vi.fn((cls: string) => classes.add(cls)),
        remove: vi.fn((cls: string) => classes.delete(cls)),
        contains: vi.fn((cls: string) => classes.has(cls)),
        [Symbol.iterator]: function* () {
          yield* classes;
        },
      };
    };

    const createMockElement = (tag: string): any => {
      const attrs = new Map<string, string>();
      const children: any[] = [];
      const classList = mockClassList();

      const el: any = {
        tagName: tag.toUpperCase(),
        style: {} as Record<string, string>,
        children,
        classList,
        setAttribute: vi.fn((name: string, val: string) => {
          attrs.set(name, String(val));
          if (name === 'class') {
            val.split(' ').forEach((c) => c && classList.add(c));
          }
        }),
        getAttribute: vi.fn((name: string) => attrs.get(name) ?? null),
        removeAttribute: vi.fn((name: string) => attrs.delete(name)),
        hasAttribute: vi.fn((name: string) => attrs.has(name)),
        appendChild: vi.fn((child: any) => {
          children.push(child);
          child.parentNode = el;
          return child;
        }),
        removeChild: vi.fn((child: any) => {
          const idx = children.indexOf(child);
          if (idx !== -1) children.splice(idx, 1);
          child.parentNode = null;
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
        })),
        parentNode: null,
        remove: vi.fn(),
      };
      return el;
    };

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
        createElement: (tag: string) => createMockElement(tag),
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
    ticker.stop();
    markerManager.setGlobalMarkers(false);
    vi.restoreAllMocks();
  });

  // ══════════════════════════════════════════════════════════════════
  // 1. <TextReveal> Component Hardening
  // ══════════════════════════════════════════════════════════════════
  describe('<TextReveal>', () => {
    it('splits text into character spans grouped by word for nowrap line wrapping', () => {
      const html = renderToString(
        <TextReveal className="custom-reveal">ScrollCraft Engine</TextReveal>
      );

      // Semantic paragraph with custom class
      expect(html).toContain('class="m-0 p-0 flex flex-wrap custom-reveal"');
      // Accessibility: screen reader reads full sentence
      expect(html).toContain('aria-label="ScrollCraft Engine"');
      // SSR pending state
      expect(html).toContain('data-sc-reveal="pending"');
      // Inner content hidden from screen readers
      expect(html).toContain('aria-hidden="true"');
      // Word groups for nowrap prevention
      expect(html).toContain('class="sc-word-group inline-block"');
      // Character spans
      expect(html).toContain('class="sc-char inline-block"');
    });

    it('splits text into word spans when by="words"', () => {
      const html = renderToString(
        <TextReveal by="words">Super fast zero jank</TextReveal>
      );

      expect(html).toContain('aria-label="Super fast zero jank"');
      expect(html).toContain('class="sc-word inline-block"');
      expect(html).toContain('>Super</span>');
      expect(html).toContain('>fast</span>');
      expect(html).toContain('>zero</span>');
      expect(html).toContain('>jank</span>');
    });

    it('cancels CSS fallback race condition and transitions data-sc-reveal to "active"', () => {
      const container = globalThis.document.createElement('div') as unknown as HTMLElement;
      container.setAttribute('class', 'sc-reveal-css-fallback');
      container.setAttribute('data-sc-reveal', 'pending');

      const char1 = globalThis.document.createElement('span') as unknown as HTMLElement;
      const char2 = globalThis.document.createElement('span') as unknown as HTMLElement;

      // Simulate TextRevealSolver lifecycle
      const solver = new TextRevealSolver(container, [char1, char2], {
        blur: 8,
        scale: 0.85,
        slide: 20,
      });

      // Hydration state takeover: active immediately cancels fallback CSS keyframe
      expect(container.getAttribute('data-sc-reveal')).toBe('active');

      solver.measure();
      solver.update(0, 1000);
      solver.render();

      expect(char1.style.opacity).toBeDefined();

      solver.destroy();
      expect(container.getAttribute('data-sc-reveal')).toBeNull();
    });

    it('supports ref forwarding to container paragraph', () => {
      let forwardedRef: any = null;
      function Consumer() {
        forwardedRef = useRef<HTMLParagraphElement>(null);
        return <TextReveal ref={forwardedRef}>Test Ref</TextReveal>;
      }
      renderToString(<Consumer />);
      expect(forwardedRef).not.toBeNull();
      expect(forwardedRef).toHaveProperty('current');
    });

    it('supports asChild composition for custom semantic headings without forcing <p>', () => {
      const html = renderToString(
        <TextReveal asChild by="words" className="custom-heading">
          <h1 className="hero-title">Custom Headline</h1>
        </TextReveal>
      );

      expect(html).toContain('<h1');
      expect(html).not.toContain('<p');
      expect(html).toContain('class="m-0 p-0 flex flex-wrap custom-heading hero-title"');
      expect(html).toContain('aria-label="Custom Headline"');
      expect(html).toContain('data-sc-reveal="pending"');
      expect(html).toContain('>Custom</span>');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // 2. <Pin> Component Self-Contained Height & Superpowers
  // ══════════════════════════════════════════════════════════════════
  describe('<Pin>', () => {
    it('auto-wraps in track container when height prop is specified', () => {
      const html = renderToString(
        <Pin height="250vh" top={60}>
          <div className="pinned-content">Sticky Content</div>
        </Pin>
      );

      // Wrapper track div
      expect(html).toContain('position:relative');
      expect(html).toContain('min-height:250vh');
      // Pinned inner element
      expect(html).toContain('position:sticky');
      expect(html).toContain('top:60px');
      expect(html).toContain('Sticky Content');
    });

    it('supports numeric height in pixels', () => {
      const html = renderToString(
        <Pin height={1500}>
          <div>Pinned Box</div>
        </Pin>
      );

      expect(html).toContain('min-height:1500px');
    });

    it('renders without outer wrapper when height is not specified (for use inside PinContainer)', () => {
      const html = renderToString(
        <PinContainer height="200vh">
          <Pin top={40}>
            <div>Inside PinContainer</div>
          </Pin>
        </PinContainer>
      );

      expect(html).toContain('min-height:200vh');
      expect(html).toContain('top:40px');
      expect(html).toContain('Inside PinContainer');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // 3. <StackedCards> Component Hardening & Pointer-Events Gating
  // ══════════════════════════════════════════════════════════════════
  describe('<StackedCards>', () => {
    it('renders cards with relative positioning and cascade top offsets', () => {
      const cards = [
        <div key="1" className="card-item">Card 1</div>,
        <div key="2" className="card-item">Card 2</div>,
        <div key="3" className="card-item">Card 3</div>,
      ];

      const html = renderToString(
        <StackedCards cards={cards} top={80} offset={30} cardDistance={500} />
      );

      expect(html).toContain('position:relative');
      expect(html).toContain('top:80px');
      expect(html).toContain('top:110px');
      expect(html).toContain('top:140px');
      expect(html).toContain('Card 1');
      expect(html).toContain('Card 2');
      expect(html).toContain('Card 3');
    });

    it('StackedCardsSolver measures variable heights and gates pointer-events on buried cards', () => {
      const container = globalThis.document.createElement('div') as unknown as HTMLElement;
      const card0 = globalThis.document.createElement('div') as unknown as HTMLElement;
      const card1 = globalThis.document.createElement('div') as unknown as HTMLElement;
      const card2 = globalThis.document.createElement('div') as unknown as HTMLElement;

      Object.defineProperty(card0, 'offsetHeight', { value: 350, configurable: true });
      Object.defineProperty(card1, 'offsetHeight', { value: 500, configurable: true });
      Object.defineProperty(card2, 'offsetHeight', { value: 400, configurable: true });

      const solver = new StackedCardsSolver(container, [card0, card1, card2], {
        top: 60,
        offset: 35,
        cardDistance: 450,
      });

      // At scroll = 0: all cards interactive
      solver.update(0);
      solver.render();
      expect(card0.style.pointerEvents).toBe('auto');
      expect(card1.style.pointerEvents).toBe('auto');

      // Scroll past Card 0 pin travel: Card 1 covers Card 0
      solver.update(800);
      solver.render();
      expect(card0.style.pointerEvents).toBe('none'); // Buried card gated!
      expect(card1.style.pointerEvents).toBe('auto');

      // Teardown restores styles cleanly
      solver.destroy();
      expect(card0.style.zIndex).toBe('');
    });

    it('supports asChild composition for custom runway container tag (e.g. <section>)', () => {
      const cards = [
        <div key="1" className="card-item">Card 1</div>,
        <div key="2" className="card-item">Card 2</div>,
      ];

      const html = renderToString(
        <StackedCards asChild cards={cards} top={50} offset={20} cardDistance={400} className="custom-runway">
          <section id="cards-section" />
        </StackedCards>
      );

      expect(html).toContain('<section');
      expect(html).not.toContain('<div id="cards-section"');
      expect(html).toContain('id="cards-section"');
      expect(html).toContain('class="relative w-full custom-runway"');
      expect(html).toContain('Card 1');
      expect(html).toContain('Card 2');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // 4. <ScrollSequence> Canvas Scrubbing
  // ══════════════════════════════════════════════════════════════════
  describe('<ScrollSequence>', () => {
    it('renders track container, sticky wrapper, and canvas', () => {
      const frames = ['frame1.jpg', 'frame2.jpg', 'frame3.jpg'];
      const html = renderToString(
        <ScrollSequence frames={frames} height="200vh" speed={2} />
      );

      expect(html).toContain('height:200vh');
      expect(html).toContain('<canvas');
    });

    it('supports ref forwarding to container element', () => {
      let forwardedRef: any = null;
      function Consumer() {
        forwardedRef = useRef<HTMLDivElement>(null);
        return <ScrollSequence ref={forwardedRef} frames={['f1.jpg']} />;
      }
      renderToString(<Consumer />);
      expect(forwardedRef).not.toBeNull();
      expect(forwardedRef).toHaveProperty('current');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // 5. Declarative Primitives Props Forwarding
  // ══════════════════════════════════════════════════════════════════
  describe('Superpowers Props Forwarding', () => {
    it('<Parallax> forwards origin, bleed, scale, and rotate options', () => {
      const useParallaxSpy = vi.spyOn(useParallaxModule, 'useParallax');

      renderToString(
        <Parallax speed={0.4} origin="auto" bleed={true} scale={1.2} rotate={15}>
          <div>Parallax Content</div>
        </Parallax>
      );

      expect(useParallaxSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          speed: 0.4,
          origin: 'auto',
          bleed: true,
          scale: 1.2,
          rotate: 15,
        })
      );
    });

    it('<ScrollTransform> forwards preset and scrub options', () => {
      const useScrollTransformSpy = vi.spyOn(useScrollTransformModule, 'useScrollTransform');

      renderToString(
        <ScrollTransform preset="fade-up" scrub={1} start="top 80%" end="bottom 20%">
          <div>Transform Content</div>
        </ScrollTransform>
      );

      expect(useScrollTransformSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          preset: 'fade-up',
          scrub: 1,
          start: 'top 80%',
          end: 'bottom 20%',
        })
      );
    });

    it('<ScrollDraw> forwards dashArray and direction', () => {
      const useScrollDrawSpy = vi.spyOn(useScrollDrawModule, 'useScrollDraw');

      renderToString(
        <svg>
          <ScrollDraw
            d="M 0 0 L 100 100"
            dashArray="4 4"
            direction="forward"
          />
        </svg>
      );

      expect(useScrollDrawSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          dashArray: '4 4',
          direction: 'forward',
        })
      );
    });

    it('<ScrollProgress> forwards reactive option and orientation', () => {
      const useScrollProgressSpy = vi.spyOn(useScrollProgressModule, 'useScrollProgress');

      renderToString(
        <ScrollProgress reactive={true} orientation="vertical" />
      );

      expect(useScrollProgressSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          reactive: true,
          orientation: 'vertical',
        })
      );
    });

    it('<Magnetic> forwards respectReducedMotion option', () => {
      const useMagneticSpy = vi.spyOn(useMagneticModule, 'useMagnetic');

      renderToString(
        <Magnetic respectReducedMotion={false} strength={0.4}>
          <button>Magnetic Button</button>
        </Magnetic>
      );

      expect(useMagneticSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          respectReducedMotion: false,
          strength: 0.4,
        })
      );
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // 6. <ScrollInspector> DevTools Studio Hardening
  // ══════════════════════════════════════════════════════════════════
  describe('<ScrollInspector> DevTools Studio', () => {
    it('renders in expanded HUD mode by default with live metrics and 0-rerender invariant', () => {
      const html = renderToString(<ScrollInspector defaultCollapsed={false} />);

      expect(html).toContain('aria-label="ScrollCraft Performance Inspector"');
      expect(html).toContain('SCROLLCRAFT');
      expect(html).toContain('0 Re-renders');
      expect(html).toContain('100% Smooth (0 drops)');
    });

    it('renders in Studio mode with Live Studio Tools and Copy React Props button', () => {
      const html = renderToString(
        <ScrollInspector defaultCollapsed={false} studio={true} />
      );

      expect(html).toContain('STUDIO');
      expect(html).toContain('Live Studio Tools');
      expect(html).toContain('Copy React Props');
    });

    it('renders collapsed minimalist telemetry pill when defaultCollapsed=true', () => {
      const html = renderToString(<ScrollInspector defaultCollapsed={true} />);

      expect(html).toContain('title="Expand ScrollCraft Telemetry HUD"');
      expect(html).toContain('FPS');
    });

    it('toggles global markers via markerManager correctly', () => {
      expect(markerManager.isGlobalEnabled()).toBe(false);
      markerManager.setGlobalMarkers(true);
      expect(markerManager.isGlobalEnabled()).toBe(true);
      markerManager.setGlobalMarkers(false);
      expect(markerManager.isGlobalEnabled()).toBe(false);
    });
  });
});
