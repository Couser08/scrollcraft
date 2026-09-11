'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col pt-32 px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 animate-pulse">
        {/* Skeleton Header */}
        <div className="w-1/3 h-12 bg-zinc-900 rounded-lg"></div>
        <div className="w-2/3 h-6 bg-zinc-900 rounded-lg"></div>
        <div className="w-1/2 h-6 bg-zinc-900 rounded-lg"></div>
        
        {/* Skeleton Content */}
        <div className="mt-12 w-full h-[400px] bg-zinc-900 rounded-2xl"></div>
      </div>
    </div>
  );
}
