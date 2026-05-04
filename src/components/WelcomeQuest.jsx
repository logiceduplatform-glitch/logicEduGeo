import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { CoinService } from "../services/CoinService";

const STORAGE_KEY = "kibloo:welcomeQuest:v1";

const T = {
  el: {
    title: "Καλωσόρισες στην Kibloo!",
    subtitle: "Ολοκλήρωσε 3 αποστολές και κέρδισε το Welcome Bonus!",
    progress: "Πρόοδος",
    coins: "νομίσματα",
    welcomeBonus: "Welcome Bonus",
    claim: "Πάρε το έπαθλο!",
    claimed: "Συλλέχθηκε!",
    skip: "Παράλειψη",
    minimize: "Σύμπτυξη",
    expand: "Άνοιγμα",
    completed: "Όλα έτοιμα!",
    completedDesc: "Καλά να τα γλεντήσεις στην Kibloo! 🎉",
    quests: [
      {
        id: "explore_games",
        title: "Δες τα παιχνίδια",
        desc: "Άνοιξε τη σελίδα παιχνιδιών για να δεις τι σε περιμένει.",
        cta: "Άνοιξε παιχνίδια",
        link: "/play",
        reward: 10,
        icon: "🎯",
      },
      {
        id: "play_one",
        title: "Παίξε ένα παιχνίδι",
        desc: "Διάλεξε οποιοδήποτε παιχνίδι και ξεκίνα!",
        cta: "Δες παιχνίδια",
        link: "/play",
        reward: 25,
        icon: "🎮",
      },
      {
        id: "see_trophies",
        title: "Δες τα τρόπαιά σου",
        desc: "Επισκέψου το Trophy Room για να δεις τα badges που μπορείς να κερδίσεις.",
        cta: "Άνοιξε τρόπαια",
        link: "/trophies",
        reward: 15,
        icon: "🏆",
      },
    ],
  },
  en: {
    title: "Welcome to Kibloo!",
    subtitle: "Complete 3 quests and claim your Welcome Bonus!",
    progress: "Progress",
    coins: "coins",
    welcomeBonus: "Welcome Bonus",
    claim: "Claim reward!",
    claimed: "Claimed!",
    skip: "Skip",
    minimize: "Minimize",
    expand: "Open",
    completed: "All done!",
    completedDesc: "Have fun on Kibloo! 🎉",
    quests: [
      {
        id: "explore_games",
        title: "Explore the games",
        desc: "Open the games page and see what's waiting for you.",
        cta: "Open games",
        link: "/play",
        reward: 10,
        icon: "🎯",
      },
      {
        id: "play_one",
        title: "Play your first game",
        desc: "Pick any game and start playing!",
        cta: "Browse games",
        link: "/play",
        reward: 25,
        icon: "🎮",
      },
      {
        id: "see_trophies",
        title: "Check your trophies",
        desc: "Visit the Trophy Room to see badges you can earn.",
        cta: "Open trophies",
        link: "/trophies",
        reward: 15,
        icon: "🏆",
      },
    ],
  },
};

const BONUS_REWARD = 50;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full */
  }
}

export function getWelcomeQuestState() {
  return loadState();
}

/**
 * Mark a quest as complete from anywhere in the app. Called by:
 *  - /play page (explore_games + play_one)
 *  - /trophies page (see_trophies)
 * Safe to call even if the quest has already been completed.
 */
export function completeQuest(questId) {
  const state = loadState() || { started: Date.now(), completed: {}, claimed: false, dismissed: false };
  if (state.completed[questId]) return false;
  state.completed[questId] = Date.now();
  // Auto-credit the per-quest reward
  const allQuests = T.el.quests; // rewards are language-agnostic
  const quest = allQuests.find((q) => q.id === questId);
  if (quest && quest.reward) {
    try { CoinService.earn(quest.reward); } catch { /* no-op */ }
  }
  saveState(state);
  return true;
}

export default function WelcomeQuest() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const location = useLocation();
  const [state, setState] = useState(() => loadState());
  const [minimized, setMinimized] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // First-time init: lazy create state on first render of a non-onboarding page
  useEffect(() => {
    if (state) return;
    // Don't show during the explicit onboarding flow itself
    if (location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/auth")) return;
    const initial = { started: Date.now(), completed: {}, claimed: false, dismissed: false };
    saveState(initial);
    setState(initial);
  }, [location.pathname, state]);

  // Re-read from storage when route changes (other pages mark progress)
  useEffect(() => {
    const refresh = () => {
      const next = loadState();
      if (next) setState(next);
    };
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [location.pathname]);

  // Auto-detect quest completion when user navigates to a relevant page
  useEffect(() => {
    if (!state || state.dismissed) return;
    if (location.pathname === "/play" && !state.completed.explore_games) {
      completeQuest("explore_games");
      setState(loadState());
    }
    if (location.pathname === "/trophies" && !state.completed.see_trophies) {
      completeQuest("see_trophies");
      setState(loadState());
    }
  }, [location.pathname, state]);

  const completedCount = useMemo(() => {
    if (!state) return 0;
    return l.quests.filter((q) => state.completed[q.id]).length;
  }, [state, l.quests]);

  const allDone = completedCount === l.quests.length;

  const handleClaim = useCallback(() => {
    if (!state || state.claimed) return;
    try { CoinService.earn(BONUS_REWARD); } catch { /* no-op */ }
    const next = { ...state, claimed: true, claimedAt: Date.now() };
    saveState(next);
    setState(next);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2500);
    setTimeout(() => {
      const cur = loadState();
      if (cur && cur.claimed) {
        saveState({ ...cur, dismissed: true });
        setState({ ...cur, dismissed: true });
      }
    }, 4000);
  }, [state]);

  const handleSkip = useCallback(() => {
    const next = state ? { ...state, dismissed: true } : { dismissed: true };
    saveState(next);
    setState(next);
  }, [state]);

  if (!state || state.dismissed) return null;
  if (location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/auth")) return null;
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/teacher-dashboard")) return null;

  const progressPct = Math.round((completedCount / l.quests.length) * 100);

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label={l.expand}
        className="fixed bottom-4 left-4 z-[55] bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="text-lg">🎯</span>
        <span className="text-sm font-bold">{completedCount}/{l.quests.length}</span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label={l.title}
      className="fixed bottom-4 left-4 z-[55] w-[min(360px,calc(100vw-2rem))] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden animate-quest-in"
    >
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">🎯</span>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{l.title}</div>
            <div className="text-xs opacity-90">{completedCount}/{l.quests.length} • {progressPct}%</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label={l.minimize}
            className="text-white/80 hover:text-white text-lg leading-none w-7 h-7 flex items-center justify-center rounded hover:bg-white/10"
          >
            −
          </button>
          <button
            type="button"
            onClick={handleSkip}
            aria-label={l.skip}
            className="text-white/80 hover:text-white text-lg leading-none w-7 h-7 flex items-center justify-center rounded hover:bg-white/10"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{l.subtitle}</p>

        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <ul className="space-y-2 mt-3">
          {l.quests.map((q) => {
            const done = !!state.completed[q.id];
            return (
              <li
                key={q.id}
                className={`rounded-xl border p-2.5 flex items-start gap-2.5 transition-colors ${
                  done
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span className="text-2xl flex-shrink-0" aria-hidden>{done ? "✅" : q.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${done ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                    {q.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{q.desc}</div>
                  {!done && (
                    <Link
                      to={q.link}
                      className="inline-block mt-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline"
                    >
                      {q.cta} →
                    </Link>
                  )}
                  <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">+{q.reward} 🪙</div>
                </div>
              </li>
            );
          })}
        </ul>

        {allDone && !state.claimed && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-xl border-2 border-amber-300 dark:border-amber-700">
            <div className="text-sm font-bold text-amber-900 dark:text-amber-200">🎁 {l.welcomeBonus}: +{BONUS_REWARD} 🪙</div>
            <button
              type="button"
              onClick={handleClaim}
              className="mt-2 w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-lg shadow active:scale-95 transition-all"
            >
              {l.claim}
            </button>
          </div>
        )}

        {state.claimed && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-center">
            <div className="text-2xl">🎉</div>
            <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{l.completed}</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">{l.completedDesc}</div>
          </div>
        )}
      </div>

      {celebrate && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-6xl animate-bounce-in">
          🎉
        </div>
      )}

      <style>{`
        @keyframes quest-in {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-quest-in { animation: quest-in 0.35s ease-out; }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}
