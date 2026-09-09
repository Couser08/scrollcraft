'use client';

/**
 * macOS Traffic Lights Window Controls
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';

export const TrafficLights: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
    </div>
  );
};
