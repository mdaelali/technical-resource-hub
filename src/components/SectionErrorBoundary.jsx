import { Component } from 'react';
import { AlertTriangle, RotateCcw, House } from 'lucide-react';

/*
 * Catches render errors inside one app section so a bug in, say, Code Sprint
 * shows a recoverable message instead of blanking the whole app. The parent
 * passes `key={section}` so navigating to another section resets the boundary.
 */
export default class SectionErrorBoundary extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error)
  {
    return { error };
  }

  componentDidCatch(error, info)
  {
    console.error('Section crashed:', error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render()
  {
    const { error } = this.state;
    if (!error)
    {
      return this.props.children;
    }
    return (
      <div role="alert" className="glass rounded-2xl p-6 sm:p-8 max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
            <AlertTriangle size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold">This section hit a problem</h2>
            <p className="text-xs text-slate-400">Your progress is saved. You can retry or go back to the dashboard.</p>
          </div>
        </div>
        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap break-words rounded-lg p-3 bg-black/20 border border-white/10 text-slate-300 max-h-32 overflow-auto">
          {String(error?.message || error)}
        </pre>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={this.reset} className="btn-primary inline-flex items-center gap-2">
            <RotateCcw size={14} /> Try again
          </button>
          {this.props.onHome && (
            <button type="button" onClick={this.props.onHome} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5">
              <House size={14} /> Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }
}
