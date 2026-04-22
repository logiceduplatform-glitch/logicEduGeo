import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { GAME_INSTRUCTIONS } from "../config/gameInstructions";

const T = {
  el: { howTo: "Πώς παίζεται", start: "Ξεκίνα!", dontShow: "Να μην εμφανίζεται ξανά", difficulty: "Δυσκολία" },
  en: { howTo: "How to Play", start: "Start!", dontShow: "Don't show again", difficulty: "Difficulty" },
};

const SKIP_KEY = "geo:skipTutorial";

function getSkipped() {
  try { return JSON.parse(localStorage.getItem(SKIP_KEY)) || []; } catch { return []; }
}

export function shouldShowTutorial(gameId) {
  if (!GAME_INSTRUCTIONS[gameId]) return false;
  return !getSkipped().includes(gameId);
}

export default function HowToPlayModal({ gameId, gameTitle, gameIcon, difficulty = 1, onStart, onClose }) {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const [dontShow, setDontShow] = useState(false);
  const instructions = GAME_INSTRUCTIONS[gameId];

  if (!instructions) {
    onStart?.();
    return null;
  }

  const handleStart = () => {
    if (dontShow) {
      try {
        const list = getSkipped();
        if (!list.includes(gameId)) {
          list.push(gameId);
          localStorage.setItem(SKIP_KEY, JSON.stringify(list));
        }
      } catch { /* restricted env */ }
    }
    onStart?.();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={l.howTo}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {gameIcon && (
          <div className="text-6xl mb-4" aria-hidden="true">{gameIcon}</div>
        )}

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
          {gameTitle || gameId}
        </h2>

        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-4">
          {l.howTo}
        </span>

        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
          {instructions[lang] || instructions.en || instructions.el}
        </p>

        {/* Difficulty stars */}
        <div className="flex items-center justify-center gap-1 mb-5">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">{l.difficulty}:</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`text-lg ${s <= difficulty ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg mb-3"
        >
          {l.start}
        </button>

        <label className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-purple-500 focus:ring-purple-400"
          />
          {l.dontShow}
        </label>
      </div>
    </div>
  );
}
