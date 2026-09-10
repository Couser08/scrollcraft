'use client';

/**
 * Documentation Right Table of Contents (On this page)
 * Sticky in-page anchor tracking with ScrollCraft brand tokens.
 * Strictly under 650 LOC.
 */

import React from 'react';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface DocsTocProps {
  items: TocItem[];
  activeAnchor?: string;
  onSelectAnchor?: (id: string) => void;
}

const TocLink: React.FC<{
  item: TocItem;
  isActive: boolean;
  onClick: (id: string) => void;
}> = React.memo(({ item, isActive, onClick }) => {
  const handleClick = React.useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  return (
    <li>
      <button
        onClick={handleClick}
        aria-current={isActive ? 'location' : undefined}
        className={`text-xs text-left transition-colors cursor-pointer block truncate w-full ${
          isActive
            ? 'text-[#FF5A1F] font-semibold -ml-[13px] border-l-2 border-[#FF5A1F] pl-2.5'
            : 'text-[#6B7280] hover:text-[#0A0A0A]'
        }`}
      >
        {item.title}
      </button>
    </li>
  );
});
TocLink.displayName = 'TocLink';

export const DocsToc: React.FC<DocsTocProps> = ({
  items,
  activeAnchor,
  onSelectAnchor,
}) => {
  if (items.length === 0) return null;

  const handleClick = React.useCallback(
    (id: string) => {
      if (onSelectAnchor) {
        onSelectAnchor(id);
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [onSelectAnchor]
  );

  return (
    <div className="hidden xl:block w-52 shrink-0 select-none">
      <div className="sticky top-6 flex flex-col gap-4">
        <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
          On This Page
        </h4>
        <ul className="flex flex-col gap-1.5 border-l border-zinc-200/80 pl-3">
          {items.map((item) => (
            <TocLink
              key={item.id}
              item={item}
              isActive={activeAnchor === item.id}
              onClick={handleClick}
            />
          ))}
        </ul>

        {/* Quick Utilities */}
        <div className="pt-4 mt-2 border-t border-zinc-200/60 flex flex-col gap-2 text-xs text-zinc-500">
          <button
            onClick={() => {
              const el = document.querySelector('main');
              if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Scroll to top ↑
          </button>
        </div>
      </div>
    </div>
  );
};
