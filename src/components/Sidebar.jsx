import { AnimatePresence, motion } from 'framer-motion';
import
{
  LayoutDashboard,
  BookOpenText,
  Code2,
  Sparkles,
  GraduationCap,
  Terminal,
  UserRound,
  X,
  LogOut,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    accent: 'text-cyan-300',
    glow: 'bg-cyan-400/15',
    activeBg: 'from-cyan-500/20 to-cyan-400/10'
  },
  {
    id: 'docs',
    label: 'Documentation',
    icon: BookOpenText,
    accent: 'text-violet-300',
    glow: 'bg-violet-400/15',
    activeBg: 'from-violet-500/20 to-violet-400/10'
  },
  {
    id: 'playground',
    label: 'Code Playground',
    icon: Code2,
    accent: 'text-emerald-300',
    glow: 'bg-emerald-400/15',
    activeBg: 'from-emerald-500/20 to-emerald-400/10'
  },
  {
    id: 'compiler',
    label: 'Online Compiler',
    icon: Terminal,
    accent: 'text-amber-300',
    glow: 'bg-amber-400/15',
    activeBg: 'from-amber-500/20 to-amber-400/10'
  },
  {
    id: 'exams',
    label: 'Mock Exams',
    icon: ClipboardList,
    accent: 'text-rose-300',
    glow: 'bg-rose-400/15',
    activeBg: 'from-rose-500/20 to-rose-400/10'
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: Sparkles,
    accent: 'text-pink-300',
    glow: 'bg-pink-400/15',
    activeBg: 'from-pink-500/20 to-pink-400/10'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserRound,
    accent: 'text-cyan-300',
    glow: 'bg-cyan-400/15',
    activeBg: 'from-cyan-500/20 to-cyan-400/10'
  }
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
      {/* Brand header */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-violet-400 to-cyan-400 grid place-items-center shadow-glow shrink-0 relative">
          <GraduationCap size={17} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--bg-base)]" />
        </div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="text-sm font-bold text-white tracking-tight">Resource Hub</div>
          <div className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Student Edition</div>
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

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, accent, glow, activeBg }) =>
        {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`relative w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              {/* Active background */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutKey}-active-bg`}
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${activeBg}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {/* Left indicator */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutKey}-indicator`}
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-gradient-to-b from-cyan-400 to-violet-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {/* Icon with glow */}
              <span className={`relative w-7 h-7 rounded-lg grid place-items-center transition-all duration-200 shrink-0 ${
                isActive ? glow : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
              }`}>
                <Icon
                  size={14}
                  className={`transition-colors duration-200 ${
                    isActive ? accent : `text-slate-500 group-hover:${accent}`
                  }`}
                />
              </span>
              <span className="relative truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User identity panel */}
      <div className="px-2.5 py-2.5 border-t border-white/5 flex flex-col gap-1.5">
        <button
          onClick={() => onSelect('profile')}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition group w-full text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-[11px] font-semibold text-white overflow-hidden border border-white/10 shrink-0">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={user?.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
              {user?.name || 'Student'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
          </div>
        </button>

        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 transition w-full"
        >
          <LogOut size={12} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ active, onSelect, mobileOpen, onMobileClose })
{
  function handleSelect(id)
  {
    if (mobileOpen)
    {
      onMobileClose?.();
    }
    onSelect(id);
  }

  return (
    <>
      {/* Desktop — static sidebar */}
      <aside className="hidden md:flex glass w-56 shrink-0 flex-col h-full rounded-2xl overflow-hidden">
        <SidebarBody active={active} onSelect={handleSelect} layoutKey="desktop" />
      </aside>

      {/* Mobile — slide-in drawer */}
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
              className="md:hidden fixed top-0 bottom-0 left-0 z-50 w-60 max-w-[82vw] p-2 flex"
              role="dialog"
              aria-label="Navigation menu"
            >
              <div className="glass-strong w-full rounded-2xl flex flex-col h-full overflow-hidden">
                <SidebarBody
                  active={active}
                  onSelect={handleSelect}
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
