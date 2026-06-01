import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import { useAuth } from './auth/AuthContext.jsx';
import useStreak from './hooks/useStreak.js';
import './App.css';

const DocumentationViewer = lazy(() => import('./components/DocumentationViewer.jsx'));
const CodePlayground = lazy(() => import('./components/CodePlayground.jsx'));
const CodeCompiler = lazy(() => import('./components/CodeCompiler.jsx'));
const MockExams = lazy(() => import('./components/MockExams.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));

const PAGE_DWELL_MS = 2 * 60 * 1000;
const VALID_SECTIONS = new Set([
  'dashboard',
  'docs',
  'playground',
  'compiler',
  'exams',
  'progress',
  'profile'
]);

/* Hash routing — every page navigation pushes a real history entry, so the
   browser's back and forward buttons walk through visited sections. We use
   `#/section[/option]` rather than pathname routes so the app works without
   any server-side rewrite configuration. */

function parseHash(hash)
{
  const raw = (hash ?? window.location.hash ?? '').replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');
  if (!raw)
  {
    return { section: 'dashboard' };
  }
  const [section, ...rest] = raw.split('/');
  if (!VALID_SECTIONS.has(section))
  {
    return { section: 'dashboard' };
  }
  if (section === 'docs' && rest[0])
  {
    return { section: 'docs', categoryId: decodeURIComponent(rest[0]) };
  }
  if (section === 'playground' && rest[0])
  {
    return { section: 'playground', snippetId: decodeURIComponent(rest[0]) };
  }
  return { section };
}

function buildHash(target, options = {})
{
  if (target === 'docs' && options.categoryId)
  {
    return `#/docs/${encodeURIComponent(options.categoryId)}`;
  }
  if (target === 'playground' && options.snippetId)
  {
    return `#/playground/${encodeURIComponent(options.snippetId)}`;
  }
  return `#/${target}`;
}

export default function App()
{
  const { touchSession } = useAuth();
  const [, logActivity] = useStreak();

  const [route, setRoute] = useState(() => parseHash());
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dwellRef = useRef(null);
  const section = route.section;
  const docCategoryId = route.categoryId || null;
  const snippetId = route.snippetId || null;

  // Listen to hash changes (back/forward, manual hash edits, programmatic nav).
  useEffect(() =>
  {
    if (!window.location.hash || window.location.hash === '#')
    {
      window.history.replaceState(null, '', '#/dashboard');
      setRoute({ section: 'dashboard' });
    }
    function onHashChange()
    {
      setRoute(parseHash());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 2-minute dwell timer per page — restarts on section change.
  useEffect(() =>
  {
    if (dwellRef.current)
    {
      window.clearTimeout(dwellRef.current);
    }
    dwellRef.current = window.setTimeout(() =>
    {
      logActivity();
    }, PAGE_DWELL_MS);
    return () =>
    {
      if (dwellRef.current)
      {
        window.clearTimeout(dwellRef.current);
        dwellRef.current = null;
      }
    };
  }, [section, logActivity]);

  useEffect(() =>
  {
    touchSession();
  }, [section, touchSession]);

  const handleNavigate = useCallback((target, options = {}) =>
  {
    setMobileMenuOpen(false);
    if (!VALID_SECTIONS.has(target))
    {
      return;
    }
    const next = buildHash(target, options);
    if (next === window.location.hash)
    {
      return;
    }
    // Setting `location.hash` automatically pushes a history entry and fires
    // hashchange — that's what makes the browser back/forward arrows work.
    window.location.hash = next;
  }, []);

  const handleSearchChange = useCallback((value) =>
  {
    setSearchQuery(value);
    if (value && section !== 'docs')
    {
      window.location.hash = '#/docs';
    }
  }, [section]);

  function renderSection()
  {
    switch (section)
    {
      case 'docs':
        return (
          <DocumentationViewer
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
            initialCategoryId={docCategoryId}
            onLogActivity={logActivity}
          />
        );
      case 'playground':
        return <CodePlayground initialSnippetId={snippetId} />;
      case 'compiler':
        return <CodeCompiler onLogActivity={logActivity} />;
      case 'exams':
        return <MockExams onLogActivity={logActivity} />;
      case 'progress':
        return <ProgressTracker />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="h-[100dvh] w-screen flex p-2 md:p-2.5 gap-2 md:gap-2.5 overflow-hidden">
      <Sidebar
        active={section}
        onSelect={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col gap-2 md:gap-2.5 min-w-0">
        <Topbar
          section={section}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onNavigate={handleNavigate}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />

        <div className={`flex-1 min-h-0 ${section === 'compiler' ? 'overflow-hidden' : 'overflow-auto'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section + (section === 'docs' ? `:${docCategoryId || 'all'}` : '') + (section === 'playground' ? `:${snippetId || 'first'}` : '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={section === 'compiler' ? 'h-full' : 'min-h-full'}
            >
              <Suspense fallback={<SectionFallback />}>
                {renderSection()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SectionFallback()
{
  return (
    <div className="glass rounded-2xl p-6 grid place-items-center min-h-32">
      <div className="text-xs text-slate-400">Loading...</div>
    </div>
  );
}
