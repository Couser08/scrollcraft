import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';
import { GithubIcon } from '@/components/ui/social-icons';

export const metadata: Metadata = {
  title: 'Showcase — You Build. We Showcase. | ScrollCraft',
  description:
    'One canonical split-panel example per primitive and hook. Code on the left, live reactive rendering on the right. Zero component gallery sprawl.',
};

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-blue-500/20 selection:text-white">
      {/* Top Sticky Header */}
      <header className="w-full border-b border-zinc-800/80 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-5 h-5 rounded-full bg-blue-500 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
              <span className="text-lg font-bold text-white tracking-tight">ScrollCraft</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
              <Link href="/docs" className="hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/showcase" className="text-white font-bold transition-colors">
                Showcase
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Read Docs</span>
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
      <footer className="w-full border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 bg-[#050505]">
        <p>&copy; {new Date().getFullYear()} ScrollCraft. Designed for the high-performance web.</p>
      </footer>
    </div>
  );
}
