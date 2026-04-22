import React, { useState, useMemo, useEffect } from "react";
import QuizRunner from "./QuizRunner";
import { LanguageContext } from "../../i18n/LanguageContext";
import { dict } from "../../i18n/dict";
import { shuffleArray } from "../../utils/shuffle";
import { useProgress } from "../../contexts/ProgressContext";
import { checkNewAchievements } from "../../services/RewardsService";
import { DifficultyService } from "../../services/DifficultyService";
import AchievementPopup from "../rewards/AchievementPopup";

const loaders = {
  LogicMath:    () => import("./data/questionsLogicMath").then(m => m.questionsLogicMath),
  NaturalWorld: () => import("./data/questionsNaturalWorld").then(m => m.questionsNaturalWorld),
  Adventures:   () => import("./data/questionsAdventures").then(m => m.questionsAdventures),
  BrainTeasers: () => import("./data/questionsBrainTeasers").then(m => m.questionsBrainTeasers),
  Edutainment:  () => import("./data/questionsEdutainment").then(m => m.questionsEdutainment),
  History:      () => import("./data/questionsHistory").then(m => m.questionsHistory),
  Language:     () => import("./data/questionsLanguage").then(m => m.questionsLanguage),
  Space:        () => import("./data/questionsSpace").then(m => m.questionsSpace),
  Politics:     () => import("./data/questionsPolitics").then(m => m.questionsPolitics),
  Health:       () => import("./data/questionsHealth").then(m => m.questionsHealth),
  Art:          () => import("./data/questionsArt").then(m => m.questionsArt),
};

const QUESTION_COUNTS = [10, 20, 30, 50];
const DIFFICULTY_OPTIONS = ["all", "easy", "medium", "hard"];
const SPEED_RUN_TIMES = [60, 90, 120];

function getBestScore(category) {
  try { return JSON.parse(localStorage.getItem(`best:${category}`)) || null; }
  catch { return null; }
}
function saveBestScore(category, score, total) {
  const prev = getBestScore(category);
  const pct = Math.round((score / total) * 100);
  if (!prev || pct > prev.pct) {
    localStorage.setItem(`best:${category}`, JSON.stringify({ score, total, pct }));
    return true;
  }
  return false;
}
function getBestSpeedRun(category) {
  try { return JSON.parse(localStorage.getItem(`speedrun:${category}`)) || null; }
  catch { return null; }
}
function saveBestSpeedRun(category, score, attempted, totalTime) {
  const prev = getBestSpeedRun(category);
  const pct = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
  const data = { score, attempted, totalTime, pct };
  if (!prev || score > prev.score || (score === prev.score && pct > prev.pct)) {
    localStorage.setItem(`speedrun:${category}`, JSON.stringify(data));
    return true;
  }
  return false;
}

export default function CategoryQuiz({ category, lang: propLang }) {
  const ctx = React.useContext(LanguageContext);
  const lang = propLang || ctx.lang;
  const isEl = lang === "el";
  const progress = useProgress();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const [quizMode, setQuizMode] = useState("classic"); // "classic" | "timed" | "speedrun"
  const [speedRunTime, setSpeedRunTime] = useState(60);
  const [finishMeta, setFinishMeta] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isNewBest, setIsNewBest] = useState(false);
  const [isNewSpeedBest, setIsNewSpeedBest] = useState(false);
  const [questionCount, setQuestionCount] = useState(30);
  const [newBadge, setNewBadge] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryQuestions, setRetryQuestions] = useState(null);

  const t = (key) => dict?.[lang]?.[key] ?? key;

  const clearSavedProgress = () => {
    localStorage.removeItem(`progress:${t(category)}`);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const loader = loaders[category];
    if (!loader) { setRawData([]); setLoading(false); return; }
    loader().then(data => {
      if (!cancelled) { setRawData(data || []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [category]);

  const questions = useMemo(() => {
    if (retryQuestions) return retryQuestions;
    const filtered = difficultyFilter === "all"
      ? rawData
      : rawData.filter(q => q.difficulty === difficultyFilter);
    const count = quizMode === "speedrun" ? filtered.length : questionCount;
    return shuffleArray(filtered).slice(0, count);
  }, [rawData, resetCounter, difficultyFilter, questionCount, retryQuestions, quizMode]);

  const bestScore = getBestScore(category);
  const bestSpeedRun = getBestSpeedRun(category);

  const handleFinish = (score, meta) => {
    setFinalScore(score);
    setFinishMeta(meta || null);

    if (meta?.speedRunMode) {
      const newBest = saveBestSpeedRun(category, score, meta.attempted || 0, meta.totalTime || speedRunTime);
      setIsNewSpeedBest(newBest);
      setIsNewBest(false);
    } else {
      const newBest = saveBestScore(category, score, questions.length);
      setIsNewBest(newBest);
      setIsNewSpeedBest(false);
    }
    setShowCompletionModal(true);

    try {
      progress.recordGameComplete({
        gameId: category,
        title: category,
        score,
        total: meta?.speedRunMode ? (meta.attempted || 0) : questions.length,
        category: "adult",
        difficulty: DifficultyService.getDifficulty(category),
      });
      DifficultyService.evaluate(category);
      const badges = checkNewAchievements(progress);
      if (badges.length > 0) {
        badges.forEach((id) => progress.unlockAchievement(id));
        setNewBadge(badges[0]);
      }
    } catch {}
  };

  const handlePlayAgain = () => {
    clearSavedProgress();
    setShowCompletionModal(false);
    setShowReview(false);
    setFinalScore(0);
    setFinishMeta(null);
    setIsNewBest(false);
    setIsNewSpeedBest(false);
    setRetryQuestions(null);
    setResetCounter(prev => prev + 1);
  };

  const handleRetryWrong = () => {
    const wrong = finishMeta?.wrongAnswers || [];
    if (wrong.length === 0) return;

    const pickText = (obj) => {
      if (!obj) return "";
      if (typeof obj === "string") return obj;
      return obj[lang] ?? obj.el ?? obj.en ?? "";
    };

    const wrongQuestionTexts = new Set(wrong.map((w) => w.question));
    const matchedQuestions = rawData.filter((q) => wrongQuestionTexts.has(pickText(q.question)));

    if (matchedQuestions.length > 0) {
      setRetryQuestions(shuffleArray(matchedQuestions));
    }

    clearSavedProgress();
    setShowCompletionModal(false);
    setShowReview(false);
    setFinalScore(0);
    setFinishMeta(null);
    setIsNewBest(false);
    setIsNewSpeedBest(false);
    setResetCounter(prev => prev + 1);
  };

  const isSpeedRun = quizMode === "speedrun";
  const isTimedMode = quizMode === "timed";
  const attempted = finishMeta?.attempted || questions.length;
  const pct = attempted > 0 ? Math.round((finalScore / attempted) * 100) : 0;
  const answeredInTime = finishMeta?.timedMode
    ? questions.length - (finishMeta.timeouts || 0)
    : null;
  const wrongAnswers = finishMeta?.wrongAnswers || [];
  const updatedBest = getBestScore(category);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Retry mode banner */}
      {retryQuestions && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              {isEl ? `Επαναπαίζεις ${retryQuestions.length} λάθη` : `Retrying ${retryQuestions.length} wrong answers`}
            </span>
          </div>
          <button
            onClick={handlePlayAgain}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            {isEl ? "Ακύρωση" : "Cancel"}
          </button>
        </div>
      )}

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Difficulty filter */}
        <div className="flex items-center gap-1.5">
          {DIFFICULTY_OPTIONS.map(d => {
            const labels = { all: { el: "Όλα", en: "All" }, easy: { el: "Εύκολο", en: "Easy" }, medium: { el: "Μέτριο", en: "Medium" }, hard: { el: "Δύσκολο", en: "Hard" } };
            const activeStyles = {
              all:    "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm",
              easy:   "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shadow-sm",
              medium: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shadow-sm",
              hard:   "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 shadow-sm",
            };
            const isActive = difficultyFilter === d;
            return (
              <button
                key={d}
                onClick={() => { clearSavedProgress(); setDifficultyFilter(d); setResetCounter(prev => prev + 1); }}
                className={[
                  "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                  isActive
                    ? activeStyles[d]
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                ].join(" ")}
              >
                {labels[d][isEl ? "el" : "en"]}
              </button>
            );
          })}
        </div>

        {/* Question count + Mode toggle + best score */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Question count (hidden in speed run - uses all questions) */}
          {!isSpeedRun && (
            <div className="flex items-center gap-1 mr-1">
              {QUESTION_COUNTS.map(n => (
                <button
                  key={n}
                  onClick={() => { clearSavedProgress(); setQuestionCount(n); setResetCounter(prev => prev + 1); }}
                  className={[
                    "w-8 h-7 rounded-md text-[11px] font-bold transition-all",
                    questionCount === n
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                  ].join(" ")}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* Speed Run time selector */}
          {isSpeedRun && (
            <div className="flex items-center gap-1 mr-1">
              {SPEED_RUN_TIMES.map(s => (
                <button
                  key={s}
                  onClick={() => { clearSavedProgress(); setSpeedRunTime(s); setResetCounter(prev => prev + 1); }}
                  className={[
                    "px-2.5 h-7 rounded-md text-[11px] font-bold transition-all",
                    speedRunTime === s
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                  ].join(" ")}
                >
                  {s}s
                </button>
              ))}
            </div>
          )}

          {bestScore && !isSpeedRun && (
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span className="text-amber-500">★</span> {isEl ? "Ρεκόρ" : "Best"}: {bestScore.pct}%
            </span>
          )}
          {bestSpeedRun && isSpeedRun && (
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span className="text-cyan-500">⚡</span> {isEl ? "Ρεκόρ" : "Best"}: {bestSpeedRun.score}
            </span>
          )}

          {/* Mode buttons */}
          <button
            onClick={() => { setQuizMode("classic"); clearSavedProgress(); setResetCounter(prev => prev + 1); }}
            className={[
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              quizMode === "classic"
                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            ].join(" ")}
          >
            {isEl ? "Κλασικό" : "Classic"}
          </button>
          <button
            onClick={() => { setQuizMode("timed"); clearSavedProgress(); setResetCounter(prev => prev + 1); }}
            className={[
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              quizMode === "timed"
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shadow-sm"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            ].join(" ")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
            {isEl ? "Χρονόμετρο" : "Timed"}
          </button>
          <button
            onClick={() => { setQuizMode("speedrun"); clearSavedProgress(); setResetCounter(prev => prev + 1); }}
            className={[
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              quizMode === "speedrun"
                ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            ].join(" ")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {isEl ? "Speed Run" : "Speed Run"}
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2">
            {isEl ? "Δεν βρέθηκαν ερωτήσεις" : "No questions found"}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
            {isEl ? "Δοκίμασε διαφορετική δυσκολία" : "Try a different difficulty"}
          </p>
          <button
            onClick={() => { clearSavedProgress(); setDifficultyFilter("all"); setResetCounter(prev => prev + 1); }}
            className="px-5 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-sm hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-all"
          >
            {isEl ? "Εμφάνιση όλων" : "Show all"}
          </button>
        </div>
      ) : (
        <QuizRunner
          key={`${category}-${lang}-${resetCounter}-${quizMode}-${difficultyFilter}-${questionCount}-${speedRunTime}`}
          title={t(category)}
          questions={questions}
          lang={lang}
          weighted={false}
          onFinish={handleFinish}
          timedMode={isTimedMode}
          timePerQuestion={15}
          categoryId={category}
          speedRunMode={isSpeedRun}
          speedRunTime={speedRunTime}
        />
      )}

      {/* Completion modal */}
      {showCompletionModal && !showReview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label={isEl ? "Αποτελέσματα quiz" : "Quiz results"}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl text-center max-w-sm w-full p-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-7xl mb-4">
              {finishMeta?.speedRunMode
                ? (finalScore >= 15 ? "⚡" : finalScore >= 8 ? "🔥" : "💪")
                : (pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪")}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">
              {finishMeta?.speedRunMode
                ? (isEl ? "Τέλος χρόνου!" : "Time's up!")
                : (isEl ? "Ολοκληρώθηκε!" : "Completed!")}
            </h2>

            {/* Speed Run badge */}
            {finishMeta?.speedRunMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-xs font-bold mb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Speed Run — {finishMeta.totalTime || speedRunTime}s
              </span>
            )}

            {/* Timed badge */}
            {finishMeta?.timedMode && !finishMeta?.speedRunMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                {isEl ? "Χρονόμετρο" : "Timed Challenge"}
              </span>
            )}

            {(isNewBest || isNewSpeedBest) && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2 animate-bounce">
                <span>{isNewSpeedBest ? "⚡" : "★"}</span> {isEl ? "Νέο ρεκόρ!" : "New best!"}
              </div>
            )}

            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
              {finishMeta?.speedRunMode
                ? (finalScore >= 15
                    ? (isEl ? "Απίστευτη ταχύτητα!" : "Incredible speed!")
                    : finalScore >= 8
                    ? (isEl ? "Πολύ καλά!" : "Very good!")
                    : (isEl ? "Συνέχισε να εξασκείσαι!" : "Keep practicing!"))
                : (pct >= 80
                    ? (isEl ? "Εξαιρετική επίδοση!" : "Excellent performance!")
                    : pct >= 50
                    ? (isEl ? "Καλή δουλειά!" : "Good job!")
                    : (isEl ? "Συνέχισε να προσπαθείς!" : "Keep trying!"))}
            </p>

            {/* Score display */}
            <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center mb-4">
              <div className="text-center">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {finalScore}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500 block">
                  / {finishMeta?.speedRunMode ? (finishMeta.attempted || 0) : questions.length}
                </span>
              </div>
            </div>

            {/* Speed Run stats */}
            {finishMeta?.speedRunMode && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800">
                  <span className="text-lg font-extrabold text-cyan-700 dark:text-cyan-300 block">{finishMeta.attempted || 0}</span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">
                    {isEl ? "Ερωτήσεις" : "Attempted"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                  <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 block">{finalScore}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    {isEl ? "Σωστές" : "Correct"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800">
                  <span className="text-lg font-extrabold text-purple-700 dark:text-purple-300 block">{pct}%</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                    {isEl ? "Ακρίβεια" : "Accuracy"}
                  </span>
                </div>
              </div>
            )}

            {updatedBest && !isNewBest && !finishMeta?.speedRunMode && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                <span className="text-amber-500">★</span> {isEl ? "Ρεκόρ" : "Best"}: {updatedBest.pct}%
              </p>
            )}

            {/* Per-question timed stats */}
            {finishMeta?.timedMode && !finishMeta?.speedRunMode && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                  <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 block">{answeredInTime}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    {isEl ? "Εγκαίρως" : "In time"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800">
                  <span className="text-lg font-extrabold text-amber-700 dark:text-amber-300 block">{finishMeta.timeouts || 0}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                    {isEl ? "Εκπρόθεσμα" : "Timed out"}
                  </span>
                </div>
              </div>
            )}

            {!finishMeta?.timedMode && !finishMeta?.speedRunMode && <div className="mb-4" />}

            <div className="flex flex-col gap-2.5">
              {wrongAnswers.length > 0 && (
                <>
                  <button
                    onClick={handleRetryWrong}
                    className="w-full px-5 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isEl ? `Ξαναπαίξε τα ${wrongAnswers.length} λάθη` : `Retry ${wrongAnswers.length} wrong`}
                  </button>
                  <button
                    onClick={() => setShowReview(true)}
                    className="w-full px-5 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {isEl ? `Δες τα ${wrongAnswers.length} λάθη` : `Review ${wrongAnswers.length} mistakes`}
                  </button>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                >
                  {isEl ? "Επιστροφή" : "Back"}
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:-translate-y-0.5 transition-all"
                >
                  {isEl ? "Ξανά" : "Again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {newBadge && (
        <AchievementPopup
          achievementId={newBadge}
          lang={lang}
          onClose={() => setNewBadge(null)}
        />
      )}

      {/* Review wrong answers screen */}
      {showReview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label={isEl ? "Ανασκόπηση λαθών" : "Review mistakes"}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col animate-[fadeIn_0.3s_ease-out]">
            {/* Review header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {isEl ? "Ανασκόπηση λαθών" : "Review mistakes"}
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                    {wrongAnswers.length} {isEl ? "λανθασμένες απαντήσεις" : "wrong answers"}
                  </p>
                </div>
                <button
                  onClick={() => setShowReview(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Review list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wrongAnswers.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    <span className="text-slate-400 dark:text-slate-500 mr-2">#{idx + 1}</span>
                    {item.question}
                  </p>

                  <div className="space-y-1.5 mb-3">
                    {item.selected ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs">✗</span>
                        <span className="text-red-700 dark:text-red-300 font-medium">{item.selected}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs">({isEl ? "η απάντησή σου" : "your answer"})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-xs">⏰</span>
                        <span className="text-amber-700 dark:text-amber-300 font-medium italic">{isEl ? "Δεν απάντησες εγκαίρως" : "No answer (timed out)"}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs">✓</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">{item.correct}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">({isEl ? "σωστή" : "correct"})</span>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        💡 {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Review footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReview(false)}
                  className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  {isEl ? "Πίσω" : "Back"}
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:-translate-y-0.5 transition-all"
                >
                  {isEl ? "Ξαναπαίξε" : "Play again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
