'use client';

import React, { useRef, useEffect } from 'react';
import { ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface SkewGalleryProps {
  images: string[];
  className?: string;
  intensity?: number;
}

export const SkewGallery: React.FC<SkewGalleryProps> = ({ images, className = '', intensity = 0.05 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const taskId = `skew-gallery-${Math.random().toString(36).slice(2, 8)}`;
    
    // We want to apply skew based on scroll velocity.
    let currentSkew = 0;
    
    ticker.add(taskId, 'render', () => {
      const velocity = engine?.getMetrics().velocity || 0;
      
      // Lerp the skew for smoothness
      const targetSkew = velocity * intensity;
      currentSkew += (targetSkew - currentSkew) * 0.1;
      
      // Apply skew directly to DOM
      container.style.transform = `skewY(${currentSkew}deg)`;
    });

    return () => {
      ticker.remove(taskId);
      container.style.transform = '';
    };
  }, [engine, intensity]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 gap-6 will-change-transform">
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt={`Gallery Image ${idx}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
