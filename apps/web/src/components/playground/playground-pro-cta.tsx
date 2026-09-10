'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Code2, Layers } from 'lucide-react';

export const PlaygroundProCta: React.FC = () => {
  return (
    <div className="w-full rounded-3xl bg-[#0e0f14] text-white p-8 sm:p-10 border border-zinc-800 shadow-2xl relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#FF5A1F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Copy */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF5A1F]">
            <Sparkles className="w-3.5 h-3.5 fill-[#FF5A1F]" />
            <span>ScrollCraft Pro Kit • Commercial License</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Loved the sandbox? Ship 60+ Awwwards-tier interactions in minutes.
          </h3>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Copy-paste production-tested scroll recipes directly into your Next.js 15 & React 19 apps. Includes 3D Apple-style device scrubbers, pinned rails, velocity marquees, and stacked card decks with full source code.
          </p>

          {/* Key Value Points */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Zero-Jank 120 FPS</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Full Source Code</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lifetime Updates</span>
            </div>
          </div>
        </div>

        {/* Right Action Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-bold text-sm tracking-tight transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 group"
          >
            <span>Get the Pro Kit</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="text-[11px] text-zinc-400 text-center lg:text-right font-mono">
            One-time purchase • No recurring subscriptions
          </div>
        </div>
      </div>
    </div>
  );
};
