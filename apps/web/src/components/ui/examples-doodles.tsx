'use client';

/**
 * Hand-drawn doodle callouts for Examples and Playground pages
 * Strictly under 650 LOC.
 */

import React from 'react';

export const MakeItYoursDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-center pointer-events-none select-none ${className}`}>
      <span className="font-handwriting text-lg sm:text-xl text-zinc-700 tracking-wide transform -rotate-3 whitespace-nowrap">
        Make<br />it yours.
      </span>
      <svg
        className="w-14 h-12 text-zinc-500 transform -rotate-12 -mt-1"
        viewBox="0 0 60 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 5 C 20 20, 15 35, 12 42"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 34 L 12 43 L 20 38"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const TryItYourselfDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex items-center gap-2 pointer-events-none select-none ${className}`}>
      <svg
        className="w-16 h-8 text-zinc-400 transform -scale-x-100 rotate-12"
        viewBox="0 0 70 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 25 C 28 8, 45 10, 58 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M48 10 L 60 15 L 53 23"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-handwriting text-base sm:text-lg text-zinc-600 font-medium tracking-wide whitespace-nowrap">
        Try it yourself.<br />No setup needed.
      </span>
    </div>
  );
};

export const PlaygroundDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-flex flex-col items-center pointer-events-none select-none ${className}`}>
      <span className="font-handwriting text-base sm:text-lg text-zinc-700 font-semibold tracking-wide transform -rotate-3 text-center leading-tight whitespace-nowrap">
        Play.<br />Experiment.<br />Make it yours.
      </span>
      <svg
        className="w-16 h-12 text-zinc-500 transform rotate-12 -mt-1"
        viewBox="0 0 70 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 8 C 25 22, 38 32, 52 38"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M42 38 L 53 40 L 49 28"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
