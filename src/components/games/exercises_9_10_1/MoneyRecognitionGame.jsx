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
      { text: "3,50 €", emoji: "💶", color: "from-orange-400 to-amber-500", prompt: "Αγοράζεις σνακ 6,50 € με χαρτονόμισμα 10 €. Πόσα ρέστα παίρνεις;" },
      { text: "4,20 €", emoji: "💶", color: "from-yellow-400 to-orange-400", prompt: "Έχεις 20 €. Αγοράζεις βιβλίο 15,80 €. Πόσα μένουν;" },
      { text: "12,00 €", emoji: "💵", color: "from-amber-400 to-yellow-400", prompt: "Τρία ίδια τετράδια κοστίζουν από 4 € το καθένα. Πόσο πληρώνεις συνολικά;" },
      { text: "7,75 €", emoji: "🪙", color: "from-yellow-300 to-amber-400", prompt: "Δίνεις 20 € για συνολική αξία 12,25 €. Πόσα ρέστα;" },
      { text: "25,00 €", emoji: "💵", color: "from-green-400 to-teal-500", prompt: "Με προϋπολογισμό 50 € ξόδεψες 25 €. Πόσα μένουν για άλλες αγορές;" },
      { text: "0,80 €", emoji: "🪙", color: "from-amber-400 to-orange-500", prompt: "Ένα μολύβι κοστίζει 0,40 €. Δύο μολύβια κοστίζουν;" },
      { text: "18,50 €", emoji: "💶", color: "from-yellow-400 to-amber-500", prompt: "Πληρώνεις με 20 € και σου επιστρέφουν 1,50 €. Πόσο κόστισε η αγορά;" },
      { text: "35,00 €", emoji: "💵", color: "from-green-500 to-teal-600", prompt: "Μοιράζεσαι το κόστος 70 € με έναν φίλο ισόποσα. Πόσο πληρώνει ο καθένας;" },
      { text: "9,99 €", emoji: "💶", color: "from-red-400 to-pink-500", prompt: "Σε προσφορά −5 € από 14,99 €. Τιμή μετά την έκπτωση;" },
      { text: "2,30 €", emoji: "🪙", color: "from-blue-400 to-indigo-500", prompt: "Έχεις κέρματα 2 € + 0,20 € + 0,10 €. Πόσα έχεις συνολικά;" },
    ],
    en: [
      { text: "$3.50", emoji: "💵", color: "from-orange-400 to-amber-500", prompt: "You buy a snack for $6.50 with a $10 bill. How much change?" },
      { text: "$4.20", emoji: "💵", color: "from-yellow-400 to-orange-400", prompt: "You have $20. You buy a book for $15.80. How much is left?" },
      { text: "$12.00", emoji: "💵", color: "from-amber-400 to-yellow-400", prompt: "Three identical notebooks cost $4 each. What is the total?" },
      { text: "$7.75", emoji: "🪙", color: "from-yellow-300 to-amber-400", prompt: "You pay $20 for items totaling $12.25. How much change?" },
      { text: "$25.00", emoji: "💵", color: "from-green-400 to-teal-500", prompt: "With a $50 budget you spend $25. How much remains?" },
      { text: "$0.80", emoji: "🪙", color: "from-amber-400 to-orange-500", prompt: "A pencil costs $0.40. How much are two pencils?" },
      { text: "$18.50", emoji: "💵", color: "from-yellow-400 to-amber-500", prompt: "You pay $20 and get $1.50 back. What did the purchase cost?" },
      { text: "$35.00", emoji: "💵", color: "from-green-500 to-teal-600", prompt: "You split a $70 bill equally with a friend. How much does each pay?" },
      { text: "$9.99", emoji: "💵", color: "from-red-400 to-pink-500", prompt: "A $5 discount on $14.99. What is the sale price?" },
      { text: "$2.30", emoji: "🪙", color: "from-blue-400 to-indigo-500", prompt: "You have coins: $2 + $0.20 + $0.10. What is the total?" },
    ],
  };

  const generateQuestions = () => {
    const money = moneyData[lang];
    return money.map((coin) => {
      const wrongOptions = [];
      let tries = 0;
      while (wrongOptions.length < 3 && tries < 60) {
        tries++;
        const randomItem = money[Math.floor(Math.random() * money.length)];
        if (randomItem.text !== coin.text && !wrongOptions.includes(randomItem.text)) {
          wrongOptions.push(randomItem.text);
        }
      }
      return {
        ...coin,
        options: [coin.text, ...wrongOptions].sort(() => Math.random() - 0.5),
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Χρήμα & Προβλήματα" : "Money Problems"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Πρόβλημα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Problem ${currentRound + 1}/${TARGET_ROUNDS}`}
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

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-yellow-400">
          <div className="text-center mb-8">
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 px-2">
              {currentMoney.prompt}
            </p>
            <div className={`inline-block bg-gradient-to-br ${currentMoney.color} rounded-3xl p-10 border-4 border-yellow-500 shadow-2xl transform hover:scale-105 transition-all`}>
              <div className="text-8xl sm:text-9xl mb-2">{currentMoney.emoji}</div>
            </div>
            <p className="text-lg font-semibold text-slate-600 mt-6">
              {lang === "el" ? "Διάλεξε τη σωστή απάντηση:" : "Choose the correct amount:"}
            </p>
          </div>

          {!showAnswer && (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentMoney.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-5 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 border-4 border-yellow-300 hover:border-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showAnswer && selectedAnswer === currentMoney.text && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${currentMoney.text}`
                    : `🎉 Correct! ${currentMoney.text}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentMoney.text && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Υπόλοιπο, ρέστα ή προϋπολογισμός;`
                    : `Try again! Think about change, totals, or budgets.`}
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
            <h3 className="text-4xl font-bold text-white px-4">
              {lang === "el" ? "Τέλεια! Καταλαβαίνεις χρήμα και προϋπολογισμό!" : "Perfect! You can handle money and budgets!"}
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
