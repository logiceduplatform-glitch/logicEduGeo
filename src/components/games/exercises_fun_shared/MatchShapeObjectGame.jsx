// src/components/games/MatchShapeObjectGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function MatchShapeObjectGame({ lang = "el", onComplete, difficulty = 3 }) {
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

  const TARGET_ROUNDS = 10; // 10 ταιριάσματα

  const matchesData = {
    el: [
      {
        id: 1,
        object: { emoji: "⚽", name: "Μπάλα" },
        correctShape: "circle",
        color: "#EF4444",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 2,
        object: { emoji: "📦", name: "Κουτί" },
        correctShape: "square",
        color: "#F59E0B",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 3,
        object: { emoji: "🍕", name: "Πίτσα" },
        correctShape: "triangle",
        color: "#10B981",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 4,
        object: { emoji: "🌕", name: "Φεγγάρι" },
        correctShape: "circle",
        color: "#EAB308",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 5,
        object: { emoji: "🪟", name: "Παράθυρο" },
        correctShape: "square",
        color: "#3B82F6",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 6,
        object: { emoji: "⛺", name: "Σκηνή" },
        correctShape: "triangle",
        color: "#14B8A6",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 7,
        object: { emoji: "🎯", name: "Στόχος" },
        correctShape: "circle",
        color: "#EC4899",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 8,
        object: { emoji: "🧀", name: "Τυρί" },
        correctShape: "triangle",
        color: "#F59E0B",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 9,
        object: { emoji: "🍪", name: "Μπισκότο" },
        correctShape: "circle",
        color: "#A855F7",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      },
      {
        id: 10,
        object: { emoji: "📺", name: "Τηλεόραση" },
        correctShape: "square",
        color: "#8B5CF6",
        shapes: [
          { id: "circle", name: "Κύκλος", shape: "○" },
          { id: "square", name: "Τετράγωνο", shape: "□" },
          { id: "triangle", name: "Τρίγωνο", shape: "△" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        object: { emoji: "⚽", name: "Ball" },
        correctShape: "circle",
        color: "#EF4444",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 2,
        object: { emoji: "📦", name: "Box" },
        correctShape: "square",
        color: "#F59E0B",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 3,
        object: { emoji: "🍕", name: "Pizza" },
        correctShape: "triangle",
        color: "#10B981",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 4,
        object: { emoji: "🌕", name: "Moon" },
        correctShape: "circle",
        color: "#EAB308",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 5,
        object: { emoji: "🪟", name: "Window" },
        correctShape: "square",
        color: "#3B82F6",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 6,
        object: { emoji: "⛺", name: "Tent" },
        correctShape: "triangle",
        color: "#14B8A6",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 7,
        object: { emoji: "🎯", name: "Target" },
        correctShape: "circle",
        color: "#EC4899",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 8,
        object: { emoji: "🧀", name: "Cheese" },
        correctShape: "triangle",
        color: "#F59E0B",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 9,
        object: { emoji: "🍪", name: "Cookie" },
        correctShape: "circle",
        color: "#A855F7",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      },
      {
        id: 10,
        object: { emoji: "📺", name: "TV" },
        correctShape: "square",
        color: "#8B5CF6",
        shapes: [
          { id: "circle", name: "Circle", shape: "○" },
          { id: "square", name: "Square", shape: "□" },
          { id: "triangle", name: "Triangle", shape: "△" }
        ]
      }
    ]
  };

  const matches = matchesData[lang];
  const round = matches[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔷", "✅"][Math.floor(Math.random() * 6)],
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
        ? `Ποιο σχήμα μοιάζει με το ${round.object.name};`
        : `Which shape looks like the ${round.object.name}?`;

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
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (shapeId) => {
    if (showAnswer) return;

    setSelectedAnswer(shapeId);
    setShowAnswer(true);

    const isCorrect = shapeId === round.correctShape;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Match Shape Object Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Match Shape Object Game",
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ταίριαξε Σχήμα-Αντικείμενο" : "Match Shape-Object"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ταίριασμα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Match ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🔷 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-500 ease-out"
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
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Ποιο σχήμα μοιάζει με αυτό;" : "Which shape looks like this?"}
          </h2>

          {/* Object Display */}
          <div className="mb-6">
            <div className="text-9xl mb-2">{round.object.emoji}</div>
            <p className="text-3xl font-bold text-slate-800">{round.object.name}</p>
          </div>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Shape Options */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-6">
          {round.shapes.map((shape) => {
            const isSelected = selectedAnswer === shape.id;
            const isCorrect = showAnswer && shape.id === round.correctShape;
            const isWrong = showAnswer && isSelected && shape.id !== round.correctShape;

            return (
              <button
                key={shape.id}
                onClick={() => handleAnswerSelect(shape.id)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-cyan-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && shape.id !== round.correctShape ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-9xl mb-4" style={{ color: round.color }}>{shape.shape}</div>
                  <p className="text-2xl font-bold text-slate-800">{shape.name}</p>

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
          {selectedAnswer === round.correctShape ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! ${round.object.name} μοιάζει με ${round.shapes.find(s => s.id === round.correctShape)?.name}!`
                  : `🎉 Correct! ${round.object.name} looks like a ${round.shapes.find(s => s.id === round.correctShape)?.name}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Το σωστό είναι: ${round.shapes.find(s => s.id === round.correctShape)?.name}!`
                  : `The correct one is: ${round.shapes.find(s => s.id === round.correctShape)?.name}!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔷🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να ταιριάζεις σχήματα!" : "Perfect! You know how to match shapes!"}
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

