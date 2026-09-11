/**
 * ScrollCraft Core Engine Performance Benchmarks
 * Measures throughput, allocation, and latency of all core primitives.
 * Run with: npx vitest run packages/core/src/__tests__/benchmarks.test.ts
 */

import { describe, it, expect } from 'vitest';
import { lerp, damp, clamp, mapRange, springStep } from '../math';
import { ScrollValue } from '../scroll-value';
import { TimelineSolver, KeyframeSegment, PropertyTimeline } from '../timeline';

// ─── Benchmark Harness ──────────────────────────────────────
function benchmark(name: string, fn: () => void, iterations: number = 100_000): {
  name: string;
  totalMs: number;
  opsPerSec: number;
  avgNs: number;
  iterations: number;
} {
  // Warmup
  for (let i = 0; i < 1000; i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const totalMs = performance.now() - start;
  const opsPerSec = Math.round((iterations / totalMs) * 1000);
  const avgNs = Math.round((totalMs / iterations) * 1_000_000);

  return { name, totalMs: Math.round(totalMs * 100) / 100, opsPerSec, avgNs, iterations };
}

function printResults(groupName: string, results: ReturnType<typeof benchmark>[]) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`  ${groupName}`);
  console.log(`${'═'.repeat(80)}`);
  console.log(`  ${'Benchmark'.padEnd(55)} ${'ops/sec'.padStart(12)} ${'avg (ns)'.padStart(10)} ${'total (ms)'.padStart(12)}`);
  console.log(`  ${'─'.repeat(75)}`);
  for (const r of results) {
    const ops = r.opsPerSec.toLocaleString();
    console.log(`  ${r.name.padEnd(55)} ${ops.padStart(12)} ${r.avgNs.toString().padStart(10)} ${r.totalMs.toString().padStart(12)}`);
  }
}

// ─── Test Groups ────────────────────────────────────────────

describe('ScrollCraft Core Engine Benchmarks', () => {

  // ═══════════════════════════════════════════════════════════
  // GROUP 1: Math Utilities (Hot Path)
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Math Utilities', () => {
    const results = [
      benchmark('lerp() - single call', () => { lerp(0, 100, 0.5); }, 50_000),
      benchmark('lerp() - 1000x (simulating 1000 elements)', () => {
        for (let i = 0; i < 1000; i++) lerp(0, 100, i / 1000);
      }, 5_000),
      benchmark('clamp() - single call', () => { clamp(150, 0, 100); }, 50_000),
      benchmark('clamp() - 1000x sequential', () => {
        for (let i = 0; i < 1000; i++) clamp(i - 500, 0, 100);
      }, 5_000),
      benchmark('damp() - 60Hz (dt=0.016)', () => { damp(0, 100, 10, 0.016); }, 50_000),
      benchmark('damp() - 120Hz (dt=0.008)', () => { damp(0, 100, 10, 0.008); }, 50_000),
      benchmark('damp() - 1000x parallax elements', () => {
        for (let i = 0; i < 1000; i++) damp(i, 1000, 10, 0.016);
      }, 5_000),
      benchmark('mapRange() - clamped', () => { mapRange(0, 1000, 0, 1, 500, true); }, 50_000),
      benchmark('mapRange() - unclamped', () => { mapRange(0, 1000, 0, 1, 500, false); }, 50_000),
      benchmark('mapRange() - 1000x (timeline eval)', () => {
        for (let i = 0; i < 1000; i++) mapRange(0, 1000, 0, 1, i, true);
      }, 5_000),
    ];
    printResults('GROUP 1: MATH UTILITIES (Hot Path Primitives)', results);
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(damp(0, 100, 10, 0.016)).toBeGreaterThan(0);
  }, 30_000);

  // ═══════════════════════════════════════════════════════════
  // GROUP 2: Spring Physics (Harmonic Oscillator)
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Spring Physics', () => {
    const config = { stiffness: 180, damping: 12, mass: 1, precision: 0.001 };
    const stiffConfig = { stiffness: 500, damping: 20, mass: 1, precision: 0.001 };
    const softConfig = { stiffness: 80, damping: 8, mass: 1, precision: 0.001 };

    const results = [
      benchmark('springStep() - allocating new state', () => {
        springStep(0, 100, 0, config, 0.016);
      }, 50_000),
      benchmark('springStep() - zero-alloc (reused out)', () => {
        const out = { position: 0, velocity: 0, settled: false };
        springStep(0, 100, 0, config, 0.016, out);
      }, 50_000),
      benchmark('springStep() - 60 frames (1s @60Hz, alloc)', () => {
        let pos = 0, vel = 0;
        for (let i = 0; i < 60; i++) {
          const s = springStep(pos, 100, vel, config, 0.016);
          pos = s.position; vel = s.velocity;
        }
      }, 10_000),
      benchmark('springStep() - 60 frames (1s @60Hz, zero-alloc)', () => {
        let pos = 0, vel = 0;
        const out = { position: 0, velocity: 0, settled: false };
        for (let i = 0; i < 60; i++) {
          springStep(pos, 100, vel, config, 0.016, out);
          pos = out.position; vel = out.velocity;
        }
      }, 10_000),
      benchmark('springStep() - 120 frames (1s @120Hz, zero-alloc)', () => {
        let pos = 0, vel = 0;
        const out = { position: 0, velocity: 0, settled: false };
        for (let i = 0; i < 120; i++) {
          springStep(pos, 100, vel, config, 0.008, out);
          pos = out.position; vel = out.velocity;
        }
      }, 10_000),
      benchmark('springStep() - stiff spring (k=500)', () => {
        const out = { position: 0, velocity: 0, settled: false };
        springStep(0, 100, 0, stiffConfig, 0.016, out);
      }, 50_000),
      benchmark('springStep() - soft spring (k=80)', () => {
        const out = { position: 0, velocity: 0, settled: false };
        springStep(0, 100, 0, softConfig, 0.016, out);
      }, 50_000),
      benchmark('springStep() - dt spike (tab restore dt=5.0)', () => {
        const out = { position: 0, velocity: 0, settled: false };
        springStep(50, 100, 200, config, 5.0, out);
      }, 50_000),
      benchmark('springStep() - 1000 concurrent elements/frame', () => {
        const out = { position: 0, velocity: 0, settled: false };
        for (let i = 0; i < 1000; i++) {
          springStep(i * 0.1, 100, i * 0.01, config, 0.016, out);
        }
      }, 5_000),
    ];
    printResults('GROUP 2: SPRING PHYSICS (Harmonic Oscillator)', results);
    // Verify spring converges
    let pos = 0, vel = 0;
    const out = { position: 0, velocity: 0, settled: false };
    for (let i = 0; i < 600; i++) {
      springStep(pos, 100, vel, config, 0.016, out);
      pos = out.position; vel = out.velocity;
    }
    expect(out.settled).toBe(true);
    expect(out.position).toBe(100);
  }, 30_000);

  // ═══════════════════════════════════════════════════════════
  // GROUP 3: ScrollValue (Observable Stream)
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: ScrollValue Observable', () => {
    const results = [
      benchmark('create + get', () => {
        const sv = new ScrollValue(0);
        sv.get();
      }, 50_000),
      benchmark('set (no subscribers, 100 updates)', () => {
        const sv = new ScrollValue(0);
        for (let i = 0; i < 100; i++) sv.set(i);
      }, 10_000),
      benchmark('set (1 subscriber, 100 updates)', () => {
        const sv = new ScrollValue(0);
        let _v = 0;
        sv.subscribe((v) => { _v = v; });
        for (let i = 0; i < 100; i++) sv.set(i);
        void _v;
      }, 10_000),
      benchmark('set (10 subscribers, 100 updates)', () => {
        const sv = new ScrollValue(0);
        let _v = 0;
        for (let s = 0; s < 10; s++) sv.subscribe((v) => { _v = v; });
        for (let i = 0; i < 100; i++) sv.set(i);
        void _v;
      }, 10_000),
      benchmark('set (100 subscribers, 100 updates)', () => {
        const sv = new ScrollValue(0);
        let _v = 0;
        for (let s = 0; s < 100; s++) sv.subscribe((v) => { _v = v; });
        for (let i = 0; i < 100; i++) sv.set(i);
        void _v;
      }, 1_000),
      benchmark('dedup (same value 100x, 1 sub)', () => {
        const sv = new ScrollValue(42);
        let c = 0;
        sv.subscribe(() => { c++; });
        for (let i = 0; i < 100; i++) sv.set(42);
      }, 10_000),
      benchmark('subscribe + unsubscribe churn (100 cycles)', () => {
        const sv = new ScrollValue(0);
        for (let i = 0; i < 100; i++) {
          const u = sv.subscribe(() => {});
          u();
        }
      }, 10_000),
      benchmark('throughput: 10000 set(), 1 sub', () => {
        const sv = new ScrollValue(0);
        let _v = 0;
        sv.subscribe((v) => { _v = v; });
        for (let i = 0; i < 10000; i++) sv.set(i);
        void _v;
      }, 1_000),
      benchmark('destroy + post-destroy safety', () => {
        const sv = new ScrollValue(0);
        sv.subscribe(() => {});
        sv.destroy();
        sv.set(999);
      }, 50_000),
    ];
    printResults('GROUP 3: SCROLLVALUE (Observable Reactive Stream)', results);
  }, 30_000);

  // ═══════════════════════════════════════════════════════════
  // GROUP 4: Timeline Solver (Choreography)
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Timeline Solver', () => {
    const simple: KeyframeSegment[] = [
      { from: 0, to: 0.5, startValue: 0, endValue: 1 },
      { from: 0.5, to: 1, startValue: 1, endValue: 0 },
    ];
    const complex: KeyframeSegment[] = [
      { from: 0, to: 0.2, startValue: 0, endValue: 0.3 },
      { from: 0.2, to: 0.4, startValue: 0.3, endValue: 0.7 },
      { from: 0.4, to: 0.6, startValue: 0.7, endValue: 1.0 },
      { from: 0.6, to: 0.8, startValue: 1.0, endValue: 0.5 },
      { from: 0.8, to: 1.0, startValue: 0.5, endValue: 0 },
    ];
    const multiTrack: PropertyTimeline = {
      opacity: simple,
      scale: [{ from: 0, to: 1, startValue: 0.5, endValue: 1.5 }],
      translateX: complex,
      translateY: complex,
      rotate: [
        { from: 0, to: 0.5, startValue: 0, endValue: 180 },
        { from: 0.5, to: 1, startValue: 180, endValue: 360 },
      ],
    };

    const results = [
      benchmark('evaluateSegment() - 2 segs', () => {
        TimelineSolver.evaluateSegment(simple, 0.5);
      }, 50_000),
      benchmark('evaluateSegment() - 5 segs', () => {
        TimelineSolver.evaluateSegment(complex, 0.5);
      }, 50_000),
      benchmark('evaluateSegment() - 5 segs, sweep 100 steps', () => {
        for (let i = 0; i <= 100; i++)
          TimelineSolver.evaluateSegment(complex, i / 100);
      }, 10_000),
      benchmark('evaluateTimeline() - 5 tracks, allocating', () => {
        TimelineSolver.evaluateTimeline(multiTrack, 0.5);
      }, 50_000),
      benchmark('evaluateTimeline() - 5 tracks, zero-alloc', () => {
        const out: Record<string, number> = {};
        TimelineSolver.evaluateTimeline(multiTrack, 0.5, out);
      }, 50_000),
      benchmark('evaluateTimeline() - 5 tracks, 100 steps, zero-alloc', () => {
        const out: Record<string, number> = {};
        for (let i = 0; i <= 100; i++)
          TimelineSolver.evaluateTimeline(multiTrack, i / 100, out);
      }, 10_000),
      benchmark('evaluateTimeline() - 5 tracks, 1000 steps, zero-alloc', () => {
        const out: Record<string, number> = {};
        for (let i = 0; i <= 1000; i++)
          TimelineSolver.evaluateTimeline(multiTrack, i / 1000, out);
      }, 1_000),
      benchmark('evaluateSegment() - boundary t=0.0', () => {
        TimelineSolver.evaluateSegment(complex, 0);
      }, 50_000),
      benchmark('evaluateSegment() - boundary t=1.0', () => {
        TimelineSolver.evaluateSegment(complex, 1.0);
      }, 50_000),
    ];
    printResults('GROUP 4: TIMELINE SOLVER (Keyframe Choreography)', results);
  }, 30_000);

  // ═══════════════════════════════════════════════════════════
  // GROUP 5: Ticker Task Management
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Ticker Task Management', () => {
    const results = [
      benchmark('Map.set + Array.from (10 tasks/phase)', () => {
        const m = new Map<string, Function>();
        const cb = () => {};
        for (let i = 0; i < 10; i++) m.set(`t-${i}`, cb);
        Array.from(m.values());
      }, 10_000),
      benchmark('Map.set + Array.from (50 tasks/phase)', () => {
        const m = new Map<string, Function>();
        const cb = () => {};
        for (let i = 0; i < 50; i++) m.set(`t-${i}`, cb);
        Array.from(m.values());
      }, 10_000),
      benchmark('Map.set + Array.from (100 tasks/phase)', () => {
        const m = new Map<string, Function>();
        const cb = () => {};
        for (let i = 0; i < 100; i++) m.set(`t-${i}`, cb);
        Array.from(m.values());
      }, 10_000),
      benchmark('Tick sim: 30 tasks (10/phase)', () => {
        const tasks: Function[] = [];
        const noop = () => {};
        for (let i = 0; i < 10; i++) tasks.push(noop);
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
      }, 100_000),
      benchmark('Tick sim: 150 tasks (50/phase)', () => {
        const tasks: Function[] = [];
        const noop = () => {};
        for (let i = 0; i < 50; i++) tasks.push(noop);
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
      }, 10_000),
      benchmark('Tick sim: 300 tasks (100/phase)', () => {
        const tasks: Function[] = [];
        const noop = () => {};
        for (let i = 0; i < 100; i++) tasks.push(noop);
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
        for (let i = 0; i < tasks.length; i++) tasks[i]();
      }, 10_000),
    ];
    printResults('GROUP 5: TICKER (Task Management & Scheduling)', results);
  });

  // ═══════════════════════════════════════════════════════════
  // GROUP 6: Integrated Pipeline (Full Frame)
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Integrated Pipeline (Full Frame)', () => {
    const results = [
      benchmark('Full frame: 10 parallax elements', () => {
        const dt = 0.016;
        for (let i = 0; i < 10; i++) {
          const speed = -0.2 + (i * 0.05);
          const viewCenter = 500 + 450;
          const elemCenter = (i * 200) - 500;
          const offset = clamp((viewCenter - elemCenter) * speed, -500, 500);
          damp(0, offset, 10, dt);
        }
      }, 100_000),
      benchmark('Full frame: 50 parallax elements', () => {
        const dt = 0.016;
        for (let i = 0; i < 50; i++) {
          const speed = -0.2 + (i * 0.01);
          const viewCenter = 500 + 450;
          const elemCenter = (i * 200) - 500;
          const offset = clamp((viewCenter - elemCenter) * speed, -500, 500);
          damp(0, offset, 10, dt);
        }
      }, 10_000),
      benchmark('Full frame: 100 parallax elements', () => {
        const dt = 0.016;
        for (let i = 0; i < 100; i++) {
          const speed = -0.2 + (i * 0.005);
          const viewCenter = 500 + 450;
          const elemCenter = (i * 200) - 500;
          const offset = clamp((viewCenter - elemCenter) * speed, -500, 500);
          damp(0, offset, 10, dt);
        }
      }, 10_000),
      benchmark('Full frame: 5-track timeline + spring + 10 elem', () => {
        const tl: PropertyTimeline = {
          opacity: [{ from: 0, to: 1, startValue: 0, endValue: 1 }],
          scale: [{ from: 0, to: 1, startValue: 0.8, endValue: 1 }],
          translateY: [{ from: 0, to: 0.5, startValue: 50, endValue: 0 }, { from: 0.5, to: 1, startValue: 0, endValue: -50 }],
          rotate: [{ from: 0, to: 1, startValue: 0, endValue: 360 }],
          blur: [{ from: 0, to: 0.3, startValue: 10, endValue: 0 }, { from: 0.7, to: 1, startValue: 0, endValue: 10 }],
        };
        const out: Record<string, number> = {};
        const sOut = { position: 0, velocity: 0, settled: false };
        const cfg = { stiffness: 180, damping: 12, mass: 1, precision: 0.001 };
        for (let i = 0; i < 10; i++) {
          TimelineSolver.evaluateTimeline(tl, i / 10, out);
          springStep(out.translateY, 0, 0, cfg, 0.016, sOut);
        }
      }, 10_000),
      benchmark('STRESS: 120Hz budget - 200 elements full pipeline', () => {
        const dt = 0.008;
        const out: Record<string, number> = {};
        const sOut = { position: 0, velocity: 0, settled: false };
        const cfg = { stiffness: 180, damping: 12, mass: 1, precision: 0.001 };
        const tl: PropertyTimeline = {
          opacity: [{ from: 0, to: 1, startValue: 0, endValue: 1 }],
          scale: [{ from: 0, to: 1, startValue: 0.5, endValue: 1 }],
        };
        for (let i = 0; i < 200; i++) {
          const p = (i % 100) / 100;
          TimelineSolver.evaluateTimeline(tl, p, out);
          const o = damp(0, out.opacity * 100, 10, dt);
          springStep(o, 100, 0, cfg, dt, sOut);
          clamp(sOut.position, 0, 100);
        }
      }, 1_000),
    ];
    printResults('GROUP 6: INTEGRATED PIPELINE (Full Frame Simulation)', results);
  });

  // ═══════════════════════════════════════════════════════════
  // GROUP 7: Memory Allocation Comparison
  // ═══════════════════════════════════════════════════════════
  it('BENCHMARK: Memory Allocation Patterns', () => {
    const config = { stiffness: 180, damping: 12, mass: 1, precision: 0.001 };
    const results = [
      benchmark('spring 60f - WITH allocation', () => {
        let pos = 0, vel = 0;
        for (let i = 0; i < 60; i++) {
          const s = springStep(pos, 100, vel, config, 0.016);
          pos = s.position; vel = s.velocity;
        }
      }, 10_000),
      benchmark('spring 60f - WITHOUT allocation (reuse)', () => {
        let pos = 0, vel = 0;
        const out = { position: 0, velocity: 0, settled: false };
        for (let i = 0; i < 60; i++) {
          springStep(pos, 100, vel, config, 0.016, out);
          pos = out.position; vel = out.velocity;
        }
      }, 10_000),
      benchmark('timeline 100f - WITH allocation', () => {
        const tl: PropertyTimeline = {
          opacity: [{ from: 0, to: 1, startValue: 0, endValue: 1 }],
          scale: [{ from: 0, to: 1, startValue: 0.5, endValue: 1 }],
        };
        for (let i = 0; i <= 100; i++)
          TimelineSolver.evaluateTimeline(tl, i / 100);
      }, 10_000),
      benchmark('timeline 100f - WITHOUT allocation (reuse out)', () => {
        const tl: PropertyTimeline = {
          opacity: [{ from: 0, to: 1, startValue: 0, endValue: 1 }],
          scale: [{ from: 0, to: 1, startValue: 0.5, endValue: 1 }],
        };
        const out: Record<string, number> = {};
        for (let i = 0; i <= 100; i++)
          TimelineSolver.evaluateTimeline(tl, i / 100, out);
      }, 10_000),
      benchmark('ScrollValue 10K set(), 1 sub', () => {
        const sv = new ScrollValue(0);
        let _v = 0;
        sv.subscribe((v) => { _v = v; });
        for (let i = 0; i < 10000; i++) sv.set(i);
        void _v;
      }, 100),
    ];
    printResults('GROUP 7: MEMORY ALLOCATION PATTERNS (Alloc vs Zero-Alloc)', results);
  });
});
