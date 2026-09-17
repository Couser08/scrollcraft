/**
 * High-Performance Inertia Physics Engine for ScrollCraft
 * Adapts Lenis normalization into ScrollCraft's 3-phase Ticker and observable architecture.
 * Strictly under 650 LOC.
 */

import Lenis from 'lenis';
import { ticker } from './ticker';
import { InertiaConfig, ScrollMetrics, LenisScrollEvent, SpringConfig, SpringState } from './types';
import { inputNormalizer } from './input-normalizer';
import { motionStore } from './motion-preference';
import { snapToDevicePixel, springStep } from './math';

export class InertiaEngine {
  private lenis: Lenis | null = null;
  private config: InertiaConfig;
  private metrics: ScrollMetrics = {
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
    current: 0,
    target: 0,
    maxScroll: 0,
  };

  private subscribers: Set<(metrics: ScrollMetrics) => void> = new Set();
  private isInitialized: boolean = false;
  private taskId: string = `lenis-ticker-${Math.random().toString(36).slice(2, 8)}`;
  private prevScrollRestoration: string | null = null;
  private unsubMotion: (() => void) | null = null;
  private nativeScrollBound: boolean = false;

  private springVelocity: number = 0;
  private springStepState: SpringState = { position: 0, velocity: 0, settled: true };
  private springConfig: SpringConfig | null = null;

  private onWheel = (e: WheelEvent): void => {
    inputNormalizer.analyzeWheelEvent(e);
  };

  private onNativeScroll = (): void => {
    this.syncInitialMetrics();
    this.notify();
  };

  constructor(config?: InertiaConfig) {
    let lerp = config?.lerp;
    let duration = config?.duration;
    let easing = config?.easing;

    if (config?.preset === 'cinematic') {
      duration = duration ?? 1.1;
      easing = easing ?? ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)));
      lerp = undefined;
    } else if (config?.preset === 'snappy') {
      lerp = lerp ?? 0.16;
      duration = undefined;
      easing = undefined;
    } else {
      // Natural / custom mode
      if (!duration && lerp === undefined) {
        lerp = 0.1;
      }
    }

    const resolvedWheelMultiplier =
      config?.wheelMultiplier === 'auto' || config?.wheelMultiplier === undefined
        ? inputNormalizer.getRecommendedMultiplier()
        : config.wheelMultiplier;

    this.config = {
      preset: config?.preset,
      lerp,
      duration,
      easing,
      smoothWheel: config?.smoothWheel ?? true,
      syncTouch: config?.syncTouch ?? false,
      autoResize: config?.autoResize ?? true,
      wheelMultiplier: resolvedWheelMultiplier,
      touchMultiplier: config?.touchMultiplier ?? 1,
      overscroll: config?.overscroll ?? true,
      respectReducedMotion: config?.respectReducedMotion ?? true,
      physicsMode: config?.physicsMode ?? 'lerp',
      spring: config?.spring,
      fpsAware: config?.fpsAware ?? true,
      subpixelSnap: config?.subpixelSnap ?? true,
    };

    if (this.config.physicsMode === 'spring') {
      this.springConfig = {
        stiffness: config?.spring?.stiffness ?? 120,
        damping: config?.spring?.damping ?? 14,
        mass: config?.spring?.mass ?? 1,
        precision: config?.spring?.precision ?? 0.1,
      };
    }
  }

  public init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Passive wheel listener for hardware input classification
    window.addEventListener('wheel', this.onWheel, { passive: true });

    // Populate initial metrics from DOM
    this.syncInitialMetrics();

    // WCAG 2.1 AAA Accessibility: disable smooth inertia when prefers-reduced-motion is active
    if (this.config.respectReducedMotion && motionStore.isReduced()) {
      if (!this.nativeScrollBound) {
        window.addEventListener('scroll', this.onNativeScroll, { passive: true });
        this.nativeScrollBound = true;
      }

      this.unsubMotion = motionStore.subscribe((isReduced) => {
        if (!isReduced) {
          this.destroy();
          this.init();
        }
      });
      return;
    }

    // Prevent browser native scrollRestoration from fighting Lenis & router transitions
    if (typeof window !== 'undefined' && window.history && 'scrollRestoration' in window.history) {
      this.prevScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
    }

    // Instantiate Lenis with normalized cross-browser settings and input profiling
    this.lenis = new Lenis({
      lerp: this.config.lerp,
      duration: this.config.duration,
      easing: this.config.easing,
      smoothWheel: this.config.smoothWheel,
      syncTouch: this.config.syncTouch,
      autoResize: this.config.autoResize,
      wheelMultiplier: this.config.wheelMultiplier as number,
      touchMultiplier: this.config.touchMultiplier,
      overscroll: this.config.overscroll,
    });

    // Hook scroll listener to sync metrics & notify external subscribers
    this.lenis.on('scroll', this.onLenisScroll);

    // Drive Lenis tick through ScrollCraft's global 4-phase Ticker (driver phase executes FIRST)
    ticker.add(this.taskId, 'driver', (dt, _el, currentTime) => {
      if (!this.lenis) return;

      // 120Hz-aware exponential smoothing: adapt lerp factor to actual dt
      if (this.config.fpsAware && this.config.lerp !== undefined && dt > 0) {
        const adjustedLerp = 1 - Math.pow(1 - this.config.lerp, (dt / 1000) * 60);
        (this.lenis as any).options.lerp = adjustedLerp;
      }

      // Optional spring mode simulation
      if (this.config.physicsMode === 'spring' && this.springConfig) {
        const target = (this.lenis as any).targetScroll ?? this.metrics.target ?? this.metrics.scroll;
        this.springStepState = springStep(
          this.metrics.scroll,
          target,
          this.springVelocity,
          this.springConfig,
          dt / 1000,
          this.springStepState
        );
        this.springVelocity = this.springStepState.velocity;
        if (!this.springStepState.settled) {
          this.lenis.scrollTo(this.springStepState.position, { immediate: true });
        }
      } else {
        // Use exact RAF timestamp to prevent micro-stutters
        this.lenis.raf(currentTime);
      }
    });

    // Subscribe to motion preference changes to halt Lenis if reduced motion is enabled at runtime
    this.unsubMotion = motionStore.subscribe((isReduced) => {
      if (isReduced && this.config.respectReducedMotion) {
        this.destroy();
        this.init();
      }
    });
  }

  public destroy(): void {
    if (typeof window === 'undefined' || !this.isInitialized) return;
    this.isInitialized = false;

    window.removeEventListener('wheel', this.onWheel);

    if (this.nativeScrollBound) {
      window.removeEventListener('scroll', this.onNativeScroll);
      this.nativeScrollBound = false;
    }

    if (this.unsubMotion) {
      this.unsubMotion();
      this.unsubMotion = null;
    }

    ticker.remove(this.taskId);

    if (this.lenis) {
      this.lenis.off('scroll', this.onLenisScroll);
      this.lenis.destroy();
      this.lenis = null;
    }

    if (typeof window !== 'undefined' && window.history && 'scrollRestoration' in window.history && this.prevScrollRestoration) {
      window.history.scrollRestoration = this.prevScrollRestoration as ScrollRestoration;
      this.prevScrollRestoration = null;
    }

    this.subscribers.clear();
  }

  public subscribe(callback: (metrics: ScrollMetrics) => void): () => void {
    this.subscribers.add(callback);
    try {
      callback(this.metrics);
    } catch (err) {
      if (typeof console !== 'undefined') {
        console.error('[ScrollCraft] Error in initial Inertia subscriber callback:', err);
      }
    }
    return () => this.subscribers.delete(callback);
  }

  public getMetrics(): ScrollMetrics {
    return this.metrics;
  }

  public getLenis(): Lenis | null {
    return this.lenis;
  }

  public scrollTo(
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
    }
  ): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      const top = typeof target === 'number' ? target : 0;
      window.scrollTo({
        top,
        behavior: options?.immediate ? 'auto' : 'smooth',
      });
    }
  }

  public resize(): void {
    if (this.lenis) {
      this.lenis.resize();
    }
  }

  public stop(): void {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  public start(): void {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  private syncInitialMetrics(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    this.metrics = {
      scroll: scrollY,
      limit: maxScroll,
      velocity: 0,
      direction: 0,
      progress,
      current: scrollY,
      target: scrollY,
      maxScroll,
    };
  }

  private onLenisScroll = (e: LenisScrollEvent): void => {
    let scroll = e.scroll ?? (typeof window !== 'undefined' ? window.scrollY : 0);
    if (this.config.subpixelSnap) {
      scroll = snapToDevicePixel(scroll);
    }
    const limit = e.limit ?? Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const velocity = e.velocity ?? 0;
    const direction = (e.direction ?? (velocity > 0 ? 1 : velocity < 0 ? -1 : 0)) as 1 | -1 | 0;
    const progress = e.progress ?? (limit > 0 ? scroll / limit : 0);

    this.metrics.scroll = scroll;
    this.metrics.limit = limit;
    this.metrics.velocity = velocity;
    this.metrics.direction = direction;
    this.metrics.progress = progress;
    this.metrics.current = scroll;
    this.metrics.target = e.targetScroll ?? scroll;
    this.metrics.maxScroll = limit;

    // this.updatePerformanceAttributes(Math.abs(velocity));
    this.notify();
  };



  private notify(): void {
    for (const sub of this.subscribers) {
      try {
        sub(this.metrics);
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.error('[ScrollCraft] Error in Inertia subscriber:', err);
        }
      }
    }
  }
}
