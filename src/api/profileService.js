import { supabase } from './supabaseClient.js';
import { detectImageMimeType } from '../utils/security.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp'
};

function rowToProfile(row)
{
  if (!row)
  {
    return null;
  }
  return {
    id: row.id,
    name: row.name || '',
    bio: row.bio || '',
    avatarUrl: row.avatar_url || null,
    updatedAt: row.updated_at
  };
}

function profileToRow(patch)
{
  const out = {};
  if (typeof patch.name === 'string')
  {
    out.name = patch.name;
  }
  if (typeof patch.bio === 'string')
  {
    out.bio = patch.bio;
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'avatarUrl'))
  {
    out.avatar_url = patch.avatarUrl;
  }
  return out;
}

export async function fetchProfile(userId)
{
  if (!supabase)
  {
    return null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, bio, avatar_url, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();
  if (error)
  {
    throw error;
  }
  return rowToProfile(data);
}

export async function upsertProfile(userId, patch)
{
  if (!supabase)
  {
    throw new Error('Supabase is not configured.');
  }
  const row = {
    id: userId,
    ...profileToRow(patch),
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error)
  {
    throw error;
  }
  return rowToProfile(data);
}

export async function uploadAvatar(userId, file)
{
  if (!supabase)
  {
    throw new Error('Supabase is not configured.');
  }
  if (file.size > MAX_AVATAR_BYTES)
  {
    throw new Error('Image must be smaller than 2 MB.');
  }
  // Defense in depth: the browser's reported MIME comes from the filename and
  // is trivially spoofed. Sniff the file's actual magic bytes and verify the
  // claim matches before sending anything to the public bucket.
  const sniffed = await detectImageMimeType(file);
  if (!sniffed)
  {
    throw new Error('That file does not look like a real image. Please choose a JPG, PNG, GIF, or WebP.');
  }
  if (!ALLOWED_TYPES.includes(sniffed))
  {
    throw new Error('Only JPG, PNG, GIF, or WebP images are allowed.');
  }
  if (file.type && file.type !== sniffed)
  {
    throw new Error(`File extension does not match its contents (expected ${sniffed}).`);
  }
  // Use the magic-byte-derived extension so we never trust user-provided names.
  const ext = EXT_BY_MIME[sniffed] || 'bin';
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      upsert: false,
      contentType: sniffed,
      cacheControl: '3600'
    });
  if (uploadError)
  {
    throw uploadError;
  }
  // Best-effort cleanup of previous avatar files so the user's folder doesn't
  // grow forever. Runs after a successful new upload so we never delete the
  // current avatar if the upload itself fails.
  try
  {
    const { data: existing } = await supabase.storage
      .from('avatars')
      .list(userId, { limit: 50 });
    if (existing && existing.length > 0)
    {
      const stale = existing
        .map((f) => `${userId}/${f.name}`)
        .filter((p) => p !== path);
      if (stale.length > 0)
      {
        await supabase.storage.from('avatars').remove(stale);
      }
    }
  }
  catch
  {
    /* swallow — cleanup is non-critical */
  }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

/*
 * Deletes every file in this user's avatar folder. Called by the account
 * deletion flow before the SQL function nukes the auth row.
 */
export async function deleteAllAvatars(userId)
{
  if (!supabase)
  {
    return;
  }
  try
  {
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(userId, { limit: 100 });
    if (!files || files.length === 0)
    {
      return;
    }
    const paths = files.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from('avatars').remove(paths);
  }
  catch
  {
    /* swallow — the SQL function handles the canonical cleanup */
  }
}
