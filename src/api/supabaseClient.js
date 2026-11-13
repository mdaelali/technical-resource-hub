import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
).trim();

export const isSupabaseConfigured = Boolean(
  url && publishableKey && url.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Read the access/refresh tokens that Supabase appends to the URL when
        // a user clicks the email-confirmation link, then clear them from the
        // address bar. Without this, the confirmation link lands the user on a
        // page with raw tokens in the URL and no session is established.
        detectSessionInUrl: true,
        flowType: 'implicit'
      }
    })
  : null;
