'use client';

/**
 * Main Documentation Shell & View Coordinator
 * Orchestrates sidebar, active content section, and table of contents.
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { DocsToc, TocItem } from './docs-toc';
import { DocGettingStarted } from './sections/doc-getting-started';
import { DocPrimitives } from './sections/doc-primitives';
import { DocHooks } from './sections/doc-hooks';
import { DocArchitecture } from './sections/doc-architecture';

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: [
    { id: 'the-problem', title: 'The Problem with Web Scroll' },
    { id: 'our-architecture', title: 'The ScrollCraft Solution' },
    { id: 'quick-example', title: 'Quick Preview' },
  ],
  installation: [
    { id: 'install-package', title: 'Install Packages' },
    { id: 'requirements', title: 'System Requirements' },
  ],
  setup: [
    { id: 'provider-setup', title: 'Root Layout Integration' },
    { id: 'provider-props', title: 'ScrollProvider API' },
  ],
  parallax: [
    { id: 'parallax-code', title: 'Usage' },
    { id: 'parallax-props', title: 'Props Reference' },
  ],
  reveal: [
    { id: 'reveal-code', title: 'Usage' },
    { id: 'reveal-props', title: 'Props Reference' },
  ],
  pin: [
    { id: 'pin-code', title: 'Usage' },
    { id: 'pin-props', title: 'Props Reference' },
  ],
  'scroll-progress': [
    { id: 'progress-code', title: 'Usage' },
    { id: 'progress-props', title: 'Props Reference' },
  ],
  'use-scroll-state': [
    { id: 'usage', title: 'Usage' },
    { id: 'metrics-reference', title: 'ScrollMetrics Interface' },
  ],
  'use-scrollcraft': [
    { id: 'usage', title: 'Usage' },
    { id: 'methods-reference', title: 'Context Methods' },
  ],
  'use-parallax': [
    { id: 'usage', title: 'Usage' },
  ],
  'three-phase-ticker': [
    { id: 'pipeline', title: 'The 3 Phases' },
  ],
  'reduced-motion': [
    { id: 'protection', title: 'Dual-Layer Protection' },
  ],
  benchmark: [
    { id: 'comparison', title: 'Feature Comparison' },
  ],
};

export const DocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (['use-scroll-state', 'use-scrollcraft', 'use-parallax', 'use-reveal'].includes(activeSection)) {
      return <DocHooks hookId={activeSection} />;
    }
    if (['three-phase-ticker', 'reduced-motion', 'benchmark'].includes(activeSection)) {
      return <DocArchitecture sectionId={activeSection} />;
    }
    return <DocGettingStarted sectionId="introduction" />;
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Sticky Navigation Sidebar */}
        <div className="lg:w-64 shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden pr-2">
          <DocsSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
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
