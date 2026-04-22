import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useProgress } from "../../contexts/ProgressContext";

export default function RightPanel({ onResume }) {
  const { guest } = useContext(AuthContext);
  const { lang } = useContext(LanguageContext);
  const progress = useProgress();
  const navigate = useNavigate();
  const isEl = lang === "el";

  const inProgress = progress.getInProgressGame();
  const streak = progress.getStreak();
  const monthlyStats = progress.getMonthlyStats();
  const weeklyGrid = progress.getWeeklyGrid();
  const overall = progress.getOverallStats();
  const unlockedAchievements = progress.getUnlockedAchievements();

  const recentTitle = inProgress?.title || null;
  const startedPct = inProgress
    ? Math.min(100, Math.round(((inProgress.index || 0) / Math.max(inProgress.length || 1, 1)) * 100))
    : 0;

  const monthGoal = 100;
  const monthCorrect = monthlyStats.totalCorrect || 0;
  const monthPct = Math.min(100, Math.round((monthCorrect / monthGoal) * 100));

  const weekLabels = isEl
    ? ["Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά", "Κυ"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const ProgressBar = ({ value, gradient = "from-purple-500 to-pink-500" }) => (
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.max(0, Math.min(100, Math.round(value || 0)))}%` }}
      />
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-sm transition-shadow ${className}`}>
      {children}
    </div>
  );

  return (
    <aside className="hidden lg:block w-72 shrink-0 border-l border-slate-100 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900">
      <div className="p-4 space-y-3">

        <Card className={inProgress?.categoryId && onResume ? "cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all" : ""}>
          <div
            onClick={() => {
              if (inProgress?.categoryId && onResume) onResume(inProgress.categoryId);
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs">📝</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {isEl ? "Τρέχουσα πρόοδος" : "Current progress"}
                </span>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                {startedPct}%
              </span>
            </div>
            <ProgressBar value={startedPct} />
            <div className="flex items-center justify-between mt-1.5">
              <div className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1" title={recentTitle || ""}>
                {recentTitle || "—"}
              </div>
              {inProgress?.categoryId && onResume && (
                <span className="text-[10px] font-semibold text-purple-500 dark:text-purple-400">
                  {isEl ? "Συνέχισε →" : "Resume →"}
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs">🎯</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {isEl ? "Μηνιαία πρόκληση" : "Monthly challenge"}
              </span>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              {monthPct}%
            </span>
          </div>
          <ProgressBar value={monthPct} gradient="from-amber-400 to-orange-500" />
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {monthCorrect}/{monthGoal} {isEl ? "σωστές απαντήσεις" : "correct answers"}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs">📊</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isEl ? "Εβδομαδιαία δραστηριότητα" : "Weekly activity"}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {weekLabels.map((lab, idx) => {
              const done = !!weeklyGrid[idx];
              return (
                <div
                  key={`${lab}-${idx}`}
                  className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    done
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                  }`}
                  title={lab}
                >
                  {lab}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-[8px]">
              &#10003;
            </span>
            {isEl ? "Σερί" : "Streak"}:{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">{streak.current}</span>{" "}
            {isEl ? "ημέρες" : "days"}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs">🧠</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isEl ? "Στατιστικά" : "Statistics"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block">{overall.totalGamesPlayed}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                {isEl ? "Παιχνίδια" : "Quizzes"}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block">{overall.totalCorrect}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                {isEl ? "Σωστά" : "Correct"}
              </span>
            </div>
          </div>
        </Card>

        {unlockedAchievements.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-xs">🏅</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {isEl ? "Επιτεύγματα" : "Achievements"}
                </span>
              </div>
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                {unlockedAchievements.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {unlockedAchievements.slice(0, 6).map((id) => (
                <span key={id} className="text-lg bg-yellow-50 dark:bg-yellow-900/30 w-8 h-8 rounded-lg flex items-center justify-center">🏆</span>
              ))}
              {unlockedAchievements.length > 6 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 self-center ml-1">+{unlockedAchievements.length - 6}</span>
              )}
            </div>
          </Card>
        )}
      </div>
    </aside>
  );
}
