import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from './auth/AuthContext.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import SignupPage from './components/auth/SignupPage.jsx';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './components/auth/ResetPasswordPage.jsx';
import LandingPage from './components/LandingPage.jsx';
import App from './App.jsx';
import RemoteSync from './state/RemoteSync.jsx';

export default function AppRoot()
{
  const { user, loading, isRecovering, isSupabaseConfigured } = useAuth();
  const [authView, setAuthView] = useState(readAuthView);

  useEffect(() =>
  {
    function syncAuthRoute()
    {
      setAuthView(readAuthView());
    }
    window.addEventListener('hashchange', syncAuthRoute);
    return () => window.removeEventListener('hashchange', syncAuthRoute);
  }, []);

  function navigateAuth(view)
  {
    const hashes = { home: '#/', login: '#/login', signup: '#/signup', forgot: '#/forgot' };
    const hash = hashes[view] || '#/';
    if (window.location.hash !== hash)
    {
      window.location.hash = hash;
    }
    else
    {
      setAuthView(view);
    }
  }

  if (!isSupabaseConfigured && authView !== 'home')
  {
    return <SetupNotice onBack={() => navigateAuth('home')} />;
  }

  if (loading)
  {
    return <FullScreenLoader />;
  }

  // User clicked a password-recovery link in their email. Force the
  // ResetPasswordPage regardless of session state — they must set a new
  // password before doing anything else.
  if (isRecovering)
  {
    return <ResetPasswordPage />;
  }

  if (!user)
  {
    if (authView === 'home')
    {
      return <LandingPage onLogin={() => navigateAuth('login')} onSignup={() => navigateAuth('signup')} />;
    }
    if (authView === 'signup')
    {
      return <SignupPage onSwitchToLogin={() => navigateAuth('login')} onBack={() => navigateAuth('home')} />;
    }
    if (authView === 'forgot')
    {
      return <ForgotPasswordPage onBack={() => navigateAuth('login')} />;
    }
    return (
      <LoginPage
        onSwitchToSignup={() => navigateAuth('signup')}
        onForgotPassword={() => navigateAuth('forgot')}
        onBack={() => navigateAuth('home')}
      />
    );
  }

  return (
    <>
      <RemoteSync />
      <App />
    </>
  );
}

function readAuthView()
{
  const path = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  if (path === 'signup' || path === 'login' || path === 'forgot')
  {
    return path;
  }
  return 'home';
}

function FullScreenLoader()
{
  return (
    <div className="min-h-[100dvh] w-screen grid place-items-center">
      <div className="flex flex-col items-center gap-2 text-slate-300">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-xs">Connecting...</span>
      </div>
    </div>
  );
}

function SetupNotice({ onBack })
{
  return (
    <div className="min-h-[100dvh] w-screen flex items-center justify-center p-4">
      <div className="glass gradient-border rounded-2xl p-5 sm:p-6 max-w-lg w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-300" />
          <h1 className="text-base font-semibold text-white tracking-tight">Supabase setup required</h1>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The app uses Supabase for authentication and data sync. Add your project credentials to
          <code className="font-mono text-cyan-200 mx-1">.env.local</code>and restart the dev server:
        </p>
        <pre className="font-mono text-[11px] text-slate-200 bg-black/40 border border-white/10 rounded-lg p-3 overflow-auto">
{`VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`}
        </pre>
        <ol className="text-xs text-slate-300 list-decimal pl-4 flex flex-col gap-1">
          <li>Create a free project at supabase.com.</li>
          <li>Project Settings → API → copy the project URL and publishable key.</li>
          <li>SQL Editor → run the script in <code className="font-mono text-cyan-200">supabase/schema.sql</code>.</li>
          <li>Storage → confirm the <code className="font-mono text-cyan-200">avatars</code> bucket is public.</li>
          <li>Restart <code className="font-mono text-cyan-200">npm run dev</code>.</li>
        </ol>
        {onBack && <button type="button" onClick={onBack} className="btn-ghost self-start">Back to home</button>}
      </div>
    </div>
  );
}
