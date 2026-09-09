'use client';

/**
 * Bottom 5-Column Feature Strip
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';
import { FEATURES_DATA, FeatureItem } from '@/data/features.data';
import { PenTool, Folder, FileDown, Zap, ShieldCheck } from 'lucide-react';
import { useMagnetic } from '@scrollcraft/react';

const FeatureItemCard: React.FC<{ item: FeatureItem }> = ({ item }) => {
  const magnetic = useMagnetic({ strength: 0.2, radius: 70 });

  const renderIcon = () => {
    switch (item.iconName) {
      case 'pen-tool':
        return <PenTool className="w-4 h-4 text-zinc-300" />;
      case 'folder':
        return <Folder className="w-4 h-4 text-zinc-300" />;
      case 'file-down':
        return <FileDown className="w-4 h-4 text-zinc-300" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-zinc-300" />;
      case 'shield-check':
        return <ShieldCheck className="w-4 h-4 text-zinc-300" />;
    }
  };

  return (
    <div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      className="flex items-center gap-3.5 p-2 rounded-xl group transition-colors cursor-default select-none"
    >
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/25 group-hover:bg-white/10 transition-all duration-300 shadow-sm">
        {renderIcon()}
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
          {item.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-tight">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
};

export const FeaturesStrip: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 pt-2 pb-8">
      {FEATURES_DATA.map((item) => (
        <FeatureItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
