/**
 * Zero-Allocation Game Ticker for ScrollCraft
 * Coordinates measure, update, and render phases at 120 FPS.
 * Strictly under 650 LOC.
 */

import { TickerCallback, TickerErrorHandler, TickerPhase } from './types';

export const MIN_DELTA_TIME = 0.001;
export const MAX_DELTA_TIME = 0.033;

export class Ticker {
  private static instance: Ticker | null = null;

  private measureTasks: Map<string, TickerCallback> = new Map();
  private updateTasks: Map<string, TickerCallback> = new Map();
  private renderTasks: Map<string, TickerCallback> = new Map();

  private measureTasksArray: Array<[string, TickerCallback]> = [];
  private updateTasksArray: Array<[string, TickerCallback]> = [];
  private renderTasksArray: Array<[string, TickerCallback]> = [];
  private taskArraysDirty = true;
  private errorHandler: TickerErrorHandler | null = null;

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
    if (!this.taskArraysDirty) return;
    this.measureTasksArray = Array.from(this.measureTasks.entries());
    this.updateTasksArray = Array.from(this.updateTasks.entries());
    this.renderTasksArray = Array.from(this.renderTasks.entries());
    this.taskArraysDirty = false;
  }

  /**
   * Register a task in one of three engine phases.
   * Tasks in different phases with the same id do not overwrite each other.
   */
  public add(id: string, phase: TickerPhase, callback: TickerCallback): void {
    const tasks = phase === 'measure'
      ? this.measureTasks
      : phase === 'update'
        ? this.updateTasks
        : this.renderTasks;
    if (tasks.get(id) === callback) {
      this.ensureRunning();
      return;
    }
    tasks.set(id, callback);
    this.taskArraysDirty = true;
    this.ensureRunning();
  }

  /**
   * Remove a registered task. If phase is omitted, removes from all phases.
   */
  public remove(id: string, phase?: TickerPhase): void {
    if (phase) {
      const tasks = phase === 'measure'
        ? this.measureTasks
        : phase === 'update'
          ? this.updateTasks
          : this.renderTasks;
      tasks.delete(id);
    } else {
      this.measureTasks.delete(id);
      this.updateTasks.delete(id);
      this.renderTasks.delete(id);
    }
    this.taskArraysDirty = true;

    if (
      this.measureTasks.size === 0 &&
      this.updateTasks.size === 0 &&
      this.renderTasks.size === 0
    ) {
      this.stop();
    }
  }

  /** Reports task failures without allowing one consumer to stop the engine. */
  public setErrorHandler(handler: TickerErrorHandler | null): void {
    this.errorHandler = handler;
  }

  private runPhase(
    phase: TickerPhase,
    map: Map<string, TickerCallback>,
    tasks: Array<[string, TickerCallback]>,
    dt: number,
    currentTime: number
  ): void {
    for (let i = 0; i < tasks.length; i++) {
      const [id, callback] = tasks[i];
      // Guard: skip task if it was removed earlier in this frame
      if (!map.has(id)) continue;
      try {
        callback(dt, this.elapsedTime, currentTime);
      } catch (error) {
        try {
          if (this.errorHandler) {
            this.errorHandler({ id, phase, error });
          } else if (typeof console !== 'undefined') {
            console.error(`[ScrollCraft] ticker task "${id}" failed during ${phase}.`, error);
          }
        } catch {
          // Diagnostics must never be able to interrupt the RAF loop either.
        }
      }
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
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.tick);
    }
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
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.rafId);
      }
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
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('measure', this.measureTasks, this.measureTasksArray, dt, currentTime);

    // Phase 2: Math/Physics Calculations
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('update', this.updateTasks, this.updateTasksArray, dt, currentTime);

    // Phase 3: Direct DOM GPU Compositor writes
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('render', this.renderTasks, this.renderTasksArray, dt, currentTime);

    if (this.isRunning && typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };
}

export const ticker = Ticker.get();
