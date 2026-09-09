'use client';

/**
 * Documentation Right Table of Contents (On this page)
 * Sticky in-page anchor tracking.
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
            ? 'text-blue-600 font-semibold -ml-[13px] border-l-2 border-blue-600 pl-2.5'
            : 'text-zinc-500 hover:text-zinc-900'
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
      <div className="sticky top-24 flex flex-col gap-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          On This Page
        </h4>
        <ul className="flex flex-col gap-1.5 border-l border-zinc-200 pl-3">
          {items.map((item) => (
            <TocLink
              key={item.id}
              item={item}
              isActive={activeAnchor === item.id}
              onClick={handleClick}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
