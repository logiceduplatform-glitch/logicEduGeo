import React from "react";
import { useNavigate } from "react-router-dom";
import { useFocusTrap } from "../hooks/useFocusTrap";

const FEATURES = {
  el: [
    "Ξεκλείδωμα όλων των παιχνιδιών",
    "Λεπτομερή στατιστικά & πιστοποιητικά",
    "Χωρίς περιορισμούς χρόνου",
    "Νέα παιχνίδια κάθε μήνα",
  ],
  en: [
    "Unlock all games",
    "Detailed stats & certificates",
    "No time limits",
    "New games every month",
  ],
};

export default function PaywallModal({ lang = "el", onClose }) {
  const navigate = useNavigate();
  const isEl = lang === "el";
  const features = FEATURES[isEl ? "el" : "en"];
  const trapRef = useFocusTrap(true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isEl ? "Αναβάθμιση σε Premium" : "Upgrade to Premium"}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === "Escape") onClose?.(); }}
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 px-8 py-8 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-1">
            {isEl ? "Ξεκλείδωσε Όλα!" : "Unlock Everything!"}
          </h2>
          <p className="text-white/80 text-sm">
            {isEl
              ? "Αναβάθμισε σε Premium για πλήρη πρόσβαση"
              : "Upgrade to Premium for full access"}
          </p>
        </div>

        {/* Features */}
        <div className="px-8 py-6">
          <ul className="space-y-3 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Price highlight */}
          <div className="text-center mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {isEl ? "Από" : "Starting at"}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white">
              2.99<span className="text-base font-medium text-slate-500 dark:text-slate-400">/{isEl ? "μήνα" : "mo"}</span>
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              onClose?.();
              navigate("/subscription");
            }}
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-300/30 dark:shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isEl ? "Δες τα πλάνα" : "See plans"}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-2.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isEl ? "Όχι τώρα" : "Not now"}
          </button>
        </div>

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
