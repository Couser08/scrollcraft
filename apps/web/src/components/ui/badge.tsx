'use client';

/**
 * 100% Bespoke Frosted Pill Badge
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface BadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  icon,
  children,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5/90 text-zinc-100 border border-white/20 shadow-sm backdrop-blur-md select-none ${className}`}
    >
      {icon ? (
        icon
      ) : (
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
      )}
      <span className="text-xs font-semibold tracking-wider uppercase text-zinc-300">
        {children}
      </span>
    </div>
  );
};

