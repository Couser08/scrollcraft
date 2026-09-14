'use client';

/**
 * ScrollCraft Section 1: Hero
 * - Headline: "The scroll engine React never had."
 * - Subtitle: "Composable primitives and hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, and fully tree-shakeable."
 * - Primary CTA: npm install copy button with copied toast
 * - Secondary CTA: "Read the docs" linking to /docs
 * - Background: Velocity-reactive gradient/orb reacting dynamically to scroll velocity
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useScrollCraft, Reveal } from '@scrollcraft/react';
import { Check, Copy, ArrowRight, Terminal, BookOpen } from 'lucide-react';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const orbSecondaryRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useScrollCraft();

  const installCommand = 'npm i @scrollcraft/react';

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Velocity-reactive background gradient orb
  useEffect(() => {
    const unsub = subscribe((metrics) => {
      const vel = Math.min(Math.abs(metrics.velocity || 0), 20);
      
      if (orbRef.current) {
        const scale = 1 + vel * 0.035;
        const opacity = 0.35 + Math.min(vel * 0.03, 0.3);
        orbRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
        orbRef.current.style.opacity = `${opacity}`;
      }

      if (orbSecondaryRef.current) {
        const scale = 1 + vel * 0.05;
        const opacity = 0.25 + Math.min(vel * 0.04, 0.35);
        orbSecondaryRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale}) rotate(${vel * 2}deg)`;
        orbSecondaryRef.current.style.opacity = `${opacity}`;
      }
    });

    return () => unsub();
  }, [subscribe]);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full bg-[#050505] flex flex-col justify-center items-center overflow-hidden px-6 pt-24 pb-16">
      
      {/* Velocity-Reactive Ambient Gradient Orbs */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-sky-400/10 blur-[120px] pointer-events-none transition-transform duration-100 ease-out will-change-transform z-0"
        style={{ opacity: 0.35 }}
      />
      <div
        ref={orbSecondaryRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-br from-amber-500/15 via-blue-500/15 to-purple-600/15 blur-[90px] pointer-events-none transition-transform duration-150 ease-out will-change-transform z-0"
        style={{ opacity: 0.25 }}
      />

      {/* Grid Texture Background Overlay */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"
      />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Version & Stability Badge */}
        <Reveal direction="down" distance={20} duration={0.6}>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 mb-8 shadow-inner backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-white">v0.1.0-beta</span>
            <span className="text-zinc-500">&bull;</span>
            <span className="text-amber-400 font-medium">Beta</span>
            <span className="hidden sm:inline text-zinc-500">&mdash; API surface shiftable, physics locked</span>
          </div>
        </Reveal>

        {/* Primary Headline */}
        <Reveal direction="up" distance={30} duration={0.7} delay={0.1}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            The scroll engine <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              React never had.
            </span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal direction="up" distance={24} duration={0.7} delay={0.2}>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-sans mb-10">
            Composable primitives and hooks for parallax, reveals, pins, and scroll-progress &mdash; 
            powered by Lenis, safe in RSC, and fully tree-shakeable.
          </p>
        </Reveal>

        {/* Action CTAs: Install copy button & Read Docs button */}
        <Reveal direction="up" distance={20} duration={0.7} delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Package Install Copy Button */}
            <div className="flex items-center justify-between rounded-full bg-[#0d0d10] border border-zinc-800 hover:border-zinc-700 transition-colors p-1.5 pl-4 sm:pr-2 gap-3 w-full sm:w-auto shadow-xl">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="select-all">{installCommand}</span>
              </div>
              <button
                onClick={copyCommand}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono transition-all cursor-pointer shrink-0"
                title="Copy install command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Read Docs Link */}
            <Link
              href="/docs"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read the docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Real-world Feature Highlights */}
        <Reveal direction="up" distance={16} duration={0.7} delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-14 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>0 React Re-Renders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Lenis Subpixel Physics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Next.js 15 RSC Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>&lt; 4.2 KB Core</span>
            </div>
          </div>
        </Reveal>

      </div>

    </section>
  );
}
