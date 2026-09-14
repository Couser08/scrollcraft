'use client';

/**
 * ScrollCraft Section 1: Hero
 * Pixel-perfect redesign matching Image specification:
 * - Left column:
 *   - Overline: CORE PRIMITIVES • BETA
 *   - Dual-tone Headline: "You build the markup. / We handle the physics."
 *   - Description: Declarative, slot-based components that mutate hardware transform styles directly on the GPU thread.
 *   - 4 Interactive Pills: </> Parallax, Reveal, Pin, ScrollProgress
 *   - 4 Feature Cards: React Re-Renders, Lenis Physics, RSC Safe, Tree-shakeable
 *   - Scroll Indicator: SCROLL TO EXPLORE
 * - Right column:
 *   - Tag: FOR MODERN / WEB CREATORS
 *   - High-fidelity 3D Mountain & Code Block visual (/images/hero-mountain-code.webp)
 *   - Tag: SMOOTH / SCROLL. / REAL IMPACT.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Zap, Box, Leaf, Eye, Lock, Disc3 } from 'lucide-react';

interface PrimitivePill {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function HeroSection() {
  const [activePrimitive, setActivePrimitive] = useState<string>('parallax');

  const primitives: PrimitivePill[] = [
    {
      id: 'parallax',
      name: 'Parallax',
      icon: (
        <span className="font-mono font-semibold text-xs tracking-tight">&lt;/&gt;</span>
      ),
    },
    {
      id: 'reveal',
      name: 'Reveal',
      icon: <Eye className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'pin',
      name: 'Pin',
      icon: <Lock className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'progress',
      name: 'ScrollProgress',
      icon: <Disc3 className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Architectural Background Grid Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] z-0"
      />

      {/* Subtle Ambient Glow Behind 3D Mountain & Code Visual */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none -z-0"
      />

      {/* Top Section Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 pb-8">
          
          {/* Left Column (Hero Copy & Controls) - 7 cols on lg */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Overline Badge */}
            <div className="flex items-center gap-2.5 mb-6 text-xs font-mono tracking-[0.25em] text-zinc-500 uppercase select-none">
              <span>CORE PRIMITIVES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span>BETA</span>
            </div>

            {/* Main Dual-Tone Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.4rem] font-bold tracking-tight leading-[1.08] mb-6">
              <span className="text-white block font-extrabold">You build the markup.</span>
              <span className="text-zinc-500 block font-bold mt-1">We handle the physics.</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed mb-8">
              Declarative, slot-based components that mutate hardware transform styles directly on the GPU thread.
            </p>

            {/* Interactive Primitive Selection Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              {primitives.map((prim) => {
                const isActive = activePrimitive === prim.id;
                return (
                  <button
                    key={prim.id}
                    onClick={() => setActivePrimitive(prim.id)}
                    type="button"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#1d6ff2] text-white shadow-[0_0_24px_rgba(29,111,242,0.45)] border border-blue-400/50 scale-[1.02]'
                        : 'bg-[#0d0f14]/90 text-zinc-300 border border-white/[0.08] hover:border-white/20 hover:bg-[#151922] hover:text-white'
                    }`}
                  >
                    {prim.icon}
                    <span>{prim.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 4 Feature Spec Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/[0.06]">
              
              {/* 1. React Re-Renders */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Zap className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    React Re-Renders
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Optimized
                  </div>
                </div>
              </div>

              {/* 2. Lenis Physics */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <svg
                    className="w-4 h-4 text-zinc-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Lenis Physics
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Buttery smooth
                  </div>
                </div>
              </div>

              {/* 3. RSC Safe */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Box className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    RSC Safe
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Works everywhere
                  </div>
                </div>
              </div>

              {/* 4. Tree-shakeable */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Leaf className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Tree-shakeable
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    &lt; 4.2 KB core
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (Visual + Corner Tags) - 5 cols on lg */}
          <div className="lg:col-span-5 flex flex-col justify-between relative">
            
            {/* Top Right Tag */}
            <div className="flex flex-col items-start lg:items-end mb-4 lg:mb-6 select-none">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase text-left lg:text-right leading-relaxed">
                FOR MODERN<br />
                WEB CREATORS
              </div>
              <div className="w-8 h-[1px] bg-zinc-800 mt-2 self-start lg:self-end" />
            </div>

            {/* 3D Mountain & Code Block Graphic Preview */}
            <div className="relative w-full flex items-center justify-center my-auto">
              <div className="relative w-full max-w-[580px] xl:max-w-[640px] transform transition-transform duration-500 hover:scale-[1.02] cursor-default">
                <Image
                  src="/images/hero-mountain-code.webp"
                  alt="ScrollCraft 3D Mountain and Code Window"
                  width={960}
                  height={640}
                  priority
                  quality={95}
                  className="w-full h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Bottom Right Tag */}
            <div className="flex justify-end mt-4 lg:mt-6 select-none">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase text-right leading-relaxed">
                SMOOTH<br />
                SCROLL.<br />
                REAL IMPACT.
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Scroll To Explore Indicator */}
        <div className="pt-8 flex items-center gap-3 border-t border-white/[0.04]">
          <div className="w-5 h-9 rounded-full border border-zinc-700/80 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
          </div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 font-medium uppercase select-none">
            SCROLL TO EXPLORE
          </span>
        </div>

      </div>

    </section>
  );
}
