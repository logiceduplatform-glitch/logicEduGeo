import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import DailyMissions from "../components/DailyMissions";
import { MissionsService } from "../services/MissionsService";
import { CoinService } from "../services/CoinService";

const T = {
  el: {
    title: "🎯 Ημερήσιες Αποστολές",
    subtitle: "Ολοκλήρωσε αποστολές για να κερδίσεις νομίσματα και να ανεβάσεις το επίπεδο σου!",
    coins: "Νομίσματα",
    streak: "Σερί",
    days: "ημέρες",
    completedToday: "Ολοκληρωμένες σήμερα",
    nextReset: "Επόμενη ανανέωση",
    in: "σε",
    h: "ώ", m: "λ",
    explainTitle: "💡 Πώς λειτουργεί;",
    explain: [
      "Κάθε μέρα παίρνεις 3 τυχαίες αποστολές.",
      "Παίξε παιχνίδια για να ολοκληρώσεις τις αποστολές.",
      "Όταν τελειώσεις μια αποστολή, πάτα «Διεκδίκηση» για να πάρεις νομίσματα.",
      "Οι αποστολές ανανεώνονται κάθε μέρα στις 00:00.",
    ],
    todayProgress: "Πρόοδος σήμερα",
    games: "Παιχνίδια",
    correctAnswers: "Σωστές απαντήσεις",
    totalReward: "Συνολικό έπαθλο",
  },
  en: {
    title: "🎯 Daily Quests",
    subtitle: "Complete quests to earn coins and level up!",
    coins: "Coins",
    streak: "Streak",
    days: "days",
    completedToday: "Completed today",
    nextReset: "Next reset",
    in: "in",
    h: "h", m: "m",
    explainTitle: "💡 How does it work?",
    explain: [
      "Each day you get 3 random quests.",
      "Play games to make progress on quests.",
      "When complete, click «Claim» to get coins.",
      "Quests reset every day at 00:00.",
    ],
    todayProgress: "Today's progress",
    games: "Games",
    correctAnswers: "Correct answers",
    totalReward: "Total reward",
  },
};

function timeUntilMidnight(lang = "en") {
  const now = new Date();
  const next = new Date();
  next.setHours(24, 0, 0, 0);
  const diff = next - now;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const l = T[lang] || T.en;
  return `${h}${l.h} ${m}${l.m}`;
}

export default function DailyQuestsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [missions, setMissions] = useState(() => MissionsService.getMissions());
  const [coins, setCoins] = useState(() => CoinService.getCoins?.() ?? 0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      setMissions(MissionsService.getMissions());
      setCoins(CoinService.getCoins?.() ?? 0);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const completedCount = missions.filter((m) => m.completed).length;
  const totalReward = missions.reduce((s, m) => s + (m.reward || 0), 0);
  const claimedReward = missions.filter((m) => m.claimed).reduce((s, m) => s + (m.reward || 0), 0);

  const todayGames = useMemo(() => MissionsService.getTodayGamesPlayed?.() ?? 0, [missions]);
  const todayCorrect = useMemo(() => MissionsService.getTodayCorrect?.() ?? 0, [missions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon="🪙" value={coins} label={l.coins} color="from-amber-400 to-orange-500" />
            <Stat icon="✅" value={`${completedCount}/${missions.length}`} label={l.completedToday} color="from-emerald-400 to-teal-500" />
            <Stat icon="🎯" value={`${claimedReward}/${totalReward}`} label={l.totalReward} color="from-purple-400 to-fuchsia-500" />
            <Stat icon="⏰" value={timeUntilMidnight(lang)} label={l.nextReset} color="from-blue-400 to-indigo-500" />
          </div>

          {/* Today's Progress card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">{l.todayProgress}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">{l.games}</p>
                <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200">🎮 {todayGames}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">{l.correctAnswers}</p>
                <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-200">✓ {todayCorrect}</p>
              </div>
            </div>
          </div>

          {/* Daily missions widget */}
          <DailyMissions />

          {/* Explainer */}
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-2xl p-5 border border-violet-200 dark:border-violet-800/50">
            <h3 className="font-extrabold text-violet-800 dark:text-violet-300 mb-2">{l.explainTitle}</h3>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {l.explain.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, color }) {
  return (
    <div className={`relative rounded-2xl p-4 bg-gradient-to-br ${color} text-white shadow-md overflow-hidden`}>
      <div className="absolute -top-2 -right-2 text-5xl opacity-20">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-2xl font-extrabold mt-1">{value}</p>
    </div>
  );
}
