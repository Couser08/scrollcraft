'use client';

/**
 * Closing CTA — same button language as hero.
 */

import React from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { ChevronRight } from 'lucide-react';
import { SectionShell, btnPrimary, btnSecondary } from './section-shell';

export function ClosingCtaV2() {
  return (
    <SectionShell id="start" index="04" label="Next" className="pb-28">
      <Reveal asChild direction="up" distance={16}>
        <div className="rounded-[14px] border border-[#E7E5E4] bg-white px-6 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A]">
              Build the scroll you meant to ship.
            </h2>
            <p className="mt-3 text-base text-[#78716C] leading-relaxed">
              Read the primitives, or tune physics live in the playground — same engine.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/docs" className={btnPrimary}>
              Documentation
            </Link>
            <Link href="/playground" className={btnSecondary}>
              Playground
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </Link>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
