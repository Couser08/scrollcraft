/**
 * Core Type Definitions for ScrollCraft Game-Dev Engine
 * Strictly under 650 LOC.
 */

export type TickerPhase = 'measure' | 'update' | 'render';

export type TickerCallback = (deltaTime: number, elapsedTime: number) => void;

export interface TickerTask {
  id: string;
  phase: TickerPhase;
  callback: TickerCallback;
}

export interface InertiaConfig {
  /** Damping / lerp factor (0.01 to 0.2). Higher = snappier, lower = floatier. Default: 0.1 */
  lerp?: number;
  /** Duration in seconds for easing animation if lerp is not used */
  duration?: number;
  /** Easing function (t: 0-1) => number */
  easing?: (t: number) => number;
  /** Whether mouse wheel scrolling is smoothed. Default: true */
  smoothWheel?: boolean;
  /** Whether touch scrolling maintains inertia sync. Default: false */
  syncTouch?: boolean;
  /** Auto-resize on window resize. Default: true */
  autoResize?: boolean;
}

export interface ScrollMetrics {
  /** Current scroll offset in pixels */
  scroll: number;
  /** Maximum scroll offset */
  limit: number;
  /** Instantaneous velocity (px/s) */
  velocity: number;
  /** Direction: 1 (scrolling down), -1 (scrolling up), 0 (stationary) */
  direction: 1 | -1 | 0;
  /** Normalized scroll progress from 0 to 1 */
  progress: number;
  /** Legacy alias for scroll */
  current: number;
  /** Target scroll offset */
  target: number;
  /** Legacy alias for limit */
  maxScroll: number;
}

export interface IScrollValue<T = number> {
  get(): T;
  set(value: T): void;
  subscribe(callback: (value: T) => void): () => void;
  destroy(): void;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
}

export interface SpringState {
  position: number;
  velocity: number;
  settled: boolean;
}

export interface LenisScrollEvent {
  scroll?: number;
  limit?: number;
  velocity?: number;
  direction?: number;
  progress?: number;
  targetScroll?: number;
  [key: string]: any;
}

export interface ElementTransform {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  opacity?: number;
}
