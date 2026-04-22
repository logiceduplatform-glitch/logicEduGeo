import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const WORDS_EL = [
  "ΣΧΟΛΕΙΟ","ΒΙΒΛΙΟ","ΕΠΙΣΤΗΜΗ","ΤΕΧΝΟΛΟΓΙΑ","ΓΕΩΓΡΑΦΙΑ","ΙΣΤΟΡΙΑ","ΜΑΘΗΜΑΤΙΚΑ",
  "ΦΥΣΙΚΗ","ΧΗΜΕΙΑ","ΑΣΤΡΟ","ΠΛΑΝΗΤΗΣ","ΩΚΕΑΝΟΣ","ΗΦΑΙΣΤΕΙΟ","ΔΕΙΝΟΣΑΥΡΟΣ",
  "ΠΥΡΑΜΙΔΑ","ΟΛΥΜΠΙΑΚΟΙ","ΔΗΜΟΚΡΑΤΙΑ","ΦΙΛΟΣΟΦΙΑ","ΑΡΧΑΙΟΛΟΓΙΑ","ΒΙΟΛΟΓΙΑ",
];

const WORDS_EN = [
  "SCHOOL","SCIENCE","HISTORY","PLANET","OCEAN","VOLCANO","PYRAMID",
  "BIOLOGY","PHYSICS","CHEMISTRY","DINOSAUR","DEMOCRACY","PHILOSOPHY",
  "OLYMPICS","GEOGRAPHY","TECHNOLOGY","MATHEMATICS","ASTRONOMY","ECOLOGY","UNIVERSE",
];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeLetterPool(word) {
  const letters = word.split("");
  const extra = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
  const extraEn = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pool = extra.length > 10 ? extra : extraEn;
  while (letters.length < Math.max(10, word.length + 3)) {
    letters.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return shuffled(letters);
}

export default function WordBuilderGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const wordPool = isEl ? WORDS_EL : WORDS_EN;

  const [roundWords] = useState(() => shuffled(wordPool).slice(0, 8));
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState(roundWords[0]);
  const [letters, setLetters] = useState(() => makeLetterPool(roundWords[0]));
  const [builtWord, setBuiltWord] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hintsUsed, setHintsUsed] = useState(0);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const timerRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8;

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    setTimeLeft(30);
    timerRef.current = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(timerRef.current); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(timerRef.current);
  }, [round]);

  useEffect(() => {
    if (timeLeft === 0 && !showResult) submitWord();
  }, [timeLeft]);

  const addLetter = useCallback((letter, idx) => {
    if (showResult) return;
    setBuiltWord(prev => [...prev, { letter, idx }]);
    setLetters(prev => prev.map((l, i) => i === idx ? null : l));
  }, [showResult]);

  const removeLetter = useCallback((bIdx) => {
    if (showResult) return;
    const item = builtWord[bIdx];
    setLetters(prev => prev.map((l, i) => i === item.idx ? item.letter : l));
    setBuiltWord(prev => prev.filter((_, i) => i !== bIdx));
  }, [builtWord, showResult]);

  const submitWord = useCallback(() => {
    clearInterval(timerRef.current);
    const word = builtWord.map(b => b.letter).join("");
    const correct = word === targetWord;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      VoiceService.speak(isEl ? `Σωστά! ${targetWord}` : `Correct! ${targetWord}`, lang);
    } else {
      wrongRef.current?.play();
      VoiceService.speak(isEl ? `Η λέξη ήταν: ${targetWord}` : `The word was: ${targetWord}`, lang);
    }

    updateProgress({ title: "wordBuilderGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "wordBuilderGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        const next = round + 1;
        const nextWord = roundWords[next];
        setRound(next);
        setTargetWord(nextWord);
        setLetters(makeLetterPool(nextWord));
        setBuiltWord([]);
        setShowResult(false);
      }
    }, 2000);
  }, [builtWord, targetWord, round, score, roundWords, isEl, lang, safeTimeout, updateProgress, completeQuiz, onComplete]);

  const giveHint = useCallback(() => {
    if (showResult) return;
    const nextIdx = builtWord.length;
    if (nextIdx >= targetWord.length) return;
    const needed = targetWord[nextIdx];
    const availIdx = letters.findIndex((l, i) => l === needed);
    if (availIdx >= 0) {
      addLetter(needed, availIdx);
      setHintsUsed(prev => prev + 1);
    }
  }, [builtWord, targetWord, letters, addLetter, showResult]);

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">📝</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Τέλεια!" : "Amazing!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Κατασκευή Λέξεων" : "Word Builder"} 📝
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${timeLeft > 10 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${(timeLeft / 30) * 100}%` }} />
          </div>
          <span className={`text-sm font-bold ${timeLeft > 10 ? "text-emerald-600" : "text-red-600"}`}>⏱ {timeLeft}s</span>
        </div>

        {/* Target hint */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-3 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-500 mb-1">{isEl ? "Φτιάξε τη λέξη" : "Build the word"} ({targetWord.length} {isEl ? "γράμματα" : "letters"})</p>
          <div className="flex gap-1 justify-center">
            {targetWord.split("").map((ch, i) => (
              <div key={i} className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${i < builtWord.length ? "border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700" : "border-dashed border-slate-300 dark:border-slate-600"}`}>
                {showResult ? ch : (i === 0 ? ch : "")}
              </div>
            ))}
          </div>
        </div>

        {/* Built word */}
        <div className="flex gap-1 justify-center mb-3 min-h-[44px] flex-wrap">
          {builtWord.map((b, i) => (
            <button key={i} onClick={() => removeLetter(i)}
              className="w-9 h-10 rounded-lg bg-purple-500 text-white font-bold text-sm shadow-md hover:bg-purple-600 transition-all">
              {b.letter}
            </button>
          ))}
        </div>

        {/* Letter pool */}
        <div className="flex gap-1.5 justify-center flex-wrap mb-4">
          {letters.map((l, i) => l && (
            <button key={i} onClick={() => addLetter(l, i)}
              className="w-9 h-10 rounded-lg bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-sm hover:border-purple-400 hover:shadow-md transition-all">
              {l}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          <button onClick={submitWord} disabled={showResult || builtWord.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg disabled:opacity-40 hover:-translate-y-0.5 transition-all">
            ✅ {isEl ? "Υποβολή" : "Submit"}
          </button>
          <button onClick={giveHint} disabled={showResult}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-amber-900 font-bold disabled:opacity-40 transition-all">
            💡 {isEl ? "Βοήθεια" : "Hint"}
          </button>
        </div>

        {showResult && (
          <div className={`mt-3 p-3 rounded-xl text-center font-bold ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {isCorrect ? "✅" : "❌"} {targetWord}
          </div>
        )}

        <div className="flex justify-center mt-3 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>
    </div>
  );
}
