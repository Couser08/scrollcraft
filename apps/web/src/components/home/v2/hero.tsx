'use client';

/**
 * Home v2 Hero — one composition: brand, promise, CTAs, one live stage.
 */

import React, { useEffect, useRef, useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, useScrollCraft, useMagnetic } from '@scrollcraft/react';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { btnPrimary, btnSecondary } from './section-shell';

const INSTALL = 'npm add @scrollcraft/react';

const LiveTelemetry = memo(function LiveTelemetry() {
  const { subscribe, getMetrics } = useScrollCraft();
  const progressRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      const m = getMetrics();
      if (progressRef.current) progressRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      if (velocityRef.current) velocityRef.current.textContent = m.velocity.toFixed(2);
    } catch {
      /* noop */
    }
    return subscribe((m) => {
      if (progressRef.current) progressRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      if (velocityRef.current) velocityRef.current.textContent = m.velocity.toFixed(2);
    });
  }, [subscribe, getMetrics]);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3 pointer-events-none">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/60">Live engine</p>
        <p className="text-sm font-semibold text-white mt-0.5">Nested Parallax</p>
      </div>
      <div className="flex gap-4 font-mono text-[11px] tabular-nums text-white/90">
        <div>
          <span className="text-white/50 block">vel</span>
          <span ref={velocityRef}>0.00</span>
        </div>
        <div>
          <span className="text-white/50 block">prog</span>
          <span ref={progressRef} className="text-[#FF5A1F]">
            0%
          </span>
        </div>
      </div>
    </div>
  );
});

function MagneticDocsLink() {
  const { ref } = useMagnetic({ strength: 0.2, radius: 80, stiffness: 0.2, damping: 0.72 });
  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href="/docs"
      className={`${btnSecondary} will-change-transform`}
    >
      Read docs
      <ChevronRight className="w-4 h-4 text-[#78716C]" />
    </Link>
  );
}

export function HomeHeroV2() {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Copy column — brand first */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#FF5A1F] mb-5">
              React · Next.js · App Router
            </p>

            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-[#0A0A0A] leading-[0.98]">
              ScrollCraft
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-medium text-[#78716C] tracking-tight leading-snug">
              Declarative scroll for modern React.
            </p>

            <p className="mt-5 text-base text-[#78716C] leading-relaxed max-w-md">
              Smooth, SSR-safe primitives without GSAP complexity or Framer scroll boilerplate.
              Direct GPU writes. Zero wrapper pollution.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={copyInstall} className={btnPrimary}>
                {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#FF5A1F]" />}
                <span className="font-mono text-xs sm:text-sm">{INSTALL}</span>
              </button>
              <MagneticDocsLink />
            </div>

            <pre className="mt-8 w-full max-w-md rounded-[10px] border border-[#E7E5E4] bg-white px-4 py-3 text-[11px] sm:text-xs font-mono text-[#44403C] leading-relaxed overflow-x-auto">
              <code>{`<Parallax asChild speed={0.15}>\n  <div className="card" />\n</Parallax>`}</code>
            </pre>
          </div>

          {/* Dominant live stage */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[14px] overflow-hidden border border-[#E7E5E4] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.35)] bg-[#1C1917]">
              <Parallax asChild speed={-0.06} min={-20} max={20}>
                <div className="absolute -inset-8 opacity-40 will-change-transform">
                  <Image
                    src="/images/cta-mountains.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover blur-sm scale-110"
                    aria-hidden
                  />
                </div>
              </Parallax>

              <Parallax asChild speed={0.1} min={-28} max={28}>
                <div className="absolute -inset-y-10 inset-x-0 will-change-transform">
                  <Image
                    src="/images/hero-mountain.jpg"
                    alt="Scroll-driven parallax preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    priority
                    className="object-cover"
                  />
                </div>
              </Parallax>

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <LiveTelemetry />
            </div>
            <p className="mt-3 text-xs text-[#A8A29E] font-mono">
              Scroll the page — transforms write to the compositor, not React state.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
