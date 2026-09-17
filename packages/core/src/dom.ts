/**
 * High-Performance Direct DOM Transform Writer for ScrollCraft
 * Directly writes transform and opacity styles to elements.
 * Strictly under 650 LOC.
 */

import { ElementTransform } from './types';
import { tierStore } from './feature-detection';

const transformCache = new WeakMap<HTMLElement, ElementTransform>();
const composedTransforms = new WeakMap<HTMLElement, { base: string; parts: Map<string, string>; lastComposed: string }>();

/**
 * Coordinates independent animation primitives without letting their transforms overwrite each other.
 * The first use preserves an existing inline transform as the base layer.
 */
export class TransformComposer {
  public static set(element: HTMLElement, owner: string, transform: string): void {
    let state = composedTransforms.get(element);
    if (!state) {
      state = { base: element.style.transform || '', parts: new Map(), lastComposed: '' };
      composedTransforms.set(element, state);
    }

    // Fast path: if the owner's transform hasn't changed, skip composition entirely
    if (state.parts.get(owner) === transform) return;
    state.parts.set(owner, transform);

    // Direct string composition without intermediate array allocations
    let composed = state.base || '';
    for (const part of state.parts.values()) {
      if (part) {
        composed = composed ? `${composed} ${part}` : part;
      }
    }
    composed = composed.trim();

    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
    }
  }

  public static clear(element: HTMLElement, owner: string): void {
    const state = composedTransforms.get(element);
    if (!state || !state.parts.has(owner)) return;
    state.parts.delete(owner);

    let composed = state.base || '';
    for (const part of state.parts.values()) {
      if (part) {
        composed = composed ? `${composed} ${part}` : part;
      }
    }
    composed = composed.trim();

    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
    }
    if (state.parts.size === 0) {
      composedTransforms.delete(element);
    }
  }

  public static get(element: HTMLElement): string {
    return composedTransforms.get(element)?.lastComposed ?? element.style.transform ?? '';
  }
}

export class TransformWriter {
  /**
   * Applies 3D hardware-accelerated transform to an HTMLElement
   */
  public static applyTransform(element: HTMLElement, transform: ElementTransform): void {
    const x = transform.x ?? 0;
    const y = transform.y ?? 0;
    const z = transform.z ?? 0;
    const scaleX = transform.scaleX ?? transform.scale ?? 1;
    const scaleY = transform.scaleY ?? transform.scale ?? 1;
    const rotateX = transform.rotateX ?? 0;
    const rotateY = transform.rotateY ?? 0;
    const rotateZ = transform.rotateZ ?? 0;

    const cached = transformCache.get(element);
    if (
      !cached ||
      cached.x !== x ||
      cached.y !== y ||
      cached.z !== z ||
      cached.scaleX !== scaleX ||
      cached.scaleY !== scaleY ||
      cached.rotateX !== rotateX ||
      cached.rotateY !== rotateY ||
      cached.rotateZ !== rotateZ
    ) {
      const transformString = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scaleX}, ${scaleY})`;
      element.style.transform = transformString;
      transformCache.set(element, { x, y, z, scaleX, scaleY, rotateX, rotateY, rotateZ });
    }

    if (transform.opacity !== undefined && element.style.opacity !== String(transform.opacity)) {
      element.style.opacity = String(transform.opacity);
    }
  }

  /**
   * Sets a custom CSS property on an element
   */
  public static setCssVariable(element: HTMLElement, property: string, value: string | number): void {
    element.style.setProperty(property, String(value));
  }

  /**
   * Prepares element for GPU compositing
   */
  public static promoteToCompositor(element: HTMLElement): void {
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
  }

  /**
   * Cleans up GPU promotion when idle
   */
  public static demoteFromCompositor(element: HTMLElement): void {
    element.style.willChange = 'auto';
  }
}

/** Backwards-compatibility alias */
export const DomCompositor = TransformWriter;
export type DomCompositor = TransformWriter;

/**
 * Autonomous Smart Compositor for ScrollCraft
 * Manages layer lifecycle with debounced demotion, WeakMap+Set timer tracking,
 * and a global reject-new budget cap on Tier 1 hardware.
 * Singleton instance: smartCompositor
 */
export class SmartCompositor {
  private static instance: SmartCompositor | null = null;
  private demoteTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
  private companionSet = new Set<HTMLElement>();
  private promotedElements = new Set<HTMLElement>();

  private constructor() {}

  public static get(): SmartCompositor {
    if (!SmartCompositor.instance) {
      SmartCompositor.instance = new SmartCompositor();
    }
    return SmartCompositor.instance;
  }

  private pruneDisconnected(): void {
    for (const el of this.promotedElements) {
      if ((el as any).__sc_connected && !el.isConnected) {
        const timer = this.demoteTimers.get(el);
        if (timer) {
          clearTimeout(timer);
          this.demoteTimers.delete(el);
        }
        this.promotedElements.delete(el);
        this.companionSet.delete(el);
      }
    }
  }

  /**
   * Promotes element to compositor layer with willChange: transform.
   * Cancels any pending demotion. Enforces reject-new cap on Tier 1.
   */
  public promote(element: HTMLElement): boolean {
    if (!element || typeof window === 'undefined') return false;

    if (element.isConnected) {
      (element as any).__sc_connected = true;
    }
    this.pruneDisconnected();

    // Clear any pending demotion timer
    const pendingTimer = this.demoteTimers.get(element);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      this.demoteTimers.delete(element);
    }

    // Global reject-new cap for Tier 1: max 3 concurrent layers
    const tier = tierStore.getTier();
    if (tier === 'low' && this.promotedElements.size >= 3 && !this.promotedElements.has(element)) {
      return false;
    }

    element.style.willChange = 'transform';
    this.promotedElements.add(element);
    this.companionSet.add(element);
    return true;
  }

  /**
   * Schedules a debounced demotion after motion settles.
   */
  public demote(element: HTMLElement, debounceMs: number = 300): void {
    if (!element || typeof window === 'undefined') return;

    const existingTimer = this.demoteTimers.get(element);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.demoteTimers.delete(element);
      this.promotedElements.delete(element);
      this.companionSet.delete(element);
      if (element && element.style) {
        element.style.willChange = 'auto';
      }
    }, debounceMs);

    this.demoteTimers.set(element, timer);
    this.companionSet.add(element);
  }

  public isPromoted(element: HTMLElement): boolean {
    return this.promotedElements.has(element);
  }

  public getPromotedCount(): number {
    this.pruneDisconnected();
    return this.promotedElements.size;
  }

  /**
   * Cleans up an element upon component unmount.
   */
  public destroy(element: HTMLElement): void {
    const timer = this.demoteTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.demoteTimers.delete(element);
    }
    this.promotedElements.delete(element);
    this.companionSet.delete(element);
    if (element && element.style) {
      element.style.willChange = 'auto';
    }
  }

  /**
   * Global teardown clearing all timers and resetting all tracked elements.
   */
  public destroyAll(): void {
    for (const element of this.companionSet) {
      const timer = this.demoteTimers.get(element);
      if (timer) {
        clearTimeout(timer);
        this.demoteTimers.delete(element);
      }
      if (element && element.style) {
        element.style.willChange = 'auto';
      }
    }
    this.companionSet.clear();
    this.promotedElements.clear();
  }
}

export const smartCompositor = SmartCompositor.get();

export type GlobalResizeCallback = (entry?: ResizeObserverEntry) => void;

/**
 * Singleton GlobalResizeManager
 * Consolidates dozens of ResizeObservers into a single shared instance.
 * Batches callbacks in requestAnimationFrame to eliminate layout thrashing.
 */
export class GlobalResizeManager {
  private static observer: ResizeObserver | null = null;
  private static callbacks = new Map<Element, Set<GlobalResizeCallback>>();
  private static rafId: number | null = null;
  private static pendingEntries: ResizeObserverEntry[] = [];

  private static lastWindowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0;
  private static lastWindowHeight: number = typeof window !== 'undefined' ? window.innerHeight : 0;
  private static windowListeners = new Set<() => void>();
  private static isWindowBound = false;

  private static getObserver(): ResizeObserver | null {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return null;
    if (!this.observer) {
      this.observer = new ResizeObserver((entries) => {
        this.pendingEntries.push(...entries);
        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            const currentEntries = this.pendingEntries;
            this.pendingEntries = [];
            for (const entry of currentEntries) {
              const cbs = this.callbacks.get(entry.target);
              if (cbs) {
                for (const cb of cbs) {
                  cb(entry);
                }
              }
            }
          });
        }
      });
    }
    return this.observer;
  }

  public static observe(element: Element | null | undefined, callback: GlobalResizeCallback): () => void {
    if (!element) return () => {};
    const obs = this.getObserver();
    if (!obs) return () => {};

    let cbs = this.callbacks.get(element);
    if (!cbs) {
      cbs = new Set();
      this.callbacks.set(element, cbs);
      obs.observe(element);
    }
    cbs.add(callback);

    return () => {
      this.unobserve(element, callback);
    };
  }

  /**
   * Strictly null-safe unobserve implementation.
   * Safe no-op if element is null or undefined.
   */
  public static unobserve(element: Element | null | undefined, callback?: GlobalResizeCallback): void {
    if (!element) return;
    const cbs = this.callbacks.get(element);
    if (!cbs) return;
    if (callback) {
      cbs.delete(callback);
    } else {
      cbs.clear();
    }
    if (cbs.size === 0) {
      this.callbacks.delete(element);
      this.observer?.unobserve(element);
    }
  }

  /**
   * Helper to determine whether a resize delta corresponds to mobile address bar collapse/expand.
   * Ignores vertical shifts < 100px when width has not changed.
   */
  public static shouldIgnoreResize(prevWidth: number, prevHeight: number, newWidth: number, newHeight: number): boolean {
    return prevWidth === newWidth && Math.abs(newHeight - prevHeight) < 100;
  }

  /**
   * Subscribes to window resize events, automatically filtering out mobile address bar jitter (<100px height shift without width change).
   */
  public static onWindowResize(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    if (!this.isWindowBound) {
      this.isWindowBound = true;
      this.lastWindowWidth = window.innerWidth;
      this.lastWindowHeight = window.innerHeight;

      window.addEventListener(
        'resize',
        () => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          const widthChanged = newWidth !== this.lastWindowWidth;
          const heightDelta = Math.abs(newHeight - this.lastWindowHeight);

          if (!widthChanged && heightDelta < 100) {
            // Suppress mobile address bar expansion/collapse jitter
            return;
          }

          this.lastWindowWidth = newWidth;
          this.lastWindowHeight = newHeight;

          for (const cb of this.windowListeners) {
            cb();
          }
        },
        { passive: true }
      );
    }

    this.windowListeners.add(callback);
    return () => {
      this.windowListeners.delete(callback);
    };
  }

  public static disconnect(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingEntries = [];
    this.observer?.disconnect();
    this.observer = null;
    this.callbacks.clear();
    this.windowListeners.clear();
  }
}

