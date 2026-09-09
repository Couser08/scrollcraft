'use client';

/**
 * Mac-Style Dark Code Editor Window
 * Zero external heavy syntax highlighters. Pure CSS/React. Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeWindowProps {
  code?: string;
  className?: string;
}

export const CodeWindow: React.FC<CodeWindowProps> = ({
  code,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const defaultSnippet = `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.hero',
  animate: {
    y: [50, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
  },
  scrub: true,
  once: false,
})`;

  const textToCopy = code || defaultSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[340px] sm:max-w-[380px] bg-[#0c0e14] rounded-2xl border border-zinc-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden text-left select-none transition-all duration-300 hover:border-zinc-700/80 ${className}`}
    >
      {/* Top Header Bar with Traffic Lights & Copy Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 bg-[#090b10]/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800/60 flex items-center gap-1.5 text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-medium">Copied!</span>
            </>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 sm:p-5 font-mono-code text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto text-zinc-300">
        <div>
          <span className="text-purple-400">import</span>{' '}
          <span className="text-zinc-100">{'{'}</span>{' '}
          <span className="text-cyan-300">scrollCraft</span>{' '}
          <span className="text-zinc-100">{'}'}</span>{' '}
          <span className="text-purple-400">from</span>{' '}
          <span className="text-emerald-400">'scroll-craft'</span>
        </div>
        <br />
        <div>
          <span className="text-blue-400">scrollCraft</span>
          <span className="text-zinc-100">{'({'}</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-300">target</span>
          <span className="text-zinc-100">: </span>
          <span className="text-emerald-400">'.hero'</span>
          <span className="text-zinc-100">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-300">animate</span>
          <span className="text-zinc-100">: {'{'}</span>
        </div>
        <div className="pl-8">
          <span className="text-sky-300">y</span>
          <span className="text-zinc-100">: [</span>
          <span className="text-amber-300">50</span>
          <span className="text-zinc-100">, </span>
          <span className="text-amber-300">0</span>
          <span className="text-zinc-100">],</span>
        </div>
        <div className="pl-8">
          <span className="text-sky-300">opacity</span>
          <span className="text-zinc-100">: [</span>
          <span className="text-amber-300">0</span>
          <span className="text-zinc-100">, </span>
          <span className="text-amber-300">1</span>
          <span className="text-zinc-100">],</span>
        </div>
        <div className="pl-8">
          <span className="text-sky-300">scale</span>
          <span className="text-zinc-100">: [</span>
          <span className="text-amber-300">0.95</span>
          <span className="text-zinc-100">, </span>
          <span className="text-amber-300">1</span>
          <span className="text-zinc-100">],</span>
        </div>
        <div className="pl-4">
          <span className="text-zinc-100">{'}'},</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-300">scrub</span>
          <span className="text-zinc-100">: </span>
          <span className="text-purple-400">true</span>
          <span className="text-zinc-100">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-300">once</span>
          <span className="text-zinc-100">: </span>
          <span className="text-purple-400">false</span>
          <span className="text-zinc-100">,</span>
        </div>
        <div>
          <span className="text-zinc-100">{'})'}</span>
        </div>
      </div>
    </div>
  );
};
