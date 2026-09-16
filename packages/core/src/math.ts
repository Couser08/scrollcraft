/**
 * High-performance Game-Dev Math Utilities for ScrollCraft
 * Zero allocations, pure mathematical operations.
 * Strictly under 650 LOC.
 */

import { SpringConfig, SpringState } from './types';

/**
 * Standard linear interpolation with NaN/Infinity protection
 */
export function lerp(a: number, b: number, t: number): number {
  if (!Number.isFinite(a)) return Number.isFinite(b) ? b : 0;
  if (!Number.isFinite(b)) return a;
  if (!Number.isFinite(t)) return a;
  const result = a + (b - a) * t;
  if (!Number.isFinite(result)) {
    return t >= 0.5 ? b : a;
  }
  return result;
}

/**
 * Delta-time independent damping (Game-Dev standard: frame-rate invariant lerp)
 * Ensures 60Hz and 120Hz/144Hz monitors experience the exact same physics decay.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  if (!Number.isFinite(current)) return Number.isFinite(target) ? target : 0;
  if (!Number.isFinite(target)) return current;
  const safeLambda = Math.max(0, Number.isFinite(lambda) ? lambda : 0);
  const safeDt = Math.max(0, Number.isFinite(dt) ? dt : 0);
  return lerp(current, target, 1 - Math.exp(-safeLambda * safeDt));
}

/**
 * Clamps value between min and max bounds with robustness against inverted or infinite bounds
 */
export function clamp(val: number, min: number, max: number): number {
  const safeMin = Number.isFinite(min) ? min : (min === -Infinity ? -Number.MAX_VALUE : 0);
  const safeMax = Number.isFinite(max) ? max : (max === Infinity ? Number.MAX_VALUE : 0);
  const effectiveMin = Math.min(safeMin, safeMax);
  const effectiveMax = Math.max(safeMin, safeMax);

  if (!Number.isFinite(val)) {
    if (val === Infinity) return effectiveMax;
    if (val === -Infinity) return effectiveMin;
    return effectiveMin;
  }
  return Math.min(Math.max(val, effectiveMin), effectiveMax);
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
  if (!Number.isFinite(val)) return Number.isFinite(outMin) ? outMin : 0;
  const range = inMax - inMin;
  if (range === 0 || !Number.isFinite(range)) return Number.isFinite(outMin) ? outMin : 0;
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
  const stiffness = config?.stiffness;
  const damping = config?.damping;
  const mass = config?.mass;
  const precision = config?.precision;

  const safeTarget = Number.isFinite(target) ? target : 0;
  const safeCurrent = Number.isFinite(current) ? current : safeTarget;
  const safeVelocity = Number.isFinite(velocity) ? velocity : 0;
  const safeStiffness = typeof stiffness === 'number' && Number.isFinite(stiffness) && stiffness >= 0 ? stiffness : 100;
  const safeDamping = typeof damping === 'number' && Number.isFinite(damping) && damping >= 0 ? damping : 10;
  const safeMass = typeof mass === 'number' && Number.isFinite(mass) && mass > 0 ? mass : 1;
  const safePrecision = typeof precision === 'number' && Number.isFinite(precision) && precision > 0 ? precision : 0.001;

  // Strictly clamp dt to [0, 0.033] (33ms) to prevent semi-implicit Euler divergence on tab restore / lag spikes
  const safeDt = Math.min(Math.max(Number.isFinite(dt) ? dt : 0, 0), 0.033);
  const delta = safeCurrent - safeTarget;
  const springForce = -safeStiffness * delta;
  const dampingForce = -safeDamping * safeVelocity;
  const acceleration = (springForce + dampingForce) / safeMass;

  const nextVelocity = safeVelocity + acceleration * safeDt;
  const nextPosition = safeCurrent + nextVelocity * safeDt;

  const settled = Math.abs(nextVelocity) < safePrecision && Math.abs(nextPosition - safeTarget) < safePrecision;
  const resolvedPos = settled ? safeTarget : (Number.isFinite(nextPosition) ? nextPosition : safeTarget);
  const resolvedVel = settled ? 0 : (Number.isFinite(nextVelocity) ? nextVelocity : 0);

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
