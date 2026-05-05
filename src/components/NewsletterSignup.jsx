import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { NewsletterService } from "../services/NewsletterService";

/**
 * Newsletter signup form.
 *
 * Three visual variants:
 *   - "hero"   (default): full-width gradient panel for marketing pages
 *   - "footer" (compact dark): single column inside the footer's "Stay updated"
 *   - "inline" (compact light): for mid-page CTAs (e.g. blog post bottom)
 */

const T = {
  el: {
    eyebrow: "Newsletter",
    title: "Πάρε τις καλύτερες συμβουλές κάθε εβδομάδα",
    sub: "Παιδαγωγικά tips, νέα παιχνίδια & ειδικές προσφορές. Καμία spam, υπόσχεση. Διαγραφή με 1 click.",
    placeholder: "Email σου…",
    cta: "Εγγραφή",
    consent: "Συμφωνώ να λαμβάνω newsletter από την Kibloo. Μπορώ να διαγραφώ ανά πάσα στιγμή.",
    consentShort: "Συμφωνώ να λαμβάνω email από την Kibloo.",
    success: "🎉 Ευχαριστούμε! Έλεγξε τα εισερχόμενα.",
    invalid: "Μη έγκυρο email.",
    consentRequired: "Πρέπει να συμφωνήσεις πρώτα.",
    rateLimited: "Πάρα πολλές προσπάθειες. Δοκίμασε αργότερα.",
    privacy: "Πολιτική Απορρήτου",
    sending: "…",
  },
  en: {
    eyebrow: "Newsletter",
    title: "Get the best parenting tips, weekly",
    sub: "Pedagogical tips, new games & special offers. No spam, ever. Unsubscribe in 1 click.",
    placeholder: "Your email…",
    cta: "Subscribe",
    consent: "I agree to receive newsletters from Kibloo. I can unsubscribe at any time.",
    consentShort: "I agree to receive emails from Kibloo.",
    success: "🎉 Thanks! Check your inbox.",
    invalid: "Invalid email.",
    consentRequired: "You must agree first.",
    rateLimited: "Too many attempts. Try again later.",
    privacy: "Privacy Policy",
    sending: "…",
  },
};

export default function NewsletterSignup({ variant = "hero", source = "homepage" }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const l = T[isEl ? "el" : "en"];

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!NewsletterService.validate(email)) {
      setError(l.invalid);
      setStatus("error");
      return;
    }
    if (!consent) {
      setError(l.consentRequired);
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await NewsletterService.subscribe({
      email,
      source,
      language: isEl ? "el" : "en",
      consent,
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setError(
        res.error === "invalid_email"  ? l.invalid :
        res.error === "rate_limited"   ? l.rateLimited :
                                         l.consentRequired,
      );
    }
  };

  // ─── Footer variant (compact, lives in dark footer column) ────────────
  if (variant === "footer") {
    if (status === "success") {
      return (
        <div className="text-emerald-400 text-sm font-medium" role="status">
          {l.success}
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmit} className="space-y-2" aria-label={l.eyebrow}>
        <div className="relative">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={l.placeholder}
            aria-label={l.placeholder}
            className="w-full pl-3 pr-3 py-2.5 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-3 py-2.5 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow disabled:opacity-50 transition-all"
        >
          {status === "sending" ? l.sending : `${l.cta} →`}
        </button>
        <label className="flex items-start gap-2 text-[11px] leading-snug text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 shrink-0"
          />
          <span>
            {l.consentShort}{" "}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">
              {l.privacy}
            </a>
          </span>
        </label>
        {error && (
          <div className="text-rose-400 text-xs" role="alert">{error}</div>
        )}
      </form>
    );
  }

  // ─── Inline variant (compact, light, for mid-page placements) ─────────
  if (variant === "inline") {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <div className="font-bold text-slate-800 dark:text-white mb-1">✉️ {l.title}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{l.sub}</p>
        {status === "success" ? (
          <div className="text-emerald-600 dark:text-emerald-400 text-sm">{l.success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={l.placeholder}
                aria-label={l.placeholder}
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold disabled:opacity-50 whitespace-nowrap"
              >
                {l.cta}
              </button>
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 shrink-0" />
              <span>{l.consentShort}</span>
            </label>
            {error && <div className="text-rose-600 dark:text-rose-400 text-xs" role="alert">{error}</div>}
          </form>
        )}
      </div>
    );
  }

  // ─── Hero variant (default, full marketing panel) ─────────────────────
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 p-1 shadow-2xl">
          <div className="rounded-[22px] bg-white dark:bg-slate-900 p-8 sm:p-10">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-widest uppercase mb-3">
                ✉️ {l.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                {l.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                {l.sub}
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{l.success}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={l.placeholder}
                    aria-label={l.placeholder}
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-purple-400 dark:focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                  >
                    {status === "sending" ? l.sending : `${l.cta} →`}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 shrink-0"
                  />
                  <span>
                    {l.consent}{" "}
                    <a href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                      {l.privacy}
                    </a>
                  </span>
                </label>

                {error && (
                  <div className="text-rose-600 dark:text-rose-400 text-sm font-medium" role="alert">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
