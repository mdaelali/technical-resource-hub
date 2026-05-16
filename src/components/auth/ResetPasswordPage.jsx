import { useEffect, useState } from 'react';
import
{
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import AuthShell from './AuthShell.jsx';
import PasswordStrength from './PasswordStrength.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function ResetPasswordPage()
{
  const { resetPassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // After successful reset, hold the success screen for ~1.5s, then sign out
  // so the user is forced to log in with the new password.
  useEffect(() =>
  {
    if (!success)
    {
      return undefined;
    }
    const id = window.setTimeout(() =>
    {
      signOut();
    }, 1500);
    return () => window.clearTimeout(id);
  }, [success, signOut]);

  async function handleSubmit(event)
  {
    event.preventDefault();
    if (submitting)
    {
      return;
    }
    if (password !== confirmPassword)
    {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await resetPassword(password);
    setSubmitting(false);
    if (!result.ok)
    {
      setError(result.error);
      return;
    }
    setSuccess(true);
  }

  if (success)
  {
    return (
      <AuthShell title="Password updated">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/30 grid place-items-center">
            <CheckCircle2 size={22} className="text-emerald-300" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your password has been changed. Redirecting you to sign in with the new password...
          </p>
          <Loader2 size={14} className="animate-spin text-slate-400" />
        </div>
      </AuthShell>
    );
  }

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Pick something strong — you'll use this to sign in from now on."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">New password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="At least 8 characters"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Confirm new password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`input-field ${
              passwordsMismatch ? 'border-rose-400/60 focus:border-rose-400' : ''
            }`}
            placeholder="Re-enter your new password"
            required
          />
          {passwordsMismatch && (
            <span className="text-[11px] text-rose-300">Passwords do not match.</span>
          )}
        </label>

        {password.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5">
            <PasswordStrength password={password} />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-[11px] text-rose-200 bg-rose-500/10 border border-rose-400/30 rounded-lg px-3 py-2">
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-2 text-sm mt-2"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          <span>{submitting ? 'Updating...' : 'Update password'}</span>
        </button>
      </form>
    </AuthShell>
  );
}
