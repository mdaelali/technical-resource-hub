import { useCallback } from 'react';
import useUserStorage from './useUserStorage.js';

const MAX_ENTRIES = 8;

export default function useRecentlyViewed()
{
  const [entries, setEntries] = useUserStorage('recentlyViewed', []);

  const record = useCallback((entry) =>
  {
    setEntries((prev) =>
    {
      const filtered = (prev || []).filter((e) => e.key !== entry.key);
      const next = [{ ...entry, viewedAt: Date.now() }, ...filtered];
      return next.slice(0, MAX_ENTRIES);
    });
  }, [setEntries]);

  const clear = useCallback(() => setEntries([]), [setEntries]);

  return [entries || [], record, clear];
}
