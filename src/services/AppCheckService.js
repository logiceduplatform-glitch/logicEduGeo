/**
 * Firebase App Check — anti-abuse layer.
 *
 * Protects Firebase services (Firestore, Functions, Storage) against
 * abuse from non-app traffic (curl, bots, scrapers, malicious scripts).
 *
 * Setup:
 *   1. Firebase Console → App Check → Web app
 *   2. Register provider: reCAPTCHA v3 (free) or reCAPTCHA Enterprise (paid)
 *   3. Get the site key from the reCAPTCHA admin panel
 *   4. Whitelist your domain (incl. *.web.app)
 *   5. Add to .env:   VITE_RECAPTCHA_V3_SITE_KEY=<site-key>
 *   6. Optional: Set Enforce mode in Firestore/Storage when ready (start
 *      with monitoring-only to avoid breaking real users).
 *
 * Behaviour:
 *   - No site key → no-op (App Check disabled).
 *   - Disabled via Feature Flag "appcheck_enabled" → no-op.
 *   - DEV mode: uses debug token (set window.FIREBASE_APPCHECK_DEBUG_TOKEN).
 */

import { app } from "../auth/firebase";
import { FeatureFlagService } from "./FeatureFlagService";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY || "";

let initialized = false;
let appCheckRef = null;

export const AppCheckService = {
  /**
   * Initialise App Check. Safe to call multiple times.
   * Returns true if active, false otherwise.
   */
  async init() {
    if (initialized) return !!appCheckRef;
    initialized = true;

    if (!app) return false;
    if (!SITE_KEY) {
      if (import.meta.env.DEV) {
        console.warn("[AppCheck] VITE_RECAPTCHA_V3_SITE_KEY not set — App Check disabled.");
      }
      return false;
    }
    if (!FeatureFlagService.isEnabled("appcheck_enabled")) return false;

    // DEV: enable debug token (safe — only works on Firebase debug-token allowlist).
    if (import.meta.env.DEV && typeof self !== "undefined") {
      // Setting this var BEFORE initializeAppCheck instructs the SDK to use a
      // debug token instead of contacting reCAPTCHA. You then add the token
      // (printed in console) to the Firebase Console allowlist.
      // eslint-disable-next-line no-undef
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    try {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import("firebase/app-check");
      appCheckRef = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
      return true;
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[AppCheck] init failed:", e?.message);
      return false;
    }
  },

  isActive() { return !!appCheckRef; },
};

export default AppCheckService;
