'use client';

/**
 * Luminous Editorial Primitives Section
 * Displays the 4 core primitives with tokenized CodeViewer syntax highlighting.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Layers, Sparkles, Pin as PinIcon, Activity } from 'lucide-react';

interface PrimitiveItem {
  name: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  contract: string;
  code: string;
  fileName: string;
}

const PRIMITIVES: PrimitiveItem[] = [
  {
    name: '<Parallax asChild>',
    badge: 'Direct GPU Translation',
    icon: Layers,
    description:
      'Applies GPU-accelerated translate3d transforms directly to DOM refs in the Ticker render phase, completely bypassing React reconciliation.',
    contract:
      'Zero React re-renders. Automatically zeroes transform if user has prefers-reduced-motion active.',
    fileName: 'parallax-example.tsx',
    code: `import { Parallax } from '@scrollcraft/react';\n\nexport function DeepParallaxCard() {\n  return (\n    <Parallax asChild speed={0.18} direction="vertical">\n      <div className="card">\n        <h3>Subpixel Motion</h3>\n      </div>\n    </Parallax>\n  );\n}`,
  },
  {
    name: '<Reveal asChild>',
    badge: 'Intersection-Driven',
    icon: Sparkles,
    description:
      'Smooth entry transitions triggered when elements reach the viewport threshold, without injecting wrapper div elements.',
    contract:
      'Bypasses opacity and translation jumps immediately if prefers-reduced-motion is active.',
    fileName: 'reveal-example.tsx',
    code: `import { Reveal } from '@scrollcraft/react';\n\nexport function SectionIntro() {\n  return (\n    <Reveal asChild direction="up" distance={24} duration={0.6}>\n      <section className="editorial-content">\n        <h2>Instant Entry</h2>\n      </section>\n    </Reveal>\n  );\n}`,
  },
  {
    name: '<Pin asChild> & <PinContainer>',
    badge: 'Sticky Pinning',
    icon: PinIcon,
    description:
      'Built on native CSS position: sticky to guarantee 100% layout stability without invasive DOM spacer wrappers.',
    contract:
      'Dev diagnostics inspect ancestor tree and log console warnings if any parent has overflow: hidden/auto/scroll.',
    fileName: 'pin-example.tsx',
    code: `import { Pin, PinContainer } from '@scrollcraft/react';\n\nexport function StickyShowcase() {\n  return (\n    <PinContainer height="200vh">\n      <Pin asChild top={80}>\n        <div className="sticky-stage">Sticky Content</div>\n      </Pin>\n    </PinContainer>\n  );\n}`,
  },
  {
    name: '<ScrollProgress asChild>',
    badge: 'Observable Progress',
    icon: Activity,
    description:
      'Binds a ScrollValue observable directly to scaleX transforms for high-performance scroll progress indicators.',
    contract:
      'Zero allocation per frame. Subscribes directly to Lenis scroll limit without triggering React state updates.',
    fileName: 'progress-example.tsx',
    code: `import { ScrollProgress } from '@scrollcraft/react';\n\nexport function ReadingProgressBar() {\n  return (\n    <ScrollProgress asChild>\n      <div className="fixed top-0 inset-x-0 h-1 bg-blue-600 z-50 origin-left" />\n    </ScrollProgress>\n  );\n}`,
  },
];

export const PrimitivesEditorial: React.FC = () => {
  return (
    <section id="primitives" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Four composable primitives.
          </h2>
          <p className="text-zinc-600 text-base mt-3 leading-relaxed">
            Engineered specifically for React 19 and Next.js 15 App Router. No proxy tag factories, no wrapper div pollution.
          </p>
        </div>

        {/* 2x2 Grid with Tokenized CodeViewers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PRIMITIVES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Titlebar */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-mono font-bold text-zinc-950 text-base sm:text-lg">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-zinc-600 text-sm leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="text-xs text-zinc-500 border-l-2 border-blue-600 pl-3 py-0.5 mb-6">
                    <span className="font-semibold text-zinc-800">Contract: </span>
                    {item.contract}
                  </div>
                </div>

                {/* Tokenized Syntax Highlighted Code */}
                <CodeViewer
                  code={item.code}
                  fileName={item.fileName}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
