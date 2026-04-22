import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const STEPS = {
  el: [
    { title: "Καλωσόρισες! 🎮", desc: "Αυτή είναι η εκπαιδευτική πλατφόρμα μας. Ας σου δείξουμε πώς λειτουργεί!", target: null },
    { title: "Επίλεξε Ηλικία 👶", desc: "Βρες τα παιχνίδια που ταιριάζουν στην ηλικία σου — από 2 ετών μέχρι ενήλικες.", target: "#categories" },
    { title: "350+ Παιχνίδια 🎯", desc: "Εξερεύνησε εκατοντάδες παιχνίδια: quiz, παζλ, επιτραπέζια και πολλά ακόμα.", target: "#games" },
    { title: "Πρόκληση Ημέρας 🔥", desc: "Κάθε μέρα μια νέα πρόκληση σε περιμένει! Κέρδισε XP και ανέβα επίπεδο.", target: null },
    { title: "Καλή διασκέδαση! 🏆", desc: "Ξεκίνα τώρα, κέρδισε badges, πιστοποιητικά και γίνε ο καλύτερος!", target: null },
  ],
  en: [
    { title: "Welcome! 🎮", desc: "This is our educational platform. Let us show you how it works!", target: null },
    { title: "Choose Age 👶", desc: "Find games that match your age — from 2 years old to adults.", target: "#categories" },
    { title: "350+ Games 🎯", desc: "Explore hundreds of games: quizzes, puzzles, board games and more.", target: "#games" },
    { title: "Daily Challenge 🔥", desc: "A new challenge awaits you every day! Earn XP and level up.", target: null },
    { title: "Have fun! 🏆", desc: "Start now, earn badges, certificates and become the best!", target: null },
  ],
};

export default function OnboardingTour() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const steps = STEPS[isEl ? "el" : "en"];

  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("geo:tourSeen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      const nextTarget = steps[step + 1]?.target;
      if (nextTarget) {
        document.querySelector(nextTarget)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("geo:tourSeen", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>

        <div className="px-8 py-8 text-center">
          <div className="text-5xl mb-4">{steps[step].title.split(" ").pop()}</div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-3">
            {steps[step].title.replace(/\s\S+$/, "")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {steps[step].desc}
          </p>

          <div className="flex gap-3 justify-center">
            <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {isEl ? "Παράλειψη" : "Skip"}
            </button>
            <button onClick={handleNext} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all hover:scale-[1.02]">
              {step < steps.length - 1 ? (isEl ? "Επόμενο →" : "Next →") : (isEl ? "Ξεκίνα!" : "Let's go!")}
            </button>
          </div>
        </div>

        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {step + 1} / {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
