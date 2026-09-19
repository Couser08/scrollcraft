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
  /** Initial base opacity for unrevealed characters (0 to 1). Default: 0 */
  baseOpacity?: number;
  /** Viewport trigger start fraction from top of viewport (e.g. 0.80 = 80% of window height). Default: 0.80 */
  triggerStart?: number;
  /** Viewport trigger end fraction from top of viewport (e.g. 0.25 = 25% of window height). Default: 0.25 */
  triggerEnd?: number;
}

export class TextRevealSolver {
  private container: HTMLElement;
  private chars: HTMLElement[];
  private options: TextRevealOptions;
  private range: [number, number];
  private containerTop = 0;
  private stickyContainer: HTMLElement | null = null;
  private stickyStartScroll: number = 0;
  private stickyRunwayDistance: number = 0;
  private opacities: number[] = [];
  private progressValues: number[] = [];
  private initialOpacities: string[] = [];
  private initialFilters: string[] = [];
  private maxBlur: number = 0;
  private entryScale: number = 1;
  private entryRotateX: number = 0;
  private entryRotateY: number = 0;
  private entrySlide: number = 0;
  private baseOpacity: number = 0;
  private hasKineticTransforms: boolean = false;
  private currentProgress: number = -1;
  private lastRenderedProgress: number = -2;

  constructor(container: HTMLElement, chars: HTMLElement[], options: TextRevealOptions = {}) {
    this.container = container;
    this.chars = chars;
    this.options = options;
    this.range = options.range || [0, 1];
    this.baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0;
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
    if (typeof window === 'undefined' || !this.container) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const rect = this.container.getBoundingClientRect();
    this.containerTop = rect.top + scrollTop;

    // Detect if container or an ancestor has position: sticky
    let el: HTMLElement | null = this.container;
    let stickyEl: HTMLElement | null = null;
    const doc = typeof document !== 'undefined' ? document : null;

    while (el && (!doc || (el !== doc.body && el !== doc.documentElement))) {
      const pos =
        el.style?.position ||
        (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function' ? window.getComputedStyle(el)?.position : '');
      if (pos === 'sticky') {
        stickyEl = el;
        break;
      }
      el = el.parentElement;
    }

    this.stickyContainer = stickyEl;

    if (stickyEl && stickyEl.parentElement) {
      const parent = stickyEl.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const parentTop = parentRect.top + scrollTop;
      const parentHeight = parent.offsetHeight || parentRect.height || 0;
      const stickyHeight = stickyEl.offsetHeight || stickyEl.getBoundingClientRect().height || 0;

      const computedTop =
        typeof window.getComputedStyle === 'function'
          ? parseFloat(window.getComputedStyle(stickyEl).top) || 0
          : 0;

      this.stickyStartScroll = parentTop + stickyEl.offsetTop - computedTop;
      this.stickyRunwayDistance = Math.max(0, parentHeight - stickyHeight);
    }
  }

  /** Phase 2: calculate opacity and kinetic values without DOM reads or writes. */
  public update(_scrollY: number, windowHeight: number): void {
    if (!this.container || this.chars.length === 0) return;

    let progress = 0;

    if (this.stickyContainer && this.stickyRunwayDistance > 100) {
      // Pinned sticky mode: progress tracks scroll through sticky runway
      const runwayProgress = (_scrollY - this.stickyStartScroll) / this.stickyRunwayDistance;
      progress = clamp(runwayProgress, 0, 1);
    } else {
      // Normal reading zone in viewport:
      // Default: starts at 80% of windowHeight (comfortably above bottom/taskbar)
      // and completes around 25% of windowHeight (natural reading zone)
      const triggerStart = this.options.triggerStart ?? 0.80;
      const triggerEnd = this.options.triggerEnd ?? 0.25;

      const start = windowHeight * triggerStart;
      const end = windowHeight * triggerEnd;

      const viewportTop = this.containerTop - _scrollY;
      const rawProgress = mapRange(start, end, 0, 1, viewportTop);
      progress = clamp(rawProgress, 0, 1);
    }

    if (this.range[0] !== 0 || this.range[1] !== 1) {
      progress = clamp(mapRange(this.range[0], this.range[1], 0, 1, progress), 0, 1);
    }

    this.currentProgress = progress;

    const totalChars = this.chars.length;
    this.opacities.length = totalChars;
    this.progressValues.length = totalChars;

    // Smooth staggered reveal with soft kinetic overlap between adjacent characters
    const overlap = 0.25;
    const stepSize = (1 - overlap) / Math.max(1, totalChars);

    for (let i = 0; i < totalChars; i++) {
      const charStart = i * stepSize;
      const charEnd = Math.min(1, charStart + stepSize + overlap);

      const charProgress = clamp(mapRange(charStart, charEnd, 0, 1, progress), 0, 1);
      this.progressValues[i] = charProgress;

      const charOpacity = mapRange(0, 1, this.baseOpacity, 1, charProgress);
      this.opacities[i] = clamp(charOpacity, this.baseOpacity, 1);
    }
  }

  /** Phase 3: write the values calculated in update with zero-overhead settled character gating. */
  public render(): void {
    if (this.currentProgress === this.lastRenderedProgress) return;
    this.lastRenderedProgress = this.currentProgress;

    const total = this.chars.length;
    for (let i = 0; i < total; i++) {
      const char = this.chars[i];
      if (!char) continue;

      const charProgress = this.progressValues[i] ?? 0;
      const targetOpacity = this.opacities[i] ?? this.baseOpacity;
      const newOpacity = String(targetOpacity);

      // Fast-path: skip characters that are already settled at fully-revealed (1) or fully-hidden (0)
      if (charProgress >= 1 && char.style.opacity === '1' && !this.hasKineticTransforms) {
        continue;
      }
      if (charProgress <= 0 && char.style.opacity === newOpacity && !this.hasKineticTransforms) {
        continue;
      }

      // 1. Direct GPU opacity write
      if (char.style.opacity !== newOpacity) {
        char.style.opacity = newOpacity;
      }

      // 2. Atmospheric blur write
      if (this.maxBlur > 0) {
        const currentBlur = lerp(this.maxBlur, 0, charProgress);
        const blurStr = currentBlur > 0.5 ? `blur(${currentBlur.toFixed(1)}px)` : '';
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

        TransformComposer.set(char, 'text-reveal', {
          y: currentSlide,
          rotateX: currentRotateX,
          rotateY: currentRotateY,
          scale: currentScale !== 1 ? currentScale : undefined,
        });
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

