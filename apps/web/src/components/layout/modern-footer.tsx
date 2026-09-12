'use client';

/**
 * ScrollCraft Official Footer
 * Aligned with Image 1 & 2 design specifications.
 * Strictly under 650 LOC.
 */

import React from 'react';
import Link from 'next/link';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';
import { usePathname } from 'next/navigation';
import {
  TwitterIcon,
  DiscordIcon,
  YoutubeIcon,
} from '@/components/ui/social-icons';

export const ModernFooter: React.FC = () => {
  const pathname = usePathname();

  // On documentation route, the docs shell manages its own viewport height and footer
  if (pathname?.startsWith('/docs')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#FAFAF9] border-t border-[#E7E5E4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Link href="/">
            <ScrollCraftLogo variant="full" size="md" />
          </Link>
          <span className="hidden sm:inline-block text-[#A8A29E]">•</span>
          <span className="text-[#78716C] text-xs font-normal">
            Declarative scroll for modern React.
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-[#78716C]">
          <Link href="/" className="hover:text-[#0A0A0A] transition-colors">
            Overview
          </Link>
          <Link href="/docs" className="hover:text-[#0A0A0A] transition-colors">
            Documentation
          </Link>
          <Link href="/playground" className="hover:text-[#0A0A0A] transition-colors">
            Playground
          </Link>
        </nav>

        {/* Right: Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#78716C]">
          <div className="flex items-center gap-3">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-white text-[#78716C] hover:text-[#0A0A0A] transition-colors"
              aria-label="Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-white text-[#78716C] hover:text-[#0A0A0A] transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-white text-[#78716C] hover:text-[#0A0A0A] transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>
          <span>© {new Date().getFullYear()} ScrollCraft</span>
        </div>
      </div>
    </footer>
  );
};
