// src/components/games/exercises_4_5/MemoryCards.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function MemoryCards({ lang = "el", onComplete }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [canFlip, setCanFlip] = useState(true);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const flipSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_LEVELS = 3; // 3 επίπεδα (ζώα, γράμματα, σχήματα)

  const levelsData = {
    el: [
      {
        id: 1,
        name: "Ζώα",
        emoji: "🐾",
        color: "#F59E0B",
        pairs: [
          { id: 1, content: "🐶", type: "emoji" },
          { id: 2, content: "🐱", type: "emoji" },
          { id: 3, content: "🐭", type: "emoji" },
          { id: 4, content: "🐰", type: "emoji" },
          { id: 5, content: "🦊", type: "emoji" },
          { id: 6, content: "🐻", type: "emoji" },
        ]
      },
      {
        id: 2,
        name: "Γράμματα",
        emoji: "🔤",
        color: "#3B82F6",
        pairs: [
          { id: 1, content: "Α", type: "letter" },
          { id: 2, content: "Β", type: "letter" },
          { id: 3, content: "Γ", type: "letter" },
          { id: 4, content: "Δ", type: "letter" },
          { id: 5, content: "Ε", type: "letter" },
          { id: 6, content: "Ζ", type: "letter" },
        ]
      },
      {
        id: 3,
        name: "Σχήματα",
        emoji: "🔷",
        color: "#10B981",
        pairs: [
          { id: 1, content: "🔴", type: "emoji" },
          { id: 2, content: "🟦", type: "emoji" },
          { id: 3, content: "🟡", type: "emoji" },
          { id: 4, content: "🟢", type: "emoji" },
          { id: 5, content: "🔺", type: "emoji" },
          { id: 6, content: "⭐", type: "emoji" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        name: "Animals",
        emoji: "🐾",
        color: "#F59E0B",
        pairs: [
          { id: 1, content: "🐶", type: "emoji" },
          { id: 2, content: "🐱", type: "emoji" },
          { id: 3, content: "🐭", type: "emoji" },
          { id: 4, content: "🐰", type: "emoji" },
          { id: 5, content: "🦊", type: "emoji" },
          { id: 6, content: "🐻", type: "emoji" },
        ]
      },
      {
        id: 2,
        name: "Letters",
        emoji: "🔤",
        color: "#3B82F6",
        pairs: [
          { id: 1, content: "A", type: "letter" },
          { id: 2, content: "B", type: "letter" },
          { id: 3, content: "C", type: "letter" },
          { id: 4, content: "D", type: "letter" },
          { id: 5, content: "E", type: "letter" },
          { id: 6, content: "F", type: "letter" },
        ]
      },
      {
        id: 3,
        name: "Shapes",
        emoji: "🔷",
        color: "#10B981",
        pairs: [
          { id: 1, content: "🔴", type: "emoji" },
          { id: 2, content: "🟦", type: "emoji" },
          { id: 3, content: "🟡", type: "emoji" },
          { id: 4, content: "🟢", type: "emoji" },
          { id: 5, content: "🔺", type: "emoji" },
          { id: 6, content: "⭐", type: "emoji" },
        ]
      }
    ]
  };

  const levels = levelsData[lang];
  const level = levels[currentLevel];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    flipSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    flipSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    initializeCards();
  }, [currentLevel]);

  const initializeCards = () => {
    // Create pairs and shuffle
    const pairCards = level.pairs.flatMap((pair) => [
      { ...pair, uniqueId: `${pair.id}-1` },
      { ...pair, uniqueId: `${pair.id}-2` },
    ]);

    const shuffled = pairCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setCanFlip(true);
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧠", "🎯"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleCardClick = (clickedCard) => {
    if (!canFlip) return;
    if (flippedCards.find(card => card.uniqueId === clickedCard.uniqueId)) return;
    if (matchedPairs.includes(clickedCard.id)) return;

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);

      // Check if match after a short delay to see both cards
      setTimeout(() => {
        if (newFlipped[0].id === newFlipped[1].id) {
          // Match! Play correct sound
          correctSoundRef.current?.play().catch(() => {});

          const newMatched = [...matchedPairs, newFlipped[0].id];
          setMatchedPairs(newMatched);

          const newScore = score + 1;
          setScore(newScore);

          // Show +1 score popup
          setScorePopup({ id: Date.now(), x: 50 });
          setTimeout(() => setScorePopup(null), 1000);

          // Update progress
          updateProgress({
            title: "Memory Cards",
            score: newScore,
            total: level.pairs.length * TARGET_LEVELS,
            index: currentLevel * level.pairs.length + newMatched.length,
          });

          completeQuiz({
            title: "Memory Cards",
            score: 1,
            total: 1,
          });

          setTimeout(() => {
            setFlippedCards([]);
            setCanFlip(true);

            // Check if level complete
            if (newMatched.length === level.pairs.length) {
              handleLevelComplete();
            }
          }, 1000);
        } else {
          // No match - Play wrong sound
          wrongSoundRef.current?.play().catch(() => {});

          setTimeout(() => {
            setFlippedCards([]);
            setCanFlip(true);
          }, 1000);
        }
      }, 500);
    }
  };

  const handleLevelComplete = () => {
    setTimeout(() => {
      if (currentLevel + 1 < TARGET_LEVELS) {
        setCurrentLevel(prev => prev + 1);
      } else {
        // All levels complete
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      }
    }, 1500);
  };

  const progressPercent = Math.round(((currentLevel + 1) / TARGET_LEVELS) * 100);
  const levelProgress = Math.round((matchedPairs.length / level.pairs.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Celebration Emojis */}
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

      {/* Score Popup */}
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Κάρτες Μνήμης" : "Memory Cards"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentLevel + 1}/${TARGET_LEVELS}: ${level.name}`
                : `Level ${currentLevel + 1}/${TARGET_LEVELS}: ${level.name}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-violet-600">
            🧠 {score}
          </div>
        </div>

        {/* Progress Bar */}
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

      {/* Level Info */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: level.color }}>
          <div className="text-7xl mb-3">{level.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: level.color }}>
            {level.name}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el" ? "Βρες τα ζευγάρια!" : "Find the pairs!"}
          </p>
          <div className="mt-3">
            <div className="inline-block bg-slate-100 rounded-xl px-6 py-2">
              <span className="text-lg font-bold text-slate-700">
                {matchedPairs.length} / {level.pairs.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {cards.map((card) => {
            const isFlipped = flippedCards.find(c => c.uniqueId === card.uniqueId);
            const isMatched = matchedPairs.includes(card.id);

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card)}
                disabled={isFlipped || isMatched || !canFlip}
                className={`
                  relative aspect-square rounded-2xl transition-all duration-300 transform
                  ${isMatched ? "bg-green-100 border-4 border-green-500 scale-95 opacity-50" : ""}
                  ${isFlipped && !isMatched ? "bg-white border-4 border-violet-400" : ""}
                  ${!isFlipped && !isMatched ? "bg-gradient-to-br from-violet-400 to-fuchsia-500 hover:scale-105 cursor-pointer" : ""}
                `}
                style={{ minHeight: "100px" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isFlipped || isMatched ? (
                    <div className={`${card.type === "letter" ? "text-6xl font-bold" : "text-6xl"}`} style={{ color: card.type === "letter" ? level.color : "inherit" }}>
                      {card.content}
                    </div>
                  ) : (
                    <div className="text-5xl">❓</div>
                  )}
                </div>

                {isMatched && (
                  <div className="absolute -top-3 -right-3 text-4xl animate-bounce bg-white rounded-full p-1">
                    ✅
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${levelProgress}%`,
                  backgroundColor: level.color
                }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {levelProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-300/80 to-fuchsia-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια Μνήμη!" : "Perfect Memory!"}
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

