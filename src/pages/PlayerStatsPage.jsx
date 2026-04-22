import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import ShareButton from "../components/ShareButton";
import XPLevelBadge from "../components/XPLevelBadge";
import { useProgress } from "../contexts/ProgressContext";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { ProfileService } from "../services/ProfileService";
import { ACHIEVEMENTS } from "../config/achievements";
import StreakCalendar from "../components/dashboard/StreakCalendar";

const T = {
  el: {
    title: "Στατιστικά Παιχνιδιού",
    back: "Πίσω",
    memberSince: "Μέλος από",
    overallAccuracy: "Συνολική ακρίβεια",
    totalGamesPlayed: "Παιχνίδια",
    totalCorrect: "Σωστά",
    accuracy: "Ακρίβεια",
    currentStreak: "Τρέχον σερί",
    bestStreak: "Καλύτερο σερί",
    totalPlayTime: "Συνολικός χρόνος",
    days: "μέρες",
    minutes: "λεπτά",
    weeklyActivity: "Εβδομαδιαία δραστηριότητα",
    currentWeek: "Τρέχουσα εβδομάδα",
    mon: "Δετ",
    tue: "Τρ",
    wed: "Τετ",
    thu: "Πέμ",
    fri: "Παρ",
    sat: "Σάβ",
    sun: "Κυρ",
    activityChart: "Δραστηριότητα (30 ημέρες)",
    gamesPerDay: "Παιχνίδια/ημέρα",
    categoryPerformance: "Απόδοση κατά παιχνίδι",
    topGames: "Κορυφαία παιχνίδια",
    recentGames: "Πρόσφατα παιχνίδια",
    game: "Παιχνίδι",
    score: "Σκορ",
    date: "Ημ/νία",
    achievements: "Επιτεύγματα",
    unlockedCount: "Ξεκλειδωμένα",
    earnedBadges: "Κερδισμένα βραβεία",
    emptyTitle: "Ξεκίνα να παίζεις!",
    emptySubtitle: "Παίξε παιχνίδια για να δεις τα στατιστικά σου εδώ.",
    emptyButton: "Πήγαινε στα παιχνίδια",
  },
  en: {
    title: "Player Statistics",
    back: "Back",
    memberSince: "Member since",
    overallAccuracy: "Overall accuracy",
    totalGamesPlayed: "Games played",
    totalCorrect: "Correct answers",
    accuracy: "Accuracy",
    currentStreak: "Current streak",
    bestStreak: "Best streak",
    totalPlayTime: "Total play time",
    days: "days",
    minutes: "min",
    weeklyActivity: "Weekly activity",
    currentWeek: "Current week",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
    activityChart: "Activity (30 days)",
    gamesPerDay: "Games/day",
    categoryPerformance: "Category performance",
    topGames: "Top games",
    recentGames: "Recent games",
    game: "Game",
    score: "Score",
    date: "Date",
    achievements: "Achievements",
    unlockedCount: "Unlocked",
    earnedBadges: "Earned badges",
    emptyTitle: "Start playing!",
    emptySubtitle: "Play games to see your stats here.",
    emptyButton: "Go to games",
  },
};

const WEEK_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function formatDate(dateStr, lang) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
    day: "numeric",
    month: "short",
    year: lang === "el" ? "2-digit" : undefined,
  });
}

export default function PlayerStatsPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest, userProfile } = useContext(AuthContext);
  const progress = useProgress();

  const l = T[lang] || T.en;

  const activeChild = ProfileService.getActive();

  const overall = progress.getOverallStats();
  const streak = progress.getStreak();
  const weeklyGrid = progress.getWeeklyGrid();
  const dailyStats = progress.getDailyStatsRange(30);
  const unlockedIds = progress.getUnlockedAchievements();
  const allGameProgress = progress.getAllGameProgress();
  const recentGamesList = ProgressService.getRecentGames();

  const displayName = activeChild
    ? activeChild.name
    : userProfile?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      (guest ? (lang === "el" ? "Επισκέπτης" : "Guest") : "?");
  const avatarUrl = activeChild ? null : (user?.photoURL || null);
  const activeChildAvatar = activeChild?.avatar || null;
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "?";
  const memberSince =
    user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString(
          lang === "el" ? "el-GR" : "en-US",
          { year: "numeric", month: "long" }
        )
      : null;
  const ageGroup = activeChild?.age || userProfile?.age || guest?.age || null;
  const objective = activeChild?.objective || userProfile?.objective || guest?.objective || null;

  const accuracy =
    overall.totalAttempts > 0
      ? Math.round((overall.totalCorrect / overall.totalAttempts) * 100)
      : 0;
  const totalMinutes = dailyStats.reduce(
    (sum, d) => sum + (d.minutesPlayed || 0),
    0
  );

  const chartData = useMemo(
    () =>
      dailyStats.map((d) => ({
        date: d.date,
        short: d.date.slice(5),
        games: d.gamesPlayed || 0,
      })),
    [dailyStats]
  );

  const topGames = useMemo(() => {
    const entries = Object.entries(allGameProgress || {}).map(([key, data]) => {
      const gameId = key.replace(/^progress:game:/, "");
      const acc =
        data.totalAttempts > 0
          ? Math.round((data.totalCorrect / data.totalAttempts) * 100)
          : 0;
      return {
        gameId,
        title: gameId,
        gamesPlayed: data.gamesPlayed || 0,
        totalCorrect: data.totalCorrect || 0,
        totalAttempts: data.totalAttempts || 0,
        bestScore: data.bestScore || 0,
        accuracy: acc,
      };
    });
    return entries
      .filter((g) => g.gamesPlayed > 0)
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
      .slice(0, 8);
  }, [allGameProgress]);

  const recentGamesWithDates = useMemo(() => {
    const withDates = [];
    for (const [key, data] of Object.entries(allGameProgress || {})) {
      const gameId = key.replace(/^progress:game:/, "");
      if (data?.history) {
        data.history.forEach((h) => {
          withDates.push({
            date: h.date,
            title: h.title || gameId,
            gameId,
            score: h.score,
            total: h.total,
          });
        });
      }
    }
    withDates.sort((a, b) => new Date(b.date) - new Date(a.date));
    return withDates.slice(0, 10);
  }, [allGameProgress]);

  const fallbackRecent = useMemo(() => {
    return recentGamesList.slice(0, 10).map((g) => ({
      date: null,
      title: g.title || g.gameId,
      gameId: g.gameId,
      score: g.score,
      total: g.total,
    }));
  }, [recentGamesList]);

  const displayRecent =
    recentGamesWithDates.length > 0 ? recentGamesWithDates : fallbackRecent;

  const earnedAchievements = useMemo(
    () => ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id)),
    [unlockedIds]
  );

  return (
    <div
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"
    >
      <Navbar />
      <SEO
        title={l.title}
        description={
          lang === "el"
            ? "Προβολή στατιστικών παιχνιδιού και προόδου"
            : "View your game statistics and progress"
        }
      />

      <div className="pt-20 pb-12 px-4 max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {l.back}
        </button>

        {/* 1. Header with user info */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-8 text-white mb-8 shadow-xl">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName} avatar`}
                  loading="lazy"
                  className="w-24 h-24 rounded-2xl border-4 border-white/30 object-cover shadow-lg"
                />
              ) : activeChildAvatar ? (
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl border-4 border-white/30 shadow-lg">
                  {activeChildAvatar}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-lg">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {ageGroup && (
                <p className="text-purple-200 text-sm mt-1">{ageGroup}</p>
              )}
              {objective && (
                <p className="text-purple-200 text-sm">{objective}</p>
              )}
              {memberSince && (
                <p className="text-purple-300 text-xs mt-1">
                  {l.memberSince} {memberSince}
                </p>
              )}
              {guest && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {lang === "el" ? "Επισκέπτης" : "Guest"}
                </span>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <XPLevelBadge lang={lang} />
                <ShareButton
                  text={lang === "el" ? `Δες τα στατιστικά μου: ${overall.totalGamesPlayed} παιχνίδια, ${accuracy}% ακρίβεια!` : `Check out my stats: ${overall.totalGamesPlayed} games, ${accuracy}% accuracy!`}
                />
              </div>
            </div>
            <div className="shrink-0">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(accuracy / 100) * 301.6} 301.6`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
                  <span className="text-2xl font-bold">{accuracy}%</span>
                  <span className="text-[10px] text-purple-200 text-center px-2">{l.accuracy}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Stats Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              icon: "🎮",
              label: l.totalGamesPlayed,
              value: overall.totalGamesPlayed,
              grad: "from-purple-500 to-indigo-500",
            },
            {
              icon: "✅",
              label: l.totalCorrect,
              value: overall.totalCorrect,
              grad: "from-emerald-500 to-teal-500",
            },
            {
              icon: "🎯",
              label: l.accuracy,
              value: `${accuracy}%`,
              grad: "from-pink-500 to-rose-500",
            },
            {
              icon: "🔥",
              label: l.currentStreak,
              value: `${streak.current} ${l.days}`,
              grad: "from-orange-500 to-amber-500",
            },
            {
              icon: "⭐",
              label: l.bestStreak,
              value: `${streak.best} ${l.days}`,
              grad: "from-yellow-500 to-orange-500",
            },
            {
              icon: "⏱️",
              label: l.totalPlayTime,
              value: `${totalMinutes} ${l.minutes}`,
              grad: "from-cyan-500 to-blue-500",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-4 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow`}
            >
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
            </div>
          ))}
        </section>

        {/* Empty state - show when no games played */}
        {overall.totalGamesPlayed === 0 ? (
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 mb-8 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-6xl block mb-4">🎮</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{l.emptyTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">{l.emptySubtitle}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {l.emptyButton}
            </button>
          </section>
        ) : (
          <>
        {/* Streak Calendar */}
        <section className="mb-8">
          <StreakCalendar streak={streak} dailyStats={dailyStats} lang={lang} />
        </section>

        {/* 3. Weekly Activity Grid */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {l.weeklyActivity}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {l.currentWeek}
          </p>
          <div className="flex justify-between gap-2">
            {WEEK_DAYS.map((key, i) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    weeklyGrid[i]
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {weeklyGrid[i] ? "✓" : "—"}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {l[key]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Activity Chart (30 days) */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {l.activityChart}
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="gamesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgb(226 232 240)"
                  className="dark:stroke-slate-600"
                />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  className="dark:fill-slate-400"
                  interval="preserveStartEnd"
                  angle={-30}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  className="dark:fill-slate-400"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--tooltip-border, #e2e8f0)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    background: document.documentElement.classList.contains("dark") ? "#1e293b" : "white",
                    color: document.documentElement.classList.contains("dark") ? "#e2e8f0" : "#1e293b",
                  }}
                  formatter={(value) => [value, l.gamesPerDay]}
                />
                <Area
                  type="monotone"
                  dataKey="games"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#gamesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 5. Category Performance */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {l.categoryPerformance}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {l.topGames}
          </p>
          {topGames.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm py-4">
              {lang === "el"
                ? "Παίξτε παιχνίδια για να δείτε τη σας απόδοση."
                : "Play games to see your performance."}
            </p>
          ) : (
            <div className="space-y-4">
              {topGames.map((g) => (
                <div key={g.gameId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-800 dark:text-white truncate max-w-[60%]">
                      {g.title}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {g.gamesPlayed} {lang === "el" ? "παιχνίδια" : "games"} ·{" "}
                      {g.accuracy}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${g.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Recent Games List */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {l.recentGames}
          </h2>
          {displayRecent.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm py-4">
              {lang === "el"
                ? "Δεν υπάρχουν πρόσφατα παιχνίδια."
                : "No recent games."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {displayRecent.map((g, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:border-purple-200 dark:hover:border-purple-700/50 transition-colors bg-slate-50/50 dark:bg-slate-700/30"
                >
                  <p className="font-medium text-slate-800 dark:text-white truncate">
                    {g.title}
                  </p>
                  <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {g.total > 0
                        ? `${g.score}/${g.total} (${Math.round((g.score / g.total) * 100)}%)`
                        : `${g.score}`}
                    </span>
                    <span>{formatDate(g.date, lang)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Achievements Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            {l.achievements}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {l.unlockedCount}: {earnedAchievements.length} / {ACHIEVEMENTS.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((a) => {
              const isUnlocked = unlockedIds.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl p-4 text-center transition-all ${
                    isUnlocked
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700/50 shadow-md"
                      : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 opacity-60"
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {isUnlocked ? a.icon : "🔒"}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                    {a.title[lang]}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {a.description[lang]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
          </>
        )}
      </div>
    </div>
  );
}
