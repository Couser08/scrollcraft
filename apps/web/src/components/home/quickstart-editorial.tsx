'use client';

/**
 * Luminous Editorial Quickstart Section
 * 3-step technical setup guide with tokenized CodeViewer syntax highlighting.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Terminal, Copy, Check } from 'lucide-react';

const STEP_2_CODE = `// app/layout.tsx
import { ScrollProvider } from '@scrollcraft/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider smooth={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}`;

const STEP_3_CODE = `// components/card.tsx
import { Parallax, Reveal } from '@scrollcraft/react';

export function ProductFeature() {
  return (
    <Reveal asChild direction="up" distance={20}>
      <Parallax asChild speed={0.15}>
        <div className="card">
          <h3>120 FPS Direct GPU Motion</h3>
        </div>
      </Parallax>
    </Reveal>
  );
}`;

export const QuickstartEditorial: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText('pnpm add @scrollcraft/react');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Quickstart.
          </h2>
          <p className="text-zinc-600 text-base mt-2">
            Add high-performance scroll experiences to your Next.js application in under two minutes.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Install */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-mono text-sm font-bold text-zinc-950">
                1. Install package
              </h3>
              <button
                onClick={copyInstall}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-mono cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-800">
              <Terminal className="w-4 h-4 text-blue-600 shrink-0" />
              <span>pnpm add @scrollcraft/react</span>
            </div>
          </div>

          {/* Step 2: Next.js Root Layout */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-mono text-sm font-bold text-zinc-950 mb-3">
              2. Wrap Root Layout with ScrollProvider
            </h3>
            <CodeViewer code={STEP_2_CODE} fileName="app/layout.tsx" />
          </div>

          {/* Step 3: Compose with Primitives */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-mono text-sm font-bold text-zinc-950 mb-3">
              3. Compose primitives onto your UI
            </h3>
            <CodeViewer code={STEP_3_CODE} fileName="components/card.tsx" />
          </div>
        </div>
      </div>
    </section>
  );
};
