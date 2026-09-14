'use client';

/**
 * ScrollCraft Showcase: "You Build. We Showcase."
 * Layout: One split panel per primitive / hook.
 * Code on the left (static, syntax-highlighted), live render on the right.
 * No prop tables, no variations, no component gallery sprawl.
 * Sells the feel, not the API.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Parallax, Reveal, useScrollCraft, ScrollMetrics } from '@scrollcraft/react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { ArrowRight, Activity, Zap, Compass, Lock, Eye, Layers } from 'lucide-react';

/* =========================================================================
   CODE SNIPPETS
   ========================================================================= */

const PARALLAX_CODE = `import { Parallax } from '@scrollcraft/react';

export function ParallaxDepthDemo() {
  return (
    <div className="relative h-[480px] overflow-hidden rounded-2xl bg-zinc-950">
      {/* Layer 1: Background slow drift */}
      <Parallax speed={-0.15} className="absolute inset-x-8 top-12">
        <div className="h-44 rounded-xl bg-zinc-900 border border-zinc-800" />
      </Parallax>

      {/* Layer 2: Midground anchor */}
      <Parallax speed={0.05} className="absolute inset-x-12 top-28">
        <div className="h-44 rounded-xl bg-zinc-850 border border-zinc-700 shadow-xl" />
      </Parallax>

      {/* Layer 3: Foreground fast floating focal card */}
      <Parallax speed={0.25} className="absolute inset-x-16 top-44">
        <div className="h-44 rounded-xl bg-zinc-800 border border-blue-500/40 shadow-2xl" />
      </Parallax>
    </div>
  );
}`;

const REVEAL_CODE = `import { Reveal } from '@scrollcraft/react';

export function StaggeredRevealDemo() {
  const cards = ['Measure Phase', 'Update Phase', 'Render Phase'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((title, index) => (
        <Reveal
          key={title}
          direction="up"
          distance={36}
          duration={0.65}
          delay={index * 0.15}
        >
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-xs text-zinc-400 mt-2">Zero React re-renders on trigger</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}`;

const PIN_CODE = `import { Pin } from '@scrollcraft/react';

export function StickyPinDemo() {
  return (
    <div className="relative flex gap-8">
      {/* Sticky panel locks position while steps scroll past */}
      <Pin start="top top" end="+=120%">
        <div className="w-64 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-mono text-blue-400">PINNED PANEL</span>
          <h3 className="text-lg font-bold text-white mt-1">Locked in Viewport</h3>
        </div>
      </Pin>

      {/* Sequential narrative steps */}
      <div className="flex-1 space-y-24 py-8">
        <div className="step-card">Step 01: Capture Gesture</div>
        <div className="step-card">Step 02: Solve Inertia</div>
        <div className="step-card">Step 03: Direct GPU Composite</div>
      </div>
    </div>
  );
}`;

const SCROLL_PROGRESS_CODE = `import { ScrollProgress } from '@scrollcraft/react';

export function CircularProgressDemo() {
  return (
    <ScrollProgress asChild>
      {(progress) => {
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress);

        return (
          <div className="flex flex-col items-center justify-center p-8">
            <svg className="w-36 h-36 -rotate-90">
              <circle cx="72" cy="72" r={radius} className="stroke-zinc-800" strokeWidth="8" fill="none" />
              <circle
                cx="72" cy="72" r={radius}
                className="stroke-blue-500 transition-all duration-75"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <span className="font-mono text-2xl font-black mt-2 text-white">
              {Math.round(progress * 100)}%
            </span>
          </div>
        );
      }}
    </ScrollProgress>
  );
}`;

const HOOK_SCROLL_PROGRESS_CODE = `import { useScrollProgress } from '@scrollcraft/react';

export function ProgressTelemetry() {
  // Directly reads normalized scroll coordinates and velocity
  const { progress, direction, velocity } = useScrollProgress();

  return (
    <div className="telemetry-readout">
      <div>Progress: {progress.toFixed(2)}</div>
      <div>Direction: {direction}</div>
      <div>Velocity: {velocity.toFixed(2)} px/frame</div>
    </div>
  );
}`;

const HOOK_PARALLAX_CODE = `import { useParallax } from '@scrollcraft/react';

export function ParallaxOffsetTelemetry() {
  // Headless hook writes transforms directly to ref without React state updates
  const { ref, offset } = useParallax<HTMLDivElement>({
    speed: 0.25,
    clamp: [-120, 120],
  });

  return (
    <div ref={ref} className="floating-card">
      <span>Transform Offset: {offset.toFixed(1)}px</span>
      <span>Speed Multiplier: 0.25</span>
    </div>
  );
}`;

const HOOK_REVEAL_CODE = `import { useReveal } from '@scrollcraft/react';

export function RevealSensor() {
  // Subscribes element to global IntersectionObserver with 0 layout thrashing
  const { ref, inView } = useReveal<HTMLDivElement>({
    threshold: 0.25,
    once: false,
  });

  return (
    <div ref={ref} className={inView ? 'active-border' : 'idle-border'}>
      <span>InView: {inView ? 'TRUE' : 'FALSE'}</span>
      <span>Threshold: 25% viewport crossing</span>
    </div>
  );
}`;

const HOOK_PIN_CODE = `import { usePin } from '@scrollcraft/react';

export function PinDiagnostics() {
  // Tracks pin lock state and relative progression through the pinned budget
  const { ref, isPinned, progress } = usePin<HTMLDivElement>({
    start: 'top top',
    end: '+=100%',
  });

  return (
    <div ref={ref}>
      <div>Pin State: {isPinned ? 'PINNED (LOCKED)' : 'IDLE (FLOWING)'}</div>
      <div>Scrub Progress: {(progress * 100).toFixed(0)}%</div>
    </div>
  );
}`;

/* =========================================================================
   SHOWCASE HUB MAIN COMPONENT
   ========================================================================= */

export const ShowcaseHub: React.FC = () => {
  const { subscribe } = useScrollCraft();

  // Live real-time scroll telemetry
  const [telemetry, setTelemetry] = useState<{
    progress: number;
    scroll: number;
    velocity: number;
    direction: 1 | -1 | 0;
  }>({
    progress: 0,
    scroll: 0,
    velocity: 0,
    direction: 0,
  });

  // Reveal intersection state
  const [revealInView, setRevealInView] = useState(false);
  const revealTargetRef = useRef<HTMLDivElement>(null);

  // Pin section progress state
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const [pinProgress, setPinProgress] = useState(0.35);
  const [isPinnedState, setIsPinnedState] = useState(false);

  // Subscribe to ScrollCraft core engine for 60/120 FPS ticking telemetry
  useEffect(() => {
    let lastRaf: number | null = null;
    const unsub = subscribe((metrics: ScrollMetrics) => {
      if (lastRaf) return;
      lastRaf = requestAnimationFrame(() => {
        setTelemetry({
          progress: metrics.progress,
          scroll: Math.round(metrics.scroll),
          velocity: Math.round(metrics.velocity * 100) / 100,
          direction: metrics.direction,
        });

        // Compute relative pin section progression
        if (pinContainerRef.current) {
          const rect = pinContainerRef.current.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          const totalDistance = rect.height - viewHeight;
          if (totalDistance > 0) {
            const currentScrolled = -rect.top;
            const ratio = Math.max(0, Math.min(1, currentScrolled / totalDistance));
            setPinProgress(ratio);
            setIsPinnedState(rect.top <= 80 && rect.bottom >= viewHeight);
          }
        }

        lastRaf = null;
      });
    });

    return () => {
      unsub();
      if (lastRaf) cancelAnimationFrame(lastRaf);
    };
  }, [subscribe]);

  // Observer for useReveal hook demo
  useEffect(() => {
    const el = revealTargetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRevealInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionLabel = telemetry.direction === 1 ? 'DOWN ↓' : telemetry.direction === -1 ? 'UP ↑' : 'IDLE —';
  const parallaxOffset = Math.round(((telemetry.progress * 2) - 1) * 60 * 10) / 10;

  return (
    <div className="w-full bg-[#050505] text-zinc-100 selection:bg-blue-500/20 selection:text-white pb-32">
      
      {/* Top Banner Header */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-800/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Showcase &bull; Interactive Canonical Demos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] mb-4">
            You Build. <span className="text-blue-500">We Showcase.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
            One canonical example per primitive and hook. Code on the left, live reactive rendering on the right. 
            No component gallery sprawl &mdash; this page sells the <span className="text-zinc-200 font-medium">feel</span>, not the API.
          </p>
        </div>
      </section>

      {/* ===================================================================
          PART 1: PRIMITIVES SHOWCASE (SPLIT PANELS)
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 space-y-24">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">PART 01</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Core Primitives</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Declarative JSX components &bull; Direct GPU compositor writes
          </p>
        </div>

        {/* -----------------------------------------------------------------
            Primitive 1: <Parallax />
            3 layered cards/shapes drifting at different scroll speeds
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code Block */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  &lt;Parallax /&gt;
                </span>
                <span className="text-xs text-zinc-400">Depth, not decoration</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={PARALLAX_CODE} fileName="parallax-depth.tsx" />
          </div>

          {/* Right: Live Scene */}
          <div className="lg:col-span-6 h-[460px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>3-Layer Depth Field</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Scroll to feel physical depth</span>
            </div>

            {/* Visual Layers drifting at 3 distinct speeds */}
            <div className="relative w-full h-[320px] flex items-center justify-center my-auto">
              {/* Layer 1: Background slow lag (speed: -0.2) */}
              <Parallax speed={-0.2} className="absolute w-[86%] h-36 -top-4 rounded-2xl bg-zinc-900/90 bg-[url('/images/parallax-depth-bg.webp')] bg-cover bg-center border border-zinc-800/80 p-5 shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Layer 01 &bull; Background</span>
                  <span className="text-[10px] font-mono text-zinc-400">speed: -0.20</span>
                </div>
                <div className="text-sm font-semibold text-zinc-400">Volumetric Slate Substratum</div>
              </Parallax>

              {/* Layer 2: Midground natural anchor (speed: 0.05) */}
              <Parallax speed={0.05} className="absolute w-[92%] h-36 top-14 rounded-2xl bg-zinc-850/95 bg-[url('/images/parallax-depth-mid.webp')] bg-cover bg-center border border-zinc-700/80 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Layer 02 &bull; Midground</span>
                  <span className="text-[10px] font-mono text-blue-400">speed: +0.05</span>
                </div>
                <div className="text-base font-bold text-zinc-200">Natural Geometry Surface</div>
              </Parallax>

              {/* Layer 3: Foreground fast focal card (speed: 0.35) */}
              <Parallax speed={0.35} className="absolute w-full h-36 top-32 rounded-2xl bg-[#11131a] bg-[url('/images/parallax-depth-fore.webp')] bg-cover bg-center border border-blue-500/40 p-5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">Layer 03 &bull; Foreground Focal</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">speed: +0.35</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white">Titanium Specular Core</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">High-velocity foreground drift</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </Parallax>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 z-20">
              <span>Zero wrapper DOM overhead</span>
              <span>120 FPS Direct Transform</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Primitive 2: <Reveal />
            A row of cards fading + sliding in one-by-one as they cross the viewport
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code Block */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  &lt;Reveal /&gt;
                </span>
                <span className="text-xs text-zinc-400">Viewport-crossing stagger</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={REVEAL_CODE} fileName="reveal-stagger.tsx" />
          </div>

          {/* Right: Live Scene */}
          <div className="lg:col-span-6 min-h-[460px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Single Observer Pipeline</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Staggered hardware acceleration</span>
            </div>

            {/* Row of cards fading + sliding in one-by-one */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
              {[
                { title: '01 Measure', desc: 'Read scroll coordinates before style mutators', delay: 0.1, tag: 'TICKER_1' },
                { title: '02 Update', desc: 'Compute physics curves with zero state alloc', delay: 0.25, tag: 'TICKER_2' },
                { title: '03 Render', desc: 'Direct GPU composite write to ref.style', delay: 0.4, tag: 'TICKER_3' },
              ].map((item) => (
                <Reveal
                  key={item.title}
                  direction="up"
                  distance={40}
                  duration={0.7}
                  delay={item.delay}
                  className="h-full"
                >
                  <div className="h-full p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/40 transition-colors flex flex-col justify-between group">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 font-bold block mb-2">{item.tag}</span>
                      <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">{item.title}</h4>
                      <p className="text-xs text-zinc-400 font-light mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                      delay: {item.delay}s
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-4 mt-6">
              <span>Cubic-bezier acceleration</span>
              <span>Zero React re-renders</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Primitive 3: <Pin />
            A sticky panel holding position while 2-3 steps scroll past it
            ----------------------------------------------------------------- */}
        <div ref={pinContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code Block */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  &lt;Pin /&gt;
                </span>
                <span className="text-xs text-zinc-400">Sticky viewport locking</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={PIN_CODE} fileName="sticky-pin.tsx" />
          </div>

          {/* Right: Live Scene */}
          <div className="lg:col-span-6 min-h-[460px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>PinSolver Geometry</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                isPinnedState ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {isPinnedState ? 'LOCKED IN VIEWPORT' : 'FLOWING'}
              </span>
            </div>

            {/* Split sub-view inside the live panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
              {/* Sticky Card holding position */}
              <div className="sticky top-6 self-start p-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 shadow-xl space-y-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Pinned Focus Node</h4>
                  <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                    Holds position dynamically while the steps to the right scroll through the section.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between">
                  <span>Scrub: {Math.round(pinProgress * 100)}%</span>
                  <span>Spacing: preserved</span>
                </div>
              </div>

              {/* 3 Steps scrolling past */}
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Capture Wheel Intent', text: 'Subpixel delta normalization across trackpads and mouse wheels.' },
                  { step: '02', title: 'Solve Pin Boundaries', text: 'Calculate entry, lock height, and unpin triggers without layout shifts.' },
                  { step: '03', title: 'Release Smooth Flow', text: 'Seamless handoff back to native document scrolling with zero hitch.' },
                ].map((s, i) => {
                  const isActive = (pinProgress * 3) >= i;
                  return (
                    <div
                      key={s.step}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-zinc-900 border-zinc-700 text-white shadow-md'
                          : 'bg-zinc-950/60 border-zinc-850 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-mono mb-1">
                        <span className={isActive ? 'text-blue-400 font-bold' : 'text-zinc-600'}>{s.step}</span>
                        <span className="font-semibold">{s.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3">
              <span>Automatic pinSpacing calculation</span>
              <span>Subpixel lock stability</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Primitive 4: <ScrollProgress />
            A circular SVG ring filling as the visitor scrolls through the section
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code Block */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  &lt;ScrollProgress /&gt;
                </span>
                <span className="text-xs text-zinc-400">Continuous metric mapping</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={SCROLL_PROGRESS_CODE} fileName="scroll-progress-ring.tsx" />
          </div>

          {/* Right: Live Scene */}
          <div className="lg:col-span-6 h-[460px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Circular SVG Progress Ring</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Live scroll-linked stroke</span>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Track circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    strokeWidth="10"
                    className="stroke-zinc-800/80 fill-none"
                  />
                  {/* Active progress stroke */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    strokeWidth="10"
                    strokeDasharray={402.12}
                    strokeDashoffset={402.12 * (1 - telemetry.progress)}
                    strokeLinecap="round"
                    className="stroke-blue-500 fill-none transition-all duration-100 ease-out"
                  />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">
                    {Math.round(telemetry.progress * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                    Progress
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6 text-xs font-mono text-zinc-400">
                <span>Offset: {telemetry.scroll}px</span>
                <span>&bull;</span>
                <span>Velocity: {telemetry.velocity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3">
              <span>Radix-style asChild slot composition</span>
              <span>SVG dashoffset GPU pipeline</span>
            </div>
          </div>
        </div>

      </section>

      {/* ===================================================================
          PART 2: HOOKS SHOWCASE (RAW ACCESS + LIVE READOUT PANELS)
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 space-y-24">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">PART 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reactive Hooks (Raw Access)</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Direct element refs &bull; Live ticking numeric readouts as you scroll
          </p>
        </div>

        {/* -----------------------------------------------------------------
            Hook 1: useScrollProgress
            Readout: progress (0–1), direction (up/down), velocity
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                useScrollProgress()
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={HOOK_SCROLL_PROGRESS_CODE} fileName="use-scroll-progress.ts" />
          </div>

          {/* Right: Live Readout Panel */}
          <div className="lg:col-span-6 min-h-[380px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">LIVE NUMERIC READOUT</span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE ENGINE TICK
              </span>
            </div>

            {/* Readout Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {/* Progress */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">progress (0–1)</span>
                <span className="text-3xl font-black font-mono text-white block">
                  {telemetry.progress.toFixed(3)}
                </span>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-75"
                    style={{ width: `${telemetry.progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Direction */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">direction</span>
                <span className={`text-2xl font-black font-mono block ${
                  telemetry.direction === 1 ? 'text-amber-400' : telemetry.direction === -1 ? 'text-blue-400' : 'text-zinc-400'
                }`}>
                  {directionLabel}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block mt-2">
                  1 (down) &bull; -1 (up) &bull; 0 (idle)
                </span>
              </div>

              {/* Velocity */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">velocity (px/f)</span>
                <span className="text-3xl font-black font-mono text-emerald-400 block">
                  {telemetry.velocity.toFixed(2)}
                </span>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.abs(telemetry.velocity) * 15)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3">
              <span>Calculated at hardware frame boundaries</span>
              <span>Zero allocation rAF loop</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Hook 2: useParallax
            Readout: transform offset, configurable speed
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                useParallax()
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={HOOK_PARALLAX_CODE} fileName="use-parallax.ts" />
          </div>

          {/* Right: Live Readout Panel */}
          <div className="lg:col-span-6 min-h-[380px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-white">TRANSFORM OFFSET SOLVER</span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                GPU MATRIX PIPELINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">transform offset</span>
                <span className="text-3xl font-black font-mono text-blue-400 block">
                  {parallaxOffset > 0 ? `+${parallaxOffset}px` : `${parallaxOffset}px`}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  matrix: translateY({parallaxOffset}px)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">speed multiplier</span>
                <span className="text-3xl font-black font-mono text-white block">
                  0.25
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  clamp boundary: [-120px, +120px]
                </span>
              </div>
            </div>

            {/* Dynamic visual slider */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-4">
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">-120px</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-4 bg-blue-500 rounded-full -translate-x-1/2 transition-all duration-75"
                  style={{ left: `${Math.max(5, Math.min(95, ((parallaxOffset + 120) / 240) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">+120px</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 mt-4">
              <span>Direct ref.style write</span>
              <span>No React component re-render</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Hook 3: useReveal
            Readout: inView boolean, delay/stagger control
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                useReveal()
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={HOOK_REVEAL_CODE} fileName="use-reveal.ts" />
          </div>

          {/* Right: Live Readout Panel */}
          <div ref={revealTargetRef} className="lg:col-span-6 min-h-[380px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">INTERSECTION SENSOR</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold transition-all ${
                revealInView
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}>
                {revealInView ? 'IN VIEWPORT' : 'OUT OF VIEWPORT'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {/* InView boolean */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">inView (boolean)</span>
                <span className={`text-2xl font-black font-mono block ${
                  revealInView ? 'text-emerald-400' : 'text-zinc-500'
                }`}>
                  {revealInView ? 'true' : 'false'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  status: {revealInView ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>

              {/* Delay */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">delay control</span>
                <span className="text-2xl font-black font-mono text-white block">
                  150ms
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  easing: cubic-bezier
                </span>
              </div>

              {/* Stagger */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">stagger step</span>
                <span className="text-2xl font-black font-mono text-white block">
                  50ms
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  threshold: 25%
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
              revealInView
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}>
              <span className="text-xs font-mono">
                {revealInView ? '✓ Target entered 25% threshold bounds' : 'Scroll this card across viewport to trigger'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                once: false
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 mt-4">
              <span>Global IntersectionObserver singleton</span>
              <span>Zero memory leaks</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Hook 4: usePin
            Readout: isPinned boolean, progress-within-pin-range
            ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                usePin()
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                Beta
              </span>
            </div>
            <CodeViewer code={HOOK_PIN_CODE} fileName="use-pin.ts" />
          </div>

          {/* Right: Live Readout Panel */}
          <div className="lg:col-span-6 min-h-[380px] rounded-2xl bg-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white">STICKY PIN SOLVER READOUT</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold transition-all ${
                isPinnedState
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}>
                {isPinnedState ? 'PIN LOCKED' : 'UNPINNED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* isPinned boolean */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">isPinned (boolean)</span>
                <span className={`text-2xl font-black font-mono block ${
                  isPinnedState ? 'text-amber-400' : 'text-zinc-500'
                }`}>
                  {isPinnedState ? 'true' : 'false'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                  lock point: top top
                </span>
              </div>

              {/* Progress within pin range */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">progress-within-pin-range</span>
                <span className="text-2xl font-black font-mono text-white block">
                  {pinProgress.toFixed(3)}
                </span>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-75"
                    style={{ width: `${pinProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Pin Distance: +=100% (1 viewport)</span>
              <span>Position: sticky</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 mt-4">
              <span>Layout diagnostic guard enabled</span>
              <span>Zero jump on unpin</span>
            </div>
          </div>
        </div>

      </section>

      {/* Bottom CTA to Docs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-[#0d0f17] to-[#08090d] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to scan the API reference?
            </h3>
            <p className="text-sm text-zinc-400 font-light mt-1">
              Read concise, reference-only docs designed to be scanned in under 15 seconds.
            </p>
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs transition-transform hover:scale-105 shadow-md shrink-0"
          >
            <span>Read Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
