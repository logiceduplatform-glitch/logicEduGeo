import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { dict } from "../../i18n/dict";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useQuizProgress } from "../../hooks/useQuizProgress";
import { dispatchQuizComplete } from "../../utils/quizEvents";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];
const KEY_MAP = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 };

const DIFFICULTY_CONFIG = {
  easy:   { en: "Easy",   el: "Εύκολο",  bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
  medium: { en: "Medium", el: "Μέτριο",  bg: "bg-amber-100 dark:bg-amber-900/40",   text: "text-amber-700 dark:text-amber-300" },
  hard:   { en: "Hard",   el: "Δύσκολο", bg: "bg-red-100 dark:bg-red-900/40",     text: "text-red-700 dark:text-red-300" },
};

export default function UniversalQuizRunner({
  title = "Quiz",
  questions = [],
  lang: propLang,
  weighted = false,
  onFinish,
  renderQuizComponent,
  timedMode = false,
  timePerQuestion = 15,
  categoryId = null,
  speedRunMode = false,
  speedRunTime = 60,
}) {
  const { lang: ctxLang } = useContext(LanguageContext);
  const lang = propLang || ctxLang || "el";
  const isEl = lang === "el";

  const t = useCallback(
    (key) => dict?.[lang]?.[key] ?? dict?.en?.[key] ?? key,
    [lang]
  );

  const { updateProgress, completeQuiz } = useQuizProgress();

  let initialIndex = 0;
  let initialScore = 0;
  try {
    const saved = localStorage.getItem(`progress:${title}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      initialIndex = parsed.index || 0;
      initialScore = parsed.score || 0;
    }
  } catch {
    localStorage.removeItem(`progress:${title}`);
  }

  const [i, setI] = useState(initialIndex);
  const [score, setScore] = useState(initialScore);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(speedRunMode ? speedRunTime : null);
  const [timeoutsCount, setTimeoutsCount] = useState(0);
  const [muted, setMuted] = useState(() => localStorage.getItem("geo:quiz:muted") === "true");
  const [animKey, setAnimKey] = useState(0);
  const wrongAnswersRef = useRef([]);
  const timerRef = useRef(null);
  const optionsRef = useRef([]);

  const correctSoundRef = useRef(null);
  const wrongSoundRef   = useRef(null);
  const nextSoundRef    = useRef(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current   = new Audio("/sounds/wrong.mp3");
    nextSoundRef.current    = new Audio("/sounds/next.mp3");
  }, []);

  const toggleMute = () => {
    setMuted(prev => {
      const next = !prev;
      localStorage.setItem("geo:quiz:muted", String(next));
      return next;
    });
  };

  const playSound = (ref) => {
    if (muted) return;
    ref.current?.play().catch(() => {});
  };

  const normalizeVal = (v) => (v == null ? "" : String(v).trim());

  const pickText = useCallback((obj) => {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    if (typeof obj === "number") return String(obj);
    return obj[lang] ?? obj["el"] ?? obj["en"] ?? "";
  }, [lang]);

  const getOptions = useCallback((q) => {
    if (!q) return [];
    if (Array.isArray(q.options)) return q.options;
    if (q.options && typeof q.options === "object") {
      return q.options[lang] || q.options["el"] || q.options["en"] || [];
    }
    return [];
  }, [lang]);

  useEffect(() => {
    if (!timedMode || feedback || finished || speedRunMode) {
      clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(timePerQuestion);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [i, timedMode, feedback, finished, timePerQuestion, speedRunMode]);

  useEffect(() => {
    if (timedMode && timeLeft === 0 && !feedback && !finished) {
      handleTimeUp();
    }
  }, [timeLeft, timedMode, feedback, finished]);

  const scoreRef = useRef(score);
  const indexRef = useRef(i);
  scoreRef.current = score;
  indexRef.current = i;

  // Speed Run: global countdown (runs independently of feedback)
  useEffect(() => {
    if (!speedRunMode || finished) return;
    setGlobalTimeLeft(speedRunTime);
    const id = setInterval(() => {
      setGlobalTimeLeft(prev => {
        if (prev == null || prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [speedRunMode, speedRunTime, finished]);

  useEffect(() => {
    if (speedRunMode && globalTimeLeft === 0 && !finished) {
      handleFinish(scoreRef.current, indexRef.current);
    }
  }, [speedRunMode, globalTimeLeft, finished]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (feedback || finished) return;
      const idx = KEY_MAP[e.key.toLowerCase()];
      if (idx == null) return;
      const q = questions[i];
      if (!q) return;
      const opts = getOptions(q);
      if (idx >= opts.length) return;
      const opt = opts[idx];
      const optText = typeof opt === "string" ? opt : pickText(opt);
      handleMCAnswer(optText);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [i, feedback, finished, questions, lang]);

  const handleTimeUp = () => {
    if (feedback) return;
    const q = questions[i];
    const correctRaw = pickText(q?.correct);
    const correct = normalizeVal(correctRaw);

    setTimeoutsCount(prev => prev + 1);
    wrongAnswersRef.current.push({
      question: pickText(q?.question),
      selected: null,
      correct,
      explanation: q?.explanation ? pickText(q.explanation) : null,
      timedOut: true,
    });

    setFeedback({ correct: false, selectedOption: null, correctAnswer: correct, timedOut: true });
    playSound(wrongSoundRef);

    localStorage.setItem(`progress:${title}`, JSON.stringify({ index: i + 1, score, total: questions.length, categoryId }));
    updateProgress({ title, score, total: questions.length, index: i + 1, categoryId });

    const delay = q?.explanation ? 4000 : 2500;
    setTimeout(() => {
      setFeedback(null);
      playSound(nextSoundRef);
      if (i + 1 >= questions.length) { handleFinish(score); } else { setI(i + 1); setAnimKey(k => k + 1); }
    }, delay);
  };

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-center">
        {isEl ? "Δεν υπάρχουν ερωτήσεις ακόμα." : "No questions available yet."}
      </div>
    );
  }

  const q = questions[i];
  if (!q) return null;

  const total = questions.length;
  const effectiveIndex = finished ? total : (feedback ? i + 1 : i);
  const progress = Math.round((effectiveIndex / total) * 100);

  const handleFinish = (finalScore = score, attemptedCount = total) => {
    setFinished(true);
    clearInterval(timerRef.current);
    localStorage.removeItem(`progress:${title}`);
    completeQuiz({ title, score: finalScore, total });
    const meta = speedRunMode
      ? { speedRunMode: true, attempted: attemptedCount, totalTime: speedRunTime, wrongAnswers: wrongAnswersRef.current }
      : { timedMode, timeouts: timeoutsCount, wrongAnswers: wrongAnswersRef.current };
    onFinish?.(finalScore, meta);
  };

  const handleMCAnswer = (opt) => {
    if (feedback) return;
    clearInterval(timerRef.current);

    const user = normalizeVal(opt);
    const correctRaw = pickText(q.correct);
    const correct = normalizeVal(correctRaw);

    const weight = weighted
      ? q.difficulty === "hard" ? 3 : q.difficulty === "medium" ? 2 : 1
      : 1;

    const ok = user === correct;
    const newScore = ok ? score + weight : score;

    if (!ok) {
      wrongAnswersRef.current.push({
        question: pickText(q.question),
        selected: user,
        correct,
        explanation: q.explanation ? pickText(q.explanation) : null,
        timedOut: false,
      });
    }

    setFeedback({ correct: ok, selectedOption: user, correctAnswer: correct });

    if (ok) { playSound(correctSoundRef); } else { playSound(wrongSoundRef); }
    setScore(newScore);

    localStorage.setItem(`progress:${title}`, JSON.stringify({ index: i + 1, score: newScore, total, categoryId }));
    updateProgress({ title, score: newScore, total, index: i + 1, categoryId });

    const delay = q.explanation ? 4000 : 1500;
    setTimeout(() => {
      setFeedback(null);
      playSound(nextSoundRef);
      if (i + 1 >= total) { handleFinish(newScore, total); } else { setI(i + 1); setAnimKey(k => k + 1); }
    }, delay);
  };

  const timerPct = timedMode ? Math.round((timeLeft / timePerQuestion) * 100) : 100;
  const timerColor = timeLeft <= 3 ? "from-red-500 to-red-600" : timeLeft <= 7 ? "from-amber-400 to-orange-500" : "from-emerald-400 to-teal-500";
  const diff = DIFFICULTY_CONFIG[q.difficulty];
  const currentOptions = getOptions(q);

  const renderMC = () => (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={isEl ? "Επιλογές απάντησης" : "Answer options"}>
      {currentOptions.map((opt, idx) => {
        const optText = typeof opt === "string" ? opt : pickText(opt);
        const normalized = normalizeVal(optText);
        const letter = OPTION_LETTERS[idx] || String(idx + 1);

        let containerClass =
          "group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ";
        let letterClass =
          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ";
        let textClass = "text-sm font-medium transition-colors duration-300 ";
        let suffix = null;

        if (feedback) {
          const isCorrect = normalized === feedback.correctAnswer;
          const isSelected = normalized === feedback.selectedOption;

          if (isCorrect) {
            containerClass += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-500 shadow-sm shadow-emerald-100 dark:shadow-emerald-900/20";
            letterClass += "bg-emerald-500 text-white";
            textClass += "text-emerald-800 dark:text-emerald-200";
            suffix = <span className="ml-auto text-emerald-500 text-lg">&#10003;</span>;
          } else if (isSelected) {
            containerClass += "bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-500 shadow-sm shadow-red-100 dark:shadow-red-900/20";
            letterClass += "bg-red-500 text-white";
            textClass += "text-red-800 dark:text-red-200";
            suffix = <span className="ml-auto text-red-500 text-lg">&#10007;</span>;
          } else {
            containerClass += "bg-slate-50/50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-50";
            letterClass += "bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500";
            textClass += "text-slate-400 dark:text-slate-500";
          }
        } else {
          containerClass +=
            "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]";
          letterClass += "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-800 group-hover:text-purple-700 dark:group-hover:text-purple-300";
          textClass += "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white";
        }

        return (
          <button
            key={idx}
            ref={el => optionsRef.current[idx] = el}
            type="button"
            aria-label={`${letter}: ${normalized}`}
            className={containerClass}
            onClick={() => handleMCAnswer(optText)}
            disabled={!!feedback}
          >
            <span className={letterClass}>{letter}</span>
            <span className={textClass}>{normalized}</span>
            {suffix}
          </button>
        );
      })}
    </div>
  );

  const explanationText = q.explanation ? pickText(q.explanation) : null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              title={muted ? (isEl ? "Ενεργοποίηση ήχου" : "Unmute") : (isEl ? "Σίγαση" : "Mute")}
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm transition-all bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400"
            >
              {muted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            {speedRunMode && globalTimeLeft != null && (
              <span className={[
                "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors",
                globalTimeLeft <= 10
                  ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 animate-pulse"
                  : globalTimeLeft <= 30
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  : "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300"
              ].join(" ")}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {Math.floor(globalTimeLeft / 60)}:{(globalTimeLeft % 60).toString().padStart(2, "0")}
              </span>
            )}
            {timedMode && !speedRunMode && (
              <span className={[
                "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors",
                timeLeft <= 3
                  ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 animate-pulse"
                  : timeLeft <= 7
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
              ].join(" ")}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                {timeLeft}s
              </span>
            )}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">
              {i + 1} / {total}
            </span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1.5 rounded-full">
              {isEl ? "Σκορ" : "Score"}: {score}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer bar (per-question) */}
        {timedMode && !feedback && (
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        )}
        {/* Speed Run: global countdown bar */}
        {speedRunMode && globalTimeLeft != null && (
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                globalTimeLeft <= 10 ? "from-red-500 to-red-600" : globalTimeLeft <= 30 ? "from-amber-400 to-orange-500" : "from-cyan-400 to-teal-500"
              } rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${Math.round((globalTimeLeft / speedRunTime) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Question */}
      <div className="p-6">
        <div key={animKey} className="animate-[slideIn_0.35s_ease-out]">
          <div className="flex items-start gap-3 mb-5">
            {diff && (
              <span className={`shrink-0 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${diff.bg} ${diff.text}`}>
                {isEl ? diff.el : diff.en}
              </span>
            )}
            <div className="text-slate-800 dark:text-slate-100 text-lg font-semibold leading-relaxed">
              {pickText(q.question)}
            </div>
          </div>

          {renderQuizComponent ? (
            React.createElement(renderQuizComponent, { data: q, lang, onComplete: handleFinish })
          ) : (
            renderMC()
          )}

          {/* Skip & keyboard hint */}
          {!feedback && !renderQuizComponent && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
                {isEl ? "Πάτα A, B, C, D για γρήγορη απάντηση" : "Press A, B, C, D to answer quickly"}
              </p>
              {i + 1 < total && (
                <button
                  onClick={() => {
                    wrongAnswersRef.current.push({
                      question: pickText(q.question),
                      selected: null,
                      correct: normalizeVal(pickText(q.correct)),
                      explanation: q.explanation ? pickText(q.explanation) : null,
                      timedOut: false,
                      skipped: true,
                    });
                    clearInterval(timerRef.current);
                    playSound(nextSoundRef);
                    localStorage.setItem(`progress:${title}`, JSON.stringify({ index: i + 1, score, total, categoryId }));
                    updateProgress({ title, score, total, index: i + 1, categoryId });
                    setI(i + 1);
                    setAnimKey(k => k + 1);
                  }}
                  className="ml-auto text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                >
                  {isEl ? "Παράλειψη" : "Skip"}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Explanation */}
        <div aria-live="polite" aria-atomic="true">
        {feedback && explanationText && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start gap-2.5">
              <span className="text-blue-500 text-lg mt-0.5">💡</span>
              <div>
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                  {isEl ? "Εξήγηση" : "Explanation"}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {explanationText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time's up */}
        {feedback?.timedOut && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-center animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              ⏰ {isEl ? "Ο χρόνος τελείωσε!" : "Time's up!"}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
