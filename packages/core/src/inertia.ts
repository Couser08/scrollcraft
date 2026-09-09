/**
 * Subpixel Inertia Physics Engine for ScrollCraft
 * Replaces external libraries (Lenis, Locomotive) with unified game-dev physics.
 * Strictly under 650 LOC.
 */

import { damp, clamp } from './math';
import { ticker } from './ticker';
import { InertiaConfig, ScrollMetrics } from './types';

export class InertiaEngine {
  private config: Required<InertiaConfig>;
  private metrics: ScrollMetrics = {
    current: 0,
    target: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
    maxScroll: 0,
  };

  private subscribers: Set<(metrics: ScrollMetrics) => void> = new Set();
  private isListening: boolean = false;
  private taskId: string = `inertia-${Math.random().toString(36).slice(2, 8)}`;

  constructor(config?: Partial<InertiaConfig>) {
    this.config = {
      damping: config?.damping ?? 0.08,
      mass: config?.mass ?? 1,
      maxVelocity: config?.maxVelocity ?? 160,
      restThreshold: config?.restThreshold ?? 0.05,
    };
  }

  public init(): void {
    if (typeof window === 'undefined' || this.isListening) return;
    this.isListening = true;

    this.updateMaxScroll();
    this.metrics.current = window.scrollY || window.pageYOffset;
    this.metrics.target = this.metrics.current;

    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('scroll', this.onNativeScroll, { passive: true });

    ticker.add(this.taskId, 'update', this.tick);
  }

  public destroy(): void {
    if (typeof window === 'undefined' || !this.isListening) return;
    this.isListening = false;

    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onNativeScroll);

    ticker.remove(this.taskId);
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

  public scrollTo(targetY: number, immediate: boolean = false): void {
    this.updateMaxScroll();
    const clampedTarget = clamp(targetY, 0, this.metrics.maxScroll);
    this.metrics.target = clampedTarget;

    if (immediate) {
      this.metrics.current = clampedTarget;
      window.scrollTo(0, clampedTarget);
      this.notify();
    }
  }

  private updateMaxScroll(): void {
    if (typeof document === 'undefined') return;
    this.metrics.maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  private onWheel = (e: WheelEvent): void => {
    // Let users use pinch-to-zoom or modifier keys normally
    if (e.ctrlKey || e.metaKey) return;

    this.updateMaxScroll();

    // Wheel normalization: handle line/page modes and trackpads
    let deltaY = e.deltaY;
    if (e.deltaMode === 1) deltaY *= 24; // Lines
    if (e.deltaMode === 2) deltaY *= window.innerHeight; // Pages

    // Clamp delta to prevent erratic jumps on hypersensitive mice
    deltaY = clamp(deltaY, -this.config.maxVelocity, this.config.maxVelocity);

    const nextTarget = clamp(this.metrics.target + deltaY, 0, this.metrics.maxScroll);

    if (nextTarget !== this.metrics.target) {
      e.preventDefault();
      this.metrics.target = nextTarget;
    }
  };

  private onNativeScroll = (): void => {
    // Sync target if native scroll occurs (e.g. hash anchor jumps, touch)
    const nativeY = window.scrollY || window.pageYOffset;
    if (Math.abs(nativeY - this.metrics.current) > 2) {
      this.metrics.target = nativeY;
    }
  };

  private onResize = (): void => {
    this.updateMaxScroll();
  };

  private tick = (dt: number): void => {
    const delta = this.metrics.target - this.metrics.current;

    // Settle check
    if (Math.abs(delta) < this.config.restThreshold) {
      if (this.metrics.current !== this.metrics.target) {
        this.metrics.current = this.metrics.target;
        window.scrollTo(0, this.metrics.current);
        this.notify();
      }
      this.metrics.velocity = 0;
      return;
    }

    const lambda = 12 * (this.config.damping / this.config.mass);
    const nextY = damp(this.metrics.current, this.metrics.target, lambda, dt);
    const instantaneousVelocity = (nextY - this.metrics.current) / dt;

    this.metrics.direction = nextY > this.metrics.current ? 1 : nextY < this.metrics.current ? -1 : 0;
    this.metrics.velocity = instantaneousVelocity;
    this.metrics.current = nextY;
    this.metrics.progress = this.metrics.maxScroll > 0 ? this.metrics.current / this.metrics.maxScroll : 0;

    window.scrollTo(0, nextY);
    this.notify();
  };

  private notify(): void {
    for (const sub of this.subscribers) {
      sub(this.metrics);
    }
  }
}
