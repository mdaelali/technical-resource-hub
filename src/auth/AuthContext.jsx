import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../api/supabaseClient.js';
import { fetchProfile, upsertProfile, deleteAllAvatars } from '../api/profileService.js';
import { sanitizeText, validateEmail, validatePassword } from '../utils/security.js';

const AuthContext = createContext(null);

const DEFAULT_BIO = 'Computer science student exploring algorithms, logic, and system design.';

function publicUser(supaUser, profile)
{
  if (!supaUser)
  {
    return null;
  }
  const fallbackName =
    profile?.name ||
    supaUser.user_metadata?.name ||
    (supaUser.email ? supaUser.email.split('@')[0] : 'Student');
  return {
    id: supaUser.id,
    email: supaUser.email,
    name: fallbackName,
    createdAt: supaUser.created_at
  };
}

function friendlyError(error)
{
  if (!error)
  {
    return 'Something went wrong.';
  }
  const msg = (error.message || error.error_description || '').toLowerCase();
  if (msg.includes('failed to fetch') || msg.includes('network'))
  {
    return 'Network error — check your connection and try again.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists'))
  {
    return 'An account with this email already exists.';
  }
  if (msg.includes('invalid login') || msg.includes('invalid credentials'))
  {
    return 'Incorrect email or password.';
  }
  if (msg.includes('email not confirmed'))
  {
    return 'Please confirm your email before signing in.';
  }
  if (msg.includes('rate limit') || msg.includes('too many'))
  {
    return 'Too many attempts. Wait a moment and try again.';
  }
  if (msg.includes('password should be at least'))
  {
    return 'Password must be at least 8 characters with a number and special character.';
  }
  return error.message || 'Something went wrong.';
}

export function AuthProvider({ children })
{
  const [session, setSession] = useState(null);
  const [supaUser, setSupaUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // True while the user is mid-password-recovery (clicked a reset link).
  // We use it to force the ResetPasswordPage instead of the normal app
  // even though Supabase has technically signed the user in.
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() =>
  {
    if (!isSupabaseConfigured)
    {
      setLoading(false);
      return undefined;
    }
    // When the user clicks an email-confirmation link, the URL contains
    // tokens (e.g. `#access_token=...&type=signup`). Hold the loading state
    // until Supabase finishes processing them so we don't flash LoginPage.
    const hasAuthCallback = typeof window !== 'undefined' && (
      /access_token=|refresh_token=|error=/.test(window.location.hash) ||
      /[?&]code=/.test(window.location.search)
    );
    let mounted = true;
    supabase.auth.getSession().then(({ data }) =>
    {
      if (!mounted)
      {
        return;
      }
      setSession(data.session || null);
      setSupaUser(data.session?.user || null);
      if (!hasAuthCallback || data.session)
      {
        setLoading(false);
      }
    });
    // Safety net: never get stuck on the loader if Supabase fails to fire
    // an auth state change (e.g. tokens expired).
    const safetyTimer = window.setTimeout(() =>
    {
      if (mounted)
      {
        setLoading(false);
      }
    }, 5000);
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) =>
    {
      setSession(newSession || null);
      setSupaUser(newSession?.user || null);
      setLoading(false);
      if (event === 'PASSWORD_RECOVERY')
      {
        setIsRecovering(true);
      }
    });
    return () =>
    {
      mounted = false;
      window.clearTimeout(safetyTimer);
      sub.subscription.unsubscribe();
    };
  }, []);

  // Load (or create) profile row whenever the auth user changes.
  useEffect(() =>
  {
    if (!supaUser || !isSupabaseConfigured)
    {
      setProfile(null);
      return undefined;
    }
    let cancelled = false;
    (async () =>
    {
      try
      {
        const existing = await fetchProfile(supaUser.id);
        if (cancelled)
        {
          return;
        }
        if (existing)
        {
          setProfile(existing);
          return;
        }
        const initial = await upsertProfile(supaUser.id, {
          name: supaUser.user_metadata?.name || (supaUser.email ? supaUser.email.split('@')[0] : 'Student'),
          bio: DEFAULT_BIO,
          avatarUrl: null
        });
        if (!cancelled)
        {
          setProfile(initial);
        }
      }
      catch (err)
      {
        if (!cancelled)
        {
          console.error('Failed to load profile:', err);
        }
      }
    })();
    return () =>
    {
      cancelled = true;
    };
  }, [supaUser]);

  const user = useMemo(() => publicUser(supaUser, profile), [supaUser, profile]);

  const signUp = useCallback(async ({ name, email, password, confirmPassword }) =>
  {
    if (!isSupabaseConfigured)
    {
      return { ok: false, error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.' };
    }
    const cleanName = sanitizeText(name, { maxLength: 60 });
    if (!cleanName || cleanName.length < 2)
    {
      return { ok: false, error: 'Please enter your name (at least 2 characters).' };
    }
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid)
    {
      return { ok: false, error: emailCheck.reason };
    }
    const passCheck = validatePassword(password);
    if (!passCheck.valid)
    {
      return { ok: false, error: passCheck.reason };
    }
    if (password !== confirmPassword)
    {
      return { ok: false, error: 'Passwords do not match.' };
    }

    try
    {
      // Tell Supabase to send users back to whatever origin the app is
      // currently running on — localhost in dev, the deployed URL in prod.
      // This URL must also be in the Supabase project's "Redirect URLs"
      // allowlist (Authentication → URL Configuration).
      const emailRedirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: emailCheck.value,
        password,
        options: {
          data: { name: cleanName },
          emailRedirectTo
        }
      });
      if (error)
      {
        return { ok: false, error: friendlyError(error) };
      }
      // If email confirmation is enabled in the Supabase project, no session is
      // returned until the user clicks the confirmation link.
      if (!data.session && data.user && !data.user.confirmed_at)
      {
        return {
          ok: true,
          message: 'Account created. Check your email to confirm your address before signing in.'
        };
      }
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, []);

  const signIn = useCallback(async ({ email, password }) =>
  {
    if (!isSupabaseConfigured)
    {
      return { ok: false, error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.' };
    }
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid)
    {
      return { ok: false, error: emailCheck.reason };
    }
    if (!password)
    {
      return { ok: false, error: 'Password is required.' };
    }
    try
    {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailCheck.value,
        password
      });
      if (error)
      {
        return { ok: false, error: friendlyError(error) };
      }
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, []);

  const signOut = useCallback(async () =>
  {
    if (isSupabaseConfigured)
    {
      try
      {
        await supabase.auth.signOut();
      }
      catch (err)
      {
        console.error('Sign out error:', err);
      }
    }
    setSession(null);
    setSupaUser(null);
    setProfile(null);
    setIsRecovering(false);
  }, []);

  const requestPasswordReset = useCallback(async (email) =>
  {
    if (!isSupabaseConfigured)
    {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid)
    {
      return { ok: false, error: emailCheck.reason };
    }
    try
    {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/`
        : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(
        emailCheck.value,
        { redirectTo }
      );
      if (error)
      {
        return { ok: false, error: friendlyError(error) };
      }
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, []);

  const resetPassword = useCallback(async (newPassword) =>
  {
    if (!isSupabaseConfigured)
    {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const passCheck = validatePassword(newPassword);
    if (!passCheck.valid)
    {
      return { ok: false, error: passCheck.reason };
    }
    try
    {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error)
      {
        return { ok: false, error: friendlyError(error) };
      }
      setIsRecovering(false);
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, []);

  const deleteAccount = useCallback(async () =>
  {
    if (!isSupabaseConfigured || !supaUser)
    {
      return { ok: false, error: 'Not authenticated.' };
    }
    try
    {
      // Client-side avatar cleanup as a courtesy — the SQL function below
      // also wipes storage.objects rows in the same transaction in case this
      // call is blocked by a network failure mid-flight.
      await deleteAllAvatars(supaUser.id);
      const { error } = await supabase.rpc('delete_my_account');
      if (error)
      {
        return { ok: false, error: friendlyError(error) };
      }
      // The auth row is gone; clear local state and Supabase session.
      try
      {
        await supabase.auth.signOut();
      }
      catch
      {
        /* signOut may 401 because the JWT no longer maps to a user — fine */
      }
      setSession(null);
      setSupaUser(null);
      setProfile(null);
      setIsRecovering(false);
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, [supaUser]);

  const updateProfile = useCallback(async (patch) =>
  {
    if (!supaUser)
    {
      return { ok: false, error: 'Not authenticated.' };
    }
    const safe = {};
    if (typeof patch.name === 'string')
    {
      const clean = sanitizeText(patch.name, { maxLength: 60 });
      if (clean.length >= 2)
      {
        safe.name = clean;
      }
    }
    if (typeof patch.bio === 'string')
    {
      safe.bio = sanitizeText(patch.bio, { maxLength: 500 });
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'avatarUrl'))
    {
      safe.avatarUrl = patch.avatarUrl;
    }
    try
    {
      const updated = await upsertProfile(supaUser.id, safe);
      setProfile(updated);
      return { ok: true };
    }
    catch (err)
    {
      return { ok: false, error: friendlyError(err) };
    }
  }, [supaUser]);

  // Kept for backward compatibility — Supabase auto-refreshes its own tokens.
  const touchSession = useCallback(() => {}, []);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    isRecovering,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    deleteAccount,
    updateProfile,
    touchSession,
    isSupabaseConfigured
  }), [session, user, profile, loading, isRecovering, signUp, signIn, signOut, requestPasswordReset, resetPassword, deleteAccount, updateProfile, touchSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth()
{
  const ctx = useContext(AuthContext);
  if (!ctx)
  {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
