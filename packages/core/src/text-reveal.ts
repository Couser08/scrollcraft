/**
 * 120 FPS Direct DOM Text Reveal Solver
 * Splitting text is handled by the framework layer. This manages physics, opacities, and kinetic transforms.
 * Strictly under 650 LOC.
 */

import { mapRange, clamp, lerp } from './math';
import { TransformComposer } from './dom';

export interface TextRevealOptions {
  /** Offset start and end progress (0 to 1) relative to container viewport intersection */
  range?: [number, number];
  /** Atmospheric blur reveal in px (e.g. 8 or true for 8px). Default: 0 (disabled) */
  blur?: boolean | number;
  /** Entry scale factor (e.g. 0.9). Default: 1 (disabled) */
  scale?: number;
  /** 3D entry tilt on X axis in degrees. Default: 0 (disabled) */
  rotateX?: number;
  /** 3D entry tilt on Y axis in degrees. Default: 0 (disabled) */
  rotateY?: number;
  /** Entry slide distance in pixels. Default: 0 (disabled) */
  slide?: number;
}

export class TextRevealSolver {
  private container: HTMLElement;
  private chars: HTMLElement[];
  private range: [number, number];
  private containerTop = 0;
  private opacities: number[] = [];
  private progressValues: number[] = [];
  private initialOpacities: string[] = [];
  private initialFilters: string[] = [];
  private maxBlur: number = 0;
  private entryScale: number = 1;
  private entryRotateX: number = 0;
  private entryRotateY: number = 0;
  private entrySlide: number = 0;
  private hasKineticTransforms: boolean = false;

  constructor(container: HTMLElement, chars: HTMLElement[], options: TextRevealOptions = {}) {
    this.container = container;
    this.chars = chars;
    this.range = options.range || [0, 1];
    this.initialOpacities = chars.map((char) => char.style.opacity || '');
    this.initialFilters = chars.map((char) => char.style.filter || '');

    // State Transition: Immediately signal active hydration so CSS fallback keyframe is detached
    if (this.container && typeof this.container.setAttribute === 'function') {
      this.container.setAttribute('data-sc-reveal', 'active');
    }

    if (options.blur) {
      this.maxBlur = typeof options.blur === 'number' ? options.blur : 8;
    }
    if (options.scale !== undefined && options.scale !== 1) {
      this.entryScale = options.scale;
      this.hasKineticTransforms = true;
    }
    if (options.rotateX) {
      this.entryRotateX = options.rotateX;
      this.hasKineticTransforms = true;
    }
    if (options.rotateY) {
      this.entryRotateY = options.rotateY;
      this.hasKineticTransforms = true;
    }
    if (options.slide) {
      this.entrySlide = options.slide;
      this.hasKineticTransforms = true;
    }
  }

  /** Phase 1: capture layout once, never while calculating character values. */
  public measure(): void {
    if (typeof window === 'undefined') return;
    this.containerTop = this.container.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  }

  /** Phase 2: calculate opacity and kinetic values without DOM reads or writes. */
  public update(_scrollY: number, windowHeight: number): void {
    if (!this.container || this.chars.length === 0) return;

    // Element enters screen at windowHeight, and reveals fully around 40% of viewport
    const start = windowHeight;
    const end = windowHeight * 0.4;

    const viewportTop = this.containerTop - _scrollY;
    let rawProgress = mapRange(start, end, 0, 1, viewportTop);
    let progress = clamp(rawProgress, 0, 1);

    progress = mapRange(this.range[0], this.range[1], 0, 1, progress);
    progress = clamp(progress, 0, 1);

    const totalChars = this.chars.length;
    this.opacities.length = totalChars;
    this.progressValues.length = totalChars;

    for (let i = 0; i < totalChars; i++) {
      const charProgressStart = i / totalChars;
      const charProgressEnd = (i + 1) / totalChars;

      const charProgress = clamp(mapRange(charProgressStart, charProgressEnd, 0, 1, progress), 0, 1);
      this.progressValues[i] = charProgress;

      const charOpacity = mapRange(0, 1, 0.1, 1, charProgress);
      this.opacities[i] = clamp(charOpacity, 0.1, 1);
    }
  }

  /** Phase 3: write the values calculated in update. */
  public render(): void {
    const total = this.chars.length;
    for (let i = 0; i < total; i++) {
      const char = this.chars[i];
      if (!char) continue;

      const charProgress = this.progressValues[i] ?? 0;

      // 1. Direct GPU opacity write
      const newOpacity = String(this.opacities[i] ?? 0.1);
      if (char.style.opacity !== newOpacity) {
        char.style.opacity = newOpacity;
      }

      // 2. Atmospheric blur write
      if (this.maxBlur > 0) {
        const currentBlur = lerp(this.maxBlur, 0, charProgress);
        const blurStr = currentBlur > 0.05 ? `blur(${currentBlur.toFixed(2)}px)` : 'none';
        if (char.style.filter !== blurStr) {
          char.style.filter = blurStr;
        }
      }

      // 3. 3D Tilt, Scale & Slide kinetic transform composition
      if (this.hasKineticTransforms) {
        const currentScale = lerp(this.entryScale, 1, charProgress);
        const currentRotateX = lerp(this.entryRotateX, 0, charProgress);
        const currentRotateY = lerp(this.entryRotateY, 0, charProgress);
        const currentSlide = lerp(this.entrySlide, 0, charProgress);

        const transformStr = `translate3d(0, ${currentSlide.toFixed(2)}px, 0) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;
        TransformComposer.set(char, 'text-reveal', transformStr);
      }
    }
  }

  public destroy(): void {
    if (this.container && typeof this.container.removeAttribute === 'function') {
      this.container.removeAttribute('data-sc-reveal');
    }
    this.chars.forEach((char, i) => {
      char.style.opacity = this.initialOpacities[i] ?? '';
      char.style.filter = this.initialFilters[i] ?? '';
      TransformComposer.clear(char, 'text-reveal');
    });
  }
}

