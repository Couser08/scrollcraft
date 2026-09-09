'use client';

/**
 * Playground Code Editor with HTML, CSS, JS Tabs & Line Numbers
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';

interface PlaygroundEditorProps {
  html: string;
  css: string;
  js: string;
  onCodeChange: (tab: 'html' | 'css' | 'js', value: string) => void;
  onReset: () => void;
}

export const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({
  html,
  css,
  js,
  onCodeChange,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return html;
      case 'css':
        return css;
      case 'js':
        return js;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentCode = getCurrentCode();
  const lines = currentCode.split('\n');

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0c0e14] border border-zinc-800 shadow-xl overflow-hidden select-none">
      {/* Top Header Bar with Tabs & Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#090b10]">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'html'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'css'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            CSS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'js'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            JavaScript
          </button>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers & Editable Area */}
      <div className="flex flex-1 p-4 overflow-hidden font-mono-code text-[12px] sm:text-[13px] leading-relaxed">
        {/* Line Numbers Gutter */}
        <div className="select-none pr-3 text-right text-zinc-600 border-r border-zinc-800/80 mr-3 min-w-[28px]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Editable Text Area */}
        <textarea
          value={currentCode}
          onChange={(e) => onCodeChange(activeTab, e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-zinc-200 outline-none resize-none overflow-y-auto whitespace-pre font-mono-code focus:outline-none scrollbar-thin"
        />
      </div>
    </div>
  );
};
