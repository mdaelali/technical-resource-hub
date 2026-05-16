import { Check, Circle } from 'lucide-react';
import { passwordStrength } from '../../utils/security.js';

const TONE = [
  'bg-rose-500',
  'bg-rose-400',
  'bg-amber-400',
  'bg-amber-300',
  'bg-emerald-400',
  'bg-emerald-300'
];

export default function PasswordStrength({ password })
{
  const { score, label, requirements } = passwordStrength(password);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i < score ? TONE[score] : 'bg-white/[0.06]'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Strength</span>
        <span className="text-slate-200 font-medium">{label}</span>
      </div>
      <ul className="grid grid-cols-1 gap-0.5 mt-1">
        {requirements.map((r) => (
          <li key={r.id} className="flex items-center gap-1.5 text-[11px]">
            {r.pass ? (
              <Check size={11} className="text-emerald-300 shrink-0" />
            ) : (
              <Circle size={11} className="text-slate-600 shrink-0" />
            )}
            <span className={r.pass ? 'text-slate-300' : 'text-slate-500'}>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
