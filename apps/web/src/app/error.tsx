'use client';

/**
 * Root Error Boundary for ScrollCraft
 * Graceful error recovery with diagnostic information.
 * Strictly under 650 LOC.
 */

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to diagnostic service if configured
    console.error('[ScrollCraft Error Boundary]', error);
  }, [error]);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-center items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Render Pipeline Interrupted
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          An unexpected error occurred in the client animation tree. You can try recovering the session below.
        </p>
        {error.message && (
          <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/10 text-left font-mono text-xs text-zinc-300 overflow-x-auto">
            {error.message}
          </div>
        )}
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Reset Animation Engine
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-zinc-200 rounded-lg text-xs font-medium transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
