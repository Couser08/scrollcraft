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

export type ColorRgba = [r: number, g: number, b: number, a: number];

/**
 * Parses any standard CSS color (#hex, rgb, rgba, transparent, named)
 * into a normalized numeric float tuple [r, g, b, a] where 0 <= r,g,b <= 255 and 0 <= a <= 1.
 * Pre-parsed at measure() time to guarantee zero GC allocations during active scroll animation.
 */
export function parseColorRgba(color: string): ColorRgba {
  if (!color || typeof color !== 'string') {
    return [0, 0, 0, 1];
  }

  const trimmed = color.trim().toLowerCase();

  if (trimmed === 'transparent') {
    return [0, 0, 0, 0];
  }

  // Handle Hex formats (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r, g, b, 1];
    }
    if (hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const a = parseInt(hex[3] + hex[3], 16) / 255;
      return [r, g, b, a];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b, 1];
    }
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    }
    return [0, 0, 0, 1];
  }

  // Handle rgb(...) and rgba(...)
  if (trimmed.startsWith('rgb')) {
    const startParen = trimmed.indexOf('(');
    const endParen = trimmed.lastIndexOf(')');
    if (startParen !== -1 && endParen !== -1) {
      const inner = trimmed.slice(startParen + 1, endParen);
      const parts = inner.split(/[\s,/]+/).filter(Boolean);
      if (parts.length >= 3) {
        const r = clamp(parseFloat(parts[0]), 0, 255);
        const g = clamp(parseFloat(parts[1]), 0, 255);
        const b = clamp(parseFloat(parts[2]), 0, 255);
        const a = parts.length >= 4 ? clamp(parseFloat(parts[3]), 0, 1) : 1;
        return [
          Number.isFinite(r) ? r : 0,
          Number.isFinite(g) ? g : 0,
          Number.isFinite(b) ? b : 0,
          Number.isFinite(a) ? a : 1,
        ];
      }
    }
  }

  // Common named color fast-paths
  switch (trimmed) {
    case 'black': return [0, 0, 0, 1];
    case 'white': return [255, 255, 255, 1];
    case 'red': return [255, 0, 0, 1];
    case 'green': return [0, 128, 0, 1];
    case 'blue': return [0, 0, 255, 1];
    default: return [0, 0, 0, 1];
  }
}

/**
 * Pure arithmetic linear interpolation between two RGBA numeric tuples.
 * When `out` is passed, writes directly into the pre-allocated tuple for 100% zero-GC operation.
 */
export function lerpColorRgba(
  c1: ColorRgba,
  c2: ColorRgba,
  t: number,
  out?: ColorRgba
): ColorRgba {
  const safeT = clamp(Number.isFinite(t) ? t : 0, 0, 1);
  const r = lerp(c1[0], c2[0], safeT);
  const g = lerp(c1[1], c2[1], safeT);
  const b = lerp(c1[2], c2[2], safeT);
  const a = lerp(c1[3], c2[3], safeT);

  if (out) {
    out[0] = r;
    out[1] = g;
    out[2] = b;
    out[3] = a;
    return out;
  }

  return [r, g, b, a];
}

/**
 * Serializes an RGBA tuple to a valid CSS rgba(...) string.
 */
export function rgbaString(c: ColorRgba): string {
  const r = Math.round(c[0]);
  const g = Math.round(c[1]);
  const b = Math.round(c[2]);
  const a = Math.round(c[3] * 1000) / 1000;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Checks if color difference exceeds a micro-epsilon threshold (default: 0.005).
 * Used by GPU style renderers to skip string construction if changes are imperceptible.
 */
export function colorDeltaExceeds(c1: ColorRgba, c2: ColorRgba, epsilon: number = 0.005): boolean {
  return (
    Math.abs(c1[0] - c2[0]) > 0.5 ||
    Math.abs(c1[1] - c2[1]) > 0.5 ||
    Math.abs(c1[2] - c2[2]) > 0.5 ||
    Math.abs(c1[3] - c2[3]) > epsilon
  );
}

/**
 * Converts a reference 60Hz lerp coefficient (0.01 to 0.99) to continuous exponential decay constant lambda.
 */
export function lerpToLambda(lerp60: number): number {
  const safeLerp = clamp(Number.isFinite(lerp60) ? lerp60 : 0.1, 0.001, 0.999);
  return -60 * Math.log(1 - safeLerp);
}

/**
 * Converts continuous exponential decay constant lambda to reference 60Hz lerp coefficient.
 */
export function lambdaToLerpFactor(lambda: number): number {
  const safeLambda = Math.max(0, Number.isFinite(lambda) ? lambda : 0);
  return 1 - Math.exp(-safeLambda / 60);
}

/**
 * Framerate-independent 120Hz-aware exponential smoothing.
 * Converts reference 60Hz lerp factor into an exact delta-time adjusted factor:
 * alpha(dt) = 1 - (1 - lerp60)^(60 * dt)
 * Guarantees that 60Hz, 120Hz, and 240Hz monitors experience identical wall-clock physics decay.
 */
export function exponentialLerp(current: number, target: number, lerp60: number, dt: number): number {
  if (!Number.isFinite(current)) return Number.isFinite(target) ? target : 0;
  if (!Number.isFinite(target)) return current;
  const safeLerp = clamp(Number.isFinite(lerp60) ? lerp60 : 0.1, 0.0001, 0.9999);
  const safeDt = Math.max(0, Math.min(Number.isFinite(dt) ? dt : 0.016, 0.1));
  const factor = 1 - Math.pow(1 - safeLerp, safeDt * 60);
  return lerp(current, target, factor);
}

export interface VelocitySnapOptions {
  /** Velocity threshold (px/s) above which snap is released to let inertia glide freely. Default: 150 */
  releaseThreshold?: number;
  /** Kinetic time horizon in seconds for projecting natural stopping position. Default: 0.2 */
  inertiaHorizon?: number;
  /** Minimum scroll bound. Default: 0 */
  minBound?: number;
  /** Maximum scroll bound. Default: Infinity */
  maxBound?: number;
}

/**
 * Velocity-aware kinetic projection snap solver.
 * If moving fast (|velocity| > releaseThreshold), snap is released (returns null).
 * When settling, directionally projects the stopping position and snaps to the nearest anchor.
 */
export function calculateVelocitySnapTarget(
  current: number,
  velocity: number,
  snapPoints: number[],
  options?: VelocitySnapOptions
): number | null {
  if (!snapPoints || snapPoints.length === 0) return null;
  const releaseThreshold = options?.releaseThreshold ?? 150;
  const inertiaHorizon = options?.inertiaHorizon ?? 0.2;
  const minBound = options?.minBound ?? 0;
  const maxBound = options?.maxBound ?? Infinity;

  // Active fling: release snap lock so momentum is never fought or trapped
  if (Math.abs(velocity) > releaseThreshold) {
    return null;
  }

  // Kinetic projection: calculate where inertia naturally lands
  const projected = clamp(current + velocity * inertiaHorizon, minBound, maxBound);

  // Directional filtering
  let candidates = snapPoints;
  if (velocity > 15) {
    // Scrolling forward: prefer points ahead of current position
    const forward = snapPoints.filter((p) => p >= current - 1);
    if (forward.length > 0) candidates = forward;
  } else if (velocity < -15) {
    // Scrolling backward: prefer points behind current position
    const backward = snapPoints.filter((p) => p <= current + 1);
    if (backward.length > 0) candidates = backward;
  }

  // Find closest candidate to projected landing position
  let closest = candidates[0];
  let minDiff = Math.abs(projected - closest);
  for (let i = 1; i < candidates.length; i++) {
    const diff = Math.abs(projected - candidates[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = candidates[i];
    }
  }

  return closest;
}

/**
 * Aligns floating-point coordinate to physical device pixel grid.
 * DPR=1: rounds to integer (e.g. 10.4 -> 10.0)
 * DPR=2 (Retina): rounds to 0.5px (e.g. 10.4 -> 10.5)
 * DPR=3 (OLED/Phone): rounds to 0.333px
 * Prevents text raster blurring, edge shimmering, and unnecessary DOM string churn.
 */
export function snapToDevicePixel(value: number, dpr?: number): number {
  if (!Number.isFinite(value)) return 0;
  const safeDpr =
    typeof dpr === 'number' && Number.isFinite(dpr) && dpr > 0
      ? dpr
      : typeof window !== 'undefined' && window.devicePixelRatio
        ? window.devicePixelRatio
        : 1;
  return Math.round(value * safeDpr) / safeDpr;
}

/**
 * Returns clean CSS pixel string (integer px if whole, or fixed 2 decimal places for sub-pixel fractions)
 * to minimize DOM attribute diffing and retain backward compatibility.
 */
export function formatDevicePixel(value: number, dpr?: number): string {
  const snapped = snapToDevicePixel(value, dpr);
  return Number.isInteger(snapped) ? `${snapped}px` : `${snapped.toFixed(2)}px`;
}

