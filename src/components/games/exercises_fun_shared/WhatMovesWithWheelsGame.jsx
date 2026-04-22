// src/components/games/WhatMovesWithWheelsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WhatMovesWithWheelsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        vehicle: { emoji: "🚗", name: "Αυτοκίνητο" },
        correctAnswer: "yes",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 2,
        vehicle: { emoji: "✈️", name: "Αεροπλάνο" },
        correctAnswer: "no",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 3,
        vehicle: { emoji: "🚲", name: "Ποδήλατο" },
        correctAnswer: "yes",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 4,
        vehicle: { emoji: "⛵", name: "Βάρκα" },
        correctAnswer: "no",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 5,
        vehicle: { emoji: "🚌", name: "Λεωφορείο" },
        correctAnswer: "yes",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 6,
        vehicle: { emoji: "🚁", name: "Ελικόπτερο" },
        correctAnswer: "no",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 7,
        vehicle: { emoji: "🛴", name: "Πατίνι" },
        correctAnswer: "yes",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 8,
        vehicle: { emoji: "🚤", name: "Ταχύπλοο" },
        correctAnswer: "no",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 9,
        vehicle: { emoji: "🚚", name: "Φορτηγό" },
        correctAnswer: "yes",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      },
      {
        id: 10,
        vehicle: { emoji: "🚢", name: "Πλοίο" },
        correctAnswer: "no",
        question: "Μετακινείται με ρόδες;",
        options: [
          { id: "yes", emoji: "✅", label: "Ναι" },
          { id: "no", emoji: "❌", label: "Όχι" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        vehicle: { emoji: "🚗", name: "Car" },
        correctAnswer: "yes",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 2,
        vehicle: { emoji: "✈️", name: "Airplane" },
        correctAnswer: "no",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 3,
        vehicle: { emoji: "🚲", name: "Bicycle" },
        correctAnswer: "yes",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 4,
        vehicle: { emoji: "⛵", name: "Boat" },
        correctAnswer: "no",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 5,
        vehicle: { emoji: "🚌", name: "Bus" },
        correctAnswer: "yes",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 6,
        vehicle: { emoji: "🚁", name: "Helicopter" },
        correctAnswer: "no",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 7,
        vehicle: { emoji: "🛴", name: "Scooter" },
        correctAnswer: "yes",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 8,
        vehicle: { emoji: "🚤", name: "Speedboat" },
        correctAnswer: "no",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 9,
        vehicle: { emoji: "🚚", name: "Truck" },
        correctAnswer: "yes",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      },
      {
        id: 10,
        vehicle: { emoji: "🚢", name: "Ship" },
        correctAnswer: "no",
        question: "Does it move with wheels?",
        options: [
          { id: "yes", emoji: "✅", label: "Yes" },
          { id: "no", emoji: "❌", label: "No" }
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🚗", "⚙️"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "What Moves With Wheels Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What Moves With Wheels Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ποιο Μετακινείται με Ρόδες;" : "What Moves with Wheels?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-slate-600">
            ⚙️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-400 to-zinc-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-slate-400">
          <div className="text-7xl mb-3">⚙️</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-slate-400">
          {/* Vehicle Display with Road */}
          <div className="bg-gradient-to-b from-sky-200 to-slate-300 rounded-3xl p-10 border-4 border-slate-400 mb-8 shadow-lg relative overflow-hidden">
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-700 flex items-center justify-center">
              <div className="flex gap-8 w-full justify-center">
                <div className="w-16 h-1 bg-yellow-400" />
                <div className="w-16 h-1 bg-yellow-400" />
                <div className="w-16 h-1 bg-yellow-400" />
                <div className="w-16 h-1 bg-yellow-400" />
                <div className="w-16 h-1 bg-yellow-400" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 relative z-10">
              {/* Vehicle */}
              <div className="text-9xl animate-bounce">
                {round.vehicle.emoji}
              </div>

              {/* Vehicle Name */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-slate-300">
                <p className="text-3xl font-bold text-center text-slate-800">
                  {round.vehicle.name}
                </p>
              </div>

              {/* Wheels indicator (decorative) */}
              <div className="text-6xl">
                ⚙️
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="flex justify-center gap-8 max-w-2xl mx-auto">
                {round.options.map((option) => {
                  const isYes = option.id === "yes";
                  const bgColor = isYes
                    ? "from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border-green-300 hover:border-green-500"
                    : "from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 border-red-300 hover:border-red-500";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className={`flex-1 p-10 rounded-3xl bg-gradient-to-br ${bgColor} border-4 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer`}
                    >
                      <div className="text-9xl mb-4">{option.emoji}</div>
                      <p className="text-3xl font-bold text-slate-700 text-center">
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{round.vehicle.emoji}</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                  {correctOption.id === "yes" && <div className="text-6xl">⚙️⚙️</div>}
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? correctOption.id === "yes"
                      ? `🎉 Σωστά! Το ${round.vehicle.name} έχει ρόδες!`
                      : `🎉 Σωστά! Το ${round.vehicle.name} δεν έχει ρόδες!`
                    : correctOption.id === "yes"
                      ? `🎉 Correct! The ${round.vehicle.name} has wheels!`
                      : `🎉 Correct! The ${round.vehicle.name} doesn't have wheels!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου πώς μετακινείται!`
                    : `Try again! Think about how it moves!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300/80 to-zinc-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">⚙️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις ποια έχουν ρόδες!" : "Perfect! You know which have wheels!"}
            </h3>
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
      `}</style>
    </div>
  );
}

