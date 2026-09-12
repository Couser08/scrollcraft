'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useCopyToClipboard hook
 * Handles copying text to clipboard safely with try/catch,
 * automatic status reset, and clean unmount timeout handling.
 */
export function useCopyToClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, timeoutMs);

        return true;
      } catch (err) {
        console.error('[ScrollCraft] Failed to copy text to clipboard:', err);
        setCopied(false);
        return false;
      }
    },
    [timeoutMs]
  );

  return { copied, copy };
}
