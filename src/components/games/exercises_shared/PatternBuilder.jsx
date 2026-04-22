// src/components/games/exercises_4_5/PatternBuilder.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function PatternBuilder({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const dropSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 6; // 6 μοτίβα

  const roundsData = {
    el: [
      {
        id: 1,
        pattern: ["🔴", "🔵", "🔴", "🔵"],
        missing: 2,
        options: ["🔴", "🔵", "🟡"],
        correct: ["🔴", "🔵"],
        label: "Κόκκινο-Μπλε"
      },
      {
        id: 2,
        pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"],
        missing: 1,
        options: ["⭐", "🌙", "☀️"],
        correct: ["🌙"],
        label: "Αστέρι-Φεγγάρι"
      },
      {
        id: 3,
        pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"],
        missing: 2,
        options: ["🍎", "🍌", "🍊"],
        correct: ["🍌", "🍎"],
        label: "Μήλο-Μήλο-Μπανάνα"
      },
      {
        id: 4,
        pattern: ["🐱", "🐕", "🐱", "🐕"],
        missing: 2,
        options: ["🐱", "🐕", "🐠"],
        correct: ["🐱", "🐕"],
        label: "Γάτα-Σκύλος"
      },
      {
        id: 5,
        pattern: ["🌸", "🌺", "🌸", "🌺", "🌸"],
        missing: 2,
        options: ["🌸", "🌺", "🌻"],
        correct: ["🌺", "🌸"],
        label: "Λουλούδι Ροζ-Κόκκινο"
      },
      {
        id: 6,
        pattern: ["🍕", "🍔", "🍟", "🍕", "🍔"],
        missing: 2,
        options: ["🍕", "🍔", "🍟"],
        correct: ["🍟", "🍕"],
        label: "Πίτσα-Μπέργκερ-Πατάτες"
      }
    ],
    en: [
      {
        id: 1,
        pattern: ["🔴", "🔵", "🔴", "🔵"],
        missing: 2,
        options: ["🔴", "🔵", "🟡"],
        correct: ["🔴", "🔵"],
        label: "Red-Blue"
      },
      {
        id: 2,
        pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"],
        missing: 1,
        options: ["⭐", "🌙", "☀️"],
        correct: ["🌙"],
        label: "Star-Moon"
      },
      {
        id: 3,
        pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"],
        missing: 2,
        options: ["🍎", "🍌", "🍊"],
        correct: ["🍌", "🍎"],
        label: "Apple-Apple-Banana"
      },
      {
        id: 4,
        pattern: ["🐱", "🐕", "🐱", "🐕"],
        missing: 2,
        options: ["🐱", "🐕", "🐠"],
        correct: ["🐱", "🐕"],
        label: "Cat-Dog"
      },
      {
        id: 5,
        pattern: ["🌸", "🌺", "🌸", "🌺", "🌸"],
        missing: 2,
        options: ["🌸", "🌺", "🌻"],
        correct: ["🌺", "🌸"],
        label: "Pink-Red Flower"
      },
      {
        id: 6,
        pattern: ["🍕", "🍔", "🍟", "🍕", "🍔"],
        missing: 2,
        options: ["🍕", "🍔", "🍟"],
        correct: ["🍟", "🍕"],
        label: "Pizza-Burger-Fries"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    dropSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    dropSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎨", "🔄"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleOptionClick = (option) => {
    if (showAnswer || selectedOptions.length >= round.missing) return;

    dropSoundRef.current?.play().catch(() => {});
    setSelectedOptions([...selectedOptions, option]);
  };

  const handleRemoveLast = () => {
    if (showAnswer || selectedOptions.length === 0) return;
    setSelectedOptions(selectedOptions.slice(0, -1));
  };

  const checkPattern = () => {
    if (selectedOptions.length !== round.missing) return;

    setShowAnswer(true);

    const isCorrect = selectedOptions.every((item, index) => item === round.correct[index]);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Pattern Builder",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Pattern Builder",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedOptions([]);
          setShowAnswer(false);
        } else {
          // Τελείωσαν όλοι οι γύροι
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
        setSelectedOptions([]);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const canCheck = selectedOptions.length === round.missing && !showAnswer;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Φτιάξε το Μοτίβο" : "Build the Pattern"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Μοτίβο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Pattern ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎨 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? "🔄 Συνέχισε το μοτίβο! Τι έρχεται μετά;"
            : "🔄 Continue the pattern! What comes next?"}
        </p>
      </div>

      {/* Pattern Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-purple-300">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {/* Existing Pattern */}
            {round.pattern.map((item, index) => (
              <div
                key={index}
                className="w-20 h-20 flex items-center justify-center bg-purple-50 rounded-2xl border-4 border-purple-300"
              >
                <div className="text-5xl">{item}</div>
              </div>
            ))}

            {/* Arrow */}
            <div className="text-4xl text-purple-600">→</div>

            {/* Missing Slots */}
            {Array.from({ length: round.missing }, (_, index) => (
              <div
                key={`missing-${index}`}
                className={`w-20 h-20 flex items-center justify-center rounded-2xl border-4 border-dashed transition-all duration-300 ${
                  selectedOptions[index]
                    ? "bg-green-100 border-green-500"
                    : showAnswer
                    ? "bg-red-100 border-red-500"
                    : "bg-blue-50 border-blue-300 animate-pulse"
                }`}
              >
                {selectedOptions[index] ? (
                  <div className="text-5xl">{selectedOptions[index]}</div>
                ) : (
                  <div className="text-4xl text-blue-300">?</div>
                )}
              </div>
            ))}
          </div>

          {/* Counter */}
          <div className="text-center">
            <div className="inline-block bg-purple-100 rounded-xl px-6 py-2 border-2 border-purple-300">
              <span className="text-lg font-bold text-purple-700">
                {lang === "el"
                  ? `Επιλέχθηκαν: ${selectedOptions.length} / ${round.missing}`
                  : `Selected: ${selectedOptions.length} / ${round.missing}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-4xl mx-auto mb-8">
        <h4 className="text-xl font-bold text-center mb-4 text-slate-700">
          {lang === "el" ? "Επιλογές" : "Options"}
        </h4>
        <div className="flex justify-center gap-4">
          {round.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={showAnswer || selectedOptions.length >= round.missing}
              className="w-24 h-24 flex items-center justify-center bg-white rounded-2xl border-4 border-slate-300 hover:border-purple-400 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-6xl">{option}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto flex justify-center gap-4">
        {selectedOptions.length > 0 && !showAnswer && (
          <button
            onClick={handleRemoveLast}
            className="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            {lang === "el" ? "↩️ Αναίρεση" : "↩️ Undo"}
          </button>
        )}

        {canCheck && (
          <button
            onClick={checkPattern}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg animate-pulse"
          >
            {lang === "el" ? "✓ Έλεγχος" : "✓ Check"}
          </button>
        )}
      </div>

      {/* Feedback Message */}
      {showAnswer && (
        <div className="mt-8 text-center animate-fadeIn">
          {selectedOptions.every((item, index) => item === round.correct[index]) ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Μπράβο! Σωστό μοτίβο!" : "🎉 Great! Correct pattern!"}
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

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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

