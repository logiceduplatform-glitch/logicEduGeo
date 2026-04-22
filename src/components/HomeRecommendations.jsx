import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: { title: "Συνέχισε να μαθαίνεις", continueGame: "Συνέχεια", viewAll: "Δες όλα →", recentTitle: "Πρόσφατα παιχνίδια", statsTitle: "Η πρόοδός σου" },
  en: { title: "Continue learning", continueGame: "Continue", viewAll: "View all →", recentTitle: "Recent games", statsTitle: "Your progress" },
};

export default function HomeRecommendations({ lang }) {
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const recentGames = useMemo(() => ProgressService.getRecentGames().slice(0, 4), []);
  const overall = useMemo(() => ProgressService.getOverallStats(), []);
  const streak = useMemo(() => ProgressService.getStreak(), []);
  const xp = useMemo(() => ProgressService.getXP(), []);

  if (overall.totalGamesPlayed === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span aria-hidden="true">💡</span> {l.title}
        </h2>
        <button
          onClick={() => navigate("/my-games")}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          {l.viewAll}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
          <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{overall.totalGamesPlayed}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{lang === "el" ? "Παιχνίδια" : "Games"}</p>
        </div>
        <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{streak.current}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{lang === "el" ? "Σερί" : "Streak"}</p>
        </div>
        <div className="text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{xp.level}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{lang === "el" ? "Επίπεδο" : "Level"}</p>
        </div>
      </div>

      {/* Recent games */}
      {recentGames.length > 0 && (
        <>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{l.recentTitle}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentGames.map((game, i) => (
              <button
                key={i}
                onClick={() => navigate("/my-games")}
                className="flex-shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <span className="font-bold">{game.score}/{game.total}</span>
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{game.title}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
