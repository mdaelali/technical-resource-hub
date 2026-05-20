import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import
{
  Play,
  Copy,
  Check,
  Terminal,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Cpu,
  Clock
} from 'lucide-react';
import CodeEditor from './CodeEditor.jsx';
// Reverted from Piston back to Judge0 — Piston's public emkc.org endpoint went
// whitelist-only on 2026-02-15 and returns HTTP 401. Judge0 CE public endpoint
// at ce.judge0.com still works for our purposes. See src/api/piston.js if we
// ever self-host a Piston instance and want to switch back.
import { LANGUAGES, runCode, CompilerError, MAX_SOURCE_LENGTH } from '../api/judge0.js';
import useUserStorage from '../hooks/useUserStorage.js';
import { clampCodeLength } from '../utils/security.js';

export default function CodeCompiler({ onLogActivity })
{
  const [languageKey, setLanguageKey] = useUserStorage('compiler.lang', 'java');
  const [sources, setSources] = useUserStorage('compiler.sources', {});
  const [stdin, setStdin] = useUserStorage('compiler.stdin', '');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const language = LANGUAGES.find((l) => l.key === languageKey) || LANGUAGES[0];
  const code = (sources && sources[language.key]) ?? language.starter;

  function setCode(next)
  {
    const clamped = clampCodeLength(next);
    setSources({ ...(sources || {}), [language.key]: clamped });
  }

  function changeLanguage(key)
  {
    setLanguageKey(key);
    setResult(null);
    setError(null);
  }

  function resetStarter()
  {
    setSources({ ...(sources || {}), [language.key]: language.starter });
    setResult(null);
    setError(null);
  }

  function handleCopy()
  {
    navigator.clipboard
      .writeText(code)
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

  async function handleRun()
  {
    onLogActivity?.();
    setRunning(true);
    setResult(null);
    setError(null);
    try
    {
      const data = await runCode({
        languageId: language.id,
        source: clampCodeLength(code),
        stdin: typeof stdin === 'string' ? stdin : ''
      });
      setResult({ ...data, finishedAt: new Date() });
    }
    catch (err)
    {
      if (err instanceof CompilerError)
      {
        setError({ code: err.code, message: err.message });
      }
      else
      {
        setError({ code: 'UNKNOWN', message: err.message || 'Unexpected error.' });
      }
    }
    finally
    {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 min-h-full lg:h-full">
      <div className="glass rounded-2xl flex flex-wrap items-center justify-between px-3 py-2 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 hidden sm:block">Language</div>
          <div className="flex items-center gap-1 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => changeLanguage(l.key)}
                className={`text-xs px-2.5 py-1 rounded-lg transition ${
                  l.key === language.key
                    ? 'bg-gradient-to-r from-violet-500/40 to-cyan-400/30 text-white border border-white/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={resetStarter}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-white/[0.06] transition"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
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
            className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-400 hover:opacity-90 disabled:opacity-60 transition"
          >
            {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            <span>{running ? 'Running' : 'Run'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-3 flex-1 min-h-0">
        <div className="glass rounded-2xl overflow-hidden flex flex-col lg:col-span-2 min-h-[20rem] lg:min-h-0">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <div className="ml-3 flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <span>Main.{language.extension}</span>
              </div>
            </div>
            <span className={`text-[10px] ${code.length >= MAX_SOURCE_LENGTH ? 'text-rose-300' : 'text-slate-500'}`}>
              {code.length} / {MAX_SOURCE_LENGTH} chars
            </span>
          </div>
          <CodeEditor value={code} onChange={setCode} language={language.key} />
        </div>

        <div className="flex flex-col gap-3 min-h-0">
          <div className="glass rounded-2xl overflow-hidden flex flex-col min-h-[14rem] lg:min-h-0 flex-1">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Terminal size={12} className="text-emerald-300" />
                <span>Output</span>
              </div>
              {result && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  {result.time && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {result.time}s
                    </span>
                  )}
                  {result.memory && (
                    <span className="flex items-center gap-1">
                      <Cpu size={10} />
                      {result.memory} KB
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-3 font-mono text-[11.5px] leading-[1.55]">
              <AnimatePresence mode="wait">
                {running && (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-slate-400"
                  >
                    <Loader2 size={12} className="animate-spin" />
                    <span>Compiling and running...</span>
                  </motion.div>
                )}
                {!running && error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-rose-300 flex items-start gap-2"
                  >
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold">Could not run code</div>
                      <div className="text-rose-200/80 mt-1 whitespace-pre-wrap">{error.message}</div>
                      <div className="text-rose-300/50 mt-1 text-[10px]">code: {error.code}</div>
                    </div>
                  </motion.div>
                )}
                {!running && !error && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <StatusPill statusId={result.statusId} description={result.statusDescription} />
                    {result.compileOutput && (
                      <OutputBlock label="Compile output" body={result.compileOutput} tone="error" />
                    )}
                    {result.stderr && (
                      <OutputBlock label="stderr" body={result.stderr} tone="warning" />
                    )}
                    {result.stdout && (
                      <OutputBlock label="stdout" body={result.stdout} tone="success" />
                    )}
                    {!result.stdout && !result.stderr && !result.compileOutput && (
                      <div className="text-slate-500">(no output)</div>
                    )}
                  </motion.div>
                )}
                {!running && !error && !result && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-slate-500"
                  >
                    Press <span className="text-violet-300">Run</span> to compile and execute. Output, stderr, and compile errors appear here.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 border-b border-white/10 bg-black/20 text-xs text-slate-300">
              stdin <span className="text-slate-500 text-[10px]">(optional)</span>
            </div>
            <textarea
              value={stdin || ''}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide input lines for your program..."
              spellCheck={false}
              maxLength={4000}
              className="bg-[#0a0c14] font-mono text-[11.5px] leading-[1.55] text-slate-200 px-3 py-2 h-20 resize-none focus:outline-none placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ statusId, description })
{
  const success = statusId === 3;
  const tone = success
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
    : statusId >= 4
      ? 'bg-rose-500/15 text-rose-300 border-rose-400/30'
      : 'bg-amber-500/15 text-amber-300 border-amber-400/30';
  return (
    <div className={`pill border ${tone} self-start`}>{description}</div>
  );
}

function OutputBlock({ label, body, tone })
{
  const toneClass = tone === 'error'
    ? 'text-rose-200'
    : tone === 'warning'
      ? 'text-amber-200'
      : 'text-emerald-200';
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <pre className={`whitespace-pre-wrap break-words ${toneClass}`}>{body}</pre>
    </div>
  );
}
