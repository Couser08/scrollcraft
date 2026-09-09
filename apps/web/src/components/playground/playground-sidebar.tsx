'use client';

/**
 * Playground Left Sidebar Presets Selector
 * Strictly under 650 LOC.
 */

import React from 'react';
import {
  Search,
  Play,
  Type,
  Layers,
  Sparkles,
  ArrowRight,
  MoveHorizontal,
  Box,
  Compass,
} from 'lucide-react';

interface PlaygroundSidebarProps {
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PlaygroundSidebar: React.FC<PlaygroundSidebarProps> = ({
  selectedPresetId,
  onSelectPreset,
  searchQuery,
  onSearchChange,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'hero-reveal':
      case 'fade-in':
      case 'slide-up':
        return <Play className="w-3.5 h-3.5" />;
      case 'staggered-text':
      case 'text-mask':
        return <Type className="w-3.5 h-3.5" />;
      case 'scale-scroll':
      case '3d-transform':
        return <Box className="w-3.5 h-3.5" />;
      case 'parallax-section':
      case 'sticky-element':
      case 'pinned-sections':
        return <Layers className="w-3.5 h-3.5" />;
      case 'horizontal-scroll':
        return <MoveHorizontal className="w-3.5 h-3.5" />;
      default:
        return <Compass className="w-3.5 h-3.5" />;
    }
  };

  const sections = [
    {
      title: 'GET STARTED',
      items: [
        { id: 'hero-reveal', name: 'Hero Reveal' },
        { id: 'fade-in', name: 'Fade In', target: 'hero-reveal' },
        { id: 'slide-up', name: 'Slide Up', target: 'hero-reveal' },
        { id: 'staggered-text', name: 'Staggered Text' },
        { id: 'scale-scroll', name: 'Scale on Scroll' },
      ],
    },
    {
      title: 'LAYOUT',
      items: [
        { id: 'parallax-section', name: 'Parallax Section' },
        { id: 'sticky-element', name: 'Sticky Element', target: 'parallax-section' },
        { id: 'scroll-progress', name: 'Scroll Progress', target: 'hero-reveal' },
        { id: 'horizontal-scroll', name: 'Horizontal Scroll', target: 'parallax-section' },
        { id: 'image-gallery', name: 'Image Gallery', target: 'parallax-section' },
      ],
    },
    {
      title: 'CREATIVE',
      items: [
        { id: 'text-mask', name: 'Text Mask', target: 'staggered-text' },
        { id: '3d-transform', name: '3D Transform', target: 'scale-scroll' },
        { id: 'smooth-scroll', name: 'Smooth Scroll', target: 'hero-reveal' },
        { id: 'scroll-draw', name: 'Scroll Draw', target: 'staggered-text' },
        { id: 'pinned-sections', name: 'Pinned Sections', target: 'parallax-section' },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-6 select-none">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search examples..."
          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
        />
      </div>

      {/* Sections List */}
      <div className="flex flex-col gap-5">
        {sections.map((sec) => (
          <div key={sec.title} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-1">
              {sec.title}
            </span>

            {sec.items
              .filter(
                (item) =>
                  !searchQuery ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => {
                const targetId = item.target || item.id;
                const isSelected = selectedPresetId === item.id || selectedPresetId === targetId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectPreset(targetId)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70'
                    }`}
                  >
                    <span className={isSelected ? 'text-blue-600' : 'text-zinc-400'}>
                      {getIcon(item.id)}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Have an Idea Card */}
      <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shadow-2xs">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-900">Have an idea?</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
            Share it with the community and get featured.
          </p>
        </div>
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
        >
          <span>Submit Example</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
        </button>
      </div>
    </aside>
  );
};
