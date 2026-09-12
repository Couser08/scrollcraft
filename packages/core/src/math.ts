/**
 * High-performance Game-Dev Math Utilities for ScrollCraft
 * Zero allocations, pure mathematical operations.
 * Strictly under 650 LOC.
 */

import { SpringConfig, SpringState } from './types';

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
  if (!Number.isFinite(current)) return target;
  if (!Number.isFinite(target)) return current;
  const safeLambda = Math.max(0, Number.isFinite(lambda) ? lambda : 0);
  const safeDt = Math.max(0, Number.isFinite(dt) ? dt : 0);
  return lerp(current, target, 1 - Math.exp(-safeLambda * safeDt));
}

/**
 * Clamps value between min and max bounds
 */
export function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val)) return Number.isFinite(min) ? min : 0;
  if (val === Infinity) return max;
  if (val === -Infinity) return min;
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
  if (Number.isNaN(val)) return outMin;
  const range = inMax - inMin;
  if (range === 0 || !Number.isFinite(range)) return outMin;
  const progress = (val - inMin) / range;
  const mapped = outMin + progress * (outMax - outMin);
  return shouldClamp ? clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax)) : mapped;
}

/**
 * Analytical Spring Integration for micro-interactions and smooth scroll
 * Solves damped harmonic oscillator differential equation.
 * Zero-allocation capable when passing an existing SpringState in `out`.
 */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  dt: number,
  out?: SpringState
): SpringState {
  const { stiffness, damping, mass, precision = 0.001 } = config;
  const safeMass = mass && Number.isFinite(mass) && mass > 0 ? mass : 1;
  const safeCurrent = Number.isFinite(current) ? current : target;
  const safeVelocity = Number.isFinite(velocity) ? velocity : 0;

  // Strictly clamp dt to 33ms to prevent semi-implicit Euler divergence on tab restore / lag spikes
  const safeDt = Math.min(Math.max(Number.isFinite(dt) ? dt : 0, 0), 0.033);
  const delta = safeCurrent - target;
  const springForce = -stiffness * delta;
  const dampingForce = -damping * safeVelocity;
  const acceleration = (springForce + dampingForce) / safeMass;

  const nextVelocity = safeVelocity + acceleration * safeDt;
  const nextPosition = safeCurrent + nextVelocity * safeDt;

  const settled = Math.abs(nextVelocity) < precision && Math.abs(nextPosition - target) < precision;
  const resolvedPos = settled ? target : nextPosition;
  const resolvedVel = settled ? 0 : nextVelocity;

  if (out) {
    out.position = resolvedPos;
    out.velocity = resolvedVel;
    out.settled = settled;
    return out;
  }

  return {
    position: resolvedPos,
    velocity: resolvedVel,
    settled,
  };
}
