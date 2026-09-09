'use client';

/**
 * Documentation Left Sidebar Navigation
 * Searchable, categorised, and sticky with precision active states.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Search } from 'lucide-react';
import { DOCS_CATEGORIES } from './docs-data';

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 select-none">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search docs..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
        />
      </div>

      {/* Grouped Categories */}
      <div className="flex flex-col gap-6">
        {DOCS_CATEGORIES.map((category) => {
          const matchingItems = category.items.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingItems.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3">
                {category.title}
              </h4>
              <ul className="flex flex-col gap-0.5">
                {matchingItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 rounded-l-none'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                              isActive
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
