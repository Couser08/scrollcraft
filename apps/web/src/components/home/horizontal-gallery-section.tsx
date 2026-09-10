'use client';

/**
 * Horizontal scrub gallery — Vertical scroll drives HorizontalScrollSolver.
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HorizontalScroll, Reveal, Parallax } from '@scrollcraft/react';
import { ChevronRight } from 'lucide-react';

const PANELS = [
  {
    title: 'Kinetic depth',
    blurb: 'Nested Parallax layers on real media.',
    image: '/images/hero-mountain.jpg',
    href: '/docs',
    tag: 'Parallax',
  },
  {
    title: 'Reveal editorial',
    blurb: 'Staggered enter without motion wrappers.',
    image: '/images/example-stagger.jpg',
    href: '/docs',
    tag: 'Reveal',
  },
  {
    title: 'Pinned narrative',
    blurb: 'Sticky chapters with scrubbed timelines.',
    image: '/images/example-scale.jpg',
    href: '/docs',
    tag: 'Pin',
  },
  {
    title: 'Velocity type',
    blurb: 'Marquee that reacts to scroll speed.',
    image: '/images/example-horizontal.jpg',
    href: '/playground',
    tag: 'Marquee',
  },
  {
    title: '3D bridge',
    blurb: 'R3F pulls metrics without a second RAF.',
    image: '/images/example-3d.jpg',
    href: '/docs',
    tag: 'R3F',
  },
] as const;

export const HorizontalGallerySection: React.FC = () => {
  return (
    <section id="showcase" className="w-full border-t border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal asChild direction="up" distance={16}>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A1F] mb-2">
                  HorizontalScroll
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
                  See what you can build.
                </h2>
                <p className="text-sm sm:text-base text-[#78716C] mt-2 leading-relaxed">
                  Keep scrolling — vertical input scrubs this gallery sideways.
                </p>
              </div>
            </Reveal>
          </div>
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F5F5F4] border border-[#E7E5E4] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-sm self-start md:self-auto group"
          >
            <span>Open Playground</span>
            <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <HorizontalScroll speed={2.2} className="w-full" innerClassName="gap-6 px-4 sm:px-6 lg:px-8 items-stretch">
        {PANELS.map((panel) => (
          <article
            key={panel.title}
            className="relative w-[min(82vw,420px)] h-[70vh] max-h-[560px] shrink-0 rounded-2xl overflow-hidden border border-[#E7E5E4] bg-[#1C1917] shadow-md"
          >
            <Parallax asChild speed={0.12} min={-30} max={30}>
              <div className="absolute -inset-y-10 inset-x-0 will-change-transform">
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  sizes="420px"
                  className="object-cover opacity-90"
                />
              </div>
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 z-10">
              <span className="inline-flex px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono text-[#FF5A1F]">
                {panel.tag}
              </span>
              <h3 className="text-2xl font-bold text-white mt-3 tracking-tight">{panel.title}</h3>
              <p className="text-sm text-zinc-300 mt-1.5">{panel.blurb}</p>
              <Link
                href={panel.href}
                className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-white hover:text-[#FF5A1F] transition-colors"
              >
                Explore
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </HorizontalScroll>
    </section>
  );
};
