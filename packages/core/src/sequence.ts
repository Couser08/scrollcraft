/**
 * Video/Image Sequence Scrubbing Solver for ScrollCraft
 * Translates scroll progress into frame sequencing on a <canvas>.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export interface SequenceOptions {
  frames: string[]; // Array of image URLs
  speed?: number; // Adjust scroll sensitivity
}

export class SequenceSolver {
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private windowHeight: number = 0;
  private images: HTMLImageElement[] = [];
  private loaded: boolean = false;
  
  private currentFrame: number = 0;
  private targetFrame: number = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    private options: Required<SequenceOptions>
  ) {
    this.options.speed = options.speed ?? 1.5;
    this.preload();
  }

  private preload() {
    let loadedCount = 0;
    const total = this.options.frames.length;

    this.options.frames.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
          this.loaded = true;
          this.measure();
          // Draw first frame immediately
          this.drawFrame(0);
        }
      };
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
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    const ctx = this.canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
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

    const img = this.images[index];
    if (!img) return;

    // Draw image to fill the canvas like object-fit: cover
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
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
    // Cleanup memory
    this.images = [];
  }
}
