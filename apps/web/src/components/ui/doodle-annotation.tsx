'use client';

import React from 'react';

export const DoodleAnnotation: React.FC<{ className?: string; text?: string }> = ({
  className = '',
  text = 'Real-time preview',
}) => {
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none ${className}`}>
      <span
        style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive, sans-serif" }}
        className="text-xs sm:text-sm font-bold text-[#0A0A0A] -rotate-6 tracking-wide"
      >
        {text}
      </span>
      <svg
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#0A0A0A] -scale-x-100 rotate-12 -mt-1"
      >
        {/* Curved hand-drawn arrow pointing to preview */}
        <path
          d="M38 4C30 10 18 16 8 26M8 26L16 26M8 26L10 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
