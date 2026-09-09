/**
 * ScrollCraft Feature Detection
 * Strictly under 650 LOC.
 * 
 * Determines if the browser safely supports CSS Scroll-driven animations.
 * Caches results to avoid repeated CSS.supports overhead.
 */

export interface CapabilityMatrix {
  viewTimeline: boolean;
  animationRange: boolean;
  scrollTimeline: boolean;
  isNativeReady: boolean;
}

let cachedCapabilities: CapabilityMatrix | null = null;

export const Capabilities = {
  /**
   * Lazily evaluates and caches browser capabilities.
   * Granular detection to avoid the Safari/Chrome partial implementation traps.
   */
  get(): CapabilityMatrix {
    if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) {
      return {
        viewTimeline: false,
        animationRange: false,
        scrollTimeline: false,
        isNativeReady: false,
      };
    }

    if (cachedCapabilities !== null) {
      return cachedCapabilities;
    }

    const viewTimeline = CSS.supports('view-timeline-name', '--x');
    const animationRange = CSS.supports('animation-range', 'entry 0% exit 100%');
    const scrollTimeline = CSS.supports('scroll-timeline-name', '--x');

    cachedCapabilities = {
      viewTimeline,
      animationRange,
      scrollTimeline,
      // For a native driver to work safely, we need BOTH viewTimeline and animationRange support.
      // Otherwise, we fallback to JS to prevent visual glitches.
      isNativeReady: viewTimeline && animationRange,
    };

    return cachedCapabilities;
  },

  /**
   * Hard resets the cache. Primarily for testing environments.
   */
  reset(): void {
    cachedCapabilities = null;
  }
};
