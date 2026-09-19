'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Zap,
  Activity,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { TEST_REGISTRY, TestCategory } from '@/components/test/test-registry';
import { TestHeaderHUD } from '@/components/test/test-header-hud';
import { TestItemCard } from '@/components/test/test-item-card';

export default function TestLabHubPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | TestCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return TEST_REGISTRY.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.driver.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const primitives = useMemo(() => filteredItems.filter((i) => i.category === 'primitives'), [filteredItems]);
  const components = useMemo(() => filteredItems.filter((i) => i.category === 'components'), [filteredItems]);
  const hooks = useMemo(() => filteredItems.filter((i) => i.category === 'hooks'), [filteredItems]);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white pb-32">
      {/* Top Unified Navigation */}
      <SiteNav />

      {/* Sticky Telemetry HUD */}
      <TestHeaderHUD title="ScrollCraft Test Lab" badge="25 Verified Units" />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-mono text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Strict Zero-Rerender Engine & Hardware Lab</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Test Lab & Interactive Catalog
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          Explore all 25 official primitives, high-performance components, and advanced hooks. Click on any unit to enter its dedicated deep-dive page with live FPS telemetry, zero-rerender audit proof, unconstrained scroll runways, and exact production code.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-zinc-400 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>25 Official Units</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Strict Zero Re-renders</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>120 FPS Direct GPU Writes</span>
          </div>
        </div>

        {/* Robust Testing Benchmark Banner */}
        <div className="pt-4">
          <Link
            href="/robust-testing"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600/20 via-sky-600/20 to-emerald-600/20 border border-violet-500/30 hover:border-violet-400 text-xs sm:text-sm font-mono text-zinc-200 hover:text-white transition-all shadow-xl group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            <span>
              <strong className="text-white">Robust Testing Benchmark:</strong> 21 Heavy Glass Cards, 4 Primitives &amp; GPU Blur Mode Isolation &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Controls Bar: Category Filter & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 w-full">
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#09090d] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All (${TEST_REGISTRY.length})` },
              { id: 'primitives', label: 'Primitives (6)' },
              { id: 'components', label: 'Components (7)' },
              { id: 'hooks', label: 'Advanced Hooks (12)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search primitives & hooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        </div>
      </section>

      {/* Section 1: Primitives (6 Cards) */}
      {(activeCategory === 'all' || activeCategory === 'primitives') && primitives.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 w-full space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                Primitives
              </span>
              <h2 className="text-xl font-bold text-white">Declarative Scroll Primitives</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{primitives.length} Units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primitives.map((item, idx) => (
              <TestItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: High-Performance Components (7 Cards) */}
      {(activeCategory === 'all' || activeCategory === 'components') && components.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 w-full space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Components
              </span>
              <h2 className="text-xl font-bold text-white">High-Performance Components</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{components.length} Units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((item, idx) => (
              <TestItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Advanced Hooks (12 Cards) */}
      {(activeCategory === 'all' || activeCategory === 'hooks') && hooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 w-full space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Advanced Hooks
              </span>
              <h2 className="text-xl font-bold text-white">Headless Hooks & Solvers</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{hooks.length} Units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hooks.map((item, idx) => (
              <TestItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </section>
      )}

      {filteredItems.length === 0 && (
        <div className="py-24 text-center text-zinc-500 font-mono text-sm">
          No items found matching your filter criteria.
        </div>
      )}
    </div>
  );
}
