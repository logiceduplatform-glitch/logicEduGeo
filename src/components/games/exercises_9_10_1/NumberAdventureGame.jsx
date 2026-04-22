import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

function generateProblem(round, lang) {
  const isEl = lang === "el";
  if (round < 5) {
    const a = Math.floor(Math.random() * 450) + 120;
    const b = Math.floor(Math.random() * 450) + 120;
    return {
      question: `${a} + ${b} = ?`,
      answer: a + b,
      type: isEl ? "Πρόσθεση" : "Addition",
      emoji: "➕",
    };
  } else if (round < 10) {
    const a = Math.floor(Math.random() * 500) + 250;
    const b = Math.floor(Math.random() * 200) + 50;
    return {
      question: `${a} − ${b} = ?`,
      answer: a - b,
      type: isEl ? "Αφαίρεση" : "Subtraction",
      emoji: "➖",
    };
  } else if (round < 13) {
    const a = Math.floor(Math.random() * 18) + 12;
    const b = Math.floor(Math.random() * 18) + 12;
    return {
      question: `${a} × ${b} = ?`,
      answer: a * b,
      type: isEl ? "Πολλαπλασιασμός" : "Multiplication",
      emoji: "✖️",
    };
  } else {
    const a = Math.floor(Math.random() * 900) + 100;
    const b = Math.floor(Math.random() * 900) + 100;
    return {
      question: `${a}  ?  ${b}`,
      answer: a > b ? ">" : a < b ? "<" : "=",
      type: isEl ? "Σύγκριση" : "Comparison",
      emoji: "⚖️",
      isComparison: true,
    };
  }
}

function makeOptions(answer, isComparison) {
  if (isComparison) return [">", "<", "="];
  const opts = new Set([answer]);
  while (opts.size < 4) {
    const off = Math.floor(Math.random() * 40) - 20;
    const v = Math.max(0, answer + (off === 0 ? 11 : off));
    opts.add(v);
  }
  return [...opts].sort((a, b) => a - b);
}

const TRAIL = ["🌲", "🏔️", "🌊", "🏜️", "🌋", "🏰", "🌈", "🎪", "🗼", "🏝️", "🎡", "⛰️", "🌸", "🏟️", "🎆"];

export default function NumberAdventureGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";

  const [round, setRound] = useState(0);
  const [problem, setProblem] = useState(() => generateProblem(0, lang));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const TARGET_ROUNDS = 15;
  const options = makeOptions(problem.answer, problem.isComparison);

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    const text = isEl
      ? `Σταθμός ${round + 1}. ${problem.type}. ${problem.question.replace("?", "τι;")}`
      : `Stop ${round + 1}. ${problem.type}. ${problem.question.replace("?", "what?")}`;
    VoiceService.speak(text, lang);
  }, [round]);

  const handleAnswer = (ans) => {
    if (showResult) return;
    const correct = ans === problem.answer;
    setSelected(ans);
    setShowResult(true);

    if (correct) { correctRef.current?.play(); setScore(prev => prev + 1); }
    else { wrongRef.current?.play(); }

    updateProgress({ title: "numberAdventureGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "numberAdventureGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        const next = round + 1;
        setRound(next);
        setProblem(generateProblem(next, lang));
        setSelected(null);
        setShowResult(false);
      }
    }, NEXT_DELAY);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🏆</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Τέλεια Περιπέτεια!" : "Amazing Adventure!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Περιπέτεια Αριθμών" : "Number Adventure"} 🗺️
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="flex items-center gap-0.5 mb-4 overflow-x-auto pb-1">
          {TRAIL.map((icon, i) => (
            <div key={i} className={`flex flex-col items-center transition-all ${i <= round ? "opacity-100 scale-100" : "opacity-30 scale-75"}`}>
              <span className="text-lg">{icon}</span>
              {i === round && <span className="text-xs">📍</span>}
            </div>
          ))}
        </div>

        <div className="text-center mb-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            {problem.emoji} {problem.type}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-mono tracking-wider break-all">
            {problem.question}
          </p>
        </div>

        <div className={`grid ${problem.isComparison ? "grid-cols-3" : "grid-cols-2"} gap-3`}>
          {options.map((opt) => {
            const isCorrect = opt === problem.answer;
            const isSel = selected === opt;
            return (
              <button key={String(opt)} onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={[
                  "px-4 py-4 rounded-xl text-xl font-bold transition-all border-2",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-105"
                    : showResult && isSel && !isCorrect ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-400 hover:shadow-md",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
