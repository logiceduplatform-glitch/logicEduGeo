// src/components/games/FindMissingNumberGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function FindMissingNumberGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
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

  const TARGET_ROUNDS = 10; // 10 ακολουθίες

  const sequencesData = {
    el: [
      {
        id: 1,
        sequence: [1, 2, "?", 4, 5],
        missingNumber: 3,
        options: [2, 3, 4],
        color: "#EF4444"
      },
      {
        id: 2,
        sequence: [3, 4, 5, "?", 7],
        missingNumber: 6,
        options: [5, 6, 7],
        color: "#10B981"
      },
      {
        id: 3,
        sequence: [6, "?", 8, 9, 10],
        missingNumber: 7,
        options: [6, 7, 8],
        color: "#3B82F6"
      },
      {
        id: 4,
        sequence: [2, 3, 4, 5, "?"],
        missingNumber: 6,
        options: [5, 6, 7],
        color: "#EAB308"
      },
      {
        id: 5,
        sequence: ["?", 5, 6, 7, 8],
        missingNumber: 4,
        options: [3, 4, 5],
        color: "#EC4899"
      },
      {
        id: 6,
        sequence: [7, 8, "?", 10, 11],
        missingNumber: 9,
        options: [8, 9, 10],
        color: "#8B5CF6"
      },
      {
        id: 7,
        sequence: [1, "?", 3, 4, 5],
        missingNumber: 2,
        options: [1, 2, 3],
        color: "#F59E0B"
      },
      {
        id: 8,
        sequence: [4, 5, 6, "?", 8],
        missingNumber: 7,
        options: [6, 7, 8],
        color: "#14B8A6"
      },
      {
        id: 9,
        sequence: [8, 9, 10, 11, "?"],
        missingNumber: 12,
        options: [11, 12, 13],
        color: "#06B6D4"
      },
      {
        id: 10,
        sequence: ["?", 2, 3, 4, 5],
        missingNumber: 1,
        options: [0, 1, 2],
        color: "#A855F7"
      }
    ],
    en: [
      {
        id: 1,
        sequence: [1, 2, "?", 4, 5],
        missingNumber: 3,
        options: [2, 3, 4],
        color: "#EF4444"
      },
      {
        id: 2,
        sequence: [3, 4, 5, "?", 7],
        missingNumber: 6,
        options: [5, 6, 7],
        color: "#10B981"
      },
      {
        id: 3,
        sequence: [6, "?", 8, 9, 10],
        missingNumber: 7,
        options: [6, 7, 8],
        color: "#3B82F6"
      },
      {
        id: 4,
        sequence: [2, 3, 4, 5, "?"],
        missingNumber: 6,
        options: [5, 6, 7],
        color: "#EAB308"
      },
      {
        id: 5,
        sequence: ["?", 5, 6, 7, 8],
        missingNumber: 4,
        options: [3, 4, 5],
        color: "#EC4899"
      },
      {
        id: 6,
        sequence: [7, 8, "?", 10, 11],
        missingNumber: 9,
        options: [8, 9, 10],
        color: "#8B5CF6"
      },
      {
        id: 7,
        sequence: [1, "?", 3, 4, 5],
        missingNumber: 2,
        options: [1, 2, 3],
        color: "#F59E0B"
      },
      {
        id: 8,
        sequence: [4, 5, 6, "?", 8],
        missingNumber: 7,
        options: [6, 7, 8],
        color: "#14B8A6"
      },
      {
        id: 9,
        sequence: [8, 9, 10, 11, "?"],
        missingNumber: 12,
        options: [11, 12, 13],
        color: "#06B6D4"
      },
      {
        id: 10,
        sequence: ["?", 2, 3, 4, 5],
        missingNumber: 1,
        options: [0, 1, 2],
        color: "#A855F7"
      }
    ]
  };

  const sequences = sequencesData[lang];
  const round = sequences[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "✅"][Math.floor(Math.random() * 6)],
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
        ? `Ποιος αριθμός λείπει;`
        : `Which number is missing?`;

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
    // Speak question automatically when round changes
    const timer = safeTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === round.missingNumber;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Find Missing Number Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Find Missing Number Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες τον Αριθμό που Λείπει" : "Find the Missing Number"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ακολουθία ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Sequence ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            🔢 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-4">❓</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Ποιος αριθμός λείπει;" : "Which number is missing?"}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Number Sequence */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex justify-center gap-3 mb-8">
          {round.sequence.map((num, index) => (
            <div
              key={index}
              className={`
                w-20 h-20 flex items-center justify-center text-5xl font-bold rounded-2xl border-4 transition-all
                ${num === "?" ? "bg-yellow-100 border-yellow-400 animate-pulse" : "bg-white border-slate-300"}
              `}
              style={{ borderColor: num === "?" ? round.color : undefined }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Options */}
        <div className="flex justify-center gap-6">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showAnswer && option === round.missingNumber;
            const isWrong = showAnswer && isSelected && option !== round.missingNumber;

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative w-24 h-24 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-indigo-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option !== round.missingNumber ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-5xl font-bold text-slate-800">{option}</div>

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

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.missingNumber ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! Ο αριθμός που έλειπε είναι το ${round.missingNumber}!`
                  : `🎉 Correct! The missing number is ${round.missingNumber}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Ο σωστός αριθμός είναι το ${round.missingNumber}!`
                  : `The correct number is ${round.missingNumber}!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βρίσκεις τους αριθμούς που λείπουν!" : "Perfect! You know how to find missing numbers!"}
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

