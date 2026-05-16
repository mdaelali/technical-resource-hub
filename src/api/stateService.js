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

export async function upsertState(userId, snapshot)
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
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from('user_state')
    .upsert(row, { onConflict: 'user_id' });
  if (error)
  {
    throw error;
  }
}
