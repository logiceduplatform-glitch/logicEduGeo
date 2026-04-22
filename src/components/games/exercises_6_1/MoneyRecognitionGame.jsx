// src/components/games/exercises_6_1/MoneyRecognitionGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function MoneyRecognitionGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 10;

  const moneyData = {
    el: [
      { value: 5, text: "5 λεπτά", emoji: "🪙", color: "from-orange-400 to-amber-500" },
      { value: 10, text: "10 λεπτά", emoji: "🪙", color: "from-yellow-400 to-orange-400" },
      { value: 20, text: "20 λεπτά", emoji: "🪙", color: "from-amber-400 to-yellow-400" },
      { value: 50, text: "50 λεπτά", emoji: "🪙", color: "from-yellow-300 to-amber-400" },
      { value: 100, text: "1 ευρώ", emoji: "💰", color: "from-amber-400 to-orange-500" },
      { value: 200, text: "2 ευρώ", emoji: "💰", color: "from-yellow-400 to-amber-500" },
      { value: 500, text: "5 ευρώ", emoji: "💵", color: "from-green-400 to-teal-500" },
      { value: 1000, text: "10 ευρώ", emoji: "💵", color: "from-red-400 to-pink-500" },
      { value: 2000, text: "20 ευρώ", emoji: "💵", color: "from-blue-400 to-indigo-500" },
      { value: 5000, text: "50 ευρώ", emoji: "💵", color: "from-orange-400 to-red-500" }
    ],
    en: [
      { value: 5, text: "5 cents", emoji: "🪙", color: "from-orange-400 to-amber-500" },
      { value: 10, text: "10 cents", emoji: "🪙", color: "from-yellow-400 to-orange-400" },
      { value: 25, text: "25 cents", emoji: "🪙", color: "from-amber-400 to-yellow-400" },
      { value: 50, text: "50 cents", emoji: "🪙", color: "from-yellow-300 to-amber-400" },
      { value: 100, text: "1 dollar", emoji: "💵", color: "from-green-400 to-teal-500" },
      { value: 200, text: "2 dollars", emoji: "💵", color: "from-green-500 to-teal-600" },
      { value: 500, text: "5 dollars", emoji: "💵", color: "from-green-400 to-emerald-500" },
      { value: 1000, text: "10 dollars", emoji: "💵", color: "from-green-500 to-teal-500" },
      { value: 2000, text: "20 dollars", emoji: "💵", color: "from-emerald-400 to-green-600" },
      { value: 5000, text: "50 dollars", emoji: "💵", color: "from-teal-400 to-emerald-500" }
    ]
  };

  const generateQuestions = () => {
    const money = moneyData[lang];
    return money.map((coin, idx) => {
      const wrongOptions = [];
      while (wrongOptions.length < 3) {
        const randomCoin = money[Math.floor(Math.random() * money.length)];
        if (randomCoin.text !== coin.text && !wrongOptions.includes(randomCoin.text)) {
          wrongOptions.push(randomCoin.text);
        }
      }
      return {
        ...coin,
        options: [coin.text, ...wrongOptions].sort(() => Math.random() - 0.5)
      };
    });
  };

  const [questions] = useState(generateQuestions());
  const currentMoney = questions[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "💰", "💵", "🪙", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentMoney.text;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Money Recognition",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Money Recognition",
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
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Αναγνώριση Νομισμάτων" : "Money Recognition"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Νόμισμα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Money ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            💰 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-yellow-400">
          {/* Money Display */}
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-slate-700 mb-6">
              {lang === "el" ? "Πόσο αξίζει;" : "How much is it worth?"}
            </p>
            <div className={`inline-block bg-gradient-to-br ${currentMoney.color} rounded-3xl p-12 border-4 border-yellow-500 shadow-2xl transform hover:scale-105 transition-all`}>
              <div className="text-9xl mb-4">{currentMoney.emoji}</div>
              <div className="text-5xl font-bold text-white drop-shadow-lg">
                {currentMoney.value >= 100 && currentMoney.value < 500 ? "💰" : ""}
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentMoney.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 border-4 border-yellow-300 hover:border-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-2xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === currentMoney.text && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! Αξίζει ${currentMoney.text}`
                    : `🎉 Correct! It's worth ${currentMoney.text}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentMoney.text && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου την αξία!`
                    : `Try again! Think about the value!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-amber-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">💰🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις τα χρήματα!" : "Perfect! You know your money!"}
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

