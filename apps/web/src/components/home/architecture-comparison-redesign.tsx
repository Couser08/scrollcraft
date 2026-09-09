'use client';

/**
 * "Engine architecture compared." Section
 * Pixel-perfect implementation of Image 2 Section 4.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { Reveal } from '@scrollcraft/react';

interface ComparisonRow {
  capability: string;
  virtual: boolean;
  pureCss: boolean | 'partial';
  scrollcraft: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    capability: 'Native Sticky Positioning (position: sticky)',
    virtual: false,
    pureCss: true,
    scrollcraft: true,
  },
  {
    capability: 'Full Browser Accessibility & Keyboard Scroll',
    virtual: false,
    pureCss: true,
    scrollcraft: true,
  },
  {
    capability: 'Native Browser Find-in-Page (Ctrl+F)',
    virtual: false,
    pureCss: true,
    scrollcraft: true,
  },
  {
    capability: 'Cross-Browser Support (Safari, Chrome, Firefox)',
    virtual: true,
    pureCss: 'partial',
    scrollcraft: true,
  },
  {
    capability: 'Zero React Re-Renders during Scroll (Direct DOM)',
    virtual: false,
    pureCss: true,
    scrollcraft: true,
  },
  {
    capability: 'asChild Slot Composition (Zero Wrapper Divs)',
    virtual: false,
    pureCss: 'partial',
    scrollcraft: true,
  },
  {
    capability: 'Next.js App Router Native Auto-Resize & Route Safety',
    virtual: false,
    pureCss: 'partial',
    scrollcraft: true,
  },
];

export const ArchitectureComparisonRedesign: React.FC = () => {
  return (
    <section id="architecture" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E7EB]">
      {/* Section Header */}
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
          Engine architecture compared.
        </h2>
        <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
          A clear comparison of what makes ScrollCraft different.
        </p>
      </div>

      {/* 2-Column Grid: Comparison Table + Modern Stack Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Comparison Matrix Table (7 cols) */}
        <Reveal asChild direction="up" distance={16}>
          <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E7EB] text-[11px] sm:text-xs font-mono">
                    <th className="py-3.5 px-4 sm:px-6 font-semibold text-[#0A0A0A]">
                      Architecture Capabilities
                    </th>
                    <th className="py-3.5 px-2.5 sm:px-4 font-semibold text-[#6B7280] text-center whitespace-nowrap">
                      Virtual / Hijacked
                    </th>
                    <th className="py-3.5 px-2.5 sm:px-4 font-semibold text-[#6B7280] text-center whitespace-nowrap">
                      Pure CSS Timeline
                    </th>
                    <th className="py-3.5 px-3 sm:px-5 font-bold text-[#2563EB] bg-[#EFF6FF]/70 text-center whitespace-nowrap border-l border-[#DBEAFE]">
                      ScrollCraft (Native-Wrap)
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E7EB] font-sans">
                  {COMPARISON_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFAF9]/80 transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-medium text-[#0A0A0A] text-xs leading-snug">
                        {row.capability}
                      </td>

                      {/* Virtual / Hijacked */}
                      <td className="py-3 px-2.5 sm:px-4 text-center">
                        {row.virtual ? (
                          <Check className="w-4 h-4 text-[#16A34A] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#EF4444] mx-auto" />
                        )}
                      </td>

                      {/* Pure CSS Timeline */}
                      <td className="py-3 px-2.5 sm:px-4 text-center">
                        {row.pureCss === true ? (
                          <Check className="w-4 h-4 text-[#16A34A] mx-auto" />
                        ) : row.pureCss === 'partial' ? (
                          <Minus className="w-4 h-4 text-[#F59E0B] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#EF4444] mx-auto" />
                        )}
                      </td>

                      {/* ScrollCraft Native-Wrap (Highlighted Column) */}
                      <td className="py-3 px-3 sm:px-5 text-center bg-[#EFF6FF]/30 border-l border-[#DBEAFE]">
                        <Check className="w-4 h-4 text-[#2563EB] mx-auto stroke-[2.5]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Right Column: "Built for the modern React stack." Card (5 cols) */}
        <Reveal asChild direction="up" distance={16} delay={0.1}>
          <div className="lg:col-span-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF9] p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-sm relative overflow-hidden">
            {/* Top 3D Floating Translucent Glass Layers Illustration */}
            <div className="relative w-full h-44 flex items-center justify-center my-2 select-none">
              {/* Layer 1 (Back) */}
              <div
                className="absolute w-36 h-28 rounded-xl bg-gradient-to-br from-[#FF5A1F]/30 to-[#FF5A1F]/10 border border-[#FF5A1F]/30 shadow-lg backdrop-blur-xs"
                style={{
                  transform: 'rotate(-25deg) skewX(10deg) translate(-28px, -18px)',
                }}
              />
              {/* Layer 2 (Middle) */}
              <div
                className="absolute w-40 h-32 rounded-xl bg-gradient-to-br from-[#FF5A1F]/40 to-[#FF5A1F]/15 border border-[#FF5A1F]/40 shadow-xl backdrop-blur-xs"
                style={{
                  transform: 'rotate(-25deg) skewX(10deg) translate(0px, 0px)',
                }}
              />
              {/* Layer 3 (Front) */}
              <div
                className="relative w-44 h-36 rounded-xl bg-gradient-to-br from-white/90 via-[#FFF7ED]/80 to-[#FFEDD5]/60 border border-[#FF5A1F]/50 shadow-2xl backdrop-blur-md flex items-center justify-center"
                style={{
                  transform: 'rotate(-25deg) skewX(10deg) translate(28px, 18px)',
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF5A1F] flex items-center justify-center text-white shadow-sm">
                  <span className="font-bold text-sm">SC</span>
                </div>
              </div>
            </div>

            {/* Text Copy */}
            <div className="mt-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0A] tracking-tight">
                Built for the <br className="hidden sm:inline" />
                modern React stack.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-2 max-w-xs mx-auto leading-relaxed">
                Designed to work seamlessly with the tools you already use.
              </p>
            </div>

            {/* Ecosystem Logos Row: React, Next.js, TypeScript, Tailwind */}
            <div className="grid grid-cols-4 gap-4 w-full pt-4 border-t border-[#E5E7EB]">
              {/* React */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#06B6D4] shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2" />
                    <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-[#0A0A0A]">React</span>
              </div>

              {/* Next.js */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#0A0A0A] shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15.5 16.5L9.5 8V16" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-[#0A0A0A]">Next.js</span>
              </div>

              {/* TypeScript */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-[#3178C6] flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                  TS
                </div>
                <span className="text-[11px] font-semibold text-[#0A0A0A]">TypeScript</span>
              </div>

              {/* Tailwind */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#38BDF8] shadow-2xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-[#0A0A0A]">Tailwind</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
