import { useMemo } from 'react';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { docCategories } from '../data/docs.js';

const TOTAL_TOPICS = docCategories.reduce((sum, c) => sum + c.cards.length, 0);

export default function ProgressTracker({ compact = false })
{
  const [mastered] = useUserStorage('mastered', []);
  const [streak] = useUserStorage('streak', { count: 0, last: null });

  const safeMastered = mastered || [];
  const safeStreak = streak || { count: 0, last: null };
  const masteryPct = Math.round((safeMastered.length / TOTAL_TOPICS) * 100);

  const perCategory = useMemo(() =>
  {
    return docCategories.map((cat) =>
    {
      const total = cat.cards.length;
      const done = cat.cards.filter((card) => safeMastered.includes(`${cat.id}:${card.title}`)).length;
      return { id: cat.id, title: cat.title, done, total };
    });
  }, [safeMastered]);

  if (compact)
  {
    return (
      <div className="grid grid-cols-2 gap-2">
        <PremiumStat
          icon={Flame}
          label="Study Streak"
          value={`${safeStreak.count}`}
          unit={`day${safeStreak.count === 1 ? '' : 's'}`}
          accent="amber"
          hint={safeStreak.last === todayISO() ? 'Active today' : 'Tap any card to log'}
        />
        <PremiumStat
          icon={Trophy}
          label="Topics Mastered"
          value={`${safeMastered.length}`}
          unit={`/ ${TOTAL_TOPICS}`}
          accent="emerald"
          hint={`${masteryPct}% complete`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <PremiumStat
          icon={Flame}
          label="Study Streak"
          value={`${safeStreak.count}`}
          unit={`day${safeStreak.count === 1 ? '' : 's'}`}
          hint={safeStreak.last ? `Last active ${safeStreak.last}` : 'No sessions yet'}
          accent="amber"
        />
        <PremiumStat
          icon={Trophy}
          label="Topics Mastered"
          value={`${safeMastered.length}`}
          unit={`/ ${TOTAL_TOPICS}`}
          hint={`${masteryPct}% complete`}
          accent="emerald"
        />
        <PremiumStat
          icon={Target}
          label="Active Goal"
          value="Daily"
          unit="practice"
          hint="Auto-logged on every action"
          accent="violet"
        />
      </div>

      <div className="glass gradient-border rounded-2xl px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-300" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Mastery by Section</h3>
          </div>
          <span className="text-[11px] text-slate-400">{masteryPct}% overall</span>
        </div>
        <div className="flex flex-col gap-2">
          {perCategory.map((c) =>
          {
            const pct = c.total === 0 ? 0 : Math.round((c.done / c.total) * 100);
            return (
              <div key={c.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">{c.title}</span>
                  <span className="text-slate-500 font-mono">
                    {c.done}/{c.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl px-4 py-3 text-[11px] text-slate-400 flex items-center gap-2">
        <Flame size={12} className="text-amber-300 shrink-0" />
        <span>
          Your streak updates automatically when you read a topic, mark it mastered, run code, or stay on a page for two minutes.
        </span>
      </div>
    </div>
  );
}

const ACCENT_STYLES = {
  amber: {
    bg: 'from-amber-400/30 via-amber-500/10 to-rose-500/15',
    text: 'from-amber-200 via-amber-300 to-rose-300',
    glow: 'bg-amber-400/15',
    iconColor: 'text-amber-200'
  },
  emerald: {
    bg: 'from-emerald-400/25 via-emerald-500/10 to-cyan-500/15',
    text: 'from-emerald-200 via-emerald-300 to-cyan-200',
    glow: 'bg-emerald-400/15',
    iconColor: 'text-emerald-200'
  },
  violet: {
    bg: 'from-violet-400/25 via-violet-500/10 to-cyan-400/20',
    text: 'from-violet-200 via-violet-300 to-cyan-200',
    glow: 'bg-violet-400/15',
    iconColor: 'text-violet-200'
  }
};

function PremiumStat({ icon: Icon, label, value, unit, hint, accent = 'amber' })
{
  const a = ACCENT_STYLES[accent] || ACCENT_STYLES.amber;
  return (
    <div className={`glass card-hover gradient-border rounded-2xl px-4 py-3 bg-gradient-to-br ${a.bg} relative overflow-hidden`}>
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${a.glow} blur-2xl pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-slate-300">{label}</span>
          <Icon size={14} className={a.iconColor} />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span
            className={`text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-br ${a.text} bg-clip-text text-transparent leading-none`}
          >
            {value}
          </span>
          {unit && <span className="text-xs text-slate-300">{unit}</span>}
        </div>
        {hint && <div className="text-[10.5px] text-slate-300/80 mt-1">{hint}</div>}
      </div>
    </div>
  );
}

function todayISO()
{
  return new Date().toISOString().slice(0, 10);
}
