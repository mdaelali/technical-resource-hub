import { useState } from 'react';
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthShell from './AuthShell.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function ForgotPasswordPage({ onBack })
{
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
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
    const result = await requestPasswordReset(email);
    setSubmitting(false);
    if (!result.ok)
    {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  if (sent)
  {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle="We just sent you a password reset link."
      >
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/30 grid place-items-center">
            <CheckCircle2 size={22} className="text-emerald-300" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an account exists for <span className="font-mono text-cyan-200">{email}</span>, a
            reset link has been sent. The link is valid for 1 hour — click it on the same browser
            to set a new password.
          </p>
          <p className="text-[11px] text-slate-500">
            Didn't get it? Check your spam folder, then try again.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost mt-1"
          >
            <ArrowLeft size={11} />
            <span>Back to sign in</span>
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email you used to sign up — we'll send you a reset link."
      footer={(
        <button
          type="button"
          onClick={onBack}
          className="text-violet-300 hover:text-white transition font-medium inline-flex items-center gap-1"
        >
          <ArrowLeft size={11} />
          Back to sign in
        </button>
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
            autoFocus
          />
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          <span>{submitting ? 'Sending...' : 'Send reset link'}</span>
        </button>
      </form>
    </AuthShell>
  );
}
