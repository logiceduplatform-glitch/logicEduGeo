/**
 * Customer support chat widget loader.
 *
 * Supports two providers; pick whichever you signed up for:
 *   - Crisp     — https://crisp.chat       (free tier: unlimited convos, 2 ops)
 *   - Tawk.to   — https://www.tawk.to      (100% free, unlimited)
 *
 * Setup:
 *   1. Create an account at the provider's website.
 *   2. Copy your website / property ID.
 *   3. Add to .env:
 *        VITE_SUPPORT_PROVIDER=crisp     # or "tawk"
 *        VITE_CRISP_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *        VITE_TAWK_PROPERTY_ID=yyyyyyyy
 *        VITE_TAWK_WIDGET_ID=default      # usually "default"
 *   4. Toggle "supportWidget" feature flag in Admin → Feature Flags.
 *
 * Behaviour:
 *   - No provider configured → no-op.
 *   - Disabled via Feature Flag "supportWidget" → no-op.
 *   - Lazy-loads the third-party script (no perf hit on initial page load).
 */

import { FeatureFlagService } from "./FeatureFlagService";

const PROVIDER = (import.meta.env.VITE_SUPPORT_PROVIDER || "").toLowerCase();
const CRISP_ID = import.meta.env.VITE_CRISP_WEBSITE_ID || "";
const TAWK_PROPERTY = import.meta.env.VITE_TAWK_PROPERTY_ID || "";
const TAWK_WIDGET = import.meta.env.VITE_TAWK_WIDGET_ID || "default";

let initialized = false;

function loadCrisp() {
  if (!CRISP_ID) return false;
  // Crisp boilerplate (https://help.crisp.chat/en/article/how-do-i-install-crisp-on-my-website-d6kqof/)
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = CRISP_ID;
  const s = document.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = 1;
  document.head.appendChild(s);
  return true;
}

function loadTawk() {
  if (!TAWK_PROPERTY) return false;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://embed.tawk.to/${TAWK_PROPERTY}/${TAWK_WIDGET}`;
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  document.head.appendChild(s);
  return true;
}

export const SupportWidgetService = {
  init() {
    if (initialized) return true;
    if (typeof window === "undefined") return false;
    if (!FeatureFlagService.isEnabled("supportWidget")) return false;
    if (!PROVIDER) return false;

    let ok = false;
    if (PROVIDER === "crisp") ok = loadCrisp();
    else if (PROVIDER === "tawk") ok = loadTawk();
    else if (import.meta.env.DEV) {
      console.warn(`[Support] Unknown provider "${PROVIDER}". Use "crisp" or "tawk".`);
    }
    initialized = ok;
    return ok;
  },

  /**
   * Identify the logged-in user to the chat widget so support agents see
   * who they're talking to. Call from AuthContext when user logs in.
   */
  identify({ uid, email, displayName, role }) {
    if (!initialized) return;
    try {
      if (PROVIDER === "crisp" && window.$crisp) {
        if (email)        window.$crisp.push(["set", "user:email", email]);
        if (displayName)  window.$crisp.push(["set", "user:nickname", displayName]);
        window.$crisp.push(["set", "session:data", [
          ["uid", uid || ""], ["role", role || "guest"],
        ]]);
      }
      if (PROVIDER === "tawk" && window.Tawk_API?.setAttributes) {
        window.Tawk_API.setAttributes({ name: displayName || "", email: email || "", uid, role }, () => {});
      }
    } catch { /* never throw from analytics */ }
  },

  isActive() { return initialized; },
};

export default SupportWidgetService;
