import { useMemo, useState } from 'react';
import
{
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Trophy,
  Code2,
  ListChecks,
  RotateCcw,
  Eye,
  EyeOff,
  Award
} from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { exams } from '../data/exams.js';
import CodeEditor from './CodeEditor.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function countTypes(exam)
{
  const mcq = exam.questions.filter((q) => q.type === 'mcq').length;
  const frq = exam.questions.filter((q) => q.type === 'frq').length;
  return { mcq, frq };
}

export default function MockExams({ onLogActivity })
{
  const [results, setResults] = useUserStorage('exam.results', {});
  const [activeId, setActiveId] = useState(null);

  const activeExam = activeId ? exams.find((e) => e.id === activeId) : null;

  function handleComplete(examId, correct, totalMcq)
  {
    setResults((prev) =>
    {
      const prevRec = (prev || {})[examId] || {};
      const best = totalMcq > 0 ? Math.max(prevRec.best ?? 0, correct) : 0;
      return {
        ...(prev || {}),
        [examId]: {
          best,
          totalMcq,
          completed: true,
          takenAt: new Date().toISOString().slice(0, 10)
        }
      };
    });
    onLogActivity?.();
  }

  if (activeExam)
  {
    return (
      <ExamRunner
        exam={activeExam}
        onExit={() => setActiveId(null)}
        onComplete={handleComplete}
      />
    );
  }

  return <ExamList results={results || {}} onStart={setActiveId} />;
}

function ExamList({ results, onStart })
{
  return (
    <div className="flex flex-col gap-3">
      <div className="glass gradient-border rounded-2xl px-4 py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
        <div className="relative flex items-center gap-2">
          <ClipboardList size={18} className="text-violet-300" />
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Mock Exams</h2>
            <p className="text-xs text-slate-400">
              Timed-style practice tests — auto-graded multiple choice plus AP-style coding free-response.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {exams.map((exam) =>
        {
          const { mcq, frq } = countTypes(exam);
          const rec = results[exam.id];
          return (
            <div
              key={exam.id}
              className={`glass card-hover gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-2.5 bg-gradient-to-br ${exam.accent}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white tracking-tight">{exam.title}</h3>
                    <span className="pill bg-white/10 text-slate-200">{exam.tag}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{exam.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-cyan-300" />
                  ~{exam.minutes} min
                </span>
                {mcq > 0 && (
                  <span className="flex items-center gap-1">
                    <ListChecks size={12} className="text-violet-300" />
                    {mcq} MCQ
                  </span>
                )}
                {frq > 0 && (
                  <span className="flex items-center gap-1">
                    <Code2 size={12} className="text-amber-300" />
                    {frq} coding
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 mt-auto">
                {rec?.completed && rec.totalMcq > 0 ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <Trophy size={12} />
                    Best: {rec.best}/{rec.totalMcq}
                  </span>
                ) : rec?.completed ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <CheckCircle2 size={12} />
                    Completed
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">Not attempted</span>
                )}
                <button
                  onClick={() => onStart(exam.id)}
                  className="btn-primary"
                >
                  {rec?.completed ? <RotateCcw size={12} /> : <ClipboardList size={12} />}
                  <span>{rec?.completed ? 'Retake' : 'Start test'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExamRunner({ exam, onExit, onComplete })
{
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState({});

  const mcqs = useMemo(() => exam.questions.filter((q) => q.type === 'mcq'), [exam]);
  const totalMcq = mcqs.length;

  const correctCount = useMemo(
    () => mcqs.filter((q) => answers[q.id] === q.answer).length,
    [mcqs, answers]
  );

  const answeredCount = exam.questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;

  function setAnswer(qid, val)
  {
    if (submitted)
    {
      return;
    }
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  function handleSubmit()
  {
    setSubmitted(true);
    onComplete(exam.id, correctCount, totalMcq);
    const scroller = document.querySelector('[data-exam-scroll]');
    if (scroller)
    {
      scroller.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const pct = totalMcq > 0 ? Math.round((correctCount / totalMcq) * 100) : null;

  return (
    <div className="flex flex-col gap-3" data-exam-scroll>
      {/* Header */}
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onExit} className="btn-ghost">
            <ArrowLeft size={13} />
            <span>All tests</span>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white tracking-tight truncate">{exam.title}</h2>
            <p className="text-[11px] text-slate-400">
              {answeredCount}/{exam.questions.length} answered
            </p>
          </div>
        </div>
        {!submitted ? (
          <button onClick={handleSubmit} className="btn-primary">
            <CheckCircle2 size={13} />
            <span>Submit test</span>
          </button>
        ) : (
          <button onClick={onExit} className="btn-ghost">
            <ArrowLeft size={13} />
            <span>Back to list</span>
          </button>
        )}
      </div>

      {/* Results banner */}
      {submitted && totalMcq > 0 && (
        <div className="glass gradient-border rounded-2xl px-4 py-4 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl grid place-items-center text-lg font-bold ${
            pct >= 70 ? 'bg-emerald-500/20 text-emerald-300' : pct >= 40 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {pct}%
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {correctCount} of {totalMcq} multiple-choice correct
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {exam.questions.some((q) => q.type === 'frq')
                ? 'Coding questions are self-checked — compare your answer with the model solution below.'
                : pct >= 70 ? 'Strong work. Review any misses below.' : 'Review the explanations below and retake when ready.'}
            </p>
          </div>
        </div>
      )}
      {submitted && totalMcq === 0 && (
        <div className="glass gradient-border rounded-2xl px-4 py-4 flex items-center gap-3">
          <Award size={20} className="text-emerald-300" />
          <div className="text-xs text-slate-300">
            Submitted. These are coding free-response questions — compare each answer against the model solution below.
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {exam.questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            index={idx}
            question={q}
            answer={answers[q.id]}
            onAnswer={(val) => setAnswer(q.id, val)}
            submitted={submitted}
            revealed={!!revealed[q.id]}
            onToggleReveal={() => setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))}
          />
        ))}
      </div>

      {!submitted && (
        <button onClick={handleSubmit} className="btn-primary self-end py-2 px-4">
          <CheckCircle2 size={14} />
          <span>Submit test</span>
        </button>
      )}
    </div>
  );
}

function QuestionCard({ index, question, answer, onAnswer, submitted, revealed, onToggleReveal })
{
  if (question.type === 'mcq')
  {
    return (
      <div className="glass gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <span className="text-violet-300 font-mono text-xs mt-0.5">Q{index + 1}</span>
          <h3 className="text-sm text-white leading-relaxed">{question.prompt}</h3>
        </div>

        {question.code && (
          <pre className="bg-[#0a0c14] border border-white/10 rounded-lg px-3 py-2 font-mono text-[11.5px] text-cyan-100 overflow-auto whitespace-pre">
            {question.code}
          </pre>
        )}

        <div className="flex flex-col gap-1.5">
          {question.options.map((opt, i) =>
          {
            const selected = answer === i;
            const isCorrect = i === question.answer;
            let tone = 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]';
            if (submitted)
            {
              if (isCorrect)
              {
                tone = 'border-emerald-400/50 bg-emerald-500/10';
              }
              else if (selected)
              {
                tone = 'border-rose-400/50 bg-rose-500/10';
              }
              else
              {
                tone = 'border-white/5 opacity-70';
              }
            }
            else if (selected)
            {
              tone = 'border-violet-400/60 bg-violet-500/10';
            }
            return (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                disabled={submitted}
                className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg border text-xs transition ${tone} ${submitted ? 'cursor-default' : ''}`}
              >
                <span className={`w-5 h-5 rounded-md grid place-items-center text-[10px] font-semibold shrink-0 ${
                  selected ? 'bg-violet-500/40 text-white' : 'bg-white/[0.06] text-slate-300'
                }`}>
                  {LETTERS[i]}
                </span>
                <span className="text-slate-200 flex-1">{opt}</span>
                {submitted && isCorrect && <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />}
                {submitted && selected && !isCorrect && <XCircle size={14} className="text-rose-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="text-[11px] text-slate-300 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 leading-relaxed">
            <span className="text-slate-400">Explanation: </span>
            {question.explanation}
          </div>
        )}
      </div>
    );
  }

  // FRQ
  return (
    <div className="glass gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className="text-amber-300 font-mono text-xs mt-0.5">Q{index + 1}</span>
          <h3 className="text-sm text-white leading-relaxed">{question.prompt}</h3>
        </div>
        {question.points && (
          <span className="pill bg-white/10 text-slate-200 shrink-0">{question.points} pts</span>
        )}
      </div>

      <div className="h-64 flex glass rounded-xl overflow-hidden border border-white/10">
        <CodeEditor
          value={answer ?? question.starter}
          onChange={(val) => onAnswer(val)}
          language="java"
        />
      </div>

      {submitted && (
        <div className="flex flex-col gap-2">
          <button onClick={onToggleReveal} className="btn-ghost self-start">
            {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
            <span>{revealed ? 'Hide model answer' : 'Show model answer'}</span>
          </button>
          {revealed && (
            <div className="flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Model answer</div>
              <pre className="bg-[#0a0c14] border border-emerald-400/20 rounded-lg px-3 py-2.5 font-mono text-[11.5px] text-emerald-100 overflow-auto whitespace-pre leading-[1.55]">
                {question.modelAnswer}
              </pre>
              <p className="text-[11px] text-slate-400">
                Compare structure, edge cases, and correctness. There are valid solutions other than this one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
