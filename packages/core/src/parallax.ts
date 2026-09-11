/**
 * Intersection-Based Parallax Engine for ScrollCraft
 * Calculates zero-rerender GPU offsets relative to viewport center.
 * Implements Strategy Pattern (Native CSS view-timeline vs JS Fallback).
 * Strictly under 650 LOC.
 */

import { clamp } from './math';
import { ScrollDriver, DriverState } from './driver';
import { Capabilities } from './feature-detection';
import { injectNativeStyles } from './native-styles';
import { TransformComposer } from './dom';

export interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  min?: number;
  max?: number;
  /** Driver selection: 'js' (120 FPS direct composite writes), 'native' (CSS view-timeline), or 'auto' (default: 'js') */
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

  constructor(
    private element: HTMLElement,
    private options: Required<ParallaxOptions>
  ) {}

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

  private lastRenderedOffset: number | null = null;

  public render(): void {
    if (this.lastRenderedOffset === this.state.offset) return;
    this.lastRenderedOffset = this.state.offset;

    const formattedOffset = this.state.offset.toFixed(2);
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
    TransformComposer.clear(this.element, 'parallax');
  }
}

/**
 * Native CSS view-timeline Driver
 * Zero main-thread execution during scroll. 100% Compositor driven.
 */
class NativeParallaxDriver implements ScrollDriver {
  private state: ParallaxState = { offset: 0 };

  constructor(
    private element: HTMLElement,
    private options: Required<ParallaxOptions>
  ) {
    injectNativeStyles();
    // Initialize CSS properties for the timeline
    this.element.style.animationTimeline = 'view()';
    this.element.style.animationRange = 'entry 0% exit 100%';
    this.element.style.animationName = this.options.direction === 'vertical' ? 'sc-parallax-y' : 'sc-parallax-x';
    this.element.style.animationFillMode = 'both';
    this.element.style.animationTimingFunction = 'linear';
    
    // Explicitly set will-change for compositor
    this.element.style.willChange = 'transform';
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    // We only need to read layout to calculate the start and end offsets for the keyframes.
    // CSS view() goes from when the element's top enters the viewport bottom (entry 0%)
    // to when the element's bottom leaves the viewport top (exit 100%).
    const rect = this.element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    // The maximum distance the element moves relative to the center of the viewport
    // while it is intersecting the viewport.
    const maxDistance = (windowHeight + elementHeight) / 2;

    // CSS keyframes map 0% -> 100% scroll progress to these distances.
    // At entry 0%, viewport center is above element center by `maxDistance`.
    // At exit 100%, viewport center is below element center by `maxDistance`.
    let startOffset = maxDistance * this.options.speed;
    let endOffset = -maxDistance * this.options.speed;

    startOffset = clamp(startOffset, this.options.min, this.options.max);
    endOffset = clamp(endOffset, this.options.min, this.options.max);

    this.element.style.setProperty('--sc-parallax-start', `${startOffset.toFixed(2)}px`);
    this.element.style.setProperty('--sc-parallax-end', `${endOffset.toFixed(2)}px`);
  }

  public update(_scrollY: number): ParallaxState {
    // Native driver doesn't need to compute anything on scroll.
    return this.state;
  }

  public render(): void {
    // Native driver doesn't need to mutate DOM on scroll.
  }

  public getState(): ParallaxState {
    return this.state;
  }

  public destroy(): void {
    this.element.style.animationTimeline = '';
    this.element.style.animationRange = '';
    this.element.style.animationName = '';
    this.element.style.animationFillMode = '';
    this.element.style.animationTimingFunction = '';
    this.element.style.willChange = '';
    this.element.style.removeProperty('--sc-parallax-start');
    this.element.style.removeProperty('--sc-parallax-end');
  }
}

/**
 * Public Parallax Solver Factory
 */
export class ParallaxSolver {
  private driver: ScrollDriver;

  constructor(element: HTMLElement, options?: ParallaxOptions) {
    const opts: Required<ParallaxOptions> = {
      speed: options?.speed ?? 0.2,
      direction: options?.direction ?? 'vertical',
      min: options?.min ?? -Number.MAX_VALUE,
      max: options?.max ?? Number.MAX_VALUE,
      driver: options?.driver ?? 'auto',
    };

    // When driver is explicitly 'native' and browser supports view-timeline, use NativeParallaxDriver.
    // Otherwise, default to JSParallaxDriver (direct compositor writes, zero layout reads on scroll,
    // avoids Chromium unregistered CSS variable keyframe drop and Lenis window.scrollTo conflicts).
    if (opts.driver === 'native' && Capabilities.get().isNativeReady) {
      this.driver = new NativeParallaxDriver(element, opts);
    } else {
      this.driver = new JSParallaxDriver(element, opts);
    }

    this.measure();
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
