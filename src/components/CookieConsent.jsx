import React, { useState, useEffect, useContext, useCallback } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { enableAnalytics } from "../auth/firebase";
import { ClarityService } from "../services/ClarityService";

const STORAGE_KEY = "edu:cookieConsent";
const CONSENT_LOG_KEY = "edu:cookieConsentLog";
const CONSENT_VERSION = "2.0";

// Public helper so other modules can query consent without re-implementing.
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (raw === "accepted") return { necessary: true, analytics: true, marketing: false, version: "1.0" };
    if (raw === "rejected") return { necessary: true, analytics: false, marketing: false, version: "1.0" };
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasConsent(category) {
  const c = getCookieConsent();
  return !!(c && c[category]);
}

function logConsentEvent(consent) {
  try {
    const log = JSON.parse(localStorage.getItem(CONSENT_LOG_KEY) || "[]");
    log.push({
      ts: Date.now(),
      iso: new Date().toISOString(),
      consent,
      version: CONSENT_VERSION,
      userAgent: navigator.userAgent.slice(0, 200),
      url: window.location.pathname,
    });
    localStorage.setItem(CONSENT_LOG_KEY, JSON.stringify(log.slice(-20)));
  } catch {
    /* storage full */
  }
}

export default function CookieConsent() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    // Re-show banner if user has not consented OR if consent is from older version
    if (!consent || consent.version !== CONSENT_VERSION) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const persist = useCallback((p) => {
    const consent = { ...p, necessary: true, version: CONSENT_VERSION, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    logConsentEvent(consent);
    if (consent.analytics) {
      enableAnalytics();
      ClarityService.init();
    }
    setVisible(false);
  }, []);

  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => persist({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => persist(prefs);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEl ? "Συγκατάθεση cookies" : "Cookie consent"}
      className="fixed bottom-0 inset-x-0 z-[70] p-3 sm:p-6 animate-slide-up"
    >
      <div className="mx-auto max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">🍪</span>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              {isEl ? "Σεβόμαστε την ιδιωτικότητά σας" : "We value your privacy"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEl
                ? "Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σου. Μπορείς να επιλέξεις τι αποδέχεσαι. Κανένα cookie διαφήμισης τρίτων· τα δεδομένα παιδιών <13 προστατεύονται με αυστηρότερους κανόνες (COPPA)."
                : "We use cookies to improve your experience. You can choose what to accept. No third-party advertising cookies; data of children <13 is protected with stricter rules (COPPA)."}
              {" "}
              <a
                href="/privacy"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                {isEl ? "Πολιτική απορρήτου" : "Privacy policy"}
              </a>
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="mb-4 space-y-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3">
            <label className="flex items-start gap-3 p-2 rounded-lg cursor-not-allowed opacity-80">
              <input type="checkbox" checked disabled className="mt-1" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {isEl ? "Απαραίτητα" : "Necessary"} ({isEl ? "πάντα ενεργά" : "always on"})
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isEl
                    ? "Σύνδεση, ασφάλεια, αποθήκευση προόδου τοπικά."
                    : "Login, security, local progress saving."}
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {isEl ? "Αναλυτικά (Analytics)" : "Analytics"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isEl
                    ? "Ανώνυμα στατιστικά (Google Analytics) για βελτίωση παιχνιδιών."
                    : "Anonymous statistics (Google Analytics) to improve games."}
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {isEl ? "Marketing" : "Marketing"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isEl
                    ? "Newsletter & ειδοποιήσεις προσφορών (μόνο γονείς/εκπαιδευτικοί)."
                    : "Newsletter & offer notifications (parents/teachers only)."}
                </div>
              </div>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline self-start sm:self-center"
          >
            {showDetails
              ? (isEl ? "Απόκρυψη" : "Hide details")
              : (isEl ? "Προσαρμογή" : "Customize")}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={rejectAll}
              className="flex-1 sm:flex-initial px-4 py-2 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              {isEl ? "Μόνο απαραίτητα" : "Essential only"}
            </button>
            {showDetails ? (
              <button
                onClick={saveCustom}
                className="flex-1 sm:flex-initial px-5 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                {isEl ? "Αποθήκευση επιλογών" : "Save choices"}
              </button>
            ) : (
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-initial px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {isEl ? "Αποδοχή όλων" : "Accept all"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
