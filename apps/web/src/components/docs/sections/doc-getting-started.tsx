'use client';

/**
 * Docs Section: Getting Started (Intro, Install, Setup)
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import { PROVIDER_PROPS } from '../docs-data';

interface DocGettingStartedProps {
  sectionId: string;
}

const INSTALL_CODE = `# Using pnpm (recommended)
pnpm add @scrollcraft/react @scrollcraft/core

# Using npm
npm i @scrollcraft/react @scrollcraft/core

# Using yarn
yarn add @scrollcraft/react @scrollcraft/core

# Using bun
bun add @scrollcraft/react @scrollcraft/core`;

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
      <body>
        {/* Wrap your entire application in ScrollProvider */}
        <ScrollProvider
          smooth={true}
          respectReducedMotion={true}
          autoResetOnRouteChange={false}
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
  if (sectionId === 'introduction') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Getting Started
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
            Introduction to ScrollCraft
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            A production-grade, React 19 & Next.js 15 (App Router)-native scroll toolkit.
            Engineered for 120 FPS subpixel inertia, zero root re-renders, and headless Radix-style Slot composition.
          </p>
        </header>

        <section id="the-problem" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            The Problem with Modern Web Scroll
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Building scroll animations on the modern web usually forces developers into one of two compromises:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col gap-2">
              <span className="font-semibold text-xs text-rose-900 uppercase tracking-wider">
                Old Virtual Hijack
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Disables native scrolling completely and uses <code className="font-mono text-rose-800">translate3d</code> on a wrapper. Breaks browser accessibility (a11y), native scrollbars, iOS momentum rubber-banding, and Ctrl+F find-in-page.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col gap-2">
              <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                Naive React State Proxies
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Stores scroll positions in React state or triggers <code className="font-mono text-amber-800">setState</code> on scroll events. Forces entire React virtual DOM subtrees to re-render 60 to 120 times every second, causing severe dropped frames and battery drain.
              </p>
            </div>
          </div>
        </section>

        <section id="our-architecture" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            The ScrollCraft Solution
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            ScrollCraft combines the best of all worlds:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
            <li>
              <strong className="text-zinc-900">Native Scroll Wrap:</strong> Preserves 100% native scrolling, CSS sticky headers, keyboard navigation, and iOS rubber-banding.
            </li>
            <li>
              <strong className="text-zinc-900">3-Phase Ticker:</strong> Strict execution pipeline of <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">measure</code> &rarr; <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">update</code> &rarr; <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">render</code> to prevent layout thrashing.
            </li>
            <li>
              <strong className="text-zinc-900">Direct GPU Compositor:</strong> Writes direct transform matrix updates via element refs without triggering React reconciliation passes.
            </li>
            <li>
              <strong className="text-zinc-900">Radix-style Slot Composition:</strong> With <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">asChild</code>, components attach behavior to existing elements with zero extra wrapper <code className="font-mono text-xs text-zinc-700">&lt;div&gt;</code>s.
            </li>
          </ul>
        </section>

        <section id="quick-example" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Quick Preview
          </h2>
          <CodeViewer code={QUICK_USAGE_CODE} fileName="hero-card.tsx" />
        </section>
      </div>
    );
  }

  if (sectionId === 'installation') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Getting Started
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
            Installation
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Add ScrollCraft to your Next.js or React application using your preferred package manager.
          </p>
        </header>

        <section id="install-package" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Install Packages
          </h2>
          <CodeViewer code={INSTALL_CODE} fileName="Terminal" />
        </section>

        <DocsCallout type="note" title="Peer Dependencies">
          ScrollCraft is compatible with React 18 and React 19, Next.js 14 and Next.js 15 (both App Router and Pages Router).
        </DocsCallout>

        <section id="requirements" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            System Requirements
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600">
            <li>Node.js 18.17.0 or higher</li>
            <li>React 18.0.0 or React 19.0.0+</li>
            <li>Modern browser supporting ResizeObserver and CSS Transform3D</li>
          </ul>
        </section>
      </div>
    );
  }

  // Setup section
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
          Getting Started
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
          Next.js App Router Setup
        </h1>
        <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
          Integrate <code className="text-zinc-900 font-mono text-sm px-1.5 py-0.5 rounded bg-zinc-100">&lt;ScrollProvider&gt;</code> at your root layout for seamless SSR safety and zero layout shifts.
        </p>
      </header>

      <section id="provider-setup" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Root Layout Integration
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Wrap your root layout tree with <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">&lt;ScrollProvider&gt;</code> in <code className="font-mono text-xs text-zinc-800">app/layout.tsx</code>.
        </p>
        <CodeViewer code={SETUP_CODE} fileName="app/layout.tsx" />
      </section>

      <DocsCallout type="tip" title="No CSS scroll-smooth Needed">
        Do not add <code className="font-mono text-xs text-zinc-800">scroll-smooth</code> or <code className="font-mono text-xs text-zinc-800">scroll-behavior: smooth</code> to your <code className="font-mono text-xs text-zinc-800">&lt;html&gt;</code> tag in CSS. ScrollCraft manages the RAF loop and subpixel interpolation directly.
      </DocsCallout>

      <section id="provider-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          ScrollProvider API Reference
        </h2>
        <DocsTable props={PROVIDER_PROPS} />
      </section>
    </div>
  );
};
