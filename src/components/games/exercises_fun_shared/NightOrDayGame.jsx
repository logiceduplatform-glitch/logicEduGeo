// src/components/games/NightOrDayGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function NightOrDayGame({ lang = "el", difficulty = 3, onComplete }) {
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
        scene: { emoji: "☀️🌤️", description: "Ο ήλιος λάμπει στον ουρανό" },
        correctAnswer: "day",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 2,
        scene: { emoji: "🌙⭐", description: "Βλέπουμε το φεγγάρι και τα αστέρια" },
        correctAnswer: "night",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 3,
        scene: { emoji: "🐦🌅", description: "Τα πουλιά τραγουδάνε και ο ήλιος ανατέλλει" },
        correctAnswer: "day",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 4,
        scene: { emoji: "🦉🌚", description: "Η κουκουβάγια είναι ξύπνια και είναι σκοτάδι" },
        correctAnswer: "night",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 5,
        scene: { emoji: "👦🏫", description: "Τα παιδιά πηγαίνουν στο σχολείο" },
        correctAnswer: "day",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 6,
        scene: { emoji: "😴🛏️", description: "Όλοι κοιμούνται στο κρεβάτι" },
        correctAnswer: "night",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 7,
        scene: { emoji: "🌻🦋", description: "Τα λουλούδια είναι ανοιχτά και οι πεταλούδες πετούν" },
        correctAnswer: "day",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 8,
        scene: { emoji: "🦇🌃", description: "Οι νυχτερίδες πετούν στον σκοτεινό ουρανό" },
        correctAnswer: "night",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 9,
        scene: { emoji: "☀️🌳", description: "Παίζουμε έξω στο πάρκο με φως" },
        correctAnswer: "day",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      },
      {
        id: 10,
        scene: { emoji: "🌌✨", description: "Βλέπουμε τον έναστρο ουρανό" },
        correctAnswer: "night",
        question: "Είναι νύχτα ή μέρα;",
        options: [
          { id: "day", emoji: "☀️", label: "Μέρα" },
          { id: "night", emoji: "🌙", label: "Νύχτα" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scene: { emoji: "☀️🌤️", description: "The sun is shining in the sky" },
        correctAnswer: "day",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 2,
        scene: { emoji: "🌙⭐", description: "We see the moon and stars" },
        correctAnswer: "night",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 3,
        scene: { emoji: "🐦🌅", description: "Birds are singing and the sun is rising" },
        correctAnswer: "day",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 4,
        scene: { emoji: "🦉🌚", description: "The owl is awake and it's dark" },
        correctAnswer: "night",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 5,
        scene: { emoji: "👦🏫", description: "Children are going to school" },
        correctAnswer: "day",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 6,
        scene: { emoji: "😴🛏️", description: "Everyone is sleeping in bed" },
        correctAnswer: "night",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 7,
        scene: { emoji: "🌻🦋", description: "Flowers are open and butterflies are flying" },
        correctAnswer: "day",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 8,
        scene: { emoji: "🦇🌃", description: "Bats are flying in the dark sky" },
        correctAnswer: "night",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 9,
        scene: { emoji: "☀️🌳", description: "We're playing outside in the park with light" },
        correctAnswer: "day",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
        ]
      },
      {
        id: 10,
        scene: { emoji: "🌌✨", description: "We see the starry sky" },
        correctAnswer: "night",
        question: "Is it night or day?",
        options: [
          { id: "day", emoji: "☀️", label: "Day" },
          { id: "night", emoji: "🌙", label: "Night" }
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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "☀️", "🌙"][Math.floor(Math.random() * 7)],
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
        title: "Night Or Day Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Night Or Day Game",
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Νύχτα ή Μέρα;" : "Night or Day?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            🌓 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-3">🌓</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-indigo-400">
          {/* Scene Display */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-10 border-4 border-indigo-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Scene Emoji */}
              <div className="text-9xl animate-pulse">
                {round.scene.emoji}
              </div>

              {/* Scene Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-indigo-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scene.description}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="flex justify-center gap-6 max-w-2xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="flex-1 p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 border-4 border-indigo-300 hover:border-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer"
                    >
                      <div className="text-9xl mb-4">{option.emoji}</div>
                      <p className="text-2xl font-bold text-slate-700 text-center">
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
                  <div className="text-9xl">{correctOption.emoji}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Σωστά! Είναι ${correctOption.label}!`
                    : `🎉 Correct! It's ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Κοίταξε τη σκηνή!`
                    : `Try again! Look at the scene!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌓🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις πότε είναι μέρα και νύχτα!" : "Perfect! You know when it's day and night!"}
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

