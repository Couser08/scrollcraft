'use client';

/**
 * Main Documentation Shell & View Coordinator
 * Orchestrates sidebar, active content section, and table of contents.
 * Aligned with ScrollCraft design tokens and comprehensive ecosystem coverage.
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { DocsToc, TocItem } from './docs-toc';
import { DOCS_CATEGORIES } from './docs-data';
import { DocGettingStarted } from './sections/doc-getting-started';
import { DocPrimitives } from './sections/doc-primitives';
import { DocHooks } from './sections/doc-hooks';
import { DocArchitecture } from './sections/doc-architecture';
import { DocR3F } from './sections/doc-r3f';
import { DocRecipes } from './sections/doc-recipes';
import { ChevronRight, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: [
    { id: 'the-problem', title: 'The Scroll Problem' },
    { id: 'our-architecture', title: 'The ScrollCraft Solution' },
    { id: 'quick-example', title: 'Quick Preview' },
  ],
  installation: [
    { id: 'install-package', title: 'Package Manager' },
    { id: 'requirements', title: 'Requirements' },
  ],
  setup: [
    { id: 'provider-setup', title: 'Root Layout Integration' },
    { id: 'provider-props', title: 'ScrollProvider Props' },
  ],
  parallax: [
    { id: 'parallax-code', title: 'Usage & Syntax' },
    { id: 'parallax-props', title: 'Props Reference' },
  ],
  reveal: [
    { id: 'reveal-code', title: 'Usage & Syntax' },
    { id: 'reveal-props', title: 'Props Reference' },
  ],
  pin: [
    { id: 'pin-code', title: 'Usage & Syntax' },
    { id: 'pin-props', title: 'Props Reference' },
  ],
  'scroll-progress': [
    { id: 'progress-code', title: 'Usage & Syntax' },
    { id: 'progress-props', title: 'Props Reference' },
  ],
  'velocity-marquee': [
    { id: 'marquee-code', title: 'Usage & Syntax' },
    { id: 'marquee-props', title: 'Props Reference' },
  ],
  'horizontal-scroll': [
    { id: 'horizontal-code', title: 'Usage & Syntax' },
    { id: 'horizontal-props', title: 'Props Reference' },
  ],
  'scroll-sequence': [
    { id: 'sequence-code', title: 'Usage & Syntax' },
    { id: 'sequence-props', title: 'Props Reference' },
  ],
  'use-scroll-state': [
    { id: 'usage', title: 'Usage & Subscription' },
  ],
  'use-scrollcraft': [
    { id: 'usage', title: 'Usage & API' },
  ],
  'use-parallax': [
    { id: 'usage', title: 'Usage' },
  ],
  'use-reveal': [
    { id: 'usage', title: 'Usage' },
  ],
  'use-pin': [
    { id: 'usage', title: 'Usage' },
  ],
  'use-magnetic': [
    { id: 'usage', title: 'Usage' },
  ],
  'r3f-overview': [
    { id: 'double-raf', title: 'The Double-RAF Dilemma' },
  ],
  'r3f-three-tier': [
    { id: 'waapi-probe', title: 'WAAPI Probe Engine' },
  ],
  'use-scroll-3d': [
    { id: 'signature', title: 'Hook Signature' },
  ],
  'r3f-recipes': [
    { id: 'recipe', title: 'Three.js Scene Recipe' },
  ],
  'three-phase-ticker': [
    { id: 'pipeline', title: '3-Phase Pipeline' },
  ],
  'reduced-motion': [
    { id: 'protection', title: 'Dual-Layer a11y' },
  ],
  benchmark: [
    { id: 'comparison', title: 'Feature Matrix' },
  ],
  'recipe-sticky-narrative': [
    { id: 'sticky-recipe', title: 'Sticky Narrative' },
  ],
  'recipe-horizontal-scroll': [
    { id: 'horizontal-recipe', title: 'Horizontal Gallery' },
  ],
  'recipe-3d-scroll': [
    { id: '3d-recipe', title: '3D Kinetic Hero' },
  ],
};

export const DocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder="Filter docs..."]') as HTMLInputElement | null;
        if (input) {
          input.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tocItems = useMemo(() => {
    return TOC_MAPPING[activeSection] || [];
  }, [activeSection]);

  const activeCategory = useMemo(() => {
    return DOCS_CATEGORIES.find((cat) =>
      cat.items.some((item) => item.id === activeSection)
    );
  }, [activeSection]);

  const activeItem = useMemo(() => {
    return activeCategory?.items.find((item) => item.id === activeSection);
  }, [activeCategory, activeSection]);

  const flatSections = useMemo(() => {
    return DOCS_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryTitle: cat.title }))
    );
  }, []);

  const currentIndex = useMemo(() => {
    return flatSections.findIndex((item) => item.id === activeSection);
  }, [flatSections, activeSection]);

  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < flatSections.length - 1
      ? flatSections[currentIndex + 1]
      : null;

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderSection = () => {
    if (['introduction', 'installation', 'setup'].includes(activeSection)) {
      return <DocGettingStarted sectionId={activeSection} />;
    }
    if (['parallax', 'reveal', 'pin', 'scroll-progress', 'velocity-marquee', 'horizontal-scroll', 'scroll-sequence'].includes(activeSection)) {
      return <DocPrimitives primitiveId={activeSection} />;
    }
    if (['use-scroll-state', 'use-scrollcraft', 'use-parallax', 'use-reveal', 'use-pin', 'use-magnetic'].includes(activeSection)) {
      return <DocHooks hookId={activeSection} />;
    }
    if (['r3f-overview', 'r3f-three-tier', 'use-scroll-3d', 'r3f-recipes'].includes(activeSection)) {
      return <DocR3F sectionId={activeSection} />;
    }
    if (['three-phase-ticker', 'reduced-motion', 'benchmark'].includes(activeSection)) {
      return <DocArchitecture sectionId={activeSection} />;
    }
    if (['recipe-sticky-narrative', 'recipe-horizontal-scroll', 'recipe-3d-scroll'].includes(activeSection)) {
      return <DocRecipes recipeId={activeSection} />;
    }
    return <DocGettingStarted sectionId="introduction" />;
  };

  return (
    <div
      data-lenis-prevent="true"
      style={{ height: 'calc(100vh - 4rem)', maxHeight: 'calc(100vh - 4rem)' }}
      className="w-full flex flex-col overflow-hidden bg-[#050505] text-zinc-100"
    >
      {/* Top Banner / Breadcrumb Bar */}
      <div className="shrink-0 h-11 border-b border-white/[0.04] bg-[#0A0A0A]/90 backdrop-blur-md px-4 sm:px-8 z-10 flex items-center justify-between text-xs text-zinc-500">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded-md text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>

            <span className="font-semibold text-white">Docs</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">{activeCategory?.title || 'Guides'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-[#FF5A1F] font-semibold">
              {activeItem?.title || activeSection}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/5/5 text-zinc-300 border border-white/10">
              ScrollCraft v0.1.0
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-[11px] text-zinc-500">React 19 & Next.js 15</span>
          </div>
        </div>
      </div>

      {/* Main Documentation Split Workspace */}
      <div
        data-lenis-prevent="true"
        style={{ height: 'calc(100% - 2.75rem)', maxHeight: 'calc(100% - 2.75rem)' }}
        className="flex-1 flex overflow-hidden min-h-0 relative"
      >
        {/* Left Navigation Sidebar */}
        <div
          ref={sidebarRef}
          data-lenis-prevent="true"
          style={{ height: '100%', maxHeight: '100%' }}
          className={`${
            mobileMenuOpen
              ? 'fixed inset-y-11 left-0 z-50 w-72 shadow-2xl block bg-[#0A0A0A]'
              : 'hidden md:block'
          } w-64 lg:w-72 shrink-0 border-r border-white/[0.04] bg-[#0A0A0A] lg:bg-[#080808] overflow-y-auto overscroll-contain px-4 py-6 transition-all`}
        >
          <DocsSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Detailed Page Body */}
        <div
          ref={contentContainerRef}
          data-lenis-prevent="true"
          style={{ height: '100%', maxHeight: '100%' }}
          className="flex-1 min-w-0 overflow-y-auto overscroll-contain focus:outline-none bg-[#050505]"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 flex gap-12 items-start min-h-full">
            {/* Center Main Documentation Article */}
            <div className="flex-1 min-w-0 max-w-3xl pb-20">
              <article className="prose prose-invert prose-zinc max-w-none">
                {renderSection()}
              </article>

              {/* Prev / Next Pagination Cards */}
              <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevSection ? (
                  <button
                    onClick={() => handleSelectSection(prevSection.id)}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-white/5/[0.02] hover:border-white/20 hover:bg-white/5/[0.05] transition-all text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300">
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                      <span>Previous</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {prevSection.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {prevSection.categoryTitle}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextSection && (
                  <button
                    onClick={() => handleSelectSection(nextSection.id)}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-white/5/[0.02] hover:border-white/20 hover:bg-white/5/[0.05] transition-all text-right cursor-pointer group shadow-2xs sm:ml-auto w-full"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300">
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {nextSection.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {nextSection.categoryTitle}
                    </span>
                  </button>
                )}
              </div>

              {/* Minimalist Professional Documentation Footer */}
              <div className="mt-14 pt-6 border-t border-white/10/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-300">ScrollCraft Engine</span>
                  <span>•</span>
                  <span>Open Source Apache-2.0 / MIT</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="/playground" className="hover:text-zinc-100 transition-colors">
                    Playground
                  </a>
                </div>
              </div>
            </div>

            {/* Right Sticky Table of Contents */}
            <DocsToc items={tocItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

