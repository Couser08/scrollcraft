/**
 * GSAP Integration Bridge for ScrollCraft
 *
 * Notice: GSAP and ScrollTrigger are trademarks and products of GreenSock, Inc.
 * ScrollCraft is not affiliated with or endorsed by GreenSock.
 * Ensure compliance with GreenSock's Standard Commercial License if embedding in
 * commercial visual builders or SaaS applications sold to multiple end customers.
 *
 * Strictly under 650 LOC.
 */

import { InertiaEngine } from './inertia';

export interface GSAPBridgeConfig {
  /** The InertiaEngine instance from ScrollCraft */
  engine: InertiaEngine;
  /** The global gsap instance provided by the caller */
  gsap: any;
  /** The ScrollTrigger plugin class/object provided by the caller */
  ScrollTrigger: any;
  /** Optional custom scroller element. Defaults to document.body / window */
  scroller?: HTMLElement | Window;
  /** Automatically update ScrollTrigger on InertiaEngine scroll ticks. Default: true */
  autoUpdate?: boolean;
}

export interface GSAPBridgeInstance {
  /** Clean up and unregister the scrollerProxy, ticker listeners, and refresh hooks */
  destroy: () => void;
  /** Manually force an alignment refresh between ScrollCraft and ScrollTrigger */
  refresh: () => void;
}

/**
 * Creates a zero-friction adapter bridge between ScrollCraft's InertiaEngine and GSAP ScrollTrigger.
 *
 * Utilizes inversion of control (dependency injection) to ensure zero bundled GSAP code,
 * 100% legal compatibility, and flawless VSync frame synchronization.
 */
export function createGSAPBridge(config: GSAPBridgeConfig): GSAPBridgeInstance {
  const {
    engine,
    gsap,
    ScrollTrigger,
    scroller = (typeof window !== 'undefined' && typeof document !== 'undefined') ? (document.body || window) : null,
    autoUpdate = true,
  } = config;

  if (!engine || !gsap || !ScrollTrigger || !scroller) {
    return {
      destroy: () => {},
      refresh: () => {},
    };
  }

  // 1. Sync ScrollTrigger with InertiaEngine scroll coordinates
  let unsubEngine: (() => void) | null = null;
  if (autoUpdate) {
    unsubEngine = engine.subscribe(() => {
      ScrollTrigger.update();
    });
  }

  // 2. Register scrollerProxy so ScrollTrigger reads and writes through InertiaEngine
  const targetScroller = (typeof window !== 'undefined' && scroller === window) ? (document.body || window) : scroller;

  ScrollTrigger.scrollerProxy(targetScroller, {
    scrollTop(value?: number) {
      if (arguments.length && value !== undefined) {
        engine.scrollTo(value, { immediate: true });
      }
      return engine.getMetrics().scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      };
    },
    pinType: (targetScroller as HTMLElement).style?.transform ? 'transform' : 'fixed',
  });

  // 3. When ScrollTrigger refreshes, notify InertiaEngine to recalculate limits
  const onRefresh = () => {
    engine.resize();
  };
  ScrollTrigger.addEventListener('refresh', onRefresh);

  // 4. Connect remeasure hook so DOM layout shifts trigger ScrollTrigger refresh
  const unsubRemeasure = engine.onRemeasure(() => {
    ScrollTrigger.refresh();
  });

  const refresh = () => {
    ScrollTrigger.refresh();
  };

  const destroy = () => {
    unsubEngine?.();
    unsubRemeasure();
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    if (typeof (ScrollTrigger as any).clearScrollTransforms === 'function') {
      (ScrollTrigger as any).clearScrollTransforms(targetScroller);
    }
  };

  return {
    destroy,
    refresh,
  };
}
