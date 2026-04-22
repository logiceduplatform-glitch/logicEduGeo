// src/components/games/WhichIsLessGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function WhichIsLessGame({ lang = "el", onComplete, difficulty = 3 }) {
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

  const TARGET_ROUNDS = 10; // 10 συγκρίσεις

  const comparisonsData = {
    el: [
      {
        id: 1,
        groupA: { count: 3, emoji: "🍎", name: "μήλα" },
        groupB: { count: 5, emoji: "🍌", name: "μπανάνες" },
        correctAnswer: "A",
        color: "#EF4444"
      },
      {
        id: 2,
        groupA: { count: 7, emoji: "🐶", name: "σκυλάκια" },
        groupB: { count: 4, emoji: "🐱", name: "γατάκια" },
        correctAnswer: "B",
        color: "#10B981"
      },
      {
        id: 3,
        groupA: { count: 2, emoji: "⭐", name: "αστέρια" },
        groupB: { count: 6, emoji: "🌙", name: "φεγγάρια" },
        correctAnswer: "A",
        color: "#EAB308"
      },
      {
        id: 4,
        groupA: { count: 8, emoji: "🚗", name: "αυτοκίνητα" },
        groupB: { count: 3, emoji: "🚌", name: "λεωφορεία" },
        correctAnswer: "B",
        color: "#3B82F6"
      },
      {
        id: 5,
        groupA: { count: 4, emoji: "🌸", name: "λουλούδια" },
        groupB: { count: 9, emoji: "🌻", name: "ηλιοτρόπια" },
        correctAnswer: "A",
        color: "#EC4899"
      },
      {
        id: 6,
        groupA: { count: 6, emoji: "🎈", name: "μπαλόνια" },
        groupB: { count: 2, emoji: "🎁", name: "δώρα" },
        correctAnswer: "B",
        color: "#8B5CF6"
      },
      {
        id: 7,
        groupA: { count: 5, emoji: "🍕", name: "πίτσες" },
        groupB: { count: 7, emoji: "🍔", name: "μπέργκερ" },
        correctAnswer: "A",
        color: "#F59E0B"
      },
      {
        id: 8,
        groupA: { count: 9, emoji: "⚽", name: "μπάλες" },
        groupB: { count: 4, emoji: "🏀", name: "μπάσκετ" },
        correctAnswer: "B",
        color: "#14B8A6"
      },
      {
        id: 9,
        groupA: { count: 3, emoji: "🦋", name: "πεταλούδες" },
        groupB: { count: 8, emoji: "🐝", name: "μέλισσες" },
        correctAnswer: "A",
        color: "#06B6D4"
      },
      {
        id: 10,
        groupA: { count: 7, emoji: "📚", name: "βιβλία" },
        groupB: { count: 5, emoji: "✏️", name: "μολύβια" },
        correctAnswer: "B",
        color: "#A855F7"
      }
    ],
    en: [
      {
        id: 1,
        groupA: { count: 3, emoji: "🍎", name: "apples" },
        groupB: { count: 5, emoji: "🍌", name: "bananas" },
        correctAnswer: "A",
        color: "#EF4444"
      },
      {
        id: 2,
        groupA: { count: 7, emoji: "🐶", name: "dogs" },
        groupB: { count: 4, emoji: "🐱", name: "cats" },
        correctAnswer: "B",
        color: "#10B981"
      },
      {
        id: 3,
        groupA: { count: 2, emoji: "⭐", name: "stars" },
        groupB: { count: 6, emoji: "🌙", name: "moons" },
        correctAnswer: "A",
        color: "#EAB308"
      },
      {
        id: 4,
        groupA: { count: 8, emoji: "🚗", name: "cars" },
        groupB: { count: 3, emoji: "🚌", name: "buses" },
        correctAnswer: "B",
        color: "#3B82F6"
      },
      {
        id: 5,
        groupA: { count: 4, emoji: "🌸", name: "flowers" },
        groupB: { count: 9, emoji: "🌻", name: "sunflowers" },
        correctAnswer: "A",
        color: "#EC4899"
      },
      {
        id: 6,
        groupA: { count: 6, emoji: "🎈", name: "balloons" },
        groupB: { count: 2, emoji: "🎁", name: "gifts" },
        correctAnswer: "B",
        color: "#8B5CF6"
      },
      {
        id: 7,
        groupA: { count: 5, emoji: "🍕", name: "pizzas" },
        groupB: { count: 7, emoji: "🍔", name: "burgers" },
        correctAnswer: "A",
        color: "#F59E0B"
      },
      {
        id: 8,
        groupA: { count: 9, emoji: "⚽", name: "balls" },
        groupB: { count: 4, emoji: "🏀", name: "basketballs" },
        correctAnswer: "B",
        color: "#14B8A6"
      },
      {
        id: 9,
        groupA: { count: 3, emoji: "🦋", name: "butterflies" },
        groupB: { count: 8, emoji: "🐝", name: "bees" },
        correctAnswer: "A",
        color: "#06B6D4"
      },
      {
        id: 10,
        groupA: { count: 7, emoji: "📚", name: "books" },
        groupB: { count: 5, emoji: "✏️", name: "pencils" },
        correctAnswer: "B",
        color: "#A855F7"
      }
    ]
  };

  const comparisons = comparisonsData[lang];
  const round = comparisons[currentRound];

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

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? `Ποια ομάδα έχει λιγότερα;`
        : `Which group has less?`;

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
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Which Is Less Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Which Is Less Game",
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιο είναι Λιγότερο;" : "Which Is Less?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σύγκριση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Comparison ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            🔢 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Ποια ομάδα έχει λιγότερα;" : "Which group has less?"}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Group A */}
          <button
            onClick={() => handleAnswerSelect("A")}
            disabled={showAnswer}
            className={`
              relative p-8 rounded-3xl border-4 transition-all duration-300 transform
              ${showAnswer && selectedAnswer === "A" && round.correctAnswer === "A" ? "bg-green-100 border-green-500 scale-105" : ""}
              ${showAnswer && selectedAnswer === "A" && round.correctAnswer !== "A" ? "bg-red-100 border-red-500 animate-shake" : ""}
              ${!showAnswer ? "bg-white border-slate-300 hover:border-teal-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              ${showAnswer && round.correctAnswer === "A" && selectedAnswer !== "A" ? "border-green-500" : ""}
              ${showAnswer && selectedAnswer !== "A" ? "opacity-70" : ""}
            `}
          >
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl font-bold px-6 py-3 bg-slate-100 rounded-full">
                  {round.groupA.count}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {[...Array(round.groupA.count)].map((_, i) => (
                  <span key={i} className="text-5xl">{round.groupA.emoji}</span>
                ))}
              </div>

              <p className="text-2xl font-bold text-slate-800">{round.groupA.name}</p>

              {showAnswer && round.correctAnswer === "A" && (
                <div className="text-7xl animate-bounce mt-4">
                  ✅
                </div>
              )}
              {showAnswer && selectedAnswer === "A" && round.correctAnswer !== "A" && (
                <div className="text-7xl mt-4">
                  ❌
                </div>
              )}
            </div>
          </button>

          {/* Group B */}
          <button
            onClick={() => handleAnswerSelect("B")}
            disabled={showAnswer}
            className={`
              relative p-8 rounded-3xl border-4 transition-all duration-300 transform
              ${showAnswer && selectedAnswer === "B" && round.correctAnswer === "B" ? "bg-green-100 border-green-500 scale-105" : ""}
              ${showAnswer && selectedAnswer === "B" && round.correctAnswer !== "B" ? "bg-red-100 border-red-500 animate-shake" : ""}
              ${!showAnswer ? "bg-white border-slate-300 hover:border-teal-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              ${showAnswer && round.correctAnswer === "B" && selectedAnswer !== "B" ? "border-green-500" : ""}
              ${showAnswer && selectedAnswer !== "B" ? "opacity-70" : ""}
            `}
          >
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl font-bold px-6 py-3 bg-slate-100 rounded-full">
                  {round.groupB.count}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {[...Array(round.groupB.count)].map((_, i) => (
                  <span key={i} className="text-5xl">{round.groupB.emoji}</span>
                ))}
              </div>

              <p className="text-2xl font-bold text-slate-800">{round.groupB.name}</p>

              {showAnswer && round.correctAnswer === "B" && (
                <div className="text-7xl animate-bounce mt-4">
                  ✅
                </div>
              )}
              {showAnswer && selectedAnswer === "B" && round.correctAnswer !== "B" && (
                <div className="text-7xl mt-4">
                  ❌
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.correctAnswer ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! ${round.correctAnswer === "A" ? round.groupA.count : round.groupB.count} είναι λιγότερα από ${round.correctAnswer === "A" ? round.groupB.count : round.groupA.count}!`
                  : `🎉 Correct! ${round.correctAnswer === "A" ? round.groupA.count : round.groupB.count} is less than ${round.correctAnswer === "A" ? round.groupB.count : round.groupA.count}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `${round.correctAnswer === "A" ? round.groupA.count : round.groupB.count} είναι λιγότερα!`
                  : `${round.correctAnswer === "A" ? round.groupA.count : round.groupB.count} is less!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να συγκρίνεις ποσότητες!" : "Perfect! You know how to compare quantities!"}
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

