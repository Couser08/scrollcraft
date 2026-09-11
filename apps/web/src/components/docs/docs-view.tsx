'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { TocItem } from './docs-toc';
import { DOCS_CATEGORIES } from './docs-data';
import dynamic from 'next/dynamic';
import { DocGettingStarted } from './sections/doc-getting-started';

const SectionLoading = () => (
  <div className="flex flex-col gap-6 animate-pulse py-12">
    <div className="h-6 w-32 bg-zinc-850 rounded-md" />
    <div className="h-12 w-3/4 bg-zinc-800 rounded-lg" />
    <div className="h-4 w-full bg-zinc-900 rounded" />
    <div className="h-4 w-5/6 bg-zinc-900 rounded" />
    <div className="h-72 w-full bg-zinc-900/60 rounded-2xl border border-zinc-800" />
  </div>
);

const DocPrimitives = dynamic(
  () => import('./sections/doc-primitives').then((mod) => mod.DocPrimitives),
  { loading: SectionLoading }
);
const DocHooks = dynamic(
  () => import('./sections/doc-hooks').then((mod) => mod.DocHooks),
  { loading: SectionLoading }
);
const DocArchitecture = dynamic(
  () => import('./sections/doc-architecture').then((mod) => mod.DocArchitecture),
  { loading: SectionLoading }
);
const DocR3F = dynamic(
  () => import('./sections/doc-r3f').then((mod) => mod.DocR3F),
  { loading: SectionLoading }
);
const DocRecipes = dynamic(
  () => import('./sections/doc-recipes').then((mod) => mod.DocRecipes),
  { loading: SectionLoading }
);
const CommandPalette = dynamic(
  () => import('./command-palette').then((mod) => mod.CommandPalette),
  { ssr: false }
);
import {
  Menu,
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Link from 'next/link';

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: [
    { id: 'the-problem', title: 'The Scroll Problem' },
    { id: 'our-architecture', title: 'The ScrollCraft Solution' },
    { id: 'core-principles', title: 'Core Principles' },
    { id: 'quick-example', title: 'A Quick Example' },
    { id: 'whats-next', title: "What's Next?" },
  ],
  installation: [
    { id: 'install-package', title: 'Package Manager' },
    { id: 'requirements', title: 'System Requirements' },
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
  'three-phase-ticker': [
    { id: 'ticker-execution', title: 'Execution Pipeline' },
    { id: 'ticker-api', title: 'Ticker API Reference' },
  ],
  'reduced-motion': [
    { id: 'a11y-detection', title: 'OS Motion Detection' },
    { id: 'a11y-fallback', title: 'Graceful Fallback' },
  ],
  benchmark: [
    { id: 'fps-comparison', title: 'FPS Stress Benchmark' },
  ],
};

export function DocsView() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const tocItems = useMemo(() => TOC_MAPPING[activeSection] || [], [activeSection]);

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

  // Global shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track active heading on scroll for Right TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(el.id);
          return;
        }
      }
      if (headingElements.length > 0 && headingElements[0]) {
        setActiveHeadingId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, activeSection]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -88; // offset for sticky 64px header + padding
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveHeadingId(id);
    }
  };

  const renderSection = () => {
    if (['introduction', 'installation', 'setup'].includes(activeSection)) {
      return <DocGettingStarted sectionId={activeSection} />;
    }
    if (
      [
        'parallax',
        'reveal',
        'pin',
        'scroll-progress',
        'velocity-marquee',
        'horizontal-scroll',
        'scroll-sequence',
      ].includes(activeSection)
    ) {
      return <DocPrimitives primitiveId={activeSection} />;
    }
    if (
      [
        'use-scroll-state',
        'use-scrollcraft',
        'use-parallax',
        'use-reveal',
        'use-pin',
        'use-magnetic',
      ].includes(activeSection)
    ) {
      return <DocHooks hookId={activeSection} />;
    }
    if (['r3f-overview', 'r3f-three-tier', 'use-scroll-3d', 'r3f-recipes'].includes(activeSection)) {
      return <DocR3F sectionId={activeSection} />;
    }
    if (['three-phase-ticker', 'reduced-motion', 'benchmark'].includes(activeSection)) {
      return <DocArchitecture sectionId={activeSection} />;
    }
    if (
      [
        'recipe-sticky-narrative',
        'recipe-horizontal-scroll',
        'recipe-3d-scroll',
      ].includes(activeSection)
    ) {
      return <DocRecipes recipeId={activeSection} />;
    }
    return <DocGettingStarted sectionId="introduction" />;
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-white">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectSection={handleSelectSection}
      />

      {/* Top Header - Fixed at top of viewport */}
      <header className="h-16 shrink-0 border-b border-zinc-800/80 bg-[#050505]/95 backdrop-blur-md flex items-center justify-between px-6 z-50 sticky top-0">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-white">ScrollCraft</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/docs" className="text-white hover:text-white transition-colors">
              Docs
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full h-9 px-3.5 text-sm text-zinc-400 transition-all cursor-pointer shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              <span className="text-zinc-500 group-hover:text-zinc-400 text-xs sm:text-sm">
                Search documentation, primitives, hooks...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 border border-zinc-700 rounded font-mono text-zinc-400 shadow-xs">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 border border-zinc-700 rounded font-mono text-zinc-400 shadow-xs">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Search (⌘K)"
          >
            <Search className="w-5 h-5" />
          </button>

          <a
            href="https://github.com/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors p-1"
            title="GitHub Repository"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <button
            onClick={() => handleSelectSection('installation')}
            className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {desktopSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative w-full max-w-[1600px] mx-auto flex-1">
        {/* Left Sidebar - Fixed & Isolated with overscroll-contain */}
        <aside
          ref={sidebarContainerRef}
          className={`
            fixed top-16 bottom-0 left-0 z-40 w-72 bg-[#050505] border-r border-zinc-800/80 px-4 py-6
            overflow-y-auto overscroll-contain sidebar-scroll
            ${
              mobileMenuOpen
                ? 'block shadow-2xl'
                : desktopSidebarOpen
                ? 'hidden md:block'
                : 'hidden'
            }
          `}
        >
          {/* Version Selector */}
          <div className="mb-6">
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono flex items-center justify-between shadow-xs">
              <span className="font-semibold text-white">v0.1.0-alpha</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                Latest
              </span>
            </div>
          </div>

          <DocsSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </aside>

        {/* Main Content Area */}
        <main
          className={`w-full min-h-[calc(100vh-4rem)] transition-[padding] duration-200 ${
            desktopSidebarOpen ? 'md:pl-72' : 'pl-0'
          } xl:pr-64`}
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-10 lg:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-8 font-mono">
              <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                Docs
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span>{activeCategory?.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-zinc-200 font-medium">{activeItem?.title}</span>
            </div>

            {/* Main Article Content */}
            <article className="prose prose-invert prose-zinc max-w-none">
              {renderSection()}
            </article>

            {/* Pagination Cards */}
            <div className="mt-20 pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevSection ? (
                <button
                  onClick={() => handleSelectSection(prevSection.id)}
                  className="flex flex-col gap-1 p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] hover:border-zinc-700 transition-all text-left group shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 font-mono mb-1">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Previous</span>
                  </div>
                  <span className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {prevSection.title}
                  </span>
                  <span className="text-xs text-zinc-500">{prevSection.categoryTitle}</span>
                </button>
              ) : (
                <div />
              )}

              {nextSection && (
                <button
                  onClick={() => handleSelectSection(nextSection.id)}
                  className="flex flex-col gap-1 p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] hover:border-zinc-700 transition-all text-right items-end group shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 font-mono mb-1">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {nextSection.title}
                  </span>
                  <span className="text-xs text-zinc-500">{nextSection.categoryTitle}</span>
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right TOC Sidebar - Fixed & Isolated with overscroll-contain */}
        <aside className="fixed top-16 bottom-0 right-0 z-30 w-64 px-6 py-12 hidden xl:block border-l border-zinc-800/80 overflow-y-auto overscroll-contain sidebar-scroll bg-[#050505]">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            On this page
          </div>

          {tocItems.length > 0 ? (
            <div className="flex flex-col border-l border-zinc-800/80 pl-0 relative">
              {tocItems.map((item) => {
                const isHeadingActive = activeHeadingId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`text-left pl-3.5 py-1.5 text-xs transition-all cursor-pointer border-l -ml-[1px] leading-relaxed ${
                      isHeadingActive
                        ? 'text-white font-semibold border-blue-500'
                        : 'text-zinc-500 hover:text-zinc-300 border-transparent'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-zinc-600 italic">Overview section</div>
          )}

          {/* Feedback Widget */}
          <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col gap-3 text-xs text-zinc-500">
            <span className="font-mono text-[11px]">Was this section helpful?</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
                👍 Yes
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
                👎 No
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
