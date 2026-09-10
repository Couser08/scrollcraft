'use client';

/**
 * Grayscale monochrome brand logos for "TRUSTED BY CREATORS"
 * Strictly under 650 LOC.
 */

import React from 'react';

export const BrandLogos: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-90 ${className}`}>
      {/* Vercel */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L24 22H0L12 2Z" />
        </svg>
        <span>Vercel</span>
      </div>

      {/* Tailwind CSS */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-6 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
        </svg>
        <span>tailwindcss</span>
      </div>

      {/* Framer */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
        <span>Framer</span>
      </div>

      {/* Notion */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.093-.373L17.85 1.55c-.56-.42-1.307-.7-2.146-.607L2.406 2.296c-.466.046-.56.326-.373.56zm.793 4.292v12.27c0 .793.42 1.167 1.307 1.12l14.288-.84c.887-.046 1.073-.606 1.073-1.353V7.754c0-.747-.326-1.12-1.12-1.073l-14.474.84c-.793.047-1.074.42-1.074.98zm12.695 1.353c.093.42 0 .84-.373.887l-.7.14v7.745c-.373.233-.887.373-1.307.373-.7 0-1.073-.28-1.54-.887l-4.152-6.578v6.485l1.4.327c.047.42-.233.84-.606.84l-3.36.233c-.093-.42.094-.84.42-.887l.84-.187V11.16l-1.027-.093c-.093-.42.14-.84.56-.887l3.687-.234 4.385 6.766V10.6l-1.26-.14c-.093-.42.187-.84.607-.887z" />
        </svg>
        <span>Notion</span>
      </div>

      {/* Spotify */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.307a.75.75 0 0 1-1.031.25c-2.825-1.727-6.38-2.118-10.57-1.16a.75.75 0 1 1-.336-1.462c4.587-1.047 8.528-.601 11.687 1.341a.75.75 0 0 1 .25 1.031zm1.468-3.266a.938.938 0 0 1-1.288.31c-3.233-1.987-8.163-2.56-11.988-1.4a.938.938 0 0 1-.55-1.794c4.37-1.326 9.805-.688 13.516 1.596a.938.938 0 0 1 .31 1.288zm.126-3.41c-3.877-2.302-10.28-2.514-13.99-1.388a1.125 1.125 0 1 1-.656-2.155c4.27-1.296 11.34-1.048 15.82 1.611a1.125 1.125 0 1 1-1.174 1.932z" />
        </svg>
        <span>Spotify</span>
      </div>

      {/* Linear */}
      <div className="flex items-center gap-2 text-zinc-700 font-semibold tracking-tight text-sm sm:text-base">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M2.204 14.542l9.754-9.754a1.5 1.5 0 0 1 2.122 0l7.716 7.716a1.5 1.5 0 0 1 0 2.122l-9.754 9.754a1.5 1.5 0 0 1-2.122 0l-7.716-7.716a1.5 1.5 0 0 1 0-2.122zm1.414 1.414l6.302 6.302a.5.5 0 0 0 .707 0l8.34-8.34-7.01-7.009-8.339 8.34a.5.5 0 0 0 0 .707z" />
        </svg>
        <span>Linear</span>
      </div>
    </div>
  );
};

