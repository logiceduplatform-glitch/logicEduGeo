import React, { useState, useContext, useCallback, useEffect, useRef, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RightPanel from "../components/quiz/RightPanel";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { useProgress } from "../contexts/ProgressContext";
import { DifficultyService } from "../services/DifficultyService";
import { checkNewAchievements } from "../services/RewardsService";
import AchievementPopup from "../components/rewards/AchievementPopup";
import HowToPlayModal, { shouldShowTutorial } from "../components/HowToPlayModal";
import DifficultyNotification from "../components/DifficultyNotification";
import ShareScoreCard from "../components/ShareScoreCard";
import { ProgressService } from "../services/ProgressService";
import {
  AGE_GROUP_CONFIG,
  ACTIVITY_TO_COMPONENT,
  getCategoriesForAge,
  getActivitiesForAge,
} from "../config/activityConfig";
import { GameSkeleton } from "../components/SkeletonLoader";
import { AnalyticsService } from "../services/AnalyticsService";
import { SoundService } from "../services/SoundService";

const sharedModules = import.meta.glob("../components/games/exercises_shared/*.jsx");
const ageSpecificModules = import.meta.glob("../components/games/exercises_{7_8,4_5_1,6_1,7_8_1,9_10_1,11_12_1}/*.jsx");

const FOLDER_TO_KEY = {
  "7_8": "7_8", "4_5_1": "4_5", "6_1": "6",
  "7_8_1": "7_8", "9_10_1": "9_10", "11_12_1": "11_12",
};

function buildRegistries() {
  const shared = {};
  for (const [path, loader] of Object.entries(sharedModules)) {
    const match = path.match(/\/([^/.]+)\.jsx$/);
    if (match) shared[match[1]] = React.lazy(() => loader());
  }

  const overrides = {};
  for (const [path, loader] of Object.entries(ageSpecificModules)) {
    const match = path.match(/exercises_([^/]+)\/([^.]+)\.jsx$/);
    if (match) {
      const key = FOLDER_TO_KEY[match[1]] || match[1];
      if (!overrides[key]) overrides[key] = {};
      overrides[key][match[2]] = React.lazy(() => loader());
    }
  }

  return { shared, overrides };
}

const { shared: SHARED_EXERCISES, overrides: AGE_OVERRIDES } = buildRegistries();

function getExerciseComponent(ageGroup, activityId) {
  const config = AGE_GROUP_CONFIG[ageGroup];
  if (!config) return null;
  const componentName = ACTIVITY_TO_COMPONENT[activityId];
  if (!componentName) return null;
  return AGE_OVERRIDES[config.folderKey]?.[componentName]
    ?? SHARED_EXERCISES[componentName]
    ?? null;
}

export default function ActivityQuizPage({ ageGroup: ageGroupProp }) {
  const params = useParams();
  const ageGroup = ageGroupProp || params.ageGroup;
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [tutorialGame, setTutorialGame] = useState(null);
  const [diffNotif, setDiffNotif] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastResult, setLastResult] = useState({ score: 0, total: 0 });
  const [favorites, setFavorites] = useState(() => ProgressService.getFavorites());
  const { lang } = useContext(LanguageContext);
  const { guest } = useContext(AuthContext);

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    const updated = ProgressService.toggleFavorite(gameId);
    setFavorites([...updated]);
  };
  const progress = useProgress();
  const navigate = useNavigate();
  const sessionStartRef = useRef(null);

  useEffect(() => {
    if (activeActivity) {
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
  }, [activeActivity]);

  const config = AGE_GROUP_CONFIG[ageGroup];
  const ageCategories = getCategoriesForAge(ageGroup);
  const ageActivities = getActivitiesForAge(ageGroup);

  const currentDifficulty = activeActivity ? DifficultyService.getDifficulty(activeActivity) : 1;

  const allActivities = activeCategory
    ? (ageActivities[activeCategory] || [])
    : Object.values(ageActivities).flat();

  const filteredActivities = searchQuery.trim()
    ? allActivities.filter((a) => {
        const q = searchQuery.toLowerCase();
        return (
          (a.title[lang] || "").toLowerCase().includes(q) ||
          (a.title.el || "").toLowerCase().includes(q) ||
          (a.title.en || "").toLowerCase().includes(q) ||
          (a.description[lang] || "").toLowerCase().includes(q)
        );
      })
    : allActivities;

  const startActivity = useCallback((actId) => {
    AnalyticsService.gameStart(actId, activeCategory || ageGroup);
    SoundService.gameStart();
    if (shouldShowTutorial(actId)) {
      setTutorialGame(actId);
    } else {
      setActiveActivity(actId);
      setResetCounter((p) => p + 1);
      setShowCompletionModal(false);
    }
  }, [activeCategory, ageGroup]);

  const handleTutorialStart = useCallback(() => {
    const id = tutorialGame;
    setTutorialGame(null);
    setActiveActivity(id);
    setResetCounter((p) => p + 1);
    setShowCompletionModal(false);
  }, [tutorialGame]);

  const handleActivityComplete = useCallback((result) => {
    if (result && activeActivity) {
      const { score, total } = result;
      progress.recordGameComplete({
        gameId: activeActivity,
        title: activeActivity,
        score: score || 0,
        total: total || 0,
        category: activeCategory || "general",
        difficulty: currentDifficulty,
      });
      const diffResult = DifficultyService.evaluate(activeActivity);
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
  }, [activeActivity, activeCategory, currentDifficulty, progress]);

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    setResetCounter((prev) => prev + 1);
  };

  const handleBackToActivities = () => {
    setActiveActivity(null);
    setShowCompletionModal(false);
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Δεν βρέθηκε η ηλικιακή ομάδα." : "Age group not found."}
        </p>
      </div>
    );
  }

  const ExerciseComponent = activeActivity
    ? getExerciseComponent(ageGroup, activeActivity)
    : null;

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={`${lang === "el" ? "Ηλικία" : "Age"} ${ageGroup} — ${lang === "el" ? "Σχολείο" : "School"}`} />
      <Navbar />
      <div className={`pt-16 ${activeActivity ? "grid grid-cols-1 lg:grid-cols-[1fr_18rem]" : "grid grid-cols-1 lg:grid-cols-[auto_1fr_18rem]"}`}>

      {/* Mobile category strip */}
      {!activeActivity && (
        <div className="lg:hidden sticky top-16 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-hide" aria-label={lang === "el" ? "Κατηγορίες" : "Categories"}>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                !activeCategory
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>🎓</span>
              {lang === "el" ? "Όλα" : "All"}
            </button>
            {ageCategories.map(({ id, icon, title, color }) => (
              <button
                key={id}
                onClick={() => { setActiveCategory(activeCategory === id ? null : id); setSearchQuery(""); }}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  activeCategory === id
                    ? `bg-gradient-to-r ${color} text-white shadow-md`
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span>{icon}</span>
                {title[lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!activeActivity && (
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
          <div className="p-3">
            <h2 className="px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wide">
              🎓 {lang === "el" ? "Σχολείο" : "School"}
            </h2>
            <nav className="space-y-2 mt-4" aria-label={lang === "el" ? "Κατηγορίες ασκήσεων" : "Exercise categories"}>
              {ageCategories.map(({ id, icon, title, color }) => {
                const isActive = activeCategory === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setActiveCategory(isActive ? null : id); setSearchQuery(""); }}
                    className={[
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95",
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
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {activeActivity
              ? (() => { const a = allActivities.find((x) => x.id === activeActivity); return a ? `${a.icon} ${a.title[lang]}` : ""; })()
              : activeCategory
                ? `${ageCategories.find((c) => c.id === activeCategory)?.icon} ${ageCategories.find((c) => c.id === activeCategory)?.title[lang]}`
                : `🎓 ${config.title[lang]}`}
          </h1>
          {guest?.age && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "el" ? "Ηλικία" : "Age"}: {guest.age} — {lang === "el" ? "Στόχος" : "Goal"}: {guest.objective}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {!activeActivity ? (
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
                    placeholder={lang === "el" ? "Αναζήτηση άσκησης..." : "Search activities..."}
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

              {searchQuery && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
                  {filteredActivities.length} {lang === "el" ? "αποτελέσματα" : "results"}
                </p>
              )}

              {searchQuery && filteredActivities.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4" aria-hidden="true">🔍</span>
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    {lang === "el" ? "Δεν βρέθηκαν ασκήσεις" : "No exercises found"}
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

              {/* Activity grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => startActivity(activity.id)}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleToggleFavorite(e, activity.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFavorite(e, activity.id); } }}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                      title={lang === "el" ? "Αγαπημένο" : "Favorite"}
                    >
                      <span className={`text-base ${favorites.includes(activity.id) ? "text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                        {favorites.includes(activity.id) ? "★" : "☆"}
                      </span>
                    </div>
                    <div className="relative p-6">
                      <div className="text-6xl mb-4">{activity.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {activity.title[lang]}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.description[lang]}
                      </p>
                      <div className={`mt-4 inline-block px-4 py-2 bg-gradient-to-r ${activity.color} text-white rounded-full text-sm font-semibold`}>
                        {lang === "el" ? "Παίξε" : "Play"} →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={handleBackToActivities}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span className="text-xl">←</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "el" ? "Πίσω στα Παιχνίδια" : "Back to Games"}
                </span>
              </button>

              <div>
                {ExerciseComponent ? (
                  <Suspense fallback={<GameSkeleton />}>
                    <ExerciseComponent
                      key={`${ageGroup}-${activeActivity}-${resetCounter}`}
                      lang={lang}
                      difficulty={currentDifficulty}
                      onComplete={handleActivityComplete}
                      onProgressUpdate={(data) =>
                        progress.updateInProgress({
                          title: activeActivity,
                          index: data?.index || 0,
                          length: data?.total || 0,
                          score: data?.score || 0,
                        })
                      }
                    />
                  </Suspense>
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    {lang === "el" ? "Η άσκηση δεν βρέθηκε." : "Exercise not found."}
                  </div>
                )}
              </div>
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
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
              {lang === "el" ? "Τα πήγες υπέροχα!" : "You did great!"}
            </p>
            {lastResult.total > 0 && (
              <div className="mb-4">
                <ShareScoreCard
                  score={lastResult.score}
                  total={lastResult.total}
                  gameName={activeActivity || ""}
                  icon="🎮"
                />
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                {lang === "el" ? "🔄 Παίξε Ξανά" : "🔄 Play Again"}
              </button>
              <button
                onClick={handleBackToActivities}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {lang === "el" ? "← Πίσω" : "← Back"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tutorialGame && (
        <HowToPlayModal
          gameId={tutorialGame}
          gameTitle={allActivities.find(a => a.id === tutorialGame)?.title[lang] || tutorialGame}
          gameIcon={allActivities.find(a => a.id === tutorialGame)?.icon}
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
