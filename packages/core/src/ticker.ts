/**
 * Zero-Allocation Game Ticker for ScrollCraft
 * Coordinates measure, update, and render phases at 120 FPS.
 * Strictly under 650 LOC.
 */

import { TickerCallback, TickerPhase, TickerTask } from './types';

export class Ticker {
  private static instance: Ticker | null = null;

  private measureTasks: Map<string, TickerCallback> = new Map();
  private updateTasks: Map<string, TickerCallback> = new Map();
  private renderTasks: Map<string, TickerCallback> = new Map();

  private isRunning: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private elapsedTime: number = 0;

  private constructor() {}

  public static get(): Ticker {
    if (!Ticker.instance) {
      Ticker.instance = new Ticker();
    }
    return Ticker.instance;
  }

  /**
   * Register a task in one of three engine phases
   */
  public add(id: string, phase: TickerPhase, callback: TickerCallback): void {
    if (phase === 'measure') {
      this.measureTasks.set(id, callback);
    } else if (phase === 'update') {
      this.updateTasks.set(id, callback);
    } else {
      this.renderTasks.set(id, callback);
    }

    this.ensureRunning();
  }

  /**
   * Remove a registered task
   */
  public remove(id: string): void {
    this.measureTasks.delete(id);
    this.updateTasks.delete(id);
    this.renderTasks.delete(id);

    if (
      this.measureTasks.size === 0 &&
      this.updateTasks.size === 0 &&
      this.renderTasks.size === 0
    ) {
      this.stop();
    }
  }

  private ensureRunning(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning) return;

    // Delta time in seconds, clamped between 1ms and 100ms to prevent huge jumps on tab switch
    const rawDelta = (currentTime - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDelta, 0.001), 0.1);
    this.lastTime = currentTime;
    this.elapsedTime += dt;

    // Phase 1: Read/Measure (Layout reads isolated to prevent thrashing)
    for (const task of this.measureTasks.values()) {
      task(dt, this.elapsedTime);
    }

    // Phase 2: Math/Physics Calculations
    for (const task of this.updateTasks.values()) {
      task(dt, this.elapsedTime);
    }

    // Phase 3: Direct DOM GPU Compositor writes
    for (const task of this.renderTasks.values()) {
      task(dt, this.elapsedTime);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}

export const ticker = Ticker.get();
