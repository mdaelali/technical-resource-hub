import { supabase } from './supabaseClient.js';

function rowToState(row)
{
  if (!row)
  {
    return null;
  }
  return {
    streak: { count: row.streak_count || 0, last: row.streak_last || null },
    mastered: Array.isArray(row.mastered) ? row.mastered : [],
    recentlyViewed: Array.isArray(row.recently_viewed) ? row.recently_viewed : [],
    compiler: {
      lang: row.compiler_lang || 'java',
      sources: row.compiler_sources || {},
      stdin: row.compiler_stdin || ''
    },
    learningPlan: row.learning_plan || { date: null, completed: [] },
    updatedAt: row.updated_at
  };
}

export async function fetchState(userId)
{
  if (!supabase)
  {
    return null;
  }
  const { data, error } = await supabase
    .from('user_state')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error)
  {
    throw error;
  }
  return rowToState(data);
}

function isMissingColumn(error, column)
{
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
  return error?.code === '42703' || error?.code === 'PGRST204' || text.includes(column);
}

let warnedMissingPlanColumn = false;

export async function upsertState(userId, snapshot, options = {})
{
  if (!supabase)
  {
    throw new Error('Supabase is not configured.');
  }
  const row = {
    user_id: userId,
    streak_count: snapshot.streak?.count ?? 0,
    streak_last: snapshot.streak?.last ?? null,
    mastered: snapshot.mastered ?? [],
    recently_viewed: snapshot.recentlyViewed ?? [],
    compiler_lang: snapshot.compiler?.lang ?? 'java',
    compiler_sources: snapshot.compiler?.sources ?? {},
    compiler_stdin: snapshot.compiler?.stdin ?? '',
    learning_plan: snapshot.learningPlan ?? { date: null, completed: [] },
    updated_at: new Date().toISOString()
  };
  if (options.keepalive)
  {
    // Used while the page is unloading: a plain fetch with keepalive survives
    // the navigation, the supabase-js client does not.
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) return;
    await fetch(`${import.meta.env.VITE_SUPABASE_URL.trim()}/rest/v1/user_state?on_conflict=user_id`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim(),
        Authorization: `Bearer ${token}`,
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(row)
    });
    return;
  }
  const { error } = await supabase
    .from('user_state')
    .upsert(row, { onConflict: 'user_id' });
  if (error && isMissingColumn(error, 'learning_plan'))
  {
    // Older databases predate the learning_plan column. Save everything else
    // rather than nothing, and say what to run once.
    if (!warnedMissingPlanColumn)
    {
      warnedMissingPlanColumn = true;
      console.warn('user_state has no learning_plan column. Run in the Supabase SQL editor: ' +
        "alter table public.user_state add column if not exists learning_plan jsonb not null default '{\"date\": null, \"completed\": []}'::jsonb;");
    }
    const withoutPlan = { ...row };
    delete withoutPlan.learning_plan;
    const retry = await supabase.from('user_state').upsert(withoutPlan, { onConflict: 'user_id' });
    if (retry.error) throw retry.error;
    return;
  }
  if (error)
  {
    throw error;
  }
}
