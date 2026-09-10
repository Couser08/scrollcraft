import React from 'react';

/**
 * Root Loading Skeleton for ScrollCraft
 * Strictly under 650 LOC.
 */

export default function Loading() {
  return (
    <div className="w-full flex-1 min-h-[50vh] bg-white text-zinc-950 flex flex-col justify-center items-center gap-4">
      <div className="w-8 h-8 border-2 border-[#FF5A1F]/20 border-t-[#FF5A1F] rounded-full animate-spin" />
      <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}
