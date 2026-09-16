/**
 * Intersection-Based Parallax Engine for ScrollCraft
 * Calculates zero-rerender GPU offsets relative to viewport center.
 * Integrated with SmartCompositor and Viewport Culling.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';
import { ScrollDriver, DriverState } from './driver';
import { Capabilities } from './feature-detection';
import { injectNativeStyles } from './native-styles';
import { TransformComposer, smartCompositor } from './dom';

export interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  min?: number;
  max?: number;
  /** Driver selection: 'auto' (native CSS scroll-timeline with JS fallback), 'native' (force native), or 'js' (force JS ticker) */
  driver?: 'auto' | 'js' | 'native';
}

export interface ParallaxState extends DriverState {
  offset: number;
}

/**
 * JS Fallback Driver (Lenis / RequestAnimationFrame Ticker)
 * Computes math directly and writes to DOM via Ticker.
 */
class JSParallaxDriver implements ScrollDriver {
  private elementTop: number = 0;
  private elementHeight: number = 0;
  private elementLeft: number = 0;
  private elementWidth: number = 0;
  private viewportSize: number = 0;
  private state: ParallaxState = { offset: 0 };
  private isVisible: boolean = true;
  private lastRenderedOffset: number | null = null;

  constructor(
    private element: HTMLElement,
    private options: Required<ParallaxOptions>
  ) {
    smartCompositor.promote(element);
  }

  public setVisible(visible: boolean): void {
    if (this.isVisible === visible) return;
    this.isVisible = visible;

    if (visible) {
      smartCompositor.promote(this.element);
    } else {
      smartCompositor.demote(this.element, 300);
    }
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    const rect = this.element.getBoundingClientRect();
    let currentOffset = this.state.offset;
    if (this.options.direction === 'vertical') {
      const scrollTop = window.scrollY || window.pageYOffset;
      this.elementTop = rect.top + scrollTop - currentOffset;
      this.elementHeight = rect.height;
      this.viewportSize = window.innerHeight;
    } else {
      const scrollLeft = window.scrollX || window.pageXOffset;
      this.elementLeft = rect.left + scrollLeft - currentOffset;
      this.elementWidth = rect.width;
      this.viewportSize = window.innerWidth;
    }
  }

  public update(scrollOffset: number): ParallaxState {
    if (!this.isVisible) return this.state;
    if (this.viewportSize === 0 || (this.elementHeight === 0 && this.elementWidth === 0)) {
      this.measure();
    }
    if (this.viewportSize === 0) return this.state;

    const viewportCenter = scrollOffset + (this.viewportSize / 2);
    const elementCenter = this.options.direction === 'vertical'
      ? this.elementTop + (this.elementHeight / 2)
      : this.elementLeft + (this.elementWidth / 2);
    const distanceFromCenter = viewportCenter - elementCenter;

    let offset = distanceFromCenter * this.options.speed;
    offset = clamp(offset, this.options.min, this.options.max);

    this.state.offset = offset;
    return this.state;
  }

  public render(): void {
    if (!this.isVisible) return;
    if (this.lastRenderedOffset === this.state.offset) return;
    this.lastRenderedOffset = this.state.offset;

    // Subpixel grid snapping prevents font glyph raster shimmering and jitter
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const snappedOffset = Math.round(this.state.offset * dpr) / dpr;
    const formattedOffset = snappedOffset.toFixed(2);
    if (this.options.direction === 'vertical') {
      TransformComposer.set(this.element, 'parallax', `translate3d(0, ${formattedOffset}px, 0)`);
    } else {
      TransformComposer.set(this.element, 'parallax', `translate3d(${formattedOffset}px, 0, 0)`);
    }
  }

  public getState(): ParallaxState {
    return this.state;
  }

  public destroy(): void {
    smartCompositor.destroy(this.element);
    TransformComposer.clear(this.element, 'parallax');
  }
}

/**
 * Native CSS scroll-timeline Driver
 * Binds to document-level named scroll-timeline (--sc-doc-scroll) on :root.
 * Bypasses intermediate overflow: hidden ancestor containers with zero main-thread scroll overhead.
 */
class NativeParallaxDriver implements ScrollDriver {
  private state: ParallaxState = { offset: 0 };
  private onLayoutShift = (): void => {
    this.measure();
  };

  constructor(
    private element: HTMLElement,
    private options: Required<ParallaxOptions>
  ) {
    injectNativeStyles();
    // Initialize CSS properties for the named document scroll timeline
    this.element.classList.add('sc-parallax-target');
    this.element.style.animationTimeline = '--sc-doc-scroll';
    this.element.style.animationName = this.options.direction === 'vertical' ? 'sc-parallax-y' : 'sc-parallax-x';
    this.element.style.animationFillMode = 'both';
    this.element.style.animationTimingFunction = 'linear';
    smartCompositor.promote(element);

    // Auto-remeasure upon late font readiness, image loads, and window resizing
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('load', this.onLayoutShift, { passive: true });
      window.addEventListener('resize', this.onLayoutShift, { passive: true });
    }
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (this.element.isConnected) {
          this.measure();
        }
      });
    }
  }

  public setVisible(_visible: boolean): void {
    // Native driver is managed by browser compositor
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const elementTop = rect.top + scrollTop;
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    // Timeline range: start when element top enters viewport bottom, end when element bottom exits viewport top
    const startScroll = elementTop - windowHeight;
    const endScroll = elementTop + elementHeight;

    const maxDistance = (windowHeight + elementHeight) / 2;

    let startOffset = maxDistance * this.options.speed;
    let endOffset = -maxDistance * this.options.speed;

    startOffset = clamp(startOffset, this.options.min, this.options.max);
    endOffset = clamp(endOffset, this.options.min, this.options.max);

    this.element.style.animationRange = `${startScroll.toFixed(2)}px ${endScroll.toFixed(2)}px`;
    this.element.style.setProperty('--sc-parallax-start', `${startOffset.toFixed(2)}px`);
    this.element.style.setProperty('--sc-parallax-end', `${endOffset.toFixed(2)}px`);
  }

  public update(_scrollY: number): ParallaxState {
    return this.state;
  }

  public render(): void {}

  public getState(): ParallaxState {
    return this.state;
  }

  public destroy(): void {
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('load', this.onLayoutShift);
      window.removeEventListener('resize', this.onLayoutShift);
    }
    this.element.classList?.remove('sc-parallax-target');
    this.element.style.animationTimeline = '';
    this.element.style.animationRange = '';
    this.element.style.animationName = '';
    this.element.style.animationFillMode = '';
    this.element.style.animationTimingFunction = '';
    smartCompositor.destroy(this.element);
    this.element.style.removeProperty('--sc-parallax-start');
    this.element.style.removeProperty('--sc-parallax-end');
  }
}

/**
 * Public Parallax Solver Factory
 */
export class ParallaxSolver {
  private driver: ScrollDriver & { setVisible?: (v: boolean) => void };

  constructor(element: HTMLElement, options?: ParallaxOptions) {
    const opts: Required<ParallaxOptions> = {
      speed: options?.speed ?? 0.2,
      direction: options?.direction ?? 'vertical',
      min: options?.min ?? -Number.MAX_VALUE,
      max: options?.max ?? Number.MAX_VALUE,
      driver: options?.driver ?? 'auto',
    };

    // Native CSS scroll-timeline is used when supported and driver is 'auto', or when explicitly requested ('native').
    // Falls back to JSParallaxDriver in environments without native scroll-driven animations.
    const shouldUseNative =
      opts.driver === 'native' || (opts.driver === 'auto' && Capabilities.get().isNativeReady);

    if (shouldUseNative) {
      try {
        this.driver = new NativeParallaxDriver(element, opts);
      } catch (err) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn('[ScrollCraft] NativeParallaxDriver failed to initialize, falling back to JS driver:', err);
        }
        this.driver = new JSParallaxDriver(element, opts);
      }
    } else {
      this.driver = new JSParallaxDriver(element, opts);
    }

    this.measure();
  }

  public getDriverType(): 'native' | 'js' {
    return this.driver instanceof NativeParallaxDriver ? 'native' : 'js';
  }

  public setVisible(visible: boolean): void {
    this.driver.setVisible?.(visible);
  }

  public measure(): void {
    this.driver.measure();
  }

  public update(scrollY: number): ParallaxState {
    return this.driver.update(scrollY) as ParallaxState;
  }

  public render(): void {
    this.driver.render();
  }

  public getState(): ParallaxState {
    return this.driver.getState() as ParallaxState;
  }

  public destroy(): void {
    this.driver.destroy();
  }
}
