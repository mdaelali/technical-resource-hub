import { useEffect, useState } from 'react';

export default function useTheme()
{
  const [theme, setTheme] = useState(() =>
  {
    try
    {
      const saved = window.localStorage.getItem('trh.theme.v2');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    catch
    {
      // Private browsing can block local storage; fall back to the device theme.
    }
    return 'light';
  });

  useEffect(() =>
  {
    const root = document.documentElement;
    if (theme === 'light')
    {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    else
    {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    try
    {
      window.localStorage.setItem('trh.theme.v2', theme);
    }
    catch
    {
      // The selected theme still applies for this page session.
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle];
}
