/**
 * Dynamic Velocity Marquee Solver for ScrollCraft
 * Infinite scrolling track that accelerates based on scroll velocity.
 * Strictly under 650 LOC.
 */

import { ScrollDriver, DriverState } from './driver';
import { clamp, lerp } from './math';

export interface MarqueeOptions {
  baseSpeed?: number;
  velocityMultiplier?: number;
  direction?: 'left' | 'right';
  maxSpeed?: number;
}

export interface MarqueeState extends DriverState {
  position: number;
}

export class VelocityMarqueeSolver implements ScrollDriver {
  private state: MarqueeState = { position: 0 };
  private elementWidth: number = 0;
  private currentSpeed: number = 0;

  constructor(
    private element: HTMLElement,
    private options: Required<MarqueeOptions> = {
      baseSpeed: 1,
      velocityMultiplier: 0.05,
      direction: 'left',
      maxSpeed: 50
    }
  ) {
    this.options.baseSpeed = options.baseSpeed ?? 1;
    this.options.velocityMultiplier = options.velocityMultiplier ?? 0.05;
    this.options.direction = options.direction ?? 'left';
    this.options.maxSpeed = options.maxSpeed ?? 50;

    this.measure();
  }

  public measure(): void {
    // Read the width of the first child to know the modulo wrapping point
    const firstChild = this.element.firstElementChild as HTMLElement;
    if (firstChild) {
      this.elementWidth = firstChild.getBoundingClientRect().width;
    }
  }

  public update(scrollY: number, velocity: number = 0): MarqueeState {
    if (this.elementWidth === 0) return this.state;

    // The target speed is base + (scroll velocity * multiplier)
    const rawTargetSpeed = this.options.baseSpeed + (Math.abs(velocity) * this.options.velocityMultiplier);
    const targetSpeed = clamp(rawTargetSpeed, this.options.baseSpeed, this.options.maxSpeed);

    // Smooth damp the speed so it decays nicely
    this.currentSpeed = lerp(this.currentSpeed, targetSpeed, 0.1);

    const dirMultiplier = this.options.direction === 'left' ? -1 : 1;
    
    this.state.position += this.currentSpeed * dirMultiplier;

    // Infinite loop wrap
    if (this.options.direction === 'left' && this.state.position <= -this.elementWidth) {
      this.state.position += this.elementWidth;
    } else if (this.options.direction === 'right' && this.state.position >= 0) {
      this.state.position -= this.elementWidth;
    }

    return this.state;
  }

  public render(): void {
    // 3D translate for hardware acceleration
    this.element.style.transform = `translate3d(${this.state.position.toFixed(2)}px, 0, 0)`;
  }

  public getState(): MarqueeState {
    return this.state;
  }

  public destroy(): void {
    this.element.style.transform = '';
  }
}
