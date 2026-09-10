'use client';

/**
 * Quickstart — three calm connected steps.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { Check, Copy, ChevronRight } from 'lucide-react';
import { SectionShell, btnSecondary } from './section-shell';

const STEPS = [
  {
    title: 'Install',
    code: 'npm add @scrollcraft/react',
  },
  {
    title: 'Wrap your app',
    code: `<ScrollProvider smooth>\n  {children}\n</ScrollProvider>`,
  },
  {
    title: 'Compose',
    code: `<Parallax asChild speed={0.15}>\n  <YourComponent />\n</Parallax>`,
  },
] as const;

export function QuickstartV2() {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <SectionShell
      id="quickstart"
      index="03"
      label="Quickstart"
      title="Ship in minutes."
      description="Three steps to a scroll experience that stays off the React render path."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} asChild direction="up" distance={14} delay={i * 0.06}>
            <article className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 flex flex-col min-h-[200px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-mono text-[#A8A29E] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => copy(step.code, i)}
                  className="p-1.5 rounded-md text-[#A8A29E] hover:text-[#0A0A0A] hover:bg-[#F5F5F4] transition-colors"
                  aria-label={`Copy ${step.title}`}
                >
                  {copied === i ? (
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <h3 className="text-base font-semibold text-[#0A0A0A]">{step.title}</h3>
              <pre className="mt-3 flex-1 text-[11px] sm:text-xs font-mono text-[#44403C] leading-relaxed whitespace-pre-wrap">
                {step.code}
              </pre>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/docs" className={btnSecondary}>
          Full documentation
          <ChevronRight className="w-4 h-4 text-[#78716C]" />
        </Link>
      </div>
    </SectionShell>
  );
}
