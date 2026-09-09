'use client';

/**
 * "Loved By Creators" / Testimonials Section
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS_DATA } from '@/data/home-redesign.data';

export const Testimonials: React.FC = () => {
  return (
    <section id="community" className="w-full py-20 sm:py-28 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-zinc-200/80 bg-zinc-50 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-4">
            {TESTIMONIALS_DATA.badge}
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mb-4">
            <span>{TESTIMONIALS_DATA.headlinePart1}</span>
            <span className="text-blue-600">{TESTIMONIALS_DATA.headlineHighlight}</span>
          </h2>

          {/* Subhead */}
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
            {TESTIMONIALS_DATA.subtitle}
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Quote Text */}
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-6 font-normal">
                "{item.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
