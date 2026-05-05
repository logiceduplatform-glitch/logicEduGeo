import React, { useState, useContext, useCallback, useEffect, useRef, useMemo, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RightPanel from "../components/quiz/RightPanel";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { DifficultyService } from "../services/DifficultyService";
import { VoiceService } from "../services/VoiceService";
import { GAME_INSTRUCTIONS } from "../config/gameInstructions";
import VoiceButton from "../components/ui/VoiceButton";
import AchievementPopup from "../components/rewards/AchievementPopup";
import { checkNewAchievements } from "../services/RewardsService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { useSubscription } from "../contexts/SubscriptionContext";
import { PremiumContentService } from "../services/PremiumContentService";
import { FeatureFlagService } from "../services/FeatureFlagService";
import { useFocusTrap } from "../hooks/useFocusTrap";
import LockedGameOverlay from "../components/LockedGameOverlay";
import PaywallModal from "../components/PaywallModal";
import DifficultyBadge from "../components/DifficultyBadge";
import HowToPlayModal, { shouldShowTutorial } from "../components/HowToPlayModal";
import DifficultyNotification from "../components/DifficultyNotification";
import RecommendedGames from "../components/RecommendedGames";
import GameRating from "../components/GameRating";
import ShareScoreCard from "../components/ShareScoreCard";
import Breadcrumb from "../components/Breadcrumb";
import { GameSkeleton } from "../components/SkeletonLoader";
import { AnalyticsService } from "../services/AnalyticsService";
import { SoundService } from "../services/SoundService";
import {
  FUN_AGE_CONFIG,
  GAME_ID_TO_COMPONENT,
  SIDEBAR_CATEGORIES,
  FUN_SIDEBAR_CATEGORIES,
  LOGIC_SIDEBAR_CATEGORIES,
  FUN_1112_SIDEBAR_CATEGORIES,
  LOGIC_1112_SIDEBAR_CATEGORIES,
  getGameCategories,
} from "../config/funGameConfig";

// ─── Build component registries via import.meta.glob (lazy) ─────────────────

const puzzleModules = import.meta.glob("../components/puzzles/*.jsx");
const baseModules = import.meta.glob("../components/games/exercises_2_3_1/*.jsx");
const funSharedModules = import.meta.glob("../components/games/exercises_fun_shared/*.jsx");
const ageModules = import.meta.glob("../components/games/exercises_{4_5_1,6_1,7_8_1,9_10_1,11_12_1}/*.jsx");

function extractName(path) {
  const m = path.match(/\/([^/.]+)\.jsx$/);
  return m ? m[1] : null;
}

function buildFlatRegistry(modules) {
  const reg = {};
  for (const [path, loader] of Object.entries(modules)) {
    const name = extractName(path);
    if (name) reg[name] = React.lazy(() => loader());
  }
  return reg;
}

function buildGroupedRegistry(modules) {
  const reg = {};
  for (const [path, loader] of Object.entries(modules)) {
    const m = path.match(/exercises_([^/]+)\/([^.]+)\.jsx$/);
    if (m) {
      const [, folder, name] = m;
      if (!reg[folder]) reg[folder] = {};
      reg[folder][name] = React.lazy(() => loader());
    }
  }
  return reg;
}

const PUZZLE_REG = buildFlatRegistry(puzzleModules);
const BASE_REG = buildFlatRegistry(baseModules);
const FUN_SHARED_REG = buildFlatRegistry(funSharedModules);
const AGE_REG = buildGroupedRegistry(ageModules);

function resolveComponent(ageGroup, gameId) {
  const mapping = GAME_ID_TO_COMPONENT[gameId];
  if (!mapping) return null;

  const { component, source } = mapping;
  if (source === "puzzle") return PUZZLE_REG[component] ?? null;
  if (source === "base") return BASE_REG[component] ?? null;

  const folderKey = FUN_AGE_CONFIG[ageGroup]?.folderKey;
  if (!folderKey) return null;
  return AGE_REG[folderKey]?.[component]
    ?? FUN_SHARED_REG[component]
    ?? BASE_REG[component]
    ?? null;
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

function FunSidebar({ active, onSelect, lang, categories, sidebarTitle }) {
  return (
    <aside className="w-full sm:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
      <div className="p-3">
        <h2 className="px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
          {sidebarTitle}
        </h2>
        <nav className="space-y-2 mt-4">
          {categories.map(({ id, icon, title, color }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect?.(id)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform",
                  isActive
                    ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                    : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] shadow-sm",
                ].join(" ")}
              >
                <span className="text-2xl">{icon}</span>
                <span className="truncate flex-1 text-left">{title[lang]}</span>
                {isActive && (
                  <span className="ml-auto inline-block h-3 w-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function FunQuizPage({ ageGroup: ageGroupProp, mode }) {
  const params = useParams();
  const ageGroup = ageGroupProp || params.ageGroup;
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastResult, setLastResult] = useState({ score: 0, total: 0 });
  const [resetCounter, setResetCounter] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tutorialGame, setTutorialGame] = useState(null);
  const [diffNotif, setDiffNotif] = useState(null);
  const { lang } = useContext(LanguageContext);
  const { guest, incrementGuestPlay } = useContext(AuthContext);
  const { isPremium } = useSubscription();
  const subsEnabled = FeatureFlagService.isEnabled("subs_enabled");
  const ageKey = (ageGroup || "").replace(/-/g, "_");
  const isGameLocked = useCallback((gameId) => {
    if (!subsEnabled) return false;
    if (isPremium) return false;
    return PremiumContentService.isGameLocked(ageKey, mode || "fun", gameId);
  }, [subsEnabled, isPremium, ageKey, mode]);
  const progress = useProgress();
  const navigate = useNavigate();
  const sessionStartRef = useRef(null);
  const completionTrapRef = useFocusTrap(showCompletionModal);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (activeGame) {
      sessionStartRef.current = Date.now();
    } else if (sessionStartRef.current) {
      const minutes = Math.round((Date.now() - sessionStartRef.current) / 60000);
      if (minutes > 0) {
        import("../services/ProgressService").then(({ ProgressService }) => {
          ProgressService.addMinutesPlayed(minutes);
        });
      }
      sessionStartRef.current = null;
    }
  }, [activeGame]);

  useEffect(() => {
    if (activeGame && GAME_INSTRUCTIONS[activeGame]) {
      const isYoung = ["2-3", "4-5"].includes(ageGroup);
      if (isYoung && VoiceService.isEnabled()) {
        const timer = setTimeout(() => {
          const instruction = GAME_INSTRUCTIONS[activeGame];
          VoiceService.speak(instruction[lang] || instruction.el, lang);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [activeGame, ageGroup, lang]);

  const config = FUN_AGE_CONFIG[ageGroup];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-600">
          {lang === "el" ? "Δεν βρέθηκε η ηλικιακή ομάδα." : "Age group not found."}
        </p>
      </div>
    );
  }

  const gameCategories = getGameCategories(ageGroup, mode);
  const sidebarCategories = ageGroup === "11-12"
    ? (mode === "logic" ? LOGIC_1112_SIDEBAR_CATEGORIES : FUN_1112_SIDEBAR_CATEGORIES)
    : mode === "logic"
      ? LOGIC_SIDEBAR_CATEGORIES
      : mode === "fun"
        ? FUN_SIDEBAR_CATEGORIES
        : SIDEBAR_CATEGORIES;
  const sidebarTitle = mode === "logic"
    ? "🧩 " + (lang === "el" ? "Λογική Σκέψη" : "Logic")
    : "🎮 " + (lang === "el" ? "Παιχνίδια" : "Games");

  const currentDifficulty = activeGame ? DifficultyService.getDifficulty(activeGame) : 1;

  const startGame = useCallback((gameId) => {
    AnalyticsService.gameStart(gameId, activeCategory || mode || "fun");
    SoundService.gameStart();
    if (shouldShowTutorial(gameId)) {
      setTutorialGame(gameId);
    } else {
      setActiveGame(gameId);
    }
  }, [activeCategory, mode]);

  const handleTutorialStart = useCallback(() => {
    const id = tutorialGame;
    setTutorialGame(null);
    setActiveGame(id);
  }, [tutorialGame]);

  const handleGameComplete = useCallback((result) => {
    if (result && activeGame) {
      const { score, total } = result;
      progress.recordGameComplete({
        gameId: activeGame,
        title: activeGame,
        score: score || 0,
        total: total || 0,
        category: activeCategory || "general",
        difficulty: currentDifficulty,
      });
      const diffResult = DifficultyService.evaluate(activeGame);
      if (diffResult.changed) {
        setDiffNotif({ direction: diffResult.direction, newLevel: diffResult.newLevel });
      }
      const badges = checkNewAchievements(progress);
      if (badges.length > 0) {
        badges.forEach((id) => progress.unlockAchievement(id));
        setNewBadge(badges[0]);
      }
    }
    if (result) setLastResult({ score: result.score || 0, total: result.total || 0 });
    if (guest) incrementGuestPlay();
    setShowCompletionModal(true);
  }, [activeGame, activeCategory, currentDifficulty, progress, guest, incrementGuestPlay]);

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    setResetCounter((prev) => prev + 1);
  };

  const handleBackToGames = () => {
    setActiveGame(null);
    setShowCompletionModal(false);
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setActiveGame(null);
    setShowCompletionModal(false);
  };

  const GameComponent = activeGame
    ? resolveComponent(ageGroup, activeGame)
    : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:progress:favorites")) || []; } catch { return []; }
  });

  const allGamesRaw = useMemo(() => {
    const raw = activeCategory
      ? (gameCategories[activeCategory] || [])
      : Object.values(gameCategories).flat();
    // Filter out games that the admin has disabled via per-game flags.
    return raw.filter((g) =>
      FeatureFlagService.isGameEnabled(ageKey, mode || "fun", g.id)
    );
  }, [activeCategory, gameCategories, ageKey, mode]);

  const allGames = useMemo(() =>
    searchQuery.trim()
      ? allGamesRaw.filter((g) => {
          const q = searchQuery.toLowerCase();
          return (
            g.title[lang]?.toLowerCase().includes(q) ||
            g.title.el?.toLowerCase().includes(q) ||
            g.title.en?.toLowerCase().includes(q) ||
            g.description[lang]?.toLowerCase().includes(q)
          );
        })
      : allGamesRaw,
    [searchQuery, allGamesRaw, lang]
  );

  const recentGames = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem("geo:progress:recentList")) || [];
      return list.slice(0, 4);
    } catch { return []; }
  }, [activeGame]);

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    import("../services/ProgressService").then(({ ProgressService }) => {
      const updated = ProgressService.toggleFavorite(gameId);
      setFavorites([...updated]);
    });
  };

  const favoriteGames = allGamesRaw.filter((g) => favorites.includes(g.id));

  return (
    <div id="main-content" className={`min-h-screen bg-gradient-to-br ${config.gradient}`}>
      <SEO title={`${lang === "el" ? "Ηλικία" : "Age"} ${ageGroup} — ${sidebarTitle}`} />
      <Navbar />
      <div
        className={`pt-16 ${
          activeGame
            ? "grid grid-cols-1 lg:grid-cols-[1fr_18rem]"
            : "grid grid-cols-1 lg:grid-cols-[auto_1fr_18rem]"
        }`}
      >
      {/* Mobile category tabs */}
      {!activeGame && (
        <div className="lg:hidden px-3 pb-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={[
                "flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0",
                activeCategory === null
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              ].join(" ")}
            >
              {lang === "el" ? "Όλα" : "All"}
            </button>
            {sidebarCategories.map(({ id, icon, title, color }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={[
                  "flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0",
                  activeCategory === id
                    ? `bg-gradient-to-r ${color} text-white shadow-md`
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                ].join(" ")}
              >
                <span>{icon}</span>
                {title[lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!activeGame && (
        <div className="hidden lg:block">
          <FunSidebar
            active={activeCategory}
            onSelect={setActiveCategory}
            lang={lang}
            categories={sidebarCategories}
            sidebarTitle={sidebarTitle}
          />
        </div>
      )}

      {/* Main content */}
      <main className="p-4 lg:p-6">
        {/* Title bar */}
        <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h1
            className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.titleGradient}`}
          >
            {mode === "logic" ? "🧩" : "🎮"}{" "}
            {mode === "logic"
              ? (lang === "el"
                ? `Ηλικία ${ageGroup}: Λογική Σκέψη`
                : `Age ${ageGroup}: Logic`)
              : config.title[lang]}
          </h1>
          {guest?.age && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "el" ? "Ηλικία" : "Age"}: {guest.age} —{" "}
              {lang === "el" ? "Στόχος" : "Goal"}: {guest.objective}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {!activeGame ? (
            <div>
              {/* Search bar */}
              <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "el" ? "Αναζήτηση παιχνιδιού..." : "Search games..."}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur border-2 border-white/50 dark:border-slate-700 shadow-md focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category header */}
              <div className="text-center mb-6">
                {activeCategory ? (
                  <button
                    onClick={handleBackToCategories}
                    className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="text-xl">←</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {lang === "el" ? "Όλα τα Παιχνίδια" : "All Games"}
                    </span>
                  </button>
                ) : null}
              </div>

              {/* Recently played */}
              {!searchQuery && !activeCategory && recentGames.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <span>🕐</span>
                    {lang === "el" ? "Πρόσφατα" : "Recently Played"}
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {recentGames.map((rg) => {
                      const gameData = allGamesRaw.find((g) => g.id === rg.gameId);
                      if (!gameData) return null;
                      return (
                        <button
                          key={rg.gameId}
                          onClick={() => startGame(rg.gameId)}
                          className="shrink-0 flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-white/50 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gameData.color} flex items-center justify-center text-lg shadow-sm`}>
                            {gameData.icon}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{gameData.title[lang]}</p>
                            <p className="text-xs text-slate-400">{rg.score}/{rg.total}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Favorites */}
              {!searchQuery && !activeCategory && favoriteGames.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <span>⭐</span>
                    {lang === "el" ? "Αγαπημένα" : "Favorites"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteGames.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => startGame(game.id)}
                        className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-3"
                      >
                        <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                          {game.icon}
                        </span>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{game.title[lang]}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{game.description[lang]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search results count */}
              {searchQuery && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
                  {allGames.length} {lang === "el" ? "αποτελέσματα" : "results"}
                </p>
              )}

              {searchQuery && allGames.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4" aria-hidden="true">🔍</span>
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    {lang === "el" ? "Δεν βρέθηκαν παιχνίδια" : "No games found"}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                    {lang === "el" ? "Δοκίμασε διαφορετική αναζήτηση" : "Try a different search"}
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors active:scale-95"
                  >
                    {lang === "el" ? "Καθαρισμός" : "Clear search"}
                  </button>
                </div>
              )}

              {/* Game grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allGames?.map((game) => {
                  const locked = isGameLocked(game.id);
                  return (
                  <div
                    key={game.id}
                    role="group"
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={() => locked ? setShowPaywall(true) : startGame(game.id)}
                  >
                    {locked && <LockedGameOverlay lang={lang} onClick={() => setShowPaywall(true)} />}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    />
                    {!locked && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleFavorite(e, game.id); }}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                      aria-label={lang === "el" ? "Αγαπημένο" : "Favorite"}
                    >
                      <span className={`text-base ${favorites.includes(game.id) ? "text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                        {favorites.includes(game.id) ? "★" : "☆"}
                      </span>
                    </button>
                    )}
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-6xl">{game.icon}</div>
                        {!locked && DifficultyService.getDifficulty(game.id) > 1 && (
                          <DifficultyBadge level={DifficultyService.getDifficulty(game.id)} lang={lang} />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {game.title[lang]}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {game.description[lang]}
                      </p>
                      <div className={`mt-4 inline-block px-4 py-2 ${locked ? "bg-slate-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} text-white rounded-full text-sm font-semibold`}>
                        {locked ? (lang === "el" ? "Premium" : "Premium") : (lang === "el" ? "Παίξε" : "Play")} →
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <Breadcrumb items={[
                { label: `${lang === "el" ? "Ηλικία" : "Age"} ${ageGroup}`, icon: mode === "logic" ? "🧩" : "🎮", onClick: handleBackToCategories },
                ...(activeCategory ? [{ label: sidebarCategories.find(c => c.id === activeCategory)?.title[lang] || activeCategory, onClick: handleBackToGames }] : []),
                { label: allGamesRaw.find(g => g.id === activeGame)?.title[lang] || activeGame },
              ]} />

              <button
                onClick={handleBackToGames}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all min-h-[44px]"
              >
                <span className="text-xl">←</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "el" ? "Πίσω στα Παιχνίδια" : "Back to Games"}
                </span>
              </button>

              <div>
                {activeGame && GAME_INSTRUCTIONS[activeGame] && (
                  <div className="mb-3 flex justify-end">
                    <VoiceButton gameId={activeGame} lang={lang} />
                  </div>
                )}
                {GameComponent ? (
                  <Suspense fallback={<GameSkeleton />}>
                    <GameComponent
                      key={`${ageGroup}-${activeGame}-${resetCounter}`}
                      lang={lang}
                      difficulty={currentDifficulty}
                      onComplete={handleGameComplete}
                      onProgressUpdate={(data) =>
                        progress.updateInProgress({
                          title: activeGame,
                          index: data?.index || 0,
                          length: data?.total || 0,
                          score: data?.score || 0,
                        })
                      }
                    />
                  </Suspense>
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    {lang === "el"
                      ? "Το παιχνίδι δεν βρέθηκε."
                      : "Game not found."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <RightPanel />
      </div>

      {/* Achievement Popup */}
      {newBadge && (
        <AchievementPopup
          achievementId={newBadge}
          lang={lang}
          onClose={() => setNewBadge(null)}
        />
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label={lang === "el" ? "Ολοκλήρωση" : "Completion"}>
          <div ref={completionTrapRef} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fadeIn">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
              {lang === "el" ? "Τα πήγες υπέροχα!" : "You did great!"}
            </p>
            {activeGame && (
              <div className="flex justify-center mb-4">
                <GameRating gameId={activeGame} />
              </div>
            )}
            {lastResult.total > 0 && (
              <div className="mb-4">
                <ShareScoreCard
                  score={lastResult.score}
                  total={lastResult.total}
                  gameName={allGamesRaw.find(g => g.id === activeGame)?.title[lang] || activeGame}
                  icon={allGamesRaw.find(g => g.id === activeGame)?.icon || "🎮"}
                />
              </div>
            )}
            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                {lang === "el" ? "🔄 Παίξε Ξανά" : "🔄 Play Again"}
              </button>
              <button
                onClick={handleBackToGames}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {lang === "el" ? "← Πίσω" : "← Back"}
              </button>
            </div>
            <RecommendedGames
              games={Object.values(gameCategories).flat()}
              onGameSelect={(id) => { setShowCompletionModal(false); startGame(id); }}
            />
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {tutorialGame && (
        <HowToPlayModal
          gameId={tutorialGame}
          gameTitle={allGamesRaw.find(g => g.id === tutorialGame)?.title[lang] || tutorialGame}
          gameIcon={allGamesRaw.find(g => g.id === tutorialGame)?.icon}
          difficulty={DifficultyService.getDifficulty(tutorialGame)}
          onStart={handleTutorialStart}
          onClose={() => setTutorialGame(null)}
        />
      )}

      {/* Difficulty Notification */}
      {diffNotif && (
        <DifficultyNotification
          direction={diffNotif.direction}
          newLevel={diffNotif.newLevel}
          onDone={() => setDiffNotif(null)}
        />
      )}

      {showPaywall && (
        <PaywallModal lang={lang} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
