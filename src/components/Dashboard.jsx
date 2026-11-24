import { ArrowRight, BookOpen, Brain, Check, Code2, Flame, GraduationCap, Sparkles, Terminal, Timer, Trophy } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { docCategories } from '../data/docs.js';
import useStreak from '../hooks/useStreak.js';
import useUserStorage from '../hooks/useUserStorage.js';
import useMidnightTick from '../hooks/useMidnightTick.js';
import { localDateKey } from '../utils/dates.js';
import './Dashboard.css';

const TOTAL_TOPICS = docCategories.reduce((sum, category) => sum + category.cards.length, 0);

export default function Dashboard({ onNavigate })
{
  const { user } = useAuth();
  const [streak] = useStreak();
  const [mastered] = useUserStorage('mastered', []);
  const [recent] = useUserStorage('recentlyViewed', []);
  const [plan, setPlan] = useUserStorage('learningPlan', { date: localDateKey(), completed: [] });
  const today = useMidnightTick();
  const completed = plan?.date === today ? plan.completed || [] : [];
  const completion = Math.round((completed.length / 3) * 100);
  const nextTopic = findNextTopic(mastered || []);
  const lastTopic = findRecentTopic(recent || []);
  const focusTopic = lastTopic || nextTopic;

  function toggleTask(id)
  {
    setPlan((current) =>
    {
      const done = current?.date === today ? current.completed || [] : [];
      return {
        date: today,
        completed: done.includes(id) ? done.filter((task) => task !== id) : [...done, id]
      };
    });
  }

  const tasks = [
    { id: 'concept', title: 'Learn one concept', detail: nextTopic.card.title, icon: BookOpen, action: () => onNavigate('docs', { categoryId: nextTopic.category.id }) },
    { id: 'code', title: 'Write a little code', detail: 'Open the online compiler', icon: Code2, action: () => onNavigate('compiler') },
    { id: 'quiz', title: 'Check your understanding', detail: 'Try a timed practice exam', icon: Brain, action: () => onNavigate('exams') }
  ];

  return (
    <div className="dashboard-page flex flex-col gap-5 sm:gap-6 pb-6">
      <section className="dashboard-hero relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9 lg:p-11">
        <div className="dashboard-orbit dashboard-orbit-one" aria-hidden="true" />
        <div className="dashboard-orbit dashboard-orbit-two" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium tracking-wide text-emerald-100">
              <Sparkles size={13} /> A little progress, every day
            </div>
            <p className="mt-6 text-sm font-medium text-slate-300">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
              Make today a <span className="text-emerald-300">good day to learn.</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Build a steady CS habit with clear notes, hands-on code, and practice that meets you where you are.
            </p>
            <button onClick={() => onNavigate('docs', { categoryId: nextTopic.category.id })} className="dashboard-cta mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              Continue learning <ArrowRight size={16} />
            </button>
          </div>

          <div className="dashboard-code-card relative mx-auto w-full max-w-md rounded-2xl border border-white/10 p-4 shadow-2xl sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2"><span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400"/><i className="h-2.5 w-2.5 rounded-full bg-amber-300"/><i className="h-2.5 w-2.5 rounded-full bg-emerald-400"/></span><span className="ml-2 text-[11px] text-slate-400">today.java</span></div>
              <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] font-medium text-emerald-200">YOUR NEXT STEP</span>
            </div>
            <div className="py-5 font-mono text-[12px] leading-7 sm:text-[13px]">
              <div><span className="text-[var(--accent)]">int</span> <span className="text-[var(--accent)]">curiosity</span> = <span className="text-amber-200">1</span>;</div>
              <div><span className="text-[var(--accent)]">while</span> (curiosity {'>'} <span className="text-amber-200">0</span>) {'{'}</div>
              <div className="pl-5"><span className="text-emerald-200">learn</span>(<span className="text-orange-200">"{nextTopic.card.title}"</span>);</div>
              <div className="pl-5">curiosity++;</div>
              <div>{'}'}</div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2.5 text-[11px] text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Every expert started with one small question.</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Your learning progress">
        <StatCard icon={Flame} label="Learning streak" value={`${streak.count}`} suffix={streak.count === 1 ? 'day' : 'days'} detail={streak.last === today ? 'You showed up today' : 'Start a session today'} tone="peach" />
        <StatCard icon={Trophy} label="Concepts mastered" value={`${(mastered || []).length}`} suffix={`/ ${TOTAL_TOPICS}`} detail={`${Math.round(((mastered || []).length / TOTAL_TOPICS) * 100)}% of the library`} tone="mint" />
        <StatCard icon={Timer} label="Today's study plan" value={`${completed.length}`} suffix="/ 3 steps" detail={completed.length === 3 ? 'Lovely work. You did it!' : 'Small steps add up'} tone="blue" />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="dashboard-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="dashboard-eyebrow">A SIMPLE ROUTINE</p><h3 className="mt-1 text-xl font-semibold">Your learning plan</h3><p className="mt-1 text-sm dashboard-muted">Three small steps make a focused study session.</p></div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">{completion}% complete</span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${completion}%` }} /></div>
          <div className="mt-4 divide-y divide-white/[0.07]">
            {tasks.map(({ id, title, detail, icon: Icon, action }, index) =>
            {
              const done = completed.includes(id);
              return (
                <div key={id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <button onClick={() => toggleTask(id)} aria-label={`${done ? 'Mark incomplete' : 'Mark complete'}: ${title}`} aria-pressed={done} className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition ${done ? 'border-emerald-300 bg-emerald-300 text-slate-950' : 'border-white/20 text-transparent hover:border-emerald-300/70'}`}><Check size={14}/></button>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-emerald-200"><Icon size={16}/></span>
                  <button onClick={action} className="min-w-0 flex-1 text-left"><span className={`block text-sm font-medium ${done ? 'text-slate-400 line-through' : 'text-white'}`}>{index + 1}. {title}</span><span className="mt-0.5 block truncate text-xs dashboard-muted">{detail}</span></button>
                  <button onClick={action} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.07] hover:text-white" aria-label={`Start: ${title}`}><ArrowRight size={15}/></button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="dashboard-panel rounded-3xl p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><p className="dashboard-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h3 className="mt-1 text-xl font-semibold">A good next topic</h3></div><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><BookOpen size={18}/></span></div>
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-[var(--accent)]">{nextTopic.category.title}</span><span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[10px] dashboard-muted">{nextTopic.card.tag}</span></div>
            <h4 className="mt-3 text-lg font-semibold text-white">{focusTopic.card.title}</h4>
            <p className="mt-2 text-sm leading-6 dashboard-muted">{focusTopic.card.explanation.slice(0, 156)}{focusTopic.card.explanation.length > 156 ? 'вЂ¦' : ''}</p>
            <button onClick={() => onNavigate('docs', { categoryId: focusTopic.category.id })} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">Open topic <ArrowRight size={15}/></button>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-300/[0.07] p-3.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-300/10 text-amber-200"><GraduationCap size={17}/></span><p className="text-xs leading-5 dashboard-muted"><strong className="font-semibold text-amber-100">Study tip</strong><br/>Try to explain an algorithm in your own words before you look at its code.</p></div>
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between"><div><p className="dashboard-eyebrow">YOUR TOOLKIT</p><h3 className="mt-1 text-xl font-semibold">Learn by doing</h3></div><span className="hidden text-xs dashboard-muted sm:block">Choose your next activity</span></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FeatureCard icon={BookOpen} title="CS concepts" detail="Algorithms, logic & exam notes" tone="mint" onClick={() => onNavigate('docs')} />
          <FeatureCard icon={Code2} title="Code playground" detail="Explore worked examples" tone="blue" onClick={() => onNavigate('playground', { snippetId: 'binary-search' })} />
          <FeatureCard icon={Terminal} title="Online compiler" detail="Run Java, Python or C++" tone="peach" onClick={() => onNavigate('compiler')} />
          <FeatureCard icon={Brain} title="Practice exams" detail="Build confidence with quizzes" tone="lilac" onClick={() => onNavigate('exams')} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix, detail, tone })
{
  return <div className="dashboard-panel flex items-center gap-4 rounded-2xl p-4 sm:p-5"><span className={`stat-icon stat-${tone} grid h-11 w-11 shrink-0 place-items-center rounded-2xl`}><Icon size={19}/></span><div className="min-w-0"><p className="text-xs font-medium dashboard-muted">{label}</p><p className="mt-0.5 text-xl font-semibold tracking-tight">{value} <span className="text-xs font-medium dashboard-muted">{suffix}</span></p><p className="mt-0.5 truncate text-[11px] dashboard-muted">{detail}</p></div></div>;
}

function FeatureCard({ icon: Icon, title, detail, tone, onClick })
{
  return <button onClick={onClick} className="dashboard-panel group flex items-center gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/30"><span className={`stat-icon stat-${tone} grid h-10 w-10 shrink-0 place-items-center rounded-xl`}><Icon size={18}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block truncate text-xs dashboard-muted">{detail}</span></span><ArrowRight size={15} className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-300"/></button>;
}

function findNextTopic(mastered)
{
  for (const category of docCategories)
  {
    const card = category.cards.find((item) => !mastered.includes(`${category.id}:${item.title}`));
    if (card) return { category, card };
  }
  return { category: docCategories[0], card: docCategories[0].cards[0] };
}

function findRecentTopic(recent)
{
  const item = recent[0];
  if (!item) return null;
  const category = docCategories.find((group) => group.id === item.categoryId);
  const card = category?.cards.find((topic) => topic.title === item.title);
  return card ? { category, card } : null;
}
