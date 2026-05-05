import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import { StorageService } from './services/StorageService';
import './services/ErrorReportingService';
import { hasConsent } from './components/CookieConsent';
import { ClarityService } from './services/ClarityService';
import { enableAnalytics } from './auth/firebase';
import { FeatureFlagService } from './services/FeatureFlagService';
import { SentryService } from './services/SentryService';
import { AppCheckService } from './services/AppCheckService';

// Initialise error tracking ASAP so we capture early errors too.
SentryService.init();
// Anti-abuse layer for Firebase services. No-op if site key isn't configured.
AppCheckService.init();
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
    if (FeatureFlagService.isEnabled("analytics_clarity")) {
      ClarityService.init();
    }
  }
} catch { /* no-op */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
