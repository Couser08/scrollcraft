/**
 * Horizontal Scroll Section Solver for ScrollCraft
 * Maps vertical scroll progress to horizontal translation.
 * Uses native view-timeline when supported.
 * Strictly under 650 LOC.
 */

import { ScrollDriver, DriverState } from './driver';
import { clamp } from './math';
import { Capabilities } from './feature-detection';
import { injectNativeStyles } from './native-styles';
import { TransformComposer } from './dom';

export interface HorizontalScrollOptions {
  /** Scroll speed multiplier (default: 1). Higher speed scrolls through horizontal track faster over less vertical distance. */
  speed?: number;
  driver?: 'auto' | 'native' | 'js';
}

export interface HorizontalState extends DriverState {
  progress: number;
  offset: number;
}

class JSHorizontalDriver implements ScrollDriver {
  private state: HorizontalState = { progress: 0, offset: 0 };
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private effectiveScrollDistance: number = 0;
  private trackWidth: number = 0;
  private windowHeight: number = 0;

  constructor(
    private element: HTMLElement,
    private innerContainer: HTMLElement,
    private options: Required<HorizontalScrollOptions>
  ) {}

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    // The outer element is pinned (sticky). Its height dictates how long we scroll.
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    
    this.elementTop = rect.top + scrollTop;
    this.windowHeight = window.innerHeight;
    
    // Total scrollable distance for this section is outer height - window height
    this.maxScrollDistance = Math.max(1, rect.height - this.windowHeight);
    const speed = Math.max(0.001, this.options.speed || 1);
    this.effectiveScrollDistance = Math.max(1, this.maxScrollDistance / speed);
    
    // Width of the inner content that will slide left
    this.trackWidth = Math.max(0, this.innerContainer.scrollWidth - window.innerWidth);
  }

  public update(scrollY: number): HorizontalState {
    if (this.effectiveScrollDistance <= 0) return this.state;

    // Progress 0.0 to 1.0 based on how far we scrolled past the element's top scaled by speed
    const scrolledPastTop = scrollY - this.elementTop;
    let progress = scrolledPastTop / this.effectiveScrollDistance;
    progress = clamp(progress, 0, 1);

    this.state.progress = progress;
    this.state.offset = -(progress * this.trackWidth);

    return this.state;
  }

  public render(): void {
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const snappedOffset = Math.round(this.state.offset * dpr) / dpr;
    TransformComposer.set(this.innerContainer, 'horizontal', `translate3d(${snappedOffset.toFixed(2)}px, 0, 0)`);
  }

  public getState(): HorizontalState {
    return this.state;
  }

  public destroy(): void {
    TransformComposer.clear(this.innerContainer, 'horizontal');
  }
}

class NativeHorizontalDriver implements ScrollDriver {
  private state: HorizontalState = { progress: 0, offset: 0 };
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private effectiveScrollDistance: number = 0;
  private trackWidth: number = 0;
  private timelineName: string;
  private animationName: string;

  constructor(
    private element: HTMLElement,
    private innerContainer: HTMLElement,
    private options: Required<HorizontalScrollOptions>
  ) {
    injectNativeStyles();
    
    // Unique timeline and animation identifier per instance to prevent multi-section style collisions
    const id = Math.random().toString(36).slice(2, 8);
    this.timelineName = `--sc-horizontal-track-${id}`;
    this.animationName = `sc-horizontal-slide-${id}`;
    this.element.style.viewTimelineName = this.timelineName;
    this.element.style.viewTimelineAxis = 'block';

    this.innerContainer.style.animationTimeline = this.timelineName;
    this.innerContainer.style.animationRange = 'entry 100% exit 100%';
    this.innerContainer.style.animationName = this.animationName;
    this.innerContainer.style.animationFillMode = 'both';
    this.innerContainer.style.animationTimingFunction = 'linear';
    this.innerContainer.style.willChange = 'transform';
  }

  public measure(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.trackWidth = Math.max(0, this.innerContainer.scrollWidth - window.innerWidth);
    
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    this.elementTop = rect.top + scrollTop;
    this.maxScrollDistance = Math.max(1, rect.height - window.innerHeight);
    const speed = Math.max(0.001, this.options.speed || 1);
    this.effectiveScrollDistance = Math.max(1, this.maxScrollDistance / speed);

    const styleId = `sc-horizontal-style-${this.animationName}`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    this.innerContainer.style.setProperty('--sc-slide-end', `-${this.trackWidth}px`);
    
    let keyframes = '';
    if (speed >= 1) {
      const stopPercent = (100 / speed).toFixed(3);
      keyframes = `
        @keyframes ${this.animationName} {
          0% { transform: translate3d(0px, 0, 0); }
          ${stopPercent}%, 100% { transform: translate3d(var(--sc-slide-end, 0px), 0, 0); }
        }
      `;
    } else {
      keyframes = `
        @keyframes ${this.animationName} {
          0% { transform: translate3d(0px, 0, 0); }
          100% { transform: translate3d(calc(var(--sc-slide-end, 0px) * ${speed.toFixed(3)}), 0, 0); }
        }
      `;
    }
    styleEl.textContent = keyframes;
  }

  public update(scrollY: number): HorizontalState {
    const scrolledPastTop = scrollY - this.elementTop;
    const progress = clamp(scrolledPastTop / this.effectiveScrollDistance, 0, 1);
    this.state.progress = progress;
    this.state.offset = -(progress * this.trackWidth);
    return this.state;
  }

  public render(): void {}
  public getState(): HorizontalState { return this.state; }
  
  public destroy(): void {
    this.element.style.viewTimelineName = '';
    this.element.style.viewTimelineAxis = '';
    this.innerContainer.style.animationTimeline = '';
    this.innerContainer.style.animationRange = '';
    this.innerContainer.style.animationName = '';
    this.innerContainer.style.animationFillMode = '';
    this.innerContainer.style.willChange = '';
    this.innerContainer.style.removeProperty('--sc-slide-end');
    if (typeof document !== 'undefined') {
      const styleEl = document.getElementById(`sc-horizontal-style-${this.animationName}`);
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    }
  }
}

export class HorizontalScrollSolver {
  private driver: ScrollDriver;

  constructor(element: HTMLElement, innerContainer: HTMLElement, options?: HorizontalScrollOptions) {
    const opts: Required<HorizontalScrollOptions> = {
      speed: options?.speed ?? 1,
      driver: options?.driver ?? 'auto',
    };

    const useNative = opts.driver === 'native' || (opts.driver === 'auto' && Capabilities.get().isNativeReady);

    if (useNative) {
      this.driver = new NativeHorizontalDriver(element, innerContainer, opts);
    } else {
      this.driver = new JSHorizontalDriver(element, innerContainer, opts);
    }
    
    this.measure();
  }

  public measure(): void { this.driver.measure(); }
  public update(scrollY: number): HorizontalState { return this.driver.update(scrollY) as HorizontalState; }
  public render(): void { this.driver.render(); }
  public getState(): HorizontalState { return this.driver.getState() as HorizontalState; }
  public destroy(): void { this.driver.destroy(); }
}
