import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppRoot from './AppRoot.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </MotionConfig>
  </StrictMode>
);
