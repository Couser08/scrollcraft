/**
 * Zero-Spacer Pinning Engine for ScrollCraft
 * Calculates pinned bounds without injecting disruptive spacer elements.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export const DEFAULT_PIN_DURATION = 800;

export interface PinOptions {
  /** Scroll distance (in px) the element stays pinned. Default: window.innerHeight or DEFAULT_PIN_DURATION */
  duration?: number;
  /** Offset from top of viewport to start pinning (in px). Default: 0 */
  topOffset?: number;
  /** Callback on pin progress (0.0 to 1.0) */
  onProgress?: (progress: number) => void;
}

export interface PinState {
  isPinned: boolean;
  progress: number;
  pinOffsetY: number;
}

export class PinSolver {
  private element: HTMLElement;
  private options: Required<PinOptions>;
  private elementTop: number = 0;
  private state: PinState = {
    isPinned: false,
    progress: 0,
    pinOffsetY: 0,
  };

  constructor(element: HTMLElement, options?: PinOptions) {
    this.element = element;
    this.options = {
      duration: options?.duration ?? (typeof window !== 'undefined' ? window.innerHeight : DEFAULT_PIN_DURATION),
      topOffset: options?.topOffset ?? 0,
      onProgress: options?.onProgress ?? (() => {}),
    };
    this.measure();
  }

  /**
   * Phase 1: Layout Read (batched to prevent reflows)
   */
  public measure(): void {
    if (typeof window === 'undefined') return;
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    // Current top position relative to document minus existing pin offset
    this.elementTop = rect.top + scrollTop - this.state.pinOffsetY;
  }

  /**
   * Phase 2: Compute pin progress and offset
   */
  public update(scrollY: number): PinState {
    const pinStart = this.elementTop - this.options.topOffset;
    const pinEnd = pinStart + this.options.duration;

    if (scrollY < pinStart) {
      // Above pin range
      this.state.isPinned = false;
      this.state.progress = 0;
      this.state.pinOffsetY = 0;
    } else if (scrollY >= pinStart && scrollY <= pinEnd) {
      // Inside active pin range
      this.state.isPinned = true;
      this.state.progress = clamp((scrollY - pinStart) / this.options.duration, 0, 1);
      this.state.pinOffsetY = scrollY - pinStart;
    } else {
      // Past pin range
      this.state.isPinned = false;
      this.state.progress = 1;
      this.state.pinOffsetY = this.options.duration;
    }

    this.options.onProgress(this.state.progress);
    return this.state;
  }

  /**
   * Phase 3: Direct GPU transform application
   */
  public render(): void {
    if (this.state.pinOffsetY > 0) {
      this.element.style.transform = `translate3d(0px, ${this.state.pinOffsetY}px, 0px)`;
    } else {
      this.element.style.transform = '';
    }
  }

  public getState(): PinState {
    return this.state;
  }
}
