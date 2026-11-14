import { supabase } from './supabaseClient.js';

export async function recordCompetitionEvent(eventType, contentKey)
{
  if (!supabase) return;
  const safeKey = String(contentKey).toLowerCase().replace(/[^a-z0-9_.:-]+/g, '-').slice(0, 120) || 'practice';
  const { error } = await supabase.rpc('record_practice_event', {
    p_event_type: eventType,
    p_content_key: safeKey
  });
  if (error) console.info('Weekly competition is not configured yet. Apply supabase/competition.sql to enable it.');
}
