import { useCallback, useEffect, useRef, useState } from 'react';

const SYNC_EVENT = 'trh:localStorage:set';

/*
 * Module-level cache of parsed values. Multiple useLocalStorage instances for the
 * same key share one parse, so a screen rendering 5 widgets that each read
 * "trh.user.X.mastered" only pays the JSON.parse cost once.
 */
const cache = new Map();
const SENTINEL = Symbol('uninitialized');

function readCached(key)
{
  if (cache.has(key))
  {
    return cache.get(key);
  }
  try
  {
    const raw = window.localStorage.getItem(key);
    const parsed = raw === null ? SENTINEL : JSON.parse(raw);
    cache.set(key, parsed);
    return parsed;
  }
  catch
  {
    cache.set(key, SENTINEL);
    return SENTINEL;
  }
}

function writeCached(key, value)
{
  cache.set(key, value);
  try
  {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  catch
  {
    /* swallow quota errors */
  }
}

export default function useLocalStorage(key, initial)
{
  const initialRef = useRef(initial);
  const [value, setValue] = useState(() =>
  {
    const cached = readCached(key);
    return cached === SENTINEL ? initial : cached;
  });

  useEffect(() =>
  {
    initialRef.current = initial;
  }, [initial]);

  // When the key changes (for example guest -> signed-in user), read the value
  // stored under the new key instead of carrying the old one across.
  const keyRef = useRef(key);
  useEffect(() =>
  {
    if (keyRef.current === key) return;
    keyRef.current = key;
    const cached = readCached(key);
    setValue(cached === SENTINEL ? initialRef.current : cached);
  }, [key]);

  useEffect(() =>
  {
    function onSync(event)
    {
      if (event.detail?.key === key)
      {
        cache.set(key, event.detail.value);
        setValue(event.detail.value);
      }
    }
    function onStorage(event)
    {
      if (event.key !== key)
      {
        return;
      }
      try
      {
        const parsed = event.newValue !== null ? JSON.parse(event.newValue) : initialRef.current;
        cache.set(key, parsed);
        setValue(parsed);
      }
      catch
      {
        /* ignore */
      }
    }
    window.addEventListener(SYNC_EVENT, onSync);
    window.addEventListener('storage', onStorage);
    return () =>
    {
      window.removeEventListener(SYNC_EVENT, onSync);
      window.removeEventListener('storage', onStorage);
    };
  }, [key]);

  // Keep the latest value in a ref so `update` can compute the next value
  // synchronously, outside React's updater queue. Dispatching the sync event
  // from inside a setState updater runs it during another component's render
  // and triggers React's "cannot update a component while rendering" warning.
  const valueRef = useRef(value);
  useEffect(() =>
  {
    valueRef.current = value;
  }, [value]);

  const update = useCallback((updater) =>
  {
    const cached = cache.has(key) ? cache.get(key) : SENTINEL;
    const prev = cached === SENTINEL ? valueRef.current : cached;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    writeCached(key, next);
    valueRef.current = next;
    setValue(next);
    try
    {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: next } }));
    }
    catch
    {
      /* swallow */
    }
  }, [key]);

  return [value, update];
}
