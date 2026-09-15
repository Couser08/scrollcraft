import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ScrollCraft — The Scroll Engine React Never Had';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#070709',
          color: '#ffffff',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Ambient Violet Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-5%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(7, 7, 9, 0) 70%)',
          }}
        />

        {/* Top Header Lockup */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Violet Ribbon S Emblem */}
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path
                d="M24 20C21.79 20 20 21.79 20 24V28C20 30.21 21.79 32 24 32H38C40.21 32 42 30.21 42 28V24C42 21.79 40.21 20 38 20H24Z"
                fill="#8B5CF6"
              />
              <path
                d="M20 28C20 32.42 23.58 36 28 36H36C40.42 36 44 39.58 44 44C44 48.42 40.42 52 36 52H22C17.58 52 14 48.42 14 44C14 39.58 17.58 36 22 36"
                stroke="#7C3AED"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42 24C42 19.58 38.42 16 34 16H24C19.58 16 16 19.58 16 24"
                stroke="#A78BFA"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              ScrollCraft
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              color: '#c4b5fd',
              fontSize: '14px',
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.15em',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#8B5CF6',
              }}
            />
            <span>BETA RELEASE</span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '850px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '62px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              marginBottom: '20px',
            }}
          >
            The scroll engine React never had.
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            Composable primitives and reactive hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, zero React re-renders.
          </div>
        </div>

        {/* Bottom Specs Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            zIndex: 10,
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: '#0e1117',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>BUNDLE SIZE</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>&lt; 4.2 KB gzip</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: '#0e1117',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>RE-RENDERS</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#34d399' }}>0 on Active Scroll</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: '#0e1117',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>PHYSICS</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#c4b5fd' }}>Lenis Game Ticker</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: '#0e1117',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>ARCHITECTURE</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>RSC & Next.js 15 Ready</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
