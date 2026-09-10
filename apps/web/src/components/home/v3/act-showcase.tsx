'use client';

import React from 'react';
import { Parallax, VelocityMarquee, Reveal } from '@scrollcraft/react';

export function ActShowcase() {
  return (
    <section className="relative min-h-[150vh] w-full py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Feel the Physics
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Interact with the core primitives below.
          </p>
        </Reveal>
      </div>

      {/* Velocity Marquee */}
      <div className="w-full mb-32 -mx-6 w-[calc(100%+3rem)]">
        <VelocityMarquee 
          baseSpeed={-2} 
          className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-100 uppercase whitespace-nowrap"
        >
          Zero Re-renders • 120 FPS • Smooth Scrolling • 
        </VelocityMarquee>
        <VelocityMarquee 
          baseSpeed={2}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text whitespace-nowrap"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}
        >
          Direct GPU Writes • Lenis Physics • Next.js Native • 
        </VelocityMarquee>
      </div>

      {/* Parallax Showcase */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal direction="right">
            <h3 className="text-3xl font-bold text-white mb-4">True Parallax.</h3>
            <p className="text-zinc-400 leading-relaxed">
              Objects move independently of the scroll plane without ever touching React state.
              The Ticker handles the lerp, your GPU handles the pixels.
            </p>
          </Reveal>
        </div>
        <div className="relative h-96 w-full rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          <Parallax speed={-0.2} className="absolute left-8 top-12" style={{ willChange: 'transform' }}>
            <div className="w-24 h-24 rounded-full bg-blue-500 border border-blue-400 opacity-20 shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
          </Parallax>
          <Parallax speed={0.15} style={{ willChange: 'transform' }}>
            <div className="w-48 h-64 rounded-xl bg-zinc-800 border border-white/10 shadow-2xl z-10" />
          </Parallax>
          <Parallax speed={0.3} className="absolute right-12 bottom-12 z-20" style={{ willChange: 'transform' }}>
            <div className="w-32 h-32 rounded-lg bg-orange-500 border border-orange-400 opacity-20 shadow-[0_0_50px_rgba(249,115,22,0.3)] rotate-12" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
