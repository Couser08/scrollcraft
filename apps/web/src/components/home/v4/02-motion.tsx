'use client';

import React from 'react';
import Image from 'next/image';
import { Parallax, Reveal } from '@scrollcraft/react';

export function MotionSection() {
  return (
    <section className="relative min-h-screen w-full bg-[#050505] py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <Reveal>
            <div className="flex flex-col gap-2 mb-12">
              <span className="text-xs font-mono text-zinc-500">02</span>
              <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase leading-loose">
                BUILT<br/>FOR<br/>CREATORS
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              Motion <br/> without limits.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              From subtle reveals to immersive experiences. ScrollCraft gives you complete control over scroll-driven animations without React re-renders.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <button className="px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform self-start flex items-center gap-2">
              Explore Components
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </Reveal>
        </div>

        {/* Right Visual */}
        <div className="w-full lg:w-2/3 relative h-[70vh] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group">
          
          <Parallax speed={0.15} className="absolute inset-[-10%] w-[120%] h-[120%]">
            <Image
              src="/images/parallax_fabric.webp"
              alt="Parallax fabric texture"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </Parallax>

          {/* Labels Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none p-12 flex flex-col justify-between">
            <Parallax speed={-0.1} className="self-end">
              <Reveal direction="right" delay={0.4}>
                <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                  <span>PARALLAX</span>
                  <div className="w-8 h-[1px] bg-white/50" />
                  <div className="w-2 h-2 rounded-full border border-white" />
                </div>
              </Reveal>
            </Parallax>

            <Parallax speed={0.15} className="self-start mt-32">
              <Reveal direction="left" delay={0.5}>
                <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                  <div className="w-2 h-2 rounded-full border border-white" />
                  <div className="w-8 h-[1px] bg-white/50" />
                  <span>SCROLL TRIGGER</span>
                </div>
              </Reveal>
            </Parallax>
            
            <Parallax speed={-0.2} className="self-end mb-16">
              <Reveal direction="right" delay={0.6}>
                <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                  <span>PINNED SECTIONS</span>
                  <div className="w-8 h-[1px] bg-white/50" />
                  <div className="w-2 h-2 rounded-full border border-white" />
                </div>
              </Reveal>
            </Parallax>

            <Parallax speed={0.05} className="self-end">
              <Reveal direction="right" delay={0.7}>
                <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                  <span>SMOOTH TRANSITIONS</span>
                  <div className="w-8 h-[1px] bg-white/50" />
                  <div className="w-2 h-2 rounded-full border border-white" />
                </div>
              </Reveal>
            </Parallax>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
