'use client';

/**
 * RouteScrollSync - Next.js App Router Transition Scroll Synchronizer
 * Immediately stops any in-flight inertia lerp and resets scroll to top on route change.
 * Eliminates jitter, lerp-fighting, and viewport displacement across page transitions.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollCraft } from '@scrollcraft/react';

export function RouteScrollSync() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { scrollTo, resize } = useScrollCraft();

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      
      // Immediately reset scroll without smooth animation to eliminate transition jitter
      scrollTo(0, { immediate: true });
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
      
      // Allow the new page DOM to paint, then recalculate engine limits
      const rafId = requestAnimationFrame(() => {
        resize();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [pathname, scrollTo, resize]);

  return null;
}
