'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useScrollCraft, ScrollMetrics } from '@scrollcraft/react';

export function Navbar() {
  const bgRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    let wasScrolled: boolean | null = null;
    const unsub = subscribe((metrics: ScrollMetrics) => {
      const isScrolled = metrics.scroll > 20;
      if (isScrolled === wasScrolled) return;
      wasScrolled = isScrolled;

      if (bgRef.current) {
        bgRef.current.style.opacity = isScrolled ? '1' : '0';
      }
    });
    return () => unsub();
  }, [subscribe]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center">
      {/* Isolated GPU Composited Background Layer (Zero Repaint & Zero Blur Interpolation Lag) */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{ opacity: 0, willChange: 'opacity' }}
        className="absolute inset-0 -z-10 glass-surface border-b border-white/10 shadow-2xl transition-opacity duration-200 pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-white tracking-tight">ScrollCraft</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/examples" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Examples</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">NEW</span>
            </Link>
            <Link href="/showcase" className="hover:text-white transition-colors">
              Showcase
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/ScrollCraft/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft GitHub Repository"
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <Link
            href="/docs"
            className="group relative px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold overflow-hidden transition-all duration-300 hover:bg-zinc-200 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span>Get Started</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </header>
  );
}

