/**
 * High-Performance Direct DOM Transform Writer for ScrollCraft
 * Directly writes transform and opacity styles to elements.
 * Strictly under 650 LOC.
 */

import { ElementTransform } from './types';

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
      state = { base: element.style.transform, parts: new Map(), lastComposed: '' };
      composedTransforms.set(element, state);
    }
    state.parts.set(owner, transform);
    const composed = [state.base, ...state.parts.values()].filter(Boolean).join(' ').trim();
    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
    }
  }

  public static clear(element: HTMLElement, owner: string): void {
    const state = composedTransforms.get(element);
    if (!state) return;
    state.parts.delete(owner);
    const composed = state.parts.size === 0 
      ? state.base 
      : [state.base, ...state.parts.values()].filter(Boolean).join(' ').trim();
    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
    }
    if (state.parts.size === 0) {
      composedTransforms.delete(element);
    }
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

  public static observe(element: Element, callback: GlobalResizeCallback): () => void {
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

  public static unobserve(element: Element, callback: GlobalResizeCallback): void {
    const cbs = this.callbacks.get(element);
    if (!cbs) return;
    cbs.delete(callback);
    if (cbs.size === 0) {
      this.callbacks.delete(element);
      this.observer?.unobserve(element);
    }
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
  }
}

