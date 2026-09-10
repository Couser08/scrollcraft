'use client';

/**
 * Docs Section: Getting Started (Intro, Mental Model, Install, Setup)
 * Aligned with ScrollCraft #FF5A1F design tokens.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import { PROVIDER_PROPS } from '../docs-data';
import { Check, Copy, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface DocGettingStartedProps {
  sectionId: string;
}

const PM_COMMANDS = {
  pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
  npm: 'npm i @scrollcraft/react @scrollcraft/core',
  yarn: 'yarn add @scrollcraft/react @scrollcraft/core',
  bun: 'bun add @scrollcraft/react @scrollcraft/core',
};

const SETUP_CODE = `// app/layout.tsx
import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Project — High Performance Scroll',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Wrap your entire application in ScrollProvider */}
        <ScrollProvider
          smooth={true}
          respectReducedMotion={true}
          autoResetOnRouteChange={false}
          autoRecalc={true}
        >
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}`;

const QUICK_USAGE_CODE = `// components/hero-card.tsx
'use client';

import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroCard() {
  return (
    <Reveal variant="slide-up" duration={0.6}>
      {/* asChild delegates transforms directly to your div — zero wrapper div! */}
      <Parallax asChild speed={0.15}>
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
          <h2 className="text-2xl font-bold text-white">
            120 FPS Subpixel Motion
          </h2>
          <p className="mt-2 text-zinc-400">
            Zero React re-renders. Direct GPU compositor transforms.
          </p>
        </div>
      </Parallax>
    </Reveal>
  );
}`;

export const DocGettingStarted: React.FC<DocGettingStartedProps> = ({
  sectionId,
}) => {
  const [selectedPm, setSelectedPm] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copiedPm, setCopiedPm] = useState(false);

  const handleCopyPm = () => {
    navigator.clipboard.writeText(PM_COMMANDS[selectedPm]);
    setCopiedPm(true);
    setTimeout(() => setCopiedPm(false), 2000);
  };

  if (sectionId === 'introduction') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Getting Started
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100">
            Why ScrollCraft Was Born
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            You spent 6 hours building a fluid scroll interaction for your landing page. On your high-end desktop, it looked flawless. But on an iPhone or Android phone, it dropped to 28 FPS, drained battery, and caused the user to rage-scroll past your content.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            Scroll animations in React have been trapped in legacy patterns: 70 kB runtime bundles, forced layout thrashing, component re-renders 120 times every second, and injected wrapper <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">&lt;div&gt;</code> tags that shatter your CSS Grid. 
            <br className="my-1" />
            <strong>ScrollCraft was engineered to end this status quo.</strong>
          </p>
        </header>

        {/* The 3 Core Invariants */}
        <section id="the-problem" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            The 3 Unbreakable Invariants of ScrollCraft
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Every primitive in ScrollCraft is mathematically designed around three non-negotiable architectural rules:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF5A1F]">Invariant 01</span>
                <h4 className="text-base font-bold text-zinc-100 mt-1">Zero React Re-Renders</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Never update React component state (<code className="font-mono text-[10px]">useState(scrollY)</code>) during a scroll event. ScrollCraft mutates GPU transforms directly onto DOM elements via the 3-phase Ticker. React root components stay 100% idle.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#16A34A] font-semibold">
                <span>✓ 0 DOM diffing overhead</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF5A1F]">Invariant 02</span>
                <h4 className="text-base font-bold text-zinc-100 mt-1">Zero Wrapper Pollution</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Traditional scroll libraries inject arbitrary wrapper divs that break CSS Grid, flex stretch, and sticky stacks. ScrollCraft uses headless Radix-grade <code className="font-mono text-[10px]">asChild</code> Slot composition to merge directly onto your existing element.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#16A34A] font-semibold">
                <span>✓ 100% clean DOM hierarchy</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF5A1F]">Invariant 03</span>
                <h4 className="text-base font-bold text-zinc-100 mt-1">Native-First Progressive Fallback</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Native where possible, JS where necessary. On modern browsers (Chrome/Edge), ScrollCraft drives animations entirely on the CSS compositor thread (<code className="font-mono text-[10px]">view-timeline</code>) with 0 kB main-thread JS cost. On Safari/Firefox, it falls back to a 3-phase microtask Ticker.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#16A34A] font-semibold">
                <span>✓ 120 FPS compositor acceleration</span>
              </div>
            </div>
          </div>
        </section>

        {/* The ScrollCraft Architecture */}
        <section id="our-architecture" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            The 3-Phase Zero-Allocation Loop
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Layout thrashing occurs when JavaScript reads geometry properties (<code className="font-mono text-xs text-zinc-100">getBoundingClientRect()</code>) while interleaving writes (<code className="font-mono text-xs text-zinc-100">element.style.transform</code>). ScrollCraft enforces strict phase separation:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#080808] border border-white/10">
              <div className="p-1.5 rounded-md bg-[#FF5A1F]/10 text-[#FF5A1F] mt-0.5 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Phase 1: Measure (Batch Layout Reads)</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Geometry reads only occur once on mount and upon window/font resize via a shared <code className="font-mono text-[11px] text-zinc-100">ResizeObserver</code>. Zero layout calculations occur during high-frequency scrolling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#080808] border border-white/10">
              <div className="p-1.5 rounded-md bg-[#FF5A1F]/10 text-[#FF5A1F] mt-0.5 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Phase 2: Update (Pure Math Transformation)</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Normalized inertia algorithms calculate subpixel offsets, spring damping forces, and velocity momentum without performing any DOM allocations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#080808] border border-white/10">
              <div className="p-1.5 rounded-md bg-[#FF5A1F]/10 text-[#FF5A1F] mt-0.5 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Phase 3: Render (Direct GPU Mutation)</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Single-pass mutation to <code className="font-mono text-[11px] text-zinc-100">translate3d</code> directly on the element ref. Transforms execute cleanly on the GPU compositor thread without disturbing React reconciliation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Example */}
        <section id="quick-example" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Quick Code Preview
          </h2>
          <CodeViewer code={QUICK_USAGE_CODE} fileName="components/hero-card.tsx" />
        </section>

        <DocsCallout type="tip" title="Designed for React 19 & Next.js 15 App Router">
          ScrollCraft is built from the ground up for modern server component architectures. It respects Next.js scroll restoration, supports client boundary slots without hydration flickers, and provides zero bundle weight on static pages.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'installation') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Getting Started
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            Installation
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Install the core and React packages into your project using your preferred package manager.
          </p>
        </header>

        <section id="install-package" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Choose Package Manager
          </h2>

          {/* Package Manager Tab Bar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-3 py-2 bg-[#080808] border-b border-white/10">
              <div className="flex items-center gap-1.5">
                {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setSelectedPm(pm)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedPm === pm
                        ? 'bg-white/5 text-[#FF5A1F] border border-[#FFEDD5] shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyPm}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-100 hover:border-[#D1D5DB] transition-all cursor-pointer shadow-xs"
              >
                {copiedPm ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold font-mono text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="font-mono text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-[#000] text-zinc-100 font-mono text-xs overflow-x-auto flex items-center justify-between border-t border-white/10/80">
              <span className="text-[#FF5A1F] font-bold mr-2 select-none">$</span>
              <span className="flex-1 select-all font-medium">{PM_COMMANDS[selectedPm]}</span>
            </div>
          </div>
        </section>

        <section id="requirements" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            System Requirements
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-left text-xs font-mono">
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-[#080808]">
                  <td className="py-3 px-4 text-zinc-400 font-sans font-medium">React Version</td>
                  <td className="py-3 px-4 font-bold text-zinc-100">^18.0.0 || ^19.0.0</td>
                </tr>
                <tr className="hover:bg-[#080808]">
                  <td className="py-3 px-4 text-zinc-400 font-sans font-medium">Next.js (Recommended)</td>
                  <td className="py-3 px-4 font-bold text-zinc-100">^14.0.0 || ^15.0.0 (App Router)</td>
                </tr>
                <tr className="hover:bg-[#080808]">
                  <td className="py-3 px-4 text-zinc-400 font-sans font-medium">TypeScript</td>
                  <td className="py-3 px-4 font-bold text-zinc-100">&gt;= 5.0 (Strict mode compliant)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // setup
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Getting Started
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          Next.js App Router Setup
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Wrap your root layout with ScrollProvider to initialize inertia normalization and the 3-phase ticker.
        </p>
      </header>

      <section id="provider-setup" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Root Layout Integration
        </h2>
        <CodeViewer code={SETUP_CODE} fileName="app/layout.tsx" />
      </section>

      <section id="provider-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          ScrollProvider Configuration
        </h2>
        <DocsTable title="Provider Props" props={PROVIDER_PROPS} />
      </section>

      <DocsCallout type="note" title="Zero Re-render Provider">
        <code className="font-mono text-xs text-[#FF5A1F]">&lt;ScrollProvider&gt;</code> does not pass scroll coordinates via React Context values. Instead, it acts as a lightweight dependency injector for the global Ticker, ensuring your root layout component never re-renders during user scrolling.
      </DocsCallout>
    </div>
  );
};

