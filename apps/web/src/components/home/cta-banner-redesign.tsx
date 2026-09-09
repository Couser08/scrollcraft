'use client';

/**
 * Warm CTA Banner Section
 * Pixel-perfect implementation of Image 2 Section 6.
 * Strictly under 650 LOC.
 */

import React from 'react';
import Link from 'next/link';
import { GithubIcon } from '@/components/ui/social-icons';
import { Reveal } from '@scrollcraft/react';

export const CtaBannerRedesign: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal asChild direction="up" distance={16}>
        <div className="rounded-3xl bg-[#FFF7ED] border border-[#FED7AA] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          {/* Left Text */}
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
              Ready to build something amazing?
            </h3>
            <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
              Explore the documentation, try the playground, or give us a star on GitHub.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            {/* View Documentation Button */}
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-zinc-800 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              View Documentation
            </Link>

            {/* Star on GitHub Button */}
            <a
              href="https://github.com/Couser08/scrollcraft"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAFAF9] border border-[#E5E7EB] text-[#0A0A0A] font-semibold text-sm transition-colors shadow-2xs"
            >
              <GithubIcon className="w-4 h-4 text-[#0A0A0A]" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
