'use client';

/**
 * Dark Contrast CTA Banner Section matching mockup
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CtaBannerDoodle } from '@/components/ui/doodle-arrow';
import { CTA_BANNER_DATA } from '@/data/home-redesign.data';

export const CtaBanner: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl py-20 px-6 sm:px-12 text-center select-none">
          {/* Background Night Mountain Imagery */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/cta-mountains.jpg"
              alt="Moody night mountains"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-45 mix-blend-luminosity"
            />
            {/* Deep dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60" />
          </div>

          {/* Top Right Handwritten Annotation */}
          <div className="absolute top-8 sm:top-12 right-6 sm:right-16 hidden md:block">
            <CtaBannerDoodle />
          </div>

          {/* Centered Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-zinc-700/80 bg-zinc-900/90 backdrop-blur-md text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-6">
              {CTA_BANNER_DATA.badge}
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
              <span>{CTA_BANNER_DATA.headlinePart1}</span>
              <br />
              <span>{CTA_BANNER_DATA.headlinePart2}</span>
            </h2>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-zinc-300 mb-10 max-w-lg leading-relaxed">
              {CTA_BANNER_DATA.subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* White Button: Get Started */}
              <a
                href="#examples"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-zinc-950 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Bordered Button: Try Playground */}
              <Link
                href="/playground"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-sm tracking-tight transition-all duration-200 active:scale-95 shadow-2xs backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                <span>Try Playground</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
