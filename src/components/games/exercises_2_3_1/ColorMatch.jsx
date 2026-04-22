// src/components/games/ColorMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ColorMatch({ lang = "el", onComplete }) {
  const [currentColor, setCurrentColor] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const colors = [
    {
      id: "red",
      name: { el: "Κόκκινο", en: "Red" },
      hex: "#EF4444",
      emoji: "🔴",
    },
    {
      id: "blue",
      name: { el: "Μπλε", en: "Blue" },
      hex: "#3B82F6",
      emoji: "🔵",
    },
    {
      id: "yellow",
      name: { el: "Κίτρινο", en: "Yellow" },
      hex: "#FBBF24",
      emoji: "🟡",
    },
    {
      id: "green",
      name: { el: "Πράσινο", en: "Green" },
      hex: "#10B981",
      emoji: "🟢",
    },
  ];

  const TARGET_SCORE = 10; // 10 σωστές απαντήσεις

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    // Αρχικοποίηση με τυχαίο χρώμα
    setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE && !showCelebration) {
      createCelebrationEmojis();
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [score, showCelebration, onComplete]);

  const handleColorSelect = (selectedColor) => {
    if (!currentColor) return;

    if (selectedColor.id === currentColor.id) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Celebration emojis
      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Color Match",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Color Match",
        score: 1,
        total: 1,
      });

      // Επόμενο χρώμα μετά από 1 δευτερόλεπτο
      setTimeout(() => {
        setFeedback(null);
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentColor(nextColor);
      }, 1000);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  if (!currentColor) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {lang === "el" ? "Ταύτιση Χρωμάτων!" : "Color Match!"}
            </h2>
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">
              🎨 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {score === 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 text-center">
            <p className="text-lg sm:text-xl font-semibold text-slate-700">
              {lang === "el"
                ? "🎨 Πάτα το χρώμα που ταιριάζει!"
                : "🎨 Tap the matching color!"}
            </p>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Target Color Display */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white text-center mb-6">
            {lang === "el" ? "Βρες αυτό το χρώμα:" : "Find this color:"}
          </h3>
          <div className="flex justify-center">
            <div
              className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl flex items-center justify-center
                transform transition-all duration-300 border-8 border-white
                ${feedback === "correct" ? "scale-110 animate-pulse" : ""}
                ${feedback === "wrong" ? "animate-shake" : ""}`}
              style={{ backgroundColor: currentColor.hex }}
            >
              <div className="text-8xl sm:text-9xl">
                {currentColor.emoji}
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-2xl sm:text-3xl font-bold text-slate-700">
            {currentColor.name[lang]}
          </div>
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color)}
              disabled={feedback !== null}
              className={`h-32 sm:h-40 rounded-3xl shadow-xl transform transition-all duration-200
                hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                flex flex-col items-center justify-center gap-2 border-4 border-white
                ${feedback === "correct" && color.id === currentColor.id ? "scale-110 ring-4 ring-green-400" : ""}
                ${feedback === "wrong" && color.id === currentColor.id ? "animate-shake" : ""}`}
              style={{ backgroundColor: color.hex }}
            >
              <div className="text-5xl sm:text-6xl">{color.emoji}</div>
              <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
                {color.name[lang]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback === "correct" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-9xl animate-bounce">
            ✅
          </div>
        </div>
      )}

      {feedback === "wrong" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-9xl animate-shake">
            ❌
          </div>
        </div>
      )}

      {/* Celebration Emojis */}
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl pointer-events-none z-40"
          style={{
            left: `${emoji.x}%`,
            top: "50%",
            animation: "float-up 2s ease-out forwards",
            animationDelay: `${emoji.delay}s`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Score Popup */}
      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      {/* Celebration Overlay - Covers only the game board */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}

