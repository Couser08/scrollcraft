import { clamp, damp } from './math';

export interface DrawSolverOptions {
  start?: string; // 'top bottom', 'center center', etc.
  end?: string;
  scrub?: boolean | number;
  direction?: 'forward' | 'reverse' | 'bidirectional';
}

export class DrawSolver {
  private element: SVGGeometryElement;
  private options: DrawSolverOptions;
  
  private startY: number = 0;
  private endY: number = 0;
  
  private progress: number = 0;
  private targetProgress: number = 0;
  
  private totalLength: number = 0;
  private isVisible: boolean = false;
  private wasVisible: boolean = false;
  private hasDrawn: boolean = false;

  constructor(element: SVGGeometryElement, options: DrawSolverOptions) {
    this.element = element;
    this.options = {
      start: options.start ?? 'top bottom',
      end: options.end ?? 'bottom top',
      direction: options.direction ?? 'forward',
      scrub: options.scrub ?? true,
    };
  }

  private parseTrigger(trigger: string, rect: DOMRect, windowHeight: number): number {
    const parts = trigger.split(' ');
    const elAlign = parts[0] || 'top';
    const vpAlign = parts[1] || 'bottom';
    
    const scrollTop = window.scrollY || window.pageYOffset;
    const elementTopAbs = rect.top + scrollTop;
    
    let elOffset = 0;
    if (elAlign === 'center') elOffset = rect.height / 2;
    else if (elAlign === 'bottom') elOffset = rect.height;
    else if (elAlign.endsWith('%')) elOffset = rect.height * (parseFloat(elAlign) / 100);
    else if (elAlign.endsWith('px')) elOffset = parseFloat(elAlign);
    
    let vpOffset = 0;
    if (vpAlign === 'center') vpOffset = windowHeight / 2;
    else if (vpAlign === 'bottom') vpOffset = windowHeight;
    else if (vpAlign.endsWith('%')) vpOffset = windowHeight * (parseFloat(vpAlign) / 100);
    else if (vpAlign.endsWith('px')) vpOffset = parseFloat(vpAlign);
    else if (vpAlign.startsWith('+=') || vpAlign.startsWith('-=')) {
      return elementTopAbs + elOffset + parseFloat(vpAlign.replace('=', ''));
    }
    
    return elementTopAbs + elOffset - vpOffset;
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    const rect = this.element.getBoundingClientRect();
    const wh = window.innerHeight;
    
    this.startY = this.parseTrigger(this.options.start!, rect, wh);
    this.endY = this.parseTrigger(this.options.end!, rect, wh);
    
    if (this.options.end?.startsWith('+=')) {
        this.endY = this.startY + parseFloat(this.options.end.replace('+=', ''));
    }

    if (this.element.getTotalLength) {
      this.totalLength = this.element.getTotalLength();
      
      // Initialize offset correctly based on direction
      if (!this.hasDrawn) {
        this.element.style.strokeDasharray = `${this.totalLength} ${this.totalLength}`;
        if (this.options.direction === 'reverse') {
          this.element.style.strokeDashoffset = `-${this.totalLength}`;
        } else {
          this.element.style.strokeDashoffset = `${this.totalLength}`;
        }
      }
    }
  }

  public update(scrollY: number, _velocity: number, dt: number, isReducedMotion: boolean = false): void {
    if (this.startY === this.endY || this.totalLength === 0) return;
    
    // Calculate raw progress
    let rawProgress = (scrollY - this.startY) / (this.endY - this.startY);
    rawProgress = clamp(rawProgress, 0, 1);
    
    if (isReducedMotion) {
      this.progress = 1;
      return;
    }
    
    if (this.options.scrub) {
      this.targetProgress = rawProgress;
      const scrub = this.options.scrub;
      if (typeof scrub === 'number' && scrub > 0) {
         this.progress = damp(this.progress, this.targetProgress, scrub, dt);
      } else {
         this.progress = this.targetProgress;
      }
    } else {
      // If no scrub, trigger play once when scrolled into view
      if (rawProgress > 0) {
        this.targetProgress = 1;
      }
      this.progress = damp(this.progress, this.targetProgress, 5, dt); // Default ease
    }
    
    this.isVisible = this.progress > 0 && this.progress < 1;
  }

  public render(): void {
    if (this.totalLength === 0) return;
    // Only flush styles if visible or just exited visibility or first time
    if (!this.isVisible && !this.wasVisible && this.progress === 0 && this.hasDrawn) return;
    
    let offset = 0;
    
    if (this.options.direction === 'reverse') {
      offset = -this.totalLength * (1 - this.progress);
    } else if (this.options.direction === 'bidirectional') {
      // Start from center
      this.element.style.strokeDasharray = `${this.totalLength} ${this.totalLength}`;
      offset = this.totalLength * (1 - this.progress);
      // For bidirectional, you typically draw from middle or both ends, 
      // but simpler to just do standard draw. We'll map bidirectional to standard for now 
      // since strokeDashoffset is 1D.
    } else {
      offset = this.totalLength * (1 - this.progress);
    }
    
    this.element.style.strokeDashoffset = `${offset}`;
    
    this.hasDrawn = true;
    this.wasVisible = this.isVisible;
  }

  public destroy(): void {
    this.element.style.strokeDasharray = '';
    this.element.style.strokeDashoffset = '';
  }
}
