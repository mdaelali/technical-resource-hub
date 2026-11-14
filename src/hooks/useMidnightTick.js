import { useEffect, useState } from 'react';
import { localDateKey } from '../utils/dates.js';

/*
 * Returns today's local date key and re-renders the caller when the local
 * date changes (at 00:00), so a page left open overnight resets its daily
 * state without a refresh. Also re-checks when the tab becomes visible,
 * because timers are throttled or paused in background tabs.
 */
export default function useMidnightTick()
{
  const [today, setToday] = useState(() => localDateKey());

  useEffect(() =>
  {
    let handle = 0;
    function check()
    {
      const now = localDateKey();
      setToday((current) => (current === now ? current : now));
      schedule();
    }
    function schedule()
    {
      window.clearTimeout(handle);
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      handle = window.setTimeout(check, Math.max(1000, next.getTime() - now.getTime()));
    }
    function onVisible()
    {
      if (document.visibilityState === 'visible') check();
    }
    schedule();
    document.addEventListener('visibilitychange', onVisible);
    return () =>
    {
      window.clearTimeout(handle);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return today;
}
