import React from 'react';

/** Shared home v2 section chrome — spacing, label, title rhythm. */
export function SectionShell({
  id,
  index,
  label,
  title,
  description,
  children,
  className = '',
  headerClassName = '',
}: {
  id?: string;
  index?: string;
  label?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`w-full border-t border-[#E7E5E4] py-20 sm:py-24 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(label || title) && (
          <header className={`max-w-2xl mb-10 sm:mb-14 ${headerClassName}`}>
            {index || label ? (
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#FF5A1F] mb-3">
                {index ? `${index}  ·  ` : ''}
                {label}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A] leading-[1.15]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 text-base text-[#78716C] leading-relaxed max-w-xl">{description}</p>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] bg-[#0A0A0A] hover:bg-[#1C1917] text-white text-sm font-semibold transition-colors';

export const btnSecondary =
  'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] bg-white hover:bg-[#F5F5F4] border border-[#E7E5E4] text-[#0A0A0A] text-sm font-semibold transition-colors';
