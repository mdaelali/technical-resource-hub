import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';
import AuthShell from './AuthShell.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function LoginPage({ onSwitchToSignup, onForgotPassword })
{
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event)
  {
    event.preventDefault();
    if (submitting)
    {
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await signIn({ email, password });
    if (!result.ok)
    {
      setError(result.error);
    }
    setSubmitting(false);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your learning streak."
      footer={(
        <>
          New here?{' '}
          <button onClick={onSwitchToSignup} className="text-violet-300 hover:text-white transition font-medium">
            Create an account
          </button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
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
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Password</span>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] text-violet-300 hover:text-white transition"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="Your password"
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
          <span>{submitting ? 'Signing in...' : 'Sign in'}</span>
        </button>
      </form>
    </AuthShell>
  );
}
