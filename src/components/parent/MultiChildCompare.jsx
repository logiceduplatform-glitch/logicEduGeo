import React, { useContext, useMemo } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { ProfileService } from "../../services/ProfileService";
import { ProgressService } from "../../services/ProgressService";
import { StorageService } from "../../services/StorageService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";

const T = {
  el: {
    title: "Σύγκριση Παιδιών",
    subtitle: "Παρακολούθησε την πρόοδο όλων των παιδιών μαζί",
    needTwoChildren: "Χρειάζονται τουλάχιστον 2 παιδικά προφίλ για σύγκριση.",
    games: "Παιχνίδια",
    minutes: "Λεπτά",
    accuracy: "Ακρίβεια",
    streak: "Σερί",
    level: "Επίπεδο",
    xp: "XP",
    badges: "Ταυτότητες",
    weeklyGames: "Παιχνίδια αυτή τη βδομάδα",
    overall: "Γενική Σύγκριση",
    leader: "🥇 Ηγέτης",
    healthy: "Υγιής ανταγωνισμός! Όλα τα παιδιά έχουν δικά τους δυνατά σημεία.",
  },
  en: {
    title: "Compare Children",
    subtitle: "Track all your kids' progress side by side",
    needTwoChildren: "Need at least 2 child profiles for comparison.",
    games: "Games",
    minutes: "Minutes",
    accuracy: "Accuracy",
    streak: "Streak",
    level: "Level",
    xp: "XP",
    badges: "Badges",
    weeklyGames: "Games this week",
    overall: "Overall Comparison",
    leader: "🥇 Leader",
    healthy: "Healthy competition! Each child has their own strengths.",
  },
};

const COLORS = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

function readScopedStats(profileId) {
  const savedScope = StorageService.getScope();
  StorageService.setScope(profileId);
  try {
    const overall = ProgressService.getOverallStats() || { totalGamesPlayed: 0, totalCorrect: 0, totalAttempts: 0 };
    const xp = ProgressService.getXP() || { level: 1, total: 0 };
    const streak = ProgressService.getStreak() || { current: 0, best: 0 };
    const achievements = ProgressService.getUnlockedAchievements() || [];
    const dailyStats = ProgressService.getDailyStatsRange(7) || [];

    const minutes = dailyStats.reduce((s, d) => s + (d.minutesPlayed || 0), 0);
    const games = dailyStats.reduce((s, d) => s + (d.gamesPlayed || 0), 0);
    const accuracy = overall.totalAttempts > 0 ? Math.round((overall.totalCorrect / overall.totalAttempts) * 100) : 0;

    return {
      games: overall.totalGamesPlayed,
      weeklyGames: games,
      weeklyMinutes: minutes,
      accuracy,
      streak: streak.current,
      bestStreak: streak.best,
      level: xp.level,
      xp: xp.total,
      badges: achievements.length,
    };
  } finally {
    if (savedScope) {
      const id = savedScope.replace("profile:", "").replace(/:$/, "");
      StorageService.setScope(id);
    } else {
      StorageService.setScope(null);
    }
  }
}

export default function MultiChildCompare() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const children = useMemo(() => ProfileService.getAll(), []);

  const data = useMemo(() => children.map(c => ({
    name: c.name,
    avatar: c.avatar || "👤",
    ...readScopedStats(c.id),
  })), [children]);

  if (children.length < 2) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-4xl">👨‍👩‍👧‍👦</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">{l.needTwoChildren}</p>
      </div>
    );
  }

  // Find leaders per category
  const leader = (key) => {
    let max = -1; let winner = null;
    data.forEach(d => { if (d[key] > max) { max = d[key]; winner = d; } });
    return winner;
  };

  const radarData = [
    { stat: l.games, ...Object.fromEntries(data.map((d) => [d.name, d.games])) },
    { stat: l.weeklyGames, ...Object.fromEntries(data.map((d) => [d.name, d.weeklyGames])) },
    { stat: l.minutes, ...Object.fromEntries(data.map((d) => [d.name, d.weeklyMinutes])) },
    { stat: l.accuracy, ...Object.fromEntries(data.map((d) => [d.name, d.accuracy])) },
    { stat: l.streak, ...Object.fromEntries(data.map((d) => [d.name, d.streak])) },
    { stat: l.badges, ...Object.fromEntries(data.map((d) => [d.name, d.badges])) },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
        <span className="inline-block text-3xl mb-1">📊👨‍👩‍👧‍👦</span>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {/* Leaders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <LeaderCard label={l.games} winner={leader("games")} keyName="games" icon="🎮" />
        <LeaderCard label={l.streak} winner={leader("streak")} keyName="streak" icon="🔥" />
        <LeaderCard label={l.accuracy} winner={leader("accuracy")} keyName="accuracy" icon="🎯" suffix="%" />
        <LeaderCard label={l.badges} winner={leader("badges")} keyName="badges" icon="🏆" />
      </div>

      {/* Bar comparisons */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">📈 {l.weeklyGames}</h4>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="weeklyGames" fill="#a855f7" radius={[6, 6, 0, 0]} name={l.weeklyGames} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">🎯 {l.accuracy} (%)</h4>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#10b981" radius={[6, 6, 0, 0]} name={l.accuracy} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar overall */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">🕸️ {l.overall}</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              {data.map((d, i) => (
                <Radar key={d.name} name={d.name} dataKey={d.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.3} />
              ))}
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 px-2"></th>
              {data.map(d => (
                <th key={d.name} className="text-center py-2 px-2">{d.avatar} {d.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label={`🎮 ${l.games}`} data={data} k="games" />
            <Row label={`📅 ${l.weeklyGames}`} data={data} k="weeklyGames" />
            <Row label={`⏱️ ${l.minutes} (7d)`} data={data} k="weeklyMinutes" />
            <Row label={`🎯 ${l.accuracy}`} data={data} k="accuracy" suffix="%" />
            <Row label={`🔥 ${l.streak}`} data={data} k="streak" />
            <Row label={`📊 ${l.level}`} data={data} k="level" />
            <Row label={`✨ ${l.xp}`} data={data} k="xp" />
            <Row label={`🏆 ${l.badges}`} data={data} k="badges" />
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">💚 {l.healthy}</p>
    </div>
  );
}

function LeaderCard({ label, winner, keyName, icon, suffix = "" }) {
  if (!winner) return null;
  return (
    <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 text-center border border-amber-200 dark:border-amber-800">
      <div className="text-2xl">{icon}</div>
      <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{label}</div>
      <div className="text-sm font-extrabold text-slate-800 dark:text-white">{winner.avatar} {winner.name}</div>
      <div className="text-xs text-amber-600 dark:text-amber-400 font-bold">{winner[keyName]}{suffix}</div>
    </div>
  );
}

function Row({ label, data, k, suffix = "" }) {
  let max = -1; data.forEach(d => { if (d[k] > max) max = d[k]; });
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/50">
      <td className="py-2 px-2 font-semibold text-slate-700 dark:text-slate-200">{label}</td>
      {data.map(d => (
        <td key={d.name} className={`py-2 px-2 text-center font-bold ${d[k] === max && max > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-300"}`}>
          {d[k]}{suffix}
        </td>
      ))}
    </tr>
  );
}
