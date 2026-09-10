import React from 'react';
import Link from 'next/link';

export function V3Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#050505]/95">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 rounded-sm bg-white group-hover:scale-105 transition-transform duration-300" />
          <span className="text-sm font-semibold tracking-tight text-white">ScrollCraft</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="/playground" className="hover:text-white transition-colors">Playground</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-xs font-medium px-4 py-2 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300">
            Get Pro
          </button>
        </div>
      </div>
    </header>
  );
}
