// src/components/games/exercises_2_3_1/OddOneOut.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

const ROUNDS = [
  { items: ["🍎", "🍌", "🍊", "🚗"], odd: "🚗" },
  { items: ["🐶", "🐱", "🐰", "🌳"], odd: "🌳" },
  { items: ["⭐", "🌙", "☀️", "🐟"], odd: "🐟" },
  { items: ["🔵", "🔴", "🟢", "🐕"], odd: "🐕" },
  { items: ["🚗", "🚌", "✈️", "🍕"], odd: "🍕" },
  { items: ["🍕", "🍎", "🍊", "🐶"], odd: "🐶" },
  { items: ["🏠", "🌳", "🌸", "🚗"], odd: "🚗" },
  { items: ["👕", "👖", "👟", "📖"], odd: "📖" },
  { items: ["🌻", "🌷", "🌸", "⚽"], odd: "⚽" },
  { items: ["🐕", "🐱", "🐰", "🚲"], odd: "🚲" },
];

const TARGET_ROUNDS = ROUNDS.length;
const NEXT_DELAY = 1500;
const WRONG_DELAY = 800;

export default function OddOneOut({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const round = ROUNDS[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎯"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const shuffleItems = (items) => {
    return [...items].sort(() => Math.random() - 0.5);
  };

  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    if (round) {
      setShuffledItems(shuffleItems(round.items));
    }
  }, [currentRound]);

  const handleSelect = (emoji) => {
    if (showFeedback) return;

    setSelectedEmoji(emoji);
    setShowFeedback(true);

    const isCorrect = emoji === round.odd;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      updateProgress({
        title: "Odd One Out",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound((prev) => prev + 1);
          setSelectedEmoji(null);
          setShowFeedback(false);
        } else {
          completeQuiz({
            title: "Odd One Out",
            score: newScore,
            total: TARGET_ROUNDS,
            category: "exercises_2_3",
          });
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, 2500);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setShakeKey((k) => k + 1);
      setTimeout(() => {
        setSelectedEmoji(null);
        setShowFeedback(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  if (!round) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Popup */}
      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 dark:text-green-400 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {lang === "el" ? "🔍 Ποιο Δεν Ταιριάζει;" : "🔍 Odd One Out"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === "el"
                  ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                  : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
              </p>
            </div>
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              🎯 {score}/{TARGET_ROUNDS}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {currentRound + 1}/10
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {lang === "el"
            ? "👆 Πάτα αυτό που δεν ταιριάζει!"
            : "👆 Tap the one that doesn't belong!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {lang === "el"
            ? "Βρες το διαφορετικό αντικείμενο"
            : "Find the different item"}
        </p>
      </div>

      {/* Emoji Buttons Grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4 sm:gap-6">
        {shuffledItems.map((emoji, idx) => {
          const isCorrect = showFeedback && emoji === round.odd;
          const isWrong = showFeedback && selectedEmoji === emoji && emoji !== round.odd;

          return (
            <button
              key={`${emoji}-${idx}-${shakeKey}`}
              onClick={() => handleSelect(emoji)}
              disabled={showFeedback}
              className={`
                h-28 sm:h-32 rounded-2xl border-4 transition-all duration-300 transform
                bg-white dark:bg-slate-800
                border-slate-300 dark:border-slate-600
                hover:scale-105 hover:border-violet-400 dark:hover:border-violet-500
                active:scale-95
                flex items-center justify-center
                disabled:cursor-not-allowed
                shadow-lg
                ${isCorrect ? "bg-green-100 dark:bg-green-900/50 border-green-500 scale-105 ring-4 ring-green-300 dark:ring-green-600" : ""}
                ${isWrong ? "bg-red-100 dark:bg-red-900/50 border-red-500 animate-shake" : ""}
                ${showFeedback && !isCorrect && !isWrong ? "opacity-50" : ""}
              `}
            >
              <div className="text-6xl sm:text-7xl">
                {emoji}
              </div>
            </button>
          );
        })}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-300/90 to-indigo-400/90 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white dark:text-slate-100 mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white dark:text-slate-200">
              {lang === "el"
                ? `Βρήκες ${score}/${TARGET_ROUNDS} διαφορετικά!`
                : `You found ${score}/${TARGET_ROUNDS} odd ones out!`}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
