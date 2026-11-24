import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import '../landing.css';

const SEARCH_CODE = `// Search a sorted array by halving the range.
public static int binarySearch(int[] a, int target) {
    int lo = 0;
    int hi = a.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`;

const TRACE = [
  { step: 1, lo: 0, hi: 9, mid: 4, value: 16, note: '16 is less than 23, so search the right half' },
  { step: 2, lo: 5, hi: 9, mid: 7, value: 56, note: '56 is greater than 23, so search the left half' },
  { step: 3, lo: 5, hi: 6, mid: 5, value: 23, note: 'Found at index 5', found: true },
];

const STUDY_AREAS = [
  { title: 'Algorithms', detail: 'Sorting, searching, and graph traversal, with traces that show what changes at each step.' },
  { title: 'Logic and discrete math', detail: 'Truth tables, sets, and proof patterns, worked through until the steps make sense.' },
  { title: 'Study notes', detail: 'Short notes with examples and the mistakes students make most often.' },
  { title: 'Exam preparation', detail: 'Review the key ideas, then sit timed practice questions in the same format as the exam.' },
];

const PRACTICE = [
  { title: 'Playground', detail: 'Change a snippet and see what happens to its output.' },
  { title: 'Compiler', detail: 'Write and run your own program.' },
  { title: 'Mock exams', detail: 'Timed questions in the same format as the real exam.' },
];

export default function LandingPage({ onLogin, onSignup }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="lp">
      <div className="lp-wrap">
        <header className="lp-top">
          <a className="lp-brand" href="#home" aria-label="Technical Resource Hub home">Resource Hub</a>
          <nav className="lp-nav" aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#subjects">Concepts</a>
            <a href="#practice">Practice</a>
          </nav>
          <div className="lp-actions">
            <button type="button" className="lp-login" onClick={onLogin}>Log in</button>
            <button type="button" className="lp-btn" onClick={onSignup}>Sign up</button>
            <button
              type="button"
              className="lp-menu"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav className="lp-mobile" aria-label="Mobile navigation">
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#subjects" onClick={closeMenu}>Concepts</a>
            <a href="#practice" onClick={closeMenu}>Practice</a>
          </nav>
        )}

        <section id="home" className="lp-hero">
          <div>
            <h1>Computer science, explained with code you can run.</h1>
            <p className="lp-lede">
              Read a clear explanation of an idea, change the code, and run it yourself.
              Your progress is saved to your account as you go.
            </p>
            <div className="lp-row">
              <button type="button" className="lp-btn lp-btn-lg" onClick={onSignup}>
                Create a free account <ArrowRight size={16} />
              </button>
              <a className="lp-btn-ghost" href="#subjects">Browse concepts</a>
            </div>
          </div>

          <figure className="lp-specimen" aria-label="Binary search code with a step-by-step trace">
            <pre className="lp-code"><code>{SEARCH_CODE}</code></pre>
            <table className="lp-trace">
              <caption>Searching for 23 in the sorted array 2, 5, 8, 12, 16, 23, 38, 56, 72, 91</caption>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">lo</th>
                  <th scope="col">hi</th>
                  <th scope="col">mid</th>
                  <th scope="col">a[mid]</th>
                  <th scope="col">What happens</th>
                </tr>
              </thead>
              <tbody>
                {TRACE.map((row) => (
                  <tr key={row.step} className={row.found ? 'lp-found' : undefined}>
                    <td>{row.step}</td>
                    <td>{row.lo}</td>
                    <td>{row.hi}</td>
                    <td>{row.mid}</td>
                    <td>{row.value}</td>
                    <td className="lp-note">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </section>

        <section id="how-it-works" className="lp-section">
          <h2>How a lesson works</h2>
          <div className="lp-flow">
            <p>Read the explanation first. Each concept is short enough to finish in one sitting, and every example is real code.</p>
            <p>Then open the playground and change something. Make the array longer, move the target, or break the loop on purpose, and watch what happens.</p>
            <p>When you are ready, run your own version in the compiler, or check yourself with a mock exam.</p>
          </div>
        </section>

        <section id="subjects" className="lp-section">
          <h2>What you can study</h2>
          <p className="lp-sub">Each topic starts with a plain explanation and ends with code you can change.</p>
          <ul className="lp-index">
            {STUDY_AREAS.map((area) => (
              <li key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="practice" className="lp-section">
          <h2>Practice in the same place</h2>
          <p className="lp-sub">Move from an explanation to a full coding session without losing your place.</p>
          <ul className="lp-index">
            {PRACTICE.map((tool) => (
              <li key={tool.title}>
                <h3>{tool.title}</h3>
                <p>{tool.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lp-section lp-close-section">
          <div className="lp-close">
            <div>
              <h2>Keep your place</h2>
              <p className="lp-sub">An account saves your progress, so you can pick up where you left off on any device.</p>
            </div>
            <div className="lp-row">
              <button type="button" className="lp-btn lp-btn-lg" onClick={onSignup}>Create a free account</button>
              <button type="button" className="lp-btn-ghost" onClick={onLogin}>Log in</button>
            </div>
          </div>
        </section>
      </div>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <span>Technical Resource Hub</span>
          <div className="lp-footer-links">
            <button type="button" onClick={onLogin}>Log in</button>
            <button type="button" onClick={onSignup}>Create account</button>
          </div>
        </div>
      </footer>
    </main>
  );
}
