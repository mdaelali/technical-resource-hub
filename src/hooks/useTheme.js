import { useEffect, useState } from 'react';

export default function useTheme()
{
  const [theme, setTheme] = useState(() =>
  {
    const saved = localStorage.getItem('trh.theme');
    if (saved)
    {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
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
    localStorage.setItem('trh.theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle];
}
