/**
 * ScrollCraft Design Token Constants (TypeScript Mirror)
 * Strictly aligned with ScrollCraft Design System specification (Image 1).
 * Strictly under 650 LOC.
 */

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      primary: '#FF5A1F',
      primaryHover: '#E54800',
      orangeTint: '#FFF7ED',
      orangeBorder: '#FFEDD5',
    },
    canvas: {
      background: '#FAFAF9',
      surface: '#FFFFFF',
      subtle: '#F3F4F6',
      card: '#FFFFFF',
      cardDark: '#0A0A0A',
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#6B7280',
      muted: '#9CA3AF',
      dim: '#D1D5DB',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E5E7EB',
      subtle: '#F3F4F6',
      dark: '#262626',
    },
    status: {
      success: '#16A34A',
      successBg: '#F0FDF4',
      successBorder: '#DCFCE7',
      warning: '#F59E0B',
      warningBg: '#FFFBEB',
      warningBorder: '#FEF3C7',
      error: '#EF4444',
      errorBg: '#FEF2F2',
      errorBorder: '#FEE2E2',
      info: '#3B82F6',
      infoBg: '#EFF6FF',
      infoBorder: '#DBEAFE',
    },
  },
  typography: {
    fontFamily: {
      sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
    scale: {
      h1: { size: '72px', weight: 700, letterSpacing: '-0.02em', lineHeight: '1.05' },
      h2: { size: '48px', weight: 700, letterSpacing: '-0.02em', lineHeight: '1.1' },
      h3: { size: '32px', weight: 600, letterSpacing: '-0.01em', lineHeight: '1.2' },
      h4: { size: '20px', weight: 600, letterSpacing: '0em', lineHeight: '1.3' },
      body: { size: '16px', weight: 400, letterSpacing: '0em', lineHeight: '1.5' },
      small: { size: '14px', weight: 400, letterSpacing: '0em', lineHeight: '1.5' },
      caption: { size: '12px', weight: 400, letterSpacing: '0em', lineHeight: '1.5' },
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 24px rgba(0, 0, 0, 0.08)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.10)',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
