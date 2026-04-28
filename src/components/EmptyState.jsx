import React from "react";
import { useNavigate } from "react-router-dom";

const ILLUSTRATIONS = {
  noResults: { emoji: "🔍", bg: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" },
  noGames: { emoji: "🎮", bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" },
  noStudents: { emoji: "👥", bg: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20" },
  noQuizzes: { emoji: "📝", bg: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20" },
  noClassroom: { emoji: "🏫", bg: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20" },
  noAchievements: { emoji: "🏆", bg: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20" },
  noData: { emoji: "📊", bg: "from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-900/50" },
};

export default function EmptyState({ type = "noData", title, description, actionLabel, actionPath, onAction }) {
  const navigate = useNavigate();
  const illust = ILLUSTRATIONS[type] || ILLUSTRATIONS.noData;

  return (
    <div className={`bg-gradient-to-br ${illust.bg} rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 text-center`}>
      <div className="w-20 h-20 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg mx-auto flex items-center justify-center mb-4">
        <span className="text-4xl">{illust.emoji}</span>
      </div>
      {title && <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>}
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">{description}</p>}
      {(actionLabel && (actionPath || onAction)) && (
        <button
          onClick={() => onAction ? onAction() : navigate(actionPath)}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition-all hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
