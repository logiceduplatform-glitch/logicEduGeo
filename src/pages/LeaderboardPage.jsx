import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

const MEDAL = ["🥇", "🥈", "🥉"];

const T = {
  el: {
    title: "Τα Ρεκόρ μου",
    subtitle: "Η πρόοδός σου σε αριθμούς",
    back: "Πίσω",
    topGames: "Κορυφαία Παιχνίδια",
    game: "Παιχνίδι",
    score: "Σκορ",
    played: "Φορές",
    stats: "Στατιστικά",
    totalXP: "Συνολικά XP",
    level: "Επίπεδο",
    gamesPlayed: "Παιχνίδια",
    accuracy: "Ακρίβεια",
    streak: "Σερί",
    days: "μέρες",
    noData: "Παίξε μερικά παιχνίδια για να δεις τα ρεκόρ σου!",
    milestones: "Ορόσημα",
    nextMilestone: "Επόμενο ορόσημο",
  },
  en: {
    title: "My Records",
    subtitle: "Your progress in numbers",
    back: "Back",
    topGames: "Top Games",
    game: "Game",
    score: "Score",
    played: "Played",
    stats: "Statistics",
    totalXP: "Total XP",
    level: "Level",
    gamesPlayed: "Games",
    accuracy: "Accuracy",
    streak: "Streak",
    days: "days",
    noData: "Play some games to see your records!",
    milestones: "Milestones",
    nextMilestone: "Next milestone",
  },
};

const MILESTONES = [
  { xp: 100, icon: "🌱", el: "Αρχάριος", en: "Beginner" },
  { xp: 500, icon: "🌿", el: "Εξερευνητής", en: "Explorer" },
  { xp: 1000, icon: "🌳", el: "Μαθητής", en: "Learner" },
  { xp: 2500, icon: "⭐", el: "Αστέρι", en: "Star" },
  { xp: 5000, icon: "🔥", el: "Πρωταθλητής", en: "Champion" },
  { xp: 10000, icon: "💎", el: "Θρύλος", en: "Legend" },
  { xp: 25000, icon: "👑", el: "Μύθος", en: "Mythic" },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest, userProfile } = useContext(AuthContext);
  const progress = useProgress();
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const data = useMemo(() => {
    const xp = progress.getXP();
    const overall = progress.getOverallStats();
    const streak = progress.getStreak();
    const history = overall.history || [];

    const gameMap = {};
    history.forEach((g) => {
      const key = g.title || g.gameId || "Unknown";
      if (!gameMap[key]) gameMap[key] = { name: key, bestScore: 0, total: 0, count: 0 };
      gameMap[key].count += 1;
      if ((g.score || 0) > gameMap[key].bestScore) {
        gameMap[key].bestScore = g.score || 0;
        gameMap[key].total = g.total || 0;
      }
    });

    const topGames = Object.values(gameMap)
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 10);

    const accuracy = overall.totalGamesPlayed > 0
      ? Math.min(100, Math.round((overall.totalCorrect / Math.max(1, overall.totalGamesPlayed)) * 100))
      : 0;

    return {
      name: userProfile?.name || user?.displayName || (guest ? (isEl ? "Επισκέπτης" : "Guest") : "Player"),
      totalXP: xp.totalXP,
      level: xp.level,
      games: overall.totalGamesPlayed,
      accuracy,
      streak: streak?.current || 0,
      bestStreak: streak?.best || 0,
      topGames,
    };
  }, [progress, userProfile, user, guest, isEl]);

  const earnedMilestones = MILESTONES.filter((m) => data.totalXP >= m.xp);
  const nextMilestone = MILESTONES.find((m) => data.totalXP < m.xp);

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={l.title} />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <button onClick={() => navigate(-1)} className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1 font-medium transition-colors">&larr; {l.back}</button>

          <div className="text-center mb-8">
            <span className="text-5xl mb-3 block" aria-hidden="true">🏆</span>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: l.totalXP, value: data.totalXP.toLocaleString(), icon: "⚡", color: "from-amber-500 to-orange-500" },
              { label: l.level, value: data.level, icon: "📊", color: "from-purple-500 to-pink-500" },
              { label: l.gamesPlayed, value: data.games, icon: "🎮", color: "from-blue-500 to-cyan-500" },
              { label: l.streak, value: `${data.streak} ${l.days}`, icon: "🔥", color: "from-red-500 to-orange-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mx-auto mb-2`} aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="text-xl font-extrabold text-slate-800 dark:text-white">{stat.value}</div>
                <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Milestones */}
          {earnedMilestones.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 mb-8">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{l.milestones}</h2>
              <div className="flex flex-wrap gap-3">
                {earnedMilestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">{isEl ? m.el : m.en}</div>
                      <div className="text-[10px] text-slate-400">{m.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                ))}
              </div>
              {nextMilestone && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{l.nextMilestone}: {isEl ? nextMilestone.el : nextMilestone.en}</span>
                    <span>{data.totalXP.toLocaleString()} / {nextMilestone.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (data.totalXP / nextMilestone.xp) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top games */}
          {data.topGames.length > 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{l.topGames}</h2>
              </div>
              <div className="grid grid-cols-[3rem_1fr_5rem_4rem] gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>#</span><span>{l.game}</span><span className="text-right">{l.score}</span><span className="text-right">{l.played}</span>
              </div>
              {data.topGames.map((g, i) => (
                <div key={i} className={`grid grid-cols-[3rem_1fr_5rem_4rem] gap-2 px-6 py-3.5 items-center ${i % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/50"}`}>
                  <span className="text-lg font-bold text-slate-400 dark:text-slate-500">{i < 3 ? MEDAL[i] : i + 1}</span>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{g.name}</span>
                  <span className="text-right text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {g.total > 0 ? `${g.bestScore}/${g.total}` : g.bestScore}
                  </span>
                  <span className="text-right text-sm text-slate-500 dark:text-slate-400">{g.count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-12 text-center">
              <span className="text-5xl block mb-4" aria-hidden="true">🎮</span>
              <p className="text-slate-500 dark:text-slate-400">{l.noData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
