import React, { useState, useRef, useEffect } from "react";
import { useProgress } from "../contexts/ProgressContext";

const LEVEL_TITLES = {
  el: ["Αρχάριος", "Μαθητής", "Εξερευνητής", "Ειδικός", "Μάστερ", "Θρύλος", "Ήρωας", "Τιτάνας", "Ολύμπιος", "Θεός"],
  en: ["Beginner", "Learner", "Explorer", "Expert", "Master", "Legend", "Hero", "Titan", "Olympian", "God"],
};

const LEVEL_COLORS = [
  "from-slate-400 to-slate-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-red-500 to-orange-600",
  "from-indigo-500 to-purple-600",
  "from-amber-500 to-yellow-400",
  "from-fuchsia-500 to-pink-600",
];

const TOOLTIP_TEXT = {
  el: "Κέρδισε XP παίζοντας παιχνίδια. Κάθε σωστή απάντηση σου δίνει πόντους. Ανέβα level και ξεκλείδωσε νέους τίτλους!",
  en: "Earn XP by playing games. Each correct answer gives you points. Level up and unlock new titles!",
};

function XPTooltip({ show, lang, xpForNext, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [show, onClose]);

  if (!show) return null;
  const isEl = lang === "el";

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 text-left"
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700" />
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {TOOLTIP_TEXT[lang] || TOOLTIP_TEXT.en}
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
        {isEl ? `Επόμενο level: ${xpForNext} XP` : `Next level: ${xpForNext} XP`}
      </p>
    </div>
  );
}

export default function XPLevelBadge({ lang = "el", size = "md" }) {
  const progress = useProgress();
  const { totalXP, level } = progress.getXP();
  const xpProgress = progress.getXPProgress();
  const titleIdx = Math.min(level - 1, 9);
  const isEl = lang === "el";
  const title = (isEl ? LEVEL_TITLES.el : LEVEL_TITLES.en)[titleIdx];
  const gradient = LEVEL_COLORS[titleIdx];
  const xpForNext = level * level * 50;

  const [showTooltip, setShowTooltip] = useState(false);

  if (size === "sm") {
    return (
      <span
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-bold shadow-md cursor-pointer`}
        onClick={() => setShowTooltip((v) => !v)}
        title={TOOLTIP_TEXT[lang] || TOOLTIP_TEXT.en}
      >
        <span>⚡</span> Lv.{level}
        <XPTooltip show={showTooltip} lang={lang} xpForNext={xpForNext} onClose={() => setShowTooltip(false)} />
      </span>
    );
  }

  return (
    <div
      className="relative flex items-center gap-3 cursor-pointer"
      onClick={() => setShowTooltip((v) => !v)}
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
        {level}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-slate-800 dark:text-white">{title}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{totalXP} XP</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`} style={{ width: `${xpProgress * 100}%` }} />
        </div>
      </div>
      <XPTooltip show={showTooltip} lang={lang} xpForNext={xpForNext} onClose={() => setShowTooltip(false)} />
    </div>
  );
}
