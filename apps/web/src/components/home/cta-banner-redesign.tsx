'use client';

/**
 * Home CTA — magnetic actions + Reveal.
 * Strictly under 650 LOC.
 */

import React from 'react';
import Link from 'next/link';
import { Reveal, useMagnetic } from '@scrollcraft/react';
import { Sparkles } from 'lucide-react';

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const { ref } = useMagnetic({ strength: 0.22, radius: 85, stiffness: 0.2, damping: 0.7 });
  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={`${className} will-change-transform`}
    >
      {children}
    </Link>
  );
}

export const CtaBannerRedesign: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal asChild direction="up" distance={16}>
        <div className="rounded-2xl bg-[#FFF4ED] border border-[#FFEDD5] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
              Ready to craft the scroll?
            </h3>
            <p className="text-sm sm:text-base text-[#78716C] mt-2 leading-relaxed">
              Read the docs or tune physics live in the playground — same engine you just scrolled.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <MagneticLink
              href="/docs"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1C1917] text-white font-semibold text-sm transition-colors shadow-sm"
            >
              View Documentation
            </MagneticLink>
            <MagneticLink
              href="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAFAF9] border border-[#E7E5E4] text-[#0A0A0A] font-semibold text-sm transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
              <span>Try Playground</span>
            </MagneticLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
