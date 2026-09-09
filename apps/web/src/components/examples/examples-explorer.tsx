'use client';

/**
 * ExamplesExplorer: Client Island for Examples Filter, Sort, and Code Modal
 * Strictly under 650 LOC.
 */

import React, { useState, useMemo } from 'react';
import { ExamplesSidebar } from '@/components/examples/examples-sidebar';
import { ExamplesHero } from '@/components/examples/examples-hero';
import { ExamplesFilterBar } from '@/components/examples/examples-filter-bar';
import { ExampleItemCard } from '@/components/examples/example-item-card';
import { ExampleCodeModal } from '@/components/examples/example-code-modal';
import { ExamplesBottomCta } from '@/components/examples/examples-bottom-cta';
import { EXAMPLES_LIST, ExampleItem } from '@/data/examples.data';

export const ExamplesExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeCodeExample, setActiveCodeExample] = useState<ExampleItem | null>(null);

  // Filtered & Sorted Examples list
  const filteredExamples = useMemo(() => {
    let list = EXAMPLES_LIST;
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [selectedCategory, sortBy]);

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-col lg:flex-row gap-10">
        {/* Left Sidebar */}
        <div className="lg:w-60 shrink-0">
          <ExamplesSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Top Banner with visual preview & doodle */}
          <ExamplesHero />

          {/* Filter Pills & Sort Dropdown */}
          <ExamplesFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* 8 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredExamples.map((example) => (
              <ExampleItemCard
                key={example.id}
                example={example}
                onViewCode={setActiveCodeExample}
              />
            ))}
          </div>

          {/* Bottom Floating CTA Banner */}
          <ExamplesBottomCta />
        </div>
      </div>

      {/* View Code Modal */}
      <ExampleCodeModal
        example={activeCodeExample}
        onClose={() => setActiveCodeExample(null)}
      />
    </div>
  );
};
