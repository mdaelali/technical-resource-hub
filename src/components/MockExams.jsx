import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import
{
  ClipboardList, CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight,
  Trophy, Code2, ListChecks, RotateCcw, Bookmark, BookmarkCheck,
  Highlighter, Book, X, ChevronDown, ChevronUp, Bot, Send,
  Loader2, AlertCircle, Zap
} from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { exams } from '../data/exams.js';
import { referenceSheet } from '../data/referenceSheet.js';
import CodeEditor from './CodeEditor.jsx';
import { isAIEnabled, explainMistake, askFollowUp } from '../api/anthropicClient.js';

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

/* ─────────────────────── Weekly ADD system ──────────────────────────────── */
// All existing exams in exams.js are ALWAYS available.
// Every week starting from SCHEDULE_START, one bonus exam from the
// WEEKLY_BONUS_QUEUE below is added to the available list.
// Week 0 (Jun 1 → Jun 7): 10 tests. Week 1 (Jun 8 → Jun 14): 11 tests. Etc.

const SCHEDULE_START = '2026-06-01';

export const WEEKLY_BONUS_QUEUE = [
  {
    id: 'bonus-week1-loops',
    title: 'Bonus Week 1 · Loops Deep Dive',
    description: 'Master while, do-while, for, and nested loops with tricky tracing questions.',
    minutes: 20, tag: 'Loops', difficulty: 'easy', accent: 'from-sky-400/30 to-cyan-400/20',
    questions: [
      { id:'bw1-1', type:'mcq', prompt:'How many times does the loop body execute?', code:'int i = 1;\nwhile (i < 100) i *= 2;', options:['6','7','8','100'], answer:1, explanation:'i = 1,2,4,8,16,32,64,128 — condition fails at 128. Loop runs 7 times.' },
      { id:'bw1-2', type:'mcq', prompt:'What is printed?', code:'for (int i = 10; i > 0; i -= 3) System.out.print(i + " ");', options:['10 7 4 1','10 7 4','10 7 4 1 -2','10 7'], answer:0, explanation:'i = 10,7,4,1. When i = 1 - 3 = -2, condition i > 0 fails. Prints 10 7 4 1.' },
      { id:'bw1-3', type:'mcq', prompt:'What is the output?', code:'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue;\n    sum += i;\n}\nSystem.out.println(sum);', options:['55','25','30','50'], answer:1, explanation:'Skips evens. Sum of odd 1+3+5+7+9 = 25.' },
      { id:'bw1-4', type:'mcq', prompt:'What does this print?', code:'outer: for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        if (j == 1) break outer;\n        System.out.print(i + "" + j + " ");\n    }\n}', options:['00 01 10 11 20 21','00','00 10 20','00 11 22'], answer:1, explanation:'break outer exits both loops when j==1 after printing only i=0,j=0: "00".' },
      { id:'bw1-f1', type:'frq', points:5, prompt:'Write a method sumOfDigits(int n) that returns the sum of all digits of n (e.g. 1234 → 10). Handle n = 0 as a base case returning 0.', starter:'public class Solution\n{\n    public int sumOfDigits(int n)\n    {\n        // your code here\n    }\n}\n', modelAnswer:'public class Solution\n{\n    public int sumOfDigits(int n)\n    {\n        int sum = 0;\n        n = Math.abs(n);\n        while (n > 0)\n        {\n            sum += n % 10;\n            n /= 10;\n        }\n        return sum;\n    }\n}\n' }
    ]
  },
  {
    id: 'bonus-week2-strings',
    title: 'Bonus Week 2 · String Mastery',
    description: 'charAt, indexOf, substring, compareTo, and immutability edge cases.',
    minutes: 20, tag: 'Strings', difficulty: 'medium', accent: 'from-violet-400/30 to-pink-400/20',
    questions: [
      { id:'bw2-1', type:'mcq', prompt:'What is the output?', code:'String s = "banana";\nSystem.out.println(s.indexOf("a", 2));', options:['1','3','5','-1'], answer:1, explanation:'indexOf("a", 2) starts searching at index 2. The "a" at index 3 is found first.' },
      { id:'bw2-2', type:'mcq', prompt:'Strings in Java are:', options:['mutable objects','immutable — methods return new Strings','arrays of chars that can be changed','stored on the stack'], answer:1, explanation:'Strings in Java are immutable. String methods return NEW String objects.' },
      { id:'bw2-3', type:'mcq', prompt:'What prints?', code:'String a = "Hello";\nString b = a;\na = a + " World";\nSystem.out.println(b);', options:['Hello World','Hello','null','Hello Hello'], answer:1, explanation:'b still refers to the original "Hello" object. Reassigning a creates a new object.' },
      { id:'bw2-f1', type:'frq', points:5, prompt:'Write a method countChar(String s, char c) that returns how many times character c appears in String s (case-sensitive).', starter:'public class Solution\n{\n    public int countChar(String s, char c)\n    {\n        // your code here\n    }\n}\n', modelAnswer:'public class Solution\n{\n    public int countChar(String s, char c)\n    {\n        int count = 0;\n        for (int i = 0; i < s.length(); i++)\n        {\n            if (s.charAt(i) == c) count++;\n        }\n        return count;\n    }\n}\n' }
    ]
  }
];

function getWeeklyBonusAvailable()
{
  const start = new Date(SCHEDULE_START);
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksPassed = Math.max(0, Math.floor((now - start) / msPerWeek));
  // Return the slice of WEEKLY_BONUS_QUEUE that has been unlocked so far.
  return WEEKLY_BONUS_QUEUE.slice(0, weeksPassed);
}

function getDaysUntilNextBonus()
{
  const start = new Date(SCHEDULE_START);
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const nextWeekStart = new Date(start.getTime() + (Math.floor((now - start) / msPerWeek) + 1) * msPerWeek);
  return Math.max(1, Math.ceil((nextWeekStart - now) / (24 * 60 * 60 * 1000)));
}

/* ─────────────────────── Timer hook ────────────────────────────────────── */
function useTimer(minutes, running)
{
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [timerHidden, setTimerHidden] = useState(false);

  useEffect(() =>
  {
    if (!running || secondsLeft <= 0)
    {
      return undefined;
    }
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const reset = useCallback(() => setSecondsLeft(minutes * 60), [minutes]);
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const pct = (secondsLeft / (minutes * 60)) * 100;
  return { display, pct, timerHidden, setTimerHidden, expired: secondsLeft === 0, reset };
}

/* ─────────────────────── Root component ─────────────────────────────────── */
export default function MockExams({ onLogActivity })
{
  const [results, setResults] = useUserStorage('exam.results', {});
  const [activeId, setActiveId] = useState(null);
  const activeExam = activeId ? exams.find((e) => e.id === activeId) : null;

  const weeklyBonus = useMemo(() => getWeeklyBonusAvailable(), []);
  const allAvailableExams = useMemo(() => [...exams, ...weeklyBonus], [weeklyBonus]);
  const daysUntilNext = useMemo(() => getDaysUntilNextBonus(), []);
  const nextBonusExam = WEEKLY_BONUS_QUEUE[weeklyBonus.length];

  function handleComplete(examId, correct, totalMcq)
  {
    setResults((prev) =>
    {
      const prevRec = (prev || {})[examId] || {};
      const best = totalMcq > 0 ? Math.max(prevRec.best ?? 0, correct) : 0;
      return {
        ...(prev || {}),
        [examId]: { best, totalMcq, completed: true, takenAt: new Date().toISOString().slice(0, 10) }
      };
    });
    onLogActivity?.();
  }

  if (activeExam)
  {
    return (
      <BluebookRunner
        exam={activeExam}
        onExit={() => setActiveId(null)}
        onComplete={handleComplete}
      />
    );
  }
  return (
    <ExamList
      results={results || {}}
      onStart={setActiveId}
      allExams={allAvailableExams}
      daysUntilNext={daysUntilNext}
      nextBonusExam={nextBonusExam}
    />
  );
}

/* ─────────────────────── Exam list ─────────────────────────────────────── */
function ExamList({ results, onStart, allExams, daysUntilNext, nextBonusExam })
{
  function countTypes(exam)
  {
    return {
      mcq: exam.questions.filter((q) => q.type === 'mcq').length,
      frq: exam.questions.filter((q) => q.type === 'frq').length
    };
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="glass gradient-border rounded-2xl px-4 py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ClipboardList size={18} className="text-violet-300" />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white tracking-tight">Mock Exams</h2>
              <p className="text-xs text-slate-400">
                {allExams.length} exams available · new exam added every week
                {isAIEnabled && ' · AI explanations active'}
              </p>
            </div>
          </div>
          {nextBonusExam && (
            <div className="flex items-center gap-2">
              <span className="pill bg-violet-500/20 text-violet-200 border border-violet-400/30">
                Next: "{nextBonusExam.title}" in {daysUntilNext}d
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {allExams.map((exam) =>
        {
          const { mcq, frq } = countTypes(exam);
          const rec = results[exam.id];
          const diff = DIFF_STYLE[exam.difficulty] || DIFF_STYLE.medium;
          return (
            <div
              key={exam.id}
              className={`glass card-hover gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-2.5 bg-gradient-to-br ${exam.accent}`}
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
                {isAIEnabled && <span className="flex items-center gap-1"><Bot size={12} className="text-emerald-300" />AI tutor</span>}
              </div>

              <div className="flex items-center justify-between pt-1 mt-auto flex-wrap gap-2">
                {rec?.completed && rec.totalMcq > 0 ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300"><Trophy size={12} />Best: {rec.best}/{rec.totalMcq}</span>
                ) : rec?.completed ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300"><CheckCircle2 size={12} />Completed</span>
                ) : (
                  <span className="text-[11px] text-slate-500">Not attempted</span>
                )}
                <button onClick={() => onStart(exam.id)} className="btn-primary">
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
function BluebookRunner({ exam, onExit, onComplete })
{
  const questions = exam.questions;
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions]);

  const [answers, setAnswers] = useState({});
  const [frqCode, setFrqCode] = useState({});
  const [current, setCurrent] = useState(0);
  const [markedForReview, setMarkedForReview] = useState({});
  const [eliminated, setEliminated] = useState({});
  const [highlights, setHighlights] = useState({});
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [highlightMode, setHighlightMode] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(null);

  const { display: timerDisplay, timerHidden, setTimerHidden, pct: timerPct } = useTimer(exam.minutes, !submitted);

  const q = questions[current];
  const totalQ = questions.length;

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
    const correct = mcqs.filter((mq) => answers[mq.id] === mq.answer).length;
    setSubmitted(true);
    setReviewMode(true);
    onComplete(exam.id, correct, mcqs.length);
  }

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined || frqCode[q.id]).length;
  const correctCount = submitted ? mcqs.filter((mq) => answers[mq.id] === mq.answer).length : null;
  const pct = submitted && mcqs.length > 0 ? Math.round((correctCount / mcqs.length) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-base)] overflow-hidden" onMouseUp={handleMouseUp}>
      {/* ── Top bar ─────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-white/10 glass shrink-0 relative">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onExit} className="btn-ghost text-[11px] shrink-0">
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
            <button onClick={handleSubmit} className="btn-primary text-[11px]">
              <CheckCircle2 size={13} /><span>Submit</span>
            </button>
          ) : (
            <button onClick={onExit} className="btn-ghost text-[11px]">
              <ArrowLeft size={13} /><span>All exams</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Score banner after submit ─────────────── */}
      {submitted && pct !== null && (
        <div className={`shrink-0 px-4 py-2 text-xs font-medium flex items-center gap-3 ${pct >= 70 ? 'bg-emerald-500/20 text-emerald-200' : pct >= 50 ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-rose-200'}`}>
          <Trophy size={13} />
          Score: {correctCount}/{mcqs.length} MCQ correct ({pct}%)
          <span className="text-slate-300 ml-2">— Review all answers below. Click a wrong answer for AI explanation.</span>
        </div>
      )}

      {/* ── Body: left (stem) + right (choices) ─── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 relative">
        {/* Left panel – question stem / code */}
        <div className="sm:w-1/2 flex-1 overflow-auto p-5 border-r border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">
            Question {current + 1} of {totalQ}
          </div>

          {q.code && (
            <pre className="text-xs font-mono leading-relaxed rounded-xl border border-white/10 p-4 overflow-auto mb-4" style={{ background: 'var(--code-bg)' }}>
              {q.code}
            </pre>
          )}

          {/* Rendered prompt on left for FRQ, or just general context */}
          {q.type === 'frq' && (
            <div className="text-sm text-white leading-relaxed whitespace-pre-wrap">{q.prompt}</div>
          )}

          {/* Highlights panel */}
          {(highlights[q.id] || []).length > 0 && (
            <div className="mt-4 flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Your highlights</div>
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

        {/* Right panel – question + choices */}
        <div className="sm:w-1/2 overflow-auto p-5 flex flex-col gap-4">
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
            <span className="pill bg-white/10 text-slate-200 text-[10px]">{q.type === 'mcq' ? 'Multiple choice' : 'Free response'}</span>
          </div>

          {/* Question prompt */}
          <p className="text-sm text-white leading-relaxed">{q.type === 'mcq' ? q.prompt : 'Write your code answer below.'}</p>

          {/* MCQ choices */}
          {q.type === 'mcq' && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) =>
              {
                const chosen = answers[q.id] === i;
                const isCorrect = submitted && i === q.answer;
                const isWrong = submitted && chosen && i !== q.answer;
                const elim = eliminated[`${q.id}-${i}`];
                return (
                  <div key={i} className="flex items-center gap-2 group">
                    <button
                      onClick={() => setAnswer(q.id, i)}
                      disabled={submitted}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition text-sm
                        ${isCorrect ? 'bg-emerald-500/20 border-emerald-400/50 text-white' :
                          isWrong ? 'bg-rose-500/20 border-rose-400/50 text-white' :
                          chosen ? 'bg-violet-500/25 border-violet-400/60 text-white' :
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

          {/* Explanation after submit */}
          {submitted && q.type === 'mcq' && answers[q.id] !== undefined && (
            <ExplanationCard
              question={q}
              userAnswer={answers[q.id]}
              chatOpen={chatOpen === q.id}
              onToggleChat={() => setChatOpen((prev) => prev === q.id ? null : q.id)}
            />
          )}
        </div>
      </div>

      {/* ── Bottom navigation bar ─────────────────── */}
      <footer className="glass border-t border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn-ghost disabled:opacity-40"
        >
          <ArrowLeft size={13} /><span>Back</span>
        </button>

        <button
          onClick={() => setShowNav((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white transition"
        >
          <span className="font-medium">Question {current + 1} of {totalQ}</span>
          {showNav ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        <button
          onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))}
          disabled={current === totalQ - 1}
          className="btn-primary disabled:opacity-40"
        >
          <span>Next</span><ArrowRight size={13} />
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
            <div className="flex flex-wrap gap-1.5">
              {questions.map((qn, i) =>
              {
                const ans = answers[qn.id];
                const done = ans !== undefined || frqCode[qn.id];
                const marked = markedForReview[qn.id];
                const isWrong = submitted && qn.type === 'mcq' && ans !== qn.answer;
                return (
                  <button
                    key={qn.id}
                    onClick={() => { setCurrent(i); setShowNav(false); }}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold grid place-items-center border transition
                      ${i === current ? 'border-violet-400 bg-violet-500/30 text-white' :
                        isWrong ? 'border-rose-400/60 bg-rose-500/20 text-rose-200' :
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
              <span><span className="inline-block w-3 h-3 rounded bg-white/10 mr-1" />Unanswered</span>
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
function ExplanationCard({ question, userAnswer, chatOpen, onToggleChat })
{
  const isCorrect = userAnswer === question.answer;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() =>
  {
    if (bottomRef.current)
    {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function loadAiExplanation()
  {
    if (isCorrect || aiExplanation || !isAIEnabled)
    {
      return;
    }
    setAiLoading(true);
    try
    {
      const text = await explainMistake(question, userAnswer);
      setAiExplanation(text);
    }
    catch
    {
      setAiExplanation(null);
    }
    finally
    {
      setAiLoading(false);
    }
  }

  useEffect(() =>
  {
    if (chatOpen && !isCorrect)
    {
      loadAiExplanation();
    }
  }, [chatOpen]);

  async function sendMessage()
  {
    if (!input.trim() || loading)
    {
      return;
    }
    const text = input.trim();
    setInput('');
    setMessages((p) => [...p, { role: 'user', text }]);
    setLoading(true);
    try
    {
      const context = { question, userAnswer, explanation: aiExplanation || question.explanation };
      const reply = await askFollowUp(context, text, messages);
      setMessages((p) => [...p, { role: 'ai', text: reply }]);
    }
    catch
    {
      setMessages((p) => [...p, { role: 'ai', text: 'Sorry, I could not respond right now.' }]);
    }
    finally
    {
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-xl border text-xs overflow-hidden ${isCorrect ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}>
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          {isCorrect ? <CheckCircle2 size={13} className="text-emerald-300 mt-0.5 shrink-0" /> : <XCircle size={13} className="text-rose-300 mt-0.5 shrink-0" />}
          <div className="min-w-0">
            <div className={`font-semibold ${isCorrect ? 'text-emerald-200' : 'text-rose-200'}`}>
              {isCorrect ? 'Correct!' : `Incorrect — answer: ${LETTERS[question.answer]}) ${question.options[question.answer]}`}
            </div>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{question.explanation}</p>
          </div>
        </div>
        {!isCorrect && (
          <button
            onClick={onToggleChat}
            className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border transition ${chatOpen ? 'border-violet-400/50 bg-violet-500/20 text-violet-200' : 'border-white/10 text-slate-300 hover:text-white hover:border-white/30'}`}
          >
            <Bot size={12} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}
      </div>

      {chatOpen && !isCorrect && (
        <div className="border-t border-white/10">
          {/* AI explanation */}
          {(aiLoading || aiExplanation) && (
            <div className="px-3 py-2 bg-violet-500/10 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300 mb-1">
                <Zap size={10} />AI Explanation
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Loader2 size={12} className="animate-spin" />Generating explanation…
                </div>
              ) : (
                <p className="text-slate-200 leading-relaxed">{aiExplanation}</p>
              )}
            </div>
          )}

          {/* Chat messages */}
          <div className="max-h-48 overflow-auto px-3 py-2 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-1.5 leading-relaxed ${msg.role === 'user' ? 'bg-violet-500/30 text-white' : 'bg-white/[0.06] text-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="bg-white/[0.06] rounded-xl px-3 py-1.5 text-slate-400 flex items-center gap-1.5">
                  <Loader2 size={11} className="animate-spin" />Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-white/10 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isAIEnabled ? "Ask a follow-up question…" : "AI tutor not configured"}
              disabled={!isAIEnabled || loading}
              className="input-field py-1.5 text-[11px] flex-1"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || !isAIEnabled}
              className="btn-primary py-1.5 px-2 disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </div>
          {!isAIEnabled && (
            <p className="px-3 pb-2 text-[10px] text-slate-500">
              Add VITE_ANTHROPIC_API_KEY to .env.local to enable AI explanations.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
