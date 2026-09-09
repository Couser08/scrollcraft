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
  // Strictly clamp dt to 33ms to prevent semi-implicit Euler divergence on tab restore / lag spikes
  const safeDt = Math.min(Math.max(dt, 0), 0.033);
  const delta = current - target;
  const springForce = -stiffness * delta;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const nextVelocity = velocity + acceleration * safeDt;
  const nextPosition = current + nextVelocity * safeDt;

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
