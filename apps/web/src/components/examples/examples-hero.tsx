'use client';

/**
 * Examples Page Hero Banner matching reference mockup
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { MakeItYoursDoodle } from '@/components/ui/examples-doodles';

export const ExamplesHero: React.FC = () => {
  return (
    <div className="relative w-full mb-10 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline & Description */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/70 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Examples</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight mb-4">
            Real Examples.
            <br />
            Endless Possibilities.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
            Explore interactive examples to see what you can build with ScrollCraft.
            Use the code, remix it, or try it live in the playground.
          </p>
        </div>

        {/* Right Showcase Card with Mountain & Phone Preview */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Top Right Handwritten Doodle */}
          <div className="absolute -top-6 right-0 sm:right-4 z-20">
            <MakeItYoursDoodle />
          </div>

          {/* Container with Dual Card Visual */}
          <div className="relative flex items-center gap-4 bg-zinc-50/70 p-4 rounded-3xl border border-zinc-200/80 shadow-xs">
            {/* Minimalist Quote */}
            <div className="hidden sm:flex flex-col text-left text-xs font-medium text-zinc-600 leading-snug pr-2 border-r border-zinc-200/80">
              <span className="font-semibold text-zinc-900">Scroll</span>
              <span>Explore</span>
              <span>Get Inspired.</span>
              <span className="text-blue-600 font-bold">Build.</span>
            </div>

            {/* Mountain Card */}
            <div className="relative w-40 sm:w-48 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-md border border-zinc-200">
              <Image
                src="/images/examples-hero-mountain.jpg"
                alt="Mountain scroll card"
                fill
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-3">
                <span className="text-white text-[11px] font-bold tracking-tight">
                  Motion in every scroll.
                </span>
              </div>
            </div>

            {/* Vertical Phone Card */}
            <div className="relative w-20 sm:w-24 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-md border border-zinc-200 bg-zinc-900">
              <Image
                src="/images/examples-hero-phone.jpg"
                alt="Phone mockup preview"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                <span className="text-white text-[9px] font-medium leading-tight">
                  Ideas in motion.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
