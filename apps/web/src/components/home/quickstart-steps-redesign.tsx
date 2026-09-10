'use client';

/**
 * "Get started in minutes." Quickstart Steps Section
 * Pixel-perfect implementation of Image 2 Section 5.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';
import { Reveal } from '@scrollcraft/react';

const STEP_2_CODE = `<ScrollProvider smooth>
  {children}
</ScrollProvider>`;

const STEP_3_CODE = `<Parallax asChild>
  <YourComponent />
</Parallax>`;

export const QuickstartStepsRedesign: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <section id="quickstart" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E7EB]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Get started in minutes.
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
            Add high-performance scroll experiences to your Next.js application in under two minutes.
          </p>
        </div>

        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-2xs self-start md:self-auto group"
        >
          <span>Read the full docs</span>
          <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Install Package */}
        <Reveal asChild direction="up" distance={16} delay={0.05}>
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Step Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                  Install package
                </h3>
              </div>

              {/* Terminal Snippet Box */}
              <div className="rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3.5 flex items-center justify-between font-mono text-xs text-[#0A0A0A]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Terminal className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                  <span className="truncate">npm add @scrollcraft/react</span>
                </div>
                <button
                  onClick={() => copyToClipboard('npm add @scrollcraft/react', 1)}
                  className="p-1 rounded text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors shrink-0 ml-2"
                  title="Copy command"
                >
                  {copiedStep === 1 ? (
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Step 2: Wrap Layout */}
        <Reveal asChild direction="up" distance={16} delay={0.1}>
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Step Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                  Wrap your layout
                </h3>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3.5 flex items-center justify-between font-mono text-xs text-[#0A0A0A]">
                <pre className="text-xs leading-relaxed text-[#0A0A0A] overflow-x-auto">
                  <code>
                    &lt;<span className="text-[#2563EB] font-semibold">ScrollProvider</span>{' '}
                    <span className="text-[#EA580C]">smooth</span>&gt;{'\n'}
                    {'  '}&#123;children&#125;{'\n'}
                    &lt;/<span className="text-[#2563EB] font-semibold">ScrollProvider</span>&gt;
                  </code>
                </pre>
                <button
                  onClick={() => copyToClipboard(STEP_2_CODE, 2)}
                  className="p-1 rounded text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors shrink-0 ml-2 self-start"
                  title="Copy code"
                >
                  {copiedStep === 2 ? (
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Step 3: Compose Primitives */}
        <Reveal asChild direction="up" distance={16} delay={0.15}>
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Step Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                  Compose primitives
                </h3>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3.5 flex items-center justify-between font-mono text-xs text-[#0A0A0A]">
                <pre className="text-xs leading-relaxed text-[#0A0A0A] overflow-x-auto">
                  <code>
                    &lt;<span className="text-[#FF5A1F] font-semibold">Parallax</span>{' '}
                    <span className="text-[#EA580C]">asChild</span>&gt;{'\n'}
                    {'  '}&lt;<span className="text-[#0284C7] font-semibold">YourComponent</span> /&gt;{'\n'}
                    &lt;/<span className="text-[#FF5A1F] font-semibold">Parallax</span>&gt;
                  </code>
                </pre>
                <button
                  onClick={() => copyToClipboard(STEP_3_CODE, 3)}
                  className="p-1 rounded text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors shrink-0 ml-2 self-start"
                  title="Copy code"
                >
                  {copiedStep === 3 ? (
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
