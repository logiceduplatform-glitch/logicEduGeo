// Microsoft Clarity integration.
//
// Free, privacy-first session recording / heatmap / rage-click analytics.
// Loaded ASYNC and ONLY after the user grants analytics consent (GDPR/COPPA).
//
// Setup:
//   1) Get Project ID from https://clarity.microsoft.com
//   2) Set VITE_CLARITY_PROJECT_ID in your .env / Firebase env
//   3) Done — initClarity() runs automatically once consent is granted
//
// The script is injected AFTER cookie consent (analytics=true) and never
// before. We also expose tag/identify helpers so other parts of the app
// can enrich sessions (e.g. role, locale, A/B variant).

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || "";
let initialised = false;

function injectScript(projectId) {
  if (typeof window === "undefined") return;
  if (window.clarity) return; // already loaded
  // Standard Clarity snippet (async).
  // eslint-disable-next-line
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
}

export const ClarityService = {
  /**
   * Initialise Clarity. Safe to call multiple times — only runs once.
   * Requires analytics consent + a configured project ID.
   */
  init() {
    if (initialised) return false;
    if (!PROJECT_ID) {
      // Silent no-op in development if project ID is not set.
      return false;
    }
    try {
      injectScript(PROJECT_ID);
      initialised = true;
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Tag the current session with custom dimensions (e.g. role, locale).
   * Useful for filtering recordings in the Clarity dashboard.
   */
  set(key, value) {
    try {
      if (window.clarity && typeof window.clarity === "function") {
        window.clarity("set", String(key), String(value));
      }
    } catch {
      /* no-op */
    }
  },

  /**
   * Associate the recording with a stable user identifier (hashed UID).
   * NEVER pass raw email / PII — Clarity will hash but we play safe.
   */
  identify(userId, customId, customSessionId, friendlyName) {
    try {
      if (window.clarity && typeof window.clarity === "function") {
        window.clarity("identify", userId, customId, customSessionId, friendlyName);
      }
    } catch {
      /* no-op */
    }
  },

  /**
   * Fire a custom event (e.g. "trial_started") to mark important moments
   * in the recording timeline.
   */
  event(name) {
    try {
      if (window.clarity && typeof window.clarity === "function") {
        window.clarity("event", String(name));
      }
    } catch {
      /* no-op */
    }
  },

  /**
   * Mark a session as "important" so it survives Clarity's sampling.
   */
  upgrade(reason = "important") {
    try {
      if (window.clarity && typeof window.clarity === "function") {
        window.clarity("upgrade", String(reason));
      }
    } catch {
      /* no-op */
    }
  },

  isInitialised() {
    return initialised;
  },
};

export default ClarityService;
