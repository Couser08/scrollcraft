'use client';

/**
 * Bottom Floating Banner for Examples Page
 * Strictly under 650 LOC.
 */

import React from 'react';
import Link from 'next/link';
import { Box, ArrowRight } from 'lucide-react';
import { TryItYourselfDoodle } from '@/components/ui/examples-doodles';

export const ExamplesBottomCta: React.FC = () => {
  return (
    <div className="relative w-full mt-16 p-6 sm:p-8 rounded-3xl bg-zinc-50/80 border border-zinc-200/90 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
      {/* Left Info with Icon */}
      <div className="flex items-center gap-4 text-left">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shadow-2xs">
          <Box className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
            Want to experiment freely?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Open the playground and start building your own scroll animations in seconds.
          </p>
        </div>
      </div>

      {/* Right Action & Doodle */}
      <div className="flex items-center gap-6 self-stretch md:self-auto justify-end">
        {/* Button */}
        <Link
          href="/playground"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm tracking-tight shadow-sm hover:shadow-md transition-all active:scale-95 group shrink-0"
        >
          <span>Open Playground</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Handwritten Doodle */}
        <div className="hidden xl:block">
          <TryItYourselfDoodle />
        </div>
      </div>
    </div>
  );
};
