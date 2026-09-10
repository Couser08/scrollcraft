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
    <div className="my-6 w-full overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-xs">
      {title && (
        <div className="border-b border-zinc-200/80 bg-zinc-50/70 px-4 py-2.5 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-800">
            {title}
          </h4>
          <span className="text-[11px] font-mono text-zinc-500">
            {props.length} {props.length === 1 ? 'property' : 'properties'}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-[11px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
              <th className="py-2.5 px-4">Property</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Default</th>
              <th className="py-2.5 px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {props.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-xs font-medium text-zinc-900 whitespace-nowrap">
                  <span className="text-zinc-900 font-semibold">{row.name}</span>
                  {row.required && (
                    <span className="ml-2 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                      required
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <code className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-purple-700 font-medium border border-zinc-200/80">
                    {row.type}
                  </code>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-500 whitespace-nowrap">
                  {row.defaultValue ? (
                    <span className="text-zinc-700 font-medium">{row.defaultValue}</span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-xs text-zinc-600 leading-relaxed min-w-[240px]">
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
