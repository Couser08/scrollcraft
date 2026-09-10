'use client';

/**
 * Pinned proof chapter — usePin + TimelineSolver (DOM writes, zero React re-renders).
 * Strictly under 650 LOC.
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import { PinContainer, usePin, Reveal } from '@scrollcraft/react';
import { TimelineSolver, type PropertyTimeline } from '@scrollcraft/core';
import { ChevronRight, Layers, Gauge, Cpu } from 'lucide-react';

const TIMELINE: PropertyTimeline = {
  scale: [
    { from: 0, to: 0.45, startValue: 0.94, endValue: 1.02 },
    { from: 0.45, to: 1, startValue: 1.02, endValue: 1 },
  ],
  rotateX: [
    { from: 0, to: 0.4, startValue: 10, endValue: 0 },
    { from: 0.4, to: 1, startValue: 0, endValue: -6 },
  ],
  opacity: [
    { from: 0, to: 0.15, startValue: 0.55, endValue: 1 },
    { from: 0.85, to: 1, startValue: 1, endValue: 0.85 },
  ],
};

const COMPARE = [
  {
    label: 'GSAP ScrollTrigger',
    body: 'Powerful, but imperative plugins + React lifecycle friction and SSR hydration headaches.',
  },
  {
    label: 'Framer scroll chains',
    body: 'useScroll + useTransform boilerplate and motion wrappers for every scrubbed node.',
  },
  {
    label: 'ScrollCraft',
    body: 'Declarative asChild primitives, ticker compositor writes, App Router–safe by default.',
    accent: true,
  },
] as const;

export const PinnedProofSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const progressLabelRef = useRef<HTMLSpanElement | null>(null);

  const pin = usePin<HTMLDivElement>({
    duration: 1100,
    top: 88,
    trackState: false,
    onProgress: (progress) => {
      const values = TimelineSolver.evaluateTimeline(TIMELINE, progress);
      const card = cardRef.current;
      if (card) {
        const scale = values.scale ?? 1;
        const rotateX = values.rotateX ?? 0;
        const opacity = values.opacity ?? 1;
        card.style.transform = `scale(${scale}) rotateX(${rotateX}deg)`;
        card.style.opacity = String(opacity);
      }
      if (progressLabelRef.current) {
        progressLabelRef.current.textContent = `${Math.round(progress * 100)}%`;
      }
    },
  });

  return (
    <section id="engine" className="w-full border-t border-[#E7E5E4] bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Reveal asChild direction="up" distance={16}>
          <div className="max-w-2xl mb-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A1F] mb-2">
              usePin · TimelineSolver
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
              Scrub the story while it sticks.
            </h2>
            <p className="text-sm sm:text-base text-[#78716C] mt-2 leading-relaxed">
              Native sticky pin track with multi-property timeline evaluation — transforms written
              in the ticker path, not React state.
            </p>
          </div>
        </Reveal>
      </div>

      <PinContainer height="220vh" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={pin.ref}
          className="w-full flex flex-col items-center pt-6 pb-12"
          style={{ perspective: '1200px' }}
        >
          <div className="w-full max-w-4xl flex items-center justify-between mb-6 text-xs font-mono text-[#78716C]">
            <span>pin progress</span>
            <span ref={progressLabelRef} className="text-[#FF5A1F] font-semibold tabular-nums">
              0%
            </span>
          </div>

          <div
            ref={cardRef}
            className="w-full max-w-4xl rounded-2xl bg-white border border-[#E7E5E4] shadow-lg p-6 sm:p-10 will-change-transform origin-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'scale(0.94) rotateX(10deg)',
              opacity: 0.55,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] p-4">
                <Cpu className="w-5 h-5 text-[#FF5A1F] mb-3" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Direct compositor</h3>
                <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                  scale / rotateX from TimelineSolver → style.transform
                </p>
              </div>
              <div className="rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] p-4">
                <Layers className="w-5 h-5 text-[#FF5A1F] mb-3" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Zero spacer leak</h3>
                <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                  PinContainer height only — flex/grid stay intact
                </p>
              </div>
              <div className="rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] p-4">
                <Gauge className="w-5 h-5 text-[#FF5A1F] mb-3" />
                <h3 className="text-sm font-bold text-[#0A0A0A]">Scrub progress</h3>
                <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                  onProgress callback · trackState false
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {COMPARE.map((row) => (
                <div
                  key={row.label}
                  className={`rounded-xl border px-4 py-3 ${
                    'accent' in row && row.accent
                      ? 'border-[#FF5A1F]/40 bg-[#FFF4ED]'
                      : 'border-[#E7E5E4] bg-white'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#0A0A0A]">{row.label}</div>
                  <p className="text-xs text-[#78716C] mt-1 leading-relaxed">{row.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5A1F] hover:text-[#E54800]"
              >
                Read architecture
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </PinContainer>
    </section>
  );
};
