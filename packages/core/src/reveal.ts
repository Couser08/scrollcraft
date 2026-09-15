/**
 * Global Reveal Observer for ScrollCraft
 * Prevents IntersectionObserver spam by centralizing all reveal elements into a single observer.
 * Strictly under 650 LOC.
 */

import { TransformComposer } from './dom';

export interface RevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

interface RevealEntry {
  element: HTMLElement;
  options: Required<RevealOptions>;
  hasRevealed: boolean;
  initialStyles: {
    opacity: string;
    transition: string;
    willChange: string;
  };
  isObserved: boolean;
}

export class GlobalRevealObserver {
  private static instance: GlobalRevealObserver | null = null;
  // Use a map to support multiple threshold requirements efficiently
  private observers: Map<number, IntersectionObserver> = new Map();
  private entries: Map<Element, RevealEntry> = new Map();

  private constructor() {}

  public static get(): GlobalRevealObserver {
    if (!GlobalRevealObserver.instance) {
      GlobalRevealObserver.instance = new GlobalRevealObserver();
    }
    return GlobalRevealObserver.instance;
  }

  private getObserver(threshold: number): IntersectionObserver | null {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null;
    
    if (!this.observers.has(threshold)) {
      try {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const target = entry.target as HTMLElement;
              const data = this.entries.get(target);
              if (!data) continue;

              // Robust check: if it's intersecting, OR if it's already above the viewport (we scrolled past it fast)
              if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                data.hasRevealed = true;
                this.applyRevealedState(target, data.options);

                if (data.options.once) {
                  for (const obs of this.observers.values()) {
                    obs.unobserve(target);
                  }
                  data.isObserved = false;
                }
              } else if (!data.options.once && data.hasRevealed) {
                data.hasRevealed = false;
                this.applyHiddenState(target, data.options);
              }
            }
          },
          { threshold }
        );
        this.observers.set(threshold, observer);
      } catch (err) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn('[ScrollCraft] Failed to instantiate IntersectionObserver in reveal:', err);
        }
        return null;
      }
    }
    return this.observers.get(threshold) ?? null;
  }

  private getHiddenTransform(direction: string, distance: number): string {
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`;
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      default: return 'none';
    }
  }

  private applyInitialHiddenState(element: HTMLElement, options: Required<RevealOptions>): void {
    element.style.transition = 'none';
    element.style.opacity = '0';
    TransformComposer.set(element, 'reveal', this.getHiddenTransform(options.direction, options.distance));
    void element.offsetHeight;
  }

  private applyHiddenState(element: HTMLElement, options: Required<RevealOptions>): void {
    element.style.transition = `opacity ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.opacity = '0';
    TransformComposer.set(element, 'reveal', this.getHiddenTransform(options.direction, options.distance));
  }

  private applyRevealedState(element: HTMLElement, options: Required<RevealOptions>): void {
    const delayStr = options.delay > 0 ? ` ${options.delay}s` : '';
    element.style.transition = `opacity ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1)${delayStr}, transform ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1)${delayStr}`;
    element.style.opacity = '1';
    TransformComposer.set(element, 'reveal', 'translate3d(0, 0, 0)');
  }

  public observe(element: HTMLElement, options: RevealOptions): void {
    if (typeof window === 'undefined') return;

    const fullOptions: Required<RevealOptions> = {
      direction: options.direction ?? 'up',
      distance: options.distance ?? 32,
      duration: options.duration ?? 0.6,
      delay: options.delay ?? 0,
      threshold: options.threshold ?? 0.15,
      once: options.once ?? true,
    };

    // Safety: If element is taller than window, IntersectionObserver might never hit 0.15 threshold
    // We dynamically clamp the threshold to ensure it triggers
    const wh = window.innerHeight;
    const rect = element.getBoundingClientRect();
    let safeThreshold = fullOptions.threshold;
    if (rect.height > wh * 0.8) {
      safeThreshold = 0.05; // Drop threshold for massive elements
    }

    const initialStyles = {
      opacity: element.style.opacity || '',
      transition: element.style.transition || '',
      willChange: element.style.willChange || '',
    };

    const entry: RevealEntry = {
      element,
      options: fullOptions,
      hasRevealed: false,
      initialStyles,
      isObserved: false,
    };
    this.entries.set(element, entry);

    // Reduced motion handling: reveal immediately without translation if reduced-motion preferred
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      entry.hasRevealed = true;
      element.style.opacity = '1';
      element.style.transition = 'none';
      TransformComposer.set(element, 'reveal', 'translate3d(0, 0, 0)');
      return;
    }

    // Initial State Check: If already scrolled past the viewport above on mount, reveal instantly without animation
    if (rect.bottom < 0) {
      entry.hasRevealed = true;
      element.style.opacity = '1';
      TransformComposer.set(element, 'reveal', 'translate3d(0, 0, 0)');
      
      if (fullOptions.once) {
        // Retain entry so unobserve() and destroy() can clean up, but do not register with IntersectionObserver
        return;
      }
    } else {
      element.style.willChange = 'opacity, transform';
      this.applyInitialHiddenState(element, fullOptions);
    }

    const observer = this.getObserver(safeThreshold);
    if (!observer) {
      entry.hasRevealed = true;
      element.style.opacity = '1';
      TransformComposer.set(element, 'reveal', 'translate3d(0, 0, 0)');
      return;
    }
    observer.observe(element);
    entry.isObserved = true;
  }

  public unobserve(element: HTMLElement): void {
    const data = this.entries.get(element);
    if (!data) return;

    if (data.isObserved) {
      for (const observer of this.observers.values()) {
        observer.unobserve(element);
      }
    }
    
    this.entries.delete(element);
    element.style.willChange = data.initialStyles.willChange;
    element.style.transition = data.initialStyles.transition;
    element.style.opacity = data.initialStyles.opacity;
    TransformComposer.clear(element, 'reveal');
  }

  /** Releases pooled observers during application teardown and tests. */
  public destroy(): void {
    for (const observer of this.observers.values()) observer.disconnect();
    this.observers.clear();
    for (const entry of this.entries.values()) {
      entry.element.style.willChange = entry.initialStyles.willChange;
      entry.element.style.transition = entry.initialStyles.transition;
      entry.element.style.opacity = entry.initialStyles.opacity;
      TransformComposer.clear(entry.element, 'reveal');
    }
    this.entries.clear();
  }
}

export const revealObserver = /* @__PURE__ */ GlobalRevealObserver.get();
