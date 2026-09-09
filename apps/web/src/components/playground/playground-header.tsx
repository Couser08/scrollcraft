'use client';

/**
 * Playground Header with Display Typography & Handwritten Doodle
 * Strictly under 650 LOC.
 */

import React from 'react';
import { PlaygroundDoodle } from '@/components/ui/examples-doodles';

export const PlaygroundHeader: React.FC = () => {
  return (
    <div className="relative w-full mb-8 select-none">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          {/* Eyebrow */}
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">
            Playground
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight mb-3">
            Build. Experiment. Create.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
            Try ScrollCraft in your browser. Tweak the code, see the results in real-time,
            and create stunning scroll animations instantly.
          </p>
        </div>

        {/* Top Right Handwritten Doodle */}
        <div className="hidden lg:block shrink-0 pt-2 pr-8">
          <PlaygroundDoodle />
        </div>
      </div>
    </div>
  );
};
