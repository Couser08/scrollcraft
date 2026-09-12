/**
 * Global Viewport Visibility Manager for ScrollCraft
 * Coordinates all viewport-culling and off-screen dormancy through a single coalesced IntersectionObserver.
 * Strictly under 650 LOC.
 */

import { VisibilityCallback, VisibilityOptions } from './types';

export class GlobalVisibilityManager {
  private static instance: GlobalVisibilityManager | null = null;

  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, Set<VisibilityCallback>>();
  private visibilityState = new WeakMap<Element, boolean>();

  // Single coalesced queue to absorb rapid scroll bursts
  private pendingEntries: IntersectionObserverEntry[] = [];
  private isDrainScheduled = false;
  private rafId: number | null = null;

  private constructor(private options: VisibilityOptions = {}) {
    this.initObserver();
  }

  public static get(options?: VisibilityOptions): GlobalVisibilityManager {
    if (!GlobalVisibilityManager.instance) {
      GlobalVisibilityManager.instance = new GlobalVisibilityManager(options);
    }
    return GlobalVisibilityManager.instance;
  }

  private initObserver(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const rootMargin = this.options.rootMargin ?? '250px 0px';
    const threshold = this.options.threshold ?? 0;

    this.observer = new IntersectionObserver((entries) => {
      this.pendingEntries.push(...entries);

      if (!this.isDrainScheduled) {
        this.isDrainScheduled = true;
        this.rafId = requestAnimationFrame(this.drainPendingEntries);
      }
    }, { rootMargin, threshold });
  }

  private drainPendingEntries = (): void => {
    this.isDrainScheduled = false;
    this.rafId = null;

    const entries = this.pendingEntries;
    this.pendingEntries = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target;
      const isVisible = entry.isIntersecting || entry.boundingClientRect.top < 0 && entry.boundingClientRect.bottom > 0;

      this.visibilityState.set(target, isVisible);

      const listeners = this.callbacks.get(target);
      if (listeners) {
        for (const cb of listeners) {
          try {
            cb(isVisible, entry);
          } catch (err) {
            console.error('[ScrollCraft] Visibility callback error:', err);
          }
        }
      }
    }
  };

  /**
   * Subscribes an element to viewport visibility events.
   * Returns an unobserve cleanup function.
   */
  public observe(element: Element, callback: VisibilityCallback): () => void {
    if (!this.observer) {
      // In SSR or unaccelerated environment, fallback to always visible
      callback(true, {} as IntersectionObserverEntry);
      return () => {};
    }

    let listeners = this.callbacks.get(element);
    if (!listeners) {
      listeners = new Set();
      this.callbacks.set(element, listeners);
      this.observer.observe(element);
    }

    listeners.add(callback);

    // Immediate sync if we already know visibility state
    if (this.visibilityState.has(element)) {
      const state = this.visibilityState.get(element)!;
      callback(state, {} as IntersectionObserverEntry);
    }

    return () => {
      this.unobserve(element, callback);
    };
  }

  /**
   * Removes subscription for an element.
   */
  public unobserve(element: Element, callback?: VisibilityCallback): void {
    const listeners = this.callbacks.get(element);
    if (!listeners) return;

    if (callback) {
      listeners.delete(callback);
    } else {
      listeners.clear();
    }

    if (listeners.size === 0) {
      this.callbacks.delete(element);
      this.observer?.unobserve(element);
    }
  }

  /**
   * Synchronously queries whether an element is currently marked visible.
   */
  public isVisible(element: Element): boolean {
    return this.visibilityState.get(element) ?? true;
  }

  /**
   * Flushes any pending visibility callbacks immediately (useful for tests).
   */
  public flush(): void {
    if (this.isDrainScheduled) {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.drainPendingEntries();
    }
  }

  /**
   * Resets and disconnects the singleton observer.
   */
  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isDrainScheduled = false;
    this.pendingEntries = [];
    this.observer?.disconnect();
    this.observer = null;
    this.callbacks.clear();
    GlobalVisibilityManager.instance = null;
  }
}

export const globalVisibilityManager = GlobalVisibilityManager.get();
