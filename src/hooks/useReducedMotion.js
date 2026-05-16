import { useEffect, useState } from 'react';

/*
 * Subscribes to the prefers-reduced-motion media query so consumers can skip
 * non-essential animations without restarting the app.
 */
export default function useReducedMotion()
{
  const [reduced, setReduced] = useState(() =>
  {
    if (typeof window === 'undefined' || !window.matchMedia)
    {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() =>
  {
    if (typeof window === 'undefined' || !window.matchMedia)
    {
      return undefined;
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event) => setReduced(event.matches);
    if (mql.addEventListener)
    {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  return reduced;
}
