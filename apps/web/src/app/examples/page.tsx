import type { Metadata } from 'next';
import React from 'react';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';

import { HeaderNav } from '@/components/layout/header-nav';

export const metadata: Metadata = {
  title: 'See ScrollCraft in Action — Examples & Showcase',
  description:
    'Three interactive examples. Real performance. Zero compromises. Explore native ViewTimeline editorial scroll, velocity-based horizontal gallery, and scroll-linked Three.js 3D.',
};

export default function ExamplesPage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans">
      <HeaderNav />
      {/* Main Interactive Showcase Hub */}
      <main className="flex-1">
        <ShowcaseHub />
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500 bg-[#050505]">
        <p>&copy; {new Date().getFullYear()} ScrollCraft. Designed for the high-performance web.</p>
      </footer>
    </div>
  );
}
