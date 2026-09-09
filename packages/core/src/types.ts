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
  /** Damping factor (0.01 to 0.2). Higher = snappier, lower = floatier. Default: 0.08 */
  damping: number;
  /** Mass of simulated scrolling body. Default: 1 */
  mass: number;
  /** Velocity clamp. Default: 120 */
  maxVelocity?: number;
  /** Stop threshold when delta is negligible. Default: 0.05 */
  restThreshold?: number;
}

export interface ScrollMetrics {
  current: number;
  target: number;
  velocity: number;
  direction: 1 | -1 | 0;
  progress: number;
  maxScroll: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
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
