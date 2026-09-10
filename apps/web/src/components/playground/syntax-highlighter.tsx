'use client';

import React, { useMemo } from 'react';

interface SyntaxHighlighterProps {
  code: string;
  className?: string;
  showLineNumbers?: boolean;
}

/**
 * Tokenizes a line of JSX / TypeScript into syntax-colored spans
 * Dark Studio Theme (VS Code / Tokyo Night palette)
 */
function tokenizeLine(line: string): React.ReactNode[] {
  // Comment line
  if (line.trim().startsWith('//')) {
    return [<span key="comment" className="text-zinc-500 italic">{line}</span>];
  }

  // Tokenization regular expressions
  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(".*?"|'.*?'|`.*?`)|(\b(?:import|export|from|const|function|return|default|interface|type|extends|let|var)\b)|(<\/?(?:[A-Z][A-Za-z0-9]*|[a-z]+)|(?:\/>|>))|(\b(?:asChild|speed|direction|distance|duration|stiffness|damping|mass|scrub|baseSpeed|velocityMultiplier|strength|threshold|once|ref|className|key)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=:])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const [full, comment, str, keyword, tag, prop, num, punct] = match;

    if (comment) {
      nodes.push(<span key={match.index} className="text-zinc-500 italic">{comment}</span>);
    } else if (str) {
      nodes.push(<span key={match.index} className="text-emerald-400 font-medium">{str}</span>);
    } else if (keyword) {
      nodes.push(<span key={match.index} className="text-rose-400 font-semibold">{keyword}</span>);
    } else if (tag) {
      // Differentiate React Components (uppercase) from HTML tags
      const isComponent = /^<\/?[A-Z]/.test(tag);
      nodes.push(
        <span
          key={match.index}
          className={isComponent ? 'text-sky-400 font-bold' : 'text-blue-400 font-medium'}
        >
          {tag}
        </span>
      );
    } else if (prop) {
      nodes.push(<span key={match.index} className="text-amber-300 font-medium">{prop}</span>);
    } else if (num) {
      nodes.push(<span key={match.index} className="text-purple-400 font-mono font-semibold">{num}</span>);
    } else if (punct) {
      nodes.push(<span key={match.index} className="text-zinc-400">{punct}</span>);
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

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = React.memo(({
  code,
  className = '',
  showLineNumbers = true,
}) => {
  const lines = useMemo(() => code.trim().split('\n'), [code]);

  return (
    <pre className={`font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300 select-text ${className}`}>
      <code>
        {lines.map((line, idx) => (
          <div key={idx} className="table-row">
            {showLineNumbers && (
              <span className="table-cell pr-4 text-right select-none text-zinc-600 text-[11px] w-8">
                {idx + 1}
              </span>
            )}
            <span className="table-cell whitespace-pre">{tokenizeLine(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
});

SyntaxHighlighter.displayName = 'SyntaxHighlighter';
