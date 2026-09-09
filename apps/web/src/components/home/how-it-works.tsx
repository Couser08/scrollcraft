'use client';

/**
 * "How It Works" Section with interactive browser mockup & timeline
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HowItWorksDoodle } from '@/components/ui/doodle-arrow';
import { HOW_IT_WORKS_DATA } from '@/data/home-redesign.data';

export const HowItWorks: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState('Hero');

  return (
    <section id="how-it-works" className="w-full py-20 sm:py-28 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: 4-Step Process & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-zinc-200/80 bg-zinc-50 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-4">
              {HOW_IT_WORKS_DATA.badge}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight mb-4">
              <span>{HOW_IT_WORKS_DATA.headlinePart1}</span>
              <br />
              <span>{HOW_IT_WORKS_DATA.headlinePart2}</span>
              <span className="text-blue-600">{HOW_IT_WORKS_DATA.headlineHighlight}</span>
            </h2>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed mb-8">
              {HOW_IT_WORKS_DATA.subtitle}
            </p>

            {/* 4 Step Items */}
            <div className="flex flex-col gap-6 mb-10 w-full">
              {HOW_IT_WORKS_DATA.steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  {/* Step Number Circle */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center shadow-2xs">
                    {step.number}
                  </div>

                  {/* Step Text */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Read the Docs CTA Button */}
            <a
              href="#docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
            >
              <span>Read the Docs</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right Column: Browser Window Mockup + Timeline + Handwritten Doodles */}
          <div className="lg:col-span-7 relative flex items-center justify-center pt-8">
            {/* Top Right Handwritten Doodle */}
            <div className="absolute -top-6 right-2 sm:right-8 z-20">
              <HowItWorksDoodle />
            </div>

            {/* Wrapper for browser + right timeline */}
            <div className="relative w-full max-w-[560px] flex items-center gap-4 sm:gap-6">
              {/* Browser Window Frame */}
              <div className="relative flex-1 rounded-2xl border border-zinc-200/90 bg-white shadow-xl overflow-hidden">
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/70">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  </div>

                  {/* Floating Scroll Trigger Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-semibold text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span>Scroll Trigger</span>
                  </div>
                </div>

                {/* Inner Website Content Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-6 gap-6 items-center bg-zinc-50/30">
                  {/* Left: Architecture Photography */}
                  <div className="relative h-44 sm:h-56 rounded-xl overflow-hidden bg-zinc-100 shadow-2xs">
                    <Image
                      src="/images/how-it-works-arch.jpg"
                      alt="Modern architectural facade"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Right: Modern Content Card */}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-2">
                      Interactive Showcase
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 tracking-tight leading-snug mb-2">
                      Design that moves with you.
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      ScrollCraft helps you create meaningful interactions and delightful experiences.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-zinc-200 text-[11px] font-semibold text-zinc-800 bg-white hover:bg-zinc-50 transition-colors shadow-2xs"
                    >
                      <span>Explore More</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Vertical Scroll Timeline Tracker on Right */}
              <div className="hidden sm:flex flex-col items-center gap-4 py-2 select-none">
                <div className="relative flex flex-col items-start gap-5">
                  {/* Background vertical line */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-zinc-200 -z-10" />

                  {HOW_IT_WORKS_DATA.timelineNodes.map((node) => {
                    const isActive = activeTimeline === node;
                    return (
                      <button
                        key={node}
                        type="button"
                        onClick={() => setActiveTimeline(node)}
                        className="flex items-center gap-2 text-left group cursor-pointer"
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-600 border-blue-600 scale-110 shadow-[0_0_8px_rgba(37,99,235,0.6)]'
                              : 'bg-white border-zinc-400 group-hover:border-zinc-700'
                          }`}
                        />
                        <span
                          className={`text-[11px] font-medium tracking-tight transition-colors ${
                            isActive
                              ? 'text-blue-600 font-bold'
                              : 'text-zinc-500 group-hover:text-zinc-800'
                          }`}
                        >
                          {node}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
