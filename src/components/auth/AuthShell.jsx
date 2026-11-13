import { GraduationCap } from 'lucide-react';
import './auth.css';

export default function AuthShell({ title, subtitle, children, footer })
{
  return (
    <main className="auth-shell min-h-[100dvh] w-screen flex items-center justify-center p-4 sm:p-6">
      <div className="auth-shell-inner w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center gap-2 justify-center">
          <div className="auth-brand-mark w-10 h-10 rounded-xl grid place-items-center">
            <GraduationCap size={20} />
          </div>
          <div className="leading-tight">
            <div className="auth-brand-name text-sm font-semibold tracking-tight">Resource Hub</div>
            <div className="auth-brand-subtitle text-[10px] uppercase tracking-widest">Computer science, hands on</div>
          </div>
        </div>

        <section className="auth-card rounded-2xl p-5 sm:p-7 flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm mt-1">{subtitle}</p>}
          </div>
          {children}
        </section>

        {footer && <div className="auth-footer text-center text-xs">{footer}</div>}
      </div>
    </main>
  );
}
