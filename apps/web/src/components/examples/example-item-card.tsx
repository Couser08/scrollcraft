'use client';

/**
 * Individual Showcase Card for Examples Page (01-08)
 * Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code2, ExternalLink } from 'lucide-react';
import { ExampleItem } from '@/data/examples.data';

interface ExampleItemCardProps {
  example: ExampleItem;
  onViewCode: (example: ExampleItem) => void;
}

export const ExampleItemCard: React.FC<ExampleItemCardProps> = ({
  example,
  onViewCode,
}) => {
  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-200/90 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all duration-300 overflow-hidden text-left">
      {/* Top Image Preview Container */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-zinc-100">
        <Image
          src={example.image}
          alt={example.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Number Badge (01, 02, etc.) */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-zinc-800 shadow-2xs">
          {example.number}
        </div>

        {/* Top Right External Link Icon */}
        <Link
          href={`/playground?preset=${example.playgroundPreset}`}
          aria-label={`Open ${example.title} live in playground`}
          className="absolute top-3 right-3 w-7 h-7 rounded-md bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors mb-1">
            {example.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">
            {example.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-medium">
              {example.category === 'scroll'
                ? 'Scroll Animations'
                : example.category === 'text'
                ? 'Text & Typography'
                : example.category === 'media'
                ? 'Image & Media'
                : example.category === 'layout'
                ? 'Layout & UI'
                : example.category === 'creative'
                ? 'Creative'
                : 'Interactions'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100/60">
              {example.subtag}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
          {/* Open Live Button */}
          <Link
            href={`/playground?preset=${example.playgroundPreset}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <span>Open Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* View Code Button */}
          <button
            type="button"
            onClick={() => onViewCode(example)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>View Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
