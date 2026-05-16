import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileCode2, Play, Copy, Check, Terminal, X } from 'lucide-react';
import { snippets } from '../data/snippets.js';
import { tokenize, classFor } from '../utils/highlightCode.js';

export default function CodePlayground({ initialSnippetId })
{
  const [activeId, setActiveId] = useState(() =>
  {
    if (initialSnippetId && snippets.some((s) => s.id === initialSnippetId))
    {
      return initialSnippetId;
    }
    return snippets[0].id;
  });
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  useEffect(() =>
  {
    if (initialSnippetId && snippets.some((s) => s.id === initialSnippetId))
    {
      setActiveId(initialSnippetId);
      setRunOutput(null);
    }
  }, [initialSnippetId]);

  const active = snippets.find((s) => s.id === activeId);
  const tokens = useMemo(() => tokenize(active.code), [active.code]);
  const lineCount = active.code.split('\n').length;

  function handleCopy()
  {
    navigator.clipboard
      .writeText(active.code)
      .then(() =>
      {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() =>
      {
        setCopied(false);
      });
  }

  function handleRun()
  {
    setRunning(true);
    setRunOutput(null);
    window.setTimeout(() =>
    {
      setRunOutput({
        text: active.output ?? '(no output)',
        when: new Date()
      });
      setRunning(false);
    }, 450);
  }

  function handleSelect(id)
  {
    setActiveId(id);
    setRunOutput(null);
  }

  return (
    <div className="flex flex-col gap-3 min-h-full lg:h-full">
      <div className="glass rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[20rem] lg:min-h-0">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/20 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 shrink-0 hidden sm:block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0 hidden sm:block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shrink-0 hidden sm:block" />
            <div className="sm:ml-3 flex items-center gap-1.5 text-xs text-slate-300 min-w-0">
              <FileCode2 size={12} className="shrink-0" />
              <span className="font-mono truncate">{active.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-white/[0.06] transition"
            >
              {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1 text-[11px] text-white px-2.5 py-1 rounded bg-gradient-to-r from-violet-500 to-cyan-400 hover:opacity-90 disabled:opacity-60 transition"
            >
              <Play size={12} />
              <span>{running ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto bg-[#0a0c14]">
          <div className="flex font-mono text-xs leading-[1.55]">
            <div className="select-none px-3 py-3 text-right text-slate-600 border-r border-white/5">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="px-3 py-3 flex-1 whitespace-pre">
              <code>
                {tokens.map((tok, i) =>
                {
                  if (tok.kind === 'ws')
                  {
                    return tok.text;
                  }
                  return (
                    <span key={i} className={classFor(tok.kind)}>
                      {tok.text}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {(running || runOutput) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-t border-white/10 bg-black/40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-1 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Terminal size={11} className="text-emerald-300" />
                  <span>Output</span>
                  {runOutput && (
                    <span className="text-slate-500">
                      · {runOutput.when.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setRunOutput(null)}
                  className="text-slate-500 hover:text-white p-0.5 rounded transition"
                  aria-label="Close output"
                >
                  <X size={11} />
                </button>
              </div>
              <pre className="px-3 py-2 font-mono text-[11.5px] text-emerald-200 whitespace-pre-wrap max-h-40 overflow-auto">
                {running ? 'Compiling and executing...' : runOutput?.text}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-3 py-1.5 border-t border-white/10 bg-black/20 flex items-center justify-between text-[10px] text-slate-500 gap-2">
          <span className="truncate">Java 21 · Allman braces</span>
          <span className="truncate hidden sm:inline">Read-only · Run shows expected output</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {snippets.map((s) =>
        {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`glass card-hover rounded-xl px-3 py-2 text-left transition ${
                isActive ? 'border-cyan-400/40' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-200">
                <FileCode2 size={11} />
                <span className="truncate">{s.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{s.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
