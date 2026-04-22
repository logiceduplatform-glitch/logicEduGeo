// src/components/games/exercises_4_5_1/PatternRecognitionGame.jsx - Age 4-5 override
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function PatternRecognitionGame({ lang = "el", onComplete }) {
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

  const NEXT_DELAY = 2500;
  const WRONG_DELAY = 1500;

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      { id: 1, question: "Ποιο έρχεται μετά;", pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"], correctAnswer: "🔵", options: ["🔵", "🔴", "🟢"], color: "#EF4444" },
      { id: 2, question: "Ποιο έρχεται μετά;", pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"], correctAnswer: "🌙", options: ["⭐", "🌙", "☀️"], color: "#EAB308" },
      { id: 3, question: "Ποιο έρχεται μετά;", pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"], correctAnswer: "🍌", options: ["🍎", "🍌", "🍊"], color: "#EF4444" },
      { id: 4, question: "Ποιο έρχεται μετά;", pattern: ["🐶", "🐱", "🐶", "🐱", "🐶"], correctAnswer: "🐱", options: ["🐶", "🐱", "🐦"], color: "#10B981" },
      { id: 5, question: "Ποιο έρχεται μετά;", pattern: ["❤️", "💙", "❤️", "💙", "❤️"], correctAnswer: "💙", options: ["❤️", "💙", "💚"], color: "#EC4899" },
      { id: 6, question: "Ποιο έρχεται μετά;", pattern: ["🌸", "🌻", "🌸", "🌻", "🌸"], correctAnswer: "🌻", options: ["🌸", "🌻", "🌹"], color: "#A855F7" },
      { id: 7, question: "Ποιο έρχεται μετά;", pattern: ["🎈", "🎈", "🎀", "🎈", "🎈"], correctAnswer: "🎀", options: ["🎈", "🎀", "🎁"], color: "#06B6D4" },
      { id: 8, question: "Ποιο έρχεται μετά;", pattern: ["🐸", "🐸", "🦋", "🐸", "🐸"], correctAnswer: "🦋", options: ["🐸", "🦋", "🐛"], color: "#22C55E" },
      { id: 9, question: "Ποιο έρχεται μετά;", pattern: ["🍓", "🍇", "🍓", "🍇", "🍓"], correctAnswer: "🍇", options: ["🍓", "🍇", "🍊"], color: "#EF4444" },
      { id: 10, question: "Ποιο έρχεται μετά;", pattern: ["☀️", "🌧️", "☀️", "🌧️", "☀️"], correctAnswer: "🌧️", options: ["☀️", "🌧️", "🌈"], color: "#F97316" },
      { id: 11, question: "Ποιο έρχεται μετά;", pattern: ["🟡", "🟣", "🟡", "🟣", "🟡"], correctAnswer: "🟣", options: ["🟡", "🟣", "🟢"], color: "#EAB308" },
      { id: 12, question: "Ποιο έρχεται μετά;", pattern: ["🐣", "🐥", "🐣", "🐥", "🐣"], correctAnswer: "🐥", options: ["🐣", "🐥", "🐔"], color: "#F59E0B" },
      { id: 13, question: "Ποιο έρχεται μετά;", pattern: ["🎵", "🎶", "🎵", "🎶", "🎵"], correctAnswer: "🎶", options: ["🎵", "🎶", "🔔"], color: "#8B5CF6" },
      { id: 14, question: "Ποιο έρχεται μετά;", pattern: ["🌺", "🍀", "🌺", "🍀", "🌺"], correctAnswer: "🍀", options: ["🌺", "🍀", "🌻"], color: "#22C55E" },
      { id: 15, question: "Ποιο έρχεται μετά;", pattern: ["🐠", "🦀", "🐠", "🦀", "🐠"], correctAnswer: "🦀", options: ["🐠", "🦀", "🐟"], color: "#06B6D4" }
    ],
    en: [
      { id: 1, question: "What comes next?", pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"], correctAnswer: "🔵", options: ["🔵", "🔴", "🟢"], color: "#EF4444" },
      { id: 2, question: "What comes next?", pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"], correctAnswer: "🌙", options: ["⭐", "🌙", "☀️"], color: "#EAB308" },
      { id: 3, question: "What comes next?", pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"], correctAnswer: "🍌", options: ["🍎", "🍌", "🍊"], color: "#EF4444" },
      { id: 4, question: "What comes next?", pattern: ["🐶", "🐱", "🐶", "🐱", "🐶"], correctAnswer: "🐱", options: ["🐶", "🐱", "🐦"], color: "#10B981" },
      { id: 5, question: "What comes next?", pattern: ["❤️", "💙", "❤️", "💙", "❤️"], correctAnswer: "💙", options: ["❤️", "💙", "💚"], color: "#EC4899" },
      { id: 6, question: "What comes next?", pattern: ["🌸", "🌻", "🌸", "🌻", "🌸"], correctAnswer: "🌻", options: ["🌸", "🌻", "🌹"], color: "#A855F7" },
      { id: 7, question: "What comes next?", pattern: ["🎈", "🎈", "🎀", "🎈", "🎈"], correctAnswer: "🎀", options: ["🎈", "🎀", "🎁"], color: "#06B6D4" },
      { id: 8, question: "What comes next?", pattern: ["🐸", "🐸", "🦋", "🐸", "🐸"], correctAnswer: "🦋", options: ["🐸", "🦋", "🐛"], color: "#22C55E" },
      { id: 9, question: "What comes next?", pattern: ["🍓", "🍇", "🍓", "🍇", "🍓"], correctAnswer: "🍇", options: ["🍓", "🍇", "🍊"], color: "#EF4444" },
      { id: 10, question: "What comes next?", pattern: ["☀️", "🌧️", "☀️", "🌧️", "☀️"], correctAnswer: "🌧️", options: ["☀️", "🌧️", "🌈"], color: "#F97316" },
      { id: 11, question: "What comes next?", pattern: ["🟡", "🟣", "🟡", "🟣", "🟡"], correctAnswer: "🟣", options: ["🟡", "🟣", "🟢"], color: "#EAB308" },
      { id: 12, question: "What comes next?", pattern: ["🐣", "🐥", "🐣", "🐥", "🐣"], correctAnswer: "🐥", options: ["🐣", "🐥", "🐔"], color: "#F59E0B" },
      { id: 13, question: "What comes next?", pattern: ["🎵", "🎶", "🎵", "🎶", "🎵"], correctAnswer: "🎶", options: ["🎵", "🎶", "🔔"], color: "#8B5CF6" },
      { id: 14, question: "What comes next?", pattern: ["🌺", "🍀", "🌺", "🍀", "🌺"], correctAnswer: "🍀", options: ["🌺", "🍀", "🌻"], color: "#22C55E" },
      { id: 15, question: "What comes next?", pattern: ["🐠", "🦀", "🐠", "🦀", "🐠"], correctAnswer: "🦀", options: ["🐠", "🦀", "🐟"], color: "#06B6D4" }
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

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔄", "✅"][Math.floor(Math.random() * 6)],
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

      const utterance = new SpeechSynthesisUtterance(round.question);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Pattern Recognition Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Pattern Recognition Game",
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Αναγνώριση Μοτίβου" : "Pattern Recognition"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Μοτίβο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Pattern ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-pink-600">
            🔄 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Pattern Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="flex justify-center items-center gap-4 mb-6">
            {round.pattern.map((item, index) => (
              <div
                key={index}
                className="text-8xl transform transition-all duration-300 hover:scale-110"
                style={{ color: round.color }}
              >
                {item}
              </div>
            ))}
            <div className="text-8xl font-bold text-slate-400">
              ?
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-6">
          {round.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showAnswer && option === round.correctAnswer;
            const isWrong = showAnswer && isSelected && option !== round.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-pink-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option !== round.correctAnswer ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-9xl mb-2">{option}</div>

                  {isCorrect && (
                    <div className="text-7xl animate-bounce absolute -top-4 -right-4">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-7xl absolute -top-4 -right-4">
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
          {selectedAnswer === round.correctAnswer ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! Το μοτίβο συνεχίζεται με ${round.correctAnswer}!`
                  : `🎉 Correct! The pattern continues with ${round.correctAnswer}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Το σωστό είναι: ${round.correctAnswer}`
                  : `The correct one is: ${round.correctAnswer}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-300/80 to-fuchsia-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔄🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να αναγνωρίζεις μοτίβα!" : "Perfect! You know how to recognize patterns!"}
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
