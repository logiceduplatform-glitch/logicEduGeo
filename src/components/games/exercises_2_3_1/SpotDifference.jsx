// src/components/games/SpotDifference.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SpotDifference({ lang = "el", onComplete }) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [wrongClick, setWrongClick] = useState(null);
  const [hasCompletedCurrent, setHasCompletedCurrent] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const puzzles = [
    {
      id: "fruits",
      name: { el: "Φρούτα", en: "Fruits" },
      emoji: "🍎",
      grid: 3,
      original: [
        "🍎", "🍌", "🍊",
        "🍇", "🍓", "🍉",
        "🍒", "🍑", "🍍"
      ],
      modified: [
        "🍎", "🍌", "🍊",
        "🍇", "🍋", "🍉", // 🍓 → 🍋 (διαφορά)
        "🍒", "🍑", "🥝"  // 🍍 → 🥝 (διαφορά)
      ],
      differences: [4, 8] // indexes που είναι διαφορετικά
    },
    {
      id: "animals",
      name: { el: "Ζώα", en: "Animals" },
      emoji: "🐶",
      grid: 3,
      original: [
        "🐶", "🐱", "🐭",
        "🐹", "🐰", "🦊",
        "🐻", "🐼", "🐨"
      ],
      modified: [
        "🐶", "🐱", "🐭",
        "🐹", "🐯", "🦊", // 🐰 → 🐯 (διαφορά)
        "🐻", "🐷", "🐨"  // 🐼 → 🐷 (διαφορά)
      ],
      differences: [4, 7]
    },
    {
      id: "vehicles",
      name: { el: "Οχήματα", en: "Vehicles" },
      emoji: "🚗",
      grid: 3,
      original: [
        "🚗", "🚕", "🚙",
        "🚌", "🚎", "🏎️",
        "🚓", "🚑", "🚒"
      ],
      modified: [
        "🚗", "🚕", "🚙",
        "🚌", "🚐", "🏎️", // 🚎 → 🚐 (διαφορά)
        "🚓", "🚑", "🚛"  // 🚒 → 🚛 (διαφορά)
      ],
      differences: [4, 8]
    }
  ];

  const TARGET_PUZZLES = puzzles.length;
  const currentPuzzleData = puzzles[currentPuzzle];
  const totalDifferences = currentPuzzleData?.differences.length || 0;
  const isCurrentComplete = foundDifferences.length === totalDifferences && totalDifferences > 0;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  // Reset completion flag when puzzle changes
  useEffect(() => {
    setHasCompletedCurrent(false);
  }, [currentPuzzle]);

  useEffect(() => {
    if (isCurrentComplete && !hasCompletedCurrent && !showCelebration) {
      setHasCompletedCurrent(true);

      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + totalDifferences;
      setScore(newScore);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Spot Difference",
        score: newScore,
        total: TARGET_PUZZLES * 2, // 2 διαφορές ανά puzzle
        index: (currentPuzzle * 2) + totalDifferences,
      });

      // Cup of Month - ανά puzzle
      completeQuiz({
        title: "Spot Difference",
        score: totalDifferences,
        total: totalDifferences,
      });

      // Έλεγχος αν τελείωσαν όλα τα puzzles
      if (currentPuzzle + 1 >= TARGET_PUZZLES) {
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      } else {
        // Επόμενο puzzle
        setTimeout(() => {
          setCurrentPuzzle((prev) => prev + 1);
          setFoundDifferences([]);
        }, 2000);
      }
    }
  }, [isCurrentComplete, hasCompletedCurrent, showCelebration]);

  const handleClick = (index, isModified = false) => {
    if (!isModified || foundDifferences.includes(index)) return;

    if (currentPuzzleData.differences.includes(index)) {
      // Σωστή διαφορά! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFoundDifferences((prev) => [...prev, index]);
      createCelebrationEmojis();
    } else {
      // Λάθος κλικ ❌
      wrongSoundRef.current?.play().catch(() => {});
      setWrongClick(index);
      setTimeout(() => {
        setWrongClick(null);
      }, 500);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎪", "⭐", "✨", "🌟", "🎉", "👀"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentPuzzleData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {currentPuzzleData.emoji} {currentPuzzleData.name[lang]}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === "el" ? "Παζλ" : "Puzzle"} {currentPuzzle + 1}/{TARGET_PUZZLES}
              </p>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              🎪 {foundDifferences.length}/{totalDifferences}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out"
                style={{ width: `${(foundDifferences.length / totalDifferences) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {Math.round((foundDifferences.length / totalDifferences) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {lang === "el"
            ? "👀 Βρες τις Διαφορές!"
            : "👀 Find the Differences!"}
        </h2>
        <p className="text-lg text-slate-700">
          {lang === "el"
            ? `Πάτα τις διαφορές στην δεξιά εικόνα! (${totalDifferences} διαφορές)`
            : `Tap the differences in the right image! (${totalDifferences} differences)`}
        </p>
      </div>

      {/* Main Content - Two Grids Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Original Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
            {lang === "el" ? "Πρωτότυπο" : "Original"}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${currentPuzzleData.grid}, 1fr)`
            }}
          >
            {currentPuzzleData.original.map((emoji, index) => (
              <div
                key={`orig-${index}`}
                className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center text-6xl cursor-default"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Modified Grid - Clickable */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
            {lang === "el" ? "Βρες εδώ!" : "Find here!"}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${currentPuzzleData.grid}, 1fr)`
            }}
          >
            {currentPuzzleData.modified.map((emoji, index) => {
              const isDifference = currentPuzzleData.differences.includes(index);
              const isFound = foundDifferences.includes(index);
              const isWrongClick = wrongClick === index;

              return (
                <button
                  key={`mod-${index}`}
                  onClick={() => handleClick(index, true)}
                  disabled={isFound}
                  className={`
                    aspect-square rounded-xl border-4 flex items-center justify-center text-6xl
                    transition-all duration-200
                    ${isFound
                      ? "bg-green-200 border-green-500 ring-4 ring-green-300 scale-105"
                      : isWrongClick
                      ? "bg-red-200 border-red-500 animate-shake"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:scale-105 cursor-pointer active:scale-95"
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  {emoji}
                  {isFound && (
                    <span className="absolute text-4xl">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hint */}
      {foundDifferences.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 bg-white/70 inline-block px-4 py-2 rounded-lg">
            💡 {lang === "el"
              ? "Συμβουλή: Σύγκρινε κάθε θέση στις δύο εικόνες!"
              : "Tip: Compare each position in both images!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/90 to-orange-400/90 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎪🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Βρήκες όλες τις διαφορές!"
                : "You found all the differences!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

