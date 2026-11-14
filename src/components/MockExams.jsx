import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import
{
  ClipboardList, CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight,
  Trophy, Code2, ListChecks, RotateCcw, Bookmark, BookmarkCheck,
  Highlighter, Book, X, ChevronDown, ChevronUp
} from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { exams } from '../data/examLibrary.js';
import { referenceSheet } from '../data/referenceSheet.js';
import CodeEditor from './CodeEditor.jsx';
import { localDateKey } from '../utils/dates.js';
import { completeLearningPlanStep } from '../utils/learningPlan.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const DIFF_STYLE = {
  easy:   { label: 'Easy',   cls: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
  medium: { label: 'Medium', cls: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
  hard:   { label: 'Hard',   cls: 'bg-rose-500/20 text-rose-200 border-rose-400/30' }
};

const HIGHLIGHT_COLORS = [
  { id: 'yellow', cls: 'bg-yellow-300/70 text-black', label: 'Yellow' },
  { id: 'cyan',   cls: 'bg-cyan-300/70 text-black',   label: 'Cyan'   },
  { id: 'pink',   cls: 'bg-pink-300/70 text-black',   label: 'Pink'   },
];

const EXAM_FILTERS = [
  ['all', 'All formats'],
  ['full', 'Full exams'],
  ['mcq', 'MCQ practice'],
  ['frq', 'FRQ practice'],
  ['mixed', 'Mixed practice']
];

const DIFFICULTY_FILTERS = [
  ['all', 'All levels'],
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard']
];

/* ─────────────────────── Root component ─────────────────────────────────── */
export default function MockExams({ onLogActivity })
{
  const [results, setResults] = useUserStorage('exam.results', {});
  const [, setLearningPlan] = useUserStorage('learningPlan', { date: localDateKey(), completed: [] });
  const [activeId, setActiveId] = useState(null);

  useEffect(() =>
  {
    function syncActiveExamFromHistory(event)
    {
      setActiveId(event.state?.mockExamId || null);
    }
    window.addEventListener('popstate', syncActiveExamFromHistory);
    return () => window.removeEventListener('popstate', syncActiveExamFromHistory);
  }, []);

  const allAvailableExams = exams;
  const activeExam = activeId ? allAvailableExams.find((e) => e.id === activeId) : null;

  function startExam(examId)
  {
    window.history.pushState({ ...(window.history.state || {}), mockExamId: examId }, '', window.location.href);
    setActiveId(examId);
  }

  function exitExam()
  {
    if (window.history.state?.mockExamId)
    {
      window.history.back();
    }
    else
    {
      setActiveId(null);
    }
  }

  function handleComplete(examId, correct, totalMcq)
  {
    setResults((prev) =>
    {
      const prevRec = (prev || {})[examId] || {};
      const best = totalMcq > 0 ? Math.max(prevRec.best ?? 0, correct) : 0;
      return {
        ...(prev || {}),
        [examId]: { best, totalMcq, completed: true, takenAt: localDateKey() }
      };
    });
    completeLearningPlanStep(setLearningPlan, 'quiz');
    onLogActivity?.();
  }

  if (activeExam)
  {
    return (
      <BluebookRunner
        exam={activeExam}
        onExit={exitExam}
        onComplete={handleComplete}
      />
    );
  }
  return (
    <ExamList
      results={results || {}}
      onStart={startExam}
      allExams={allAvailableExams}
    />
  );
}

/* ─────────────────────── Exam list ─────────────────────────────────────── */
function ExamList({ results, onStart, allExams })
{
  const [formatFilter, setFormatFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const visibleExams = useMemo(
    () => allExams.filter((exam) =>
      (formatFilter === 'all' || exam.format === formatFilter) &&
      (difficultyFilter === 'all' || exam.difficulty === difficultyFilter)),
    [allExams, formatFilter, difficultyFilter]
  );

  function countTypes(exam)
  {
    return {
      mcq: exam.questions.filter((q) => q.type === 'mcq').length,
      frq: exam.questions.filter((q) => q.type === 'frq').length
    };
  }

  return (
    <div className="learning-page dashboard-page">
      <div className="learning-page-header px-5 py-4">
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ClipboardList size={18} className="text-emerald-200" />
            <div className="min-w-0">
              <h2 className="page-header-title text-lg font-semibold tracking-tight">Mock Exams</h2>
              <p className="page-header-description text-xs">
                {allExams.length} original AP-style exams · Easy, Medium, and Hard
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="exam-format-note text-xs leading-relaxed">
        Full simulations follow the current AP CSA timing and structure: 42 MCQs in 90 minutes, then 4 FRQs in 90 minutes. These are original practice materials, not official College Board questions.
      </p>

      <nav className="flex flex-wrap gap-2" aria-label="Filter mock exams by format">
        {EXAM_FILTERS.map(([id, label]) =>
        {
          const count = id === 'all' ? allExams.length : allExams.filter((exam) => exam.format === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={formatFilter === id}
              onClick={() => setFormatFilter(id)}
              className={`exam-filter ${formatFilter === id ? 'exam-filter-active' : ''}`}
            >
              {label}<span>{count}</span>
            </button>
          );
        })}
      </nav>

      <nav className="flex flex-wrap gap-2" aria-label="Filter mock exams by difficulty">
        {DIFFICULTY_FILTERS.map(([id, label]) =>
        {
          const count = id === 'all' ? allExams.length : allExams.filter((exam) => exam.difficulty === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={difficultyFilter === id}
              onClick={() => setDifficultyFilter(id)}
              className={`exam-filter ${difficultyFilter === id ? 'exam-filter-active' : ''}`}
            >
              {label}<span>{count}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {visibleExams.map((exam) =>
        {
          const { mcq, frq } = countTypes(exam);
          const rec = results[exam.id];
          const diff = DIFF_STYLE[exam.difficulty] || DIFF_STYLE.medium;
          return (
            <div
              key={exam.id}
              className="exam-card glass dashboard-panel card-hover rounded-2xl px-5 py-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white tracking-tight">{exam.title}</h3>
                    <span className="pill bg-white/10 text-slate-200">{exam.tag}</span>
                    {exam.difficulty && (
                      <span className={`pill border ${diff.cls}`}>{diff.label}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{exam.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
                <span className="flex items-center gap-1"><Clock size={12} className="text-cyan-300" />~{exam.minutes} min</span>
                {mcq > 0 && <span className="flex items-center gap-1"><ListChecks size={12} className="text-violet-300" />{mcq} MCQ</span>}
                {frq > 0 && <span className="flex items-center gap-1"><Code2 size={12} className="text-amber-300" />{frq} FRQ</span>}
              </div>

              <div className="flex items-center justify-between pt-1 mt-auto flex-wrap gap-2">
                {rec?.completed && rec.totalMcq > 0 ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300"><Trophy size={12} />Best: {rec.best}/{rec.totalMcq}</span>
                ) : rec?.completed ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300"><CheckCircle2 size={12} />Completed</span>
                ) : (
                  <span className="text-[11px] text-slate-500">Not attempted</span>
                )}
                <button type="button" onClick={() => onStart(exam.id)} className="btn-primary">
                  {rec?.completed ? <RotateCcw size={12} /> : <ClipboardList size={12} />}
                  <span>{rec?.completed ? 'Retake' : 'Start exam'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── Bluebook exam runner ───────────────────────────── */
function useTimer(minutes, running, onExpire)
{
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [timerHidden, setTimerHidden] = useState(false);
  const remaining = useRef(minutes * 60);
  const expireRef = useRef(onExpire);

  useEffect(() =>
  {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() =>
  {
    if (!running)
    {
      return undefined;
    }
    const id = window.setInterval(() =>
    {
      remaining.current = Math.max(0, remaining.current - 1);
      setSecondsLeft(remaining.current);
      if (remaining.current === 0)
      {
        window.clearInterval(id);
        expireRef.current?.();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const pct = (secondsLeft / (minutes * 60)) * 100;
  return { display, timerHidden, setTimerHidden, pct };
}

function BluebookRunner({ exam, onExit, onComplete })
{
  const questions = exam.questions;
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions]);

  const [answers, setAnswers] = useState({});
  const [frqCode, setFrqCode] = useState({});
  const [frqSelfChecks, setFrqSelfChecks] = useState({});
  const [current, setCurrent] = useState(0);
  const [markedForReview, setMarkedForReview] = useState({});
  const [eliminated, setEliminated] = useState({});
  const [highlights, setHighlights] = useState({});
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [highlightMode, setHighlightMode] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const rightPanelRef = useRef(null);
  const explanationRef = useRef(null);
  const totalQ = questions.length;

  useEffect(() =>
  {
    function handleQuestionArrow(event)
    {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (
        target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]')
      );
      if (isEditing) return;
      if (event.key === 'ArrowLeft')
      {
        event.preventDefault();
        setCurrent((index) => Math.max(0, index - 1));
      }
      else if (event.key === 'ArrowRight')
      {
        event.preventDefault();
        setCurrent((index) => Math.min(totalQ - 1, index + 1));
      }
    }

    window.addEventListener('keydown', handleQuestionArrow);
    return () => window.removeEventListener('keydown', handleQuestionArrow);
  }, [totalQ]);

  const { display: timerDisplay, timerHidden, setTimerHidden, pct: timerPct } = useTimer(exam.minutes, !submitted, handleSubmit);

  const q = questions[current];
  function setAnswer(qid, val)
  {
    if (!submitted) setAnswers((p) => ({ ...p, [qid]: val }));
  }

  function toggleMark(qid)
  {
    setMarkedForReview((p) => ({ ...p, [qid]: !p[qid] }));
  }

  function toggleEliminate(qid, idx)
  {
    setEliminated((p) =>
    {
      const key = `${qid}-${idx}`;
      return { ...p, [key]: !p[key] };
    });
  }

  function handleMouseUp()
  {
    if (!highlightMode)
    {
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim())
    {
      return;
    }
    const text = sel.toString();
    const color = highlightColor;
    setHighlights((p) =>
    {
      const qHighlights = p[q.id] || [];
      return {
        ...p,
        [q.id]: [...qHighlights, { text, color, id: Date.now() }]
      };
    });
    sel.removeAllRanges();
  }

  function removeHighlight(qid, hid)
  {
    setHighlights((p) => ({
      ...p,
      [qid]: (p[qid] || []).filter((h) => h.id !== hid)
    }));
  }

  function handleSubmit()
  {
    if (submittedRef.current)
    {
      return;
    }
    submittedRef.current = true;
    const correct = mcqs.filter((mq) => answers[mq.id] === mq.answer).length;
    setSubmitted(true);
    onComplete(exam.id, correct, mcqs.length);
  }

  function requestExit()
  {
    const hasWork = Object.keys(answers).length > 0 || Object.values(frqCode).some((code) => code.trim());
    if (!submitted && hasWork && !window.confirm('Exit this exam? Your answers in progress will be lost.')) return;
    onExit();
  }

  const correctCount = submitted ? mcqs.filter((mq) => answers[mq.id] === mq.answer).length : null;
  const pct = submitted && mcqs.length > 0 ? Math.round((correctCount / mcqs.length) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-base)] overflow-hidden" onMouseUp={handleMouseUp}>
      {/* ── Top bar ─────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-white/10 glass shrink-0 relative">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={requestExit} className="btn-ghost text-[11px] shrink-0">
            <XCircle size={13} /><span className="hidden sm:inline">Exit exam</span>
          </button>
          <div className="text-xs font-semibold text-white hidden sm:block truncate">{exam.title}</div>
        </div>

        <div className="flex items-center gap-2">
          {!timerHidden && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <Clock size={13} className={timerPct < 20 ? 'text-rose-300' : 'text-cyan-300'} />
              <span className={timerPct < 20 ? 'text-rose-300' : ''}>{timerDisplay}</span>
            </div>
          )}
          <button
            onClick={() => setTimerHidden((h) => !h)}
            className="btn-ghost text-[10px]"
          >
            {timerHidden ? 'Show' : 'Hide'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setHighlightMode((h) => !h)}
            title="Highlight mode"
            className={`w-7 h-7 grid place-items-center rounded-lg border transition text-[11px] ${highlightMode ? 'bg-yellow-400/30 border-yellow-400/50 text-yellow-200' : 'border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06]'}`}
          >
            <Highlighter size={13} />
          </button>
          {highlightMode && (
            <div className="flex items-center gap-1">
              {HIGHLIGHT_COLORS.map((hc) => (
                <button
                  key={hc.id}
                  onClick={() => setHighlightColor(hc.id)}
                  className={`w-5 h-5 rounded border-2 transition ${hc.cls} ${highlightColor === hc.id ? 'scale-125 border-white' : 'border-transparent'}`}
                  title={hc.label}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setShowRef(true)}
            className="btn-ghost text-[11px]"
          >
            <Book size={13} /><span className="hidden sm:inline">Reference</span>
          </button>
          {!submitted ? (
            <button type="button" onClick={handleSubmit} className="btn-primary text-[11px]">
              <CheckCircle2 size={13} /><span>Submit</span>
            </button>
          ) : (
            <button type="button" onClick={requestExit} className="btn-ghost text-[11px]">
              <ArrowLeft size={13} /><span>All exams</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Score banner after submit ─────────────── */}
      {submitted && (
        <div className={`shrink-0 px-4 py-2 text-xs font-medium flex flex-wrap items-center gap-3 ${pct === null ? 'bg-slate-500/15 text-slate-200' : pct >= 70 ? 'bg-emerald-500/20 text-emerald-200' : pct >= 50 ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-rose-200'}`}>
          <Trophy size={13} />
          {pct === null ? 'FRQ practice submitted' : `Score: ${correctCount}/${mcqs.length} MCQ correct (${pct}%)`}
          <span className="text-slate-300">Use Previous/Next to review every MCQ answer and explanation. FRQs are self-reviewed with rubrics and model answers, not included in the MCQ score.</span>
        </div>
      )}

      {/* ── Body: left (stem) + right (choices) ─── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 relative">
        {/* ── Left panel — always shows the question stem ───────────────────
            For MCQ: prompt (+ code block if any)
            For FRQ: prompt + code block                                     */}
        <div className="sm:w-1/2 flex-1 overflow-auto p-5 border-r border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-4">
            Question {current + 1} of {totalQ}
          </div>

          {/* Question prompt lives here for ALL question types */}
          <p className="text-sm text-white leading-relaxed mb-4 select-text">{q.prompt}</p>

          {/* Code block (MCQ "Consider the following code segment" style) */}
          {q.code && (
            <pre className="text-xs font-mono leading-relaxed rounded-xl border border-white/10 p-4 overflow-auto" style={{ background: 'var(--code-bg)' }}>
              {q.code}
            </pre>
          )}

          {/* Highlights panel */}
          {(highlights[q.id] || []).length > 0 && (
            <div className="mt-4 flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Your highlights</div>
              {(highlights[q.id] || []).map((h) =>
              {
                const hc = HIGHLIGHT_COLORS.find((c) => c.id === h.color) || HIGHLIGHT_COLORS[0];
                return (
                  <div key={h.id} className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${hc.cls}`}>
                    <span className="flex-1 truncate">{h.text}</span>
                    <button onClick={() => removeHighlight(q.id, h.id)} className="shrink-0 opacity-60 hover:opacity-100">
                      <X size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right panel — answer choices (MCQ) or code editor (FRQ) ───── */}
        <div ref={rightPanelRef} className="sm:w-1/2 overflow-auto p-5 flex flex-col gap-4">
          {/* Question header row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-violet-400/60 grid place-items-center text-xs font-semibold text-violet-300">
                {current + 1}
              </span>
              <button
                onClick={() => toggleMark(q.id)}
                className={`flex items-center gap-1 text-[11px] transition ${markedForReview[q.id] ? 'text-amber-300' : 'text-slate-400 hover:text-white'}`}
              >
                {markedForReview[q.id] ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                <span>Mark for review</span>
              </button>
            </div>
            <span className="pill bg-white/10 text-slate-200 text-[10px]">
              {q.type === 'mcq' ? 'Multiple choice' : 'Free response'}
            </span>
          </div>

          {submitted && q.type === 'mcq' && (
            <p className="text-[11px] text-slate-400 -mt-2">
              {answers[q.id] === q.answer
                ? '✓ Correct — review the explanation below or move on to the next question.'
                : answers[q.id] === undefined
                  ? 'Not answered — the correct answer and explanation are shown below.'
                  : '✗ Incorrect — your choice, the correct answer, and the explanation are shown below.'}
            </p>
          )}

          {/* MCQ choices */}
          {q.type === 'mcq' && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) =>
              {
                const chosen = answers[q.id] === i;
                const isCorrect = submitted && i === q.answer;
                const isWrong = submitted && chosen && i !== q.answer;
                const elim = eliminated[`${q.id}-${i}`];
                // In review mode: clicking a choice opens explanation + scrolls to it
                function handleChoiceClick()
                {
                  if (!submitted)
                  {
                    setAnswer(q.id, i);
                  }
                  else if (submitted && answers[q.id] !== q.answer)
                  {
                    // Give React one frame to render the explanation, then scroll to it
                    requestAnimationFrame(() =>
                    {
                      setTimeout(() =>
                      {
                        explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    });
                  }
                }
                return (
                  <div key={i} className="flex items-center gap-2 group">
                    <button
                      onClick={handleChoiceClick}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition text-sm
                        ${isCorrect ? 'bg-emerald-500/20 border-emerald-400/50 text-white' :
                          isWrong ? 'bg-rose-500/20 border-rose-400/50 text-white cursor-pointer hover:border-rose-400/80' :
                          chosen && submitted ? 'bg-violet-500/15 border-violet-400/40 text-white' :
                          chosen ? 'bg-violet-500/25 border-violet-400/60 text-white' :
                          submitted ? 'border-white/10 text-slate-300' :
                          'border-white/10 text-slate-200 hover:border-violet-400/40 hover:bg-white/[0.03]'}
                        ${elim && !submitted ? 'opacity-40' : ''}`}
                    >
                      <span className={`w-7 h-7 shrink-0 rounded-full border grid place-items-center text-xs font-semibold
                        ${isCorrect ? 'border-emerald-400 text-emerald-300' :
                          isWrong ? 'border-rose-400 text-rose-300' :
                          chosen ? 'border-violet-400 text-violet-200 bg-violet-500/30' :
                          'border-white/20 text-slate-400'}`}>
                        {LETTERS[i]}
                      </span>
                      <span className={elim && !submitted ? 'line-through' : ''}>{opt}</span>
                      {isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-300 shrink-0" />}
                      {isWrong && <XCircle size={14} className="ml-auto text-rose-300 shrink-0" />}
                    </button>
                    {/* Elimination button */}
                    {!submitted && (
                      <button
                        onClick={() => toggleEliminate(q.id, i)}
                        title="Eliminate this choice"
                        className={`w-7 h-7 grid place-items-center rounded-full border transition text-[11px] shrink-0
                          ${elim ? 'border-rose-400/60 text-rose-300 bg-rose-500/15' : 'border-white/10 text-slate-500 hover:text-rose-300 hover:border-rose-400/40 opacity-0 group-hover:opacity-100'}`}
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* FRQ editor */}
          {q.type === 'frq' && (
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              <div className="glass rounded-xl overflow-hidden flex flex-col min-h-[16rem]">
                <div className="px-3 py-1.5 border-b border-white/10 bg-black/20 text-[10px] text-slate-400 font-mono">
                  {q.starter?.match(/^public class (\w+)/)?.[1] ?? 'Solution'}.java
                </div>
                <CodeEditor
                  value={frqCode[q.id] ?? q.starter ?? ''}
                  onChange={(v) => setFrqCode((p) => ({ ...p, [q.id]: v }))}
                  language="java"
                />
              </div>
              {submitted && (
                <fieldset className="frq-self-check glass rounded-xl p-3 flex flex-col gap-2">
                  <legend className="px-1 text-xs font-semibold">FRQ self-check</legend>
                  <p className="text-[11px] text-slate-400">Compare your code with the model answer and check each criterion you met. This is a self-assessment, not an automatic score.</p>
                  {(q.rubric || ['Correct method or class signature.', 'Correct algorithm and control flow.', 'Correct result and specified edge cases.']).map((item, index) =>
                  {
                    const criterion = typeof item === 'string' ? item : item.criterion;
                    return (
                      <label key={criterion} className="flex items-start gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={Boolean(frqSelfChecks[q.id]?.[index])}
                          onChange={(event) => setFrqSelfChecks((currentChecks) => ({
                            ...currentChecks,
                            [q.id]: { ...(currentChecks[q.id] || {}), [index]: event.target.checked }
                          }))}
                        />
                        <span>{criterion}{typeof item === 'object' ? ` (${item.points} pts)` : ''}</span>
                      </label>
                    );
                  })}
                </fieldset>
              )}
              {submitted && q.modelAnswer && (
                <details className="glass rounded-xl">
                  <summary className="cursor-pointer px-3 py-2 text-xs text-amber-300 font-medium list-none flex items-center gap-1">
                    <ChevronDown size={13} />View model answer
                  </summary>
                  <pre className="px-3 pb-3 text-xs font-mono text-emerald-200 whitespace-pre-wrap overflow-auto">
                    {q.modelAnswer}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Explanation after submit — ref used for auto-scroll when answer clicked */}
          {submitted && q.type === 'mcq' && (
            <div ref={explanationRef}>
              <ExplanationCard
                question={q}
                userAnswer={answers[q.id]}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom navigation bar ─────────────────── */}
      <footer className="glass border-t border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          aria-label="Previous question"
          title="Previous question (←)"
          className="exam-question-nav-control btn-ghost min-h-11 min-w-28 justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={19} strokeWidth={2.5} /><span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNav((v) => !v)}
          aria-label="Open question navigator"
          className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.07] hover:text-white transition"
        >
          <span className="font-medium">Question {current + 1} of {totalQ}</span>
          {showNav ? <ChevronDown size={17} strokeWidth={2.5} /> : <ChevronUp size={17} strokeWidth={2.5} />}
        </button>

        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))}
          disabled={current === totalQ - 1}
          aria-label="Next question"
          title="Next question (→)"
          className="exam-question-nav-control btn-primary min-h-11 min-w-28 justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Next</span><ArrowRight size={19} strokeWidth={2.5} />
        </button>
      </footer>

      {/* ── Question navigator popup ──────────────── */}
      {showNav && createPortal(
        <div
          onClick={() => setShowNav(false)}
          className="fixed inset-0 z-[70] flex items-end justify-center pb-16"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl p-4 max-w-md w-full mx-4 flex flex-col gap-3"
          >
            <div className="text-xs text-slate-400 uppercase tracking-wider">Question navigator</div>
            <div className="flex flex-wrap gap-2">
              {questions.map((qn, i) =>
              {
                const ans = answers[qn.id];
                const done = ans !== undefined || frqCode[qn.id];
                const marked = markedForReview[qn.id];
                const isWrong = submitted && qn.type === 'mcq' && ans !== undefined && ans !== qn.answer;
                const isUnanswered = submitted && qn.type === 'mcq' && ans === undefined;
                return (
                  <button
                    key={qn.id}
                    onClick={() => { setCurrent(i); setShowNav(false); }}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold grid place-items-center border transition
                      ${i === current ? 'border-violet-400 bg-violet-500/30 text-white' :
                        isWrong ? 'border-rose-400/60 bg-rose-500/20 text-rose-200' :
                        isUnanswered ? 'border-amber-400/30 bg-amber-500/10 text-amber-100' :
                        done ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200' :
                        marked ? 'border-amber-400/40 bg-amber-500/15 text-amber-200' :
                        'border-white/10 text-slate-400 hover:border-white/30'}`}
                  >
                    {marked && !done ? '★' : i + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 border-t border-white/10 pt-2">
              <span><span className="inline-block w-3 h-3 rounded bg-emerald-500/40 mr-1" />Answered</span>
              <span><span className="inline-block w-3 h-3 rounded bg-amber-500/40 mr-1" />Marked</span>
              <span><span className="inline-block w-3 h-3 rounded bg-rose-500/40 mr-1" />Wrong</span>
              <span><span className="inline-block w-3 h-3 rounded bg-amber-500/30 mr-1" />Unanswered</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Reference sheet modal ─────────────────── */}
      {showRef && createPortal(
        <div
          onClick={() => setShowRef(false)}
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Book size={15} className="text-violet-300" />
                <span className="text-sm font-semibold text-white">AP CS A — Java Quick Reference</span>
              </div>
              <button onClick={() => setShowRef(false)} className="text-slate-400 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-5 overflow-auto">
              {referenceSheet.map((section) => (
                <div key={section.section}>
                  <div className="text-[11px] uppercase tracking-widest text-violet-300 mb-2">{section.section}</div>
                  <div className="flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <div key={item.sig} className="glass rounded-lg px-3 py-2">
                        <code className="text-[11px] font-mono text-cyan-200">{item.sig}</code>
                        <p className="text-[11px] text-slate-300 mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ─────────────────────── Explanation + AI chat ──────────────────────────── */
function ExplanationCard({ question, userAnswer })
{
  const hasAnswer = Number.isInteger(userAnswer);
  const isCorrect = hasAnswer && userAnswer === question.answer;

  const explanationBg = isCorrect
    ? 'border-emerald-500/40 bg-emerald-500/10'
    : hasAnswer
      ? 'border-rose-500/35 bg-rose-500/[0.06]'
      : 'border-amber-400/30 bg-amber-400/[0.05]';

  return (
    <div className={`rounded-xl border text-xs overflow-hidden ${explanationBg}`}>
      {/* Every question includes its explanation without a network call. */}
      <div className="px-3 py-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {isCorrect
            ? <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
            : hasAnswer
              ? <XCircle size={15} className="text-rose-400 mt-0.5 shrink-0" />
              : <Clock size={15} className="text-amber-300 mt-0.5 shrink-0" />}
          <div className="min-w-0">
            <div className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-300' : hasAnswer ? 'text-rose-300' : 'text-amber-200'}`}>
              {isCorrect ? 'Correct' : hasAnswer ? 'Incorrect' : 'Not answered'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your answer: {hasAnswer ? `${LETTERS[userAnswer]}) ${question.options[userAnswer]}` : 'Not answered'}
            </p>
            <p className="mt-1 text-slate-300 leading-relaxed">
              Correct answer: {LETTERS[question.answer]}) {question.options[question.answer]}
            </p>
            <p className="mt-2 text-slate-200 leading-relaxed">
              <span className="font-semibold text-white">Explanation: </span>
              {question.explanation || 'No explanation is available for this question yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
