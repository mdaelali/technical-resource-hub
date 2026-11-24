import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppRoot from './AppRoot.jsx';

// Apply the saved theme before the first paint so sign-in pages (which render
// outside the app shell) follow the same light/dark choice as the app.
try {
  const saved = window.localStorage.getItem('trh.theme.v2');
  document.documentElement.classList.add(saved === 'dark' ? 'dark' : 'light');
} catch {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </MotionConfig>
    <Analytics />
  </StrictMode>
);
