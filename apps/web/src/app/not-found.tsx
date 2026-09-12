import React from 'react';
import Link from 'next/link';

/**
 * 404 Not Found Page for ScrollCraft
 * Strictly under 650 LOC.
 */

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-zinc-300 mb-4">Page Not Found</h2>
      <p className="text-sm text-zinc-400 max-w-md mb-8">
        The scroll destination you requested does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
      >
        Return to Overview
      </Link>
    </div>
  );
}
