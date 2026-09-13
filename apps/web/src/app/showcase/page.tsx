import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';
import { GithubIcon } from '@/components/ui/social-icons';

export const metadata: Metadata = {
  title: 'Showcase — ScrollCraft in Action',
  description:
    'Explore interactive, production-grade scroll experiences built with ScrollCraft. Real Three.js 3D, physics horizontal gallery, and native ViewTimeline long-form.',
};

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-zinc-200/80 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-5 h-5 rounded-full bg-blue-600 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <span className="text-lg font-bold text-zinc-950 tracking-tight">ScrollCraft</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
              <Link href="/docs" className="hover:text-zinc-950 transition-colors">
                Docs
              </Link>
              <Link href="/examples" className="hover:text-zinc-950 transition-colors">
                Examples
              </Link>
              <Link href="/showcase" className="text-zinc-950 font-bold transition-colors">
                Showcase
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Showcase View */}
      <main className="flex-1">
        <ShowcaseHub />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-500 bg-white">
        <p>&copy; {new Date().getFullYear()} ScrollCraft. Designed for the high-performance web.</p>
      </footer>
    </div>
  );
}
