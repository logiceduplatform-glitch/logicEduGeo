// src/components/games/FlippedShapesGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FlippedShapesGame({ lang = "el", onComplete, difficulty = 3 }) {
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

  const TARGET_ROUNDS = 10; // 10 ερωτήσεις

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Βρες το τρίγωνο που δείχνει προς τα πάνω",
        correctAnswer: "A",
        color: "#EF4444",
        options: [
          { id: "A", emoji: "🔺", rotation: 0, isCorrect: true },
          { id: "B", emoji: "🔻", rotation: 0, isCorrect: false },
          { id: "C", emoji: "🔺", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Βρες το βέλος που δείχνει προς τα δεξιά",
        correctAnswer: "B",
        color: "#10B981",
        options: [
          { id: "A", emoji: "➡️", rotation: 180, isCorrect: false },
          { id: "B", emoji: "➡️", rotation: 0, isCorrect: true },
          { id: "C", emoji: "➡️", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Βρες το αστέρι που είναι ίσιο",
        correctAnswer: "A",
        color: "#EAB308",
        options: [
          { id: "A", emoji: "⭐", rotation: 0, isCorrect: true },
          { id: "B", emoji: "⭐", rotation: 45, isCorrect: false },
          { id: "C", emoji: "⭐", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Βρες το σπίτι που είναι ίσιο",
        correctAnswer: "C",
        color: "#3B82F6",
        options: [
          { id: "A", emoji: "🏠", rotation: 45, isCorrect: false },
          { id: "B", emoji: "🏠", rotation: 180, isCorrect: false },
          { id: "C", emoji: "🏠", rotation: 0, isCorrect: true }
        ]
      },
      {
        id: 5,
        question: "Βρες την καρδιά που είναι ίσια",
        correctAnswer: "B",
        color: "#EC4899",
        options: [
          { id: "A", emoji: "❤️", rotation: 90, isCorrect: false },
          { id: "B", emoji: "❤️", rotation: 0, isCorrect: true },
          { id: "C", emoji: "❤️", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 6,
        question: "Βρες το δέντρο που είναι ίσιο",
        correctAnswer: "A",
        color: "#22C55E",
        options: [
          { id: "A", emoji: "🌲", rotation: 0, isCorrect: true },
          { id: "B", emoji: "🌲", rotation: 45, isCorrect: false },
          { id: "C", emoji: "🌲", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 7,
        question: "Βρες το διαμάντι που δείχνει προς τα πάνω",
        correctAnswer: "C",
        color: "#06B6D4",
        options: [
          { id: "A", emoji: "💎", rotation: 180, isCorrect: false },
          { id: "B", emoji: "💎", rotation: 90, isCorrect: false },
          { id: "C", emoji: "💎", rotation: 0, isCorrect: true }
        ]
      },
      {
        id: 8,
        question: "Βρες το κουδούνι που είναι ίσιο",
        correctAnswer: "B",
        color: "#A855F7",
        options: [
          { id: "A", emoji: "🔔", rotation: 45, isCorrect: false },
          { id: "B", emoji: "🔔", rotation: 0, isCorrect: true },
          { id: "C", emoji: "🔔", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 9,
        question: "Βρες το κεραυνό που δείχνει προς τα κάτω",
        correctAnswer: "A",
        color: "#F59E0B",
        options: [
          { id: "A", emoji: "⚡", rotation: 0, isCorrect: true },
          { id: "B", emoji: "⚡", rotation: 180, isCorrect: false },
          { id: "C", emoji: "⚡", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 10,
        question: "Βρες τον ήλιο που είναι ίσιος",
        correctAnswer: "C",
        color: "#EAB308",
        options: [
          { id: "A", emoji: "☀️", rotation: 45, isCorrect: false },
          { id: "B", emoji: "☀️", rotation: 90, isCorrect: false },
          { id: "C", emoji: "☀️", rotation: 0, isCorrect: true }
        ]
      }
    ],
    en: [
      {
        id: 1,
        question: "Find the triangle pointing up",
        correctAnswer: "A",
        color: "#EF4444",
        options: [
          { id: "A", emoji: "🔺", rotation: 0, isCorrect: true },
          { id: "B", emoji: "🔻", rotation: 0, isCorrect: false },
          { id: "C", emoji: "🔺", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Find the arrow pointing right",
        correctAnswer: "B",
        color: "#10B981",
        options: [
          { id: "A", emoji: "➡️", rotation: 180, isCorrect: false },
          { id: "B", emoji: "➡️", rotation: 0, isCorrect: true },
          { id: "C", emoji: "➡️", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Find the star that is straight",
        correctAnswer: "A",
        color: "#EAB308",
        options: [
          { id: "A", emoji: "⭐", rotation: 0, isCorrect: true },
          { id: "B", emoji: "⭐", rotation: 45, isCorrect: false },
          { id: "C", emoji: "⭐", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Find the house that is straight",
        correctAnswer: "C",
        color: "#3B82F6",
        options: [
          { id: "A", emoji: "🏠", rotation: 45, isCorrect: false },
          { id: "B", emoji: "🏠", rotation: 180, isCorrect: false },
          { id: "C", emoji: "🏠", rotation: 0, isCorrect: true }
        ]
      },
      {
        id: 5,
        question: "Find the heart that is straight",
        correctAnswer: "B",
        color: "#EC4899",
        options: [
          { id: "A", emoji: "❤️", rotation: 90, isCorrect: false },
          { id: "B", emoji: "❤️", rotation: 0, isCorrect: true },
          { id: "C", emoji: "❤️", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 6,
        question: "Find the tree that is straight",
        correctAnswer: "A",
        color: "#22C55E",
        options: [
          { id: "A", emoji: "🌲", rotation: 0, isCorrect: true },
          { id: "B", emoji: "🌲", rotation: 45, isCorrect: false },
          { id: "C", emoji: "🌲", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 7,
        question: "Find the diamond pointing up",
        correctAnswer: "C",
        color: "#06B6D4",
        options: [
          { id: "A", emoji: "💎", rotation: 180, isCorrect: false },
          { id: "B", emoji: "💎", rotation: 90, isCorrect: false },
          { id: "C", emoji: "💎", rotation: 0, isCorrect: true }
        ]
      },
      {
        id: 8,
        question: "Find the bell that is straight",
        correctAnswer: "B",
        color: "#A855F7",
        options: [
          { id: "A", emoji: "🔔", rotation: 45, isCorrect: false },
          { id: "B", emoji: "🔔", rotation: 0, isCorrect: true },
          { id: "C", emoji: "🔔", rotation: 180, isCorrect: false }
        ]
      },
      {
        id: 9,
        question: "Find the lightning pointing down",
        correctAnswer: "A",
        color: "#F59E0B",
        options: [
          { id: "A", emoji: "⚡", rotation: 0, isCorrect: true },
          { id: "B", emoji: "⚡", rotation: 180, isCorrect: false },
          { id: "C", emoji: "⚡", rotation: 90, isCorrect: false }
        ]
      },
      {
        id: 10,
        question: "Find the sun that is straight",
        correctAnswer: "C",
        color: "#EAB308",
        options: [
          { id: "A", emoji: "☀️", rotation: 45, isCorrect: false },
          { id: "B", emoji: "☀️", rotation: 90, isCorrect: false },
          { id: "C", emoji: "☀️", rotation: 0, isCorrect: true }
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

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔄", "✅"][Math.floor(Math.random() * 6)],
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

      const utterance = new SpeechSynthesisUtterance(round.question);
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
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

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
        title: "Flipped Shapes Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Flipped Shapes Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
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

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Σωστός Προσανατολισμός" : "Correct Orientation"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ερώτηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Question ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🔄 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all duration-500 ease-out"
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
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Shape Options */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-6">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = showAnswer && option.id === round.correctAnswer;
            const isWrong = showAnswer && isSelected && option.id !== round.correctAnswer;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-purple-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.id !== round.correctAnswer ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div
                    className="text-9xl mb-2 inline-block transition-transform duration-300"
                    style={{
                      transform: `rotate(${option.rotation}deg)`,
                      color: round.color
                    }}
                  >
                    {option.emoji}
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{option.id}</p>

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
                  ? `🎉 Σωστά! Η επιλογή ${round.correctAnswer} έχει τον σωστό προσανατολισμό!`
                  : `🎉 Correct! Option ${round.correctAnswer} has the correct orientation!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Η σωστή είναι η ${round.correctAnswer}!`
                  : `The correct one is ${round.correctAnswer}!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-300/80 to-fuchsia-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔄🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βρίσκεις τον σωστό προσανατολισμό!" : "Perfect! You know how to find the correct orientation!"}
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

