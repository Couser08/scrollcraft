'use client';

/**
 * Tokenized CodeViewer Syntax Highlighter Component
 * Features GitHub Light / VS Code Light theme with line numbers and copy functionality.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  fileName?: string;
  className?: string;
}

/**
 * Tokenizes a single line of JSX / TypeScript code into colored spans
 */
function tokenizeLine(line: string): React.ReactNode[] {
  // Handle full-line comments
  if (line.trim().startsWith('//')) {
    return [<span key="comment" className="text-zinc-400 italic">{line}</span>];
  }

  // Regex patterns for TypeScript / JSX tokenization
  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(".*?"|'.*?'|`.*?`)|(\b(?:import|export|from|const|function|return|default|interface|type|extends)\b)|(<\/?(?:Parallax|Reveal|Pin|PinContainer|ScrollProgress|ScrollProvider|motion\.div|div|section|button|h1|h2|h3|p|span)|(?:\/>|>))|(\b(?:asChild|speed|direction|distance|duration|top|bottom|smooth|className|respectReducedMotion|onProgress)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const [full, comment, str, keyword, tag, prop, num, punct] = match;

    if (comment) {
      nodes.push(<span key={match.index} className="text-zinc-400 italic">{comment}</span>);
    } else if (str) {
      nodes.push(<span key={match.index} className="text-emerald-700 font-medium">{str}</span>);
    } else if (keyword) {
      nodes.push(<span key={match.index} className="text-purple-700 font-semibold">{keyword}</span>);
    } else if (tag) {
      nodes.push(<span key={match.index} className="text-blue-700 font-semibold">{tag}</span>);
    } else if (prop) {
      nodes.push(<span key={match.index} className="text-amber-700 font-medium">{prop}</span>);
    } else if (num) {
      nodes.push(<span key={match.index} className="text-indigo-600 font-medium">{num}</span>);
    } else if (punct) {
      nodes.push(<span key={match.index} className="text-zinc-500">{punct}</span>);
    } else {
      nodes.push(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

export const CodeViewer: React.FC<CodeViewerProps> = React.memo(({
  code,
  fileName,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const tokenizedLines = React.useMemo(() => {
    return code.trim().split('\n').map((line) => tokenizeLine(line));
  }, [code]);

  const onCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      className={`rounded-xl bg-[#F8FAFC] border border-zinc-200/90 shadow-2xs overflow-hidden text-xs font-mono select-text transition-all ${className}`}
    >
      {/* Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F1F5F9]/80 border-b border-zinc-200/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          </div>
          {fileName ? (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[11px] text-zinc-700 font-semibold font-mono tracking-tight">
                {fileName}
              </span>
            </div>
          ) : (
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-500 ml-1">
              Code
            </span>
          )}
        </div>

        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700 hover:text-zinc-950 transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area: Light theme, dynamic height without vertical scrollbar */}
      <div className="p-4 overflow-x-auto overflow-y-visible leading-relaxed bg-[#F8FAFC]">
        <table className="w-full border-collapse">
          <tbody>
            {tokenizedLines.map((tokens, idx) => (
              <tr key={idx} className="hover:bg-zinc-200/30 transition-colors">
                <td className="pr-4 text-right text-zinc-400 select-none w-8 align-top font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="text-zinc-900 whitespace-pre font-mono text-[13px] leading-6 w-full">
                  {tokens}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

CodeViewer.displayName = 'CodeViewer';
