'use client';

import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a drawer or modal is open.
 * Restores original scroll style on close and unmount.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLocked) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
}
