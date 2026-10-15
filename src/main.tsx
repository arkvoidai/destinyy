// 1. Boot order: Import styles first
import './styles/tokens.css';
import './styles/globals.css';
import './styles/motion.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { siteConfig } from './config/site';
import { detectMotionMode, supportsScrollTimeline, markReady } from './lib/motion';
import { initSeoMetadata } from './lib/seo';

// 2. Motion mode detection, grain sync, scroll timeline check, and ready mark
if (typeof document !== 'undefined') {
  detectMotionMode();
  supportsScrollTimeline();
  initSeoMetadata();

  if (!siteConfig.motion.grain) {
    document.body.setAttribute('data-grain', 'false');
  }

  markReady();
}

// 3. Render App inside StrictMode and ErrorBoundary
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
