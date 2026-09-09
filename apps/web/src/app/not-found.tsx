import React from 'react';
import Link from 'next/link';

/**
 * 404 Not Found Page for ScrollCraft
 * Strictly under 650 LOC.
 */

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-black text-zinc-900 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-zinc-800 mb-4">Page Not Found</h2>
      <p className="text-sm text-zinc-500 max-w-md mb-8">
        The scroll destination you requested does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
      >
        Return to Overview
      </Link>
    </div>
  );
}
