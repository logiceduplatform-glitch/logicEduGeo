import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const SHAPES = {
  el: [
    { shape: "⬛", color: "κόκκινο", colorHex: "#EF4444", shapeName: "τετράγωνο" },
    { shape: "🔺", color: "μπλε", colorHex: "#3B82F6", shapeName: "τρίγωνο" },
    { shape: "⭕", color: "πράσινο", colorHex: "#22C55E", shapeName: "κύκλος" },
    { shape: "💎", color: "κίτρινο", colorHex: "#EAB308", shapeName: "ρόμβος" },
    { shape: "⬟", color: "μοβ", colorHex: "#A855F7", shapeName: "πεντάγωνο" },
    { shape: "⬡", color: "πορτοκαλί", colorHex: "#F97316", shapeName: "εξάγωνο" },
  ],
  en: [
    { shape: "⬛", color: "red", colorHex: "#EF4444", shapeName: "square" },
    { shape: "🔺", color: "blue", colorHex: "#3B82F6", shapeName: "triangle" },
    { shape: "⭕", color: "green", colorHex: "#22C55E", shapeName: "circle" },
    { shape: "💎", color: "yellow", colorHex: "#EAB308", shapeName: "diamond" },
    { shape: "⬟", color: "purple", colorHex: "#A855F7", shapeName: "pentagon" },
    { shape: "⬡", color: "orange", colorHex: "#F97316", shapeName: "hexagon" },
  ],
};

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(shapes, roundNum) {
  const items = shuffled(shapes);
  const target = items[roundNum % items.length];
  const byColor = Math.random() > 0.5;
  const distractors = shuffled(items.filter(s => s !== target)).slice(0, 3);
  const options = shuffled([target, ...distractors]);

  return { target, byColor, options };
}

export default function ColorShapeGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const shapes = SHAPES[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [roundData, setRoundData] = useState(() => generateRound(shapes, 0));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const TARGET_ROUNDS = 12;

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    const { target, byColor } = roundData;
    const text = byColor
      ? (isEl ? `Βρες το ${target.color} ${target.shapeName}!` : `Find the ${target.color} ${target.shapeName}!`)
      : (isEl ? `Βρες το ${target.shapeName} με χρώμα ${target.color}!` : `Find the ${target.shapeName} that is ${target.color}!`);
    VoiceService.speak(text, lang);
  }, [round]);

  const handleSelect = (item) => {
    if (showResult) return;
    const correct = item === roundData.target;
    setSelected(item);
    setShowResult(true);

    if (correct) { correctRef.current?.play(); setScore(prev => prev + 1); }
    else { wrongRef.current?.play(); }

    updateProgress({ title: "colorShapeGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "colorShapeGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        const next = round + 1;
        setRound(next);
        setRoundData(generateRound(shapes, next));
        setSelected(null);
        setShowResult(false);
      }
    }, NEXT_DELAY);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🎨</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Τέλεια!" : "Perfect!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
      </div>
    );
  }

  const { target, byColor } = roundData;
  const instruction = byColor
    ? (isEl ? `Βρες το ${target.color} ${target.shapeName}` : `Find the ${target.color} ${target.shapeName}`)
    : (isEl ? `Βρες το ${target.shapeName} (${target.color})` : `Find the ${target.shapeName} (${target.color})`);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Χρώματα & Σχήματα" : "Colors & Shapes"} 🎨
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-pink-400 to-orange-500 transition-all" style={{ width: `${((round + 1) / TARGET_ROUNDS) * 100}%` }} />
        </div>

        {/* Instruction */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{instruction}</p>
        </div>

        {/* Shape grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {roundData.options.map((item, i) => {
            const isCorrect = item === roundData.target;
            const isSel = selected === item;
            return (
              <button key={i} onClick={() => handleSelect(item)}
                disabled={showResult}
                className={[
                  "flex flex-col items-center justify-center p-6 rounded-2xl transition-all border-3",
                  showResult && isCorrect ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 scale-105 shadow-lg"
                    : showResult && isSel ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-purple-400 hover:shadow-lg hover:-translate-y-1",
                ].join(" ")}>
                <span className="text-5xl mb-2" style={{ color: item.colorHex }}>{item.shape}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.color} {item.shapeName}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
