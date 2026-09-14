'use client';

/**
 * ScrollCraft Section 7: Final CTA
 * - Headline: "Ready when you are."
 * - Subtitle: Single clean Reveal fade-in with docs link, GitHub star CTA, and npm badge.
 * - No gimmicks, zero sales noise.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { ArrowRight, BookOpen, Check, Copy, Star } from 'lucide-react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'npm i @scrollcraft/react';

  const copyCommand = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#050505] py-28 sm:py-36 px-6 border-t border-zinc-800/80 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Single Reveal Fade-in Container */}
        <Reveal direction="up" distance={30} duration={0.8}>
          <div className="space-y-6">
            
            {/* Stability Signal */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>MIT Licensed &bull; Free &amp; Open Source</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Ready when you are.
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
              Start building high-performance, scroll-driven web experiences in minutes. Direct GPU compositor writes, zero wrapper clutter.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              
              {/* Docs Button */}
              <Link
                href="/docs"
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-xl hover:shadow-blue-500/20 w-full sm:w-auto cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* GitHub Star CTA */}
              <a
                href="https://github.com/ScrollCraft/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-sm font-medium transition-all w-full sm:w-auto shadow-lg group"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
                <span>Star on GitHub</span>
              </a>

              {/* Install Copy Box */}
              <button
                type="button"
                onClick={copyCommand}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#0d0d10] hover:bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 transition-all w-full sm:w-auto cursor-pointer"
                title="Copy install command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied npm command!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{installCmd}</span>
                  </>
                )}
              </button>

            </div>

            {/* Footer Invariant Note */}
            <p className="text-[11px] font-mono text-zinc-500 pt-6">
              Compatible with Next.js 14/15, React 18/19, Vite, and React Three Fiber
            </p>

          </div>
        </Reveal>

      </div>
    </section>
  );
}
