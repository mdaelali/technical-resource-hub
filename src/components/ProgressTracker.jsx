import { useMemo } from 'react';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { docCategories } from '../data/docs.js';
import { localDateKey } from '../utils/dates.js';
import './Dashboard.css';
import WeeklyCompetition from './WeeklyCompetition.jsx';

const TOTAL_TOPICS = docCategories.reduce((sum, category) => sum + category.cards.length, 0);
const EMPTY_MASTERED = [];

export default function ProgressTracker({ compact = false })
{
  const [mastered] = useUserStorage('mastered', []);
  const [streak] = useUserStorage('streak', { count: 0, last: null });
  const safeMastered = mastered || EMPTY_MASTERED;
  const safeStreak = streak || { count: 0, last: null };
  const masteredCount = safeMastered.length;
  const remaining = Math.max(0, TOTAL_TOPICS - masteredCount);
  const masteryPct = TOTAL_TOPICS ? Math.min(100, Math.round((masteredCount / TOTAL_TOPICS) * 100)) : 0;
  const activeToday = safeStreak.last === localDateKey();
  const streakHint = activeToday
    ? 'You showed up today'
    : safeStreak.count > 0
      ? 'Keep your momentum going'
      : 'Start with one short session';

  const perCategory = useMemo(() =>
  {
    return docCategories.map((category) =>
    {
      const total = category.cards.length;
      const done = category.cards.filter((card) => safeMastered.includes(`${category.id}:${card.title}`)).length;
      return { id: category.id, title: category.title, done, total };
    });
  }, [safeMastered]);

  const stats = (
    <div className={`grid grid-cols-1 ${compact ? 'grid-cols-2' : 'md:grid-cols-3'} gap-3`}>
      <ProgressStat
        icon={Flame}
        label="Learning streak"
        value={safeStreak.count}
        unit={safeStreak.count === 1 ? 'day' : 'days'}
        detail={streakHint}
        tone="peach"
      />
      <ProgressStat
        icon={Trophy}
        label="Concepts mastered"
        value={masteredCount}
        unit={`/ ${TOTAL_TOPICS}`}
        detail={`${masteryPct}% of the library`}
        tone="mint"
      />
      {!compact && (
        <ProgressStat
          icon={Target}
          label="Still to explore"
          value={remaining}
          unit={remaining === 1 ? 'topic' : 'topics'}
          detail="Across AP CSA and core CS"
          tone="blue"
        />
      )}
    </div>
  );

  if (compact)
  {
    return <div className="progress-page dashboard-page">{stats}</div>;
  }

  return (
    <div className="progress-page dashboard-page flex flex-col gap-4 pb-6 sm:gap-5">
      {stats}

      <section className="dashboard-panel rounded-3xl p-5 sm:p-6" aria-labelledby="mastery-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="dashboard-eyebrow">YOUR COVERAGE</p>
            <h2 id="mastery-heading" className="mt-1 text-xl font-semibold tracking-tight">Mastery by section</h2>
            <p className="mt-1 text-sm dashboard-muted">A clear view of what you have learned so far.</p>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            {masteryPct}% overall
          </span>
        </div>

        <div className="mt-5 divide-y divide-white/[0.07]">
          {perCategory.map((category) =>
          {
            const pct = category.total === 0 ? 0 : Math.round((category.done / category.total) * 100);
            return (
              <div key={category.id} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{category.title}</span>
                  <span className="font-mono text-xs dashboard-muted">{category.done} / {category.total}</span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-white/[0.08]"
                  role="progressbar"
                  aria-label={`${category.title} mastery`}
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-fill rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="dashboard-panel flex items-start gap-3 rounded-2xl p-4 sm:items-center">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl stat-icon stat-peach">
          <Flame size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold">Small sessions keep your streak alive</p>
          <p className="mt-0.5 text-xs dashboard-muted">
            Reading a topic, marking one mastered, running code, or spending two minutes learning records activity for today.
          </p>
        </div>
        <TrendingUp size={17} className="ml-auto hidden shrink-0 text-emerald-300 sm:block" aria-hidden="true" />
      </aside>

      <WeeklyCompetition />
    </div>
  );
}

function ProgressStat({ icon: Icon, label, value, unit, detail, tone })
{
  return (
    <article className="dashboard-panel flex min-w-0 items-center gap-4 rounded-2xl p-4 sm:p-5">
      <span className={`stat-icon stat-${tone} grid h-11 w-11 shrink-0 place-items-center rounded-2xl`}>
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium dashboard-muted">{label}</p>
        <p className="mt-0.5 text-xl font-semibold tracking-tight">
          {value} <span className="text-xs font-medium dashboard-muted">{unit}</span>
        </p>
        <p className="mt-0.5 truncate text-[11px] dashboard-muted">{detail}</p>
      </div>
    </article>
  );
}
