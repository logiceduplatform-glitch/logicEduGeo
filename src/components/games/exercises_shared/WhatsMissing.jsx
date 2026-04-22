// src/components/games/exercises_4_5/WhatsMissing.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WhatsMissing({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState("show"); // "show", "hide", "question"
  const [hiddenItem, setHiddenItem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 5; // 5 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        theme: "Φρούτα",
        emoji: "🍎",
        color: "#EF4444",
        items: [
          { id: 1, emoji: "🍎", name: "Μήλο" },
          { id: 2, emoji: "🍌", name: "Μπανάνα" },
          { id: 3, emoji: "🍊", name: "Πορτοκάλι" },
          { id: 4, emoji: "🍇", name: "Σταφύλι" },
          { id: 5, emoji: "🍓", name: "Φράουλα" },
        ]
      },
      {
        id: 2,
        theme: "Ζώα",
        emoji: "🐶",
        color: "#F59E0B",
        items: [
          { id: 1, emoji: "🐶", name: "Σκύλος" },
          { id: 2, emoji: "🐱", name: "Γάτα" },
          { id: 3, emoji: "🐰", name: "Κουνέλι" },
          { id: 4, emoji: "🐻", name: "Αρκούδα" },
          { id: 5, emoji: "🦊", name: "Αλεπού" },
        ]
      },
      {
        id: 3,
        theme: "Οχήματα",
        emoji: "🚗",
        color: "#3B82F6",
        items: [
          { id: 1, emoji: "🚗", name: "Αυτοκίνητο" },
          { id: 2, emoji: "🚌", name: "Λεωφορείο" },
          { id: 3, emoji: "🚂", name: "Τρένο" },
          { id: 4, emoji: "✈️", name: "Αεροπλάνο" },
          { id: 5, emoji: "🚁", name: "Ελικόπτερο" },
        ]
      },
      {
        id: 4,
        theme: "Παιχνίδια",
        emoji: "🧸",
        color: "#EC4899",
        items: [
          { id: 1, emoji: "🧸", name: "Αρκουδάκι" },
          { id: 2, emoji: "🎨", name: "Μπογιές" },
          { id: 3, emoji: "🎲", name: "Ζάρι" },
          { id: 4, emoji: "🪀", name: "Γιο-γιο" },
          { id: 5, emoji: "🎈", name: "Μπαλόνι" },
        ]
      },
      {
        id: 5,
        theme: "Φαγητό",
        emoji: "🍕",
        color: "#10B981",
        items: [
          { id: 1, emoji: "🍕", name: "Πίτσα" },
          { id: 2, emoji: "🍔", name: "Μπέργκερ" },
          { id: 3, emoji: "🍟", name: "Πατάτες" },
          { id: 4, emoji: "🌭", name: "Χοτ Ντογκ" },
          { id: 5, emoji: "🍦", name: "Παγωτό" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        theme: "Fruits",
        emoji: "🍎",
        color: "#EF4444",
        items: [
          { id: 1, emoji: "🍎", name: "Apple" },
          { id: 2, emoji: "🍌", name: "Banana" },
          { id: 3, emoji: "🍊", name: "Orange" },
          { id: 4, emoji: "🍇", name: "Grapes" },
          { id: 5, emoji: "🍓", name: "Strawberry" },
        ]
      },
      {
        id: 2,
        theme: "Animals",
        emoji: "🐶",
        color: "#F59E0B",
        items: [
          { id: 1, emoji: "🐶", name: "Dog" },
          { id: 2, emoji: "🐱", name: "Cat" },
          { id: 3, emoji: "🐰", name: "Rabbit" },
          { id: 4, emoji: "🐻", name: "Bear" },
          { id: 5, emoji: "🦊", name: "Fox" },
        ]
      },
      {
        id: 3,
        theme: "Vehicles",
        emoji: "🚗",
        color: "#3B82F6",
        items: [
          { id: 1, emoji: "🚗", name: "Car" },
          { id: 2, emoji: "🚌", name: "Bus" },
          { id: 3, emoji: "🚂", name: "Train" },
          { id: 4, emoji: "✈️", name: "Airplane" },
          { id: 5, emoji: "🚁", name: "Helicopter" },
        ]
      },
      {
        id: 4,
        theme: "Toys",
        emoji: "🧸",
        color: "#EC4899",
        items: [
          { id: 1, emoji: "🧸", name: "Teddy Bear" },
          { id: 2, emoji: "🎨", name: "Paint" },
          { id: 3, emoji: "🎲", name: "Dice" },
          { id: 4, emoji: "🪀", name: "Yo-yo" },
          { id: 5, emoji: "🎈", name: "Balloon" },
        ]
      },
      {
        id: 5,
        theme: "Food",
        emoji: "🍕",
        color: "#10B981",
        items: [
          { id: 1, emoji: "🍕", name: "Pizza" },
          { id: 2, emoji: "🍔", name: "Burger" },
          { id: 3, emoji: "🍟", name: "Fries" },
          { id: 4, emoji: "🌭", name: "Hot Dog" },
          { id: 5, emoji: "🍦", name: "Ice Cream" },
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
    startRound();
  }, [currentRound]);

  const startRound = () => {
    setPhase("show");
    setHiddenItem(null);
    setSelectedAnswer(null);
    setShowAnswer(false);

    // Show items for 3 seconds
    setTimeout(() => {
      hideRandomItem();
    }, 3000);
  };

  const hideRandomItem = () => {
    setPhase("hide");

    // Pick random item to hide
    const randomIndex = Math.floor(Math.random() * round.items.length);
    const itemToHide = round.items[randomIndex];
    setHiddenItem(itemToHide);

    // Show blank for 1 second, then ask question
    setTimeout(() => {
      setPhase("question");
    }, 1000);
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧠", "👀"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (item) => {
    if (showAnswer) return;

    setSelectedAnswer(item);
    setShowAnswer(true);

    const isCorrect = item.id === hiddenItem.id;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Update progress
      updateProgress({
        title: "What's Missing",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What's Missing",
        score: 1,
        total: 1,
      });

      // Go to next round
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          // All rounds complete
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Τι Λείπει;" : "What's Missing?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}: ${round.theme}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}: ${round.theme}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-3">{round.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: round.color }}>
            {round.theme}
          </h2>
          {phase === "show" && (
            <p className="text-lg text-slate-600">
              {lang === "el" ? "🧠 Θυμήσου τα αντικείμενα!" : "🧠 Remember the items!"}
            </p>
          )}
          {phase === "hide" && (
            <p className="text-lg text-slate-600">
              {lang === "el" ? "⏳ Περίμενε..." : "⏳ Wait..."}
            </p>
          )}
          {phase === "question" && (
            <p className="text-lg text-slate-600">
              {lang === "el" ? "❓ Τι έλειψε;" : "❓ What's missing?"}
            </p>
          )}
        </div>
      </div>

      {/* Items Display */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-slate-200">
          <div className="grid grid-cols-5 gap-6">
            {round.items.map((item) => {
              const isHidden = phase !== "show" && hiddenItem && item.id === hiddenItem.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-500 ${
                    isHidden ? "bg-slate-300" : "bg-gradient-to-br from-slate-50 to-slate-100"
                  }`}
                >
                  {isHidden ? (
                    <div className="text-8xl">❓</div>
                  ) : (
                    <>
                      <div className="text-8xl mb-2">{item.emoji}</div>
                      <p className="text-sm font-semibold text-slate-700 text-center">
                        {item.name}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answer Options */}
      {phase === "question" && (
        <div className="max-w-4xl mx-auto">
          <h4 className="text-xl font-bold text-center mb-4 text-slate-700">
            {lang === "el" ? "Ποιο έλειψε;" : "Which one is missing?"}
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {round.items.map((item) => {
              const isSelected = selectedAnswer && selectedAnswer.id === item.id;
              const isCorrect = showAnswer && item.id === hiddenItem.id;
              const isWrong = showAnswer && isSelected && item.id !== hiddenItem.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleAnswerSelect(item)}
                  disabled={showAnswer}
                  className={`
                    relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                    ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                    ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                    ${!showAnswer ? "bg-white border-slate-300 hover:border-purple-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                    ${showAnswer && !isSelected && item.id !== hiddenItem.id ? "opacity-50" : ""}
                  `}
                >
                  <div className="text-6xl">{item.emoji}</div>
                  {isCorrect && (
                    <div className="absolute -top-3 -right-3 text-5xl animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="absolute -top-3 -right-3 text-5xl">
                      ❌
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback Message */}
      {showAnswer && (
        <div className="mt-8 text-center animate-fadeIn">
          {selectedAnswer && selectedAnswer.id === hiddenItem.id ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Μπράβο! Σωστή απάντηση!" : "🎉 Great! Correct answer!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια Μνήμη!" : "Perfect Memory!"}
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

