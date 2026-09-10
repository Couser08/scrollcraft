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
    <header className="sticky top-0 inset-x-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Version Badge */}
        <Link href="/" className="flex items-center gap-2 group">
          <ScrollCraftLogo variant="badge" badgeText="v0.1.0" size="md" />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#78716C]">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1.5 relative ${
                  isActive ? 'text-[#0A0A0A] font-semibold' : 'hover:text-[#0A0A0A]'
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
            className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] hover:bg-[#F5F5F4] text-xs font-mono text-[#0A0A0A] transition-all cursor-pointer"
            title="Click to copy install command"
          >
            <span className="text-[#A8A29E] mr-1">&gt;_</span>
            <span>npm i @scrollcraft/react</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#A8A29E] hover:text-[#0A0A0A]" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] hover:text-[#0A0A0A]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#FFF7ED] text-[#FF5A1F] font-semibold'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#0A0A0A]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
            <button
              onClick={copyCommand}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#FAFAF9] text-xs font-mono text-[#0A0A0A] w-full justify-center"
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
