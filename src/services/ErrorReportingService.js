const ERROR_LOG_KEY = "geo:errorLog";
const MAX_LOG_SIZE = 50;
const REPORTING_URL = import.meta.env.VITE_ERROR_REPORTING_URL || "";

function getSessionInfo() {
  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    lang: document.documentElement.lang || "el",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}

export const ErrorReportingService = {
  captureException(error, context = {}) {
    const entry = {
      message: error?.message || String(error),
      stack: error?.stack?.slice(0, 1000),
      ...getSessionInfo(),
      ...context,
    };

    try {
      const log = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || "[]");
      log.push(entry);
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(log.slice(-MAX_LOG_SIZE)));
    } catch (_) { /* storage full */ }

    if (REPORTING_URL) {
      try {
        const blob = new Blob([JSON.stringify(entry)], { type: "application/json" });
        navigator.sendBeacon(REPORTING_URL, blob);
      } catch (_) { /* beacon failed */ }
    }

    if (import.meta.env.DEV) {
      console.error("[ErrorReporting]", entry.message, context);
    }
  },

  captureMessage(message, level = "warning", context = {}) {
    this.captureException(new Error(message), { level, ...context });
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
      { source: "unhandledrejection" }
    );
  });
}
