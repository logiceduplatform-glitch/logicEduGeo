import React, { useState, useContext, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";

const DC_KEY = "geo:dailyChallenge";
const DC_COUNT_KEY = "geo:dailyChallengeGames";

const CHALLENGES = [
  { icon: "🧩", route: "/play", type: "quiz", el: "Παίξε 3 παιχνίδια σήμερα", en: "Play 3 games today", goal: 3 },
  { icon: "🎯", route: "/play/board-games", type: "board", el: "Παίξε ένα επιτραπέζιο", en: "Play a board game", goal: 1 },
  { icon: "⚡", route: "/play", type: "play", el: "Ολοκλήρωσε 2 παιχνίδια", en: "Complete 2 games", goal: 2 },
  { icon: "🔥", route: "/play", type: "streak", el: "Διατήρησε το streak σου", en: "Keep your streak alive", goal: 1 },
  { icon: "🏆", route: "/play", type: "score", el: "Πάρε πάνω από 80% σε κάποιο quiz", en: "Score above 80% on a quiz", goal: 1 },
  { icon: "📚", route: "/play", type: "learn", el: "Παίξε 2 διαφορετικά παιχνίδια", en: "Play 2 different games", goal: 2 },
  { icon: "🎮", route: "/play", type: "play", el: "Παίξε 5 παιχνίδια σήμερα", en: "Play 5 games today", goal: 5 },
];

function getDailyChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return CHALLENGES[seed % CHALLENGES.length];
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getCompletedToday() {
  try { return localStorage.getItem(DC_KEY) === getTodayStr(); } catch { return false; }
}

function getTodayGameCount() {
  try {
    const raw = localStorage.getItem(DC_COUNT_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return data.date === getTodayStr() ? (data.count || 0) : 0;
  } catch { return 0; }
}

function markChallengeComplete() {
  try { localStorage.setItem(DC_KEY, getTodayStr()); } catch { /* */ }
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const challenge = useMemo(() => getDailyChallenge(), []);

  const [completed, setCompleted] = useState(getCompletedToday);
  const [gameCount, setGameCount] = useState(getTodayGameCount);

  const checkCompletion = useCallback(() => {
    if (completed) return;
    const today = getTodayStr();
    const overall = ProgressService.getOverallStats();
    const todayGames = (overall.history || []).filter(
      (g) => g.timestamp && g.timestamp.startsWith(today)
    ).length;

    const newCount = Math.max(gameCount, todayGames);
    try {
      localStorage.setItem(DC_COUNT_KEY, JSON.stringify({ date: today, count: newCount }));
    } catch { /* */ }
    setGameCount(newCount);

    if (newCount >= challenge.goal) {
      markChallengeComplete();
      setCompleted(true);
      ProgressService.addXP(25);
    }
  }, [completed, gameCount, challenge.goal]);

  useEffect(() => {
    checkCompletion();
    const onQuizComplete = () => setTimeout(checkCompletion, 500);
    window.addEventListener("quizComplete", onQuizComplete);
    const interval = setInterval(checkCompletion, 30000);
    return () => {
      window.removeEventListener("quizComplete", onQuizComplete);
      clearInterval(interval);
    };
  }, [checkCompletion]);

  const progress = challenge.goal > 1
    ? `${Math.min(gameCount, challenge.goal)}/${challenge.goal}`
    : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 shadow-2xl">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
            {challenge.icon}
          </span>
          <div>
            <h3 className="text-white font-extrabold text-lg">
              {isEl ? "Πρόκληση Ημέρας" : "Daily Challenge"}
            </h3>
            <p className="text-white/60 text-xs font-medium">
              {new Date().toLocaleDateString(isEl ? "el-GR" : "en-US", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {completed && (
            <span className="ml-auto px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
              +25 XP
            </span>
          )}
        </div>

        <p className="text-white/90 font-medium mb-2">
          {isEl ? challenge.el : challenge.en}
        </p>

        {progress && !completed && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{isEl ? "Πρόοδος" : "Progress"}</span>
              <span>{progress}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (gameCount / challenge.goal) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(challenge.route)}
          disabled={completed}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${completed ? "bg-white/20 text-white/60 cursor-default" : "bg-white text-purple-700 hover:bg-white/90 hover:scale-[1.02] shadow-lg"}`}
        >
          {completed
            ? (isEl ? "✅ Ολοκληρώθηκε!" : "✅ Completed!")
            : (isEl ? "Ξεκίνα →" : "Start →")}
        </button>
      </div>
    </div>
  );
}
