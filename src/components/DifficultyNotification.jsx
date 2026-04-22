import React, { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function DifficultyNotification({ direction, newLevel, onDone }) {
  const { lang } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const isUp = direction === "up";
  const emoji = isUp ? "🚀" : "💪";
  const message = isUp
    ? (lang === "el" ? `Level Up! Δυσκολία ${newLevel}/5` : `Level Up! Difficulty ${newLevel}/5`)
    : (lang === "el" ? `Προσαρμογή σε ${newLevel}/5` : `Adjusted to ${newLevel}/5`);

  const stars = Array.from({ length: 5 }, (_, i) => i < newLevel);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[80] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border-2 ${
        isUp
          ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-300 dark:border-emerald-700"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-300 dark:border-blue-700"
      }`}>
        <span className="text-2xl animate-bounce" aria-hidden="true">{emoji}</span>
        <div>
          <p className={`text-sm font-bold ${isUp ? "text-emerald-700 dark:text-emerald-300" : "text-blue-700 dark:text-blue-300"}`}>
            {message}
          </p>
          <div className="flex gap-0.5 mt-1">
            {stars.map((filled, i) => (
              <span key={i} className={`text-sm ${filled ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}>★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
