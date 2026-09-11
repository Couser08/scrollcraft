'use client';

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
      container: 'bg-blue-950/20 border border-blue-900/40 border-l-2 border-l-blue-500',
      icon: <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-400',
    },
    tip: {
      container: 'bg-emerald-950/20 border border-emerald-900/40 border-l-2 border-l-emerald-500',
      icon: <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-400',
    },
    warning: {
      container: 'bg-amber-950/20 border border-amber-900/40 border-l-2 border-l-amber-500',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-400',
    },
    danger: {
      container: 'bg-rose-950/20 border border-rose-900/40 border-l-2 border-l-rose-500',
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-400',
    },
  }[type];

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-xl p-4 text-sm leading-relaxed transition-all shadow-sm ${styles.container}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={`font-semibold text-xs tracking-wide uppercase font-mono mb-1.5 ${styles.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs sm:text-[13px] text-zinc-300 space-y-1.5 leading-relaxed font-normal">
          {children}
        </div>
      </div>
    </div>
  );
};
