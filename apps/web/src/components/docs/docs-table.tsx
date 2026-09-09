'use client';

/**
 * Docs API Props Table Component
 * Displays component props and parameters with types, defaults, and descriptions.
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
    <div className="my-6 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
      {title && (
        <div className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
            {title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-700 border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50 text-xs font-semibold text-zinc-600">
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Default</th>
              <th className="py-3 px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {props.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-zinc-50/60 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-xs font-semibold text-zinc-950 whitespace-nowrap">
                  {row.name}
                  {row.required && (
                    <span className="ml-1.5 text-[10px] text-amber-600 font-sans font-medium">
                      required
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-blue-700">
                    {row.type}
                  </code>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-500 whitespace-nowrap">
                  {row.defaultValue || '—'}
                </td>
                <td className="py-3 px-4 text-xs text-zinc-600 leading-relaxed min-w-[200px]">
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
