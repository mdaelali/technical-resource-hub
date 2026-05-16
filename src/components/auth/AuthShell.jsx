import { GraduationCap } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer })
{
  return (
    <div className="min-h-[100dvh] w-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center shadow-glow">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white tracking-tight">Resource Hub</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Student Edition</div>
          </div>
        </div>

        <div className="glass gradient-border rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="text-center text-xs text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
