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
      container: 'bg-[#FFF7ED] border-[#FFEDD5] text-[#0A0A0A]',
      icon: <Sparkles className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />,
      titleColor: 'text-[#FF5A1F]',
    },
    tip: {
      container: 'bg-[#F0FDF4] border-[#DCFCE7] text-[#0A0A0A]',
      icon: <Lightbulb className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />,
      titleColor: 'text-[#16A34A]',
    },
    warning: {
      container: 'bg-[#FFFBEB] border-[#FEF3C7] text-[#0A0A0A]',
      icon: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />,
      titleColor: 'text-[#F59E0B]',
    },
    danger: {
      container: 'bg-[#FEF2F2] border-[#FEE2E2] text-[#0A0A0A]',
      icon: <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />,
      titleColor: 'text-[#EF4444]',
    },
  }[type];

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-2xl border p-4 text-sm leading-relaxed ${styles.container}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={`font-semibold text-xs uppercase tracking-wider mb-1 ${styles.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs sm:text-sm text-[#0A0A0A]/85 space-y-1.5 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
