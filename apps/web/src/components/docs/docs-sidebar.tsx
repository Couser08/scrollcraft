'use client';

/**
 * Documentation Left Sidebar Navigation
 * Searchable, categorised, and sticky with precision active states.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Search, Sparkles, Box, BookOpen, Layers, Cpu, ChefHat } from 'lucide-react';
import { DOCS_CATEGORIES } from './docs-data';

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'getting-started': <BookOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />,
  primitives: <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" />,
  hooks: <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />,
  r3f: <Box className="w-3.5 h-3.5 text-[#FF5A1F]" />,
  architecture: <Cpu className="w-3.5 h-3.5 text-[#FF5A1F]" />,
  recipes: <ChefHat className="w-3.5 h-3.5 text-[#FF5A1F]" />,
};

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5 select-none">
      {/* Search Input with Shortcut Badge */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSelectChange(e.target.value)}
          placeholder="Filter documentation..."
          className="w-full pl-9 pr-12 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all shadow-xs"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#9CA3AF] hover:text-[#0A0A0A] cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] pointer-events-none">
            ⌘K
          </span>
        )}
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
              <div className="flex items-center gap-2 px-2.5 py-1">
                {CATEGORY_ICONS[category.id]}
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                  {category.title}
                </h4>
              </div>
              <ul className="flex flex-col gap-0.5">
                {matchingItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#FFF7ED] text-[#FF5A1F] font-semibold border border-[#FFEDD5] shadow-xs'
                            : 'text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                              isActive
                                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                                : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
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

  function onSelectChange(val: string) {
    onSearchChange(val);
  }
};
