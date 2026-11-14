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
    examResults: row.exam_results && typeof row.exam_results === 'object' ? row.exam_results : {},
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

/* Columns added after the first release, with the SQL that creates them. */
const OPTIONAL_COLUMNS = {
  learning_plan: "alter table public.user_state add column if not exists learning_plan jsonb not null default '{\"date\": null, \"completed\": []}'::jsonb;",
  exam_results: "alter table public.user_state add column if not exists exam_results jsonb not null default '{}'::jsonb;"
};

function missingColumn(error)
{
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
  if (error?.code !== '42703' && error?.code !== 'PGRST204' && !/column/i.test(text)) return null;
  return Object.keys(OPTIONAL_COLUMNS).find((column) => text.includes(column)) || null;
}

const warnedColumns = new Set();
/* Columns the database rejected once this session; skipped without a round trip. */
const droppedColumns = new Set();

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
    exam_results: snapshot.examResults ?? {},
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
  // Older databases may predate some columns. Save everything else rather
  // than nothing, and say once what to run in the Supabase SQL editor.
  let attempt = { ...row };
  for (const column of droppedColumns) delete attempt[column];
  for (let i = 0; i <= Object.keys(OPTIONAL_COLUMNS).length; i++)
  {
    const { error } = await supabase
      .from('user_state')
      .upsert(attempt, { onConflict: 'user_id' });
    if (!error) return;
    const column = missingColumn(error);
    if (!column || !(column in attempt)) throw error;
    if (!warnedColumns.has(column))
    {
      warnedColumns.add(column);
      console.warn(`user_state has no ${column} column. Run in the Supabase SQL editor: ${OPTIONAL_COLUMNS[column]}`);
    }
    droppedColumns.add(column);
    delete attempt[column];
  }
}
