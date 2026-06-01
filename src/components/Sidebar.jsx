import { AnimatePresence, motion } from 'framer-motion';
import
{
  LayoutDashboard,
  BookOpenText,
  Code2,
  Sparkles,
  GraduationCap,
  Terminal,
  ClipboardList,
  UserRound,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-cyan-300', glow: 'bg-cyan-400/15' },
  { id: 'docs', label: 'Documentation', icon: BookOpenText, accent: 'text-violet-300', glow: 'bg-violet-400/15' },
  { id: 'playground', label: 'Code Playground', icon: Code2, accent: 'text-emerald-300', glow: 'bg-emerald-400/15' },
  { id: 'compiler', label: 'Online Compiler', icon: Terminal, accent: 'text-amber-300', glow: 'bg-amber-400/15' },
  { id: 'exams', label: 'Mock Exams', icon: ClipboardList, accent: 'text-rose-300', glow: 'bg-rose-400/15' },
  { id: 'progress', label: 'Progress', icon: Sparkles, accent: 'text-pink-300', glow: 'bg-pink-400/15' },
  { id: 'profile', label: 'Profile', icon: UserRound, accent: 'text-cyan-300', glow: 'bg-cyan-400/15' }
];

function SidebarBody({ active, onSelect, layoutKey, onClose })
{
  const { user, profile, signOut } = useAuth();
  const initials = (user?.name || 'CS')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center shadow-glow shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="text-sm font-semibold text-white tracking-tight">Resource Hub</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">Student Edition</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition shrink-0"
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, accent, glow }) =>
        {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`relative text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition group ${
                isActive
                  ? 'text-white bg-white/[0.06]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`${layoutKey}-nav-indicator`}
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-gradient-to-b from-cyan-400 to-violet-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-6 h-6 rounded-md grid place-items-center transition ${
                  isActive ? glow : 'bg-white/[0.03] group-hover:' + glow.replace('bg-', 'bg-')
                }`}
              >
                <Icon size={13} className={isActive ? accent : `${accent} opacity-70 group-hover:opacity-100`} />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-white text-[10px] font-semibold overflow-hidden border border-white/10 shrink-0">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={user?.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-xs font-medium text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
        >
          <LogOut size={13} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ active, onSelect, mobileOpen, onMobileClose })
{
  return (
    <>
      <aside className="hidden md:flex glass w-56 shrink-0 flex-col h-full rounded-2xl">
        <SidebarBody active={active} onSelect={onSelect} layoutKey="desktop" />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-110%' }}
              animate={{ x: 0 }}
              exit={{ x: '-110%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="md:hidden fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[80vw] p-2 flex"
              role="dialog"
              aria-label="Navigation menu"
            >
              <div className="glass-strong w-full rounded-2xl flex flex-col h-full overflow-hidden">
                <SidebarBody
                  active={active}
                  onSelect={onSelect}
                  onClose={onMobileClose}
                  layoutKey="mobile"
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
