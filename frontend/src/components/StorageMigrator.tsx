'use client';

import { useEffect } from 'react';

export function StorageMigrator() {
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const keysToMigrate = Object.keys(localStorage).filter((k) => k.startsWith('reory_'));
      for (const oldKey of keysToMigrate) {
        const newKey = oldKey.replace('reory_', 'duocard_');
        // Only set newKey if not already set, then preserve or clean up
        if (!localStorage.getItem(newKey)) {
          const val = localStorage.getItem(oldKey);
          if (val !== null) {
            localStorage.setItem(newKey, val);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}
