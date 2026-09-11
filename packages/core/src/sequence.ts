/**
 * Video/Image Sequence Scrubbing Solver for ScrollCraft
 * Translates scroll progress into frame sequencing on a <canvas>.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export interface SequenceOptions {
  frames: string[]; // Array of image URLs
  speed?: number; // Adjust scroll sensitivity
  /** Cap canvas density to avoid excessive mobile GPU memory. Default: 2. */
  maxDpr?: number;
}

export class SequenceSolver {
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private windowHeight: number = 0;
  private images: Array<HTMLImageElement | null> = [];
  private loaded: boolean = false;
  private destroyed = false;
  
  private currentFrame: number = 0;
  private targetFrame: number = 0;

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
    };
    this.preload();
  }

  private preload() {
    let settledCount = 0;
    const total = this.options.frames.length;

    this.options.frames.forEach((src, index) => {
      const img = new Image();
      const settle = () => {
        if (this.destroyed) return;
        settledCount++;
        if (settledCount === total) {
          this.loaded = this.images.some(Boolean);
          if (this.loaded) {
            this.measure();
            const firstLoaded = this.images.findIndex(Boolean);
            this.currentFrame = Math.max(firstLoaded, 0);
            this.targetFrame = this.currentFrame;
            this.drawFrame(this.currentFrame);
          }
        }
      };
      img.onload = () => {
        settle();
      };
      img.onerror = () => {
        this.images[index] = null;
        settle();
      };
      img.src = src;
      this.images[index] = img;
    });
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    const rect = this.container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    
    this.elementTop = rect.top + scrollTop;
    this.windowHeight = window.innerHeight;
    
    // The container height should be large enough to scroll.
    // Progress mapped across container height.
    this.maxScrollDistance = rect.height - this.windowHeight;

    // Adjust canvas resolution for high-DPI displays
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

    const maxFrame = this.images.length - 1;
    this.targetFrame = Math.round(progress * maxFrame);
  }

  public render(): void {
    if (!this.loaded || this.currentFrame === this.targetFrame) return;

    this.currentFrame = this.targetFrame;
    this.drawFrame(this.currentFrame);
  }

  private drawFrame(index: number) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    let img = this.images[index];
    if (!img) {
      // A failed image must not blank the whole sequence; use the nearest available frame.
      for (let distance = 1; distance < this.images.length && !img; distance++) {
        img = this.images[index - distance] ?? this.images[index + distance] ?? null;
      }
    }
    if (!img || img.width === 0 || img.height === 0) return;

    // Draw image to fill the canvas like object-fit: cover
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr);
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;

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

  public destroy(): void {
    this.destroyed = true;
    for (const image of this.images) {
      if (image) {
        image.onload = null;
        image.onerror = null;
        image.src = '';
      }
    }
    this.images = [];
    this.loaded = false;
  }
}
