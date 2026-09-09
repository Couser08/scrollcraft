'use client';

import React from 'react';

interface ScrollCraftLogoProps {
  variant?: 'icon' | 'full' | 'badge' | 'lockup-dark' | 'lockup-light' | 'app-orange' | 'app-dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badgeText?: string;
}

export const ScrollCraftEmblem: React.FC<{ size?: number; className?: string; color?: string; background?: string }> = ({
  size = 28,
  className = '',
  color = '#FFFFFF',
  background = '#FF5A1F',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="ScrollCraft logo"
    >
      {background && <circle cx="16" cy="16" r="16" fill={background} />}
      {/* Dynamic kinetic spiral scroll geometry */}
      <path
        d="M16 6.5C10.75 6.5 6.5 10.75 6.5 16C6.5 21.25 10.75 25.5 16 25.5C20.15 25.5 23.75 22.85 25.05 19.05C25.45 17.9 24.5 16.8 23.35 16.8C22.5 16.8 21.75 17.35 21.45 18.15C20.5 20.7 18 22.5 15.1 22.25C12.1 22 9.7 19.45 9.7 16.4C9.7 13.2 12.3 10.6 15.5 10.6C18.25 10.6 20.6 12.35 21.4 14.85C21.7 15.7 22.5 16.25 23.4 16.15C24.55 16.05 25.25 14.9 24.8 13.85C23.4 9.6 19.95 6.5 16 6.5Z"
        fill={color}
      />
      <circle cx="16" cy="16" r="2.6" fill={color} />
    </svg>
  );
};

export const ScrollCraftLogo: React.FC<ScrollCraftLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  badgeText = 'v0.1.0',
}) => {
  const sizeConfig = {
    sm: { iconSize: 22, textSize: 'text-sm font-bold', badgeSize: 'text-[10px] px-1.5 py-0.5' },
    md: { iconSize: 28, textSize: 'text-base font-bold', badgeSize: 'text-[11px] px-2 py-0.5' },
    lg: { iconSize: 36, textSize: 'text-xl font-bold', badgeSize: 'text-xs px-2.5 py-0.5' },
    xl: { iconSize: 48, textSize: 'text-3xl font-extrabold', badgeSize: 'text-xs px-3 py-1' },
  }[size];

  if (variant === 'icon') {
    return <ScrollCraftEmblem size={sizeConfig.iconSize} className={className} />;
  }

  if (variant === 'app-orange') {
    return (
      <div className={`w-12 h-12 rounded-[12px] bg-[#FF5A1F] flex items-center justify-center shadow-sm ${className}`}>
        <ScrollCraftEmblem size={26} background="" color="#FFFFFF" />
      </div>
    );
  }

  if (variant === 'app-dark') {
    return (
      <div className={`w-12 h-12 rounded-[12px] bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shadow-sm ${className}`}>
        <ScrollCraftEmblem size={26} background="" color="#FF5A1F" />
      </div>
    );
  }

  if (variant === 'lockup-dark') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-[#0A0A0A] border border-[#262626] text-white shadow-sm ${className}`}>
        <ScrollCraftEmblem size={22} color="#FFFFFF" background="#FF5A1F" />
        <span className="font-bold tracking-tight text-white text-sm">ScrollCraft</span>
      </div>
    );
  }

  if (variant === 'lockup-light') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[#0A0A0A] shadow-sm ${className}`}>
        <ScrollCraftEmblem size={22} color="#FFFFFF" background="#FF5A1F" />
        <span className="font-bold tracking-tight text-[#0A0A0A] text-sm">ScrollCraft</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <ScrollCraftEmblem size={sizeConfig.iconSize} />
      <span className={`${sizeConfig.textSize} text-[#0A0A0A] tracking-tight font-sans`}>
        ScrollCraft
      </span>
      {variant === 'badge' && (
        <span
          className={`${sizeConfig.badgeSize} rounded-full font-mono font-medium bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] leading-none`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};
