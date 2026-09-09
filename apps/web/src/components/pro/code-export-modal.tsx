'use client';

/**
 * ScrollCraft Pro: Code Export & CLI Modal
 * Zero external UI kits. Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { CatalogItem } from '@/data/catalog.data';
import { Check, Copy, Terminal, X } from 'lucide-react';

export const CodeExportModal: React.FC<{
  item: CatalogItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const copyCommand = () => {
    navigator.clipboard.writeText(item.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0f1015] border border-white/15 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-mono text-[10px] uppercase font-semibold">
              {item.badge ?? 'PRO'}
            </span>
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>

        {/* CLI Command Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Install via CLI
          </label>
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs sm:text-sm text-blue-400">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>{item.command}</span>
            </div>
            <button
              onClick={copyCommand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs shrink-0 cursor-pointer ml-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pro Notice */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200/80 flex items-center justify-between gap-4">
          <span>Pro components include full Next.js 15 source code and commercial client license.</span>
          <a
            href="#pricing"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium whitespace-nowrap transition-colors"
          >
            Upgrade
          </a>
        </div>
      </div>
    </div>
  );
};
