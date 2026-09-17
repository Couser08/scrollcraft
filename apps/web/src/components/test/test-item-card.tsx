'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TestItem } from './test-registry';

interface TestItemCardProps {
  item: TestItem;
  index: number;
}

export const TestItemCard: React.FC<TestItemCardProps> = ({ item, index }) => {
  const categoryBadge =
    item.category === 'primitives'
      ? 'bg-violet-500/10 text-violet-400 border-violet-500/30'
      : item.category === 'components'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <Link
      href={`/test/${item.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#09090c]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/50 hover:bg-[#0c0c12] hover:shadow-2xl hover:shadow-violet-950/20"
    >
      {/* Top Meta Line */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${categoryBadge}`}>
              {item.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 truncate max-w-[140px]">
            {item.driver.split('(')[0].trim()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white font-mono group-hover:text-violet-300 transition-colors flex items-center gap-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
          {item.shortDescription}
        </p>

        {/* Key Features Pill List */}
        <div className="mt-4 space-y-1.5">
          {item.features.slice(0, 2).map((feat, fIdx) => (
            <div key={fIdx} className="flex items-center gap-2 text-[11px] text-zinc-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer & Action */}
      <div className="mt-6 pt-4 border-t border-zinc-800/70 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 2).map((tag, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-transform group-hover:translate-x-1">
          <span>Open Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
