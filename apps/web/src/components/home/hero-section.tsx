'use client';

/**
 * Pixel-Perfect Hero Section matching reference mockup
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, Code, ChevronDown } from 'lucide-react';
import { CodeWindow } from '@/components/ui/code-window';
import { HeroDoodleArrow } from '@/components/ui/doodle-arrow';
import { BrandLogos } from '@/components/ui/brand-logos';
import { HERO_DATA } from '@/data/home-redesign.data';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full pt-10 sm:pt-16 pb-12 overflow-hidden bg-white">
      {/* Background Subtle Radial Glow & Fine Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main 2-Column Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200/90 bg-zinc-50/80 shadow-2xs mb-8 transition-all hover:border-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-medium text-zinc-700 tracking-tight">
                {HERO_DATA.badge}
              </span>
            </div>

            {/* Giant Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] mb-6">
              <span>{HERO_DATA.headingPart1}</span>
              <br />
              <span>{HERO_DATA.headingPart2} </span>
              <span className="text-blue-600 inline-block font-extrabold">
                {HERO_DATA.headingHighlight}
              </span>
            </h1>

            {/* Subhead Paragraph */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-lg leading-relaxed mb-8">
              {HERO_DATA.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {/* Primary Black Button */}
              <a
                href="#examples"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Secondary Outlined Button */}
              <a
                href="https://github.com/Couser08/scrollcraft"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-800 font-semibold text-sm tracking-tight transition-all duration-200 active:scale-95 shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current text-zinc-800" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>View on GitHub</span>
              </a>
            </div>

            {/* Feature Bullets Below Buttons */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                <span>Lightweight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-zinc-400" />
                <span>High Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-zinc-400" />
                <span>Framework Agnostic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mountain Visual + Code Window + Doodles */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-8 pb-12">
            {/* Handwritten callout at top right */}
            <div className="absolute -top-4 sm:-top-6 right-6 sm:right-12 z-20">
              <HeroDoodleArrow />
            </div>

            {/* Vertical Mountain Backdrop Card */}
            <div className="relative w-[300px] sm:w-[380px] lg:w-[410px] h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 bg-zinc-100 group">
              <Image
                src="/images/hero-mountain.jpg"
                alt="Snowy mountain peaks"
                fill
                priority
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 410px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle top & bottom image gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Side Edge Text: SCROLL TO EXPLORE */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase select-none pointer-events-none">
                Scroll to explore ————
              </div>
            </div>

            {/* Floating Overlapping Code Window */}
            <div className="absolute -left-4 sm:-left-8 lg:-left-12 top-16 sm:top-20 z-20 transform hover:-translate-y-1 transition-transform duration-300">
              <CodeWindow />
            </div>

            {/* Floating Bottom Pill: Scroll Down */}
            <div className="absolute -bottom-5 right-12 sm:right-20 z-20">
              <a
                href="#why-scrollcraft"
                className="flex flex-col items-center justify-center gap-1 py-3 px-3.5 rounded-full bg-white text-zinc-800 border border-zinc-200/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
              >
                <ChevronDown className="w-4 h-4 text-zinc-700 animate-bounce" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                  Scroll Down
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Section: TRUSTED BY CREATORS */}
        <div className="mt-20 pt-12 border-t border-zinc-200/60 flex flex-col items-center gap-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Trusted by Creators
          </span>
          <BrandLogos />
        </div>
      </div>
    </section>
  );
};
