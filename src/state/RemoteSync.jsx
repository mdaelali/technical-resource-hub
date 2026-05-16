import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { isSupabaseConfigured } from '../api/supabaseClient.js';
import { fetchState, upsertState } from '../api/stateService.js';
import useUserStorage from '../hooks/useUserStorage.js';

const SYNC_EVENT = 'trh:localStorage:set';
const PUSH_DEBOUNCE_MS = 800;

function seedKey(userId, key, value)
{
  const fullKey = `trh.user.${userId}.${key}`;
  try
  {
    window.localStorage.setItem(fullKey, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT, { detail: { key: fullKey, value } })
    );
  }
  catch
  {
    /* ignore quota errors */
  }
}

/*
 * RemoteSync owns the round trip between the per-user localStorage cache
 * (which the existing useUserStorage hooks read synchronously) and the
 * `user_state` row in Supabase.
 *
 *   on login  → fetchState() and seed each scoped localStorage key, dispatching
 *               the same custom event the hooks already listen to so they pick
 *               up the cloud values without a remount.
 *   on change → debounce-push the entire snapshot back to Supabase as a single
 *               upsert. Keeps writes cheap; conflicts are last-write-wins.
 */
export default function RemoteSync()
{
  const { user } = useAuth();
  const userId = user?.id || null;

  const [streak] = useUserStorage('streak', { count: 0, last: null });
  const [mastered] = useUserStorage('mastered', []);
  const [recentlyViewed] = useUserStorage('recentlyViewed', []);
  const [compilerLang] = useUserStorage('compiler.lang', 'java');
  const [compilerSources] = useUserStorage('compiler.sources', {});
  const [compilerStdin] = useUserStorage('compiler.stdin', '');

  const initializedFor = useRef(null);

  // Pull cloud state and seed the local cache on login.
  useEffect(() =>
  {
    if (!userId || !isSupabaseConfigured)
    {
      initializedFor.current = null;
      return undefined;
    }
    let cancelled = false;
    initializedFor.current = null;
    (async () =>
    {
      try
      {
        const remote = await fetchState(userId);
        if (cancelled)
        {
          return;
        }
        if (remote)
        {
          seedKey(userId, 'streak', remote.streak);
          seedKey(userId, 'mastered', remote.mastered);
          seedKey(userId, 'recentlyViewed', remote.recentlyViewed);
          seedKey(userId, 'compiler.lang', remote.compiler.lang);
          seedKey(userId, 'compiler.sources', remote.compiler.sources);
          seedKey(userId, 'compiler.stdin', remote.compiler.stdin);
        }
        else
        {
          // Initialize an empty row so future pushes can upsert without races.
          await upsertState(userId, {
            streak: { count: 0, last: null },
            mastered: [],
            recentlyViewed: [],
            compiler: { lang: 'java', sources: {}, stdin: '' }
          });
        }
        // Mark this user as initialized; the push effect will skip until then.
        initializedFor.current = userId;
      }
      catch (err)
      {
        console.error('RemoteSync: failed to load user_state:', err);
      }
    })();
    return () =>
    {
      cancelled = true;
    };
  }, [userId]);

  // Push debounced state changes to Supabase.
  useEffect(() =>
  {
    if (!userId || !isSupabaseConfigured || initializedFor.current !== userId)
    {
      return undefined;
    }
    const handle = window.setTimeout(() =>
    {
      upsertState(userId, {
        streak,
        mastered,
        recentlyViewed,
        compiler: {
          lang: compilerLang,
          sources: compilerSources,
          stdin: compilerStdin
        }
      }).catch((err) =>
      {
        console.error('RemoteSync: failed to push user_state:', err);
      });
    }, PUSH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [
    userId,
    streak,
    mastered,
    recentlyViewed,
    compilerLang,
    compilerSources,
    compilerStdin
  ]);

  return null;
}
