'use client';

/**
 * Luminous Editorial Hero Section
 * Inspired by Lenis and Motion.dev: large architectural typography,
 * real-time kinetic demonstration, and live tokenized syntax highlighted code.
 * Strictly under 650 LOC.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Parallax, useScrollCraft } from '@scrollcraft/react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Terminal, Copy, Check, Activity, ArrowUpRight, Zap } from 'lucide-react';

const HERO_SNIPPET = `import { Parallax } from '@scrollcraft/react';

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
 * Direct DOM-ref Telemetry Strip
 * Writes velocity, offset, and progress directly to DOM textContent without React reconciliation.
 */
const HeroTelemetryStrip = memo(() => {
  const { subscribe, getMetrics } = useScrollCraft();
  const velocityRef = useRef<HTMLSpanElement | null>(null);
  const offsetRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const initial = getMetrics();
    if (velocityRef.current) {
      velocityRef.current.textContent = `${Math.abs(Math.round(initial.velocity))} px/s`;
    }
    if (offsetRef.current) {
      offsetRef.current.textContent = `Offset: ${Math.round(initial.scroll)}px`;
    }
    if (progressRef.current) {
      progressRef.current.textContent = `${Math.round(initial.progress * 100)}%`;
    }

    const unsub = subscribe((m) => {
      if (velocityRef.current) {
        velocityRef.current.textContent = `${Math.abs(Math.round(m.velocity))} px/s`;
      }
      if (offsetRef.current) {
        offsetRef.current.textContent = `Offset: ${Math.round(m.scroll)}px`;
      }
      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(m.progress * 100)}%`;
      }
    });

    return unsub;
  }, [subscribe, getMetrics]);

  return (
    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-600">
      <div className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-emerald-600" />
        <span ref={velocityRef}>0 px/s</span>
      </div>
      <span className="text-zinc-400">|</span>
      <span ref={offsetRef}>Offset: 0px</span>
      <span className="text-zinc-400">|</span>
      <span ref={progressRef} className="text-blue-600 font-semibold">0%</span>
    </div>
  );
});

HeroTelemetryStrip.displayName = 'HeroTelemetryStrip';

export const HeroEditorial: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText('pnpm add @scrollcraft/react');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Headline & Subtitle */}
      <div className="max-w-4xl flex flex-col items-start gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-700 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>React 19 & Next.js 15 App Router</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-zinc-950 leading-[0.98]">
          The React & Next.js <br />
          <span className="text-blue-600">scroll toolkit.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl leading-relaxed font-normal">
          120 FPS subpixel inertia. Direct GPU compositor writes without React re-renders.
          Native <code className="text-zinc-900 font-mono text-sm px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200">asChild</code> Slot composition — zero wrapper divs.
        </p>

        {/* Installation & Quick Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={copyInstall}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-mono transition-all cursor-pointer shadow-sm group"
          >
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>pnpm add @scrollcraft/react</span>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400 ml-1" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 ml-1" />
            )}
          </button>

          <a
            href="#primitives"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-sm font-semibold text-zinc-900 transition-colors"
          >
            <span>Read Primitives</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Centerpiece: Live Kinetic Stage & Tokenized Code Viewer */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Tokenized Code Viewer */}
        <div className="lg:col-span-7">
          <CodeViewer
            code={HERO_SNIPPET}
            fileName="kinetic-card.tsx"
            className="shadow-md"
          />
        </div>

        {/* Right Column: Tactile Live Interactive Preview Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Parallax asChild speed={0.12}>
            <div className="rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-zinc-950 text-sm">Interactive Preview</span>
                </div>
                <span className="text-[11px] font-mono text-blue-600 font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                  speed: 0.12
                </span>
              </div>

              <div className="py-6 space-y-2">
                <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                  Smooth Subpixel Inertia
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Scroll this page to feel how this card glides with differential velocity.
                  Transforms write directly to GPU <code className="text-zinc-800">translate3d</code> via ref.
                </p>
              </div>

              {/* Live Telemetry Strip (Zero Re-render Leaf) */}
              <HeroTelemetryStrip />
            </div>
          </Parallax>

          {/* Engine Guarantee Pill */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 flex items-center justify-between font-mono">
            <span>Re-renders on scroll:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              0 per frame
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
