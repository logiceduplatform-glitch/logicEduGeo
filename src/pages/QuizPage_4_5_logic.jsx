import React, { useState, useContext, useCallback, useEffect, useRef } from "react";
import RightPanel from "../components/quiz/RightPanel";
import Navbar from "../components/Navbar";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { checkNewAchievements } from "../services/RewardsService";
import AchievementPopup from "../components/rewards/AchievementPopup";
import HowToPlayModal, { shouldShowTutorial } from "../components/HowToPlayModal";
import DifficultyNotification from "../components/DifficultyNotification";
import ShareScoreCard from "../components/ShareScoreCard";
import { DifficultyService } from "../services/DifficultyService";
import { EmptySearchState } from "../components/SkeletonLoader";

import MemoryMatch from "../components/games/exercises_2_3_1/MemoryMatch";
import PatternMatch from "../components/games/exercises_2_3_1/PatternMatch";
import OddOneOut from "../components/games/exercises_2_3_1/OddOneOut";
import SizeSorting from "../components/games/exercises_2_3_1/SizeSorting";
import SpotDifference from "../components/games/exercises_2_3_1/SpotDifference";
import FoodSorting from "../components/games/exercises_2_3_1/FoodSorting";

import PatternRecognitionGame from "../components/games/exercises_fun_shared/PatternRecognitionGame";
import GroupByCategoriesGame from "../components/games/exercises_fun_shared/GroupByCategoriesGame";
import SortBySizeGame from "../components/games/exercises_fun_shared/SortBySizeGame";
import PositionMemoryGame from "../components/games/exercises_fun_shared/PositionMemoryGame";
import WhichDisappearedGame from "../components/games/exercises_fun_shared/WhichDisappearedGame";
import WhichMovedGame from "../components/games/exercises_fun_shared/WhichMovedGame";
import FindOddOneOutGame from "../components/games/exercises_fun_shared/FindOddOneOutGame";
import MazeGame from "../components/games/exercises_fun_shared/MazeGame";
import FindHalfShapeGame from "../components/games/exercises_fun_shared/FindHalfShapeGame";
import CompleteSymmetryGame from "../components/games/exercises_fun_shared/CompleteSymmetryGame";
import MatchShapeObjectGame from "../components/games/exercises_fun_shared/MatchShapeObjectGame";
import FindMissingNumberGame from "../components/games/exercises_fun_shared/FindMissingNumberGame";
import WhichIsLessGame from "../components/games/exercises_fun_shared/WhichIsLessGame";
import WhatRemainsGame from "../components/games/exercises_fun_shared/WhatRemainsGame";
import RobotRequestsGame from "../components/games/exercises_fun_shared/RobotRequestsGame";
import GuessFromPiecesGame from "../components/games/exercises_fun_shared/GuessFromPiecesGame";
import FlippedShapesGame from "../components/games/exercises_fun_shared/FlippedShapesGame";
import WhatWasInBetweenGame from "../components/games/exercises_fun_shared/WhatWasInBetweenGame";

const SIDEBAR_CATEGORIES = [
  {
    id: "memory",
    icon: "🧠",
    title: { el: "Μνήμη & Παρατήρηση", en: "Memory & Observation" },
    color: "from-violet-500 to-purple-600",
    gameIds: ["memoryMatch", "positionMemory", "whichDisappeared", "whichMoved", "whatWasInBetween", "spotDifference"],
  },
  {
    id: "patterns",
    icon: "🔲",
    title: { el: "Μοτίβα & Ακολουθίες", en: "Patterns & Sequences" },
    color: "from-cyan-500 to-blue-600",
    gameIds: ["patternRecognition", "patternMatch", "findMissingNumber"],
  },
  {
    id: "spatial",
    icon: "🪞",
    title: { el: "Χώρος & Σχήματα", en: "Spatial & Shapes" },
    color: "from-fuchsia-500 to-pink-600",
    gameIds: ["findHalfShape", "completeSymmetry", "flippedShapes", "matchShapeObject"],
  },
  {
    id: "sorting",
    icon: "📦",
    title: { el: "Ταξινόμηση & Σύγκριση", en: "Sorting & Comparison" },
    color: "from-emerald-500 to-teal-600",
    gameIds: ["oddOneOut", "findOddOneOut", "groupByCategories", "sortBySize", "sizeSorting", "foodSorting", "whichIsLess"],
  },
  {
    id: "problem",
    icon: "🤖",
    title: { el: "Επίλυση Προβλημάτων", en: "Problem Solving" },
    color: "from-orange-500 to-red-600",
    gameIds: ["maze", "whatRemains", "robotRequests", "guessFromPieces"],
  },
];

const LOGIC_GAMES = [
  { id: "memoryMatch", title: { el: "Μνήμη", en: "Memory Match" }, icon: "🧠", description: { el: "Βρες τα ίδια ζευγάρια", en: "Find matching pairs" }, color: "from-violet-400 to-fuchsia-500" },
  { id: "patternRecognition", title: { el: "Αναγνώριση Μοτίβων", en: "Pattern Recognition" }, icon: "🔲", description: { el: "Βρες το σωστό μοτίβο", en: "Find the correct pattern" }, color: "from-cyan-400 to-blue-500" },
  { id: "oddOneOut", title: { el: "Βρες το Διαφορετικό", en: "Odd One Out" }, icon: "🤔", description: { el: "Ποιο δεν ταιριάζει;", en: "Which doesn't belong?" }, color: "from-orange-400 to-amber-500" },
  { id: "findOddOneOut", title: { el: "Ψάξε το Περίεργο", en: "Find the Odd" }, icon: "🔎", description: { el: "Βρες αυτό που ξεχωρίζει", en: "Find the one that stands out" }, color: "from-rose-400 to-pink-500" },
  { id: "maze", title: { el: "Λαβύρινθος", en: "Maze" }, icon: "🌀", description: { el: "Βρες το δρόμο!", en: "Find the way!" }, color: "from-emerald-400 to-teal-500" },
  { id: "groupByCategories", title: { el: "Ομαδοποίηση", en: "Group by Categories" }, icon: "📦", description: { el: "Βάλε τα αντικείμενα σε ομάδες", en: "Sort objects into groups" }, color: "from-blue-400 to-indigo-500" },
  { id: "sortBySize", title: { el: "Ταξινόμηση Μεγέθους", en: "Sort by Size" }, icon: "📏", description: { el: "Βάλε σε σειρά μεγέθους", en: "Arrange by size" }, color: "from-teal-400 to-emerald-500" },
  { id: "sizeSorting", title: { el: "Μικρό → Μεγάλο", en: "Small → Large" }, icon: "📐", description: { el: "Πάτα από μικρό σε μεγάλο", en: "Tap smallest to largest" }, color: "from-amber-400 to-yellow-500" },
  { id: "positionMemory", title: { el: "Μνήμη Θέσης", en: "Position Memory" }, icon: "📍", description: { el: "Θυμήσου πού ήταν!", en: "Remember where it was!" }, color: "from-purple-400 to-violet-500" },
  { id: "whichDisappeared", title: { el: "Τι Εξαφανίστηκε;", en: "What Disappeared?" }, icon: "👻", description: { el: "Ποιο αντικείμενο χάθηκε;", en: "Which object vanished?" }, color: "from-slate-400 to-gray-500" },
  { id: "whichMoved", title: { el: "Τι Μετακινήθηκε;", en: "What Moved?" }, icon: "🔄", description: { el: "Ποιο άλλαξε θέση;", en: "Which changed position?" }, color: "from-indigo-400 to-blue-500" },
  { id: "whatWasInBetween", title: { el: "Τι Ήταν Ανάμεσα;", en: "What Was In Between?" }, icon: "↔️", description: { el: "Θυμήσου τη σειρά!", en: "Remember the sequence!" }, color: "from-pink-400 to-rose-500" },
  { id: "findHalfShape", title: { el: "Βρες το Μισό", en: "Find Half Shape" }, icon: "◗", description: { el: "Ταίριαξε τα μισά σχήματα", en: "Match the shape halves" }, color: "from-sky-400 to-blue-500" },
  { id: "completeSymmetry", title: { el: "Συμμετρία", en: "Complete Symmetry" }, icon: "🪞", description: { el: "Ολοκλήρωσε τη συμμετρία", en: "Complete the symmetry" }, color: "from-fuchsia-400 to-purple-500" },
  { id: "flippedShapes", title: { el: "Ανεστραμμένα Σχήματα", en: "Flipped Shapes" }, icon: "🔀", description: { el: "Βρες το σωστό ανάποδο", en: "Find the correct flip" }, color: "from-lime-400 to-green-500" },
  { id: "matchShapeObject", title: { el: "Σχήμα → Αντικείμενο", en: "Shape → Object" }, icon: "🔷", description: { el: "Ταίριαξε σχήμα με αντικείμενο", en: "Match shape with object" }, color: "from-red-400 to-orange-500" },
  { id: "findMissingNumber", title: { el: "Βρες τον Αριθμό", en: "Find Missing Number" }, icon: "❓", description: { el: "Ποιος αριθμός λείπει;", en: "Which number is missing?" }, color: "from-green-400 to-emerald-500" },
  { id: "whichIsLess", title: { el: "Ποιο Είναι Λιγότερο;", en: "Which Is Less?" }, icon: "⚖️", description: { el: "Σύγκρινε ποσότητες", en: "Compare quantities" }, color: "from-yellow-400 to-amber-500" },
  { id: "whatRemains", title: { el: "Τι Μένει;", en: "What Remains?" }, icon: "➖", description: { el: "Αφαίρεσε και βρες", en: "Subtract and find out" }, color: "from-orange-400 to-red-500" },
  { id: "robotRequests", title: { el: "Εντολές Ρομπότ", en: "Robot Requests" }, icon: "🤖", description: { el: "Ακολούθησε τις εντολές", en: "Follow the commands" }, color: "from-gray-400 to-slate-500" },
  { id: "guessFromPieces", title: { el: "Μάντεψε από Κομμάτια", en: "Guess from Pieces" }, icon: "🧩", description: { el: "Τι δείχνει η εικόνα;", en: "What does the image show?" }, color: "from-violet-400 to-indigo-500" },
  { id: "spotDifference", title: { el: "Βρες Διαφορές", en: "Spot Differences" }, icon: "🔍", description: { el: "Βρες τις διαφορές", en: "Find the differences" }, color: "from-pink-400 to-red-500" },
  { id: "foodSorting", title: { el: "Ταξινόμηση Φαγητού", en: "Food Sorting" }, icon: "🍎", description: { el: "Ταξινόμησε τα φαγητά", en: "Sort the foods" }, color: "from-red-400 to-orange-500" },
  { id: "patternMatch", title: { el: "Μοτίβα (Απλά)", en: "Patterns (Simple)" }, icon: "🔳", description: { el: "Βρες το απλό μοτίβο", en: "Find the simple pattern" }, color: "from-teal-400 to-cyan-500" },
];

const GAME_MAP = Object.fromEntries(LOGIC_GAMES.map((g) => [g.id, g]));

const COMPONENT_MAP = {
  memoryMatch: MemoryMatch,
  patternRecognition: PatternRecognitionGame,
  oddOneOut: OddOneOut,
  findOddOneOut: FindOddOneOutGame,
  maze: MazeGame,
  groupByCategories: GroupByCategoriesGame,
  sortBySize: SortBySizeGame,
  sizeSorting: SizeSorting,
  positionMemory: PositionMemoryGame,
  whichDisappeared: WhichDisappearedGame,
  whichMoved: WhichMovedGame,
  whatWasInBetween: WhatWasInBetweenGame,
  findHalfShape: FindHalfShapeGame,
  completeSymmetry: CompleteSymmetryGame,
  flippedShapes: FlippedShapesGame,
  matchShapeObject: MatchShapeObjectGame,
  findMissingNumber: FindMissingNumberGame,
  whichIsLess: WhichIsLessGame,
  whatRemains: WhatRemainsGame,
  robotRequests: RobotRequestsGame,
  guessFromPieces: GuessFromPiecesGame,
  spotDifference: SpotDifference,
  foodSorting: FoodSorting,
  patternMatch: PatternMatch,
};

export default function QuizPage_4_5_logic() {
  const { lang } = useContext(LanguageContext);
  const { guest } = useContext(AuthContext);
  const progress = useProgress();
  const isEl = lang === "el";

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [tutorialGame, setTutorialGame] = useState(null);
  const [diffNotif, setDiffNotif] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:progress:favorites")) || []; } catch { return []; }
  });
  const sessionStartRef = useRef(null);

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

  const allGamesRaw = activeCategory
    ? LOGIC_GAMES.filter((g) => {
        const cat = SIDEBAR_CATEGORIES.find((c) => c.id === activeCategory);
        return cat?.gameIds.includes(g.id);
      })
    : LOGIC_GAMES;

  const filteredGames = searchQuery.trim()
    ? allGamesRaw.filter((g) => {
        const q = searchQuery.toLowerCase();
        return (
          (g.title[lang] || "").toLowerCase().includes(q) ||
          (g.title.el || "").toLowerCase().includes(q) ||
          (g.title.en || "").toLowerCase().includes(q) ||
          (g.description[lang] || "").toLowerCase().includes(q)
        );
      })
    : allGamesRaw;

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

  const currentDifficulty = activeGame ? DifficultyService.getDifficulty(activeGame) : 1;

  const startGame = useCallback((gameId) => {
    if (shouldShowTutorial(gameId)) {
      setTutorialGame(gameId);
    } else {
      setActiveGame(gameId);
      setResetCounter((p) => p + 1);
    }
  }, []);

  const handleTutorialStart = useCallback(() => {
    const id = tutorialGame;
    setTutorialGame(null);
    setActiveGame(id);
    setResetCounter((p) => p + 1);
  }, [tutorialGame]);

  const handleGameComplete = useCallback((result) => {
    if (activeGame) {
      progress.recordGameComplete({
        gameId: activeGame,
        title: activeGame,
        score: result?.score || 0,
        total: result?.total || 0,
        category: activeCategory || "logic",
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
    setShowCompletionModal(true);
  }, [activeGame, activeCategory, currentDifficulty, progress]);

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    setResetCounter((p) => p + 1);
  };

  const handleBackToGames = () => {
    setShowCompletionModal(false);
    setActiveGame(null);
  };

  const renderActiveGame = () => {
    const Comp = COMPONENT_MAP[activeGame];
    if (!Comp) return null;
    return <Comp key={resetCounter} lang={lang} onComplete={handleGameComplete} />;
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Navbar />

      <div className={`pt-16 ${activeGame ? "grid grid-cols-1 lg:grid-cols-[1fr_18rem]" : "grid grid-cols-1 lg:grid-cols-[auto_1fr_18rem]"}`}>
        {/* Sidebar -- matches FunQuizPage style */}
        {!activeGame && (
          <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
            <div className="p-3">
              <h2 className="px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
                🧩 {isEl ? "Λογική Σκέψη" : "Logical Thinking"}
              </h2>
              <nav className="space-y-2 mt-4">
                {SIDEBAR_CATEGORIES.map(({ id, icon, title, color }) => {
                  const isActive = activeCategory === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setActiveCategory(isActive ? null : id); setSearchQuery(""); }}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform",
                        isActive
                          ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                          : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102 shadow-sm",
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
        )}

        {/* Main content */}
        <main className="p-4 lg:p-6">
          {/* Title bar */}
          <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl p-4 shadow-lg">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              🧩 {activeGame
                ? (GAME_MAP[activeGame]?.title[lang] || "")
                : activeCategory
                  ? (SIDEBAR_CATEGORIES.find((c) => c.id === activeCategory)?.title[lang] || "")
                  : `${isEl ? "Ηλικία 4-5" : "Age 4-5"}: ${isEl ? "Λογική Σκέψη" : "Logical Thinking"}`}
            </h1>
            {guest?.age && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isEl ? "Ηλικία" : "Age"}: {guest.age}
                {guest.objective && <> — {isEl ? "Στόχος" : "Goal"}: {guest.objective}</>}
              </p>
            )}
          </div>

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
                      placeholder={isEl ? "Αναζήτηση παιχνιδιού..." : "Search games..."}
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

                {/* Category back on mobile */}
                {activeCategory && (
                  <div className="lg:hidden text-center mb-4">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <span className="text-xl">←</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isEl ? "Όλα τα Παιχνίδια" : "All Games"}
                      </span>
                    </button>
                  </div>
                )}

                {/* Recently played */}
                {!searchQuery && !activeCategory && recentGames.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span>🕐</span>
                      {isEl ? "Πρόσφατα" : "Recently Played"}
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {recentGames.map((rg) => {
                        const gameData = GAME_MAP[rg.gameId];
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
                      {isEl ? "Αγαπημένα" : "Favorites"}
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
                    {filteredGames.length} {isEl ? "αποτελέσματα" : "results"}
                  </p>
                )}

                {searchQuery && filteredGames.length === 0 && (
                  <EmptySearchState lang={lang} onClear={() => setSearchQuery("")} />
                )}

                {/* Game grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => startGame(game.id)}
                      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleToggleFavorite(e, game.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFavorite(e, game.id); } }}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                        title={isEl ? "Αγαπημένο" : "Favorite"}
                      >
                        <span className={`text-base ${favorites.includes(game.id) ? "text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {favorites.includes(game.id) ? "★" : "☆"}
                        </span>
                      </div>
                      <div className="relative p-6">
                        <div className="text-6xl mb-4">{game.icon}</div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                          {game.title[lang]}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {game.description[lang]}
                        </p>
                        <div className={`mt-4 inline-block px-4 py-2 bg-gradient-to-r ${game.color} text-white rounded-full text-sm font-semibold`}>
                          {isEl ? "Παίξε" : "Play"} →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleBackToGames}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <span className="text-xl">←</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isEl ? "Πίσω στα Παιχνίδια" : "Back to Games"}
                  </span>
                </button>

                {renderActiveGame()}
              </div>
            )}
          </div>
        </main>

        <RightPanel />
      </div>

      {newBadge && (
        <AchievementPopup
          achievementId={newBadge}
          lang={lang}
          onClose={() => setNewBadge(null)}
        />
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fadeIn">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">
              {isEl ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
              {isEl ? "Τα πήγες υπέροχα!" : "You did great!"}
            </p>
            {lastResult.total > 0 && (
              <div className="mb-4">
                <ShareScoreCard
                  score={lastResult.score}
                  total={lastResult.total}
                  gameName={activeGame || ""}
                  icon="🎮"
                />
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                {isEl ? "🔄 Παίξε Ξανά" : "🔄 Play Again"}
              </button>
              <button
                onClick={handleBackToGames}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {isEl ? "← Πίσω" : "← Back"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tutorialGame && (
        <HowToPlayModal
          gameId={tutorialGame}
          gameTitle={LOGIC_GAMES.find(g => g.id === tutorialGame)?.title[lang] || tutorialGame}
          gameIcon={LOGIC_GAMES.find(g => g.id === tutorialGame)?.icon}
          difficulty={DifficultyService.getDifficulty(tutorialGame)}
          onStart={handleTutorialStart}
          onClose={() => setTutorialGame(null)}
        />
      )}

      {diffNotif && (
        <DifficultyNotification
          direction={diffNotif.direction}
          newLevel={diffNotif.newLevel}
          onDone={() => setDiffNotif(null)}
        />
      )}
    </div>
  );
}
