// src/components/games/WhatRemainsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function WhatRemainsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const [currentRound, setCurrentRound] = useState(0);
  const [showRemoval, setShowRemoval] = useState(false);
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

  const TARGET_ROUNDS = 10; // 10 αφαιρέσεις

  const subtractionsData = {
    el: [
      {
        id: 1,
        emoji: "🍎",
        name: "μήλα",
        initial: 5,
        remove: 2,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EF4444"
      },
      {
        id: 2,
        emoji: "🍌",
        name: "μπανάνες",
        initial: 6,
        remove: 3,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EAB308"
      },
      {
        id: 3,
        emoji: "⭐",
        name: "αστέρια",
        initial: 7,
        remove: 4,
        remaining: 3,
        options: [2, 3, 4],
        color: "#F59E0B"
      },
      {
        id: 4,
        emoji: "🐶",
        name: "σκυλάκια",
        initial: 8,
        remove: 5,
        remaining: 3,
        options: [2, 3, 4],
        color: "#10B981"
      },
      {
        id: 5,
        emoji: "🎈",
        name: "μπαλόνια",
        initial: 4,
        remove: 1,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EC4899"
      },
      {
        id: 6,
        emoji: "🌸",
        name: "λουλούδια",
        initial: 9,
        remove: 4,
        remaining: 5,
        options: [4, 5, 6],
        color: "#A855F7"
      },
      {
        id: 7,
        emoji: "🚗",
        name: "αυτοκίνητα",
        initial: 7,
        remove: 3,
        remaining: 4,
        options: [3, 4, 5],
        color: "#3B82F6"
      },
      {
        id: 8,
        emoji: "🍕",
        name: "πίτσες",
        initial: 6,
        remove: 4,
        remaining: 2,
        options: [1, 2, 3],
        color: "#F97316"
      },
      {
        id: 9,
        emoji: "⚽",
        name: "μπάλες",
        initial: 10,
        remove: 6,
        remaining: 4,
        options: [3, 4, 5],
        color: "#14B8A6"
      },
      {
        id: 10,
        emoji: "📚",
        name: "βιβλία",
        initial: 8,
        remove: 3,
        remaining: 5,
        options: [4, 5, 6],
        color: "#8B5CF6"
      }
    ],
    en: [
      {
        id: 1,
        emoji: "🍎",
        name: "apples",
        initial: 5,
        remove: 2,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EF4444"
      },
      {
        id: 2,
        emoji: "🍌",
        name: "bananas",
        initial: 6,
        remove: 3,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EAB308"
      },
      {
        id: 3,
        emoji: "⭐",
        name: "stars",
        initial: 7,
        remove: 4,
        remaining: 3,
        options: [2, 3, 4],
        color: "#F59E0B"
      },
      {
        id: 4,
        emoji: "🐶",
        name: "dogs",
        initial: 8,
        remove: 5,
        remaining: 3,
        options: [2, 3, 4],
        color: "#10B981"
      },
      {
        id: 5,
        emoji: "🎈",
        name: "balloons",
        initial: 4,
        remove: 1,
        remaining: 3,
        options: [2, 3, 4],
        color: "#EC4899"
      },
      {
        id: 6,
        emoji: "🌸",
        name: "flowers",
        initial: 9,
        remove: 4,
        remaining: 5,
        options: [4, 5, 6],
        color: "#A855F7"
      },
      {
        id: 7,
        emoji: "🚗",
        name: "cars",
        initial: 7,
        remove: 3,
        remaining: 4,
        options: [3, 4, 5],
        color: "#3B82F6"
      },
      {
        id: 8,
        emoji: "🍕",
        name: "pizzas",
        initial: 6,
        remove: 4,
        remaining: 2,
        options: [1, 2, 3],
        color: "#F97316"
      },
      {
        id: 9,
        emoji: "⚽",
        name: "balls",
        initial: 10,
        remove: 6,
        remaining: 4,
        options: [3, 4, 5],
        color: "#14B8A6"
      },
      {
        id: 10,
        emoji: "📚",
        name: "books",
        initial: 8,
        remove: 3,
        remaining: 5,
        options: [4, 5, 6],
        color: "#8B5CF6"
      }
    ]
  };

  const subtractions = subtractionsData[lang];
  const round = subtractions[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    // Reset states when round changes
    setShowRemoval(false);
    setSelectedAnswer(null);
    setShowAnswer(false);

    // Show removal animation after 6 seconds (increased for children to count)
    const timer = safeTimeout(() => {
      setShowRemoval(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "➖", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? `Έχουμε ${round.initial} ${round.name}. Αφαιρούμε ${round.remove}. Πόσα μένουν;`
        : `We have ${round.initial} ${round.name}. We remove ${round.remove}. How many remain?`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === round.remaining;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "What Remains Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What Remains Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      safeTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-amber-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Τι Έμεινε;" : "What Remains?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Αφαίρεση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Subtraction ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            ➖ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500 ease-out"
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
          <h2 className="text-2xl font-bold mb-2 text-slate-800">
            {lang === "el"
              ? `Έχουμε ${round.initial} ${round.name}`
              : `We have ${round.initial} ${round.name}`}
          </h2>
          {showRemoval && (
            <p className="text-xl text-red-600 font-bold animate-fadeIn">
              {lang === "el"
                ? `➖ Αφαιρούμε ${round.remove}`
                : `➖ Remove ${round.remove}`}
            </p>
          )}

          <button
            onClick={speakQuestion}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      {/* Visual representation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="flex flex-wrap justify-center gap-4 min-h-[200px] items-center">
            {[...Array(round.initial)].map((_, index) => {
              const shouldRemove = showRemoval && index >= round.remaining;

              return (
                <div
                  key={index}
                  className={`
                    text-7xl transition-all duration-1000 transform
                    ${shouldRemove ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100'}
                  `}
                >
                  {round.emoji}
                </div>
              );
            })}
          </div>

          {!showRemoval && (
            <p className="text-center text-2xl font-bold text-slate-700 mt-4">
              {lang === "el" ? "Περίμενε..." : "Wait..."}
            </p>
          )}
        </div>
      </div>

      {showRemoval && (
        <>
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-slate-800">
              {lang === "el" ? "Πόσα μένουν;" : "How many remain?"}
            </h3>
          </div>

          {/* Options */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-center gap-6">
              {round.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = showAnswer && option === round.remaining;
                const isWrong = showAnswer && isSelected && option !== round.remaining;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer}
                    className={`
                      relative w-28 h-28 rounded-2xl border-4 transition-all duration-300 transform
                      ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                      ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                      ${!showAnswer ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                      ${showAnswer && !isSelected && option !== round.remaining ? "opacity-50" : ""}
                    `}
                  >
                    <div className="text-center">
                      <div className="text-6xl font-bold text-slate-800">{option}</div>

                      {isCorrect && (
                        <div className="text-5xl animate-bounce absolute -top-4 -right-4">
                          ✅
                        </div>
                      )}
                      {isWrong && (
                        <div className="text-5xl absolute -top-4 -right-4">
                          ❌
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.remaining ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! ${round.initial} - ${round.remove} = ${round.remaining}!`
                  : `🎉 Correct! ${round.initial} - ${round.remove} = ${round.remaining}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Μένουν ${round.remaining}!`
                  : `${round.remaining} remain!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-amber-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">➖🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να αφαιρείς!" : "Perfect! You know how to subtract!"}
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

