import React from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useSubscription } from "../../contexts/SubscriptionContext";

export default function CategoryMenu({ active, onSelect, onLockedClick }) {
  const { lang } = React.useContext(LanguageContext);
  const isEl = lang === "el";
  const navigate = useNavigate();
  const { isGameFree } = useSubscription();

  const items = [
    {
      id: "LogicMath",
      emoji: "🔢",
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      desc: { el: "Μαθηματικά & Λογική", en: "Math & Logic" },
    },
    {
      id: "NaturalWorld",
      emoji: "🌿",
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      desc: { el: "Φυσικός Κόσμος", en: "Natural World" },
    },
    {
      id: "Adventures",
      emoji: "🧭",
      gradient: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      desc: { el: "Γεωγραφία & Ιστορία", en: "Geography & History" },
    },
    {
      id: "BrainTeasers",
      emoji: "🧠",
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
      desc: { el: "Γρίφοι & Αινίγματα", en: "Puzzles & Riddles" },
    },
    {
      id: "Edutainment",
      emoji: "🎮",
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      desc: { el: "Τεχνολογία & Πολιτισμός", en: "Tech & Culture" },
    },
    {
      id: "History",
      emoji: "📖",
      gradient: "from-stone-500 to-amber-600",
      bg: "bg-stone-50",
      border: "border-stone-200",
      desc: { el: "Ιστορία & Πολιτισμός", en: "History & Civilization" },
    },
    {
      id: "Language",
      emoji: "💬",
      gradient: "from-sky-500 to-blue-500",
      bg: "bg-sky-50",
      border: "border-sky-200",
      desc: { el: "Γλώσσα & Λογοτεχνία", en: "Language & Literature" },
    },
    {
      id: "Space",
      emoji: "🚀",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      desc: { el: "Επιστήμη & Διάστημα", en: "Science & Space" },
    },
    {
      id: "Politics",
      emoji: "🌍",
      gradient: "from-blue-600 to-indigo-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      desc: { el: "Κόσμος & Πολιτική", en: "World & Politics" },
    },
    {
      id: "Health",
      emoji: "❤️",
      gradient: "from-red-500 to-rose-500",
      bg: "bg-red-50",
      border: "border-red-200",
      desc: { el: "Υγεία & Ευεξία", en: "Health & Wellness" },
    },
    {
      id: "Art",
      emoji: "🎵",
      gradient: "from-fuchsia-500 to-pink-500",
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      desc: { el: "Τέχνη & Μουσική", en: "Art & Music" },
    },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
      <div className="p-3">
        <h2 className="px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
          🧠 {isEl ? "Κατηγορίες" : "Categories"}
        </h2>
        <nav className="space-y-2 mt-4">
          {items.map(({ id, emoji, gradient, desc }, idx) => {
            const isActive = active === id;
            const locked = !isGameFree(idx);
            return (
              <button
                key={id}
                type="button"
                onClick={() => locked ? onLockedClick?.() : onSelect?.(id)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform",
                  locked
                    ? "opacity-60 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 shadow-sm"
                    : isActive
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105`
                      : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] shadow-sm",
                ].join(" ")}
              >
                <div className={[
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  locked ? "bg-slate-200 dark:bg-slate-700" : isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700",
                ].join(" ")}>
                  {locked ? (
                    <span className="text-base">🔒</span>
                  ) : (
                    <span
                      className={[
                        "text-xl leading-none",
                        isActive ? "opacity-100" : "opacity-90",
                      ].join(" ")}
                      role="img"
                      aria-hidden
                    >
                      {emoji}
                    </span>
                  )}
                </div>
                <span className="truncate flex-1 text-left">{desc[isEl ? "el" : "en"]}</span>
                {locked && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">PRO</span>
                )}
                {!locked && isActive && (
                  <span className="ml-auto inline-block h-3 w-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            type="button"
            onClick={() => navigate("/play/board-games")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102 shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-500 to-indigo-600">
              <span className="text-lg">♟️</span>
            </div>
            <span className="truncate flex-1 text-left">
              {isEl ? "Επιτραπέζια" : "Board Games"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/play/adult-games")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102 shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600">
              <span className="text-lg">🧠</span>
            </div>
            <span className="truncate flex-1 text-left">
              {isEl ? "Παιχνίδια" : "Games"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
