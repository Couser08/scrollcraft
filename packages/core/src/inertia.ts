/**
 * High-Performance Inertia Physics Engine for ScrollCraft
 * Adapts Lenis normalization into ScrollCraft's 3-phase Ticker and observable architecture.
 * Strictly under 650 LOC.
 */

import Lenis from 'lenis';
import { ticker } from './ticker';
import { InertiaConfig, ScrollMetrics, LenisScrollEvent } from './types';

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

  constructor(config?: InertiaConfig) {
    this.config = {
      lerp: config?.lerp ?? 0.1,
      duration: config?.duration,
      easing: config?.easing,
      smoothWheel: config?.smoothWheel ?? true,
      syncTouch: config?.syncTouch ?? false,
      autoResize: config?.autoResize ?? true,
    };
  }

  public init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Instantiate Lenis with normalized cross-browser settings
    this.lenis = new Lenis({
      lerp: this.config.lerp,
      duration: this.config.duration,
      easing: this.config.easing,
      smoothWheel: this.config.smoothWheel,
      syncTouch: this.config.syncTouch,
      autoResize: this.config.autoResize,
    });

    // Populate initial metrics from DOM
    this.syncInitialMetrics();

    // Hook scroll listener to sync metrics & notify external subscribers
    this.lenis.on('scroll', this.onLenisScroll);

    // Drive Lenis tick through ScrollCraft's global 3-phase Ticker (update phase)
    ticker.add(this.taskId, 'update', () => {
      if (this.lenis) {
        this.lenis.raf(performance.now());
      }
    });
  }

  public destroy(): void {
    if (typeof window === 'undefined' || !this.isInitialized) return;
    this.isInitialized = false;

    ticker.remove(this.taskId);

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    this.subscribers.clear();
  }

  public subscribe(callback: (metrics: ScrollMetrics) => void): () => void {
    this.subscribers.add(callback);
    callback(this.metrics);
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
    const scroll = e.scroll ?? window.scrollY ?? 0;
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

    this.notify();
  };

  private notify(): void {
    for (const sub of this.subscribers) {
      sub(this.metrics);
    }
  }
}
