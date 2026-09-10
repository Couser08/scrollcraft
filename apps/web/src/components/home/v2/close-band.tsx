'use client';

/**
 * Full-width close band — connected product CTA.
 */

import React from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { ChevronRight } from 'lucide-react';

export function CloseBand() {
  return (
    <section className="w-full border-t border-[#E7E5E4]">
      <Reveal asChild direction="up" distance={12}>
        <div className="bg-[#FFF4ED] border-b border-[#FFEDD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A]">
                Build the scroll you meant to ship.
              </h2>
              <p className="mt-2 text-base text-[#78716C] leading-relaxed">
                Same engine as this page — docs for primitives, playground for physics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center h-11 px-5 rounded-[10px] bg-[#0A0A0A] hover:bg-[#1C1917] text-white text-sm font-semibold transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-[10px] bg-white hover:bg-[#FAFAF9] border border-[#E7E5E4] text-[#0A0A0A] text-sm font-semibold transition-colors"
              >
                Playground
                <ChevronRight className="w-4 h-4 text-[#78716C]" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
