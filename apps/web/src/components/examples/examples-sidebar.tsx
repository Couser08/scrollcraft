'use client';

/**
 * Examples Page Left Sidebar Navigation
 * Strictly under 650 LOC.
 */

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Download,
  BookOpen,
  Play,
  Code2,
  LayoutGrid,
  FileText,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { EXAMPLE_CATEGORIES } from '@/data/examples.data';

interface ExamplesSidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const ExamplesSidebar: React.FC<ExamplesSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8 select-none">
      {/* Top Docs Links */}
      <nav className="flex flex-col gap-1 text-sm font-medium">
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <Home className="w-4 h-4 text-zinc-400" />
          <span>Get Started</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <Download className="w-4 h-4 text-zinc-400" />
          <span>Installation</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-zinc-400" />
          <span>Core Concepts</span>
        </Link>
        <Link
          href="/examples"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow-2xs border border-blue-100"
        >
          <Play className="w-4 h-4 text-blue-600 fill-blue-600/20" />
          <span>Examples</span>
        </Link>
        <Link
          href="/playground"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <Code2 className="w-4 h-4 text-zinc-400" />
          <span>Playground</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <LayoutGrid className="w-4 h-4 text-zinc-400" />
          <span>Components</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
        >
          <FileText className="w-4 h-4 text-zinc-400" />
          <span>Templates</span>
        </Link>
      </nav>

      {/* Categories Filter List */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3.5 mb-1">
          Categories
        </span>

        {EXAMPLE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-blue-200/60 text-blue-800 font-bold'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Showcase Card */}
      <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-900">Build something cool?</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
            Showcase your project in our community.
          </p>
        </div>
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
        >
          <span>Submit Project</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
        </button>
      </div>
    </aside>
  );
};
