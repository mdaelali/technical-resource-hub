import { useMemo, useRef, useState } from 'react';
import
{
  ClipboardList, CheckCircle2, XCircle, Clock, ArrowLeft,
  Trophy, Code2, ListChecks, RotateCcw, Eye, EyeOff, Award,
  Zap, Bot, SendHorizonal, Loader2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import { exams } from '../data/exams.js';
import CodeEditor from './CodeEditor.jsx';
import { isAIEnabled, explainMistake, askFollowUp } from '../api/anthropicClient.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const DIFF_STYLE = {
  easy:   { label: 'Easy',   cls: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
  medium: { label: 'Medium', cls: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
  hard:   { label: 'Hard',   cls: 'bg-rose-500/20 text-rose-200 border-rose-400/30' }
};

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
        [examId]: { best, totalMcq, completed: true, takenAt: new Date().toISOString().slice(0, 10) }
      };
    });
    onLogActivity?.();
  }

  if (activeExam)
  {
    return <ExamRunner exam={activeExam} onExit={() => setActiveId(null)} onComplete={handleComplete} />;
  }
  return <ExamList results={results || {}} onStart={setActiveId} />;
}

function ExamList({ results, onStart })
{
  return (
    <div className="flex flex-col gap-3">
      <div className="glass gradient-border rounded-2xl px-4 py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
        <div className="relative flex flex-wrap items-center gap-2">
          <ClipboardList size={18} className="text-violet-300" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white tracking-tight">Mock Exams</h2>
            <p className="text-xs text-slate-400">
              {exams.length} timed practice tests · auto-graded MCQ · AP-style coding FRQ
              {isAIEnabled ? ' · AI explanations' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {exams.map((exam) =>
        {
          const { mcq, frq } = countTypes(exam);
          const rec = results[exam.id];
          const diff = DIFF_STYLE[exam.difficulty] || DIFF_STYLE.medium;
          return (
            <div key={exam.id} className={`glass card-hover gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-2.5 bg-gradient-to-br ${exam.accent}`}>
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
                {frq > 0 && <span className="flex items-center gap-1"><Code2 size={12} className="text-amber-300" />{frq} coding</span>}
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
  const mcqs = useMemo(() => exam.questions.filter((q) => q.type === 'mcq'), [exam]);
  const totalMcq = mcqs.length;
  const correctCount = useMemo(() => mcqs.filter((q) => answers[q.id] === q.answer).length, [mcqs, answers]);
  const answeredCount = exam.questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const pct = totalMcq > 0 ? Math.round((correctCount / totalMcq) * 100) : null;

  function setAnswer(qid, val)
  {
    if (!submitted) setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  function handleSubmit()
  {
    setSubmitted(true);
    onComplete(exam.id, correctCount, totalMcq);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onExit} className="btn-ghost"><ArrowLeft size={13} /><span>All tests</span></button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white tracking-tight truncate">{exam.title}</h2>
            <p className="text-[11px] text-slate-400">{answeredCount}/{exam.questions.length} answered</p>
          </div>
        </div>
        {!submitted
          ? <button onClick={handleSubmit} className="btn-primary"><CheckCircle2 size={13} /><span>Submit test</span></button>
          : <button onClick={onExit} className="btn-ghost"><ArrowLeft size={13} /><span>Back to list</span></button>
        }
      </div>

      {submitted && totalMcq > 0 && (
        <div className="glass gradient-border rounded-2xl px-4 py-4 flex items-center gap-4 flex-wrap">
          <div className={`w-14 h-14 rounded-2xl grid place-items-center text-lg font-bold shrink-0 ${pct >= 70 ? 'bg-emerald-500/20 text-emerald-300' : pct >= 40 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {pct}%
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{correctCount} of {totalMcq} multiple-choice correct</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAIEnabled ? 'Click any wrong answer for an AI explanation.' : 'Read the explanation under each question.'}
              {exam.questions.some((q) => q.type === 'frq') ? ' Compare coding answers with the model solution.' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {exam.questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            index={idx}
            question={q}
            answer={answers[q.id]}
            onAnswer={(val) => setAnswer(q.id, val)}
            submitted={submitted}
          />
        ))}
      </div>

      {!submitted && (
        <button onClick={handleSubmit} className="btn-primary self-end py-2 px-4">
          <CheckCircle2 size={14} /><span>Submit test</span>
        </button>
      )}
    </div>
  );
}

function QuestionCard({ index, question, answer, onAnswer, submitted })
{
  const [revealed, setRevealed] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const isWrong = submitted && question.type === 'mcq' && answer !== question.answer;

  async function fetchAIExplanation()
  {
    if (aiExplanation || loadingAI) return;
    setLoadingAI(true);
    try
    {
      const text = await explainMistake({ question, studentAnswer: answer, correctAnswer: question.answer });
      setAiExplanation(text || 'Could not load AI explanation.');
    }
    catch
    {
      setAiExplanation('Could not load AI explanation. Check your VITE_ANTHROPIC_API_KEY.');
    }
    setLoadingAI(false);
  }

  if (question.type === 'mcq')
  {
    return (
      <div className="glass gradient-border rounded-2xl px-4 py-3.5 flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <span className="text-violet-300 font-mono text-xs mt-0.5 shrink-0">Q{index + 1}</span>
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
              if (isCorrect) tone = 'border-emerald-400/50 bg-emerald-500/10';
              else if (selected) tone = 'border-rose-400/50 bg-rose-500/10';
              else tone = 'border-white/5 opacity-60';
            }
            else if (selected) tone = 'border-violet-400/60 bg-violet-500/10';

            return (
              <button key={i} onClick={() => onAnswer(i)} disabled={submitted}
                className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg border text-xs transition ${tone} ${submitted ? 'cursor-default' : ''}`}
              >
                <span className={`w-5 h-5 rounded-md grid place-items-center text-[10px] font-semibold shrink-0 ${selected ? 'bg-violet-500/40 text-white' : 'bg-white/[0.06] text-slate-300'}`}>
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
          <div className="flex flex-col gap-2">
            <div className="text-[11px] text-slate-300 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 leading-relaxed">
              <span className="text-slate-400 font-medium">Explanation: </span>{question.explanation}
            </div>

            {isAIEnabled && isWrong && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { fetchAIExplanation(); setChatOpen(true); }}
                  className="flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 transition self-start"
                >
                  {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
                  <span>{loadingAI ? 'Getting AI explanation...' : aiExplanation ? 'Ask AI a follow-up' : 'Get AI explanation'}</span>
                </button>

                {aiExplanation && (
                  <div className="flex flex-col gap-1.5 bg-emerald-500/5 border border-emerald-400/20 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
                      <Bot size={11} />AI Explanation
                    </div>
                    <p className="text-[11.5px] text-slate-200 leading-relaxed">{aiExplanation}</p>
                    {chatOpen && (
                      <AIChatThread question={question} />
                    )}
                  </div>
                )}
              </div>
            )}
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
          <span className="text-amber-300 font-mono text-xs mt-0.5 shrink-0">Q{index + 1}</span>
          <h3 className="text-sm text-white leading-relaxed">{question.prompt}</h3>
        </div>
        {question.points && <span className="pill bg-white/10 text-slate-200 shrink-0">{question.points} pts</span>}
      </div>

      <div className="h-64 flex glass rounded-xl overflow-hidden border border-white/10">
        <CodeEditor value={answer ?? question.starter} onChange={onAnswer} language="java" />
      </div>

      {submitted && (
        <div className="flex flex-col gap-2">
          <button onClick={() => setRevealed(!revealed)} className="btn-ghost self-start">
            {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
            <span>{revealed ? 'Hide model answer' : 'Show model answer'}</span>
          </button>
          {revealed && (
            <div className="flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Model answer</div>
              <pre className="bg-[#0a0c14] border border-emerald-400/20 rounded-lg px-3 py-2.5 font-mono text-[11.5px] text-emerald-100 overflow-auto whitespace-pre leading-[1.55]">
                {question.modelAnswer}
              </pre>
              <p className="text-[11px] text-slate-400">Compare structure, edge cases, and correctness. Multiple valid solutions may exist.</p>
              {isAIEnabled && (
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className="flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/30 transition self-start"
                >
                  <Bot size={12} />
                  <span>{chatOpen ? 'Close AI tutor' : 'Ask AI about this question'}</span>
                  {chatOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
              )}
              {chatOpen && isAIEnabled && <AIChatThread question={question} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AIChatThread({ question })
{
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  async function sendMessage()
  {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try
    {
      const reply = await askFollowUp({
        question,
        conversationHistory: newMessages,
        userMessage: text
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply || 'I couldn\'t generate a response.' }]);
    }
    catch
    {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Could not reach the AI. Check your API key.' }]);
    }
    setLoading(false);
    requestAnimationFrame(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }));
  }

  function onKeyDown(e)
  {
    if (e.key === 'Enter' && !e.shiftKey)
    {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-1 border-t border-white/10 pt-2">
      <div className="text-[10px] uppercase tracking-wider text-emerald-300 flex items-center gap-1">
        <Bot size={10} /> Ask the AI tutor
      </div>

      {messages.length > 0 && (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-violet-500/20 text-violet-100'
                  : 'bg-white/[0.05] text-slate-200'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="bg-white/[0.05] rounded-xl px-3 py-2 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-emerald-300" />
                <span className="text-[11px] text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a follow-up question... (Enter to send)"
          rows={2}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/40 resize-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="btn-primary shrink-0 h-8 px-3 disabled:opacity-50"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <SendHorizonal size={13} />}
        </button>
      </div>
      <p className="text-[10px] text-slate-500">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
