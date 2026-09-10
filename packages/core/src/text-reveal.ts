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

  constructor(container: HTMLElement, chars: HTMLElement[], options: TextRevealOptions = {}) {
    this.container = container;
    this.chars = chars;
    this.range = options.range || [0, 1];
  }

  /**
   * Called during the 'update' phase of the Ticker.
   * Calculates what portion of the text should be revealed.
   */
  public update(scrollY: number, windowHeight: number) {
    if (!this.container || this.chars.length === 0) return;

    const rect = this.container.getBoundingClientRect();
    
    // Element enters screen at windowHeight, and we consider it "revealed" fully 
    // when it reaches slightly above the middle of the screen
    const start = windowHeight; 
    const end = windowHeight * 0.4; 
    
    // Map bounding rect top to a 0-1 progress value
    let rawProgress = mapRange(start, end, 0, 1, rect.top);
    let progress = clamp(rawProgress, 0, 1);

    // Apply specific user range if defined
    progress = mapRange(this.range[0], this.range[1], 0, 1, progress);
    progress = clamp(progress, 0, 1);

    const totalChars = this.chars.length;
    
    // Direct DOM write (0 re-renders)
    for (let i = 0; i < totalChars; i++) {
      const char = this.chars[i];
      const charProgressStart = i / totalChars;
      const charProgressEnd = (i + 1) / totalChars;
      
      const charOpacity = mapRange(charProgressStart, charProgressEnd, 0.1, 1, progress);
      const clampedOpacity = clamp(charOpacity, 0.1, 1);
      
      // Setting inline style avoids React diffing entirely
      char.style.opacity = clampedOpacity.toString();
    }
  }

  public destroy() {
    this.chars.forEach(char => {
      char.style.opacity = '1';
    });
  }
}
