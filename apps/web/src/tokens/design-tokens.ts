/**
 * Design Token Constants (TypeScript Mirror)
 * Strictly under 650 LOC.
 */

export const DESIGN_TOKENS = {
  colors: {
    canvas: {
      bg: '#0a0a0c',
      subtle: '#0f1015',
      editor: '#121318',
      card: '#15161d',
      cardGlass: 'rgba(21, 22, 29, 0.85)',
    },
    brand: {
      blue: '#2563eb',
      blueHover: '#1d4ed8',
      cyan: '#38bdf8',
      emerald: '#10b981',
      purple: '#8b5cf6',
      amber: '#f59e0b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      muted: '#64748b',
      dim: '#475569',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      card: 'rgba(255, 255, 255, 0.12)',
      bright: 'rgba(255, 255, 255, 0.22)',
    },
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
} as const;
