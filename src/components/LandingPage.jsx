import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Braces, Brain, Check, Code2, GraduationCap, Layers3, Menu, Sparkles, Terminal, Trophy, X } from 'lucide-react';
import '../landing.css';

export default function LandingPage({ onLogin, onSignup })
{
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="landing-page min-h-[100dvh] overflow-hidden">
      <header className="landing-nav mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href="#home" className="flex items-center gap-2.5" aria-label="Technical Resource Hub home">
          <span className="landing-brand-mark grid h-10 w-10 place-items-center rounded-2xl"><GraduationCap size={21}/></span>
          <span><strong className="block text-sm font-bold tracking-tight">Resource Hub</strong><small className="block text-[10px] landing-muted">A better way to learn CS</small></span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          <a href="#how-it-works" className="landing-nav-link">How it works</a>
          <a href="#subjects" className="landing-nav-link">What you'll learn</a>
          <a href="#practice" className="landing-nav-link">Practice tools</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onLogin} className="landing-login rounded-xl px-3 py-2 text-sm font-semibold sm:px-4">Log in</button>
          <button onClick={onSignup} className="landing-signup rounded-xl px-3 py-2.5 text-sm font-semibold sm:px-4">Sign up <ArrowRight size={14}/></button>
          <button type="button" className="landing-menu grid h-10 w-10 place-items-center rounded-xl md:hidden" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
        {menuOpen && (
          <nav className="landing-mobile-nav md:hidden" aria-label="Mobile navigation">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#subjects" onClick={() => setMenuOpen(false)}>What you'll learn</a>
            <a href="#practice" onClick={() => setMenuOpen(false)}>Practice tools</a>
          </nav>
        )}
      </header>

      <section id="home" className="landing-hero mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid-cols-[1fr_0.9fr] lg:px-12 lg:pb-28 lg:pt-16">
        <div className="relative z-10 max-w-2xl">
          <div className="landing-kicker inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"><Sparkles size={13}/> Your next chapter starts here</div>
          <h1 className="mt-6 text-[2.8rem] font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[4.25rem]">Computer science, <span className="landing-headline-accent">made clearer.</span></h1>
          <p className="landing-copy mt-5 max-w-xl text-base leading-7 sm:text-lg sm:leading-8">Understand the ideas behind the code. Learn core CS concepts, practise in a real coding workspace, and see your progress grow one session at a time.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={onSignup} className="landing-primary inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold">Start learning for free <ArrowRight size={16}/></button>
            <a href="#how-it-works" className="landing-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">Take a look <ArrowDown size={15}/></a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs landing-muted">
            <span className="inline-flex items-center gap-1.5"><Check size={13} className="landing-check"/> Learn at your own pace</span>
            <span className="inline-flex items-center gap-1.5"><Check size={13} className="landing-check"/> Progress saved to your account</span>
          </div>
        </div>

        <div className="landing-preview-wrap relative mx-auto w-full max-w-[570px]">
          <div className="landing-spark landing-spark-one" aria-hidden="true">✳</div><div className="landing-spark landing-spark-two" aria-hidden="true">✳</div>
          <div className="landing-preview rounded-[1.65rem] p-3 sm:p-4">
            <div className="landing-preview-bar flex items-center justify-between px-2 pb-3 pt-1"><span className="flex items-center gap-2 text-[11px] font-semibold"><span className="landing-mini-brand grid h-6 w-6 place-items-center rounded-lg"><GraduationCap size={13}/></span> Learning dashboard</span><span className="landing-live-pill rounded-full px-2.5 py-1 text-[9px] font-semibold">YOUR SPACE</span></div>
            <div className="landing-preview-content rounded-2xl p-4 sm:p-5">
              <div className="landing-preview-hello text-[10px] font-semibold uppercase tracking-[0.15em]">YOUR LEARNING JOURNEY</div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">Big ideas. Small steps.</h3>
              <p className="landing-muted mt-1 text-[11px]">Pick up where you left off.</p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="landing-preview-stat rounded-xl p-3"><span className="landing-stat-icon landing-stat-mint grid h-7 w-7 place-items-center rounded-lg"><Trophy size={13}/></span><p className="mt-2 text-lg font-semibold">12 <small className="landing-muted text-[10px] font-normal">topics</small></p><p className="landing-muted text-[9px]">Concepts mastered</p></div>
                <div className="landing-preview-stat rounded-xl p-3"><span className="landing-stat-icon landing-stat-blue grid h-7 w-7 place-items-center rounded-lg"><Layers3 size={13}/></span><p className="mt-2 text-lg font-semibold">3 <small className="landing-muted text-[10px] font-normal">steps</small></p><p className="landing-muted text-[9px]">Today's study plan</p></div>
              </div>
              <div className="landing-preview-stat mt-2.5 rounded-xl p-3.5">
                <div className="flex items-center justify-between"><span className="text-[11px] font-semibold">Continue learning</span><span className="landing-muted text-[9px]">ALGORITHMS</span></div>
                <div className="mt-2.5 flex items-center gap-2.5"><span className="landing-topic-icon grid h-9 w-9 place-items-center rounded-xl"><Braces size={17}/></span><div className="flex-1"><p className="text-[11px] font-semibold">Binary search</p><p className="landing-muted mt-0.5 text-[9px]">A faster way to find what you're looking for</p></div><ArrowRight size={14} className="landing-muted"/></div>
                <div className="landing-progress-track mt-3 h-1.5 overflow-hidden rounded-full"><div className="landing-progress-fill h-full rounded-full" style={{ width: '63%' }}/></div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 pt-3 text-[10px] landing-muted"><span className="landing-online-dot h-1.5 w-1.5 rounded-full"/>Your work is saved as you go</div>
          </div>
          <div className="landing-floating-chip landing-chip-top flex items-center gap-2 rounded-xl px-3 py-2.5"><span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-400/15 text-amber-500"><Sparkles size={14}/></span><span><strong className="block text-[10px]">Keep your streak going</strong><small className="landing-muted text-[9px]">Every session counts</small></span></div>
          <div className="landing-floating-chip landing-chip-bottom flex items-center gap-2 rounded-xl px-3 py-2.5"><span className="landing-chip-code grid h-7 w-7 place-items-center rounded-lg"><Code2 size={14}/></span><span><strong className="block text-[10px]">Learn by doing</strong><small className="landing-muted text-[9px]">Write. Run. Understand.</small></span></div>
        </div>
      </section>

      <section className="landing-strip px-5 py-5 sm:px-8"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium sm:gap-x-12"><span className="landing-strip-label">ONE PLACE TO</span><span className="inline-flex items-center gap-2"><BookOpen size={15}/> Understand</span><span className="inline-flex items-center gap-2"><Code2 size={15}/> Experiment</span><span className="inline-flex items-center gap-2"><Brain size={15}/> Practise</span><span className="inline-flex items-center gap-2"><Trophy size={15}/> Grow</span></div></section>

      <section id="how-it-works" className="landing-section mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-xl text-center"><p className="landing-section-label">A friendlier way to study</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Learn it. Try it. Make it yours.</h2><p className="landing-copy mt-3 text-sm leading-6 sm:text-base">A good learning routine brings the explanation and the practice together.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StepCard number="01" icon={BookOpen} title="Get the idea" detail="Clear notes break down algorithms, logic, and exam topics into steps you can follow." tone="mint" />
          <StepCard number="02" icon={Terminal} title="Try it yourself" detail="Explore example code, edit it in the playground, and run your own programs." tone="blue" />
          <StepCard number="03" icon={Trophy} title="See your progress" detail="Mark concepts you know, build a daily streak, and return to topics when you need them." tone="peach" />
        </div>
      </section>

      <section id="subjects" className="landing-subjects px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-4"><div><p className="landing-section-label">Made for curious minds</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The building blocks of computer science.</h2><p className="landing-copy mt-4 max-w-md text-sm leading-6 sm:text-base">From your first algorithm to the ideas behind complex systems, build understanding that stays with you.</p><button onClick={onSignup} className="landing-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">Explore the library <ArrowRight size={15}/></button></div><div className="grid gap-3 sm:grid-cols-2"><SubjectCard icon={Braces} title="Algorithms" detail="Sorting, searching, graphs, and problem-solving patterns." color="mint"/><SubjectCard icon={Brain} title="Logic & discrete math" detail="Reasoning, truth tables, sets, and foundational puzzles." color="blue"/><SubjectCard icon={BookOpen} title="Study notes" detail="Concise explanations, examples, and common mistakes." color="peach"/><SubjectCard icon={GraduationCap} title="Exam preparation" detail="Review essential ideas and practise with timed exams." color="lilac"/></div></div></section>

      <section id="practice" className="landing-section mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12"><div className="landing-practice rounded-[1.75rem] p-6 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-12"><div className="max-w-2xl"><p className="landing-section-label">More than reading</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The best way to learn code is to write it.</h2><p className="landing-copy mt-3 text-sm leading-6 sm:text-base">Switch from a quick example to a full coding session without losing your place.</p><button onClick={onSignup} className="landing-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">Create your free account <ArrowRight size={15}/></button></div><div className="landing-practice-tools mt-7 grid gap-2 sm:grid-cols-3 lg:mt-0 lg:min-w-[420px]"><PracticeTile icon={Code2} title="Playground" subtitle="Explore snippets"/><PracticeTile icon={Terminal} title="Compiler" subtitle="Run your code"/><PracticeTile icon={Brain} title="Mock exams" subtitle="Test your skills"/></div></div></section>

      <footer className="landing-footer px-5 py-7 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left lg:px-4"><a href="#home" className="flex items-center gap-2 text-sm font-semibold"><span className="landing-brand-mark grid h-8 w-8 place-items-center rounded-xl"><GraduationCap size={16}/></span>Technical Resource Hub</a><span className="landing-muted text-xs">A little progress, every day.</span><div className="flex items-center gap-4 text-xs"><button onClick={onLogin} className="landing-nav-link">Log in</button><button onClick={onSignup} className="landing-nav-link">Create account</button></div></div></footer>
    </main>
  );
}

function StepCard({ number, icon: Icon, title, detail, tone })
{
  return <article className="landing-step-card rounded-2xl p-5 sm:p-6"><div className="flex items-center justify-between"><span className="landing-step-num text-xs font-semibold">{number}</span><span className={`landing-step-icon landing-${tone} grid h-10 w-10 place-items-center rounded-xl`}><Icon size={18}/></span></div><h3 className="mt-6 text-base font-semibold">{title}</h3><p className="landing-copy mt-2 text-sm leading-6">{detail}</p></article>;
}

function SubjectCard({ icon: Icon, title, detail, color })
{
  return <article className="landing-subject-card flex gap-3 rounded-2xl p-4"><span className={`landing-step-icon landing-${color} grid h-10 w-10 shrink-0 place-items-center rounded-xl`}><Icon size={18}/></span><div><h3 className="text-sm font-semibold">{title}</h3><p className="landing-copy mt-1 text-xs leading-5">{detail}</p></div></article>;
}

function PracticeTile({ icon: Icon, title, subtitle })
{
  return <div className="landing-practice-tile rounded-2xl p-4"><Icon size={18} className="landing-practice-icon"/><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="landing-muted mt-1 text-xs">{subtitle}</p></div>;
}
