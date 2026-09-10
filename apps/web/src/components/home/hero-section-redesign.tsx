'use client';

/**
 * Home Hero — layered Parallax instrument + zero-rerender telemetry + magnetic CTA.
 * Strictly under 650 LOC.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, Reveal, useScrollCraft, useMagnetic } from '@scrollcraft/react';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';

const HERO_CODE_SNIPPET = `import { Parallax } from '@scrollcraft/react';

export function KineticCard() {
  return (
    <Parallax asChild speed={0.15}>
      <div className="card">
        <h3>120 FPS Subpixel Motion</h3>
      </div>
    </Parallax>
  );
}`;

const TelemetryMetricsPanel = memo(() => {
  const { subscribe, getMetrics } = useScrollCraft();
  const offsetRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const velocityRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    try {
      const initial = getMetrics();
      if (offsetRef.current) offsetRef.current.textContent = `${Math.round(initial.scroll)} px`;
      if (progressRef.current) progressRef.current.textContent = `${Math.round(initial.progress * 100)}%`;
      if (velocityRef.current) velocityRef.current.textContent = initial.velocity.toFixed(2);
    } catch {
      /* provider not ready */
    }

    return subscribe((m) => {
      if (offsetRef.current) offsetRef.current.textContent = `${Math.round(m.scroll)} px`;
      if (progressRef.current) progressRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      if (velocityRef.current) velocityRef.current.textContent = m.velocity.toFixed(2);
    });
  }, [subscribe, getMetrics]);

  return (
    <div className="flex flex-col justify-center space-y-3 py-2 text-xs font-mono">
      <div className="flex items-center justify-between gap-4 border-b border-[#E7E5E4] pb-2">
        <span className="text-[#78716C]">Velocity</span>
        <span
          ref={velocityRef}
          className="font-semibold text-[#0A0A0A] inline-block w-14 text-right tabular-nums"
        >
          0.00
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-[#E7E5E4] pb-2">
        <span className="text-[#78716C]">Offset</span>
        <span
          ref={offsetRef}
          className="font-semibold text-[#0A0A0A] inline-block w-14 text-right tabular-nums"
        >
          0 px
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[#78716C]">Progress</span>
        <span
          ref={progressRef}
          className="font-semibold text-[#FF5A1F] inline-block w-14 text-right tabular-nums"
        >
          0%
        </span>
      </div>
    </div>
  );
});

TelemetryMetricsPanel.displayName = 'TelemetryMetricsPanel';

function MagneticPlaygroundLink() {
  const { ref } = useMagnetic({ strength: 0.28, radius: 90, stiffness: 0.18, damping: 0.72 });

  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href="/playground"
      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-white hover:bg-[#F5F5F4] border border-[#E7E5E4] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-sm group will-change-transform"
    >
      <span>Open Playground</span>
      <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

export const HeroSectionRedesign: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm add @scrollcraft/react');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(HERO_CODE_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="relative w-full pt-10 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Atmosphere layers — multi-speed Parallax (compositor depth) */}
      <Parallax asChild speed={-0.08} min={-40} max={40}>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-[#FF5A1F]/[0.07] blur-3xl will-change-transform"
        />
      </Parallax>
      <Parallax asChild speed={0.12} min={-30} max={30}>
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-24 w-[320px] h-[320px] rounded-full bg-[#E7E5E4]/80 blur-3xl will-change-transform"
        />
      </Parallax>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col items-start gap-5">
          <Reveal asChild direction="up" distance={18} duration={0.55}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFEDD5] text-xs font-semibold text-[#0A0A0A] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
              <span>React 19 · Next.js App Router</span>
            </div>
          </Reveal>

          <Reveal asChild direction="up" distance={22} duration={0.6} delay={0.05}>
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.03]">
              ScrollCraft
              <span className="block text-[#FF5A1F]">for modern web.</span>
            </h1>
          </Reveal>

          <Reveal asChild direction="up" distance={16} duration={0.55} delay={0.1}>
            <p className="text-base sm:text-lg text-[#78716C] max-w-xl leading-relaxed">
              GSAP-grade scroll without the React pain. Declarative primitives, direct GPU writes,
              and SSR-safe Next.js — less boilerplate than Framer scroll chains.
            </p>
          </Reveal>

          <Reveal asChild direction="up" distance={14} duration={0.5} delay={0.14}>
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={copyInstallCommand}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1C1917] text-white text-xs sm:text-sm font-mono transition-colors cursor-pointer shadow-sm group"
              >
                <Terminal className="w-4 h-4 text-[#FF5A1F]" />
                <span>npm add @scrollcraft/react</span>
                {copiedInstall ? (
                  <Check className="w-4 h-4 text-[#16A34A] ml-1" />
                ) : (
                  <Copy className="w-4 h-4 text-[#A8A29E] group-hover:text-white ml-1 transition-colors" />
                )}
              </button>
              <MagneticPlaygroundLink />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 relative">
          <Reveal asChild direction="up" distance={20} delay={0.08}>
            <div className="rounded-2xl bg-white border border-[#E7E5E4] shadow-md overflow-hidden text-xs font-mono">
              <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAF9] border-b border-[#E7E5E4]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="ml-2 text-[11px] font-medium text-[#78716C]">kinetic-card.tsx</span>
                </div>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#F5F5F4] border border-[#E7E5E4] text-[11px] text-[#78716C] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-[#16A34A]" />
                      <span className="text-[#16A34A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#A8A29E]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-white overflow-x-auto leading-relaxed text-[11.5px] text-[#0A0A0A] m-0">
                <code>{HERO_CODE_SNIPPET}</code>
              </pre>
            </div>
          </Reveal>

          <Parallax asChild speed={0.14} min={-24} max={24}>
            <div className="rounded-2xl bg-white border border-[#E7E5E4] shadow-md p-5 will-change-transform">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-xs font-bold text-[#0A0A0A]">Live engine</span>
                </div>
                <span className="text-[11px] text-[#78716C]">Scroll — 0 React re-renders</span>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 rounded-xl overflow-hidden relative h-36 bg-[#1C1917] shadow-inner">
                  <Parallax asChild speed={0.22} min={-36} max={36}>
                    <div className="absolute -inset-y-8 inset-x-0 will-change-transform">
                      <Image
                        src="/images/hero-mountain.jpg"
                        alt="Snowy mountain peaks"
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        priority
                        className="object-cover object-center"
                      />
                    </div>
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-3.5 z-10 pointer-events-none">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Nested Parallax layers
                    </h4>
                    <p className="text-[10px] text-zinc-300 mt-0.5">
                      Direct translate3d via ticker render phase.
                    </p>
                  </div>
                </div>
                <div className="sm:col-span-4 pl-1">
                  <TelemetryMetricsPanel />
                </div>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
};
