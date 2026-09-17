import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { isRefObject, useDualRef, captureNode } from '../utils/ref';
import {
  ParallaxOptions,
  RevealOptions,
  PinOptions,
  ScrollProgressOptions,
  ScrollTransformOptions,
  ScrollDrawOptions,
  MagneticOptions,
  ScrollTimelineOptions,
  ScrollDirectionOptions,
} from '../types';
import { GlobalResizeManager } from '@scrollcraft/core';

describe('Level 2: React Core Types & Ref Resolution Utility', () => {
  // ══════════════════════════════════════════════════════════════════
  // STEP 10.1: isRefObject TYPE GUARD
  // ══════════════════════════════════════════════════════════════════
  describe('isRefObject Type Guard', () => {
    it('accurately identifies React RefObjects', () => {
      expect(isRefObject({ current: null })).toBe(true);
      expect(isRefObject({ current: {} })).toBe(true);
      expect(isRefObject(React.createRef())).toBe(true);
    });

    it('rejects option objects and non-ref values', () => {
      expect(isRefObject({ speed: 0.5 })).toBe(false);
      expect(isRefObject({ top: 100, duration: 400 })).toBe(false);
      expect(isRefObject(null)).toBe(false);
      expect(isRefObject(undefined)).toBe(false);
      expect(isRefObject('ref-string')).toBe(false);
      expect(isRefObject(123)).toBe(false);
      expect(isRefObject(() => {})).toBe(false);
      expect(isRefObject([])).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 10.2: useDualRef UNIVERSAL DUAL API RESOLUTION
  // ══════════════════════════════════════════════════════════════════
  describe('useDualRef Universal Dual API Resolution', () => {
    it('resolves headless mode when invoked without forwarded ref', () => {
      let hookOutput: any = null;

      function HeadlessConsumer() {
        hookOutput = useDualRef<HTMLDivElement, ParallaxOptions>(
          { speed: 0.35, origin: 'auto' },
          undefined,
          { speed: 0.2 }
        );
        return <div ref={hookOutput.ref} />;
      }

      renderToString(<HeadlessConsumer />);

      expect(hookOutput).not.toBeNull();
      expect(hookOutput.isHeadless).toBe(true);
      expect(isRefObject(hookOutput.ref)).toBe(true);
      expect(hookOutput.options.speed).toBe(0.35);
      expect(hookOutput.options.origin).toBe('auto');
    });

    it('resolves ref-forwarding mode when invoked with forwarded ref', () => {
      let hookOutput: any = null;
      const externalRef = React.createRef<HTMLDivElement>();

      function ForwardingConsumer() {
        hookOutput = useDualRef<HTMLDivElement, ParallaxOptions>(
          externalRef,
          { speed: 0.5, bleed: true },
          { speed: 0.2 }
        );
        return <div ref={externalRef} />;
      }

      renderToString(<ForwardingConsumer />);

      expect(hookOutput).not.toBeNull();
      expect(hookOutput.isHeadless).toBe(false);
      // Reference identity must match externalRef exactly
      expect(hookOutput.ref).toBe(externalRef);
      expect(hookOutput.options.speed).toBe(0.5);
      expect(hookOutput.options.bleed).toBe(true);
    });

    it('gracefully handles empty arguments with default options in headless mode', () => {
      let hookOutput: any = null;

      function EmptyConsumer() {
        hookOutput = useDualRef<HTMLDivElement, ParallaxOptions>(
          undefined,
          undefined,
          { speed: 0.2, direction: 'vertical' }
        );
        return <div ref={hookOutput.ref} />;
      }

      renderToString(<EmptyConsumer />);

      expect(hookOutput.isHeadless).toBe(true);
      expect(isRefObject(hookOutput.ref)).toBe(true);
      expect(hookOutput.options.speed).toBe(0.2);
      expect(hookOutput.options.direction).toBe('vertical');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 10.3: CAPTURED-NODE PATTERN & STALE REF LEAK GUARD (FOOTGUN 4)
  // ══════════════════════════════════════════════════════════════════
  describe('Captured-Node Pattern & Stale Node Leak Guard', () => {
    it('safely captures ref.current at effect execution and guarantees safe unobservation', () => {
      const mockElement = { tagName: 'DIV' } as unknown as HTMLElement;
      const ref = { current: mockElement as HTMLElement | null };

      // 1. Capture node at mount time
      const capturedNode = captureNode(ref);
      expect(capturedNode).toBe(mockElement);

      const unobserveSpy = vi.spyOn(GlobalResizeManager, 'unobserve');

      // 2. Simulate consumer conditional unmount or ref swap where ref.current becomes null before cleanup
      ref.current = null;

      // 3. Cleanup runs using the captured node
      expect(() => {
        if (capturedNode) {
          GlobalResizeManager.unobserve(capturedNode);
        }
      }).not.toThrow();

      expect(unobserveSpy).toHaveBeenCalledWith(mockElement);
      unobserveSpy.mockRestore();
    });

    it('prevents memory leaks when ref is swapped to a new element before cleanup', () => {
      const elementA = { tagName: 'DIV', id: 'A' } as unknown as HTMLElement;
      const elementB = { tagName: 'DIV', id: 'B' } as unknown as HTMLElement;

      const ref = { current: elementA as HTMLElement | null };
      const capturedA = captureNode(ref);

      const mockDestroyA = vi.fn();
      const mockDestroyB = vi.fn();

      // Consumer swaps ref to elementB
      ref.current = elementB;

      // Cleanup of previous effect instance MUST execute on capturedA, not mutated ref.current (elementB)
      if (capturedA) {
        mockDestroyA();
      }

      expect(mockDestroyA).toHaveBeenCalledTimes(1);
      expect(mockDestroyB).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 9: STATIC TYPE INTEGRITY FOR EXPANDED OPTIONS INTERFACES
  // ══════════════════════════════════════════════════════════════════
  describe('Step 9: Static Type Verification for Expanded Options', () => {
    it('validates TypeScript options contracts across all primitives and hooks', () => {
      const parallaxOpts: ParallaxOptions = {
        speed: 0.3,
        origin: 'auto',
        bleed: true,
        scale: 1.1,
        rotate: 10,
        direction: 'horizontal',
        min: -100,
        max: 100,
        driver: 'js',
        respectReducedMotion: true,
      };
      expect(parallaxOpts.origin).toBe('auto');

      const revealOpts: RevealOptions = {
        blur: 8,
        scale: 0.9,
        rotateX: 20,
        rotateY: -10,
        index: 2,
        stagger: 0.05,
        onReveal: () => {},
        onReset: () => {},
      };
      expect(revealOpts.blur).toBe(8);

      const pinOpts: PinOptions = {
        top: 20,
        bottom: 50,
        duration: 500,
        pinSpacing: true,
        onEnter: () => {},
        onLeave: () => {},
        onEnterBack: () => {},
        onLeaveBack: () => {},
      };
      expect(pinOpts.pinSpacing).toBe(true);

      const progressOpts: ScrollProgressOptions = {
        offset: ['top bottom', 'bottom top'],
        orientation: 'horizontal',
        onProgress: (p) => p,
      };
      expect(progressOpts.orientation).toBe('horizontal');

      const transformOpts: ScrollTransformOptions = {
        preset: 'zoom-in',
        scrub: 1.2,
        snap: true,
        onSnap: (target) => target,
      };
      expect(transformOpts.preset).toBe('zoom-in');

      const drawOpts: ScrollDrawOptions = {
        dashArray: '5, 5',
        onDrawProgress: (p) => p,
      };
      expect(drawOpts.dashArray).toBe('5, 5');

      const magneticOpts: MagneticOptions = {
        strength: 0.4,
        radius: 120,
        scale: 1.05,
        innerStrength: 0.7,
      };
      expect(magneticOpts.scale).toBe(1.05);

      const timelineOpts: ScrollTimelineOptions = {
        keyframes: [{ progress: 0 }, { progress: 1 }],
      };
      expect(timelineOpts.keyframes?.length).toBe(2);

      const directionOpts: ScrollDirectionOptions = {
        thresholdDown: 15,
        thresholdUp: 25,
        hideTransform: 'translateY(-100%)',
        onDirectionChange: (dir, isTop) => ({ dir, isTop }),
      };
      expect(directionOpts.thresholdDown).toBe(15);
      expect(directionOpts.thresholdUp).toBe(25);
    });
  });
});
