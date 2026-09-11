/**
 * 120 FPS Direct DOM Text Reveal Solver
 * Splitting text is handled by the framework layer. This manages physics and opacities.
 * Strictly under 650 LOC.
 */

import { mapRange, clamp } from './math';

export interface TextRevealOptions {
  /** Offset start and end progress (0 to 1) relative to container viewport intersection */
  range?: [number, number];
}

export class TextRevealSolver {
  private container: HTMLElement;
  private chars: HTMLElement[];
  private range: [number, number];
  private containerTop = 0;
  private opacities: number[] = [];

  constructor(container: HTMLElement, chars: HTMLElement[], options: TextRevealOptions = {}) {
    this.container = container;
    this.chars = chars;
    this.range = options.range || [0, 1];
  }

  /** Phase 1: capture layout once, never while calculating character values. */
  public measure(): void {
    if (typeof window === 'undefined') return;
    this.containerTop = this.container.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  }

  /** Phase 2: calculate opacity values without DOM reads or writes. */
  public update(_scrollY: number, windowHeight: number): void {
    if (!this.container || this.chars.length === 0) return;
    
    // Element enters screen at windowHeight, and we consider it "revealed" fully 
    // when it reaches slightly above the middle of the screen
    const start = windowHeight; 
    const end = windowHeight * 0.4; 
    
    // Map bounding rect top to a 0-1 progress value
    const viewportTop = this.containerTop - _scrollY;
    let rawProgress = mapRange(start, end, 0, 1, viewportTop);
    let progress = clamp(rawProgress, 0, 1);

    // Apply specific user range if defined
    progress = mapRange(this.range[0], this.range[1], 0, 1, progress);
    progress = clamp(progress, 0, 1);

    const totalChars = this.chars.length;
    
    this.opacities.length = totalChars;
    for (let i = 0; i < totalChars; i++) {
      const charProgressStart = i / totalChars;
      const charProgressEnd = (i + 1) / totalChars;
      
      const charOpacity = mapRange(charProgressStart, charProgressEnd, 0.1, 1, progress);
      const clampedOpacity = clamp(charOpacity, 0.1, 1);
      
      this.opacities[i] = clampedOpacity;
    }
  }

  /** Phase 3: write the values calculated in update. */
  public render(): void {
    for (let i = 0; i < this.chars.length; i++) {
      const newOpacity = String(this.opacities[i] ?? 0.1);
      if (this.chars[i].style.opacity !== newOpacity) {
        this.chars[i].style.opacity = newOpacity;
      }
    }
  }

  public destroy() {
    this.chars.forEach(char => {
      char.style.opacity = '';
    });
  }
}
