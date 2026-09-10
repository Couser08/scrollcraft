'use client';

/**
 * Docs API Props Table Component
 * Displays component props and parameters with types, defaults, and descriptions.
 * Aligned with ScrollCraft design tokens.
 * Strictly under 650 LOC.
 */

import React from 'react';

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

interface DocsTableProps {
  title?: string;
  props: PropRow[];
}

export const DocsTable: React.FC<DocsTableProps> = ({ title, props }) => {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-white/10/90 bg-white/5 shadow-xs">
      {title && (
        <div className="border-b border-white/10/80 bg-white/5/70 px-4 py-2.5 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-300">
            {title}
          </h4>
          <span className="text-[11px] font-mono text-zinc-500">
            {props.length} {props.length === 1 ? 'property' : 'properties'}
          </span>
        </div>
      )}
      <div className="w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10/80 bg-white/5/50 text-[11px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
              <th className="py-2.5 px-4 w-[22%]">Property</th>
              <th className="py-2.5 px-4 w-[28%]">Type</th>
              <th className="py-2.5 px-4 w-[16%]">Default</th>
              <th className="py-2.5 px-4 w-[34%]">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {props.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-white/5/50 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-xs font-medium text-zinc-100 align-top">
                  <span className="text-zinc-100 font-semibold break-words">{row.name}</span>
                  {row.required && (
                    <span className="block sm:inline-block sm:ml-2 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold mt-1 sm:mt-0">
                      required
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 align-top">
                  <code className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[11px] text-purple-400 font-medium border border-white/10/80 break-words inline-block leading-relaxed">
                    {row.type}
                  </code>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-500 align-top break-words">
                  {row.defaultValue ? (
                    <span className="text-zinc-300 font-medium">{row.defaultValue}</span>
                  ) : (
                    <span className="text-zinc-500">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-xs text-zinc-400 leading-relaxed align-top break-words">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

