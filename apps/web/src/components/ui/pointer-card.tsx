'use client';

/**
 * 100% Bespoke Floating Annotation Pointer Card
 * Features magnetic physics and curved arrow indicator.
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';
import { useMagnetic } from '@scrollcraft/react';
import { Zap, LayoutTemplate, UploadCloud } from 'lucide-react';
import { PointerCardData } from '@/data/mockup.data';

export const PointerCard: React.FC<{
  data: PointerCardData;
  className?: string;
}> = ({ data, className = '' }) => {
  const magnetic = useMagnetic({ strength: 0.18, radius: 80 });

  const getIcon = () => {
    switch (data.icon) {
      case 'zap':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'layout-template':
        return <LayoutTemplate className="w-4 h-4 text-emerald-400" />;
      case 'upload-cloud':
        return <UploadCloud className="w-4 h-4 text-purple-400" />;
    }
  };

  const getAccentGlow = () => {
    switch (data.accentColor) {
      case 'blue':
        return 'bg-blue-950/60 border-blue-500/30 shadow-[0_0_16px_rgba(37,99,235,0.25)]';
      case 'emerald':
        return 'bg-emerald-950/60 border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.25)]';
      case 'purple':
        return 'bg-purple-950/60 border-purple-500/30 shadow-[0_0_16px_rgba(139,92,246,0.25)]';
    }
  };

  return (
    <div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      style={magnetic.style}
      onMouseMove={magnetic.bind.onMouseMove}
      onMouseLeave={magnetic.bind.onMouseLeave}
      className={`flex items-center gap-3 p-3.5 rounded-2xl bg-[#14151c]/95 border border-white/10 shadow-2xl backdrop-blur-xl select-none cursor-default transition-all duration-300 hover:border-white/20 hover:scale-[1.02] ${className}`}
    >
      <div className={`p-2.5 rounded-xl border ${getAccentGlow()}`}>
        {getIcon()}
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-white leading-tight">
          {data.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal">
          {data.subtitle}
        </p>
      </div>
    </div>
  );
};
