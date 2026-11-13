import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { isSupabaseConfigured } from '../api/supabaseClient.js';
import { fetchState, upsertState } from '../api/stateService.js';
import useUserStorage from '../hooks/useUserStorage.js';

const SYNC_EVENT = 'trh:localStorage:set';
const PUSH_DEBOUNCE_MS = 800;
const STORAGE_FIELDS = [
  { stateKey: 'streak', localKey: 'streak', initial: { count: 0, last: null } },
  { stateKey: 'mastered', localKey: 'mastered', initial: [] },
  { stateKey: 'recentlyViewed', localKey: 'recentlyViewed', initial: [] },
  { stateKey: 'compilerLang', localKey: 'compiler.lang', initial: 'java' },
  { stateKey: 'compilerSources', localKey: 'compiler.sources', initial: {} },
  { stateKey: 'compilerStdin', localKey: 'compiler.stdin', initial: '' },
  { stateKey: 'learningPlan', localKey: 'learningPlan', initial: { date: null, completed: [] } }
];

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

function readLocalSnapshot(userId)
{
  const values = {};
  const guestKeys = [];
  for (const field of STORAGE_FIELDS)
  {
    const userKey = `trh.user.${userId}.${field.localKey}`;
    const guestKey = `trh.guest.${field.localKey}`;
    try
    {
      const userRaw = window.localStorage.getItem(userKey);
      if (userRaw !== null)
      {
        values[field.stateKey] = JSON.parse(userRaw);
        continue;
      }
      const guestRaw = window.localStorage.getItem(guestKey);
      if (guestRaw !== null)
      {
        values[field.stateKey] = JSON.parse(guestRaw);
        guestKeys.push(guestKey);
        continue;
      }
    }
    catch
    {
      // A malformed value should not prevent the rest of the snapshot syncing.
    }
    values[field.stateKey] = field.initial;
  }
  return { values, guestKeys };
}

function mergeSyncValues(before, after, remote)
{
  const values = {};
  let changedDuringSync = false;
  for (const field of STORAGE_FIELDS)
  {
    const previous = JSON.stringify(before.values[field.stateKey]);
    const current = JSON.stringify(after.values[field.stateKey]);
    if (previous !== current)
    {
      values[field.stateKey] = after.values[field.stateKey];
      changedDuringSync = true;
    }
    else
    {
      values[field.stateKey] = remote[field.stateKey];
    }
  }
  return { values, changedDuringSync };
}

function clearGuestKey(key)
{
  try
  {
    window.localStorage.removeItem(key);
  }
  catch
  {
    /* ignore storage restrictions */
  }
  const field = STORAGE_FIELDS.find((item) => `trh.guest.${item.localKey}` === key);
  if (field)
  {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: field.initial } }));
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
  const [learningPlan] = useUserStorage('learningPlan', { date: null, completed: [] });

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
    const localAtStart = readLocalSnapshot(userId);
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
          const localAtResponse = readLocalSnapshot(userId);
          const { values, changedDuringSync } = mergeSyncValues(
            localAtStart,
            localAtResponse,
            {
              streak: remote.streak,
              mastered: remote.mastered,
              recentlyViewed: remote.recentlyViewed,
              compilerLang: remote.compiler.lang,
              compilerSources: remote.compiler.sources,
              compilerStdin: remote.compiler.stdin,
              learningPlan: remote.learningPlan
            }
          );
          seedKey(userId, 'streak', values.streak);
          seedKey(userId, 'mastered', values.mastered);
          seedKey(userId, 'recentlyViewed', values.recentlyViewed);
          seedKey(userId, 'compiler.lang', values.compilerLang);
          seedKey(userId, 'compiler.sources', values.compilerSources);
          seedKey(userId, 'compiler.stdin', values.compilerStdin);
          seedKey(userId, 'learningPlan', values.learningPlan);
          if (changedDuringSync)
          {
            await upsertState(userId, {
              streak: values.streak,
              mastered: values.mastered,
              recentlyViewed: values.recentlyViewed,
              compiler: {
                lang: values.compilerLang,
                sources: values.compilerSources,
                stdin: values.compilerStdin
              },
              learningPlan: values.learningPlan
            });
            if (cancelled)
            {
              return;
            }
          }
        }
        else
        {
          // Preserve a device's previous progress. Account-scoped state wins;
          // guest state fills in only fields that account hasn't saved locally.
          const { values, guestKeys } = readLocalSnapshot(userId);
          seedKey(userId, 'streak', values.streak);
          seedKey(userId, 'mastered', values.mastered);
          seedKey(userId, 'recentlyViewed', values.recentlyViewed);
          seedKey(userId, 'compiler.lang', values.compilerLang);
          seedKey(userId, 'compiler.sources', values.compilerSources);
          seedKey(userId, 'compiler.stdin', values.compilerStdin);
          seedKey(userId, 'learningPlan', values.learningPlan);
          await upsertState(userId, {
            streak: values.streak,
            mastered: values.mastered,
            recentlyViewed: values.recentlyViewed,
            compiler: {
              lang: values.compilerLang,
              sources: values.compilerSources,
              stdin: values.compilerStdin
            },
            learningPlan: values.learningPlan
          });
          if (cancelled)
          {
            return;
          }
          // The imported copy is now safely tied to this account. Remove its
          // anonymous duplicate so another person on this device won't inherit it.
          guestKeys.forEach(clearGuestKey);
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
        },
        learningPlan
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
    compilerStdin,
    learningPlan
  ]);

  return null;
}
