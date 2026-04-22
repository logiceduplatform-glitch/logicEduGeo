// src/components/games/SortBySeasonsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SortBySeasonsGame({ lang = "el", onComplete, difficulty = 3 }) {
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
        item: { emoji: "🧥", name: "Μπουφάν" },
        correctSeason: "winter",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 2,
        item: { emoji: "🩳", name: "Σορτς" },
        correctSeason: "summer",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 3,
        item: { emoji: "🧤", name: "Γάντια" },
        correctSeason: "winter",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 4,
        item: { emoji: "👙", name: "Μαγιό" },
        correctSeason: "summer",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 5,
        item: { emoji: "🧣", name: "Κασκόλ" },
        correctSeason: "winter",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 6,
        item: { emoji: "🕶️", name: "Γυαλιά ηλίου" },
        correctSeason: "summer",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 7,
        item: { emoji: "🎿", name: "Πέδιλα του σκι" },
        correctSeason: "winter",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 8,
        item: { emoji: "🏖️", name: "Ομπρέλα παραλίας" },
        correctSeason: "summer",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 9,
        item: { emoji: "☃️", name: "Χιονάνθρωπος" },
        correctSeason: "winter",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      },
      {
        id: 10,
        item: { emoji: "🍦", name: "Παγωτό" },
        correctSeason: "summer",
        question: "Σε ποια εποχή ανήκει;",
        options: [
          { id: "winter", emoji: "❄️", label: "Χειμώνας" },
          { id: "summer", emoji: "☀️", label: "Καλοκαίρι" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        item: { emoji: "🧥", name: "Jacket" },
        correctSeason: "winter",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 2,
        item: { emoji: "🩳", name: "Shorts" },
        correctSeason: "summer",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 3,
        item: { emoji: "🧤", name: "Gloves" },
        correctSeason: "winter",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 4,
        item: { emoji: "👙", name: "Swimsuit" },
        correctSeason: "summer",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 5,
        item: { emoji: "🧣", name: "Scarf" },
        correctSeason: "winter",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 6,
        item: { emoji: "🕶️", name: "Sunglasses" },
        correctSeason: "summer",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 7,
        item: { emoji: "🎿", name: "Skis" },
        correctSeason: "winter",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 8,
        item: { emoji: "🏖️", name: "Beach umbrella" },
        correctSeason: "summer",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 9,
        item: { emoji: "☃️", name: "Snowman" },
        correctSeason: "winter",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
        ]
      },
      {
        id: 10,
        item: { emoji: "🍦", name: "Ice cream" },
        correctSeason: "summer",
        question: "Which season does it belong to?",
        options: [
          { id: "winter", emoji: "❄️", label: "Winter" },
          { id: "summer", emoji: "☀️", label: "Summer" }
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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "❄️", "☀️"][Math.floor(Math.random() * 7)],
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

    const isCorrect = answerId === round.correctSeason;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Sort By Seasons Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Sort By Seasons Game",
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
  const correctOption = round.options.find(opt => opt.id === round.correctSeason);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ταξινόμησε σε Εποχές" : "Sort by Seasons"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🌈 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-blue-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">🌈</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          {/* Item Display */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-10 border-4 border-orange-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Item */}
              <div className="text-9xl animate-bounce">
                {round.item.emoji}
              </div>

              {/* Item Name */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-orange-300">
                <p className="text-3xl font-bold text-center text-slate-800">
                  {round.item.name}
                </p>
              </div>
            </div>
          </div>

          {/* Season Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="flex justify-center gap-8 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  const isWinter = option.id === "winter";
                  const bgColor = isWinter
                    ? "from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-blue-300 hover:border-blue-500"
                    : "from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 border-orange-300 hover:border-orange-500";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className={`flex-1 p-10 rounded-3xl bg-gradient-to-br ${bgColor} border-4 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer`}
                    >
                      <div className="text-9xl mb-4">{option.emoji}</div>
                      <p className="text-3xl font-bold text-slate-700 text-center">
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctSeason && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{round.item.emoji}</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                  <div className="text-6xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Σωστά! Το ${round.item.name} ανήκει στον ${correctOption.label}!`
                    : `🎉 Correct! The ${round.item.name} belongs to ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctSeason && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου την εποχή!`
                    : `Try again! Think about the season!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌈🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις τις εποχές!" : "Perfect! You know the seasons!"}
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

