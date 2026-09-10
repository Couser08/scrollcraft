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
    <aside className="w-full shrink-0 flex flex-col gap-6 select-none">
      {/* Search Input with Shortcut Badge */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter docs..."
          className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-white/5/5 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all shadow-2xs"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 py-0.5 rounded bg-white/5/5 text-zinc-500 border border-white/10 pointer-events-none">
            ⌘K
          </span>
        )}
      </div>

      {/* Grouped Categories */}
      <div className="flex flex-col gap-5">
        {DOCS_CATEGORIES.map((category) => {
          const matchingItems = category.items.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingItems.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2 py-1">
                {CATEGORY_ICONS[category.id]}
                <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  {category.title}
                </h4>
              </div>
              <ul className="flex flex-col gap-0.5 border-l border-white/10 ml-3.5 pl-2">
                {matchingItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left cursor-pointer ${
                          isActive
                            ? 'text-[#FF5A1F] font-semibold bg-[#FF5A1F]/10 border-l-2 -ml-[9px] pl-[17px] border-[#FF5A1F]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5/5'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono uppercase tracking-tight px-1.5 py-0.5 rounded border ${
                              isActive
                                ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] border-[#FF5A1F]/30 font-semibold'
                                : 'bg-white/5/5 text-zinc-400 border-white/10'
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

