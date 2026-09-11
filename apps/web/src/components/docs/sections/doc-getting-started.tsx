'use client';

import React, { useState } from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import { PROVIDER_PROPS } from '../docs-data';
import { Check, XCircle, Zap, Layers, Box, Copy } from 'lucide-react';

interface DocGettingStartedProps {
  sectionId: string;
}

const PM_COMMANDS = {
  pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
  npm: 'npm i @scrollcraft/react @scrollcraft/core',
  yarn: 'yarn add @scrollcraft/react @scrollcraft/core',
  bun: 'bun add @scrollcraft/react @scrollcraft/core',
};

const SETUP_CODE_REACT = `// src/App.tsx
import React from 'react';
import { ScrollProvider } from '@scrollcraft/react';
import { Hero } from './components/Hero';

export default function App() {
  return (
    <ScrollProvider
      smooth={true}
      respectReducedMotion={true}
      autoRecalc={true}
    >
      <main className="min-h-screen">
        <Hero />
      </main>
    </ScrollProvider>
  );
}`;

const SETUP_CODE_NEXT = `// app/layout.tsx
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

const QUICK_REACT_CODE = `import { useReveal } from '@scrollcraft/react';

export function Hero() {
  const { ref } = useReveal({
    direction: 'up',
    distance: 40,
    duration: 0.8,
  });

  return (
    <h1 ref={ref} className="text-6xl font-bold tracking-tight text-white">
      Scroll Brings Ideas to Life.
    </h1>
  );
}`;

const QUICK_NEXT_CODE = `'use client';

import { useReveal } from '@scrollcraft/react';

export function Hero() {
  const { ref } = useReveal({
    direction: 'up',
    distance: 40,
    duration: 0.8,
  });

  return (
    <h1 ref={ref} className="text-6xl font-bold tracking-tight text-white">
      Scroll Brings Ideas to Life.
    </h1>
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
      <div className="flex flex-col gap-16">
        {/* Hero Section */}
        <header className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          <div className="flex-1 flex flex-col gap-6 pt-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
              GETTING STARTED
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08]">
              Why ScrollCraft<br />Was Born
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
              ScrollCraft is a modern, React-native scroll animation library built for the next generation of web experiences. It gives you pixel-perfect control over scroll-driven animations — without the re-renders, without the lag, and without the boilerplate.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#quick-example"
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg"
              >
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </a>
              <a
                href="https://github.com/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-200 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                View on GitHub
              </a>
            </div>
          </div>
          <div className="w-full lg:w-72 h-[380px] relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] shadow-2xl flex-shrink-0">
            <div className="absolute inset-0 bg-[url('/images/hero_mountain_dark.jpg')] bg-cover bg-center grayscale opacity-75" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-black/85 backdrop-blur-md border-l border-zinc-800 flex flex-col justify-center items-center py-8">
              <div className="flex flex-col gap-6 text-[10px] font-mono text-zinc-400 tracking-widest writing-vertical-lr rotate-180 h-full justify-between items-center text-center">
                <span className="font-semibold text-zinc-300">SCROLL<br/>ANIMATE<br/>CREATE</span>
                <span className="text-zinc-600">//</span>
                <span className="font-semibold text-zinc-300">BEYOND<br/>LIMITS</span>
              </div>
            </div>
          </div>
        </header>

        {/* The Scroll Problem */}
        <section id="the-problem" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            The Scroll Problem
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Traditional scroll animations in React often rely on scroll event listeners, component state, and frequent re-renders. This leads to poor performance, janky animations, and complex code — especially on resource-constrained devices.
          </p>
          
          <div className="p-6 rounded-2xl border border-rose-950/60 bg-rose-950/15 shadow-xl mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-white">Common Bottlenecks in React</h4>
            </div>
            <ul className="flex flex-col gap-2.5 list-disc list-inside text-sm text-zinc-400 ml-2">
              <li>Janky animations due to main-thread state updates during scroll events</li>
              <li>Layout thrashing and synchronous reflow cycles from geometry polling</li>
              <li>Fragile hook dependency trees that trigger cascading parent re-renders</li>
              <li>Stutter on mobile touch devices and high refresh-rate 120Hz panels</li>
            </ul>
          </div>
        </section>

        {/* The ScrollCraft Solution */}
        <section id="our-architecture" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            The ScrollCraft Solution
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            ScrollCraft uses native scroll bindings, direct GPU compositing, and a declarative API to deliver buttery-smooth animations. No React re-renders. Just pure performance.
          </p>

          <div className="p-6 rounded-2xl border border-emerald-950/60 bg-emerald-950/15 shadow-xl mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Check className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-white">What You Get with ScrollCraft</h4>
            </div>
            <ul className="flex flex-col gap-2.5 list-disc list-inside text-sm text-zinc-300 ml-2">
              <li><strong>Zero React re-renders</strong> during scroll — writes straight to DOM refs</li>
              <li><strong>Rock-solid 120 FPS</strong> compositor performance with subpixel interpolation</li>
              <li><strong>Radix-style Slot composition</strong> with headless <code>asChild</code> pattern</li>
              <li><strong>Seamless stack compatibility</strong> — works with Tailwind, R3F, Framer Motion</li>
            </ul>
          </div>
        </section>

        {/* Core Principles */}
        <section id="core-principles" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Core Principles
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Everything in ScrollCraft is built around three non-negotiable architectural pillars.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-[#0b0b0e] shadow-xl flex flex-col gap-4 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Performance First</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Direct compositor writes. 3-phase execution loop. Zero layout thrashing.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-[#0b0b0e] shadow-xl flex flex-col gap-4 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Developer Experience</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  A simple, declarative API that feels native to modern React & Next.js.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-[#0b0b0e] shadow-xl flex flex-col gap-4 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Flexible & Composable</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Headless primitives you can drop into any design system or animation stack.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Example with Working Tabs & Live Split Preview */}
        <section id="quick-example" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            A Quick Example
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Create a hardware-accelerated scroll reveal in just a few lines of code. Toggle between React and Next.js below:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Code Viewer with Active Tabs & Working Copy */}
            <div className="lg:col-span-7 flex flex-col">
              <CodeViewer
                tabs={[
                  { label: 'React', code: QUICK_REACT_CODE, fileName: 'src/Hero.tsx' },
                  { label: 'Next.js', code: QUICK_NEXT_CODE, fileName: 'app/components/Hero.tsx' },
                ]}
              />
            </div>

            {/* Right Live Preview Box */}
            <div className="lg:col-span-5 rounded-xl border border-zinc-800/80 bg-[#0b0b0e] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[320px] shadow-2xl">
              <div className="absolute inset-0 bg-[url('/images/cinematic_landscape.jpg')] bg-cover bg-center grayscale opacity-25" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wider">
                  LIVE COMPONENT PREVIEW
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Scroll<br />Brings Ideas<br />to Life.
                </h3>
                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono tracking-widest text-blue-400 font-semibold mt-2">
                  120 FPS SUBPIXEL REVEAL
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section id="whats-next" className="flex flex-col gap-6 pt-12 border-t border-zinc-800/80">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            What&apos;s Next?
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Now that you understand the mental model, let&apos;s install ScrollCraft in your project and configure the Root Provider.
          </p>
        </section>
      </div>
    );
  }

  if (sectionId === 'installation') {
    return (
      <div className="flex flex-col gap-16">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            GETTING STARTED
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08]">
            Installation
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Install the core and React packages into your project using your preferred package manager.
          </p>
        </header>

        <section id="install-package" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Choose Package Manager
          </h2>

          <div className="rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0d0d10] border-b border-zinc-800/80">
              <div className="flex items-center gap-1.5 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800/80">
                {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setSelectedPm(pm)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedPm === pm
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyPm}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono transition-all cursor-pointer shadow-xs active:scale-95 ${
                  copiedPm
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                {copiedPm ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-[#060608] text-white font-mono text-sm border-t border-zinc-900">
              <span className="text-blue-400 font-bold mr-3 select-none">$</span>
              <span className="select-all font-medium text-zinc-200">{PM_COMMANDS[selectedPm]}</span>
            </div>
          </div>
        </section>

        <section id="requirements" className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            System Requirements
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-xl">
            <table className="w-full text-left text-sm border-collapse">
              <tbody className="divide-y divide-zinc-800/60">
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 px-6 text-zinc-400 font-medium">React Version</td>
                  <td className="py-4 px-6 font-mono font-bold text-white">^18.0.0 || ^19.0.0</td>
                </tr>
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 px-6 text-zinc-400 font-medium">Next.js (Recommended)</td>
                  <td className="py-4 px-6 font-mono font-bold text-white">^14.0.0 || ^15.0.0 (App Router)</td>
                </tr>
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 px-6 text-zinc-400 font-medium">TypeScript</td>
                  <td className="py-4 px-6 font-mono font-bold text-white">&gt;= 5.0</td>
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
    <div className="flex flex-col gap-16">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
          GETTING STARTED
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08]">
          Next.js App Router Setup
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
          Wrap your root layout or React application tree with ScrollProvider to initialize inertia normalization, route leak prevention, and the 3-phase ticker.
        </p>
      </header>

      <section id="provider-setup" className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Root Layout Integration
        </h2>
        <CodeViewer
          tabs={[
            { label: 'Next.js App Router', code: SETUP_CODE_NEXT, fileName: 'app/layout.tsx' },
            { label: 'React (Vite / CRA)', code: SETUP_CODE_REACT, fileName: 'src/App.tsx' },
          ]}
        />
      </section>

      <section id="provider-props" className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          ScrollProvider Configuration
        </h2>
        <DocsTable title="Provider Props" props={PROVIDER_PROPS} />
      </section>

      <DocsCallout type="note" title="Zero Re-render Provider">
        <code className="font-mono text-xs text-blue-400">&lt;ScrollProvider&gt;</code> does not pass scroll coordinates via React Context values. Instead, it acts as a lightweight dependency injector for the global Ticker, ensuring your root layout component never re-renders during user scrolling.
      </DocsCallout>
    </div>
  );
};
