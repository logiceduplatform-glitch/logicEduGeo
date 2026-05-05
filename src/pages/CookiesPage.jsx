import React, { useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LEGAL_INFO as L } from "../config/legalInfo";

/**
 * Public cookie policy page. Lists every cookie we set, its purpose, lifetime,
 * provider and category, plus a button to open the cookie preferences again.
 */

const STORAGE_KEY = "geo:cookieConsent";

const COOKIES = [
  // ─── Strictly necessary ──────────────────────────────
  {
    name: "geo:cookieConsent",
    category: "necessary",
    purpose: { el: "Αποθηκεύει τις επιλογές σας για cookies ώστε να μη βλέπετε ξανά το banner.", en: "Stores your cookie preferences so the banner doesn't show again." },
    lifetime: { el: "12 μήνες", en: "12 months" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "geo:lang",
    category: "necessary",
    purpose: { el: "Αποθηκεύει την επιλεγμένη γλώσσα (Ελληνικά / Αγγλικά).", en: "Stores selected interface language (Greek / English)." },
    lifetime: { el: "Μόνιμο μέχρι αλλαγή", en: "Persistent until changed" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "geo:theme",
    category: "necessary",
    purpose: { el: "Αποθηκεύει την επιλογή σκούρου / ανοιχτού θέματος.", en: "Stores dark / light theme selection." },
    lifetime: { el: "Μόνιμο μέχρι αλλαγή", en: "Persistent until changed" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "geo:activeProfileId",
    category: "necessary",
    purpose: { el: "Αναγνωρίζει το ενεργό προφίλ παιδιού στη συσκευή.", en: "Identifies the active child profile on this device." },
    lifetime: { el: "Έως αποσύνδεση", en: "Until logout" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "firebase:authUser:* ",
    category: "necessary",
    purpose: { el: "Σύνδεση χρήστη μέσω Firebase Authentication.", en: "User authentication via Firebase Auth." },
    lifetime: { el: "Έως αποσύνδεση", en: "Until logout" },
    provider: "Google Firebase",
  },
  // ─── Functional ──────────────────────────────────────
  {
    name: "gameRewards:*",
    category: "functional",
    purpose: { el: "Παρακολουθεί την πρόοδο και τα coins ανά παιχνίδι.", en: "Tracks per-game progress and coin rewards." },
    lifetime: { el: "Μόνιμο", en: "Persistent" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "tip:seen:*",
    category: "functional",
    purpose: { el: "Θυμάται ποιες οδηγίες παιχνιδιών έχετε δει.", en: "Remembers which game tutorials you've seen." },
    lifetime: { el: "Μόνιμο", en: "Persistent" },
    provider: "Kibloo (1st party)",
  },
  {
    name: "kibloo:welcomeQuest:v1",
    category: "functional",
    purpose: { el: "Παρακολουθεί την πρόοδο του Welcome Quest.", en: "Tracks Welcome Quest onboarding progress." },
    lifetime: { el: "Μόνιμο", en: "Persistent" },
    provider: "Kibloo (1st party)",
  },
  // ─── Analytics ───────────────────────────────────────
  {
    name: "_ga, _ga_*, _gid",
    category: "analytics",
    purpose: { el: "Google Analytics — ανώνυμη μέτρηση επισκεψιμότητας.", en: "Google Analytics — anonymous traffic measurement." },
    lifetime: { el: "Έως 2 χρόνια", en: "Up to 2 years" },
    provider: "Google Firebase Analytics",
  },
  {
    name: "_clck, _clsk",
    category: "analytics",
    purpose: { el: "Microsoft Clarity — heatmaps και session recordings (ανώνυμα).", en: "Microsoft Clarity — heatmaps and session recordings (anonymous)." },
    lifetime: { el: "1 χρόνο", en: "1 year" },
    provider: "Microsoft",
  },
  // ─── Marketing ───────────────────────────────────────
  // We currently don't use any marketing cookies.
];

const CONTENT = {
  el: {
    title: "Πολιτική Cookies",
    intro: `Η ${L.brand} χρησιμοποιεί cookies και παρόμοιες τεχνολογίες (localStorage, sessionStorage, IndexedDB) για να λειτουργεί η πλατφόρμα και να βελτιώνεται η εμπειρία σας. Αυτή η σελίδα εξηγεί τι είναι, πού χρησιμοποιούνται και πώς μπορείτε να τα ελέγξετε.`,
    updated: `Τελευταία ενημέρωση: ${L.policyUpdated}`,
    sections: [
      {
        h: "1. Τι είναι τα cookies;",
        body: "Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας από έναν ιστότοπο. Χρησιμοποιούνται για να θυμάται ο ιστότοπος προτιμήσεις σας, να σας αναγνωρίζει στις επόμενες επισκέψεις και να μετρά τη χρήση. Στην πλατφόρμα μας χρησιμοποιούμε επίσης localStorage και sessionStorage που λειτουργούν παρόμοια αλλά αποθηκεύονται μόνιμα ή ανά session αντίστοιχα.",
      },
      {
        h: "2. Νομική βάση",
        body: "Η χρήση των cookies διέπεται από τον ευρωπαϊκό κανονισμό ePrivacy (Οδηγία 2002/58/ΕΚ) και τον GDPR. Για τα μη απαραίτητα cookies (analytics, marketing) χρειαζόμαστε τη ρητή συγκατάθεσή σας. Τα απαραίτητα cookies (login, γλώσσα κ.λπ.) δεν απαιτούν συγκατάθεση γιατί χωρίς αυτά η πλατφόρμα δεν μπορεί να λειτουργήσει.",
      },
      {
        h: "3. Κατηγορίες cookies",
        body: `🔒 ΑΠΑΡΑΙΤΗΤΑ — Πάντα ενεργά. Λειτουργία πλατφόρμας (login, γλώσσα, θέμα).\n⚙️ ΛΕΙΤΟΥΡΓΙΚΑ — Με συγκατάθεση. Πρόοδος παιχνιδιών, achievements, οδηγίες.\n📊 ANALYTICS — Με συγκατάθεση. Ανώνυμη μέτρηση χρήσης για βελτιώσεις.\n📣 ΔΙΑΦΗΜΙΣΤΙΚΑ — Δεν χρησιμοποιούμε.`,
      },
      {
        h: "4. Τρίτα μέρη",
        body: `Ορισμένα cookies τοποθετούνται από τρίτους παρόχους:\n\n• Google Firebase (Authentication, Analytics) — ΗΠΑ/ΕΕ — SCCs\n• Microsoft Clarity (heatmaps, session recordings) — ΗΠΑ — SCCs\n• Stripe (πληρωμές) — μόνο κατά τη διαδικασία πληρωμής\n\nΌλοι οι πάροχοι συμμορφώνονται με GDPR.`,
      },
      {
        h: "5. Πώς να ελέγξετε τα cookies",
        body: `Έχετε πλήρη έλεγχο:\n\n• Πατήστε το κουμπί "Διαχείριση προτιμήσεων" παρακάτω για να αλλάξετε τις επιλογές σας.\n• Από τις ρυθμίσεις του browser σας μπορείτε να αποκλείσετε ή να διαγράψετε όλα τα cookies (μπορεί να σπάσει η λειτουργία).\n• Για localStorage: από τα Developer Tools (Application → Local Storage).\n\nΑνάκληση συγκατάθεσης είναι δυνατή ανά πάσα στιγμή.`,
      },
    ],
    table: { name: "Όνομα", category: "Κατηγορία", purpose: "Σκοπός", lifetime: "Διάρκεια", provider: "Πάροχος" },
    cats: { necessary: "🔒 Απαραίτητο", functional: "⚙️ Λειτουργικό", analytics: "📊 Analytics", marketing: "📣 Marketing" },
    contact: `Ερωτήσεις: ${L.emailPrivacy}`,
    manage: "🍪 Διαχείριση προτιμήσεων cookies",
    cleared: "✅ Οι προτιμήσεις σας μηδενίστηκαν. Ανανεώστε τη σελίδα για να εμφανιστεί ξανά το banner.",
  },
  en: {
    title: "Cookie Policy",
    intro: `${L.brand} uses cookies and similar technologies (localStorage, sessionStorage, IndexedDB) to make the platform work and improve your experience. This page explains what they are, where they are used and how to control them.`,
    updated: `Last updated: ${L.policyUpdated}`,
    sections: [
      {
        h: "1. What are cookies?",
        body: "Cookies are small text files stored on your device by a website. They remember preferences, recognise you on return visits and measure usage. We also use localStorage and sessionStorage which behave similarly but persist longer or per session, respectively.",
      },
      {
        h: "2. Legal basis",
        body: "Cookie use is governed by the EU ePrivacy directive (2002/58/EC) and GDPR. Non-essential cookies (analytics, marketing) require your explicit consent. Strictly necessary cookies (login, language, etc.) don't require consent as the platform cannot function without them.",
      },
      {
        h: "3. Cookie categories",
        body: `🔒 STRICTLY NECESSARY — Always on. Platform operation (login, language, theme).\n⚙️ FUNCTIONAL — With consent. Game progress, achievements, tutorials.\n📊 ANALYTICS — With consent. Anonymous usage measurement for improvements.\n📣 ADVERTISING — We don't use any.`,
      },
      {
        h: "4. Third parties",
        body: `Some cookies are placed by third-party providers:\n\n• Google Firebase (Authentication, Analytics) — US/EU — SCCs\n• Microsoft Clarity (heatmaps, session recordings) — US — SCCs\n• Stripe (payments) — only during checkout\n\nAll providers are GDPR-compliant.`,
      },
      {
        h: "5. How to control cookies",
        body: `You're in full control:\n\n• Click "Manage preferences" below to change your choices.\n• In your browser settings you can block or delete all cookies (may break functionality).\n• For localStorage: via Developer Tools (Application → Local Storage).\n\nWithdrawing consent is possible at any time.`,
      },
    ],
    table: { name: "Name", category: "Category", purpose: "Purpose", lifetime: "Lifetime", provider: "Provider" },
    cats: { necessary: "🔒 Necessary", functional: "⚙️ Functional", analytics: "📊 Analytics", marketing: "📣 Marketing" },
    contact: `Questions: ${L.emailPrivacy}`,
    manage: "🍪 Manage cookie preferences",
    cleared: "✅ Your preferences have been reset. Reload the page to see the banner again.",
  },
};

export default function CookiesPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const c = CONTENT[lang === "el" ? "el" : "en"];
  const [cleared, setCleared] = useState(false);

  const reopen = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setCleared(true);
  }, []);

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={c.title} description={c.intro} canonical="/cookies" />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1"
          >
            &larr; {lang === "el" ? "Πίσω" : "Back"}
          </button>

          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{c.title}</h1>
          <p className="text-sm text-slate-400 mb-3">{c.updated}</p>
          <p className="text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">{c.intro}</p>

          <div className="space-y-6 mb-10">
            {c.sections.map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">{s.h}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">{s.body}</div>
              </div>
            ))}
          </div>

          {/* Cookie inventory table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-10 overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
              {lang === "el" ? "📋 Πλήρης λίστα cookies" : "📋 Full cookie inventory"}
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-left text-slate-700 dark:text-slate-300">
                  <th className="py-2 pr-3 font-semibold">{c.table.name}</th>
                  <th className="py-2 pr-3 font-semibold">{c.table.category}</th>
                  <th className="py-2 pr-3 font-semibold">{c.table.purpose}</th>
                  <th className="py-2 pr-3 font-semibold whitespace-nowrap">{c.table.lifetime}</th>
                  <th className="py-2 pr-3 font-semibold">{c.table.provider}</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-400">
                {COOKIES.map((ck, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 align-top">
                    <td className="py-2 pr-3 font-mono text-xs text-purple-700 dark:text-purple-300 break-all">{ck.name}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{c.cats[ck.category]}</td>
                    <td className="py-2 pr-3">{ck.purpose[lang] || ck.purpose.en}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{ck.lifetime[lang] || ck.lifetime.en}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-xs">{ck.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reopen consent */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200 dark:border-purple-800 text-center">
            <button
              onClick={reopen}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl"
            >
              {c.manage}
            </button>
            {cleared && (
              <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300 font-semibold">{c.cleared}</p>
            )}
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">{c.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
