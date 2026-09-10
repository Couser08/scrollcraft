'use client';

/**
 * Docs Callout Component
 * Architectural callout cards for tips, notes, warnings, and best practices.
 * Aligned with ScrollCraft design tokens.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Lightbulb, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

interface DocsCalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const DocsCallout: React.FC<DocsCalloutProps> = ({
  type = 'note',
  title,
  children,
}) => {
  const styles = {
    note: {
      container: 'bg-zinc-50/80 border-zinc-200/90 border-l-[3px] border-l-[#FF5A1F]',
      icon: <Sparkles className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />,
      titleColor: 'text-[#FF5A1F]',
    },
    tip: {
      container: 'bg-emerald-50/30 border-zinc-200/90 border-l-[3px] border-l-emerald-600',
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-700',
    },
    warning: {
      container: 'bg-amber-50/30 border-zinc-200/90 border-l-[3px] border-l-amber-500',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-700',
    },
    danger: {
      container: 'bg-rose-50/30 border-zinc-200/90 border-l-[3px] border-l-rose-500',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-700',
    },
  }[type];

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-xl border p-4 text-sm leading-relaxed transition-all ${styles.container}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={`font-semibold text-xs tracking-tight uppercase font-mono mb-1 ${styles.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs sm:text-[13px] text-zinc-700 space-y-1.5 leading-relaxed font-normal">
          {children}
        </div>
      </div>
    </div>
  );
};
