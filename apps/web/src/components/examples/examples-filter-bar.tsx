'use client';

/**
 * Filter Strip & Sort Dropdown for Examples Page
 * Strictly under 650 LOC.
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { EXAMPLE_CATEGORIES } from '@/data/examples.data';

interface ExamplesFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const ExamplesFilterBar: React.FC<ExamplesFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-100">
      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {EXAMPLE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {cat.label === 'All Examples' ? 'All' : cat.label}
            </button>
          );
        })}
      </div>

      {/* Right Sort Dropdown */}
      <div className="relative shrink-0 self-end sm:self-auto">
        <select
          value={sortBy}
          aria-label="Sort examples by"
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold rounded-full pl-3.5 pr-8 py-1.5 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
        >
          <option value="popular">Popular</option>
          <option value="recent">Recent</option>
          <option value="name">Name</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
