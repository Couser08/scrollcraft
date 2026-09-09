'use client';

/**
 * ScrollCraft Pro Component Catalog Grid
 * Filterable registry with live inspection modal.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { CATALOG_CATEGORIES, CATALOG_ITEMS, CatalogItem } from '@/data/catalog.data';
import { CodeExportModal } from './code-export-modal';
import { Sparkles, Terminal } from 'lucide-react';

export const ProCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="catalog" className="w-full max-w-7xl mx-auto py-24 px-6 sm:px-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sprint 4: Commercial Registry & Pro Catalog</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          ScrollCraft Pro Registry
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Pre-built, production-ready, Awwwards-tier animated components ready to drop directly into your Next.js project.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATALOG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-white text-zinc-950 shadow-lg font-semibold'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-3xl bg-[#121319] border border-white/10 p-6 flex flex-col justify-between h-72 overflow-hidden shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.02] cursor-pointer"
          >
            {/* Visual Preview Gradient Backdrop */}
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{ background: item.previewGradient }}
            />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              {item.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-black/50 border border-white/10 font-mono text-[10px] text-blue-400 font-semibold uppercase">
                  {item.badge}
                </span>
              )}
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Terminal className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="pt-2 flex items-center text-xs text-blue-400 font-mono font-medium">
                <span>View Component & CLI &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Code Export Modal */}
      <CodeExportModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};
