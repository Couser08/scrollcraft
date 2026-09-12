/**
 * Zero-Allocation Autonomous Game Ticker for ScrollCraft
 * Coordinates measure, update, and render phases at 120 FPS.
 * Features:
 * - Dynamic dormancy / viewport culling task management
 * - 60-frame asymmetric hysteresis performance sampler
 * - Background tab suspension with mid-scroll unhide recovery
 * - Idle sleep and passive gesture wake-up
 * Strictly under 650 LOC.
 */

import { TickerCallback, TickerErrorHandler, TickerPhase } from './types';
import { tierStore } from './feature-detection';

export const MIN_DELTA_TIME = 0.001;
export const MAX_DELTA_TIME = 0.033;
const COOLDOWN_STEP_UP_MS = 3000;

export class Ticker {
  private static instance: Ticker | null = null;

  private measureTasks: Map<string, TickerCallback> = new Map();
  private updateTasks: Map<string, TickerCallback> = new Map();
  private renderTasks: Map<string, TickerCallback> = new Map();

  private measureTasksArray: Array<[string, TickerCallback]> = [];
  private updateTasksArray: Array<[string, TickerCallback]> = [];
  private renderTasksArray: Array<[string, TickerCallback]> = [];
  private taskArraysDirty = true;
  private dormantTasks: Set<string> = new Set();
  private errorHandler: TickerErrorHandler | null = null;

  private isRunning: boolean = false;
  private eventsBound: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private elapsedTime: number = 0;

  // Frame sampler for runtime self-healing
  private frameHistory: number[] = new Array(60).fill(0.016);
  private frameHistoryIndex: number = 0;
  private sampledFrameCount: number = 0;
  private lastStepTime: number = 0;

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
    this.dormantTasks.delete(id);
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
      this.dormantTasks.delete(id);
    }
    this.taskArraysDirty = true;

    if (!this.hasActiveTasks()) {
      this.stop();
    }
  }

  /**
   * Puts a registered task to sleep (e.g. element is scrolled out of viewport).
   */
  public pauseTask(id: string): void {
    this.dormantTasks.add(id);
    if (!this.hasActiveTasks()) {
      this.stop();
    }
  }

  /**
   * Wakes up a dormant task when its element enters the visibility overdraw margin.
   */
  public resumeTask(id: string): void {
    if (this.dormantTasks.delete(id)) {
      this.ensureRunning();
    }
  }

  public isTaskDormant(id: string): boolean {
    return this.dormantTasks.has(id);
  }

  /**
   * Checks whether any tasks are currently registered and not dormant.
   */
  public hasActiveTasks(): boolean {
    const totalCount = this.measureTasks.size + this.updateTasks.size + this.renderTasks.size;
    if (totalCount === 0) return false;

    for (const id of this.measureTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    for (const id of this.updateTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    for (const id of this.renderTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    return false;
  }

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
      // Guard: skip task if removed or marked dormant by visibility culling
      if (!map.has(id) || this.dormantTasks.has(id)) continue;
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
          // Diagnostics must never interrupt the RAF loop
        }
      }
    }
  }

  public ensureRunning(): void {
    if (typeof window === 'undefined') return;

    if (!this.eventsBound && typeof document !== 'undefined') {
      this.eventsBound = true;
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      
      // Passive wake listeners for zero-power idle sleep
      const wake = () => this.wake();
      window.addEventListener('wheel', wake, { passive: true });
      window.addEventListener('touchstart', wake, { passive: true });
      window.addEventListener('scroll', wake, { passive: true });
      window.addEventListener('keydown', wake, { passive: true });
    }

    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  public wake(): void {
    if (this.hasActiveTasks()) {
      this.ensureRunning();
    }
  }

  private onVisibilityChange = (): void => {
    if (typeof document === 'undefined') return;

    if (document.hidden) {
      // Invariant 3: Halt ticker completely in background tabs
      this.stop();
    } else {
      // Invariant 3: Wipe 60-frame buffer completely and reset clock
      this.resetFrameHistory();
      this.lastTime = performance.now();

      // Invariant 3 (User comment Issue 2): If active tasks exist, resume immediately
      if (this.hasActiveTasks()) {
        this.ensureRunning();
      }
    }
  };

  private resetFrameHistory(): void {
    this.frameHistory.fill(0.016);
    this.frameHistoryIndex = 0;
    this.sampledFrameCount = 0;
  }

  private recordFrameDelta(rawDelta: number, currentTime: number): void {
    this.frameHistory[this.frameHistoryIndex] = rawDelta;
    this.frameHistoryIndex = (this.frameHistoryIndex + 1) % 60;
    this.sampledFrameCount++;

    if (this.sampledFrameCount >= 60) {
      let slowFrames = 0;
      let fastFrames = 0;

      for (let i = 0; i < 60; i++) {
        const d = this.frameHistory[i];
        if (d > 0.0333) slowFrames++;
        if (d < 0.0180) fastFrames++;
      }

      const currentTier = tierStore.getTier();

      // Step-Down: Sustained delta > 33.3ms for >= 45 of 60 frames
      if (slowFrames >= 45 && currentTier !== 'low') {
        const nextTier = currentTier === 'high' ? 'balanced' : 'low';
        tierStore.setTier(nextTier);
        this.lastStepTime = currentTime;
        this.resetFrameHistory();
      } else if (
        fastFrames >= 50 &&
        currentTier !== 'high' &&
        currentTime - this.lastStepTime >= COOLDOWN_STEP_UP_MS
      ) {
        // Step-Up: Sustained delta < 18ms for >= 50 of 60 frames AND 3.0s cooldown passed
        const nextTier = currentTier === 'low' ? 'balanced' : 'high';
        tierStore.setTier(nextTier);
        this.lastStepTime = currentTime;
        this.resetFrameHistory();
      }
    }
  }

  /**
   * Returns current rolling frame rate and frame time in milliseconds.
   * Single source of truth for HUDs, DevTools, and performance telemetry.
   */
  public getFrameRate(): { fps: number; frameMs: number } {
    const count = Math.min(this.sampledFrameCount, 60);
    if (count === 0) {
      return { fps: 60, frameMs: 16.7 };
    }
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += this.frameHistory[i];
    }
    const avgDelta = sum / count;
    const frameMs = Math.round(avgDelta * 1000 * 10) / 10;
    const fps = avgDelta > 0 ? Math.min(Math.round(1 / avgDelta), 360) : 60;
    return { fps, frameMs };
  }

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

    // Delta time in seconds, clamped between 1ms and 33ms
    const rawDelta = (currentTime - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDelta, MIN_DELTA_TIME), MAX_DELTA_TIME);
    this.lastTime = currentTime;
    this.elapsedTime += dt;

    // Phase 1: Read/Measure (Layout reads isolated)
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('measure', this.measureTasks, this.measureTasksArray, dt, currentTime);

    // Phase 2: Math/Physics Calculations (Decoupled frame sampling)
    this.recordFrameDelta(rawDelta, currentTime);
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('update', this.updateTasks, this.updateTasksArray, dt, currentTime);

    // Phase 3: Direct DOM GPU Compositor writes
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('render', this.renderTasks, this.renderTasksArray, dt, currentTime);

    // Check if tasks settled/went dormant
    if (this.isRunning && this.hasActiveTasks()) {
      if (typeof requestAnimationFrame !== 'undefined') {
        this.rafId = requestAnimationFrame(this.tick);
      }
    } else {
      this.stop();
    }
  };
}

export const ticker = Ticker.get();
