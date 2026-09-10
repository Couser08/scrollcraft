import React from 'react';
import Link from 'next/link';

export function V3Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] py-16 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-zinc-500" />
            <span className="text-lg font-bold tracking-tighter text-white">ScrollCraft</span>
          </Link>
          <p className="text-xs text-zinc-500 font-medium">The declarative React scroll engine.</p>
        </div>

        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="/components" className="hover:text-white transition-colors">Components</Link>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
