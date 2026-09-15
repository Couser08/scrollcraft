'use client';

/**
 * ScrollCraft Docs: Getting Started (Reference-Only)
 * Fast 15-second scanning setup reference:
 * - Package install command
 * - Root layout integration (<ScrollProvider>)
 * - Mental model & RSC rules
 * Strictly zero narrative fluff.
 */

import React, { useState } from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Check, Copy, Terminal, ShieldCheck, BookOpen, Layers, Cpu, Zap } from 'lucide-react';

interface DocGettingStartedProps {
  sectionId: string;
}

const PM_COMMANDS = {
  pnpm: 'pnpm add @scrollcraft/react',
  npm: 'npm i @scrollcraft/react',
  yarn: 'yarn add @scrollcraft/react',
  bun: 'bun add @scrollcraft/react',
};

const NEXT_LAYOUT_SETUP = `// app/layout.tsx
import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider smooth={true} respectReducedMotion={true} autoRecalc={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}`;

const QUICK_START_CODE = `'use client';

import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroScene() {
  return (
    <div className="relative min-h-screen">
      <Parallax speed={-0.2}>
        <div className="bg-layer" />
      </Parallax>
      <Reveal direction="up" distance={30} delay={0.1}>
        <h1>High-Performance Scroll Engine</h1>
      </Reveal>
    </div>
  );
}`;

const PROVIDER_PROPS = [
  { prop: 'smooth', type: 'boolean | InertiaConfig', defaultValue: 'true', desc: 'Enables Lenis subpixel inertia scroll normalization across all platforms.' },
  { prop: 'respectReducedMotion', type: 'boolean', defaultValue: 'true', desc: 'Automatically disables smooth inertia and collapses animations when OS prefers-reduced-motion is active.' },
  { prop: 'autoRecalc', type: 'boolean', defaultValue: 'true', desc: 'Monitors document body mutations and font loading to dynamically update scroll dimensions.' },
  { prop: 'debug', type: 'boolean | DebugOptions', defaultValue: 'false', desc: 'Mounts telemetry inspector HUD and visual scroll trigger boundaries.' },
];

export const DocGettingStarted: React.FC<DocGettingStartedProps> = ({ sectionId }) => {
  const [activePm, setActivePm] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm');
  const [copied, setCopied] = useState(false);

  // Auto-scroll to requested section when sectionId changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const targetMap: Record<string, string> = {
      introduction: 'introduction-mental-model',
      installation: 'install-package',
      setup: 'provider-setup',
    };
    const targetId = targetMap[sectionId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -88;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [sectionId]);

  const copyInstall = () => {
    navigator.clipboard.writeText(PM_COMMANDS[activePm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 not-prose">
      {/* 0. Introduction & Mental Model */}
      <section id="introduction-mental-model" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400" />
          <h1 className="text-2xl font-bold text-white font-mono">Introduction &amp; Mental Model</h1>
        </div>
        <p className="text-sm text-zinc-300 font-sans leading-relaxed">
          ScrollCraft is a hardware-accelerated declarative scroll engine built specifically for React and Next.js App Router. It decouples continuous scroll gestures from React&apos;s fiber reconciliation tree, writing directly to GPU composite matrices with zero Virtual DOM re-renders.
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero Re-Renders</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Scroll transformations update directly in the RAF render microtask without triggering component re-renders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>RSC &amp; Slot Native</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Fully compatible with Next.js 15 Server Components. Use <code className="text-zinc-300 font-mono">asChild</code> to avoid extra wrapper DOM nodes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>&lt; 4.2 KB Gzip</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Tree-shakeable architecture with zero external runtime dependencies. Built on high-precision physics.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Installation */}
      <section id="install-package" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <h2 className="text-xl font-bold text-white font-mono">Package Installation</h2>
        </div>

        {/* Package Manager Selector & Copy Box */}
        <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
              <button
                key={pm}
                type="button"
                onClick={() => setActivePm(pm)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activePm === pm
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {pm}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-zinc-200">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-zinc-500 select-none">$</span>
              <span>{PM_COMMANDS[activePm]}</span>
            </div>
            <button
              onClick={copyInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors cursor-pointer ml-3 shrink-0"
              title="Copy installation command"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
          <span>Peer Requirements: React 18+ or 19+</span>
          <span>&bull;</span>
          <span>Next.js 14+ or 15+ (App Router)</span>
        </div>
      </section>

      {/* 2. Root Layout Integration */}
      <section id="provider-setup" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div>
          <h2 className="text-xl font-bold text-white font-mono mb-1">Root Layout Integration</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Mount <code className="text-violet-400 font-mono">&lt;ScrollProvider /&gt;</code> in your root layout. Initializes the global 3-phase ticker and Lenis inertia physics.
          </p>
        </div>

        <CodeViewer code={NEXT_LAYOUT_SETUP} fileName="app/layout.tsx" />

        {/* ScrollProvider Props Table */}
        <div className="space-y-3 pt-3">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
            ScrollProvider Configuration Options
          </span>
          <div className="rounded-xl border border-zinc-800 overflow-hidden bg-[#0a0a0c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Prop</th>
                  <th className="px-4 py-2.5 font-semibold">Type</th>
                  <th className="px-4 py-2.5 font-semibold">Default</th>
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans text-zinc-300">
                {PROVIDER_PROPS.map((p) => (
                  <tr key={p.prop} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-violet-400 font-semibold">{p.prop}</td>
                    <td className="px-4 py-3 font-mono text-purple-300 text-[11px]">{p.type}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500 text-[11px]">{p.defaultValue}</td>
                    <td className="px-4 py-3 text-zinc-300 text-xs">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Quickstart Component Example */}
      <section id="quick-example" className="space-y-4 border-b border-zinc-800 pb-8">
        <div>
          <h2 className="text-xl font-bold text-white font-mono mb-1">Quickstart Component</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Add <code className="text-violet-400 font-mono">&apos;use client&apos;</code> to components using primitives or hooks, or pass Server Components as children.
          </p>
        </div>

        <CodeViewer code={QUICK_START_CODE} fileName="components/hero-scene.tsx" />
      </section>

      {/* 4. Core Architecture Invariant */}
      <section className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Core Engineering Invariants</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-zinc-400 font-sans leading-relaxed">
          <li><strong className="text-white">Zero React Re-Renders:</strong> Scroll physics write directly to ref style transforms at hardware frame intervals.</li>
          <li><strong className="text-white">Deterministic 3-Phase Loop:</strong> Measure phase precedes all style mutator writes, eliminating layout thrashing.</li>
          <li><strong className="text-white">Full RSC Compatibility:</strong> Compatible with Next.js 15 Server Components and streaming SSR.</li>
        </ul>
      </section>
    </div>
  );
};
