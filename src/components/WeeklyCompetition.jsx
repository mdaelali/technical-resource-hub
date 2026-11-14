import { useCallback, useEffect, useState } from 'react';
import { Trophy, Users, RefreshCw } from 'lucide-react';
import { supabase } from '../api/supabaseClient.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function WeeklyCompetition()
{
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [board, setBoard] = useState([]);
  const [alias, setAlias] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const configured = Boolean(supabase && user);

  const load = useCallback(async () => {
    if (!configured) return null;
    const [{ data: own, error: profileError }, { data: rows, error: boardError }] = await Promise.all([
      supabase.from('competition_profiles').select('alias, enabled').eq('user_id', user.id).maybeSingle(),
      supabase.rpc('get_weekly_competition_board')
    ]);
    if (profileError || boardError)
    {
      return { error: true };
    }
    return { own, rows: rows || [] };
  }, [configured, user]);

  useEffect(() => {
    let active = true;
    load().then((data) => {
      if (!active || !data) return;
      if (data.error)
      {
        setMessage('Apply the competition setup in supabase/competition.sql to enable weekly rankings.');
        return;
      }
      setProfile(data.own);
      setAlias(data.own?.alias || '');
      setEnabled(Boolean(data.own?.enabled));
      setBoard(data.rows);
      setMessage('');
    });
    return () => { active = false; };
  }, [load]);

  async function refresh()
  {
    const data = await load();
    if (!data) return;
    if (data.error)
    {
      setMessage('Apply the competition setup in supabase/competition.sql to enable weekly rankings.');
      return;
    }
    setProfile(data.own);
    setAlias(data.own?.alias || '');
    setEnabled(Boolean(data.own?.enabled));
    setBoard(data.rows);
  }

  async function save(event)
  {
    event.preventDefault();
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
    if (error) setMessage('Could not save your competition settings. Try another display name.');
    else
    {
      const data = await load();
      if (data && !data.error)
      {
        setProfile(data.own);
        setAlias(data.own?.alias || '');
        setEnabled(Boolean(data.own?.enabled));
        setBoard(data.rows);
      }
    }
    setBusy(false);
  }

  if (!user) return null;

  return (
    <section className="dashboard-panel rounded-3xl p-5 sm:p-6" aria-labelledby="weekly-competition-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="stat-icon stat-mint grid h-11 w-11 shrink-0 place-items-center rounded-2xl"><Trophy size={19} /></span>
          <div>
            <p className="dashboard-eyebrow">OPT-IN · WEEKLY</p>
            <h2 id="weekly-competition-title" className="mt-1 text-xl font-semibold tracking-tight">Study league</h2>
            <p className="mt-1 max-w-2xl text-sm dashboard-muted">Earn points from real practice, compare progress with classmates, and start fresh each week. Only your chosen display name appears.</p>
          </div>
        </div>
        {configured && <button type="button" onClick={refresh} className="rounded-xl border border-white/10 p-2 dashboard-muted hover:text-white" aria-label="Refresh weekly leaderboard"><RefreshCw size={16} /></button>}
      </div>

      {!configured ? <p className="mt-4 text-sm dashboard-muted">{user ? 'Configure Supabase to join the weekly study league.' : 'Sign in to join the weekly study league.'}</p> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form onSubmit={save} className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <label className="text-sm font-medium" htmlFor="competition-alias">Display name</label>
            <input id="competition-alias" value={alias} onChange={(event) => setAlias(event.target.value)} maxLength={20} minLength={3} autoComplete="off" className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none" placeholder="Choose a study alias" />
            <label className="flex items-start gap-2 text-sm dashboard-muted">
              <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-1 accent-emerald-400" />
              <span>Show me on the weekly leaderboard. Participation is optional and can be turned off any time.</span>
            </label>
            <button disabled={busy} className="self-start rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60">{busy ? 'Saving…' : profile ? 'Save settings' : 'Join the league'}</button>
            <p className="text-xs leading-relaxed dashboard-muted">Practice points: topic mastery 3, completed exam 8, successful code run 1. Daily points are capped. No grades, emails, or account names are shown.</p>
          </form>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users size={16} className="text-emerald-300" /> This week</div>
            {board.length ? <ol className="divide-y divide-white/[0.07]">
              {board.map((row) => <li key={`${row.place}-${row.alias}`} className={`flex items-center gap-3 py-2.5 text-sm ${row.is_self ? 'text-emerald-200' : ''}`}>
                <span className="w-8 shrink-0 font-mono text-xs dashboard-muted">#{row.place}</span><span className="min-w-0 flex-1 truncate font-medium">{row.alias}{row.is_self ? ' · you' : ''}</span><span className="font-mono text-xs">{row.points} pts</span>
              </li>)}
            </ol> : <p className="py-5 text-sm dashboard-muted">No one has joined yet. Be the first to start this week.</p>}
          </div>
        </div>
      )}
      {message && <p role="status" className="mt-3 text-sm text-amber-200">{message}</p>}
    </section>
  );
}
