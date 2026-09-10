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
        <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">
            120 FPS Subpixel Motion
          </h2>
          <p className="mt-2 text-zinc-600">
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
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Getting Started
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Introduction & Mental Model
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            A production-grade, React 19 & Next.js 15 (App Router)-native scroll engine engineered for 120 FPS subpixel motion, zero React root re-renders, and headless Radix-style Slot composition.
          </p>
        </header>

        {/* The Beginner Mental Model */}
        <section id="the-problem" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            The Problem with Traditional Web Scroll
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Every web developer has tried building scroll animations in React and hit the exact same wall: <strong>stutter, lag, and dropped frames</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">01. Layout Thrashing</span>
              <h4 className="text-sm font-bold text-[#0A0A0A] mt-1">Forced Synchronous Layout</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Reading <code className="font-mono text-[10px]">offsetTop</code> while writing styles halts the browser engine and forces a recalculation of the entire page layout.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">02. State Re-rendering</span>
              <h4 className="text-sm font-bold text-[#0A0A0A] mt-1">Virtual DOM Overkill</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Updating <code className="font-mono text-[10px]">useState(scrollY)</code> triggers component re-renders 60 to 120 times every single second, saturating CPU cores.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">03. Wrapper Pollution</span>
              <h4 className="text-sm font-bold text-[#0A0A0A] mt-1">Broken Flex & Grid</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Injecting extra wrapper <code className="font-mono text-[10px]">&lt;div&gt;</code> tags into the DOM shatters CSS Grid layouts, flexbox sizing, and sticky positioning.
              </p>
            </div>
          </div>
        </section>

        {/* The ScrollCraft Solution */}
        <section id="our-architecture" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            The ScrollCraft Architecture
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            ScrollCraft eliminates all three problems with three core architectural pillars:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
              <div className="p-1 rounded-md bg-[#FFF7ED] text-[#FF5A1F] mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A0A0A]">Direct-to-DOM Writes (0 Re-renders)</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Primitives write directly to <code className="font-mono text-[11px] text-[#0A0A0A]">node.style.transform = translate3d(...)</code> during the render phase. React component trees stay 100% idle while graphics render at 120 FPS.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
              <div className="p-1 rounded-md bg-[#FFF7ED] text-[#FF5A1F] mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A0A0A]">Zero-Dependency asChild Slot Composition</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Bespoke Radix-grade <code className="font-mono text-[11px] text-[#0A0A0A]">Slot</code> implementation merges refs, inline styles, and class names cleanly onto the child without injecting arbitrary wrapper elements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
              <div className="p-1 rounded-md bg-[#FFF7ED] text-[#FF5A1F] mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A0A0A]">Next.js App Router Native Integration</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Strictly respects Next.js scroll restoration (<code className="font-mono text-[11px] text-[#0A0A0A]">&lt;Link scroll=&#123;false&#125;&gt;</code>) and dynamically recalculates boundaries with <code className="font-mono text-[11px] text-[#0A0A0A]">ResizeObserver</code> and <code className="font-mono text-[11px] text-[#0A0A0A]">document.fonts.ready</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Example */}
        <section id="quick-example" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Quick Code Preview
          </h2>
          <CodeViewer code={QUICK_USAGE_CODE} fileName="components/hero-card.tsx" />
        </section>

        <DocsCallout type="tip" title="GSAP & Locomotive Migration">
          ScrollCraft provides the visual power and buttery inertia of GSAP ScrollTrigger and Locomotive, but wrapped inside a modern React 19 architecture with zero licensing fees and zero DOM bloat.
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
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Installation
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Install the core and React packages into your project using your preferred package manager.
          </p>
        </header>

        <section id="install-package" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Choose Package Manager
          </h2>

          {/* Package Manager Tab Bar */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-3 py-2 bg-[#FAFAF9] border-b border-[#E5E7EB]">
              <div className="flex items-center gap-1.5">
                {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setSelectedPm(pm)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedPm === pm
                        ? 'bg-white text-[#FF5A1F] border border-[#FFEDD5] shadow-xs'
                        : 'text-[#6B7280] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyPm}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#0A0A0A] hover:border-[#D1D5DB] transition-all cursor-pointer shadow-xs"
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

            <div className="p-4 bg-[#F8FAFC] text-zinc-900 font-mono text-xs overflow-x-auto flex items-center justify-between border-t border-zinc-200/80">
              <span className="text-[#FF5A1F] font-bold mr-2 select-none">$</span>
              <span className="flex-1 select-all font-medium">{PM_COMMANDS[selectedPm]}</span>
            </div>
          </div>
        </section>

        <section id="requirements" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            System Requirements
          </h2>
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-left text-xs font-mono">
              <tbody className="divide-y divide-[#F3F4F6]">
                <tr className="hover:bg-[#FAFAF9]">
                  <td className="py-3 px-4 text-[#6B7280] font-sans font-medium">React Version</td>
                  <td className="py-3 px-4 font-bold text-[#0A0A0A]">^18.0.0 || ^19.0.0</td>
                </tr>
                <tr className="hover:bg-[#FAFAF9]">
                  <td className="py-3 px-4 text-[#6B7280] font-sans font-medium">Next.js (Recommended)</td>
                  <td className="py-3 px-4 font-bold text-[#0A0A0A]">^14.0.0 || ^15.0.0 (App Router)</td>
                </tr>
                <tr className="hover:bg-[#FAFAF9]">
                  <td className="py-3 px-4 text-[#6B7280] font-sans font-medium">TypeScript</td>
                  <td className="py-3 px-4 font-bold text-[#0A0A0A]">&gt;= 5.0 (Strict mode compliant)</td>
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
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
          Next.js App Router Setup
        </h1>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
          Wrap your root layout with ScrollProvider to initialize inertia normalization and the 3-phase ticker.
        </p>
      </header>

      <section id="provider-setup" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Root Layout Integration
        </h2>
        <CodeViewer code={SETUP_CODE} fileName="app/layout.tsx" />
      </section>

      <section id="provider-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
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
