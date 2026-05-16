import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import
{
  Search,
  Bell,
  X,
  Flame,
  Trophy,
  Sparkles,
  Calendar,
  Code2,
  Menu
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import useUserStorage from '../hooks/useUserStorage.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { docCategories } from '../data/docs.js';

const TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your learning progress' },
  docs: { title: 'Documentation', subtitle: 'Curated study material across core CS topics' },
  playground: { title: 'Code Playground', subtitle: 'Java reference snippets with syntax highlighting' },
  compiler: { title: 'Online Compiler', subtitle: 'Write and run Java, Python, and C++ in your browser' },
  progress: { title: 'Progress Tracker', subtitle: 'Streak, mastery, and topic-level milestones' },
  profile: { title: 'Profile', subtitle: 'Your study identity, badges, and recent activity' }
};

const TOTAL_TOPICS = docCategories.reduce((sum, c) => sum + c.cards.length, 0);

function todayISO()
{
  return new Date().toISOString().slice(0, 10);
}

function buildReminders({ streak, mastered })
{
  const today = todayISO();
  const reminders = [];

  if (streak.last !== today)
  {
    reminders.push({
      id: 'log-today',
      icon: Flame,
      tone: 'amber',
      title: "Today's session not logged yet",
      body: 'Open any topic and tap Read more, mark something as mastered, or run code — your streak auto-extends.'
    });
  }
  else
  {
    reminders.push({
      id: 'streak-active',
      icon: Flame,
      tone: 'emerald',
      title: `${streak.count}-day streak active`,
      body: "You've already logged today — keep the momentum tomorrow."
    });
  }

  if (mastered.length === 0)
  {
    reminders.push({
      id: 'first-master',
      icon: Trophy,
      tone: 'violet',
      title: 'Master your first topic',
      body: "Open Documentation, pick a card, and hit 'Mark mastered' to earn your first badge."
    });
  }
  else if (mastered.length < TOTAL_TOPICS)
  {
    reminders.push({
      id: 'keep-mastering',
      icon: Trophy,
      tone: 'violet',
      title: `${mastered.length} / ${TOTAL_TOPICS} topics mastered`,
      body: `You have ${TOTAL_TOPICS - mastered.length} topics left to fully complete the catalog.`
    });
  }
  else
  {
    reminders.push({
      id: 'all-mastered',
      icon: Sparkles,
      tone: 'emerald',
      title: 'All topics mastered',
      body: 'Outstanding — try the Online Compiler to apply what you learned.'
    });
  }

  reminders.push({
    id: 'try-compiler',
    icon: Code2,
    tone: 'cyan',
    title: 'Practice in the Online Compiler',
    body: 'Write Java, Python, or C++ and run it live via Judge0.'
  });

  reminders.push({
    id: 'review-cycle',
    icon: Calendar,
    tone: 'violet',
    title: 'Review the recently viewed list',
    body: 'Spaced repetition: revisit yesterday\'s topics on your Profile to lock them in.'
  });

  return reminders;
}

export default function Topbar({ section, searchQuery, onSearchChange, onNavigate, onMenuOpen })
{
  const { title, subtitle } = TITLES[section] || TITLES.dashboard;

  const { user, profile } = useAuth();
  const [streak] = useUserStorage('streak', { count: 0, last: null });
  const [mastered] = useUserStorage('mastered', []);
  const [readReminders, setReadReminders] = useLocalStorage('trh.readReminders', []);

  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const reminders = useMemo(() => buildReminders({ streak, mastered }), [streak, mastered]);
  const unreadCount = reminders.filter((r) => !readReminders.includes(r.id)).length;

  useEffect(() =>
  {
    if (!bellOpen)
    {
      return;
    }
    function onDocClick(event)
    {
      if (bellRef.current && !bellRef.current.contains(event.target))
      {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [bellOpen]);

  function toggleBell()
  {
    setBellOpen((prev) =>
    {
      const next = !prev;
      if (next)
      {
        setReadReminders(reminders.map((r) => r.id));
      }
      return next;
    });
  }

  const initials = (user?.name || 'CS')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="glass rounded-2xl px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3 relative z-30">
      <button
        onClick={onMenuOpen}
        className="md:hidden w-8 h-8 grid place-items-center rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu size={14} />
      </button>

      <div className="leading-tight min-w-0 flex-1">
        <h1 className="text-sm md:text-base font-semibold text-white truncate">{title}</h1>
        <p className="text-[10px] md:text-[11px] text-slate-400 truncate hidden sm:block">{subtitle}</p>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="bg-white/[0.04] border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-400/50 w-32 sm:w-44 md:w-56"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5 rounded transition"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="relative" ref={bellRef}>
          <button
            onClick={toggleBell}
            className="w-7 h-7 grid place-items-center rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition relative"
            aria-label="Open notifications"
          >
            <Bell size={13} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-semibold grid place-items-center">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] popover rounded-2xl overflow-hidden z-50"
              >
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Study reminders</span>
                  <span className="text-[10px] text-slate-500">{reminders.length} active</span>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {reminders.map((r) =>
                  {
                    const Icon = r.icon;
                    const tone = TONES[r.tone] || TONES.violet;
                    return (
                      <li
                        key={r.id}
                        className="px-3 py-2 border-b border-white/5 last:border-b-0 flex items-start gap-2"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${tone.bg}`}
                        >
                          <Icon size={13} className={tone.icon} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white">{r.title}</div>
                          <div className="text-[11px] text-slate-300 leading-snug">{r.body}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onNavigate?.('profile')}
          className="w-7 h-7 grid place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white overflow-hidden border border-white/10 hover:opacity-90 transition"
          aria-label="Open profile"
        >
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={user?.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-semibold">{initials}</span>
          )}
        </button>
      </div>
    </header>
  );
}

const TONES = {
  amber: { bg: 'bg-amber-500/15', icon: 'text-amber-300' },
  emerald: { bg: 'bg-emerald-500/15', icon: 'text-emerald-300' },
  violet: { bg: 'bg-violet-500/15', icon: 'text-violet-300' },
  cyan: { bg: 'bg-cyan-500/15', icon: 'text-cyan-300' }
};
