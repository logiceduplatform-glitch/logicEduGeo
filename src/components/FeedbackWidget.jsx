import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const STORAGE_KEY = "kibloo:feedback:lastShown";
const SUBMITTED_KEY = "kibloo:feedback:submittedAt";
const DISMISS_KEY = "kibloo:feedback:dismissed";

// Don't pester: only show again 7 days after last submit/dismiss.
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const T = {
  el: {
    fab: "💬 Πες μας γνώμη σου",
    title: "Πώς είναι η εμπειρία σου;",
    subtitle: "Η γνώμη σου μας βοηθά να γίνουμε καλύτεροι!",
    placeholder: "Πες μας περισσότερα (προαιρετικό)...",
    send: "Στείλε",
    sending: "Αποστολή...",
    cancel: "Ακύρωση",
    thanks: "Ευχαριστούμε! 💚",
    thanksDesc: "Διαβάζουμε κάθε σχόλιο και βελτιωνόμαστε.",
    error: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    close: "Κλείσιμο",
    open: "Άνοιξε φόρμα γνώμης",
    scoreLabels: ["Χάλια", "Όχι καλά", "Ουδέτερο", "Καλά", "Τέλεια!"],
  },
  en: {
    fab: "💬 Send feedback",
    title: "How's your experience?",
    subtitle: "Your feedback helps us improve!",
    placeholder: "Tell us more (optional)...",
    send: "Send",
    sending: "Sending...",
    cancel: "Cancel",
    thanks: "Thank you! 💚",
    thanksDesc: "We read every comment and keep improving.",
    error: "Something went wrong. Please try again.",
    close: "Close",
    open: "Open feedback form",
    scoreLabels: ["Awful", "Bad", "Neutral", "Good", "Great!"],
  },
};

const EMOJI = ["😞", "😐", "🙂", "😍", "🤩"];

export default function FeedbackWidget() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const { user, userRole } = useContext(AuthContext) || {};
  const location = useLocation();

  const [showFab, setShowFab] = useState(false);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // Decide whether to show the FAB after some engagement.
  useEffect(() => {
    // Hide on auth/onboarding/admin pages
    if (location.pathname.startsWith("/auth")) return;
    if (location.pathname.startsWith("/onboarding")) return;
    if (location.pathname.startsWith("/admin")) return;

    // Cooldown after submit / dismiss
    const dismissed = parseInt(localStorage.getItem(DISMISS_KEY) || "0", 10);
    const submitted = parseInt(localStorage.getItem(SUBMITTED_KEY) || "0", 10);
    if (Date.now() - Math.max(dismissed, submitted) < COOLDOWN_MS) return;

    // Show after 30s on the page (gives user time to actually use the app)
    const timer = setTimeout(() => setShowFab(true), 30000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSubmit = useCallback(async () => {
    if (score === 0 || status === "sending") return;
    setStatus("sending");
    try {
      await addDoc(collection(db, "feedback"), {
        score,
        comment: (comment || "").slice(0, 1000),
        page: location.pathname,
        url: window.location.href.slice(0, 500),
        userAgent: (navigator.userAgent || "").slice(0, 200),
        lang,
        role: userRole || (user ? "authenticated" : "guest"),
        uid: user?.uid || null,
        createdAt: serverTimestamp(),
        clientTime: Date.now(),
      });
      localStorage.setItem(SUBMITTED_KEY, String(Date.now()));
      setStatus("sent");
      setTimeout(() => {
        setOpen(false);
        setShowFab(false);
        setScore(0);
        setComment("");
        setStatus("idle");
      }, 2200);
    } catch (e) {
      console.warn("Feedback submit failed", e);
      setStatus("error");
    }
  }, [score, comment, location.pathname, lang, userRole, user, status]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
    setShowFab(false);
  }, []);

  if (!showFab && !open) return null;

  return (
    <>
      {showFab && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={l.open}
          className="fixed bottom-4 right-4 z-[55] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          {l.fab}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
            aria-label={l.close}
            className="ml-1 -mr-1 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={l.title}
          className="fixed bottom-4 right-4 z-[60] w-[min(360px,calc(100vw-2rem))] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 animate-fade-in-up overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">{l.title}</div>
              <div className="text-xs opacity-90">{l.subtitle}</div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={l.close}
              className="text-white/80 hover:text-white text-xl leading-none w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-3">
            {status !== "sent" && (
              <>
                <div className="flex items-center justify-between gap-1">
                  {EMOJI.map((emo, i) => {
                    const value = i + 1;
                    const active = score === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setScore(value)}
                        aria-label={l.scoreLabels[i]}
                        title={l.scoreLabels[i]}
                        className={`flex-1 text-2xl py-2 rounded-lg transition-all ${
                          active
                            ? "bg-emerald-100 dark:bg-emerald-900/40 scale-110 ring-2 ring-emerald-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700/50 grayscale hover:grayscale-0"
                        }`}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>

                {score > 0 && (
                  <div className="text-center text-xs text-slate-600 dark:text-slate-400 -mt-1">
                    {l.scoreLabels[score - 1]}
                  </div>
                )}

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  placeholder={l.placeholder}
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />

                {status === "error" && (
                  <div className="text-xs text-rose-600 dark:text-rose-400">{l.error}</div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {l.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={score === 0 || status === "sending"}
                    className="flex-1 px-3 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                  >
                    {status === "sending" ? l.sending : l.send}
                  </button>
                </div>
              </>
            )}

            {status === "sent" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-bold text-emerald-700 dark:text-emerald-300">{l.thanks}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{l.thanksDesc}</div>
              </div>
            )}
          </div>

          <style>{`
            @keyframes fade-in-up {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
          `}</style>
        </div>
      )}
    </>
  );
}
