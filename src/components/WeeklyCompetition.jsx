import { useEffect, useState } from 'react';
import { Award, Gamepad2, ShieldCheck } from 'lucide-react';
import { supabase } from '../api/supabaseClient.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function WeeklyCompetition()
{
  const { user } = useAuth();
  const [alias, setAlias] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase || !user?.id) return undefined;
    let active = true;
    supabase.from('competition_profiles').select('alias, enabled').eq('user_id', user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error)
      {
        setMessage('Apply supabase/competition.sql in Supabase to enable the CS league.');
        return;
      }
      if (data)
      {
        setAlias(data.alias);
        setEnabled(data.enabled);
        setSaved(true);
      }
    });
    return () => { active = false; };
  }, [user?.id]);

  async function save(event)
  {
    event.preventDefault();
    if (!user || !supabase) return;
    const cleanAlias = alias.trim().replace(/\s+/g, ' ');
    if (!/^[A-Za-z0-9 _.-]{3,20}$/.test(cleanAlias))
    {
      setMessage('Use 3–20 characters: letters, numbers, spaces, periods, underscores, or hyphens.');
      return;
    }
    setBusy(true);
    setMessage('');
    const { error } = await supabase.from('competition_profiles').upsert({
      user_id: user.id, alias: cleanAlias, enabled, updated_at: new Date().toISOString()
    });
    if (error) setMessage('Could not save. That display name may already be in use.');
    else
    {
      setAlias(cleanAlias);
      setSaved(true);
      setMessage(enabled ? 'You are in. Open Code Sprint to play.' : 'Your public league profile is turned off.');
    }
    setBusy(false);
  }

  if (!user) return null;

  return (
    <section className="dashboard-panel rounded-3xl p-5 sm:p-6" aria-labelledby="weekly-competition-title">
      <div className="flex items-start gap-3">
        <span className="stat-icon stat-mint grid h-11 w-11 shrink-0 place-items-center rounded-2xl"><Gamepad2 size={19} /></span>
        <div>
          <p className="dashboard-eyebrow">OPTIONAL · WEEKLY CS GAME</p>
          <h2 id="weekly-competition-title" className="mt-1 text-xl font-semibold tracking-tight">Join the Code Sprint league</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed dashboard-muted">Choose a public alias to enter timed Java rounds. The top 50 players and their points are shown in Code Sprint. Top-three awards are saved to your profile and appear on the public award wall.</p>
        </div>
      </div>

      {!supabase ? <p className="mt-4 text-sm dashboard-muted">Configure Supabase to join and save league standings.</p> : (
        <form onSubmit={save} className="mt-5 grid gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] lg:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="competition-alias">Public display name</label>
            <input id="competition-alias" value={alias} onChange={(event) => setAlias(event.target.value)} maxLength={20} autoComplete="off" className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none" placeholder="Choose a study alias" />
          </div>
          <label className="flex items-start gap-2 text-sm dashboard-muted">
            <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-1 accent-emerald-400" />
            <span>Show my alias, weekly game points, and awards to other signed-in league players. I can leave any time.</span>
          </label>
          <button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"><ShieldCheck size={15} />{busy ? 'Saving…' : saved ? 'Save league profile' : 'Join the league'}</button>
        </form>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-relaxed dashboard-muted">
        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-300" />Game answers, time, and points are verified by Supabase.</span>
        <span className="inline-flex items-center gap-1.5"><Award size={14} className="text-amber-200" />Your email and account name are never put on the public board.</span>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-amber-200">{message}</p>}
    </section>
  );
}
