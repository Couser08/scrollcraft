'use client';

/**
 * Hand-drawn aesthetic SVG arrows and callout components
 * Strictly under 650 LOC.
 */

import React from 'react';

export const HeroDoodleArrow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-end pointer-events-none select-none ${className}`}>
      <span className="font-handwriting text-xl sm:text-2xl text-zinc-700 tracking-wide transform -rotate-6 whitespace-nowrap">
        Just a few lines and you're ready
      </span>
      <svg
        className="w-24 h-14 text-zinc-500 transform -rotate-12 -mt-1 mr-4"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 15 C 35 5, 75 8, 85 42"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="200"
          fill="none"
        />
        <path
          d="M74 38 L 86 44 L 88 30"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const HowItWorksDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-center pointer-events-none select-none ${className}`}>
      <span className="font-handwriting text-lg sm:text-xl text-zinc-700 font-semibold tracking-wide transform -rotate-3 text-center leading-tight">
        Scroll. Animate.<br />Create impact.
      </span>
      <svg
        className="w-20 h-16 text-zinc-500 transform rotate-12 -mt-1 ml-2"
        viewBox="0 0 80 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 10 C 25 35, 45 45, 65 52"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M52 53 L 66 54 L 62 40"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const CtaBannerDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-start pointer-events-none select-none ${className}`}>
      <span className="font-handwriting text-xl sm:text-2xl text-zinc-300 font-medium tracking-wide transform rotate-3 whitespace-nowrap">
        Small interactions.<br />Big experiences.
      </span>
    </div>
  );
};

