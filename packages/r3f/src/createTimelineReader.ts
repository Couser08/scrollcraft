/**
 * ScrollCraft Bridge: ViewTimeline Polling Reader (Tier 1)
 * Harnesses WAAPI currentTime to read compositor-driven timeline progress synchronously.
 * Strictly under 650 LOC.
 */

export function createTimelineReader(
  subject: Element,
  axis: 'block' | 'inline' = 'block'
) {
  // Graceful degradation for Safari/Firefox
  // @ts-ignore - ViewTimeline is not in standard TS lib yet
  if (typeof ViewTimeline === 'undefined' || typeof Animation === 'undefined') {
    return null;
  }

  try {
    // @ts-ignore
    const timeline = new ViewTimeline({ subject, axis });
    
    // Dummy animation - we never play it, we just attach it to read the timeline progress
    const probe = new Animation(
      new KeyframeEffect(null, null, { duration: 1, fill: 'both' }),
      timeline
    );
    
    // Start it so the timeline binds, then immediately pause to prevent playback
    probe.play();
    probe.pause();

    return {
      read: (): number => {
        const ct = probe.currentTime;
        // WAAPI returns CSSNumericValue or number depending on spec draft version in browsers
        if (ct === null) return 0;
        
        // Normalize 0-100% to 0.0 - 1.0 progress
        // @ts-ignore
        const value = typeof ct === 'number' ? ct : ct.value;
        return Math.min(Math.max(value / 100, 0), 1);
      },
      destroy: () => {
        probe.cancel(); // Critical to prevent WAAPI memory leaks in SPA routing
      }
    };
  } catch (e) {
    // Failsafe catch if a browser partially implements the spec but crashes on dummy effects
    console.warn('[ScrollCraft] Native ViewTimeline probe failed, falling back to JS.', e);
    return null;
  }
}
