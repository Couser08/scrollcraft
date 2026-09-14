'use client';

/**
 * ScrollCraft Section 2: Primitives Showcase
 * - Headline: "You build the markup. We handle the physics."
 * - 4 split-panel demos: Parallax, Reveal, Pin, ScrollProgress
 * - Code on the left (syntax-highlighted), live reactive render on the right.
 */

import React, { useState, useEffect } from 'react';
import { Parallax, Reveal, useScrollCraft } from '@scrollcraft/react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Layers, Eye, Lock, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type PrimitiveKey = 'parallax' | 'reveal' | 'pin' | 'progress';

const DEMO_CONFIGS = {
  parallax: {
    id: 'parallax',
    name: '<Parallax />',
    tag: 'Depth & Physics',
    icon: Layers,
    description: 'Hardware-composited multi-axis scroll displacement without React state invalidation.',
    code: `import { Parallax } from '@scrollcraft/react';

export function DepthCards() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl bg-zinc-950">
      {/* Background slow drift */}
      <Parallax speed={-0.15} className="absolute inset-x-6 top-6">
        <div className="h-28 rounded-lg bg-zinc-900 border border-zinc-800" />
      </Parallax>

      {/* Midground anchor */}
      <Parallax speed={0.05} className="absolute inset-x-10 top-14">
        <div className="h-28 rounded-lg bg-zinc-850 border border-zinc-700 shadow-xl" />
      </Parallax>

      {/* Foreground fast focus */}
      <Parallax speed={0.25} className="absolute inset-x-14 top-22">
        <div className="h-28 rounded-lg bg-blue-950/40 border border-blue-500/40 shadow-2xl" />
      </Parallax>
    </div>
  );
}`,
  },
  reveal: {
    id: 'reveal',
    name: '<Reveal />',
    tag: 'Batched Transitions',
    icon: Eye,
    description: 'Batched IntersectionObserver triggers with stagger, distance, and hardware GPU acceleration.',
    code: `import { Reveal } from '@scrollcraft/react';

export function StaggeredGrid() {
  const steps = ['Measure', 'Mutate', 'Render'];

  return (
    <div className="grid grid-cols-3 gap-3">
      {steps.map((title, i) => (
        <Reveal
          key={title}
          direction="up"
          distance={30}
          delay={i * 0.12}
          duration={0.6}
        >
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs font-mono text-blue-400">0{i + 1}</span>
            <h4 className="font-bold text-white text-sm mt-1">{title}</h4>
          </div>
        </Reveal>
      ))}
    </div>
  );
}`,
  },
  pin: {
    id: 'pin',
    name: '<Pin />',
    tag: 'Sticky Layouts',
    icon: Lock,
    description: 'Pure sticky lock-in physics without layout thrashing, dummy wrappers, or spacer jumps.',
    code: `import { Pin } from '@scrollcraft/react';

export function StickyNarrative() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-zinc-950">
      {/* Sticky panel locks position while narrative flows */}
      <Pin asChild start="top top" end="+=100%">
        <div className="w-1/3 p-4 rounded-lg bg-blue-950/30 border border-blue-500/30 self-start">
          <h4 className="font-bold text-white text-sm">Locked Focus</h4>
          <p className="text-xs text-zinc-400 mt-1">Sticky without DOM spacers</p>
        </div>
      </Pin>
      <div className="w-2/3 space-y-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">Step 01 &bull; Compositor</div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">Step 02 &bull; Subpixel Lerp</div>
      </div>
    </div>
  );
}`,
  },
  progress: {
    id: 'progress',
    name: '<ScrollProgress />',
    tag: 'Progress Metrics',
    icon: Compass,
    description: 'Direct scaleX or circular path dashoffset normalization mapping 0.0 to 1.0 with 0 re-renders.',
    code: `import { ScrollProgress } from '@scrollcraft/react';

export function ReadingGauge() {
  return (
    <div className="flex items-center gap-4">
      {/* Normalized progress bar */}
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <ScrollProgress asChild>
          <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 origin-left" />
        </ScrollProgress>
      </div>
    </div>
  );
}`,
  },
};

export function PrimitivesShowcase() {
  const [activeTab, setActiveTab] = useState<PrimitiveKey>('parallax');
  const activeConfig = DEMO_CONFIGS[activeTab];

  // For live progress display in demo 4
  const [metrics, setMetrics] = useState({ progress: 0, velocity: 0, direction: 0 });
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    const unsub = subscribe((m) => {
      setMetrics({
        progress: m.progress || 0,
        velocity: m.velocity || 0,
        direction: m.direction || 0,
      });
    });
    return () => unsub();
  }, [subscribe]);

  const pct = Math.round(metrics.progress * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <section id="primitives" className="relative w-full bg-[#050505] py-24 sm:py-32 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="down" distance={15}>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 mb-3 block">
              Core Primitives &bull; Beta
            </span>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              You build the markup. <br />
              <span className="text-zinc-400">We handle the physics.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans">
              Declarative, slot-based components that mutate hardware transform styles directly on the GPU thread.
            </p>
          </Reveal>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-xl">
          {(Object.keys(DEMO_CONFIGS) as PrimitiveKey[]).map((key) => {
            const item = DEMO_CONFIGS[key];
            const Icon = item.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Split Panel: Code (Left) vs Live Render (Right) */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Code Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <activeConfig.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono font-bold text-white">{activeConfig.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {activeConfig.tag}
                  </span>
                </div>
                <Link
                  href={`/docs#${activeConfig.id}`}
                  className="text-xs font-mono text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <span>API Docs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {activeConfig.description}
              </p>

              <CodeViewer code={activeConfig.code} fileName={`${activeConfig.id}-demo.tsx`} />
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Direct DOM write</span>
              <span>Zero React re-renders</span>
            </div>
          </div>

          {/* Right: Live Interactive Render */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-[#070709] p-6 flex flex-col justify-center relative overflow-hidden shadow-2xl min-h-[380px]">
            
            {/* Live Interactive Render: Parallax */}
            {activeTab === 'parallax' && (
              <div className="relative w-full h-[320px] rounded-xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b20,transparent_70%)]" />

                {/* Layer 1: Background slow */}
                <Parallax speed={-0.2} className="absolute w-4/5 h-36 rounded-xl bg-zinc-900/90 bg-[url('/images/parallax-depth-bg.webp')] bg-cover bg-center border border-zinc-800 flex flex-col justify-between p-4 shadow-lg top-6">
                  <span className="text-[10px] font-mono text-zinc-500">LAYER 01 &bull; SPEED -0.2</span>
                  <div className="w-1/2 h-2 rounded bg-zinc-800" />
                </Parallax>

                {/* Layer 2: Midground */}
                <Parallax speed={0.08} className="absolute w-3/4 h-36 rounded-xl bg-zinc-850 bg-[url('/images/parallax-depth-mid.webp')] bg-cover bg-center border border-zinc-700/80 flex flex-col justify-between p-4 shadow-xl top-14">
                  <span className="text-[10px] font-mono text-zinc-400">LAYER 02 &bull; SPEED +0.08</span>
                  <div className="w-2/3 h-2 rounded bg-zinc-700" />
                </Parallax>

                {/* Layer 3: Foreground */}
                <Parallax speed={0.28} className="absolute w-2/3 h-36 rounded-xl bg-zinc-900 bg-[url('/images/parallax-depth-fore.webp')] bg-cover bg-center border border-blue-500/50 flex flex-col justify-between p-4 shadow-2xl top-24">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-400">LAYER 03 &bull; SPEED +0.28</span>
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-4/5 h-2.5 rounded bg-blue-400/30" />
                    <div className="w-1/2 h-2 rounded bg-zinc-700" />
                  </div>
                </Parallax>

                <div className="absolute bottom-3 text-center text-[10px] font-mono text-zinc-500 z-20">
                  &uarr;&darr; Scroll viewport to see depth parallax
                </div>
              </div>
            )}

            {/* Live Interactive Render: Reveal */}
            {activeTab === 'reveal' && (
              <div className="w-full space-y-3">
                <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Staggered Reveal Demo</span>
                  <span className="text-emerald-400">Batched Observer</span>
                </div>
                {['01. Measure Phase', '02. Compute Transforms', '03. Compositor Paint'].map((title, i) => (
                  <Reveal key={title} direction="up" distance={25} delay={i * 0.15} duration={0.6}>
                    <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-semibold text-white">{title}</h5>
                          <p className="text-[11px] text-zinc-500">GPU transform without layout thrashing</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                        In View
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Live Interactive Render: Pin */}
            {activeTab === 'pin' && (
              <div className="w-full p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-white">Sticky Pinning Container</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    pinSpacing: true
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Pinned Focal Node</span>
                    <h5 className="text-sm font-bold text-white">Locked at viewport</h5>
                    <p className="text-[11px] text-zinc-400">Position remains fixed while steps scrub smoothly.</p>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                      Step 1 &bull; 0vh to 50vh
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                      Step 2 &bull; 50vh to 100vh
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-zinc-500">
                      Step 3 &bull; Unpins gracefully
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Interactive Render: ScrollProgress */}
            {activeTab === 'progress' && (
              <div className="w-full flex flex-col items-center justify-center p-6 space-y-6">
                {/* SVG Progress Dial */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#27272a"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-[stroke-dashoffset] duration-75 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-2xl font-black text-white">{pct}%</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Scrolled</span>
                  </div>
                </div>

                {/* Real-time Ticking Readouts */}
                <div className="w-full grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Progress</span>
                    <span className="text-blue-400 font-bold">{metrics.progress.toFixed(3)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Velocity</span>
                    <span className="text-emerald-400 font-bold">{metrics.velocity.toFixed(2)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Direction</span>
                    <span className="text-amber-400 font-bold">{metrics.direction === 1 ? 'DOWN' : metrics.direction === -1 ? 'UP' : 'IDLE'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
