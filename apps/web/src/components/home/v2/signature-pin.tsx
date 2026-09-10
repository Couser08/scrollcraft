'use client';

/**
 * Signature chapter — sole deep engine moment (Pin + TimelineSolver).
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import { PinContainer, usePin, Reveal } from '@scrollcraft/react';
import { TimelineSolver, type PropertyTimeline } from '@scrollcraft/core';
import { ChevronRight } from 'lucide-react';

const TIMELINE: PropertyTimeline = {
  scale: [
    { from: 0, to: 0.5, startValue: 0.96, endValue: 1 },
    { from: 0.5, to: 1, startValue: 1, endValue: 0.98 },
  ],
  y: [
    { from: 0, to: 0.35, startValue: 28, endValue: 0 },
    { from: 0.35, to: 1, startValue: 0, endValue: -12 },
  ],
  opacity: [
    { from: 0, to: 0.12, startValue: 0.4, endValue: 1 },
    { from: 0.88, to: 1, startValue: 1, endValue: 0.75 },
  ],
};

const LINES = [
  { title: 'GSAP ScrollTrigger', body: 'Imperative plugins, React lifecycle friction, SSR headaches.' },
  { title: 'Framer scroll chains', body: 'useScroll + useTransform wrappers for every scrubbed node.' },
  { title: 'ScrollCraft', body: 'asChild primitives · ticker compositor writes · App Router–native.', accent: true },
] as const;

export function SignaturePinV2() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  const pin = usePin<HTMLDivElement>({
    duration: 900,
    top: 96,
    trackState: false,
    onProgress: (progress) => {
      const values = TimelineSolver.evaluateTimeline(TIMELINE, progress);
      const stage = stageRef.current;
      if (stage) {
        const scale = values.scale ?? 1;
        const y = values.y ?? 0;
        const opacity = values.opacity ?? 1;
        stage.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        stage.style.opacity = String(opacity);
      }
      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(progress * 100)}%`;
      }
    },
  });

  return (
    <section id="signature" className="w-full border-t border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <Reveal asChild direction="up" distance={16}>
          <header className="max-w-2xl mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#FF5A1F] mb-3">
              02 · Signature
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A] leading-[1.15]">
              Stick the chapter. Scrub the story.
            </h2>
            <p className="mt-3 text-base text-[#78716C] leading-relaxed max-w-xl">
              One pinned stage. Timeline values write straight to the DOM — no React re-renders
              while you scroll.
            </p>
          </header>
        </Reveal>
      </div>

      <PinContainer height="170vh" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={pin.ref} className="w-full pt-4 pb-16">
          <div className="flex items-center justify-between mb-5 text-[11px] font-mono text-[#A8A29E]">
            <span>usePin · TimelineSolver</span>
            <span ref={progressRef} className="text-[#FF5A1F] tabular-nums font-semibold">
              0%
            </span>
          </div>

          <div
            ref={stageRef}
            className="w-full max-w-3xl mx-auto rounded-[14px] border border-[#E7E5E4] bg-white p-6 sm:p-9 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.2)] will-change-transform"
            style={{ transform: 'translate3d(0, 28px, 0) scale(0.96)', opacity: 0.4 }}
          >
            <p className="text-sm font-semibold text-[#0A0A0A]">How teams get stuck</p>
            <div className="mt-5 space-y-3">
              {LINES.map((line) => (
                <div
                  key={line.title}
                  className={`rounded-[10px] border px-4 py-3.5 ${
                    'accent' in line && line.accent
                      ? 'border-[#FF5A1F]/35 bg-[#FFF4ED]'
                      : 'border-[#E7E5E4] bg-[#FAFAF9]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#0A0A0A]">{line.title}</div>
                  <p className="text-sm text-[#78716C] mt-1 leading-relaxed">{line.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-5 border-t border-[#E7E5E4] flex justify-end">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A1F] hover:text-[#E54800]"
              >
                Architecture docs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </PinContainer>
    </section>
  );
}
