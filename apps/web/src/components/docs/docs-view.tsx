'use client';

/**
 * Main Documentation Shell & View Coordinator
 * Orchestrates sidebar, active content section, and table of contents.
 * Aligned with ScrollCraft design tokens and comprehensive ecosystem coverage.
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { DocsToc, TocItem } from './docs-toc';
import { DocGettingStarted } from './sections/doc-getting-started';
import { DocPrimitives } from './sections/doc-primitives';
import { DocHooks } from './sections/doc-hooks';
import { DocArchitecture } from './sections/doc-architecture';
import { DocR3F } from './sections/doc-r3f';
import { DocRecipes } from './sections/doc-recipes';

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

  // Keyboard shortcut listener for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder="Filter documentation..."]') as HTMLInputElement | null;
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

  const renderSection = () => {
    if (['introduction', 'installation', 'setup'].includes(activeSection)) {
      return <DocGettingStarted sectionId={activeSection} />;
    }
    if (['parallax', 'reveal', 'pin', 'scroll-progress'].includes(activeSection)) {
      return <DocPrimitives primitiveId={activeSection} />;
    }
    if (['use-scroll-state', 'use-scrollcraft', 'use-parallax', 'use-reveal', 'use-pin'].includes(activeSection)) {
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
    <div className="w-full min-h-screen bg-[#FAFAF9] text-[#0A0A0A] pb-24">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-[#E5E7EB] bg-white/70 backdrop-blur-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0A0A0A]">Documentation</span>
            <span>/</span>
            <span className="capitalize font-mono text-[#FF5A1F] font-medium">
              {activeSection.replace(/-/g, ' ')}
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-[#9CA3AF]">
            ScrollCraft v0.1.0 • React 19 & Next.js 15
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Sticky Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden pr-2">
          <DocsSidebar
            activeSection={activeSection}
            onSelectSection={(id) => {
              setActiveSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Center Main Documentation Body */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <article className="prose prose-zinc max-w-none">
            {renderSection()}
          </article>
        </div>

        {/* Right Sticky Table of Contents */}
        <DocsToc items={tocItems} />
      </div>
    </div>
  );
};
