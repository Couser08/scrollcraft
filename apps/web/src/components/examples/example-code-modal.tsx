'use client';

/**
 * Clean Modal for "<> View Code" on Examples Page
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ExampleItem } from '@/data/examples.data';

interface ExampleCodeModalProps {
  example: ExampleItem | null;
  onClose: () => void;
}

export const ExampleCodeModal: React.FC<ExampleCodeModalProps> = ({
  example,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!example) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0e14] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-left select-none">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#090b10]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {example.title}.ts
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Block Content */}
        <div className="p-6 font-mono-code text-xs sm:text-sm text-zinc-200 leading-relaxed overflow-x-auto max-h-[440px]">
          <pre className="whitespace-pre">{example.codeSnippet}</pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#090b10]/60">
          <span className="text-xs text-zinc-500">
            Targeting preset: <span className="text-blue-400 font-mono">{example.subtag}</span>
          </span>
          <Link
            href={`/playground?preset=${example.playgroundPreset}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Open in Playground</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
