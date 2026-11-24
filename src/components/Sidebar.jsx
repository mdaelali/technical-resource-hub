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
  ClipboardList,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'docs', label: 'Documentation', icon: BookOpenText },
  { id: 'playground', label: 'Code Playground', icon: Code2 },
  { id: 'compiler', label: 'Online Compiler', icon: Terminal },
  { id: 'exams', label: 'Mock Exams', icon: ClipboardList },
  { id: 'games', label: 'Code Sprint', icon: Gamepad2 },
  { id: 'progress', label: 'Progress', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: UserRound }
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
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-strong)] grid place-items-center shrink-0">
          <GraduationCap size={17} className="text-white" />
        </div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="font-display text-[15px] font-semibold text-white">Resource Hub</div>
          <div className="text-[11px] text-slate-400">Student edition</div>
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
        {NAV_ITEMS.map(({ id, label, icon: Icon }) =>
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
                  className="absolute inset-0 rounded-xl bg-[var(--accent-soft)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {/* Left indicator */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutKey}-indicator`}
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[var(--accent)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {/* Icon with glow */}
              <span className={`relative w-7 h-7 rounded-lg grid place-items-center transition-all duration-200 shrink-0 ${
                isActive ? 'bg-emerald-400/15' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
              }`}>
                <Icon
                  size={14}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-emerald-200' : 'text-slate-500 group-hover:text-emerald-300'
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
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-strong)] grid place-items-center text-[11px] font-semibold text-white overflow-hidden shrink-0">
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
            <div className="text-xs font-semibold text-white truncate group-hover:text-[var(--accent)] transition-colors">
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
