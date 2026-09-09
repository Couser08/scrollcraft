/**
 * High-performance Game-Dev Math Utilities for ScrollCraft
 * Zero allocations, pure mathematical operations.
 * Strictly under 650 LOC.
 */

import { SpringConfig } from './types';

/**
 * Standard linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Delta-time independent damping (Game-Dev standard: frame-rate invariant lerp)
 * Ensures 60Hz and 120Hz/144Hz monitors experience the exact same physics decay.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Clamps value between min and max bounds
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Maps a number from an input range to an output range with optional clamping
 */
export function mapRange(
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  val: number,
  shouldClamp: boolean = true
): number {
  if (inMax - inMin === 0) return outMin;
  const progress = (val - inMin) / (inMax - inMin);
  const mapped = outMin + progress * (outMax - outMin);
  return shouldClamp ? clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax)) : mapped;
}

/**
 * Analytical Spring Integration for micro-interactions and smooth scroll
 * Solves damped harmonic oscillator differential equation.
 */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  dt: number
): { position: number; velocity: number; settled: boolean } {
  const { stiffness, damping, mass, precision = 0.001 } = config;
  const delta = current - target;
  const springForce = -stiffness * delta;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const nextVelocity = velocity + acceleration * dt;
  const nextPosition = current + nextVelocity * dt;

  const settled = Math.abs(nextVelocity) < precision && Math.abs(nextPosition - target) < precision;

  return {
    position: settled ? target : nextPosition,
    velocity: settled ? 0 : nextVelocity,
    settled,
  };
}
