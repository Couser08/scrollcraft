import React from 'react';

/**
 * Root Loading Skeleton for ScrollCraft
 * Strictly under 650 LOC.
 */

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 flex flex-col justify-center items-center gap-4">
      <div className="w-10 h-10 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase animate-pulse">
        Initializing Engine...
      </p>
    </div>
  );
}
