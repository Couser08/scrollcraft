'use client';

/**
 * Editorial Architecture Comparison Section
 * Clean, technical side-by-side comparison of scroll architectures.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export const BenchmarkEditorial: React.FC = () => {
  const features = [
    {
      feature: 'Native Sticky Positioning (position: sticky)',
      hijacked: false,
      cssDriven: true,
      scrollcraft: true,
    },
    {
      feature: 'Full Browser Accessibility & Keyboard Scroll',
      hijacked: false,
      cssDriven: true,
      scrollcraft: true,
    },
    {
      feature: 'Native Browser Find-in-Page (Ctrl+F)',
      hijacked: false,
      cssDriven: true,
      scrollcraft: true,
    },
    {
      feature: 'Cross-Browser Support Today (Safari, Chrome, Firefox)',
      hijacked: true,
      cssDriven: false,
      scrollcraft: true,
    },
    {
      feature: 'Zero React Re-Renders during Scroll (Direct DOM)',
      hijacked: false,
      cssDriven: true,
      scrollcraft: true,
    },
    {
      feature: 'asChild Slot Composition (Zero Wrapper Divs)',
      hijacked: false,
      cssDriven: false,
      scrollcraft: true,
    },
    {
      feature: 'Next.js App Router Native Auto-Resize & Route Safety',
      hijacked: false,
      cssDriven: false,
      scrollcraft: true,
    },
  ];

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Engine architecture compared.
          </h2>
          <p className="text-zinc-600 text-base mt-3 leading-relaxed">
            Why ScrollCraft chooses native-scroll-wrap over hijacked virtual scroll and unpolyfilled CSS scroll-timelines.
          </p>
        </div>

        {/* Clean Architectural Comparison Table */}
        <div className="rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-mono">
                  <th className="py-4 px-6 font-semibold text-zinc-900">Architecture Capabilities</th>
                  <th className="py-4 px-4 font-semibold text-zinc-500 text-center">Virtual / Hijacked</th>
                  <th className="py-4 px-4 font-semibold text-zinc-500 text-center">Pure CSS Timeline</th>
                  <th className="py-4 px-6 font-semibold text-blue-700 bg-blue-50/60 text-center">
                    ScrollCraft (Native-Wrap)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-sans">
                {features.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-zinc-900 text-xs sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.hijacked ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.cssDriven ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-amber-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-blue-50/30">
                      <Check className="w-4 h-4 text-blue-600 mx-auto stroke-[2.5]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
