import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import {
  ageToQuizRoute,
  adultObjectiveRoutes,
  age2_3ObjectiveRoutes,
  age4_5ObjectiveRoutes,
  age6ObjectiveRoutes,
  age7_8ObjectiveRoutes,
  age9_10ObjectiveRoutes,
  age11_12ObjectiveRoutes,
} from "../config/quizRoutes";

const AGE_OPTIONS = [
  { key: "Age 2-3", icon: "👶", color: "from-rose-400 to-pink-500" },
  { key: "Age 4-5", icon: "🧒", color: "from-violet-400 to-purple-500" },
  { key: "Age 6", icon: "🎒", color: "from-blue-400 to-indigo-500" },
  { key: "Age 7-8", icon: "📖", color: "from-teal-400 to-emerald-500" },
  { key: "Age 9-10", icon: "🔬", color: "from-orange-400 to-amber-500" },
  { key: "Age 11–12", icon: "🎓", color: "from-indigo-400 to-violet-500" },
  { key: "Adult", icon: "🧠", color: "from-slate-400 to-slate-600" },
];

const KIDS_OBJECTIVES = [
  { key: "school", icon: "🏫", color: "from-blue-400 to-indigo-500" },
  { key: "fun", icon: "🎉", color: "from-pink-400 to-rose-500" },
  { key: "logic", icon: "🧩", color: "from-purple-400 to-violet-500" },
];

const ADULT_OBJECTIVES = [
  { key: "brain", icon: "🧠", color: "from-slate-400 to-slate-600" },
  { key: "fun", icon: "🎉", color: "from-pink-400 to-rose-500" },
  { key: "logic", icon: "🧩", color: "from-purple-400 to-violet-500" },
  { key: "board", icon: "♟️", color: "from-amber-500 to-orange-600" },
];

const TEXTS = {
  el: {
    step1Title: "Πόσο χρονών είσαι;",
    step1Sub: "Επίλεξε ηλικιακή ομάδα για να ξεκινήσεις",
    step2Title: "Τι θέλεις να κάνεις;",
    step2Sub: "Επίλεξε τον στόχο σου",
    school: "Προετοιμασία για σχολείο",
    fun: "Διασκέδαση & παιχνίδι",
    logic: "Λογική σκέψη",
    brain: "Εξάσκηση μυαλού",
    board: "Επιτραπέζια παιχνίδια",
    next: "Επόμενο",
    back: "Πίσω",
    start: "Ας παίξουμε!",
    guestBadge: "Λειτουργία Επισκέπτη",
    guestNote: "2 δωρεάν δοκιμές • 10 λεπτά",
    stepOf: "Βήμα",
    of: "από",
  },
  en: {
    step1Title: "How old are you?",
    step1Sub: "Pick your age group to get started",
    step2Title: "What do you want to do?",
    step2Sub: "Choose your goal",
    school: "Preparation for school",
    fun: "Fun & play",
    logic: "Logical thinking",
    brain: "Brain training",
    board: "Board games",
    next: "Next",
    back: "Back",
    start: "Let's play!",
    guestBadge: "Guest Mode",
    guestNote: "2 free tries • 10 minutes",
    stepOf: "Step",
    of: "of",
  },
};

export default function GuestSetup() {
  const { beginGuest } = useContext(AuthContext);
  const { t, lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const l = TEXTS[lang] || TEXTS.en;

  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [objective, setObjective] = useState("");

  const isAdult = age === "Adult";
  const objectives = isAdult ? ADULT_OBJECTIVES : KIDS_OBJECTIVES;

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const canNext =
    (step === 1 && age) ||
    (step === 2 && objective);

  const handleFinish = () => {
    beginGuest({ age, objective, minutes: 10, plays: 2 });

    if (age === "Adult") {
      navigate(adultObjectiveRoutes[objective] || "/play/adult-games");
      return;
    }

    if (age === "Age 2-3" && age2_3ObjectiveRoutes[objective]) {
      navigate(age2_3ObjectiveRoutes[objective]);
      return;
    }

    if (age === "Age 4-5" && age4_5ObjectiveRoutes[objective]) {
      navigate(age4_5ObjectiveRoutes[objective]);
      return;
    }

    if (age === "Age 6" && age6ObjectiveRoutes[objective]) {
      navigate(age6ObjectiveRoutes[objective]);
      return;
    }

    if (age === "Age 7-8" && age7_8ObjectiveRoutes[objective]) {
      navigate(age7_8ObjectiveRoutes[objective]);
      return;
    }

    if (age === "Age 9-10" && age9_10ObjectiveRoutes[objective]) {
      navigate(age9_10ObjectiveRoutes[objective]);
      return;
    }

    if (age === "Age 11–12" && age11_12ObjectiveRoutes[objective]) {
      navigate(age11_12ObjectiveRoutes[objective]);
      return;
    }

    const route = ageToQuizRoute[age] || "/play";
    navigate(route);
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <SEO title={l.guestBadge} />
      <div className="w-full max-w-lg">
        {/* Guest badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {l.guestBadge}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>{l.stepOf} {step} {l.of} {totalSteps}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{l.guestNote}</span>
          </div>
          <div className="h-2 bg-white/80 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">
              {step === 1 ? l.step1Title : l.step2Title}
            </h1>
            <p className="text-emerald-200 text-sm mt-1">
              {step === 1 ? l.step1Sub : l.step2Sub}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step 1: Age */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setAge(opt.key); setObjective(""); }}
                    className={`relative rounded-2xl p-4 border-2 transition-all duration-200 text-left ${
                      age === opt.key
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 scale-[1.02]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-xl mb-2 shadow-sm`}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t(opt.key, opt.key)}</span>
                    {age === opt.key && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Objective */}
            {step === 2 && (
              <div className="space-y-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.key}
                    onClick={() => setObjective(obj.key)}
                    className={`w-full rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
                      objective === obj.key
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 scale-[1.01]"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${obj.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                      {obj.icon}
                    </div>
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{l[obj.key]}</span>
                    {objective === obj.key && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                &larr; {l.back}
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                &larr; {l.back}
              </button>
            )}

            <button
              onClick={() => (step < totalSteps ? setStep(step + 1) : handleFinish())}
              disabled={!canNext}
              className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-300/40 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {step === totalSteps ? l.start : l.next}
              {step < totalSteps && <span>&rarr;</span>}
            </button>
          </div>
        </div>

        {/* Sign up nudge */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {lang === "el" ? "Θέλεις να αποθηκεύσεις την πρόοδό σου;" : "Want to save your progress?"}
          {" "}
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2"
          >
            {lang === "el" ? "Εγγράψου δωρεάν" : "Sign up free"}
          </button>
        </p>
      </div>
    </div>
  );
}
