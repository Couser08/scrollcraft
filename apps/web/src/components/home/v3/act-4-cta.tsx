'use client';

import React from 'react';
import { Parallax } from '@scrollcraft/react';

export function Act4CTA() {
  return (
    <section className="relative min-h-[60vh] w-full flex items-center justify-center py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Parallax speed={0.1}>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-10">
            Craft your next masterpiece.
          </h2>
        </Parallax>

        <Parallax speed={0.05}>
          <div className="relative group mx-auto inline-block" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-zinc-700 to-zinc-500 opacity-10 group-hover:opacity-20 transition duration-500" />
            <div className="relative flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl px-6 py-4 font-mono text-sm shadow-2xl">
              <span className="text-zinc-500">$</span>
              <span className="text-zinc-200">npx @scrollcraft/cli init</span>
              <button 
                className="ml-4 p-2 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                onClick={() => navigator.clipboard.writeText('npx @scrollcraft/cli init')}
                aria-label="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
