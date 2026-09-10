'use client';

import React from 'react';
import {
  Share2,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PlaygroundHeaderProps {
  onShare: () => void;
  onReset: () => void;
  shareCopied: boolean;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  onShare,
  onReset,
  shareCopied,
}) => {
  return (
    <div className="relative w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 select-none">
      {/* Left Title & Eyebrow */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] text-[11px] font-mono font-bold tracking-wider uppercase">
            ScrollCraft Sandbox
          </span>
          <span className="text-zinc-400 text-xs hidden sm:inline">•</span>
          <span className="text-zinc-500 text-xs hidden sm:inline font-medium">
            Isolated iframe Execution • 60 FPS Compositor
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950 leading-tight">
          Interactive Motion Studio
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl leading-relaxed">
          Tweak spring physics, compare ScrollCraft against GSAP & CSS, and export syntax-highlighted React 19 / Next.js 15 JSX code.
        </p>
      </div>

      {/* Right Controls: Share Link & Reset */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Share Button (Encodes state into URL and copies) */}
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Copy shareable link with current configuration parameters"
        >
          {shareCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-zinc-600" />
              <span>Share Config</span>
            </>
          )}
        </button>

        {/* 1-Click Reset to Default */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
          title="Reset parameters to defaults"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
