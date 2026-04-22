import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import { StorageService } from './services/StorageService';
import './services/ErrorReportingService';
import './index.css';

try {
  const activeProfileId = localStorage.getItem("geo:activeProfileId");
  if (activeProfileId) {
    StorageService.setScope(activeProfileId);
  }
} catch { /* restricted env */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
