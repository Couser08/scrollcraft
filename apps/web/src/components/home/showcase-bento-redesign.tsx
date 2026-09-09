'use client';

/**
 * "See what you can build." Bento Showcase Section
 * Pixel-perfect implementation of Image 2 Section 3.
 * Strictly under 650 LOC.
 * Uses CSS 3D transforms for buttery 120 FPS GPU compositor rendering.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, ChevronRight } from 'lucide-react';
import { Reveal, Parallax } from '@scrollcraft/react';

export const ShowcaseBentoRedesign: React.FC = () => {
  return (
    <section id="showcase" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E7EB]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            See what you can build.
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
            A few real-world examples to get you started. More examples are available in the Playground.
          </p>
        </div>

        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-colors shadow-2xs self-start md:self-auto group"
        >
          <span>Explore all examples</span>
          <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Bento Grid: 1 Large Left Card + 4 Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ================= LEFT FEATURED CARD: KINETIC CARDS ================= */}
        <Reveal asChild direction="up" distance={20}>
          <div className="lg:col-span-6 rounded-3xl bg-[#0A0A0A] border border-[#262626] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[440px] group">
            {/* Top: Featured Badge */}
            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262626] border border-[#333333] text-[11px] font-semibold text-[#FF5A1F]">
                <Star className="w-3 h-3 fill-[#FF5A1F]" />
                <span>Featured</span>
              </span>
            </div>

            {/* Center: 3D Fanned Kinetic Mountain Cards with Perspective Tilt */}
            <div className="relative w-full h-56 flex items-center justify-center [perspective:1000px] select-none my-4">
              {/* Back Card 3 */}
              <Parallax asChild speed={-0.08}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div
                    className="relative w-44 h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 opacity-40 transition-transform duration-500 ease-out group-hover:rotate-[-24deg] group-hover:translate-x-[-48px] group-hover:scale-95 pointer-events-auto"
                    style={{
                      transform: 'rotate(-16deg) translateX(-32px) translateZ(-60px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Image src="/images/cta-mountains.jpg" alt="Background mountain card" fill sizes="180px" className="object-cover brightness-50" />
                  </div>
                </div>
              </Parallax>

              {/* Middle Card 2 */}
              <Parallax asChild speed={0.03}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="relative w-48 h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/15 opacity-75 transition-transform duration-500 ease-out group-hover:rotate-[-10deg] group-hover:translate-x-[-16px] group-hover:scale-100 pointer-events-auto"
                    style={{
                      transform: 'rotate(-7deg) translateX(-12px) translateZ(-20px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Image src="/images/hero-mountain.jpg" alt="Mid-layer mountain card" fill sizes="200px" className="object-cover brightness-75" />
                  </div>
                </div>
              </Parallax>

              {/* Front Card 1 */}
              <Parallax asChild speed={0.15}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div
                    className="relative w-52 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/25 transition-transform duration-500 ease-out group-hover:rotate-[6deg] group-hover:translate-x-[20px] group-hover:scale-105 pointer-events-auto"
                    style={{
                      transform: 'rotate(5deg) translateX(14px) translateZ(20px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Image src="/images/hero-mountain.jpg" alt="Kinetic Card front" fill sizes="220px" priority className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>
              </Parallax>
            </div>

            {/* Bottom Info & Action */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10 pt-4 border-t border-[#262626]">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Kinetic Cards
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Parallax cards with smooth, natural motion.
                </p>
              </div>

              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#333333] hover:border-white/40 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <span>View example</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ================= RIGHT 4 CARDS (2x2 GRID) ================= */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Scroll Reveal */}
          <Reveal asChild direction="up" distance={16} delay={0.05}>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all group">
              {/* Preview Graphics: Staggered Skeleton Bars */}
              <div className="h-24 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3 flex flex-col justify-center gap-2 mb-4 overflow-hidden">
                <div className="w-20 h-3 rounded-md bg-[#D1D5DB]/80 group-hover:translate-x-1 transition-transform" />
                <div className="w-32 h-2.5 rounded-md bg-[#E5E7EB] group-hover:translate-x-2 transition-transform delay-75" />
                <div className="w-24 h-2 rounded-md bg-[#F3F4F6] group-hover:translate-x-3 transition-transform delay-150" />
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#FF5A1F] transition-colors">
                    Scroll Reveal
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Staggered content animations.
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-[#E5E7EB] bg-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-white flex items-center justify-center text-[#6B7280] transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Pinned Sections */}
          <Reveal asChild direction="up" distance={16} delay={0.1}>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all group">
              {/* Preview Graphics: Sticky Column Miniature */}
              <div className="h-24 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3 flex items-center gap-2.5 mb-4 overflow-hidden">
                <div className="w-8 h-16 rounded-md bg-[#E5E7EB] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-full h-2.5 rounded bg-[#D1D5DB]" />
                  <div className="w-4/5 h-2 rounded bg-[#E5E7EB]" />
                  <div className="w-3/5 h-2 rounded bg-[#F3F4F6]" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#FF5A1F] transition-colors">
                    Pinned Sections
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Sticky elements with zero layout shift.
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-[#E5E7EB] bg-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-white flex items-center justify-center text-[#6B7280] transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 3: Scroll Progress */}
          <Reveal asChild direction="up" distance={16} delay={0.15}>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all group">
              {/* Preview Graphics: Timeline & Progress Track */}
              <div className="h-24 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-3 flex flex-col justify-center gap-2.5 mb-4 overflow-hidden">
                <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full w-2/3 bg-[#FF5A1F] rounded-full group-hover:w-full transition-all duration-700 ease-out" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#6B7280] font-mono">
                  <span>Start</span>
                  <span className="text-[#FF5A1F] font-semibold">67%</span>
                  <span>End</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#FF5A1F] transition-colors">
                    Scroll Progress
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Progress indicators &amp; timelines.
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-[#E5E7EB] bg-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-white flex items-center justify-center text-[#6B7280] transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 4: Interactive Gallery */}
          <Reveal asChild direction="up" distance={16} delay={0.2}>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all group">
              {/* Preview Graphics: 4 Mini Image Thumbnails */}
              <div className="h-24 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB] p-2 flex items-center gap-1.5 mb-4 overflow-hidden">
                <div className="relative flex-1 h-20 rounded-md overflow-hidden bg-zinc-200">
                  <Image src="/images/example-gallery.jpg" alt="Gallery thumb 1" fill sizes="60px" className="object-cover" />
                </div>
                <div className="relative flex-1 h-20 rounded-md overflow-hidden bg-zinc-200">
                  <Image src="/images/example-3d.jpg" alt="Gallery thumb 2" fill sizes="60px" className="object-cover" />
                </div>
                <div className="relative flex-1 h-20 rounded-md overflow-hidden bg-zinc-200">
                  <Image src="/images/example-horizontal.jpg" alt="Gallery thumb 3" fill sizes="60px" className="object-cover" />
                </div>
                <div className="relative flex-1 h-20 rounded-md overflow-hidden bg-zinc-200">
                  <Image src="/images/example-stagger.jpg" alt="Gallery thumb 4" fill sizes="60px" className="object-cover" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#FF5A1F] transition-colors">
                    Interactive Gallery
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    A scroll-driven image experience.
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-[#E5E7EB] bg-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-white flex items-center justify-center text-[#6B7280] transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
