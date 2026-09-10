'use client';

/**
 * Product showcase strip — HorizontalScroll + live engine panels.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HorizontalScroll,
  Parallax,
  Reveal,
  VelocityMarquee,
} from '@scrollcraft/react';
import { ChevronRight } from 'lucide-react';

function PanelShell({
  tag,
  title,
  children,
  dark = false,
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <article
      className={`relative w-[min(88vw,440px)] h-[68vh] max-h-[520px] shrink-0 rounded-[14px] overflow-hidden border ${
        dark ? 'border-white/10 bg-[#0A0A0A]' : 'border-[#E7E5E4] bg-white'
      } shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] flex flex-col`}
    >
      <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3 shrink-0">
        <span
          className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
            dark ? 'text-[#FF5A1F]' : 'text-[#FF5A1F]'
          }`}
        >
          {tag}
        </span>
      </div>
      <div className="flex-1 min-h-0 px-5">{children}</div>
      <div className={`px-5 py-4 border-t shrink-0 ${dark ? 'border-white/10' : 'border-[#E7E5E4]'}`}>
        <h3 className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-[#0A0A0A]'}`}>
          {title}
        </h3>
      </div>
    </article>
  );
}

function ParallaxPanel() {
  return (
    <PanelShell tag="Parallax" title="Nested depth layers" dark>
      <div className="relative h-full rounded-[10px] overflow-hidden bg-[#1C1917]">
        <Parallax asChild speed={-0.1} min={-24} max={24}>
          <div className="absolute -inset-8 opacity-60 will-change-transform">
            <Image src="/images/cta-mountains.jpg" alt="" fill className="object-cover blur-[2px]" sizes="400px" />
          </div>
        </Parallax>
        <Parallax asChild speed={0.16} min={-32} max={32}>
          <div className="absolute inset-x-6 top-8 bottom-10 rounded-[10px] overflow-hidden border border-white/20 will-change-transform shadow-xl">
            <Image src="/images/hero-mountain.jpg" alt="" fill className="object-cover" sizes="360px" />
          </div>
        </Parallax>
      </div>
    </PanelShell>
  );
}

function RevealPanel() {
  return (
    <PanelShell tag="Reveal" title="Staggered enter">
      <div className="h-full flex flex-col justify-center gap-3 py-4">
        {['Compose once', 'Ship on App Router', 'Stay off React’s render path'].map((line, i) => (
          <Reveal key={line} asChild direction="up" distance={18} delay={i * 0.1} once={false} threshold={0.25}>
            <p className="text-2xl sm:text-[1.65rem] font-bold tracking-tight text-[#0A0A0A] leading-tight">
              {line}
            </p>
          </Reveal>
        ))}
        <Reveal asChild direction="up" distance={12} delay={0.32} once={false} threshold={0.25}>
          <p className="text-sm text-[#78716C] mt-2">Scroll this panel into view again to re-trigger.</p>
        </Reveal>
      </div>
    </PanelShell>
  );
}

function MarqueePanel() {
  return (
    <PanelShell tag="VelocityMarquee" title="Speed-linked type" dark>
      <div className="h-full flex flex-col justify-center -mx-5">
        <VelocityMarquee baseSpeed={0.35} velocityMultiplier={0.12} maxSpeed={4.5}>
          <div className="flex items-center gap-8 pr-8 text-3xl font-bold text-white/90">
            <span>zero re-renders</span>
            <span className="text-[#FF5A1F]">/</span>
            <span>asChild</span>
            <span className="text-[#FF5A1F]">/</span>
            <span>GPU writes</span>
            <span className="text-[#FF5A1F]">/</span>
            <span>Lenis</span>
            <span className="text-[#FF5A1F]">/</span>
          </div>
        </VelocityMarquee>
        <p className="px-5 mt-8 text-sm text-white/50">Scroll faster — the track accelerates.</p>
      </div>
    </PanelShell>
  );
}

function PinPanel() {
  // Nested overflow can't drive page PinSolver — CSS sticky mirrors the Pin contract.
  return (
    <PanelShell tag="Pin" title="Sticky scrub frame">
      <div className="h-full overflow-y-auto overscroll-contain rounded-[10px] border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2">
        <div className="relative min-h-[280px]">
          <div className="sticky top-1 z-10 rounded-md bg-[#FF5A1F] text-white text-xs font-mono font-semibold px-2.5 py-1.5 shadow-sm w-fit">
            pinned
          </div>
          <div className="mt-4 space-y-3 pb-6 text-sm text-[#78716C] leading-relaxed">
            <p>Scroll inside this card. Native sticky — same contract as {'<Pin>'}.</p>
            <div className="h-16 rounded-[8px] bg-white border border-[#E7E5E4]" />
            <div className="h-16 rounded-[8px] bg-white border border-[#E7E5E4]" />
            <p>Use PinContainer on full pages when you need a scrub track.</p>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function ShowcaseStrip() {
  return (
    <section id="showcase" className="w-full bg-[#FAFAF9] border-t border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A]">
              Built with ScrollCraft.
            </h2>
            <p className="mt-3 text-base text-[#78716C] leading-relaxed">
              Keep scrolling — vertical input drives this horizontal proof reel.
            </p>
          </div>
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5A1F] hover:text-[#E54800] self-start sm:self-auto"
          >
            Tune in Playground
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <HorizontalScroll speed={2.4} className="w-full" innerClassName="gap-5 px-4 sm:px-6 lg:px-8 items-stretch pb-4">
        <ParallaxPanel />
        <RevealPanel />
        <MarqueePanel />
        <PinPanel />
      </HorizontalScroll>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-8">
        <p className="text-sm text-[#78716C] max-w-2xl leading-relaxed">
          GSAP is powerful but heavy in React. Framer scroll needs too much glue.{' '}
          <span className="text-[#0A0A0A] font-medium">ScrollCraft is declarative and SSR-safe.</span>
        </p>
      </div>
    </section>
  );
}
