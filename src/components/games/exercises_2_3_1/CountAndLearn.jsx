// src/components/games/CountAndLearn.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function CountAndLearn({ lang = "el", onComplete }) {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const emojis = [
    { id: "apple", emoji: "🍎", name: { el: "Μήλα", en: "Apples" } },
    { id: "banana", emoji: "🍌", name: { el: "Μπανάνες", en: "Bananas" } },
    { id: "star", emoji: "⭐", name: { el: "Αστέρια", en: "Stars" } },
    { id: "heart", emoji: "❤️", name: { el: "Καρδιές", en: "Hearts" } },
    { id: "ball", emoji: "⚽", name: { el: "Μπάλες", en: "Balls" } },
    { id: "flower", emoji: "🌸", name: { el: "Λουλούδια", en: "Flowers" } },
  ];

  const numbers = [1, 2, 3, 4, 5];
  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    // Αρχικοποίηση
    generateNewQuestion();
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [score, showCelebration, onComplete]);

  const generateNewQuestion = () => {
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setCurrentNumber(randomNumber);
    setCurrentEmoji(randomEmoji);
  };

  const handleNumberSelect = (selectedNumber) => {
    if (feedback !== null) return;

    if (selectedNumber === currentNumber) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Count & Learn",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Count & Learn",
        score: 1,
        total: 1,
      });

      // Επόμενη ερώτηση μετά από 1.5 δευτερόλεπτα
      setTimeout(() => {
        setFeedback(null);
        generateNewQuestion();
      }, 1500);
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
      emoji: ["🎉", "⭐", "✨", "🌟", "🎊"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  if (!currentNumber || !currentEmoji) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "Μέτρησε & Μάθε!" : "Count & Learn!"}
            </h2>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              🔢 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {score === 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 text-center">
            <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300">
              {lang === "el"
                ? "🔢 Μέτρησε πόσα βλέπεις και πάτα τον σωστό αριθμό!"
                : "🔢 Count how many you see and tap the correct number!"}
            </p>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Display Objects to Count */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-6">
            {lang === "el" ? "Μέτρησε τα" : "Count the"} {currentEmoji.name[lang]}:
          </h3>

          {/* Objects Display */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-3xl shadow-2xl p-8 border-8 border-white dark:border-slate-700">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {Array.from({ length: currentNumber }, (_, i) => (
                <div
                  key={i}
                  className="text-7xl sm:text-8xl animate-bounce"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1s",
                  }}
                >
                  {currentEmoji.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Number in Text */}
          <div className="text-center mt-6 text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
            {lang === "el" ? "Πόσα είναι;" : "How many are there?"}
          </div>
        </div>

        {/* Number Buttons */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              disabled={feedback !== null}
              className={`h-32 sm:h-36 rounded-3xl shadow-xl transform transition-all duration-200
                hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center border-4 border-white dark:border-slate-600
                bg-gradient-to-br from-cyan-400 to-blue-500
                ${feedback === "correct" && number === currentNumber ? "scale-110 ring-4 ring-green-400" : ""}
                ${feedback === "wrong" && number === currentNumber ? "animate-shake" : ""}`}
            >
              <div className="text-6xl sm:text-7xl font-bold text-white drop-shadow-lg">
                {number}
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
          className="fixed text-5xl pointer-events-none animate-float"
          style={{
            left: `${emoji.x}%`,
            top: "20%",
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
          className="fixed text-4xl font-bold text-green-600 pointer-events-none z-50 animate-float-up"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl text-center max-w-md w-full animate-fadeIn">
            <div className="text-8xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-4">
              {lang === "el"
                ? `Μέτρησες όλα σωστά!`
                : `You counted everything correctly!`}
            </p>
            <div className="text-3xl font-bold text-blue-600">🔢 {score}/{TARGET_SCORE} 🔢</div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-150vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 2s ease-out forwards;
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
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
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

