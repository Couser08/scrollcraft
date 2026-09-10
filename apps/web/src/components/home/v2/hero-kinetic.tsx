'use client';

/**
 * Kinetic full-bleed hero — the product is the first viewport.
 */

import React, { useEffect, useRef, useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, useScrollCraft, useMagnetic } from '@scrollcraft/react';
import { Copy, Check, ChevronRight } from 'lucide-react';

const INSTALL = 'npm add @scrollcraft/react';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] bg-[#0A0A0A] hover:bg-[#1C1917] text-white text-sm font-semibold transition-colors';
const btnGhost =
  'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] bg-white/10 hover:bg-white/15 border border-white/25 backdrop-blur-sm text-white text-sm font-semibold transition-colors';

const Hud = memo(function Hud() {
  const { subscribe, getMetrics } = useScrollCraft();
  const velRef = useRef<HTMLSpanElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      const m = getMetrics();
      if (velRef.current) velRef.current.textContent = m.velocity.toFixed(2);
      if (progRef.current) progRef.current.textContent = `${Math.round(m.progress * 100)}%`;
    } catch {
      /* noop */
    }
    return subscribe((m) => {
      if (velRef.current) velRef.current.textContent = m.velocity.toFixed(2);
      if (progRef.current) progRef.current.textContent = `${Math.round(m.progress * 100)}%`;
    });
  }, [subscribe, getMetrics]);

  return (
    <div className="absolute top-5 right-5 z-20 flex items-center gap-4 rounded-[10px] border border-white/15 bg-black/35 backdrop-blur-md px-3.5 py-2 font-mono text-[11px] tabular-nums text-white/90">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
        <span className="text-white/50 uppercase tracking-wider text-[10px]">live</span>
      </div>
      <div>
        <span className="text-white/45">vel </span>
        <span ref={velRef}>0.00</span>
      </div>
      <div>
        <span className="text-white/45">prog </span>
        <span ref={progRef} className="text-[#FF5A1F]">
          0%
        </span>
      </div>
    </div>
  );
});

function PlaygroundCta() {
  const { ref } = useMagnetic({ strength: 0.22, radius: 88, stiffness: 0.2, damping: 0.72 });
  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href="/playground"
      className={`${btnGhost} will-change-transform`}
    >
      Open Playground
      <ChevronRight className="w-4 h-4 text-white/70" />
    </Link>
  );
}

export function HeroKinetic() {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-[min(92vh,820px)] flex items-end overflow-hidden bg-[#1C1917]">
      {/* Depth layers */}
      <Parallax asChild speed={-0.08} min={-40} max={40}>
        <div className="absolute -inset-16 will-change-transform opacity-50">
          <Image
            src="/images/cta-mountains.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-md scale-110"
            aria-hidden
            priority
          />
        </div>
      </Parallax>

      <Parallax asChild speed={0.12} min={-48} max={48}>
        <div className="absolute -inset-y-16 inset-x-0 will-change-transform">
          <Image
            src="/images/hero-mountain.jpg"
            alt="ScrollCraft kinetic hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </Parallax>

      <Parallax asChild speed={0.22} min={-30} max={30}>
        <div
          aria-hidden
          className="absolute -bottom-10 -right-10 w-[55%] h-[45%] rounded-full bg-[#FF5A1F]/20 blur-3xl will-change-transform"
        />
      </Parallax>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-[#0A0A0A]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-transparent" />

      <Hud />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 pt-28">
        <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#FF5A1F] mb-4">
          React · Next.js · App Router
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-extrabold tracking-tight text-white leading-[0.95] max-w-3xl">
          ScrollCraft
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white/75 max-w-lg leading-relaxed">
          Declarative scroll for modern React — GPU compositor writes, SSR-safe, no wrapper pollution.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={copyInstall} className={btnPrimary}>
            {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#FF5A1F]" />}
            <span className="font-mono text-xs sm:text-sm">{INSTALL}</span>
          </button>
          <PlaygroundCta />
        </div>

        <p className="mt-6 text-xs font-mono text-white/45">
          Scroll — nested Parallax on this stage · zero React re-renders
        </p>
      </div>
    </section>
  );
}
