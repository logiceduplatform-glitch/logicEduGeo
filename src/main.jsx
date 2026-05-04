import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import { StorageService } from './services/StorageService';
import './services/ErrorReportingService';
import { hasConsent } from './components/CookieConsent';
import { ClarityService } from './services/ClarityService';
import { enableAnalytics } from './auth/firebase';
import './index.css';

try {
  const activeProfileId = localStorage.getItem("geo:activeProfileId");
  if (activeProfileId) {
    StorageService.setScope(activeProfileId);
  }
} catch { /* restricted env */ }

// Re-activate analytics on subsequent visits if consent was previously granted.
try {
  if (hasConsent("analytics")) {
    enableAnalytics();
    ClarityService.init();
  }
} catch { /* no-op */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
