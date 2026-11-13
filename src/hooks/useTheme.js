import { useEffect, useState } from 'react';

export default function useTheme()
{
  const [theme, setTheme] = useState(() =>
  {
    try
    {
      const saved = window.localStorage.getItem('trh.theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    catch
    {
      // Private browsing can block local storage; fall back to the device theme.
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
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
      window.localStorage.setItem('trh.theme', theme);
    }
    catch
    {
      // The selected theme still applies for this page session.
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle];
}
