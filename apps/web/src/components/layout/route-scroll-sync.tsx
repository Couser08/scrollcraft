'use client';

/**
 * RouteScrollSync - Next.js App Router Transition & History Restoration Sync
 * Powered by @scrollcraft/react useScrollRestoration().
 * Eliminates route-jump jitter, cancels in-flight inertia, restores scroll on popstate,
 * supports hash anchors, and retries positioning across RSC streaming hydration shifts.
 */

import { usePathname } from 'next/navigation';
import { useScrollRestoration } from '@scrollcraft/react';

export function RouteScrollSync() {
  const pathname = usePathname();

  useScrollRestoration({
    routeKey: pathname,
    scrollToTopOnPush: true,
    retryFrames: 3,
  });

  return null;
}
