// src/components/games/SortBySizeGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function SortBySizeGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [items, setItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
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

  const TARGET_ROUNDS = 10; // 10 ταξινομήσεις

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Ταξινόμησε τα μήλα από μικρότερο σε μεγαλύτερο",
        emoji: "🍎",
        color: "#EF4444",
        correctOrder: [1, 2, 3], // small, medium, large
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 2,
        question: "Ταξινόμησε τα αστέρια από μικρότερο σε μεγαλύτερο",
        emoji: "⭐",
        color: "#EAB308",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 3,
        question: "Ταξινόμησε τις μπάλες από μικρότερη σε μεγαλύτερη",
        emoji: "⚽",
        color: "#10B981",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρή" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαία" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλη" }
        ]
      },
      {
        id: 4,
        question: "Ταξινόμησε τα δέντρα από μικρότερο σε μεγαλύτερο",
        emoji: "🌲",
        color: "#22C55E",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 5,
        question: "Ταξινόμησε τις καρδιές από μικρότερη σε μεγαλύτερη",
        emoji: "❤️",
        color: "#EC4899",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρή" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαία" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλη" }
        ]
      },
      {
        id: 6,
        question: "Ταξινόμησε τα αυτοκίνητα από μικρότερο σε μεγαλύτερο",
        emoji: "🚗",
        color: "#3B82F6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 7,
        question: "Ταξινόμησε τα σπίτια από μικρότερο σε μεγαλύτερο",
        emoji: "🏠",
        color: "#F59E0B",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 8,
        question: "Ταξινόμησε τα λουλούδια από μικρότερο σε μεγαλύτερο",
        emoji: "🌸",
        color: "#A855F7",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 9,
        question: "Ταξινόμησε τα μπαλόνια από μικρότερο σε μεγαλύτερο",
        emoji: "🎈",
        color: "#06B6D4",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      },
      {
        id: 10,
        question: "Ταξινόμησε τα βιβλία από μικρότερο σε μεγαλύτερο",
        emoji: "📚",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Μικρό" },
          { id: 2, size: "medium", scale: 0.85, name: "Μεσαίο" },
          { id: 3, size: "large", scale: 1.1, name: "Μεγάλο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        question: "Sort the apples from smallest to largest",
        emoji: "🍎",
        color: "#EF4444",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 2,
        question: "Sort the stars from smallest to largest",
        emoji: "⭐",
        color: "#EAB308",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 3,
        question: "Sort the balls from smallest to largest",
        emoji: "⚽",
        color: "#10B981",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 4,
        question: "Sort the trees from smallest to largest",
        emoji: "🌲",
        color: "#22C55E",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 5,
        question: "Sort the hearts from smallest to largest",
        emoji: "❤️",
        color: "#EC4899",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 6,
        question: "Sort the cars from smallest to largest",
        emoji: "🚗",
        color: "#3B82F6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 7,
        question: "Sort the houses from smallest to largest",
        emoji: "🏠",
        color: "#F59E0B",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 8,
        question: "Sort the flowers from smallest to largest",
        emoji: "🌸",
        color: "#A855F7",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 9,
        question: "Sort the balloons from smallest to largest",
        emoji: "🎈",
        color: "#06B6D4",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
        ]
      },
      {
        id: 10,
        question: "Sort the books from smallest to largest",
        emoji: "📚",
        color: "#8B5CF6",
        correctOrder: [1, 2, 3],
        items: [
          { id: 1, size: "small", scale: 0.6, name: "Small" },
          { id: 2, size: "medium", scale: 0.85, name: "Medium" },
          { id: 3, size: "large", scale: 1.1, name: "Large" }
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
    // Shuffle items when round changes
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "📏", "✅"][Math.floor(Math.random() * 6)],
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

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleCheckAnswer = () => {
    const currentOrder = items.map(item => item.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(round.correctOrder);

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Sort By Size Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Sort By Size Game",
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
              onComplete();
            }
          }, 2500);
        }
      }, 2500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const isCorrectOrder = JSON.stringify(items.map(item => item.id)) === JSON.stringify(round.correctOrder);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ταξινόμηση Μεγέθους" : "Sort by Size"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ταξινόμηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Sorting ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            📏 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-4">📏</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-lg text-slate-600">
            {lang === "el" ? "Σύρε τα αντικείμενα για να τα ταξινομήσεις" : "Drag the objects to sort them"}
          </p>
        </div>
      </div>

      {/* Sorting Area */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="flex justify-center items-end gap-8 min-h-[300px]">
            {items.map((item) => (
              <div
                key={item.id}
                draggable={!showAnswer}
                onDragStart={() => handleDragStart(item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragEnd={handleDragEnd}
                className={`
                  flex flex-col items-center transition-all duration-300
                  ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed'}
                  ${draggedItem?.id === item.id ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <div
                  className="text-9xl mb-2 transition-transform duration-300"
                  style={{
                    transform: `scale(${item.scale})`,
                    color: round.color
                  }}
                >
                  {round.emoji}
                </div>
                <p className="text-lg font-bold text-slate-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Check Button */}
      {!showAnswer && (
        <div className="text-center mb-8">
          <button
            onClick={handleCheckAnswer}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            ✓ {lang === "el" ? "Έλεγχος" : "Check"}
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {isCorrectOrder ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? "🎉 Σωστά! Ταξινόμησες σωστά από μικρό σε μεγάλο!"
                  : "🎉 Correct! You sorted from smallest to largest!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? "Προσπάθησε ξανά! Βάλε τα από μικρό σε μεγάλο."
                  : "Try again! Put them from smallest to largest."}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📏🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να ταξινομείς από μικρό σε μεγάλο!" : "Perfect! You know how to sort from smallest to largest!"}
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

