'use client';

import React from 'react';
import Image from 'next/image';
import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroSection() {
  return (
    <section className="relative min-h-[120vh] w-full bg-[#050505] flex flex-col justify-center overflow-hidden pt-20 px-6">
      
      {/* Background Image Panels */}
      <div className="absolute inset-0 z-0 flex justify-center items-center gap-2 opacity-60">
        <Parallax speed={-0.15} className="w-[30%] h-[120%] overflow-hidden relative">
          <Image
            src="/images/hero-mountain.webp"
            alt="Hero mountain left panel"
            fill
            priority
            sizes="30vw"
            className="object-cover object-left"
          />
        </Parallax>
        <Parallax speed={-0.05} className="w-[40%] h-[120%] overflow-hidden relative">
          <Image
            src="/images/hero-mountain.webp"
            alt="Hero mountain center panel"
            fill
            priority
            sizes="40vw"
            className="object-cover object-center"
          />
        </Parallax>
        <Parallax speed={-0.15} className="w-[30%] h-[120%] overflow-hidden relative">
          <Image
            src="/images/hero-mountain.webp"
            alt="Hero mountain right panel"
            fill
            priority
            sizes="30vw"
            className="object-cover object-right"
          />
        </Parallax>
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-screen pb-20">
        
        <Reveal delay={0.2}>
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">SCROLL / ANIMATE / CREATE</span>
            <div className="h-[1px] w-12 bg-blue-500/50" />
          </div>
        </Reveal>

        <Reveal delay={0.3} distance={50}>
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-bold tracking-tighter text-white mb-6 leading-[1.05]">
            Turn Scroll <br />
            <span className="text-zinc-400">Into Stories.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed font-light mb-12">
            A React-native scroll animation toolkit. Direct GPU compositor writes. 
            Zero wrapper pollution. <span className="text-white font-medium">Zero React re-renders.</span>
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform flex items-center gap-2">
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
            <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
              Live Playground
            </button>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Reveal delay={0.6}>
          <div className="flex gap-16 mt-20">
            <div>
              <div className="text-3xl font-bold text-white">3.2k+</div>
              <div className="text-sm text-zinc-500 mt-1">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">120 FPS</div>
              <div className="text-sm text-zinc-500 mt-1">Smooth Performance</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-zinc-500 mt-1">Open Source</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <Parallax speed={-0.3} className="absolute right-8 bottom-1/2 translate-y-1/2 flex flex-col items-center gap-4 z-20 hidden md:flex">
        <span className="text-xs font-mono text-zinc-400">01</span>
        <div className="w-[1px] h-32 bg-zinc-800 relative">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-white" />
        </div>
        <div className="w-2 h-2 rounded-full border border-white/50" />
      </Parallax>

    </section>
  );
}
