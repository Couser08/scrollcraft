'use client';

/**
 * 100% Bespoke Magnetic In-House Button Component
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React, { useRef, useState } from 'react';
import { useMagnetic } from '@scrollcraft/react';
import { ArrowRight } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  withArrow?: boolean;
  magnetic?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  withArrow = false,
  magnetic = true,
  children,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const magneticHandler = useMagnetic({ strength: 0.28, radius: 100 });

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none cursor-pointer outline-none text-sm md:text-base px-6 py-3';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-white text-zinc-950 hover:bg-zinc-100 shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(255,255,255,0.4)] active:scale-95';
  } else if (variant === 'secondary') {
    variantStyles =
      'bg-zinc-900/80 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-800/80 backdrop-blur-md active:scale-95';
  } else {
    variantStyles = 'bg-transparent text-zinc-300 hover:text-white';
  }

  const containerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      ref={(el) => {
        containerRef.current = el;
        if (magnetic) magneticHandler.ref.current = el;
      }}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className={`w-4 h-4 transition-transform duration-200 ${
            isHovered ? 'translate-x-1' : 'translate-x-0'
          }`}
        />
      )}
    </button>
  );
};
