import { useCallback, useEffect, useRef, useState } from 'react';
import { Award, Clock3, Gamepad2, Medal, RefreshCw, Trophy, Users, Zap } from 'lucide-react';
import { supabase } from '../api/supabaseClient.js';
import { useAuth } from '../auth/AuthContext.jsx';

const AWARD_LABELS = { champion: 'Weekly champion', runner_up: 'Runner-up', third_place: 'Third place' };

export default function GameArena({ onNavigate })
{
  const { user } = useAuth();
  const [round, setRound] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(12);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [standings, setStandings] = useState([]);
  const [awards, setAwards] = useState([]);
  const [practiceAvailable, setPracticeAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const submitLock = useRef(false);
  const configured = Boolean(supabase && user);

  useEffect(() => {
    let active = true;
    if (!configured) return () => { active = false; };
    const loadBoard = async () => {
      try {
        const [boardResult, awardResult, statusResult] = await Promise.all([
          supabase.rpc('get_weekly_game_standings'),
          supabase.rpc('get_public_game_awards'),
          supabase.rpc('get_cs_sprint_status')
        ]);
        if (!active) return;
        const error = boardResult.error || awardResult.error || statusResult.error;
        if (error)
        {
          setMessage(`Standings request failed (${error.code || 'Supabase error'}): ${error.message}.`);
          return;
        }
        setStandings(boardResult.data || []);
        setAwards(awardResult.data || []);
        setPracticeAvailable(statusResult.data?.[0]?.practice_available === true);
        setMessage('');
      } catch (error) {
        if (active) setMessage(`Standings request failed: ${error.message || 'network error'}.`);
      }
    };
    void loadBoard();
    const interval = window.setInterval(loadBoard, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [configured]);

  const refreshBoard = useCallback(async () => {
    if (!configured) return;
    setRefreshing(true);
    try {
      const [boardResult, awardResult, statusResult] = await Promise.all([
        supabase.rpc('get_weekly_game_standings'),
        supabase.rpc('get_public_game_awards'),
        supabase.rpc('get_cs_sprint_status')
      ]);
      const error = boardResult.error || awardResult.error || statusResult.error;
      if (error)
      {
        setMessage(`Could not refresh standings (${error.code || 'Supabase error'}): ${error.message}.`);
        return;
      }
      setStandings(boardResult.data || []);
      setAwards(awardResult.data || []);
      setPracticeAvailable(statusResult.data?.[0]?.practice_available === true);
      setMessage('');
    } catch (error) {
      setMessage(`Could not refresh standings: ${error.message || 'network error'}.`);
    } finally {
      setRefreshing(false);
    }
  }, [configured]);

  async function startRound(practice = false)
  {
    if (!configured || busy) return;
    setBusy(true);
    setMessage('');
    const { data, error } = await supabase.rpc(practice ? 'start_cs_sprint_practice' : 'start_cs_sprint');
    setBusy(false);
    if (error)
    {
      setMessage(error.message.includes('Daily game limit')
        ? 'You have reached the 12-round daily limit. Come back tomorrow to play again.'
        : error.message.includes('Join the opt-in')
        ? 'Join the optional Study League on the Progress page to enter the weekly game standings.'
        : error.message.includes('optional practice round')
        ? 'The one-time practice round is available only before your first ranked round.'
        : 'Could not start a round. Check that the Supabase competition migration is installed.');
      return;
    }
    setPracticeAvailable(false);
    setRound(data);
    setSecondsLeft(data.seconds || 12);
    setDeadline(Date.now() + (data.seconds || 12) * 1000);
    submitLock.current = false;
  }

  const submitAnswer = useCallback(async (answer) => {
    if (!round || busy || submitLock.current) return;
    submitLock.current = true;
    setBusy(true);
    const { data, error } = await supabase.rpc('answer_cs_sprint', {
      p_session_id: round.sessionId,
      p_question_id: round.question.id,
      p_answer: answer
    });
    if (error)
    {
      submitLock.current = false;
      setBusy(false);
      setMessage('Your answer could not be saved. Check your connection and try again.');
      return;
    }
    if (data.complete)
    {
      setRound({ ...data, finished: true });
      setDeadline(null);
      setBusy(false);
      if (data.expired) setMessage('That round expired when the weekly league rolled over, so it was not added to the standings.');
      else void refreshBoard();
      return;
    }
    setRound({ ...round, ...data });
    setDeadline(Date.now() + (data.seconds || 12) * 1000);
    setSecondsLeft(data.seconds || 12);
    submitLock.current = false;
    setBusy(false);
  }, [busy, refreshBoard, round]);

  useEffect(() => {
    if (!round?.question?.id || !deadline || round.finished) return undefined;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) void submitAnswer(null);
    }, 150);
    return () => window.clearInterval(timer);
  }, [deadline, round?.question?.id, round?.finished, submitAnswer]);

  return (
    <div className="learning-page dashboard-page">
      <header className="learning-page-header flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-300/15 text-emerald-200"><Gamepad2 size={22} /></span>
          <div><p className="page-header-eyebrow dashboard-eyebrow">WEEKLY CS LEAGUE</p><h1 className="page-header-title mt-1 text-2xl font-semibold tracking-tight">Code Sprint</h1><p className="page-header-description mt-1 max-w-2xl text-sm">Ten original Java questions. Twelve seconds each. Fast, correct answers earn more points.</p></div>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-xs text-slate-200">Top three earn a public weekly award</div>
      </header>

      {!user ? <section className="dashboard-panel rounded-2xl p-5 text-sm dashboard-muted">Sign in to play Code Sprint and join the public standings.</section> : !supabase ? <section className="dashboard-panel rounded-2xl p-5 text-sm dashboard-muted">Configure Supabase to play and save game standings.</section> : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)]">
          <section className="dashboard-panel min-h-[25rem] rounded-3xl p-5 sm:p-7" aria-labelledby="sprint-round-title">
            {!round ? <div className="flex min-h-[21rem] flex-col items-start justify-center">
              <span className="stat-icon stat-mint grid h-12 w-12 place-items-center rounded-2xl"><Zap size={21} /></span>
              <p className="mt-5 dashboard-eyebrow">10 QUESTIONS · 12 SECONDS EACH</p>
              <h2 id="sprint-round-title" className="mt-2 text-2xl font-semibold">Ready for a quick round?</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed dashboard-muted">{practiceAvailable ? 'Choose one practice round before your first ranked game, or start ranked immediately. Every later round is ranked.' : 'All new rounds are ranked. Your best completed score counts toward this week’s standings.'} The daily limit is 12 rounds.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => startRound(false)} disabled={busy} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-200 disabled:opacity-50">{busy ? 'Starting…' : 'Start ranked round'} <Zap size={17} /></button>
                {practiceAvailable && <button type="button" onClick={() => startRound(true)} disabled={busy} className="min-h-12 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/5 disabled:opacity-50">Use one practice round</button>}
              </div>
            </div> : round.finished ? <div className="flex min-h-[21rem] flex-col items-start justify-center">
              <span className="stat-icon stat-mint grid h-12 w-12 place-items-center rounded-2xl"><Trophy size={21} /></span>
              <p className="mt-5 dashboard-eyebrow">ROUND COMPLETE</p>
              <h2 id="sprint-round-title" className="mt-2 text-3xl font-bold">{round.score} points</h2>
              <p className="mt-2 text-sm dashboard-muted">{round.correct} of {round.total} correct. {round.ranked ? 'Your score can enter this week’s standings.' : 'This was a practice round and does not affect this week’s standings.'}</p>
              <button type="button" onClick={() => { setRound(null); setMessage(''); }} className="mt-6 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/5">Play another round</button>
            </div> : <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="dashboard-eyebrow">{round.ranked ? 'RANKED ROUND' : 'PRACTICE ROUND'} · QUESTION {round.questionNumber} OF {round.totalQuestions}</p><h2 id="sprint-round-title" className="mt-1 text-xl font-semibold">{round.question.topic}</h2></div>
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-lg font-bold ${secondsLeft <= 4 ? 'bg-rose-400/15 text-rose-200' : 'bg-emerald-300/10 text-emerald-200'}`}><Clock3 size={17} />{secondsLeft}s</div>
              </div>
              <div className="my-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-[width] duration-200" style={{ width: `${(round.questionNumber / round.totalQuestions) * 100}%` }} /></div>
              <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-white sm:text-lg">{round.question.prompt}</p>
              <div className="mt-5 grid gap-2.5">
                {round.question.options.map((option, index) => <button key={`${round.question.id}-${index}`} type="button" disabled={busy} onClick={() => submitAnswer(index)} className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-left text-sm leading-relaxed text-slate-100 transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.07] disabled:opacity-50"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.07] font-mono text-xs text-emerald-200">{String.fromCharCode(65 + index)}</span><span className="break-words">{option}</span></button>)}
              </div>
              <p className="mt-4 text-xs dashboard-muted">Current round: {round.score} points · {round.correct} correct</p>
            </>}
          </section>

          <div className="flex flex-col gap-4">
            <section className="dashboard-panel rounded-3xl p-5" aria-labelledby="sprint-standings-title">
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Users size={18} className="text-emerald-200" /><h2 id="sprint-standings-title" className="text-lg font-semibold">This week’s standings</h2></div><button type="button" onClick={() => refreshBoard()} disabled={refreshing} aria-label="Refresh standings" className="rounded-lg border border-white/10 p-2 text-slate-300 hover:text-white disabled:opacity-50"><RefreshCw size={15} /></button></div>
              <p className="mt-1 text-xs dashboard-muted">Top 50 plus your rank · best ranked round · refreshes every 30 seconds · ties use correct answers, then finish time</p>
              <ol className="mt-4 max-h-[26rem] divide-y divide-white/[0.07] overflow-y-auto pr-1">
                {standings.map((row) => <li key={`${row.place}-${row.alias}`} className={`flex items-center gap-3 py-3 text-sm ${row.is_self ? 'text-emerald-200' : ''}`}>
                  <span className="w-8 shrink-0 font-mono text-xs dashboard-muted">#{row.place}</span><span className="min-w-0 flex-1 truncate font-medium">{row.alias}{row.is_self ? ' · you' : ''}</span><span className="font-mono text-xs">{row.points} pts</span>
                </li>)}
              </ol>
              {!standings.length && <p className="py-4 text-sm dashboard-muted">No eligible scores yet. Finish a ranked round this week to appear here; practice rounds are not included.</p>}
            </section>

            <section className="dashboard-panel rounded-3xl p-5" aria-labelledby="sprint-awards-title">
              <div className="flex items-center gap-2"><Award size={18} className="text-amber-200" /><h2 id="sprint-awards-title" className="text-lg font-semibold">Award wall</h2></div>
              <p className="mt-1 text-xs dashboard-muted">Weekly awards are added automatically after the week closes.</p>
              <ul className="mt-3 flex flex-col gap-2">
                {awards.map((award) => <li key={`${award.week_start}-${award.alias}-${award.award_type}`} className="flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2.5 text-sm"><Medal size={16} className="shrink-0 text-amber-200" /><span className="min-w-0 flex-1 font-medium">{award.alias}</span><span className="text-xs text-amber-100">{AWARD_LABELS[award.award_type] || award.award_type}</span><span className="w-full pl-6 text-xs dashboard-muted">{award.week_start} · {award.score} pts</span></li>)}
              </ul>
              {!awards.length && <p className="py-3 text-sm dashboard-muted">The first award will be recorded when this week’s league ends.</p>}
              <button type="button" onClick={() => onNavigate?.('profile')} className="mt-3 text-sm font-medium text-emerald-200 hover:text-white">View your profile awards →</button>
            </section>
          </div>
        </div>
      )}
      {message && <p role="status" className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-sm text-amber-100">{message}{message.includes('Progress page') && <button type="button" onClick={() => onNavigate?.('progress')} className="ml-2 underline underline-offset-2">Go to Progress</button>}</p>}
    </div>
  );
}
