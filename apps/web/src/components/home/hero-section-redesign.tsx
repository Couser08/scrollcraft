'use client';

/**
 * ScrollCraft Hero Section Redesign
 * Pixel-perfect implementation of Image 2 Hero Section.
 * Strictly under 650 LOC.
 * Uses @scrollcraft/react engine with zero React re-renders during scroll.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, useScrollCraft } from '@scrollcraft/react';
import { DoodleAnnotation } from '@/components/ui/doodle-annotation';
import {
  Terminal,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Feather,
  Box,
  Infinity as InfinityIcon,
} from 'lucide-react';

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

/**
 * Telemetry Leaf Component
 * Subscribes to ScrollCraft engine and writes directly to DOM refs
 * ZERO React component re-renders per frame during scrolling.
 */
const TelemetryMetricsPanel = memo(() => {
  const { subscribe, getMetrics } = useScrollCraft();
  const offsetRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const speedRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Initial sync
    try {
      const initial = getMetrics();
      if (offsetRef.current) offsetRef.current.textContent = `${Math.round(initial.scroll)} px`;
      if (progressRef.current) progressRef.current.textContent = `${Math.round(initial.progress * 100)}%`;
      if (speedRef.current) speedRef.current.textContent = '0.15';
    } catch {
      // safe fallback
    }

    // Direct DOM subscription — 0 React re-renders
    const unsub = subscribe((m) => {
      if (offsetRef.current) {
        offsetRef.current.textContent = `${Math.round(m.scroll)} px`;
      }
      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      }
    });

    return unsub;
  }, [subscribe, getMetrics]);

  return (
    <div className="flex flex-col justify-center space-y-3 py-2 text-xs font-mono">
      <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2">
        <span className="text-[#6B7280]">Speed</span>
        <span ref={speedRef} className="font-semibold text-[#0A0A0A] inline-block w-14 text-right tabular-nums">
          0.15
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-2">
        <span className="text-[#6B7280]">Offset</span>
        <span ref={offsetRef} className="font-semibold text-[#0A0A0A] inline-block w-14 text-right tabular-nums">
          0 px
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[#6B7280]">Progress</span>
        <span ref={progressRef} className="font-semibold text-[#FF5A1F] inline-block w-14 text-right tabular-nums">
          0%
        </span>
      </div>
    </div>
  );
});

TelemetryMetricsPanel.displayName = 'TelemetryMetricsPanel';

export const HeroSectionRedesign: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'React' | 'Next.js' | 'TypeScript'>('React');

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
    <section className="relative w-full pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* ================= LEFT COLUMN: HERO COPY & ACTIONS ================= */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          {/* Badge: React 19 & Next.js 15 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#0A0A0A] shadow-2xs select-none">
            <Zap className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F]" />
            <span>React 19 & Next.js 15</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.03]">
            Scroll experiences <br />
            for <span className="text-[#FF5A1F]">modern web.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#6B7280] max-w-xl leading-relaxed font-normal">
            High-performance scroll primitives for React and Next.js. Direct GPU compositor
            writes, zero React re-renders, and no wrapper pollution. Build rich scroll
            interactions with ease.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Dark Terminal Install Button */}
            <button
              onClick={copyInstallCommand}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0A0A0A] hover:bg-zinc-800 text-white text-xs sm:text-sm font-mono transition-all cursor-pointer shadow-sm group"
              title="Copy install command"
            >
              <Terminal className="w-4 h-4 text-[#FF5A1F]" />
              <span>npm add @scrollcraft/react</span>
              {copiedInstall ? (
                <Check className="w-4 h-4 text-[#16A34A] ml-1" />
              ) : (
                <Copy className="w-4 h-4 text-[#9CA3AF] group-hover:text-white ml-1 transition-colors" />
              )}
            </button>

            {/* Secondary Button: Open Playground */}
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-2xs group"
            >
              <span>Open Playground</span>
              <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 4 Feature Metric Chips Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 w-full max-w-xl border-t border-[#E5E7EB]/80 mt-2">
            {/* 120 FPS */}
            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]/20 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#0A0A0A]">120 FPS</div>
                <div className="text-xs text-[#6B7280]">Smooth by default</div>
              </div>
            </div>

            {/* < 5 KB */}
            <div className="flex items-start gap-2.5">
              <Feather className="w-4 h-4 text-[#FF5A1F] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#0A0A0A]">&lt; 5 KB</div>
                <div className="text-xs text-[#6B7280]">Lightweight</div>
              </div>
            </div>

            {/* 100% */}
            <div className="flex items-start gap-2.5">
              <Box className="w-4 h-4 text-[#FF5A1F] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#0A0A0A]">100%</div>
                <div className="text-xs text-[#6B7280]">TypeScript ready</div>
              </div>
            </div>

            {/* Infinity */}
            <div className="flex items-start gap-2.5">
              <InfinityIcon className="w-4 h-4 text-[#FF5A1F] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#0A0A0A]">∞</div>
                <div className="text-xs text-[#6B7280]">No wrapper divs</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CODE WINDOW & LIVE PREVIEW ================= */}
        <div className="lg:col-span-5 flex flex-col gap-5 relative">
          {/* TOP CARD: Code Editor Window matching Image 2 */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-md overflow-hidden text-xs font-mono">
            {/* macOS Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAF9] border-b border-[#E5E7EB]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="ml-2 text-[11px] font-medium text-[#6B7280]">
                  kinetic-card.tsx
                </span>
              </div>

              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[11px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors cursor-pointer shadow-2xs"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-[#16A34A]" />
                    <span className="text-[#16A34A]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#9CA3AF]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body with Line Numbers & Design-Tokenized Colors */}
            <div className="p-4 bg-white overflow-x-auto leading-relaxed text-[11.5px]">
              <div className="flex gap-4">
                {/* Line numbers */}
                <div className="text-right text-[#D1D5DB] select-none flex flex-col">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                {/* Code content */}
                <div className="text-[#0A0A0A] whitespace-pre">
                  <div>
                    <span className="text-[#EA580C] font-semibold">import</span> &#123;{' '}
                    <span className="text-[#0A0A0A]">Parallax</span> &#125;{' '}
                    <span className="text-[#EA580C] font-semibold">from</span>{' '}
                    <span className="text-[#16A34A]">&apos;@scrollcraft/react&apos;</span>;
                  </div>
                  <div>&nbsp;</div>
                  <div>
                    <span className="text-[#7C3AED] font-semibold">export function</span>{' '}
                    <span className="text-[#0284C7] font-semibold">KineticCard</span>() &#123;
                  </div>
                  <div>
                    &nbsp;&nbsp;<span className="text-[#EA580C] font-semibold">return</span> (
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                    <span className="text-[#2563EB] font-semibold">Parallax</span>{' '}
                    <span className="text-[#EA580C]">asChild</span>{' '}
                    <span className="text-[#D97706]">speed</span>=&#123;0.15&#125;&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
                    <span className="text-[#2563EB] font-semibold">div</span>{' '}
                    <span className="text-[#D97706]">className</span>=
                    <span className="text-[#16A34A]">&quot;card&quot;</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
                    <span className="text-[#2563EB] font-semibold">h3</span>&gt;120 FPS Subpixel Motion&lt;/
                    <span className="text-[#2563EB] font-semibold">h3</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                    <span className="text-[#2563EB] font-semibold">div</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                    <span className="text-[#2563EB] font-semibold">Parallax</span>&gt;
                  </div>
                  <div>&nbsp;&nbsp;);</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>

            {/* Language Selection Tabs */}
            <div className="flex items-center gap-6 px-4 py-2 border-t border-[#E5E7EB] bg-[#FAFAF9] text-[11px] font-sans font-medium">
              {(['React', 'Next.js', 'TypeScript'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-1 cursor-pointer transition-colors relative ${
                    activeTab === tab
                      ? 'text-[#FF5A1F] font-bold'
                      : 'text-[#6B7280] hover:text-[#0A0A0A]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF5A1F] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM CARD: Live Interactive Preview matching Image 2 */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-md p-5 relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-xs font-bold text-[#0A0A0A]">Live Preview</span>
              </div>
              <span className="text-[11px] text-[#6B7280]">Scroll to see the effect</span>
            </div>

            {/* Content: Mountain Parallax Card on Left + Metrics on Right */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Mountain Card with @scrollcraft/react Parallax Primitive */}
              <div className="sm:col-span-8 rounded-xl overflow-hidden relative h-36 bg-zinc-900 shadow-inner group">
                <Parallax asChild speed={0.15}>
                  <div className="absolute -inset-y-6 inset-x-0 will-change-transform">
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

                {/* Dark Gradient Overlay & Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 z-10 pointer-events-none">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
                    Smooth Subpixel Inertia
                  </h4>
                  <p className="text-[10px] text-zinc-300 mt-0.5">
                    Transforms write directly to GPU via ref.
                  </p>
                </div>
              </div>

              {/* Right Side: Telemetry Metrics Panel */}
              <div className="sm:col-span-4 pl-1">
                <TelemetryMetricsPanel />
              </div>
            </div>
          </div>

          {/* Hand-Drawn Annotation Arrow pointing to Live Preview (Image 2) */}
          <div className="absolute -right-8 -bottom-14 hidden xl:block">
            <DoodleAnnotation text="Real-time preview" />
          </div>
        </div>
      </div>
    </section>
  );
};
