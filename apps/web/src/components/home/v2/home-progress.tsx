'use client';

import React from 'react';
import { ScrollProgress } from '@scrollcraft/react';

export function HomeProgressV2() {
  return (
    <ScrollProgress
      aria-hidden
      className="fixed top-16 inset-x-0 z-40 h-[2px] bg-[#FF5A1F] pointer-events-none"
    />
  );
}
