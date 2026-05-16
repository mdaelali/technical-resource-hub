import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import AuthShell from './AuthShell.jsx';
import PasswordStrength from './PasswordStrength.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function SignupPage({ onSwitchToLogin })
{
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event)
  {
    event.preventDefault();
    if (submitting)
    {
      return;
    }
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    const result = await signUp({ name, email, password, confirmPassword });
    if (!result.ok)
    {
      setError(result.error);
    }
    else if (result.message)
    {
      setSuccess(result.message);
    }
    setSubmitting(false);
  }

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up to track your progress, mastery, and streak."
      footer={(
        <>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-violet-300 hover:text-white transition font-medium">
            Sign in
          </button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Name</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Your full name"
            maxLength={60}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="At least 8 characters"
              required
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
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Confirm password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`input-field ${
              passwordsMismatch ? 'border-rose-400/60 focus:border-rose-400' : ''
            } ${passwordsMatch ? 'border-emerald-400/40' : ''}`}
            placeholder="Re-enter your password"
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

        {success && (
          <div className="flex items-start gap-2 text-[11px] text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
            <span>{success}</span>
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
          <span>{submitting ? 'Creating account...' : 'Create account'}</span>
        </button>
      </form>
    </AuthShell>
  );
}
