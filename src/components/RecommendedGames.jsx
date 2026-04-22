import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { RecommendationService } from "../services/RecommendationService";

const REASON_LABELS = {
  practice: { el: "Χρειάζεται εξάσκηση", en: "Needs practice", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  new:      { el: "Νέο για σένα!", en: "New for you!", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  favorite: { el: "Αγαπημένο!", en: "You love this!", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  explore:  { el: "Δοκίμασέ το!", en: "Try it!", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const T = {
  el: { title: "Προτεινόμενα για σένα", play: "Παίξε" },
  en: { title: "Recommended for you", play: "Play" },
};

export default function RecommendedGames({ games, onGameSelect, route }) {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const recommendations = useMemo(
    () => RecommendationService.getRecommendations(games, 5),
    [games]
  );

  if (recommendations.length === 0) return null;

  const handleClick = (game) => {
    if (onGameSelect) {
      onGameSelect(game.id);
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span aria-hidden="true">💡</span> {l.title}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {recommendations.map((game) => {
          const reasonInfo = REASON_LABELS[game.reason] || REASON_LABELS.explore;
          const title = game.title?.[lang] || game.title?.en || game.id;

          return (
            <button
              key={game.id}
              onClick={() => handleClick(game)}
              className="flex-shrink-0 w-44 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-left hover:shadow-lg hover:scale-105 transition-all duration-200 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                {game.icon || "🎮"}
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">
                {title}
              </h4>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${reasonInfo.color}`}>
                {lang === "el" ? reasonInfo.el : reasonInfo.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
