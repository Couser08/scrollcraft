'use client';

/**
 * Single install moment — one surface, three steps (not a card farm).
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { Check, Copy, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 'install', label: 'Install', code: 'npm add @scrollcraft/react' },
  {
    id: 'wrap',
    label: 'Wrap',
    code: `<ScrollProvider smooth>\n  {children}\n</ScrollProvider>`,
  },
  {
    id: 'compose',
    label: 'Compose',
    code: `<Parallax asChild speed={0.15}>\n  <YourComponent />\n</Parallax>`,
  },
] as const;

export function InstallMoment() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const step = STEPS[active];

  const copy = () => {
    navigator.clipboard.writeText(step.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="w-full bg-[#FAFAF9] border-t border-[#E7E5E4] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal asChild direction="up" distance={14}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A]">
                Ship in minutes.
              </h2>
              <p className="mt-3 text-base text-[#78716C] leading-relaxed">
                One install path. Motion stays on the compositor.
              </p>
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5A1F] hover:text-[#E54800]"
            >
              Full documentation
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal asChild direction="up" distance={16} delay={0.05}>
          <div className="rounded-[14px] border border-[#E7E5E4] bg-[#0A0A0A] overflow-hidden shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-3 sm:px-4 pt-3">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setCopied(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-t-[8px] transition-colors ${
                    active === i
                      ? 'bg-white/10 text-white'
                      : 'text-white/45 hover:text-white/75'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#FF5A1F] mr-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={copy}
                className="ml-auto mb-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-white/55 hover:text-white hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 sm:p-6 text-[13px] sm:text-sm font-mono text-[#E7E5E4] leading-relaxed overflow-x-auto m-0 min-h-[140px]">
              <code>{step.code}</code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
