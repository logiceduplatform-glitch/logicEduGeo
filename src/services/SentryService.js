/**
 * Sentry integration — production-grade error tracking.
 *
 * Setup:
 *   1. Create free account at https://sentry.io (5K events/mo free).
 *   2. Create a "React" project; copy the DSN.
 *   3. Add to .env:    VITE_SENTRY_DSN=https://xxxx@sentry.io/123
 *   4. (Optional) VITE_SENTRY_ENV=production|staging|development
 *
 * Behaviour:
 *   - No DSN configured → completely no-op (zero overhead).
 *   - DEV mode → no-op (we don't want to spam Sentry from local dev).
 *   - Disabled via Feature Flag "sentry_enabled" → no-op.
 *   - Sample rates default to 100% errors / 10% performance traces.
 */

import { FeatureFlagService } from "./FeatureFlagService";

const DSN = import.meta.env.VITE_SENTRY_DSN || "";
const ENV = import.meta.env.VITE_SENTRY_ENV || (import.meta.env.PROD ? "production" : "development");
const RELEASE = import.meta.env.VITE_SENTRY_RELEASE || "kibloo@1.0.0";

let initialized = false;
let SentryRef = null;

function noop() { /* sentry disabled */ }

export const SentryService = {
  /**
   * Initialise Sentry. Safe to call multiple times. Returns true if active.
   */
  async init() {
    if (initialized) return !!SentryRef;
    if (!DSN || import.meta.env.DEV) return false;
    if (!FeatureFlagService.isEnabled("sentry_enabled")) return false;

    try {
      const Sentry = await import("@sentry/react");
      Sentry.init({
        dsn: DSN,
        environment: ENV,
        release: RELEASE,
        tracesSampleRate: 0.1,        // 10% performance traces
        replaysSessionSampleRate: 0.0,// no session replay by default (heavy)
        replaysOnErrorSampleRate: 1.0,// always replay sessions that hit an error (if Replay enabled)
        // Filter noise that's not actionable.
        ignoreErrors: [
          "ResizeObserver loop limit exceeded",
          "Non-Error promise rejection captured",
          "ChunkLoadError",            // user navigated mid-deploy; we already handle reload
          "Failed to fetch dynamically imported module",
          "NetworkError when attempting to fetch resource.",
        ],
        denyUrls: [
          /extensions\//i,
          /^chrome:\/\//i,
          /^moz-extension:\/\//i,
        ],
        beforeSend(event, hint) {
          // Strip PII just in case.
          if (event.user?.email) delete event.user.email;
          if (event.request?.headers) delete event.request.headers.Cookie;
          return event;
        },
      });
      SentryRef = Sentry;
      initialized = true;
      return true;
    } catch (e) {
      // Never let monitoring crash the app.
      return false;
    }
  },

  captureException(err, context = {}) {
    if (!SentryRef) return;
    try {
      SentryRef.captureException(err, { extra: context });
    } catch { noop(); }
  },

  captureMessage(message, level = "info", context = {}) {
    if (!SentryRef) return;
    try {
      SentryRef.captureMessage(message, { level, extra: context });
    } catch { noop(); }
  },

  setUser(user) {
    if (!SentryRef) return;
    try {
      // Only id + role; never PII.
      SentryRef.setUser(user ? { id: user.uid, role: user.role || "guest" } : null);
    } catch { noop(); }
  },

  setTag(key, value) {
    if (!SentryRef) return;
    try { SentryRef.setTag(key, value); } catch { noop(); }
  },

  addBreadcrumb(category, message, data = {}) {
    if (!SentryRef) return;
    try {
      SentryRef.addBreadcrumb({
        category, message, data, level: "info", timestamp: Date.now() / 1000,
      });
    } catch { noop(); }
  },

  isActive() { return !!SentryRef; },
};

export default SentryService;
