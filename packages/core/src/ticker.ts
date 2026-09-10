/**
 * Zero-Allocation Game Ticker for ScrollCraft
 * Coordinates measure, update, and render phases at 120 FPS.
 * Strictly under 650 LOC.
 */

import { TickerCallback, TickerPhase } from './types';

export const MIN_DELTA_TIME = 0.001;
export const MAX_DELTA_TIME = 0.033;

export class Ticker {
  private static instance: Ticker | null = null;

  private measureTasks: Map<string, TickerCallback> = new Map();
  private updateTasks: Map<string, TickerCallback> = new Map();
  private renderTasks: Map<string, TickerCallback> = new Map();

  private measureTasksArray: TickerCallback[] = [];
  private updateTasksArray: TickerCallback[] = [];
  private renderTasksArray: TickerCallback[] = [];

  private isRunning: boolean = false;
  private visibilityBound: boolean = false;
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

  private syncTaskArrays(): void {
    this.measureTasksArray = Array.from(this.measureTasks.values());
    this.updateTasksArray = Array.from(this.updateTasks.values());
    this.renderTasksArray = Array.from(this.renderTasks.values());
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

    this.syncTaskArrays();
    this.ensureRunning();
  }

  /**
   * Remove a registered task
   */
  public remove(id: string): void {
    this.measureTasks.delete(id);
    this.updateTasks.delete(id);
    this.renderTasks.delete(id);

    this.syncTaskArrays();

    if (
      this.measureTasks.size === 0 &&
      this.updateTasks.size === 0 &&
      this.renderTasks.size === 0
    ) {
      this.stop();
    }
  }

  public ensureRunning(): void {
    if (typeof window === 'undefined') return;

    if (!this.visibilityBound && typeof document !== 'undefined') {
      this.visibilityBound = true;
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private onVisibilityChange = (): void => {
    if (typeof document !== 'undefined' && !document.hidden) {
      // Reset clock to prevent deltaTime spike upon returning to tab
      this.lastTime = performance.now();
    }
  };

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning) return;

    // Delta time in seconds, clamped between 1ms and 33ms to prevent huge jumps on tab switch
    const rawDelta = (currentTime - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDelta, MIN_DELTA_TIME), MAX_DELTA_TIME);
    this.lastTime = currentTime;
    this.elapsedTime += dt;

    // Phase 1: Read/Measure (Layout reads isolated to prevent thrashing)
    const mTasks = this.measureTasksArray;
    for (let i = 0; i < mTasks.length; i++) {
      mTasks[i](dt, this.elapsedTime, currentTime);
    }

    // Phase 2: Math/Physics Calculations
    const uTasks = this.updateTasksArray;
    for (let i = 0; i < uTasks.length; i++) {
      uTasks[i](dt, this.elapsedTime, currentTime);
    }

    // Phase 3: Direct DOM GPU Compositor writes
    const rTasks = this.renderTasksArray;
    for (let i = 0; i < rTasks.length; i++) {
      rTasks[i](dt, this.elapsedTime, currentTime);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}

export const ticker = Ticker.get();
