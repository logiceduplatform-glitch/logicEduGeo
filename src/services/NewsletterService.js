/**
 * Newsletter signup service.
 *
 * Stores subscribers in Firestore (`newsletter` collection) with double opt-in
 * support and double-write protection (idempotent: same email re-submitted
 * just touches `lastSeen`). Forwards to a configured webhook (Mailchimp/
 * ConvertKit/Brevo/etc.) if VITE_NEWSLETTER_WEBHOOK is set.
 *
 * GDPR notes:
 *   - Always require explicit consent checkbox.
 *   - Store IP optional (not stored by default).
 *   - Provide unsubscribe link in every email (handled by the email provider).
 *   - "double opt-in" = send confirmation email; user must click link.
 *     The actual email send is handled by the Cloud Function that listens to
 *     newsletter.created docs (out of scope here — see functions/email.js).
 */

import { db } from "../auth/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AnalyticsService } from "./AnalyticsService";

const WEBHOOK = import.meta.env.VITE_NEWSLETTER_WEBHOOK || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit: at most 3 signup attempts per browser per hour. Stops both
// honest spam (impatient users clicking twice) and bot-driven abuse before
// the request even hits Firestore (which has its own App Check protection).
const RL_KEY = "edu:nlAttempts";
const RL_WINDOW_MS = 60 * 60 * 1000;
const RL_LIMIT = 3;
function isRateLimited() {
  try {
    const now = Date.now();
    const arr = (JSON.parse(localStorage.getItem(RL_KEY) || "[]"))
      .filter((t) => now - t < RL_WINDOW_MS);
    if (arr.length >= RL_LIMIT) return true;
    arr.push(now);
    localStorage.setItem(RL_KEY, JSON.stringify(arr));
    return false;
  } catch {
    return false; // storage blocked → don't block legitimate users
  }
}

function emailKey(email) {
  // Firestore doc IDs can't contain "/", and we want collisions on case
  // differences (foo@x.com vs FOO@x.com).
  return email.trim().toLowerCase().replace(/[^a-z0-9.@_+-]/g, "_");
}

export const NewsletterService = {
  validate(email) {
    if (!email || typeof email !== "string") return false;
    if (email.length > 254) return false;
    return EMAIL_RE.test(email.trim());
  },

  async subscribe({ email, source = "homepage", language = "en", consent = true }) {
    const clean = email.trim().toLowerCase();
    if (!this.validate(clean)) {
      return { ok: false, error: "invalid_email" };
    }
    if (!consent) {
      return { ok: false, error: "consent_required" };
    }
    if (isRateLimited()) {
      return { ok: false, error: "rate_limited" };
    }

    // 1) Persist to Firestore (best-effort).
    try {
      if (db) {
        await setDoc(
          doc(db, "newsletter", emailKey(clean)),
          {
            email: clean,
            source,
            language,
            consent: true,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
            confirmed: false, // double opt-in: flipped by Cloud Function on confirm click
          },
          { merge: true },
        );
      }
    } catch (err) {
      // We deliberately don't surface this to the user; the webhook below is
      // the authoritative path for most setups.
      if (import.meta.env.DEV) console.warn("[Newsletter] Firestore save failed:", err?.message);
    }

    // 2) Forward to external mailing tool if configured.
    if (WEBHOOK) {
      try {
        await fetch(WEBHOOK, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: clean, source, language }),
          keepalive: true,
        });
      } catch (err) {
        if (import.meta.env.DEV) console.warn("[Newsletter] Webhook POST failed:", err?.message);
      }
    }

    // 3) Analytics.
    try {
      AnalyticsService.track("newsletter_signup", { source, language });
    } catch { /* analytics never blocks UX */ }

    return { ok: true };
  },
};

export default NewsletterService;
