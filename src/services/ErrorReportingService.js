import { db } from "../auth/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { SentryService } from "./SentryService";

const ERROR_LOG_KEY = "geo:errorLog";
const MAX_LOG_SIZE = 50;
const REPORTING_URL = import.meta.env.VITE_ERROR_REPORTING_URL || "";

// Throttle: don't fire the same error message more than once per 60s.
const recentErrors = new Map();
const DEDUPE_WINDOW_MS = 60_000;

// Hard rate limit per session to avoid runaway logs eating Firestore quota.
const MAX_REMOTE_ERRORS_PER_SESSION = 25;
let remoteErrorsThisSession = 0;

// Patterns we never want to upload — typically third-party noise.
const IGNORED_PATTERNS = [
  /ResizeObserver loop/i,
  /Non-Error promise rejection captured/i,
  /Script error\.?$/,
  /chrome-extension:\/\//,
  /Loading chunk \d+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /NetworkError when attempting to fetch/i,
  /AbortError/,
];

function shouldIgnore(message) {
  if (!message) return true;
  return IGNORED_PATTERNS.some((p) => p.test(message));
}

function getSessionInfo() {
  return {
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    lang: document.documentElement.lang || "el",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    appVersion: import.meta.env.VITE_APP_VERSION || "dev",
    online: navigator.onLine,
  };
}

function getUserContext() {
  try {
    const profile = JSON.parse(localStorage.getItem("geo:userProfile") || "null");
    const guest = JSON.parse(localStorage.getItem("geo:guestProfile") || "null");
    return {
      role: profile?.role || (guest ? "guest" : "anonymous"),
      age: profile?.age || guest?.age || null,
      lang: localStorage.getItem("geo:lang") || "el",
    };
  } catch {
    return { role: "anonymous" };
  }
}

async function uploadToFirestore(entry) {
  if (remoteErrorsThisSession >= MAX_REMOTE_ERRORS_PER_SESSION) return;
  if (!db) return;
  if (import.meta.env.DEV) return;

  remoteErrorsThisSession += 1;
  try {
    await addDoc(collection(db, "errorReports"), {
      ...entry,
      serverTime: serverTimestamp(),
    });
  } catch {
    // never let error reporting itself throw
  }
}

export const ErrorReportingService = {
  captureException(error, context = {}) {
    const message = error?.message || String(error);
    if (shouldIgnore(message)) return;

    // Dedupe: same message within DEDUPE_WINDOW_MS is dropped.
    const now = Date.now();
    const lastSeen = recentErrors.get(message);
    if (lastSeen && now - lastSeen < DEDUPE_WINDOW_MS) return;
    recentErrors.set(message, now);
    if (recentErrors.size > 100) {
      // simple LRU-ish cleanup
      const oldest = [...recentErrors.entries()].sort((a, b) => a[1] - b[1])[0];
      if (oldest) recentErrors.delete(oldest[0]);
    }

    const entry = {
      message,
      stack: error?.stack?.slice(0, 2000),
      ...getSessionInfo(),
      ...getUserContext(),
      ...context,
    };

    // Local ring buffer for in-app debugging / admin log viewer.
    try {
      const log = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || "[]");
      log.push(entry);
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(log.slice(-MAX_LOG_SIZE)));
    } catch {
      /* storage full */
    }

    // Optional remote endpoint via beacon (for non-Firestore setups).
    if (REPORTING_URL) {
      try {
        const blob = new Blob([JSON.stringify(entry)], { type: "application/json" });
        navigator.sendBeacon(REPORTING_URL, blob);
      } catch {
        /* beacon failed */
      }
    }

    // Firestore upload (production only, rate-limited).
    uploadToFirestore(entry);

    // Sentry forwarding (no-op if Sentry is disabled or DSN missing).
    try { SentryService.captureException(error, context); } catch { /* never throw */ }

    if (import.meta.env.DEV) {
      console.error("[ErrorReporting]", entry.message, context);
    }
  },

  captureMessage(message, level = "warning", context = {}) {
    this.captureException(new Error(message), { level, ...context });
  },

  // Track non-fatal events that we still want to monitor (e.g. failed
  // network calls that the app gracefully recovers from).
  captureBreadcrumb(category, message, data = {}) {
    if (import.meta.env.DEV) {
      console.log(`[breadcrumb:${category}]`, message, data);
    }
  },

  getErrorLog() {
    try {
      return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || "[]");
    } catch {
      return [];
    }
  },

  clearErrorLog() {
    localStorage.removeItem(ERROR_LOG_KEY);
  },

  getSessionStats() {
    return {
      remoteErrorsThisSession,
      localLogSize: this.getErrorLog().length,
      dedupeCacheSize: recentErrors.size,
    };
  },

  // Test helper — wipes module-level state so each test starts fresh.
  // Not exported as a public API; do not use in production code.
  _resetForTests() {
    recentErrors.clear();
    remoteErrorsThisSession = 0;
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    ErrorReportingService.captureException(event.error || event.message, {
      source: "window.onerror",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    ErrorReportingService.captureException(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { source: "unhandledrejection" },
    );
  });
}
