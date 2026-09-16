'use client';

/**
 * ScrollCraft Section: Pure Architecture & Runtime Invariants
 * Replaces competitor bashing with confident engineering facts and open attribution.
 * 
 * Features:
 * - Built for Pure Performance & Zero-Jank DX
 * - Core Architecture & Runtime Invariants
 * - Verified Production Footprint
 * - Open Source Attribution: Special Thanks to Studio Freight's Lenis
 */

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import { Zap, Activity, Maximize2, EyeOff, Layers, ShieldCheck, Heart } from 'lucide-react';

const ARCHITECTURE_INVARIANTS = [
  {
    icon: <Zap className="w-5 h-5 text-violet-400" />,
    title: 'Strict 0 React Re-renders During Scroll',
    description:
      'All frame-by-frame updates execute via direct DOM GPU compositor writes (transform, opacity, filter) inside Ticker Phase 3 (render). Zero VDOM reconciliation loops.',
  },
  {
    icon: <Activity className="w-5 h-5 text-indigo-400" />,
    title: 'Centralized 3-Phase Ticker',
    description:
      'A single coordinated loop with strict separation of concerns: cached geometry measurement (Phase 1), typed array mathematical updates (Phase 2), and batched DOM writes (Phase 3).',
  },
  {
    icon: <Maximize2 className="w-5 h-5 text-emerald-400" />,
    title: 'Consolidated Resize Architecture',
    description:
      'Zero rogue observers; all elements route through a unified singleton GlobalResizeManager to batch layout passes and eliminate reflow thrashing.',
  },
  {
    icon: <EyeOff className="w-5 h-5 text-amber-400" />,
    title: 'Autonomous Viewport Culling',
    description:
      'Off-screen solvers pause execution automatically to keep idle CPU at 0.0%. On tab backgrounding, the ticker halts immediately to preserve mobile battery.',
  },
  {
    icon: <Layers className="w-5 h-5 text-sky-400" />,
    title: 'Self-Contained Headless Primitives',
    description:
      'Headless layout calculation handles offsets and track spacing without injecting intrusive wrapper DOM nodes or breaking CSS Grid and Flexbox hierarchies.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    title: '100% Permissive Open Source',
    description:
      'Licensed under MIT for unrestricted personal and commercial use. No commercial paywalls, domain locks, or license keys required.',
  },
];

const FOOTPRINT_METRICS = [
  {
    label: '< 5 KB Brotli',
    detail: 'Single Primitive Entry',
    sub: 'e.g. <Parallax> tree-shaken standalone',
  },
  {
    label: '~15.9 KB Brotli',
    detail: 'Full @scrollcraft/core',
    sub: 'Complete engine with all 9 physics solvers',
  },
  {
    label: '~24 KB Brotli',
    detail: 'Complete Monorepo Stack',
    sub: '@scrollcraft/core + react + r3f combined',
  },
];

export function ComparisonSection() {
  return (
    <section id="architecture" className="relative w-full bg-[#050505] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="down" distance={15}>
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-violet-400 mb-3 block">
              Core Architecture &amp; Invariants
            </span>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Built for Pure Performance &amp; Zero-Jank DX
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
              ScrollCraft is a high-performance, GPU-composited motion engine built specifically for React and modern frameworks. It delivers declarative primitives and headless hooks engineered around strict runtime invariants.
            </p>
          </Reveal>
        </div>

        {/* 6 Core Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {ARCHITECTURE_INVARIANTS.map((item, idx) => (
            <Reveal key={item.title} direction="up" distance={20} delay={idx * 0.06}>
              <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between h-full shadow-lg">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 font-sans tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Verified Production Footprint Strip */}
        <Reveal direction="up" distance={25} delay={0.2}>
          <div className="max-w-6xl mx-auto rounded-2xl border border-zinc-800/90 bg-[#09090b] p-6 sm:p-8 mb-12 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold block mb-1">
                  Distribution Footprint
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white font-sans">
                  Verified Production Footprint
                </h4>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Next.js 15 + React 19 Tested
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {FOOTPRINT_METRICS.map((metric) => (
                <div key={metric.label} className="flex flex-col p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight text-violet-400">
                    {metric.label}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200 mt-1 font-sans">
                    {metric.detail}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 font-sans">
                    {metric.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Architecture & Attributions Banner */}
        <Reveal direction="up" distance={20} delay={0.3}>
          <div className="max-w-6xl mx-auto rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/20 via-[#0a0a0e] to-zinc-900/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5 text-violet-300">
                <Heart className="w-5 h-5 text-violet-400 fill-violet-400/20" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">
                    Architecture &amp; Attributions
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                    Open Source Credit
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                  Custom React Motion Engine &bull; Lenis Physics Prior Art
                </h4>
                <div className="text-xs sm:text-sm text-zinc-400 max-w-3xl space-y-1.5 leading-relaxed font-sans">
                  <p>
                    <strong className="text-zinc-200">ScrollCraft Motion Engine:</strong> The core multi-phase ticker, zero-rerender DOM compositor, and declarative primitives (<code className="text-violet-300">&lt;Parallax&gt;</code>, <code className="text-violet-300">&lt;Pin&gt;</code>, <code className="text-violet-300">&lt;Reveal&gt;</code>, <code className="text-violet-300">&lt;StackedCards&gt;</code>) are custom in-house systems built from scratch for React.
                  </p>
                  <p>
                    <strong className="text-zinc-200">Smooth Inertia Normalization:</strong> Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers, wired directly into ScrollCraft&apos;s proprietary zero-rerender animation engine.
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://github.com/darkroomengineering/lenis"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors shrink-0 whitespace-nowrap shadow-sm"
            >
              Explore Lenis &rarr;
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
