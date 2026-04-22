// src/components/games/FindOddOneOutGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FindOddOneOutGame({ lang = "el", onComplete, difficulty = 3 }) {
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

  const TARGET_ROUNDS = 10; // 10 κατηγορίες

  const categoriesData = {
    el: [
      {
        id: 1,
        category: "Φρούτα",
        correct: "καρότο",
        color: "#EF4444",
        options: [
          { id: "apple", word: "μήλο", emoji: "🍎", isFruit: true },
          { id: "banana", word: "μπανάνα", emoji: "🍌", isFruit: true },
          { id: "carrot", word: "καρότο", emoji: "🥕", isFruit: false },
          { id: "orange", word: "πορτοκάλι", emoji: "🍊", isFruit: true },
        ]
      },
      {
        id: 2,
        category: "Ζώα",
        correct: "αυτοκίνητο",
        color: "#10B981",
        options: [
          { id: "dog", word: "σκύλος", emoji: "🐶", isAnimal: true },
          { id: "cat", word: "γάτα", emoji: "🐱", isAnimal: true },
          { id: "car", word: "αυτοκίνητο", emoji: "🚗", isAnimal: false },
          { id: "bird", word: "πουλί", emoji: "🐦", isAnimal: true },
        ]
      },
      {
        id: 3,
        category: "Ρούχα",
        correct: "τσάντα",
        color: "#8B5CF6",
        options: [
          { id: "shirt", word: "μπλούζα", emoji: "👕", isClothes: true },
          { id: "pants", word: "παντελόνι", emoji: "👖", isClothes: true },
          { id: "bag", word: "τσάντα", emoji: "👜", isClothes: false },
          { id: "shoes", word: "παπούτσια", emoji: "👟", isClothes: true },
        ]
      },
      {
        id: 4,
        category: "Οχήματα",
        correct: "σπίτι",
        color: "#3B82F6",
        options: [
          { id: "car", word: "αυτοκίνητο", emoji: "🚗", isVehicle: true },
          { id: "bus", word: "λεωφορείο", emoji: "🚌", isVehicle: true },
          { id: "house", word: "σπίτι", emoji: "🏠", isVehicle: false },
          { id: "plane", word: "αεροπλάνο", emoji: "✈️", isVehicle: true },
        ]
      },
      {
        id: 5,
        category: "Έπιπλα",
        correct: "μήλο",
        color: "#F59E0B",
        options: [
          { id: "chair", word: "καρέκλα", emoji: "🪑", isFurniture: true },
          { id: "table", word: "τραπέζι", emoji: "🪑", isFurniture: true },
          { id: "apple", word: "μήλο", emoji: "🍎", isFurniture: false },
          { id: "bed", word: "κρεβάτι", emoji: "🛏️", isFurniture: true },
        ]
      },
      {
        id: 6,
        category: "Χρώματα",
        correct: "σκύλος",
        color: "#EC4899",
        options: [
          { id: "red", word: "κόκκινο", emoji: "🔴", isColor: true },
          { id: "blue", word: "μπλε", emoji: "🔵", isColor: true },
          { id: "dog", word: "σκύλος", emoji: "🐶", isColor: false },
          { id: "green", word: "πράσινο", emoji: "🟢", isColor: true },
        ]
      },
      {
        id: 7,
        category: "Φαγητά",
        correct: "καπέλο",
        color: "#14B8A6",
        options: [
          { id: "pizza", word: "πίτσα", emoji: "🍕", isFood: true },
          { id: "bread", word: "ψωμί", emoji: "🍞", isFood: true },
          { id: "hat", word: "καπέλο", emoji: "🎩", isFood: false },
          { id: "burger", word: "μπέργκερ", emoji: "🍔", isFood: true },
        ]
      },
      {
        id: 8,
        category: "Μέρη του Σώματος",
        correct: "δέντρο",
        color: "#A855F7",
        options: [
          { id: "hand", word: "χέρι", emoji: "🖐️", isBodyPart: true },
          { id: "foot", word: "πόδι", emoji: "🦶", isBodyPart: true },
          { id: "tree", word: "δέντρο", emoji: "🌳", isBodyPart: false },
          { id: "head", word: "κεφάλι", emoji: "👤", isBodyPart: true },
        ]
      },
      {
        id: 9,
        category: "Παιχνίδια",
        correct: "βιβλίο",
        color: "#EAB308",
        options: [
          { id: "ball", word: "μπάλα", emoji: "⚽", isToy: true },
          { id: "teddy", word: "αρκούδα", emoji: "🧸", isToy: true },
          { id: "book", word: "βιβλίο", emoji: "📚", isToy: false },
          { id: "blocks", word: "τουβλάκια", emoji: "🧱", isToy: true },
        ]
      },
      {
        id: 10,
        category: "Εργαλεία",
        correct: "γάτα",
        color: "#F97316",
        options: [
          { id: "hammer", word: "σφυρί", emoji: "🔨", isTool: true },
          { id: "wrench", word: "κλειδί", emoji: "🔧", isTool: true },
          { id: "cat", word: "γάτα", emoji: "🐱", isTool: false },
          { id: "saw", word: "πριόνι", emoji: "🪚", isTool: true },
        ]
      }
    ],
    en: [
      {
        id: 1,
        category: "Fruits",
        correct: "carrot",
        color: "#EF4444",
        options: [
          { id: "apple", word: "apple", emoji: "🍎", isFruit: true },
          { id: "banana", word: "banana", emoji: "🍌", isFruit: true },
          { id: "carrot", word: "carrot", emoji: "🥕", isFruit: false },
          { id: "orange", word: "orange", emoji: "🍊", isFruit: true },
        ]
      },
      {
        id: 2,
        category: "Animals",
        correct: "car",
        color: "#10B981",
        options: [
          { id: "dog", word: "dog", emoji: "🐶", isAnimal: true },
          { id: "cat", word: "cat", emoji: "🐱", isAnimal: true },
          { id: "car", word: "car", emoji: "🚗", isAnimal: false },
          { id: "bird", word: "bird", emoji: "🐦", isAnimal: true },
        ]
      },
      {
        id: 3,
        category: "Clothes",
        correct: "bag",
        color: "#8B5CF6",
        options: [
          { id: "shirt", word: "shirt", emoji: "👕", isClothes: true },
          { id: "pants", word: "pants", emoji: "👖", isClothes: true },
          { id: "bag", word: "bag", emoji: "👜", isClothes: false },
          { id: "shoes", word: "shoes", emoji: "👟", isClothes: true },
        ]
      },
      {
        id: 4,
        category: "Vehicles",
        correct: "house",
        color: "#3B82F6",
        options: [
          { id: "car", word: "car", emoji: "🚗", isVehicle: true },
          { id: "bus", word: "bus", emoji: "🚌", isVehicle: true },
          { id: "house", word: "house", emoji: "🏠", isVehicle: false },
          { id: "plane", word: "plane", emoji: "✈️", isVehicle: true },
        ]
      },
      {
        id: 5,
        category: "Furniture",
        correct: "apple",
        color: "#F59E0B",
        options: [
          { id: "chair", word: "chair", emoji: "🪑", isFurniture: true },
          { id: "table", word: "table", emoji: "🪑", isFurniture: true },
          { id: "apple", word: "apple", emoji: "🍎", isFurniture: false },
          { id: "bed", word: "bed", emoji: "🛏️", isFurniture: true },
        ]
      },
      {
        id: 6,
        category: "Colors",
        correct: "dog",
        color: "#EC4899",
        options: [
          { id: "red", word: "red", emoji: "🔴", isColor: true },
          { id: "blue", word: "blue", emoji: "🔵", isColor: true },
          { id: "dog", word: "dog", emoji: "🐶", isColor: false },
          { id: "green", word: "green", emoji: "🟢", isColor: true },
        ]
      },
      {
        id: 7,
        category: "Foods",
        correct: "hat",
        color: "#14B8A6",
        options: [
          { id: "pizza", word: "pizza", emoji: "🍕", isFood: true },
          { id: "bread", word: "bread", emoji: "🍞", isFood: true },
          { id: "hat", word: "hat", emoji: "🎩", isFood: false },
          { id: "burger", word: "burger", emoji: "🍔", isFood: true },
        ]
      },
      {
        id: 8,
        category: "Body Parts",
        correct: "tree",
        color: "#A855F7",
        options: [
          { id: "hand", word: "hand", emoji: "🖐️", isBodyPart: true },
          { id: "foot", word: "foot", emoji: "🦶", isBodyPart: true },
          { id: "tree", word: "tree", emoji: "🌳", isBodyPart: false },
          { id: "head", word: "head", emoji: "👤", isBodyPart: true },
        ]
      },
      {
        id: 9,
        category: "Toys",
        correct: "book",
        color: "#EAB308",
        options: [
          { id: "ball", word: "ball", emoji: "⚽", isToy: true },
          { id: "teddy", word: "teddy bear", emoji: "🧸", isToy: true },
          { id: "book", word: "book", emoji: "📚", isToy: false },
          { id: "blocks", word: "blocks", emoji: "🧱", isToy: true },
        ]
      },
      {
        id: 10,
        category: "Tools",
        correct: "cat",
        color: "#F97316",
        options: [
          { id: "hammer", word: "hammer", emoji: "🔨", isTool: true },
          { id: "wrench", word: "wrench", emoji: "🔧", isTool: true },
          { id: "cat", word: "cat", emoji: "🐱", isTool: false },
          { id: "saw", word: "saw", emoji: "🪚", isTool: true },
        ]
      }
    ]
  };

  const categories = categoriesData[lang];
  const round = categories[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎯"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakCategory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? `Κατηγορία: ${round.category}. Ποιο δεν ταιριάζει;`
        : `Category: ${round.category}. Which one doesn't belong?`;

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
    // Speak category automatically when round changes
    const timer = setTimeout(() => {
      speakCategory();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Find Odd One Out Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Find Odd One Out Game",
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες το Διαφορετικό" : "Find the Odd One Out"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Κατηγορία ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Category ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500 ease-out"
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
          <div className="text-9xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Κατηγορία:" : "Category:"}
          </h2>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl mb-4">
            <p className="text-5xl font-bold text-slate-800" style={{ color: round.color }}>
              {round.category}
            </p>
          </div>

          <button
            onClick={speakCategory}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Ποιο δεν ταιριάζει;" : "Which one doesn't belong?"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.word;
            const isCorrect = showAnswer && option.word === round.correct;
            const isWrong = showAnswer && isSelected && option.word !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.word)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.word !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl mb-3">{option.emoji}</div>
                  <p className="text-xl font-bold text-slate-800">{option.word}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce mt-3">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl mt-3">
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
          {selectedAnswer === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Σωστά! "${round.correct}" δεν είναι ${round.category}!`
                  : `🎉 Correct! "${round.correct}" is not a ${round.category}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Το σωστό ήταν: ${round.correct}`
                  : `The correct one was: ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-amber-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Βρήκες όλα τα διαφορετικά!" : "Perfect! You found all the odd ones out!"}
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

