import React, { useContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import DifficultyBadge from "../components/DifficultyBadge";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { DifficultyService } from "../services/DifficultyService";
import { ProfileService } from "../services/ProfileService";
import { AuthContext } from "../auth/AuthContext";
import { getGameCategories } from "../config/funGameConfig";
import { ADULT_GAME_CATEGORIES } from "../config/adultGameConfig";
import { GAMES as BOARD_GAMES } from "../components/games/board/BoardGamesSidebar";
import { ACTIVITIES } from "../config/activityConfig";
import { LOGIC_4_5_GAMES, SCHOOL_2_3_GAMES, FUN_2_3_GAMES, LOGIC_2_3_GAMES } from "../config/localGamesConfig";

function normalizeAge(raw) {
  if (!raw) return null;
  const s = raw.replace(/^Age\s*/i, "").replace("–", "-");
  if (["4-5", "6", "7-8", "9-10", "11-12"].includes(s)) return s;
  if (s === "2-3") return "4-5";
  return null;
}

function collectAllGames() {
  const results = [];
  const seen = new Set();

  const add = (game) => {
    if (seen.has(game.id)) return;
    seen.add(game.id);
    results.push(game);
  };

  const modes = ["fun", "logic"];
  const ALL_AGE_GROUPS = ["4-5", "6", "7-8", "9-10", "11-12"];
  for (const ag of ALL_AGE_GROUPS) {
    for (const mode of modes) {
      try {
        const cats = getGameCategories(ag, mode);
        if (cats) {
          for (const [catId, games] of Object.entries(cats)) {
            for (const g of games) {
              add({ ...g, source: "fun", ageGroup: ag, mode, categoryId: catId });
            }
          }
        }
      } catch {}
    }
  }

  const localGameSets = [
    { games: LOGIC_4_5_GAMES, ageGroup: "4-5", mode: "logic" },
    { games: SCHOOL_2_3_GAMES, ageGroup: "2-3", mode: "fun" },
    { games: FUN_2_3_GAMES, ageGroup: "2-3", mode: "fun" },
    { games: LOGIC_2_3_GAMES, ageGroup: "2-3", mode: "logic" },
  ];
  for (const { games, ageGroup: ag, mode } of localGameSets) {
    for (const g of games) {
      add({
        id: g.id,
        title: g.title,
        description: g.description || { el: "", en: "" },
        icon: g.icon,
        color: g.color || "from-slate-400 to-slate-600",
        source: "fun",
        ageGroup: ag,
        mode,
      });
    }
  }

  for (const cat of ADULT_GAME_CATEGORIES) {
    const gradient = cat.gradient || "from-slate-400 to-slate-600";
    for (const g of cat.games || []) {
      add({
        id: g.id,
        title: g.title,
        description: g.desc || g.description || { el: "", en: "" },
        icon: g.icon,
        color: gradient,
        source: "adult",
        categoryId: cat.id,
      });
    }
  }

  const QUIZ_CATS = [
    { id: "LogicMath",    label: { el: "Λογική & Μαθηματικά", en: "Logic & Math" },       icon: "🔢" },
    { id: "NaturalWorld", label: { el: "Φυσικός Κόσμος", en: "Natural World" },            icon: "🌿" },
    { id: "Adventures",   label: { el: "Γεωγραφία & Ιστορία", en: "Geography & History" }, icon: "🧭" },
    { id: "BrainTeasers", label: { el: "Γρίφοι & Αινίγματα", en: "Puzzles & Riddles" },    icon: "🧩" },
    { id: "Edutainment",  label: { el: "Τεχνολογία & Πολιτισμός", en: "Tech & Culture" },  icon: "🎮" },
    { id: "History",      label: { el: "Ιστορία & Πολιτισμός", en: "History & Civilization" }, icon: "📚" },
    { id: "Language",     label: { el: "Γλώσσα & Λογοτεχνία", en: "Language & Literature" }, icon: "💬" },
    { id: "Space",        label: { el: "Επιστήμη & Διάστημα", en: "Science & Space" },      icon: "🚀" },
    { id: "Politics",     label: { el: "Κόσμος & Πολιτική", en: "World & Politics" },       icon: "🌍" },
    { id: "Health",       label: { el: "Υγεία & Ευεξία", en: "Health & Wellness" },         icon: "❤️" },
    { id: "Art",          label: { el: "Τέχνη & Μουσική", en: "Art & Music" },               icon: "🎨" },
  ];
  for (const q of QUIZ_CATS) {
    add({
      id: `quiz_${q.id}`,
      title: q.label,
      description: { el: "Quiz γνώσεων", en: "Knowledge quiz" },
      icon: q.icon,
      color: "from-violet-500 to-purple-600",
      source: "adult",
      categoryId: "brainTraining",
    });
  }

  for (const g of BOARD_GAMES) {
    add({
      id: g.id,
      title: g.label,
      description: { el: "", en: "" },
      icon: g.icon,
      color: g.gradient || "from-indigo-400 to-blue-600",
      source: "board",
    });
  }

  if (ACTIVITIES) {
    for (const [catId, acts] of Object.entries(ACTIVITIES)) {
      for (const a of acts) {
        add({
          id: a.id,
          title: a.title,
          description: a.description || { el: "", en: "" },
          icon: a.icon,
          color: a.color || "from-blue-400 to-purple-500",
          source: "activity",
          categoryId: catId,
        });
      }
    }
  }

  return results;
}

const TABS = [
  { id: "favorites", icon: "★",  label: { el: "Αγαπημένα", en: "Favorites" } },
  { id: "recent",    icon: "🕐", label: { el: "Πρόσφατα", en: "Recent" } },
  { id: "progress",  icon: "📊", label: { el: "Με πρόοδο", en: "With progress" } },
];

function GameCard({ game, lang, onPlay, onRemoveFav, showFavButton, tab }) {
  const isEl = lang === "el";
  const difficulty = DifficultyService.getDifficulty(game.id);

  const sourceLabel = {
    fun: { el: "Παιχνίδια", en: "Games" },
    adult: { el: "Ενήλικες", en: "Adult" },
    board: { el: "Επιτραπέζια", en: "Board" },
    activity: { el: "Δραστηριότητες", en: "Activities" },
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
      {/* Gradient accent top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${game.color || "from-purple-500 to-pink-500"}`} />

      <div className="flex-1 p-5">
        {/* Header: icon + info + fav */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color || "from-purple-400 to-pink-500"} flex items-center justify-center text-2xl shadow-md shrink-0`}>
            {game.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {game.title?.[isEl ? "el" : "en"] || game.title?.el || game.id}
            </h3>
            {game.description?.[isEl ? "el" : "en"] && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {game.description[isEl ? "el" : "en"]}
              </p>
            )}
          </div>
          {showFavButton && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemoveFav(game.id); }}
              className="shrink-0 w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-400 transition-all hover:scale-110"
              title={isEl ? "Αφαίρεση" : "Remove"}
            >
              ★
            </button>
          )}
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3 min-h-[24px]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
            {sourceLabel[game.source]?.[isEl ? "el" : "en"] || game.source}
          </span>
          {difficulty > 1 && (
            <DifficultyBadge level={difficulty} lang={lang} />
          )}
          {game.gamesPlayed != null && (
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/20">
              {game.gamesPlayed}x
            </span>
          )}
          {game.bestScore != null && game.bestScore > 0 && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20">
              ★ {game.bestScore}
            </span>
          )}
          {game.lastScore != null && game.lastTotal != null && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20">
              {game.lastScore}/{game.lastTotal}
            </span>
          )}
        </div>
      </div>

      {/* Play button */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onPlay(game)}
          className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${game.color || "from-purple-500 to-pink-500"} text-white text-sm font-bold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98]`}
        >
          {isEl ? "Παίξε" : "Play"} →
        </button>
      </div>
    </div>
  );
}

export default function MyGamesPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { guest, userProfile } = useContext(AuthContext);
  const isEl = lang === "el";

  const activeChild = ProfileService.getActive();

  const [activeTab, setActiveTab] = useState("favorites");
  const rawAge = activeChild?.age || userProfile?.age || guest?.age || null;
  const ageGroup = normalizeAge(rawAge);

  const allGames = useMemo(() => collectAllGames(), []);

  const [favorites, setFavorites] = useState(() => ProgressService.getFavorites());
  const recentList = useMemo(() => ProgressService.getRecentGames(), []);
  const allProgress = useMemo(() => ProgressService.getAllGameProgress(), []);

  const favoriteGames = useMemo(
    () => favorites.map((id) => allGames.find((g) => g.id === id)).filter(Boolean),
    [favorites, allGames],
  );

  const recentGames = useMemo(() => {
    return recentList
      .map((r) => {
        const meta = allGames.find((g) => g.id === r.gameId);
        return meta ? { ...meta, lastScore: r.score, lastTotal: r.total } : null;
      })
      .filter(Boolean);
  }, [recentList, allGames]);

  const progressGames = useMemo(() => {
    return Object.entries(allProgress || {})
      .map(([key, data]) => {
        const gameId = key.replace(/^progress:game:/, "");
        const meta = allGames.find((g) => g.id === gameId);
        if (!meta || !data.gamesPlayed) return null;
        return {
          ...meta,
          gamesPlayed: data.gamesPlayed,
          bestScore: data.bestScore,
          totalCorrect: data.totalCorrect,
          totalAttempts: data.totalAttempts,
          currentDifficulty: data.currentDifficulty,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed);
  }, [allProgress, allGames]);

  const displayGames =
    activeTab === "favorites" ? favoriteGames
    : activeTab === "recent" ? recentGames
    : progressGames;

  const handleRemoveFavorite = useCallback((gameId) => {
    const updated = ProgressService.toggleFavorite(gameId);
    setFavorites([...updated]);
  }, []);

  const handlePlayGame = useCallback((game) => {
    if (game.source === "adult") {
      navigate(`/play/adult-games/${game.categoryId}`);
    } else if (game.source === "board") {
      navigate("/play/board-games");
    } else if (game.source === "activity") {
      const ag = game.ageGroup || ageGroup || "7-8";
      navigate(`/play/${ag}`);
    } else {
      const ag = game.ageGroup || ageGroup;
      const routeMap = {
        "4-5": `/play/4-5-${game.mode || "fun"}`,
        "6":   `/play/6-${game.mode || "fun"}`,
        "7-8": `/play/7-8-${game.mode || "fun"}`,
        "9-10": `/play/9-10-${game.mode || "fun"}`,
        "11-12": `/play/11-12-${game.mode || "fun"}`,
      };
      navigate(routeMap[ag] || "/play");
    }
  }, [navigate, ageGroup]);

  const emptyConfig = {
    favorites: {
      icon: "⭐",
      title: { el: "Κανένα αγαπημένο ακόμα", en: "No favorites yet" },
      desc: { el: "Πάτα το ★ σε οποιοδήποτε παιχνίδι για να το αποθηκεύσεις εδώ!", en: "Tap the ★ on any game to save it here!" },
    },
    recent: {
      icon: "🕐",
      title: { el: "Δεν έχεις παίξει ακόμα", en: "No recent games" },
      desc: { el: "Τα παιχνίδια που παίζεις θα εμφανίζονται εδώ.", en: "Games you play will appear here." },
    },
    progress: {
      icon: "📊",
      title: { el: "Δεν υπάρχει πρόοδος", en: "No progress yet" },
      desc: { el: "Ξεκίνα να παίζεις για να δεις την πρόοδό σου!", en: "Start playing to track your progress!" },
    },
  };

  const tabCounts = {
    favorites: favorites.length,
    recent: recentGames.length,
    progress: progressGames.length,
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={isEl ? "Τα Παιχνίδια μου" : "My Games"} />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
              ⭐
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                {isEl ? "Τα Παιχνίδια μου" : "My Games"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isEl ? "Αγαπημένα, πρόσφατα και πρόοδος σε ένα μέρος" : "Favorites, recent, and progress in one place"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => {
            const count = tabCounts[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0",
                  isActive
                    ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-md border-2 border-purple-200 dark:border-purple-700"
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400",
                ].join(" ")}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label[isEl ? "el" : "en"]}</span>
                <span className="sm:hidden">{tab.label[isEl ? "el" : "en"]}</span>
                {count > 0 && (
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {displayGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-5xl mb-6 shadow-inner">
              {emptyConfig[activeTab].icon}
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 text-center">
              {emptyConfig[activeTab].title[isEl ? "el" : "en"]}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm">
              {emptyConfig[activeTab].desc[isEl ? "el" : "en"]}
            </p>
            <button
              onClick={() => navigate("/play")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {isEl ? "Εξερεύνησε παιχνίδια" : "Explore games"} →
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              {displayGames.length} {isEl ? "παιχνίδια" : "games"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  lang={lang}
                  onPlay={handlePlayGame}
                  onRemoveFav={handleRemoveFavorite}
                  showFavButton={activeTab === "favorites"}
                  tab={activeTab}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
