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
    <div className="my-6 w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
      {title && (
        <div className="border-b border-[#E5E7EB] bg-[#FAFAF9] px-4 py-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            {title}
          </h4>
          <span className="text-[10px] font-mono text-[#6B7280]">
            {props.length} properties
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#0A0A0A] border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]/80 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Default</th>
              <th className="py-3 px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {props.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-[#FAFAF9]/60 transition-colors"
              >
                <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#0A0A0A] whitespace-nowrap">
                  {row.name}
                  {row.required && (
                    <span className="ml-1.5 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#FF5A1F] border border-[#FFEDD5] font-bold">
                      required
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <code className="rounded-md bg-[#F3F4F6] px-2 py-0.5 font-mono text-[11px] text-[#0A0A0A] border border-[#E5E7EB]">
                    {row.type}
                  </code>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#6B7280] whitespace-nowrap">
                  {row.defaultValue || '—'}
                </td>
                <td className="py-3.5 px-4 text-xs text-[#6B7280] leading-relaxed min-w-[220px]">
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
