'use client';

/**
 * High-End Dark Brand Footer
 * Zero external UI kits. Strictly under 650 LOC.
 */

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#08080a] py-16 px-6 sm:px-12 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-white">ScrollCraft Engine</span>
          <span className="text-zinc-600">|</span>
          <span>Engineered for React & Next.js</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-500">
          <a href="#catalog" className="hover:text-zinc-300 transition-colors">
            Components
          </a>
          <a href="#pricing" className="hover:text-zinc-300 transition-colors">
            Commercial License
          </a>
          <a
            href="/playground"
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
            <span>Playground</span>
          </a>
        </div>

        <div className="flex items-center gap-1 text-zinc-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for high-performance web</span>
        </div>
      </div>
    </footer>
  );
};
