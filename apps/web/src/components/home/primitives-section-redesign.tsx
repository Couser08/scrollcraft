'use client';

/**
 * Live primitive stages — Parallax, Reveal, Pin, ScrollProgress.
 * Strictly under 650 LOC.
 */

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Reveal, Parallax, useScrollProgress } from '@scrollcraft/react';
import { ChevronRight } from 'lucide-react';

function LiveParallaxStage() {
  return (
    <div className="relative h-28 rounded-xl overflow-hidden bg-[#1C1917] border border-[#E7E5E4]">
      <Parallax asChild speed={-0.1} min={-20} max={20}>
        <div className="absolute inset-x-0 top-2 h-10 mx-3 rounded-lg bg-[#44403C]/80 will-change-transform" />
      </Parallax>
      <Parallax asChild speed={0.08} min={-16} max={16}>
        <div className="absolute inset-x-4 top-10 h-10 rounded-lg bg-[#78716C]/70 will-change-transform" />
      </Parallax>
      <Parallax asChild speed={0.2} min={-28} max={28}>
        <div className="absolute inset-x-6 bottom-3 h-12 rounded-lg bg-[#FF5A1F] flex items-center justify-center will-change-transform">
          <span className="text-[11px] font-bold text-white font-mono">speed layers</span>
        </div>
      </Parallax>
    </div>
  );
}

function LiveRevealStage() {
  return (
    <div className="h-28 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] p-3 flex flex-col justify-center gap-2 overflow-hidden">
      <Reveal asChild direction="up" distance={14} delay={0} once={false} threshold={0.2}>
        <div className="h-2.5 w-16 rounded bg-[#D6D3D1]" />
      </Reveal>
      <Reveal asChild direction="up" distance={14} delay={0.08} once={false} threshold={0.2}>
        <div className="h-2.5 w-28 rounded bg-[#A8A29E]" />
      </Reveal>
      <Reveal asChild direction="up" distance={14} delay={0.16} once={false} threshold={0.2}>
        <div className="h-2.5 w-20 rounded bg-[#FF5A1F]/80" />
      </Reveal>
    </div>
  );
}

function LivePinStage() {
  // Nested overflow cannot drive page-level PinSolver — CSS sticky mirrors Pin's contract.
  // Full usePin + timeline lives in PinnedProofSection below.
  return (
    <div className="h-28 rounded-xl overflow-hidden border border-[#E7E5E4] bg-white">
      <div className="h-full overflow-y-auto overscroll-contain px-2 py-1 text-[10px] text-[#78716C]">
        <div className="relative min-h-[220px]">
          <div className="sticky top-1 z-10 rounded-md bg-[#FF5A1F] text-white font-mono font-semibold px-2 py-1.5 shadow-sm">
            sticky pin
          </div>
          <p className="mt-3 leading-relaxed">
            Scroll this cell. The pill sticks — same native sticky contract as{' '}
            <span className="font-mono text-[#0A0A0A]">&lt;Pin&gt;</span>.
          </p>
          <p className="mt-2 leading-relaxed pb-4">
            Full scrubbed pin + timeline is in the chapter below.
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveProgressStage() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const { progressValue } = useScrollProgress();

  useEffect(() => {
    const unsub = progressValue.subscribe((p) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (labelRef.current) labelRef.current.textContent = `${Math.round(p * 100)}%`;
    });
    return unsub;
  }, [progressValue]);

  return (
    <div className="h-28 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] p-4 flex flex-col justify-center gap-3">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#78716C]">page progress</span>
        <span ref={labelRef} className="text-[#FF5A1F] font-semibold tabular-nums">
          0%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E7E5E4] overflow-hidden">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-[#FF5A1F] will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      <p className="text-[10px] text-[#A8A29E]">ScrollValue → scaleX · no re-renders</p>
    </div>
  );
}

const STAGES = [
  {
    name: '<Parallax asChild>',
    description: 'Nested GPU layers with speed, min/max clamps.',
    href: '/docs',
    Stage: LiveParallaxStage,
  },
  {
    name: '<Reveal asChild>',
    description: 'Viewport enter with stagger delay — re-triggerable here.',
    href: '/docs',
    Stage: LiveRevealStage,
  },
  {
    name: '<Pin> + <PinContainer>',
    description: 'Native sticky contract — full scrub demo in the chapter below.',
    href: '/docs',
    Stage: LivePinStage,
  },
  {
    name: '<ScrollProgress> path',
    description: 'Observable progress driving scaleX directly.',
    href: '/docs',
    Stage: LiveProgressStage,
  },
] as const;

export const PrimitivesSectionRedesign: React.FC = () => {
  return (
    <section
      id="primitives"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E7E5E4]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <Reveal asChild direction="up" distance={16}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
              Four composable primitives.
            </h2>
          </Reveal>
          <Reveal asChild direction="up" distance={12} delay={0.06}>
            <p className="text-sm sm:text-base text-[#78716C] mt-2 leading-relaxed">
              Live stages — not icon cards. Scroll the page and interact with each cell.
            </p>
          </Reveal>
        </div>

        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F5F5F4] border border-[#E7E5E4] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-sm self-start md:self-auto group"
        >
          <span>View all primitives</span>
          <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAGES.map(({ name, description, Stage }, idx) => (
          <Reveal key={name} asChild direction="up" distance={16} delay={idx * 0.06}>
            <article className="flex flex-col rounded-2xl bg-white border border-[#E7E5E4] p-4 shadow-sm hover:border-[#D6D3D1] transition-colors">
              <Stage />
              <h3 className="font-mono font-bold text-sm text-[#0A0A0A] mt-4 tracking-tight">
                {name}
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mt-1.5 flex-1">{description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
