'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  MoveHorizontal,
  Compass,
  Zap,
  MousePointer,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { ShowcaseId, SHOWCASES } from './playground-types';

interface PlaygroundSidebarProps {
  selectedShowcaseId: ShowcaseId;
  onSelectShowcase: (id: ShowcaseId) => void;
}

export const PlaygroundSidebar: React.FC<PlaygroundSidebarProps> = ({
  selectedShowcaseId,
  onSelectShowcase,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = (id: ShowcaseId) => {
    switch (id) {
      case 'hero-parallax':
        return <Layers className="w-4 h-4 text-[#FF5A1F]" />;
      case 'reveal-stagger':
        return <Sparkles className="w-4 h-4 text-[#FF5A1F]" />;
      case 'velocity-marquee':
        return <MoveHorizontal className="w-4 h-4 text-[#FF5A1F]" />;
      case 'magnetic-card':
        return <MousePointer className="w-4 h-4 text-[#FF5A1F]" />;
      default:
        return <Compass className="w-4 h-4 text-[#FF5A1F]" />;
    }
  };

  return (
    <aside
      className={`shrink-0 flex flex-col gap-5 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16 lg:w-16' : 'w-full lg:w-60'
      }`}
    >
      <div className="flex items-center justify-between px-1">
        {!isCollapsed && (
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden lg:block">
            Primitives & Recipes
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors hidden lg:block ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Showcases List */}
      <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {SHOWCASES.map((item) => {
          const isSelected = selectedShowcaseId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectShowcase(item.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center shrink-0 min-w-[200px] lg:min-w-0 ${
                isCollapsed ? 'justify-center lg:p-3' : 'justify-between lg:p-3.5'
              } ${
                isSelected
                  ? 'bg-white border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/15'
                  : 'bg-zinc-50/70 border-zinc-200/80 hover:bg-white hover:border-zinc-300'
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? 'bg-[#FFF7ED]' : 'bg-white border border-zinc-200/60'
                  }`}
                >
                  {getIcon(item.id)}
                </div>
                {!isCollapsed && (
                  <div className="hidden lg:block">
                    <h4
                      className={`text-xs font-bold ${
                        isSelected ? 'text-zinc-950' : 'text-zinc-700'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-medium block">
                      {item.category}
                    </span>
                  </div>
                )}
                {/* Mobile view still shows full content */}
                <div className="lg:hidden">
                  <h4
                    className={`text-xs font-bold ${
                      isSelected ? 'text-zinc-950' : 'text-zinc-700'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-medium block">
                    {item.category}
                  </span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="hidden lg:block">
                  {isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] block" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Architecture Spec Card */}
      {!isCollapsed && (
        <div className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-zinc-600 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-[11px] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Pure Compositor</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Zero React state churn during scroll. Directly updates DOM transforms via GPU thread.
          </p>
        </div>
      )}
    </aside>
  );
};
