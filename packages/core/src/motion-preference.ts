/**
 * ScrollCraft Motion Preference & Accessibility Store
 * Strictly under 650 LOC.
 *
 * Implements WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions - Level AAA)
 * Monitors OS prefers-reduced-motion media query and synchronizes DOM attributes.
 */

export type MotionMode = 'system' | 'reduce' | 'no-preference';
export type MotionChangeListener = (isReduced: boolean) => void;

export class MotionPreferenceStore {
  private static instance: MotionPreferenceStore | null = null;
  private overrideMode: MotionMode = 'system';
  private systemReduced: boolean = false;
  private listeners: Set<MotionChangeListener> = new Set();
  private mediaQueryList: MediaQueryList | null = null;
  private boundHandler: ((e: MediaQueryListEvent) => void) | null = null;

  private constructor() {
    this.initSystemListener();
    this.syncDomAttribute();
  }

  public static get(): MotionPreferenceStore {
    if (!MotionPreferenceStore.instance) {
      MotionPreferenceStore.instance = new MotionPreferenceStore();
    }
    return MotionPreferenceStore.instance;
  }

  private initSystemListener(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      this.systemReduced = false;
      return;
    }

    try {
      this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.systemReduced = this.mediaQueryList.matches;

      this.boundHandler = (e: MediaQueryListEvent) => {
        this.systemReduced = e.matches;
        if (this.overrideMode === 'system') {
          this.notify();
          this.syncDomAttribute();
        }
      };

      if (typeof this.mediaQueryList.addEventListener === 'function') {
        this.mediaQueryList.addEventListener('change', this.boundHandler);
      } else if (typeof (this.mediaQueryList as any).addListener === 'function') {
        (this.mediaQueryList as any).addListener(this.boundHandler);
      }
    } catch {
      this.systemReduced = false;
    }
  }

  /**
   * Returns true if motion should be reduced (either via OS preference or manual override).
   */
  public isReduced(): boolean {
    if (this.overrideMode === 'reduce') return true;
    if (this.overrideMode === 'no-preference') return false;
    return this.systemReduced;
  }

  /**
   * Returns current effective mode ('system' | 'reduce' | 'no-preference').
   */
  public getMode(): MotionMode {
    return this.overrideMode;
  }

  /**
   * Manually override motion preference for in-app accessibility toggles.
   */
  public setOverride(mode: MotionMode): void {
    if (this.overrideMode === mode) return;
    this.overrideMode = mode;
    this.notify();
    this.syncDomAttribute();
  }

  /**
   * Synchronizes data-scrollcraft-reduced-motion attribute on <html> element for CSS integration.
   */
  private syncDomAttribute(): void {
    if (typeof document === 'undefined' || !document.documentElement) return;
    const reduced = this.isReduced();
    document.documentElement.setAttribute(
      'data-scrollcraft-reduced-motion',
      reduced ? 'true' : 'false'
    );
  }

  private notify(): void {
    const reduced = this.isReduced();
    for (const listener of this.listeners) {
      try {
        listener(reduced);
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.error('[ScrollCraft] Error in MotionChangeListener:', err);
        }
      }
    }
  }

  /**
   * Subscribes to motion preference changes.
   * Immediately calls the listener with the current state.
   */
  public subscribe(listener: MotionChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.isReduced());
    return () => this.listeners.delete(listener);
  }

  /**
   * Resets the store to default state. Intended for testing environments.
   */
  public reset(): void {
    if (this.mediaQueryList && this.boundHandler) {
      if (typeof this.mediaQueryList.removeEventListener === 'function') {
        this.mediaQueryList.removeEventListener('change', this.boundHandler);
      } else if (typeof (this.mediaQueryList as any).removeListener === 'function') {
        (this.mediaQueryList as any).removeListener(this.boundHandler);
      }
    }
    this.overrideMode = 'system';
    this.listeners.clear();
    this.initSystemListener();
    this.syncDomAttribute();
  }
}

export const motionStore = /* @__PURE__ */ MotionPreferenceStore.get();
