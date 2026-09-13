'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ExampleSourceViewerProps {
  fileName: string;
  code: string;
  className?: string;
  defaultOpen?: boolean;
}

export const ExampleSourceViewer: React.FC<ExampleSourceViewerProps> = ({
  fileName,
  code,
  className = '',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = code.trim().split('\n').length;

  return (
    <div className={`w-full rounded-2xl border border-white/10 bg-[#09090b]/90 backdrop-blur-md overflow-hidden transition-all duration-300 ${className}`}>
      {/* Top Header Toggle Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="w-full px-4 sm:px-5 py-3 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors border-b border-transparent data-[open=true]:border-white/10 select-none"
        data-open={isOpen}
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-zinc-200">
              View Source
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              {fileName}
            </span>
          </div>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
            ~{lineCount} lines &bull; zero wrapper
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-mono transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          )}

          <div className="p-1 rounded text-zinc-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Code Drawer */}
      {isOpen && (
        <div className="relative p-4 sm:p-5 bg-[#050505] border-t border-white/5 overflow-x-auto max-h-[420px]">
          <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-300 selection:bg-blue-600/30 selection:text-white whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
