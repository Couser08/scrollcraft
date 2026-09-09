'use client';

/**
 * "Four composable primitives." Section
 * Pixel-perfect implementation of Image 2 Section 2.
 * Strictly under 650 LOC.
 * Uses @scrollcraft/react primitives.
 */

import React from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { Layers, Scan, Pin, Activity, ChevronRight } from 'lucide-react';

interface PrimitiveCardData {
  name: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
}

const PRIMITIVES_LIST: PrimitiveCardData[] = [
  {
    name: '<Parallax asChild>',
    description: 'GPU-accelerated transforms directly on your elements.',
    icon: Layers,
    tags: ['Zero re-renders', 'Smooth motion'],
  },
  {
    name: '<Reveal asChild>',
    description: 'Trigger transitions when elements enter the viewport.',
    icon: Scan,
    tags: ['Intersection driven', 'Precise control'],
  },
  {
    name: '<Pin asChild>',
    description: 'Native CSS sticky positioning without extra wrappers.',
    icon: Pin,
    tags: ['Layout stable', 'No spacer divs'],
  },
  {
    name: '<ScrollProgress>',
    description: 'Observable scroll values for interactive UI.',
    icon: Activity,
    tags: ['Real-time state', 'Composable'],
  },
];

export const PrimitivesSectionRedesign: React.FC = () => {
  return (
    <section id="primitives" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E7EB]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Four composable primitives.
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
            Everything you need to build powerful scroll interactions — simple, flexible, and
            engineered for the modern React stack.
          </p>
        </div>

        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-2xs self-start md:self-auto group"
        >
          <span>View all primitives</span>
          <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRIMITIVES_LIST.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.name} asChild direction="up" distance={16} delay={idx * 0.08}>
              <div className="flex flex-col justify-between rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all group">
                <div>
                  {/* Icon in Rounded Square with warm orange tint */}
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#FF5A1F] mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-mono font-bold text-sm sm:text-base text-[#0A0A0A] mb-2 tracking-tight">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
