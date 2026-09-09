'use client';

/**
 * Docs Callout Component
 * Architectural callout cards for tips, notes, warnings, and best practices.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react';

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
      container: 'bg-blue-50/60 border-blue-200 text-blue-950',
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-900',
    },
    tip: {
      container: 'bg-emerald-50/60 border-emerald-200 text-emerald-950',
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-900',
    },
    warning: {
      container: 'bg-amber-50/60 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-900',
    },
    danger: {
      container: 'bg-rose-50/60 border-rose-200 text-rose-950',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-900',
    },
  }[type];

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-xl border p-4 text-sm leading-relaxed ${styles.container}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={`font-semibold text-xs uppercase tracking-wider mb-1 ${styles.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs sm:text-sm text-zinc-700 space-y-1.5">{children}</div>
      </div>
    </div>
  );
};
