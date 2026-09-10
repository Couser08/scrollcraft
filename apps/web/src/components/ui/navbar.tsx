'use client';

/**
 * Floating Frosted Glass Navbar
 * Zero external UI kits. Strictly under 650 LOC.
 */

import React from 'react';
import { Button } from './button';
import { Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-5 inset-x-0 z-40 flex justify-center px-4 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-6 px-5 py-2.5 rounded-full bg-[#0e0f14]/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl max-w-4xl w-full">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 text-white font-bold text-sm sm:text-base tracking-tight select-none">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>ScrollCraft</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <a href="#editor" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#catalog" className="hover:text-white transition-colors">
            Components
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="/playground" className="hover:text-white transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
            <span>Playground</span>
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <a href="#pricing">
            <Button variant="primary" className="!py-1.5 !px-4 !text-xs font-semibold">
              Get Pro Access
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
};
