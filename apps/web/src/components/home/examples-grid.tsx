'use client';

/**
 * "See It In Action" / Stunning Examples Section
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXAMPLES_DATA } from '@/data/home-redesign.data';

export const ExamplesGrid: React.FC = () => {
  return (
    <section id="examples" className="w-full py-20 sm:py-28 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title & Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            {/* Section Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-zinc-200/80 bg-zinc-50 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-4">
              {EXAMPLES_DATA.badge}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mb-3">
              <span>{EXAMPLES_DATA.headlinePart1}</span>
              <span className="text-blue-600">{EXAMPLES_DATA.headlineHighlight}</span>
            </h2>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-zinc-500 max-w-xl">
              {EXAMPLES_DATA.subtitle}
            </p>
          </div>

          {/* Right: View All Examples Button */}
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-semibold tracking-tight shadow-2xs transition-all duration-200 self-start md:self-auto group"
          >
            <span>View All Examples</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>

        {/* 4 Example Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXAMPLES_DATA.items.map((item) => (
            <div
              key={item.number}
              className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-zinc-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Number Badge Pill on Image (01, 02, etc.) */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-zinc-700 shadow-2xs">
                  {item.number}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Circular Arrow Button */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
