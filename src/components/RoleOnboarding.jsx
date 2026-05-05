import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { FeatureFlagService } from "../services/FeatureFlagService";
import { AnalyticsService } from "../services/AnalyticsService";

/**
 * RoleOnboarding · Interactive 3-step tour shown after the FIRST login
 * for parents and teachers. Students already get the WelcomeQuest experience.
 *
 * Storage key per role+version → can be re-triggered via "+1" version bump
 * if we ever change the steps.
 */

const SCHEMA = 1;
const KEY = (role) => `kibloo:roleOnboarding:${role}:v${SCHEMA}`;

// ─── Tour content ─────────────────────────────────────────
const TOURS = {
  parent: {
    icon: "👨‍👩‍👧",
    title:        { el: "Καλωσόρισες, γονιέ!",                en: "Welcome, parent!" },
    subtitle:     { el: "3 γρήγορα βήματα για να ξεκινήσεις.",  en: "3 quick steps to get started." },
    steps: [
      {
        icon: "📊",
        title:  { el: "Πίνακας Γονέα",            en: "Parent Dashboard" },
        body:   {
          el: "Δες την πρόοδο των παιδιών σου, achievements, και χρόνο χρήσης. Όλα συγκεντρωμένα σε ένα μέρος.",
          en: "See your kids' progress, achievements, and time spent. Everything in one place.",
        },
        cta:    { el: "Άνοιξε τον Πίνακα",        en: "Open Dashboard" },
        link:   "/parent-dashboard",
      },
      {
        icon: "⏱️",
        title:  { el: "Έλεγχος Χρόνου Οθόνης",     en: "Screen Time Controls" },
        body:   {
          el: "Ορίζεις max λεπτά την ημέρα και επιτρεπόμενες ώρες. Όταν λήξει το όριο, η εφαρμογή σταματά ευγενικά.",
          en: "Set max minutes/day and allowed time windows. When time runs out, the app politely stops.",
        },
        cta:    { el: "Ρύθμισε Χρόνο",             en: "Configure" },
        link:   "/parent-dashboard?tab=screen-time",
      },
      {
        icon: "📧",
        title:  { el: "Εβδομαδιαία Αναφορά",       en: "Weekly Reports" },
        body:   {
          el: "Κάθε Κυριακή θα παίρνεις email με τα 3 strong και 3 weak themes της εβδομάδας, μαζί με συστάσεις.",
          en: "Every Sunday you'll receive an email with top 3 strengths and 3 weaknesses, plus recommendations.",
        },
        cta:    { el: "Ρύθμιση",                    en: "Set up" },
        link:   "/parent-dashboard?tab=reports",
      },
    ],
  },

  teacher: {
    icon: "👨‍🏫",
    title:        { el: "Καλωσόρισες, εκπαιδευτικέ!",        en: "Welcome, teacher!" },
    subtitle:     { el: "3 γρήγορα βήματα για να ξεκινήσεις.",  en: "3 quick steps to get started." },
    steps: [
      {
        icon: "🎓",
        title:  { el: "Δημιούργησε την πρώτη σου τάξη",  en: "Create your first class" },
        body:   {
          el: "Δώσε όνομα + ηλικιακή ομάδα. Παίρνεις κωδικό class και QR που δίνεις στους μαθητές σου.",
          en: "Pick a name and age group. You'll get a class code + QR for students to join.",
        },
        cta:    { el: "Νέα τάξη",                  en: "New class" },
        link:   "/teacher-dashboard?tab=classes",
      },
      {
        icon: "🎮",
        title:  { el: "Live Quiz (Kahoot-style)",  en: "Live Quiz (Kahoot-style)" },
        body:   {
          el: "Επίλεξε ή φτιάξε quiz, δείξε τον κωδικό στην οθόνη της τάξης, και παίξτε live με real-time leaderboard.",
          en: "Pick or build a quiz, show the join code on screen, and play live with a real-time leaderboard.",
        },
        cta:    { el: "Δες το Live Quiz",           en: "Open Live Quiz" },
        link:   "/teacher-dashboard?tab=live",
      },
      {
        icon: "🤖",
        title:  { el: "AI Quiz Generator",          en: "AI Quiz Generator" },
        body:   {
          el: "Δίνεις θέμα + ηλικία + δυσκολία → 10 ερωτήσεις σε 5 δευτερόλεπτα, στα Ελληνικά + Αγγλικά.",
          en: "Enter topic + age + difficulty → 10 questions in 5 seconds, in Greek + English.",
        },
        cta:    { el: "Δοκίμασε",                   en: "Try it" },
        link:   "/teacher/ai-lesson",
      },
    ],
  },
};

// ─── Storage helpers ─────────────────────────────────────
function loadState(role) {
  try {
    const raw = localStorage.getItem(KEY(role));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(role, state) {
  try {
    localStorage.setItem(KEY(role), JSON.stringify(state));
  } catch { /* storage full */ }
}

// ─── Component ───────────────────────────────────────────
export default function RoleOnboarding() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const L = lang === "el" ? "el" : "en";
  const { user, userRole } = useContext(AuthContext) || {};
  const location = useLocation();

  // Only parent/teacher tours — students get WelcomeQuest.
  const tour = useMemo(() => {
    if (!userRole) return null;
    if (userRole === "parent") return TOURS.parent;
    if (userRole === "teacher") return TOURS.teacher;
    return null;
  }, [userRole]);

  const [open, setOpen]       = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Decide whether to show the tour
  useEffect(() => {
    if (!tour || !user) return;
    if (!FeatureFlagService.isEnabled("roleOnboarding")) return;

    // Hide on auth/onboarding/admin pages
    const p = location.pathname;
    if (p.startsWith("/auth") || p.startsWith("/onboarding") || p.startsWith("/admin")) return;

    const state = loadState(userRole);
    if (state?.dismissed || state?.completed) return;

    // Small delay so UI mounts cleanly
    const timer = setTimeout(() => {
      setOpen(true);
      try { AnalyticsService.track?.("roleOnboarding_shown", { role: userRole }); } catch {}
    }, 1500);
    return () => clearTimeout(timer);
  }, [tour, user, userRole, location.pathname]);

  const close = (kind /* "dismiss" | "complete" */) => {
    setOpen(false);
    if (!userRole) return;
    saveState(userRole, {
      [kind]: true,
      finishedAt: Date.now(),
    });
    try { AnalyticsService.track?.(`roleOnboarding_${kind}`, { role: userRole, step: stepIdx }); } catch {}
  };

  if (!open || !tour) return null;

  const step = tour.steps[stepIdx];
  const total = tour.steps.length;
  const isLast = stepIdx === total - 1;
  const isFirst = stepIdx === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-onboarding-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white px-6 pt-6 pb-8 relative">
          <button
            type="button"
            onClick={() => close("dismissed")}
            aria-label={L === "el" ? "Κλείσιμο" : "Close"}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-lg leading-none transition"
          >
            ×
          </button>
          <div className="text-5xl mb-2" aria-hidden="true">{tour.icon}</div>
          <h2 id="role-onboarding-title" className="text-2xl font-extrabold">
            {tour.title[L]}
          </h2>
          <p className="text-sm text-white/90 mt-1">{tour.subtitle[L]}</p>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mt-4">
            {tour.steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIdx ? "w-8 bg-white" : i < stepIdx ? "w-4 bg-white/80" : "w-4 bg-white/30"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-auto text-xs font-semibold text-white/80">
              {stepIdx + 1} / {total}
            </span>
          </div>
        </div>

        {/* Step body */}
        <div className="px-6 py-6">
          <div className="text-4xl mb-3" aria-hidden="true">{step.icon}</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {step.title[L]}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.body[L]}
          </p>

          {step.link && (
            <Link
              to={step.link}
              onClick={() => {
                try { AnalyticsService.track?.("roleOnboarding_cta_clicked", { role: userRole, step: stepIdx }); } catch {}
                // CTA also advances/completes the tour
                if (isLast) close("completed");
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow transition"
            >
              {step.cta[L]}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Footer / nav */}
        <div className="px-6 pb-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => close("dismissed")}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium"
          >
            {L === "el" ? "Παράλειψη" : "Skip tour"}
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                ← {L === "el" ? "Πίσω" : "Back"}
              </button>
            )}
            {!isLast ? (
              <button
                type="button"
                onClick={() => setStepIdx((i) => Math.min(total - 1, i + 1))}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow active:scale-95 transition"
              >
                {L === "el" ? "Επόμενο" : "Next"} →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => close("completed")}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow active:scale-95 transition"
              >
                {L === "el" ? "Τέλος! 🎉" : "Done! 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// ─── Helper: replay tour for testing or "Show again" UX ──────
export function replayRoleOnboarding(role) {
  if (!role) return;
  try { localStorage.removeItem(KEY(role)); } catch {}
  // Force a reload so the auto-trigger picks it up.
  window.location.reload();
}
