'use client';

/**
 * ScrollCraft Section 3: Hooks — Raw Access
 * - Headline: "Prefer to build your own? Here's the data."
 * - Clean hook code on the left; live telemetry readout panel on the right ticking real-time metrics.
 */

import React, { useState, useEffect } from 'react';
import { useScrollCraft, Reveal } from '@scrollcraft/react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Activity, Cpu, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type HookTab = 'useScrollProgress' | 'useParallax' | 'useReveal' | 'usePin';

const HOOK_SNIPPETS: Record<HookTab, { code: string; desc: string }> = {
  useScrollProgress: {
    desc: 'Provides continuous scroll progress (0.0 to 1.0), frame-to-frame delta velocity, and direction vector.',
    code: `import { useScrollProgress } from '@scrollcraft/react';

export function HeaderTelemetry() {
  // reactive: true triggers React re-render when metrics change
  // reactive: false (default) returns mutable ref for 0 re-renders
  const { progress, direction, velocity } = useScrollProgress({ reactive: true });

  return (
    <div>
      <div>Progress: {(progress * 100).toFixed(1)}%</div>
      <div>Velocity: {velocity.toFixed(2)}px/f</div>
      <div>Direction: {direction === 1 ? 'DOWN' : direction === -1 ? 'UP' : '0'}</div>
    </div>
  );
}`,
  },
  useParallax: {
    desc: 'Direct hardware GPU ref mutator. Calculates bounding client rect in the measure phase and sets transform in mutate phase.',
    code: `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function FloatingElement() {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Directly mutates elementRef.current.style.transform on RAF ticker
  useParallax(elementRef, {
    speed: 0.2,
    direction: 'vertical',
    clamp: [-150, 150],
  });

  return <div ref={elementRef} className="floating-card" />;
}`,
  },
  useReveal: {
    desc: 'IntersectionObserver wrapper that computes distance-adjusted entry triggers with zero re-renders unless requested.',
    code: `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function StaggerCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { inView, progress } = useReveal(cardRef, {
    threshold: 0.2,
    once: true,
  });

  return (
    <div ref={cardRef} className={inView ? 'opacity-100' : 'opacity-0'}>
      Revealed: {progress.toFixed(2)}
    </div>
  );
}`,
  },
  usePin: {
    desc: 'Calculates pinning bounds and preserves document flow using native sticky physics without layout thrashing.',
    code: `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function PinnedHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isPinned, progress } = usePin(heroRef, {
    start: 'top top',
    end: '+=100%',
    pinSpacing: true,
  });

  return (
    <div ref={heroRef} className={isPinned ? 'is-locked' : 'is-scrolling'}>
      Pin Progress: {progress.toFixed(2)}
    </div>
  );
}`,
  },
};

export function HooksRawSection() {
  const [activeTab, setActiveTab] = useState<HookTab>('useScrollProgress');
  const [metrics, setMetrics] = useState({
    scroll: 0,
    progress: 0,
    velocity: 0,
    direction: 0,
    fps: 120,
    timestamp: 0,
  });

  const { subscribe } = useScrollCraft();

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFps = 120;

    const unsub = subscribe((m) => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 500) {
        currentFps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
      }

      setMetrics({
        scroll: Math.round(m.scroll || 0),
        progress: Number((m.progress || 0).toFixed(4)),
        velocity: Number((m.velocity || 0).toFixed(3)),
        direction: m.direction || 0,
        fps: Math.min(currentFps || 120, 120),
        timestamp: Math.round(now),
      });
    });

    return () => unsub();
  }, [subscribe]);

  const activeSnippet = HOOK_SNIPPETS[activeTab];

  return (
    <section id="hooks" className="relative w-full bg-[#050505] py-24 sm:py-32 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="down" distance={15}>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-3 block">
              Reactive Hooks &bull; Raw Data
            </span>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Prefer to build your own? <br />
              <span className="text-zinc-400">Here&apos;s the data.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans">
              Headless hooks exposing high-precision physics telemetry, mutable ref values, and 3-phase microtask lifecycle events.
            </p>
          </Reveal>
        </div>

        {/* Hook Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(['useScrollProgress', 'useParallax', 'useReveal', 'usePin'] as HookTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500/30'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tab}()
              </button>
            );
          })}
        </div>

        {/* Split Grid: Code (Left) vs Live Telemetry Panel (Right) */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Code viewer */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-mono font-bold text-white">{activeTab}()</span>
                </div>
                <Link
                  href="/docs#hooks"
                  className="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>Hook Reference</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {activeSnippet.desc}
              </p>

              <CodeViewer code={activeSnippet.code} fileName={`${activeTab}.ts`} />
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>TypeScript Native</span>
              <span>RSC &amp; App Router Compatible</span>
            </div>
          </div>

          {/* Right: Live Ticking Telemetry Readout */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#070709] p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Live Telemetry Stream
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Ticking</span>
                </div>
              </div>

              {/* Real-time Metric Readout Cards */}
              <div className="space-y-3">
                
                {/* Scroll Offset */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                  <span className="text-zinc-400">metrics.scroll</span>
                  <span className="text-white font-bold">{metrics.scroll} px</span>
                </div>

                {/* Normalized Progress */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                  <span className="text-zinc-400">metrics.progress</span>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                        style={{ width: `${Math.round(metrics.progress * 100)}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 font-bold">{metrics.progress.toFixed(4)}</span>
                  </div>
                </div>

                {/* Instantaneous Velocity */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                  <span className="text-zinc-400">metrics.velocity</span>
                  <span className="text-blue-400 font-bold">{metrics.velocity.toFixed(3)} px/f</span>
                </div>

                {/* Direction */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                  <span className="text-zinc-400">metrics.direction</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    metrics.direction === 1
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : metrics.direction === -1
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {metrics.direction === 1 ? '1 (DOWN)' : metrics.direction === -1 ? '-1 (UP)' : '0 (STATIONARY)'}
                  </span>
                </div>

                {/* Hardware Frame Rate */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                  <span className="text-zinc-400">hardware.fps</span>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-emerald-400 font-bold">{metrics.fps} FPS</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Invariant Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Readings via Lenis subscriber</span>
              <span>&lt; 0.1ms read cycle</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
