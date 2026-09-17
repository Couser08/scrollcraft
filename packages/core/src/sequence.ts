/**
 * Video/Image Sequence Scrubbing Solver for ScrollCraft
 * Translates scroll progress into frame sequencing on a <canvas>.
 *
 * Architectural Driver Classification:
 * STRICTLY JS/TICKER-DRIVEN SOLVER.
 * HTML5 Canvas 2D frame drawing (ctx.drawImage) requires imperative memory buffers
 * that cannot be bound to CSS animation-timeline.
 *
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export interface SequenceOptions {
  frames: string[]; // Array of image URLs
  speed?: number; // Adjust scroll sensitivity
  /** Cap canvas density to avoid excessive mobile GPU memory. Default: 2. */
  maxDpr?: number;
  /** Sliding LRU decoded window frame capacity (default: 20 frames) to protect mobile Safari VRAM */
  windowSize?: number;
}

export class SequenceSolver {
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private windowHeight: number = 0;

  // Active sliding memory window (LRU cache) bounded to windowSize
  private decodedFrames: Map<number, HTMLImageElement> = new Map();
  private loadingFrames: Set<number> = new Set();
  private loaded: boolean = false;
  private destroyed: boolean = false;

  private currentFrame: number = 0;
  private targetFrame: number = 0;
  private maxWindowSize: number = 20;

  private options: Required<SequenceOptions>;

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    options: SequenceOptions
  ) {
    this.options = {
      frames: options.frames,
      speed: options.speed ?? 1.5,
      maxDpr: options.maxDpr ?? 2,
      windowSize: options.windowSize ?? 20,
    };
    this.maxWindowSize = Math.max(10, Math.min(this.options.windowSize, 30));
    this.preloadInitial();
  }

  private preloadInitial(): void {
    if (this.options.frames.length === 0) return;

    // 1. Instant Poster / Frame 0: Load and render frame 0 immediately so canvas is never blank
    this.loadFrame(0, () => {
      if (this.destroyed) return;
      this.loaded = true;
      this.measure();
      this.drawFrame(0);
    });

    // 2. Preload adjacent chunk within initial window
    const initialEnd = Math.min(this.options.frames.length, this.maxWindowSize);
    for (let i = 1; i < initialEnd; i++) {
      this.loadFrame(i);
    }
  }

  private loadFrame(index: number, onComplete?: (img: HTMLImageElement) => void): void {
    if (this.destroyed || index < 0 || index >= this.options.frames.length) return;
    if (this.decodedFrames.has(index)) {
      onComplete?.(this.decodedFrames.get(index)!);
      return;
    }
    if (this.loadingFrames.has(index)) return;

    this.loadingFrames.add(index);
    const img = new Image();
    img.onload = () => {
      this.loadingFrames.delete(index);
      if (this.destroyed) return;
      this.decodedFrames.set(index, img);
      this.pruneDistantFrames();
      onComplete?.(img);
    };
    img.onerror = () => {
      this.loadingFrames.delete(index);
    };
    img.src = this.options.frames[index];
  }

  /**
   * Evicts decoded bitmaps outside the active sliding window to prevent mobile Jetsam OOM crashes.
   */
  private pruneDistantFrames(): void {
    if (this.decodedFrames.size <= this.maxWindowSize) return;

    // Evict frames farthest from targetFrame
    const sortedEntries = Array.from(this.decodedFrames.keys()).sort((a, b) => {
      return Math.abs(b - this.targetFrame) - Math.abs(a - this.targetFrame);
    });

    while (this.decodedFrames.size > this.maxWindowSize && sortedEntries.length > 0) {
      const evictIndex = sortedEntries.shift()!;
      // Never evict frame 0 if target is near 0
      if (evictIndex === 0 && this.targetFrame < 5) continue;

      const img = this.decodedFrames.get(evictIndex);
      if (img) {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
      this.decodedFrames.delete(evictIndex);
    }
  }

  private manageActiveWindow(centerFrame: number): void {
    const half = Math.floor(this.maxWindowSize / 2);
    const start = Math.max(0, centerFrame - half);
    const end = Math.min(this.options.frames.length - 1, centerFrame + half);

    for (let i = start; i <= end; i++) {
      if (!this.decodedFrames.has(i) && !this.loadingFrames.has(i)) {
        this.loadFrame(i);
      }
    }
    this.pruneDistantFrames();
  }

  public measure(): void {
    if (typeof window === 'undefined') return;

    const rect = this.container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;

    this.elementTop = rect.top + scrollTop;
    this.windowHeight = window.innerHeight;

    this.maxScrollDistance = rect.height - this.windowHeight;

    // Adjust canvas resolution for high-DPI displays (strictly capped to save mobile GPU VRAM)
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    const ctx = this.canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public update(scrollY: number): void {
    if (!this.loaded || this.maxScrollDistance <= 0) return;

    const scrolledPastTop = scrollY - this.elementTop;
    let progress = scrolledPastTop / this.maxScrollDistance;
    progress = clamp(progress, 0, 1);

    const maxFrame = this.options.frames.length - 1;
    this.targetFrame = Math.round(progress * maxFrame);
    this.manageActiveWindow(this.targetFrame);
  }

  public render(): void {
    if (!this.loaded || this.currentFrame === this.targetFrame) return;

    this.currentFrame = this.targetFrame;
    this.drawFrame(this.currentFrame);
  }

  private drawFrame(index: number): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    let img = this.decodedFrames.get(index);
    if (!img) {
      // Use nearest available decoded frame to avoid blank canvas flash during fast scrub
      let minDiff = Infinity;
      let nearestIndex = -1;
      for (const k of this.decodedFrames.keys()) {
        const diff = Math.abs(k - index);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIndex = k;
        }
      }
      if (nearestIndex !== -1) {
        img = this.decodedFrames.get(nearestIndex);
      }
    }
    if (!img || img.width === 0 || img.height === 0) return;

    // Draw image to fill the canvas like object-fit: cover
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr);
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = img.width * (canvasHeight / img.height);
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = img.height * (canvasWidth / img.width);
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  /**
   * Exposes active decoded frames in memory for testing and profiling.
   */
  public getLoadedFramesCount(): number {
    return this.decodedFrames.size;
  }

  public getCurrentFrame(): number {
    return this.currentFrame;
  }

  public destroy(): void {
    this.destroyed = true;
    for (const img of this.decodedFrames.values()) {
      if (img) {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
    }
    this.decodedFrames.clear();
    this.loadingFrames.clear();
    this.loaded = false;
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
