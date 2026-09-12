'use client';

import React from 'react';
import { Reveal } from '@scrollcraft/react';

const FEATURES = [
  {
    title: '3-Phase Ticker',
    desc: 'Measure. Update. Render. A pure game-dev loop for zero layout thrashing.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 group-hover:text-white transition-colors">
        <path d="M3 12h4l3-8 4 16 3-8h4" />
        <circle cx="10" cy="12" r="2" className="text-blue-500" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'Zero Re-Renders',
    desc: 'We write directly to node.style.transform via refs. React never knows the scroll changed.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 group-hover:text-white transition-colors">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12l8.73-5.04" />
        <path d="M12 22.08V12" />
      </svg>
    )
  },
  {
    title: 'Lenis Integration',
    desc: 'Industry standard smooth scroll momentum, baked into the core engine for cross-browser parity.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 group-hover:text-white transition-colors">
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" />
        <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8" className="text-blue-500" />
      </svg>
    )
  },
  {
    title: 'Tiny & Modular',
    desc: 'Only what you need. Tree-shakable, framework friendly, built for performance.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 group-hover:text-white transition-colors">
        <path d="M2 12h20M12 2v20" />
        <rect x="7" y="7" width="10" height="10" rx="2" className="text-blue-500" strokeWidth="1" />
      </svg>
    )
  }
] as const;

export function FeaturesSection() {
  return (
    <section className="relative w-full bg-[#050505] py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Left Header */}
        <div className="w-full lg:w-1/4 flex flex-col">
          <Reveal>
            <span className="text-xs font-mono text-zinc-500 mb-4 block">05</span>
            <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase leading-loose mb-12">
              EVERYTHING<br/>YOU NEED
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
              Real Scroll.<br/>Real Performance.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A lightweight scroll engine designed around native scroll bindings instead of React state updates.
            </p>
          </Reveal>
        </div>

        {/* Right Cards Grid */}
        <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={i} direction="up" delay={0.1 + i * 0.1} distance={35} duration={0.7} className="h-full">
              <div className="group relative flex flex-col p-8 rounded-2xl bg-[#09090b] border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 h-full shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                <div className="mb-6 h-12 w-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-blue-500/40 group-hover:bg-zinc-800 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm font-light">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
