import { useCallback } from 'react';
import useUserStorage from './useUserStorage.js';
import { calendarDaysBetween, localDateKey } from '../utils/dates.js';

/*
 * Auto-streak: any time logActivity() is called, the streak advances if today
 * is a new day relative to the last logged date. Idempotent — safe to call from
 * many places per day. Streak resets to 1 if the user skips one or more full days.
 */
export default function useStreak()
{
  const [streak, setStreak] = useUserStorage('streak', { count: 0, last: null });

  const logActivity = useCallback(() =>
  {
    const today = localDateKey();
    setStreak((prev) =>
    {
      if (prev?.last === today)
      {
        return prev;
      }
      if (!prev?.last)
      {
        return { count: 1, last: today };
      }
      const diff = calendarDaysBetween(prev.last, today);
      if (diff === 1)
      {
        return { count: (prev.count || 0) + 1, last: today };
      }
      return { count: 1, last: today };
    });
  }, [setStreak]);

  return [streak || { count: 0, last: null }, logActivity];
}
