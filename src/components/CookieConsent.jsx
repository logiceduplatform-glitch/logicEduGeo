import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { enableAnalytics } from "../auth/firebase";

const STORAGE_KEY = "edu:cookieConsent";

export default function CookieConsent() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    enableAnalytics();
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isEl ? "Συγκατάθεση cookies" : "Cookie consent"}
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-slide-up"
    >
      <div className="mx-auto max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="mr-2">🍪</span>
            {isEl
              ? "Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία της πλατφόρμας. Αν αποδεχτείτε, ενεργοποιούμε και analytics για τη βελτίωση της εμπειρίας σας. Κανένα cookie διαφήμισης."
              : "We use essential cookies for platform operation. If you accept, we also enable analytics to improve your experience. No advertising cookies."}
            {" "}
            <a
              href="/privacy"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              {isEl ? "Μάθε περισσότερα" : "Learn more"}
            </a>
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={reject}
            className="px-5 py-2.5 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {isEl ? "Μόνο απαραίτητα" : "Essential only"}
          </button>
          <button
            onClick={accept}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {isEl ? "Αποδοχή" : "Accept"}
          </button>
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
