'use client';

/**
 * ScrollCraft Official Navigation Bar
 * Aligned with Image 1 & 2 design specifications.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';
import { Terminal, Check, Copy, Menu, X } from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npm i @scrollcraft/react');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/docs', label: 'Documentation' },
    { href: '/playground', label: 'Playground' },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Version Badge */}
        <Link href="/" className="flex items-center gap-2 group">
          <ScrollCraftLogo variant="badge" badgeText="v0.1.0" size="md" />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1.5 relative ${
                  isActive ? 'text-zinc-100 font-semibold' : 'hover:text-zinc-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF5A1F] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: install + mobile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={copyCommand}
            className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-xs font-mono text-zinc-100 transition-all cursor-pointer"
            title="Click to copy install command"
          >
            <span className="text-zinc-500 mr-1">&gt;_</span>
            <span>npm i @scrollcraft/react</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-100" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-800 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0a] px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={copyCommand}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-[#0a0a0a] text-xs font-mono text-zinc-100 w-full justify-center"
            >
              <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>npm i @scrollcraft/react</span>
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
