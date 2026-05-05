import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { NewsletterService } from "../services/NewsletterService";

const T = {
  el: {
    eyebrow: "Newsletter",
    title: "Πάρε τις καλύτερες συμβουλές κάθε εβδομάδα",
    sub: "Παιδαγωγικά tips, νέα παιχνίδια & ειδικές προσφορές. Καμία spam, υπόσχεση. Διαγραφή με 1 click.",
    placeholder: "Email σου…",
    cta: "Εγγραφή",
    consent: "Συμφωνώ να λαμβάνω newsletter από την Kibloo. Μπορώ να διαγραφώ ανά πάσα στιγμή.",
    success: "🎉 Ευχαριστούμε! Στείλαμε email επιβεβαίωσης — έλεγξε τα εισερχόμενα.",
    invalid: "Παρακαλώ εισάγετε ένα έγκυρο email.",
    consentRequired: "Πρέπει να συμφωνήσεις πρώτα.",
    privacy: "Δες την Πολιτική Απορρήτου",
    sending: "Αποστολή…",
  },
  en: {
    eyebrow: "Newsletter",
    title: "Get the best parenting tips, weekly",
    sub: "Pedagogical tips, new games & special offers. No spam, ever. Unsubscribe in 1 click.",
    placeholder: "Your email…",
    cta: "Subscribe",
    consent: "I agree to receive newsletters from Kibloo. I can unsubscribe at any time.",
    success: "🎉 Thanks! We sent you a confirmation email — check your inbox.",
    invalid: "Please enter a valid email.",
    consentRequired: "You must agree first.",
    privacy: "View our Privacy Policy",
    sending: "Sending…",
  },
};

export default function NewsletterSignup() {
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
      source: "homepage",
      language: isEl ? "el" : "en",
      consent,
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setError(res.error === "invalid_email" ? l.invalid : l.consentRequired);
    }
  };

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
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-purple-400 dark:focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "sending" ? l.sending : `${l.cta} →`}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
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
