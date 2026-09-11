import { clamp, damp } from './math';
import { TimelineSolver, PropertyTimeline, KeyframeSegment } from './timeline';

export interface TransformProperties {
  x?: [number, number] | number[];
  y?: [number, number] | number[];
  z?: [number, number] | number[];
  scale?: [number, number] | number[];
  scaleX?: [number, number] | number[];
  scaleY?: [number, number] | number[];
  rotate?: [number, number] | number[];
  rotateX?: [number, number] | number[];
  rotateY?: [number, number] | number[];
  rotateZ?: [number, number] | number[];
  skewX?: [number, number] | number[];
  skewY?: [number, number] | number[];
  opacity?: [number, number] | number[];
  blur?: [number, number] | number[];
  borderRadius?: [number, number] | number[];
}

export interface TransformSolverOptions {
  start?: string; // 'top bottom', 'center center', etc.
  end?: string;
  properties: TransformProperties;
  scrub?: boolean | number;
  snap?: boolean;
  onSnap?: (targetScroll: number) => void;
}

export class TransformSolver {
  private element: HTMLElement;
  private options: TransformSolverOptions;
  
  private startY: number = 0;
  private endY: number = 0;
  
  private progress: number = 0;
  private targetProgress: number = 0;
  
  private timeline: PropertyTimeline = {};
  private currentValues: Record<string, number> = {};
  private targetValues: Record<string, number> = {};
  
  private isVisible: boolean = false;
  private wasVisible: boolean = false;

  private snapTimeout: number | null = null;

  constructor(element: HTMLElement, options: TransformSolverOptions) {
    this.element = element;
    this.options = {
      start: options.start ?? 'top bottom',
      end: options.end ?? 'bottom top',
      ...options,
    };
    
    this.buildTimeline();
  }

  private buildTimeline() {
    for (const [key, values] of Object.entries(this.options.properties)) {
      if (!values || values.length < 2) continue;
      
      const segments: KeyframeSegment[] = [];
      const step = 1 / (values.length - 1);
      
      for (let i = 0; i < values.length - 1; i++) {
        segments.push({
          from: i * step,
          to: (i + 1) * step,
          startValue: values[i] as number,
          endValue: values[i + 1] as number,
        });
      }
      this.timeline[key] = segments;
      this.currentValues[key] = values[0] as number;
      this.targetValues[key] = values[0] as number;
    }
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
    
    // Clear transform for accurate measurement
    const prevTransform = this.element.style.transform;
    this.element.style.transform = '';
    
    const rect = this.element.getBoundingClientRect();
    const wh = window.innerHeight;
    
    this.startY = this.parseTrigger(this.options.start!, rect, wh);
    this.endY = this.parseTrigger(this.options.end!, rect, wh);
    
    if (this.options.end?.startsWith('+=')) {
        this.endY = this.startY + parseFloat(this.options.end.replace('+=', ''));
    }
    
    // Restore transform
    this.element.style.transform = prevTransform;
  }

  public update(scrollY: number, velocity: number, dt: number, isReducedMotion: boolean = false): void {
    if (this.startY === this.endY) return;
    
    // Calculate raw progress
    let rawProgress = (scrollY - this.startY) / (this.endY - this.startY);
    rawProgress = clamp(rawProgress, 0, 1);
    
    this.targetProgress = rawProgress;
    
    // Snapping logic
    if (this.options.snap && this.options.onSnap) {
      if (Math.abs(velocity) < 10) {
        if (!this.snapTimeout && rawProgress > 0 && rawProgress < 1) {
          this.snapTimeout = window.setTimeout(() => {
            const nearestProgress = rawProgress > 0.5 ? 1 : 0;
            const targetScroll = this.startY + nearestProgress * (this.endY - this.startY);
            this.options.onSnap!(targetScroll);
            this.snapTimeout = null;
          }, 150);
        }
      } else if (this.snapTimeout) {
        window.clearTimeout(this.snapTimeout);
        this.snapTimeout = null;
      }
    }
    
    if (isReducedMotion) {
      this.progress = 1;
      this.targetValues = TimelineSolver.evaluateTimeline(this.timeline, 1, this.targetValues);
      Object.assign(this.currentValues, this.targetValues);
      return;
    }
    
    // Scrub damping
    const scrub = this.options.scrub;
    if (typeof scrub === 'number' && scrub > 0) {
       this.progress = damp(this.progress, this.targetProgress, scrub, dt);
    } else {
       this.progress = this.targetProgress;
    }
    
    this.targetValues = TimelineSolver.evaluateTimeline(this.timeline, this.progress, this.targetValues);
    
    // Quick assign for non-scrub or zero delta
    if (scrub === false || scrub === 0) {
        Object.assign(this.currentValues, this.targetValues);
    } else {
        for (const key in this.targetValues) {
            this.currentValues[key] = damp(this.currentValues[key], this.targetValues[key], typeof scrub === 'number' ? scrub : 15, dt);
        }
    }
    
    this.isVisible = this.progress > 0 && this.progress < 1;
  }

  public render(): void {
    // Only flush styles if visible or just exited visibility
    if (!this.isVisible && !this.wasVisible && this.progress === 0) return;
    
    const v = this.currentValues;
    let transformStr = '';
    
    if (v.x !== undefined || v.y !== undefined || v.z !== undefined) {
      transformStr += `translate3d(${v.x || 0}px, ${v.y || 0}px, ${v.z || 0}px) `;
    }
    if (v.scale !== undefined) transformStr += `scale(${v.scale}) `;
    if (v.scaleX !== undefined) transformStr += `scaleX(${v.scaleX}) `;
    if (v.scaleY !== undefined) transformStr += `scaleY(${v.scaleY}) `;
    if (v.rotate !== undefined) transformStr += `rotate(${v.rotate}deg) `;
    if (v.rotateX !== undefined) transformStr += `rotateX(${v.rotateX}deg) `;
    if (v.rotateY !== undefined) transformStr += `rotateY(${v.rotateY}deg) `;
    if (v.rotateZ !== undefined) transformStr += `rotateZ(${v.rotateZ}deg) `;
    if (v.skewX !== undefined) transformStr += `skewX(${v.skewX}deg) `;
    if (v.skewY !== undefined) transformStr += `skewY(${v.skewY}deg) `;
    
    if (transformStr) {
      this.element.style.transform = transformStr.trim();
    }
    
    if (v.opacity !== undefined) this.element.style.opacity = v.opacity.toString();
    if (v.blur !== undefined) this.element.style.filter = `blur(${v.blur}px)`;
    if (v.borderRadius !== undefined) this.element.style.borderRadius = `${v.borderRadius}px`;
    
    // Manage will-change
    if (this.isVisible && !this.wasVisible) {
      this.element.style.willChange = 'transform, opacity, filter';
    } else if (!this.isVisible && this.wasVisible) {
      this.element.style.willChange = '';
    }
    
    this.wasVisible = this.isVisible;
  }

  public destroy(): void {
    if (this.snapTimeout) {
      window.clearTimeout(this.snapTimeout);
    }
    this.element.style.willChange = '';
  }
}
