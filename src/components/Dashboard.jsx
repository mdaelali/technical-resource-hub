import { ArrowRight, BookOpen, Code2, Brain, ScrollText, Terminal, ClipboardList, UserRound } from 'lucide-react';
import ProgressTracker from './ProgressTracker.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

const QUICK_LINKS = [
  { target: 'docs', categoryId: 'algorithms', label: 'Algorithms', icon: BookOpen, hint: 'Sorting, searching, graphs', tone: 'cyan' },
  { target: 'docs', categoryId: 'logic', label: 'Logic Problems', icon: Brain, hint: 'Discrete math & puzzles', tone: 'emerald' },
  { target: 'docs', categoryId: 'exam', label: 'Exam Prep', icon: ScrollText, hint: 'High-yield review notes', tone: 'violet' },
  { target: 'compiler', label: 'Online Compiler', icon: Terminal, hint: 'Java · Python · C++', tone: 'gold' },
  { target: 'exams', label: 'Mock Exams', icon: ClipboardList, hint: 'Timed MCQ & coding tests', tone: 'rose' },
  { target: 'playground', label: 'Playground', icon: Code2, hint: 'Java reference snippets', tone: 'cyan' }
];

const TONE_CLASS = {
  cyan: 'from-cyan-500/30 to-cyan-400/10 text-cyan-200',
  emerald: 'from-emerald-500/30 to-emerald-400/10 text-emerald-200',
  violet: 'from-violet-500/30 to-violet-400/10 text-violet-200',
  gold: 'from-amber-400/30 to-amber-500/10 text-amber-200',
  rose: 'from-rose-500/30 to-rose-400/10 text-rose-200',
  pink: 'from-pink-500/30 to-pink-400/10 text-pink-200'
};

export default function Dashboard({ onNavigate })
{
  const { user } = useAuth();
  const greeting = greet(user?.name);

  return (
    <div className="flex flex-col gap-3">
      <div className="glass gradient-border rounded-2xl px-4 py-4 sm:py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
        <div className="relative flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-widest text-violet-200">{todayLabel()}</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {greeting}, <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-200 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'student'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-prose">
            Pick up where you left off. Streaks update automatically as you study, master topics, and run code.
          </p>
        </div>
      </div>

      <ProgressTracker compact />

      <div className="glass rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-semibold text-white tracking-tight">Quick Access</h3>
          <span className="text-[11px] text-slate-400">Jump back in</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {QUICK_LINKS.map((link) =>
          {
            const Icon = link.icon;
            const tone = TONE_CLASS[link.tone] || TONE_CLASS.violet;
            return (
              <button
                key={link.label}
                onClick={() => onNavigate(link.target, link.categoryId ? { categoryId: link.categoryId } : {})}
                className="glass card-hover rounded-xl px-3 py-2.5 text-left flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tone} grid place-items-center`}>
                    <Icon size={13} />
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition"
                  />
                </div>
                <div className="text-xs font-semibold text-white">{link.label}</div>
                <div className="text-[10.5px] text-slate-400">{link.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass card-hover rounded-2xl px-4 py-3 md:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill bg-gradient-to-r from-violet-500/30 to-cyan-400/20 text-white">Today</span>
            <h3 className="text-sm font-semibold text-white tracking-tight">Today's Recommendation</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reinforce{' '}
            <button
              type="button"
              onClick={() => onNavigate('playground', { snippetId: 'binary-search' })}
              className="text-cyan-300 font-medium hover:text-white hover:underline underline-offset-2 transition"
            >
              Binary Search
            </button>{' '}
            by walking through the iterative implementation in the playground, then mark the
            related card as mastered to extend your streak. Daily 20-minute drills compound fast.
          </p>
          <button
            onClick={() => onNavigate('playground', { snippetId: 'binary-search' })}
            className="mt-2 inline-flex items-center gap-1 text-xs text-violet-300 hover:text-white transition"
          >
            <span>Open snippet</span>
            <ArrowRight size={12} />
          </button>
        </div>
        <div className="glass card-hover rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill bg-amber-400/20 text-amber-200">Tip</span>
            <h3 className="text-sm font-semibold text-white tracking-tight">Tip of the Day</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When solving DP problems, articulate the recurrence in plain English before
            coding. If you can't explain the transition, the implementation will not be correct.
          </p>
        </div>
      </div>
    </div>
  );
}

function todayLabel()
{
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

function greet(name)
{
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
