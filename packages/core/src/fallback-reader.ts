/**
 * JS Fallback Reader for ScrollCraft R3F Bridge
 * Computes intersection progress manually when ViewTimeline is unavailable.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export function createFallbackReader(
  subject: Element,
  axis: 'block' | 'inline' = 'block'
) {
  // We use ResizeObserver to keep measurements updated without forcing layout in the read loop
  let elementTop = 0;
  let elementHeight = 0;
  let elementLeft = 0;
  let elementWidth = 0;
  let windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  const measure = () => {
    const rect = subject.getBoundingClientRect();
    if (axis === 'block') {
      const scrollTop = window.scrollY || window.pageYOffset;
      elementTop = rect.top + scrollTop;
      elementHeight = rect.height;
      windowHeight = window.innerHeight;
    } else {
      const scrollLeft = window.scrollX || window.pageXOffset;
      elementLeft = rect.left + scrollLeft;
      elementWidth = rect.width;
      windowWidth = window.innerWidth;
    }
  };

  // Initial measure
  measure();

  // Listen to resizes
  window.addEventListener('resize', measure, { passive: true });
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(subject);
  }

  return {
    read: () => {
      if (axis === 'block') {
        const scrollY = window.scrollY || window.pageYOffset;
        const maxScroll = windowHeight + elementHeight;
        if (maxScroll <= 0) return 0;
        
        // Progress: 0 when top of element hits bottom of viewport
        // 1 when bottom of element hits top of viewport
        const scrolledPastViewportBottom = scrollY + windowHeight - elementTop;
        return clamp(scrolledPastViewportBottom / maxScroll, 0, 1);
      } else {
        const scrollX = window.scrollX || window.pageXOffset;
        const maxScroll = windowWidth + elementWidth;
        if (maxScroll <= 0) return 0;

        const scrolledPastViewportRight = scrollX + windowWidth - elementLeft;
        return clamp(scrolledPastViewportRight / maxScroll, 0, 1);
      }
    },
    destroy: () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
    }
  };
}
