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
  { stateKey: 'learningPlan', localKey: 'learningPlan', initial: { date: null, completed: [] } },
  { stateKey: 'examResults', localKey: 'exam.results', initial: {} }
];

/* When this device last changed any synced value, and when it last pushed. */
const META_KEY = 'syncMeta';

function readMeta(userId)
{
  try
  {
    const raw = window.localStorage.getItem(`trh.user.${userId}.${META_KEY}`);
    return raw ? JSON.parse(raw) : {};
  }
  catch
  {
    return {};
  }
}

function writeMeta(userId, patch)
{
  try
  {
    const next = { ...readMeta(userId), ...patch };
    window.localStorage.setItem(`trh.user.${userId}.${META_KEY}`, JSON.stringify(next));
  }
  catch
  {
    /* ignore */
  }
}

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

function seedAll(userId, values)
{
  for (const field of STORAGE_FIELDS)
  {
    seedKey(userId, field.localKey, values[field.stateKey]);
  }
}

function toSnapshot(values)
{
  return {
    streak: values.streak,
    mastered: values.mastered,
    recentlyViewed: values.recentlyViewed,
    compiler: {
      lang: values.compilerLang,
      sources: values.compilerSources,
      stdin: values.compilerStdin
    },
    learningPlan: values.learningPlan,
    examResults: values.examResults
  };
}

function readLocalSnapshot(userId)
{
  const values = {};
  const guestKeys = [];
  let hasUserData = false;
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
        hasUserData = true;
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
  return { values, guestKeys, hasUserData };
}

function unionList(a, b)
{
  const out = [];
  const seen = new Set();
  for (const item of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])
  {
    const key = typeof item === 'string' ? item : JSON.stringify(item);
    if (!seen.has(key))
    {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function mergePlans(a, b)
{
  const pa = a && typeof a === 'object' ? a : { date: null, completed: [] };
  const pb = b && typeof b === 'object' ? b : { date: null, completed: [] };
  if (!pa.date) return pb;
  if (!pb.date) return pa;
  if (pa.date === pb.date)
  {
    return { date: pa.date, completed: unionList(pa.completed, pb.completed) };
  }
  // Date keys are YYYY-MM-DD, so string order is chronological.
  return pa.date > pb.date ? pa : pb;
}

function mergeStreaks(a, b)
{
  const sa = a && typeof a === 'object' ? a : { count: 0, last: null };
  const sb = b && typeof b === 'object' ? b : { count: 0, last: null };
  if (!sa.last) return sb;
  if (!sb.last) return sa;
  if (sa.last === sb.last) return (sa.count || 0) >= (sb.count || 0) ? sa : sb;
  return sa.last > sb.last ? sa : sb;
}

function mergeExamResults(a, b)
{
  // Per exam: best score wins, attempts add up to the larger known count,
  // histories are unioned by timestamp, the later date is kept.
  const ra = a && typeof a === 'object' ? a : {};
  const rb = b && typeof b === 'object' ? b : {};
  const out = {};
  for (const id of new Set([...Object.keys(ra), ...Object.keys(rb)]))
  {
    const x = ra[id];
    const y = rb[id];
    if (!x) { out[id] = y; continue; }
    if (!y) { out[id] = x; continue; }
    const history = [];
    const seen = new Set();
    for (const h of [...(Array.isArray(x.history) ? x.history : []), ...(Array.isArray(y.history) ? y.history : [])])
    {
      const k = h?.at || JSON.stringify(h);
      if (!seen.has(k)) { seen.add(k); history.push(h); }
    }
    history.sort((p, q) => String(p.at || '').localeCompare(String(q.at || '')));
    out[id] = {
      ...x,
      ...y,
      best: Math.max(x.best || 0, y.best || 0),
      totalMcq: Math.max(x.totalMcq || 0, y.totalMcq || 0),
      completed: Boolean(x.completed || y.completed),
      attempts: Math.max(x.attempts || (x.completed ? 1 : 0), y.attempts || (y.completed ? 1 : 0), history.length),
      takenAt: [x.takenAt, y.takenAt].filter(Boolean).sort().pop() || null,
      history: history.slice(-20)
    };
  }
  return out;
}

function mergeRecent(a, b)
{
  // Items may be strings or {key, at} objects; keep the newest copy of each.
  const list = unionList(a, b);
  const keyOf = (item) => (typeof item === 'string' ? item : item?.key ?? item?.id ?? JSON.stringify(item));
  const atOf = (item) => (typeof item === 'object' && item ? Date.parse(item.at || item.viewedAt || 0) || 0 : 0);
  const best = new Map();
  for (const item of list)
  {
    const k = keyOf(item);
    if (!best.has(k) || atOf(item) > atOf(best.get(k))) best.set(k, item);
  }
  return [...best.values()].sort((x, y) => atOf(y) - atOf(x)).slice(0, 50);
}

/*
 * Combine what this device has with what the cloud has.
 *
 * Progress is never thrown away because one side is stale: mastered topics are
 * the union of both, the learning plan keeps the later day (or the union of
 * steps on the same day), the streak keeps the later/longer one. For the
 * compiler, the side that changed more recently wins.
 */
function mergeLocalAndRemote(local, remote, localChangedAt, remoteUpdatedAt)
{
  const localNewer = Boolean(localChangedAt) && (!remoteUpdatedAt || localChangedAt > remoteUpdatedAt);
  return {
    streak: mergeStreaks(local.streak, remote.streak),
    mastered: unionList(local.mastered, remote.mastered),
    recentlyViewed: mergeRecent(local.recentlyViewed, remote.recentlyViewed),
    compilerLang: localNewer ? local.compilerLang : remote.compilerLang,
    compilerSources: localNewer ? local.compilerSources : remote.compilerSources,
    compilerStdin: localNewer ? local.compilerStdin : remote.compilerStdin,
    learningPlan: mergePlans(local.learningPlan, remote.learningPlan),
    examResults: mergeExamResults(local.examResults, remote.examResults)
  };
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

function sameJson(a, b)
{
  return JSON.stringify(a) === JSON.stringify(b);
}

/*
 * RemoteSync owns the round trip between the per-user localStorage cache
 * (which the existing useUserStorage hooks read synchronously) and the
 * `user_state` row in Supabase.
 *
 *   on login  → fetchState(), merge with what this device already has, seed
 *               each scoped localStorage key (dispatching the custom event the
 *               hooks listen to), and push the merged result if it differs
 *               from the cloud copy.
 *   on change → debounce-push the entire snapshot as one upsert. A failed push
 *               is retried on the next change and on the next login, and the
 *               local copy is never overwritten by an older cloud copy.
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
  const [examResults] = useUserStorage('exam.results', {});

  const initializedFor = useRef(null);
  const lastPushedRef = useRef(null);
  const pendingRef = useRef(false);

  // Pull cloud state, merge with the local cache, and seed it on login.
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
      let remote = null;
      try
      {
        remote = await fetchState(userId);
      }
      catch (err)
      {
        console.error('RemoteSync: failed to load user_state:', err);
      }
      if (cancelled)
      {
        return;
      }
      const local = readLocalSnapshot(userId);
      const meta = readMeta(userId);
      let values;
      if (remote)
      {
        values = mergeLocalAndRemote(local.values, {
          streak: remote.streak,
          mastered: remote.mastered,
          recentlyViewed: remote.recentlyViewed,
          compilerLang: remote.compiler.lang,
          compilerSources: remote.compiler.sources,
          compilerStdin: remote.compiler.stdin,
          learningPlan: remote.learningPlan,
          examResults: remote.examResults
        }, meta.changedAt || null, remote.updatedAt || null);
      }
      else
      {
        // No cloud copy yet (or it could not be read). Keep what this device has;
        // guest progress fills in only fields the account has not saved locally.
        values = local.values;
      }
      seedAll(userId, values);
      initializedFor.current = userId;

      const remoteSnapshot = remote ? toSnapshot({
        streak: remote.streak,
        mastered: remote.mastered,
        recentlyViewed: remote.recentlyViewed,
        compilerLang: remote.compiler.lang,
        compilerSources: remote.compiler.sources,
        compilerStdin: remote.compiler.stdin,
        learningPlan: remote.learningPlan,
        examResults: remote.examResults
      }) : null;
      const snapshot = toSnapshot(values);
      lastPushedRef.current = remoteSnapshot;
      if (!remoteSnapshot || !sameJson(snapshot, remoteSnapshot))
      {
        try
        {
          await upsertState(userId, snapshot);
          if (cancelled) return;
          lastPushedRef.current = snapshot;
          writeMeta(userId, { pushedAt: new Date().toISOString() });
        }
        catch (err)
        {
          console.error('RemoteSync: failed to push merged user_state:', err);
        }
      }
      if (!remote && local.guestKeys.length && lastPushedRef.current === snapshot)
      {
        // The imported copy is now safely tied to this account. Remove its
        // anonymous duplicate so another person on this device won't inherit it.
        local.guestKeys.forEach(clearGuestKey);
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
    const snapshot = toSnapshot({
      streak,
      mastered,
      recentlyViewed,
      compilerLang,
      compilerSources,
      compilerStdin,
      learningPlan,
      examResults
    });
    if (lastPushedRef.current && sameJson(snapshot, lastPushedRef.current) && !pendingRef.current)
    {
      return undefined;
    }
    // Remember that this device has unsaved changes, so a later login merges
    // in its favour even if the push below fails.
    writeMeta(userId, { changedAt: new Date().toISOString() });
    pendingRef.current = true;
    const handle = window.setTimeout(() =>
    {
      upsertState(userId, snapshot)
        .then(() =>
        {
          lastPushedRef.current = snapshot;
          pendingRef.current = false;
          writeMeta(userId, { pushedAt: new Date().toISOString() });
        })
        .catch((err) =>
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
    learningPlan,
    examResults
  ]);

  // Flush unsaved changes when the tab is being closed or refreshed.
  useEffect(() =>
  {
    if (!userId || !isSupabaseConfigured)
    {
      return undefined;
    }
    function flush()
    {
      if (!pendingRef.current || initializedFor.current !== userId)
      {
        return;
      }
      const snapshot = toSnapshot({
        streak,
        mastered,
        recentlyViewed,
        compilerLang,
        compilerSources,
        compilerStdin,
        learningPlan,
        examResults
      });
      upsertState(userId, snapshot, { keepalive: true }).catch(() => { /* best effort */ });
    }
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () =>
    {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [userId, streak, mastered, recentlyViewed, compilerLang, compilerSources, compilerStdin, learningPlan, examResults]);

  return null;
}
