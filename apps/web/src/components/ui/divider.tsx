'use client';

/**
 * Specular Gradient Divider Line
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full relative py-8 ${className}`}>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
};

