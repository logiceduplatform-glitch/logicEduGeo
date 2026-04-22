// src/components/games/exercises_2_3_1/SizeSorting.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

const SIZES = [
  { size: "small", sizeOrder: 0, fontSize: "text-3xl" },
  { size: "medium", sizeOrder: 1, fontSize: "text-6xl" },
  { size: "large", sizeOrder: 2, fontSize: "text-9xl" },
];

const ROUNDS = [
  { emoji: "🐻", name: { el: "αρκούδα", en: "bear" } },
  { emoji: "⭐", name: { el: "αστέρι", en: "star" } },
  { emoji: "🌳", name: { el: "δέντρο", en: "tree" } },
  { emoji: "🐟", name: { el: "ψάρι", en: "fish" } },
  { emoji: "🏠", name: { el: "σπίτι", en: "house" } },
  { emoji: "🚗", name: { el: "αυτοκίνητο", en: "car" } },
  { emoji: "🌸", name: { el: "λουλούδι", en: "flower" } },
  { emoji: "🍎", name: { el: "μήλο", en: "apple" } },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SizeSorting({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [tappedOrder, setTappedOrder] = useState([]);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [wrongTappedId, setWrongTappedId] = useState(null);
  const [showRoundCelebration, setShowRoundCelebration] = useState(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const displayItems = useMemo(() => {
    const items = SIZES.map((s) => ({ ...s, id: `${s.size}-${currentRound}` }));
    return shuffleArray(items);
  }, [currentRound]);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    if (showFinalCelebration) {
      const t = setTimeout(() => {
        completeQuiz({
          title: "Size Sorting",
          score: 8,
          total: 8,
          category: "logic",
        });
        onComplete?.();
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [showFinalCelebration, onComplete, completeQuiz]);

  const handleItemTap = (item) => {
    if (feedback !== null || showRoundCelebration) return;

    const expectedSizeOrder = tappedOrder.length;
    if (item.sizeOrder === expectedSizeOrder) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");
      setWrongTappedId(null);
      const nextOrder = [...tappedOrder, item.sizeOrder];
      setTappedOrder(nextOrder);

      if (nextOrder.length === 3) {
        setShowRoundCelebration(true);
        createCelebrationEmojis();

        updateProgress({
          title: "Size Sorting",
          score: currentRound + 1,
          total: 8,
          index: currentRound + 1,
        });

        setTimeout(() => {
          setShowRoundCelebration(false);
          setTappedOrder([]);
          setFeedback(null);

          if (currentRound >= 7) {
            setShowFinalCelebration(true);
          } else {
            setCurrentRound((r) => r + 1);
          }
        }, 1200);
      } else {
        setTimeout(() => setFeedback(null), 300);
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");
      setWrongTappedId(item.id);
      setTimeout(() => {
        setFeedback(null);
        setWrongTappedId(null);
        setTappedOrder([]);
      }, 800);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["⭐", "✨", "🌟", "🎉", "🎊", "👍"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const roundData = ROUNDS[currentRound];
  const score = currentRound;
  const progressPercent = Math.round(((currentRound + (tappedOrder.length / 3)) / 8) * 100);

  return (
    <div className="relative w-full min-h-[400px] bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-6 sm:p-8 overflow-hidden">
      {/* Celebration Emojis */}
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Header */}
      <div className="mb-6">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "📏 Τάξε από το μικρό στο μεγάλο!" : "📏 Sort from smallest to largest!"}
            </h2>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {score}/8
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-10">
              {Math.min(progressPercent, 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {score === 0 && tappedOrder.length === 0 && (
        <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          💡 {lang === "el"
            ? "Πάτα πρώτα το μικρότερο, μετά το μέτριο, μετά το μεγαλύτερο!"
            : "Tap the smallest first, then medium, then largest!"}
        </p>
      )}

      {/* Round title */}
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white text-center mb-6">
        {lang === "el" ? "Βρες τη σειρά:" : "Find the order:"} {roundData?.emoji}
      </h3>

      {/* Items - 3 cards in random order */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
        {displayItems.map((item) => {
          const isCorrectlyTapped = tappedOrder.includes(item.sizeOrder);
          const isWrongTapped = wrongTappedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemTap(item)}
              disabled={feedback !== null || showRoundCelebration}
              className={`
                bg-white dark:bg-slate-800 border-4
                rounded-2xl shadow-xl p-6 sm:p-8
                transform transition-all duration-200
                hover:scale-105 hover:shadow-2xl active:scale-95
                border-slate-200 dark:border-slate-600
                hover:border-amber-400 dark:hover:border-amber-500
                disabled:cursor-not-allowed disabled:opacity-90
                ${isCorrectlyTapped ? "ring-4 ring-green-500 bg-green-100 dark:bg-green-900/40 border-green-500" : ""}
                ${isWrongTapped ? "animate-shake border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
              `}
            >
              <div className={`${item.fontSize} select-none`}>
                {roundData?.emoji}
              </div>
            </button>
          );
        })}
      </div>

      {/* Wrong feedback message */}
      {feedback === "wrong" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 animate-shake">
            {lang === "el" ? "Προσπάθησε ξανά! ❌" : "Try again! ❌"}
          </p>
        </div>
      )}

      {/* Round celebration */}
      {showRoundCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 rounded-xl z-10 pointer-events-none">
          <div className="text-5xl sm:text-6xl font-bold text-green-600 dark:text-green-400 animate-bounce">
            {lang === "el" ? "Μπράβο! ✨" : "Great job! ✨"}
          </div>
        </div>
      )}

      {/* Final celebration overlay */}
      {showFinalCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/95 via-orange-400/95 to-yellow-400/95 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 flex items-center justify-center rounded-xl z-20">
          <div className="text-center animate-bounce">
            <div className="text-8xl sm:text-9xl mb-4">🏆📏✨</div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-xl sm:text-2xl text-white/95">
              {lang === "el"
                ? "Τάξες όλα σωστά από το μικρό στο μεγάλο!"
                : "You sorted everything correctly from small to large!"}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
