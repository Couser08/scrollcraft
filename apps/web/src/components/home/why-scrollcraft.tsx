'use client';

/**
 * "Why ScrollCraft" Feature Grid Section
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Feather, Zap, Box, Sliders } from 'lucide-react';
import { WHY_SCROLLCRAFT_DATA } from '@/data/home-redesign.data';

export const WhyScrollCraft: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf':
        return <Feather className="w-5 h-5 text-blue-600" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'box':
        return <Box className="w-5 h-5 text-blue-600" />;
      case 'sliders':
        return <Sliders className="w-5 h-5 text-blue-600" />;
      default:
        return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="why-scrollcraft" className="w-full py-20 sm:py-28 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          {/* Section Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-zinc-200/80 bg-zinc-50 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-4">
            {WHY_SCROLLCRAFT_DATA.badge}
          </div>

          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mb-4">
            {WHY_SCROLLCRAFT_DATA.headline}
          </h2>

          {/* Subhead */}
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
            {WHY_SCROLLCRAFT_DATA.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_SCROLLCRAFT_DATA.features.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-col items-start p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 select-none"
            >
              {/* Feature Icon */}
              <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                {getIcon(feature.icon)}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2 tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
