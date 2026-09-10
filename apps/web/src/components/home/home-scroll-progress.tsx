'use client';

/**
 * Fixed page reading progress — ScrollProgress primitive, zero re-renders.
 */

import React from 'react';
import { ScrollProgress } from '@scrollcraft/react';

export const HomeScrollProgress: React.FC = () => {
  return (
    <ScrollProgress
      aria-hidden
      className="fixed top-16 inset-x-0 z-40 h-0.5 bg-[#FF5A1F] pointer-events-none"
    />
  );
};
