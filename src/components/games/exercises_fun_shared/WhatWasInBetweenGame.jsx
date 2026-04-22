// src/components/games/WhatWasInBetweenGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function WhatWasInBetweenGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
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
        sequence: ["🍎", "🍌", "🍊"],
        middleItem: "🍌",
        middleName: "Μπανάνα",
        options: ["🍎", "🍌", "🍊", "🍇"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 2,
        sequence: ["🐶", "🐱", "🐰"],
        middleItem: "🐱",
        middleName: "Γάτα",
        options: ["🐶", "🐱", "🐰", "🐻"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 3,
        sequence: ["⭐", "🌙", "☀️"],
        middleItem: "🌙",
        middleName: "Φεγγάρι",
        options: ["⭐", "🌙", "☀️", "☁️"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 4,
        sequence: ["🚗", "🚌", "🚆"],
        middleItem: "🚌",
        middleName: "Λεωφορείο",
        options: ["🚗", "🚌", "🚆", "✈️"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 5,
        sequence: ["🌸", "🌺", "🌻"],
        middleItem: "🌺",
        middleName: "Λουλούδι",
        options: ["🌸", "🌺", "🌻", "🌷"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 6,
        sequence: ["1️⃣", "2️⃣", "3️⃣"],
        middleItem: "2️⃣",
        middleName: "Δύο",
        options: ["1️⃣", "2️⃣", "3️⃣", "4️⃣"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 7,
        sequence: ["🏀", "⚽", "🎾"],
        middleItem: "⚽",
        middleName: "Μπάλα Ποδοσφαίρου",
        options: ["🏀", "⚽", "🎾", "🏈"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 8,
        sequence: ["🍕", "🍔", "🌭"],
        middleItem: "🍔",
        middleName: "Μπέργκερ",
        options: ["🍕", "🍔", "🌭", "🍟"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 9,
        sequence: ["🦋", "🐝", "🐞"],
        middleItem: "🐝",
        middleName: "Μέλισσα",
        options: ["🦋", "🐝", "🐞", "🦗"],
        description: "Ποιο ήταν στη μέση;"
      },
      {
        id: 10,
        sequence: ["❤️", "💙", "💚"],
        middleItem: "💙",
        middleName: "Μπλε Καρδιά",
        options: ["❤️", "💙", "💚", "💛"],
        description: "Ποιο ήταν στη μέση;"
      }
    ],
    en: [
      {
        id: 1,
        sequence: ["🍎", "🍌", "🍊"],
        middleItem: "🍌",
        middleName: "Banana",
        options: ["🍎", "🍌", "🍊", "🍇"],
        description: "Which was in the middle?"
      },
      {
        id: 2,
        sequence: ["🐶", "🐱", "🐰"],
        middleItem: "🐱",
        middleName: "Cat",
        options: ["🐶", "🐱", "🐰", "🐻"],
        description: "Which was in the middle?"
      },
      {
        id: 3,
        sequence: ["⭐", "🌙", "☀️"],
        middleItem: "🌙",
        middleName: "Moon",
        options: ["⭐", "🌙", "☀️", "☁️"],
        description: "Which was in the middle?"
      },
      {
        id: 4,
        sequence: ["🚗", "🚌", "🚆"],
        middleItem: "🚌",
        middleName: "Bus",
        options: ["🚗", "🚌", "🚆", "✈️"],
        description: "Which was in the middle?"
      },
      {
        id: 5,
        sequence: ["🌸", "🌺", "🌻"],
        middleItem: "🌺",
        middleName: "Flower",
        options: ["🌸", "🌺", "🌻", "🌷"],
        description: "Which was in the middle?"
      },
      {
        id: 6,
        sequence: ["1️⃣", "2️⃣", "3️⃣"],
        middleItem: "2️⃣",
        middleName: "Two",
        options: ["1️⃣", "2️⃣", "3️⃣", "4️⃣"],
        description: "Which was in the middle?"
      },
      {
        id: 7,
        sequence: ["🏀", "⚽", "🎾"],
        middleItem: "⚽",
        middleName: "Soccer Ball",
        options: ["🏀", "⚽", "🎾", "🏈"],
        description: "Which was in the middle?"
      },
      {
        id: 8,
        sequence: ["🍕", "🍔", "🌭"],
        middleItem: "🍔",
        middleName: "Burger",
        options: ["🍕", "🍔", "🌭", "🍟"],
        description: "Which was in the middle?"
      },
      {
        id: 9,
        sequence: ["🦋", "🐝", "🐞"],
        middleItem: "🐝",
        middleName: "Bee",
        options: ["🦋", "🐝", "🐞", "🦗"],
        description: "Which was in the middle?"
      },
      {
        id: 10,
        sequence: ["❤️", "💙", "💚"],
        middleItem: "💙",
        middleName: "Blue Heart",
        options: ["❤️", "💙", "💚", "💛"],
        description: "Which was in the middle?"
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
    setShowSequence(true);
    setSelectedAnswer(null);
    setShowAnswer(false);

    // Hide sequence after 3 seconds
    const timer = setTimeout(() => {
      setShowSequence(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🧠"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? 'Θυμήσου ποιο ήταν στη μέση'
        : 'Remember which was in the middle';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === round.middleItem;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "What Was In Between Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What Was In Between Game",
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιό ήταν Ανάμεσα;" : "What Was In Between?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
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

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-indigo-400">
          <div className="text-7xl mb-3">🧠</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {lang === "el" ? "Θυμήσου τη σειρά!" : "Remember the sequence!"}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Sequence Display */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-indigo-400">
          {showSequence ? (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {lang === "el" ? "Κοίτα τη σειρά:" : "Look at the sequence:"}
              </p>

              <div className="flex justify-center items-center gap-8 mb-6">
                {round.sequence.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-indigo-300 flex items-center justify-center shadow-lg animate-bounce"
                      style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="text-8xl">{item}</div>
                    </div>
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white font-bold px-3 py-1 rounded-full text-sm animate-pulse">
                        {lang === "el" ? "ΜΕΣΗ" : "MIDDLE"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600 animate-pulse">
                  {lang === "el" ? "Θυμήσου ποιο είναι στη μέση..." : "Remember which is in the middle..."}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {round.description}
              </p>

              <div className="flex justify-center items-center gap-8 mb-8">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-slate-400 flex items-center justify-center shadow-lg">
                    <div className="text-6xl">❓</div>
                  </div>
                ))}
              </div>

              <p className="text-xl font-bold text-center text-slate-700 mb-6">
                {lang === "el" ? "Διάλεξε ποιο ήταν στη μέση:" : "Choose which was in the middle:"}
              </p>

              {/* Options */}
              <div className="flex justify-center gap-4">
                {round.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = showAnswer && option === round.middleItem;
                  const isWrong = showAnswer && isSelected && option !== round.middleItem;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showAnswer}
                      className={`
                        relative w-24 h-24 rounded-2xl transition-all duration-300 transform
                        ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                        ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                        ${!showAnswer ? "bg-white border-slate-300 hover:border-indigo-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                        ${showAnswer && !isSelected && option !== round.middleItem ? "opacity-50" : ""}
                        border-4 flex items-center justify-center
                      `}
                    >
                      <div className="text-6xl">{option}</div>

                      {isCorrect && (
                        <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
                          ✅
                        </div>
                      )}
                      {isWrong && (
                        <div className="absolute -top-3 -right-3 text-4xl">
                          ❌
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {showAnswer && selectedAnswer === round.middleItem && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Η ${round.middleName} ήταν στη μέση!`
                : `🎉 Correct! The ${round.middleName} was in the middle!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedAnswer !== round.middleItem && (
        <div className="text-center animate-fadeIn">
          <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
            <p className="text-3xl font-bold text-red-700">
              {lang === "el"
                ? `Προσπάθησε ξανά! Η σωστή απάντηση ήταν: ${round.middleItem}`
                : `Try again! The correct answer was: ${round.middleItem}`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική μνήμη!" : "Perfect! You have excellent memory!"}
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

