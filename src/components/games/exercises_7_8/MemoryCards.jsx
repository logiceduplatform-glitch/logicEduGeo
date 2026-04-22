// src/components/games/exercises_7_8/MemoryCards.jsx - Upgraded for age 8: 10 pairs
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
  const TARGET_LEVELS = 3;
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
          { id: 7, content: "🦁", type: "emoji" },
          { id: 8, content: "🐯", type: "emoji" },
          { id: 9, content: "🐼", type: "emoji" },
          { id: 10, content: "🐨", type: "emoji" },
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
          { id: 7, content: "Η", type: "letter" },
          { id: 8, content: "Θ", type: "letter" },
          { id: 9, content: "Ι", type: "letter" },
          { id: 10, content: "Κ", type: "letter" },
        ]
      },
      {
        id: 3,
        name: "Μαθηματικά",
        emoji: "🔢",
        color: "#10B981",
        pairs: [
          { id: 1, content: "2+2=4", type: "text" },
          { id: 2, content: "3+3=6", type: "text" },
          { id: 3, content: "4+4=8", type: "text" },
          { id: 4, content: "5+5=10", type: "text" },
          { id: 5, content: "1+9=10", type: "text" },
          { id: 6, content: "7+3=10", type: "text" },
          { id: 7, content: "6+4=10", type: "text" },
          { id: 8, content: "8+2=10", type: "text" },
          { id: 9, content: "10-5=5", type: "text" },
          { id: 10, content: "12-6=6", type: "text" },
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
          { id: 7, content: "🦁", type: "emoji" },
          { id: 8, content: "🐯", type: "emoji" },
          { id: 9, content: "🐼", type: "emoji" },
          { id: 10, content: "🐨", type: "emoji" },
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
          { id: 7, content: "G", type: "letter" },
          { id: 8, content: "H", type: "letter" },
          { id: 9, content: "I", type: "letter" },
          { id: 10, content: "J", type: "letter" },
        ]
      },
      {
        id: 3,
        name: "Math",
        emoji: "🔢",
        color: "#10B981",
        pairs: [
          { id: 1, content: "2+2=4", type: "text" },
          { id: 2, content: "3+3=6", type: "text" },
          { id: 3, content: "4+4=8", type: "text" },
          { id: 4, content: "5+5=10", type: "text" },
          { id: 5, content: "1+9=10", type: "text" },
          { id: 6, content: "7+3=10", type: "text" },
          { id: 7, content: "6+4=10", type: "text" },
          { id: 8, content: "8+2=10", type: "text" },
          { id: 9, content: "10-5=5", type: "text" },
          { id: 10, content: "12-6=6", type: "text" },
        ]
      }
    ]
  };
  const levels = levelsData[lang];
  const currentLevelData = levels[currentLevel];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    flipSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    flipSoundRef.current.preload = "auto";
  }, []);
  useEffect(() => {
    if (currentLevelData) {
      initializeCards();
    }
  }, [currentLevel]);
  const initializeCards = () => {
    const pairs = currentLevelData.pairs;
    const doubled = [...pairs, ...pairs].map((card, index) => ({
      ...card,
      uniqueId: index,
    }));
    const shuffled = doubled.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
  };
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧠", "💫", "🎊", "🏆"][Math.floor(Math.random() * 8)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const showScorePopup = (points) => {
    setScorePopup({ points, id: Date.now() });
    setTimeout(() => setScorePopup(null), 1500);
  };
  const handleCardClick = (card) => {
    if (!canFlip || flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.id)) {
      return;
    }
    flipSoundRef.current?.play().catch(() => {});
    const newFlipped = [...flippedCards, card.uniqueId];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      setCanFlip(false);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.uniqueId === first);
      const secondCard = cards.find(c => c.uniqueId === second);
      if (firstCard.id === secondCard.id) {
        correctSoundRef.current?.play().catch(() => {});
        const newMatched = [...matchedPairs, firstCard.id];
        setMatchedPairs(newMatched);
        const newScore = score + 1;
        setScore(newScore);
        showScorePopup(1);
        createCelebrationEmojis();
        const progress = ((currentLevel * 10 + newMatched.length) / (TARGET_LEVELS * 10)) * 100;
        updateProgress(progress);
        setFlippedCards([]);
        setCanFlip(true);
        if (newMatched.length === currentLevelData.pairs.length) {
          setTimeout(() => {
            if (currentLevel + 1 < TARGET_LEVELS) {
              setCurrentLevel(currentLevel + 1);
            } else {
              setShowCelebration(true);
              setTimeout(() => {
                completeQuiz({
                  title: lang === "el" ? "Μνήμη" : "Memory",
                  score: newScore,
                  total: TARGET_LEVELS * 10,
                });
                onComplete?.();
              }, 2000);
            }
          }, 1500);
        }
      } else {
        wrongSoundRef.current?.play().catch(() => {});
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6 relative overflow-hidden">
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-bounce pointer-events-none z-10"
          style={{
            left: `${emoji.x}%`,
            top: "10%",
            animationDelay: `${emoji.delay}s`,
            animationDuration: "1s",
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-8 py-4 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-500 flex items-center gap-2">
            <span>⭐</span>
            <span>+{scorePopup.points}</span>
            <span>⭐</span>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">🧠</span>
              {lang === "el" ? "Μνήμη" : "Memory"} - {currentLevelData?.name}
            </h2>
            <div className="text-2xl font-bold text-purple-600">
              {matchedPairs.length} / {currentLevelData?.pairs.length}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
            <div className="text-sm text-purple-700 font-semibold mb-1">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ 
                  width: `${((currentLevel * 10 + matchedPairs.length) / (TARGET_LEVELS * 10)) * 100}%` 
                }}
              />
            </div>
            <div className="text-right text-purple-700 font-bold mt-1">
              {lang === "el" ? "Επίπεδο" : "Level"} {currentLevel + 1} / {TARGET_LEVELS}
            </div>
          </div>
        </div>
        {!showCelebration ? (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
            <div className="grid grid-cols-5 gap-4">
              {cards.map((card) => (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card)}
                  disabled={!canFlip || matchedPairs.includes(card.id)}
                  className={`aspect-square rounded-2xl text-3xl font-bold transition-all transform hover:scale-105 ${
                    flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.id)
                      ? "bg-white border-4 border-purple-400"
                      : "bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl"
                  } ${matchedPairs.includes(card.id) ? "opacity-50" : ""}`}
                  style={{ backgroundColor: matchedPairs.includes(card.id) ? "#22c55e" : undefined }}
                >
                  {flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.id) ? (
                    card.type === "text" ? (
                      <span className="text-lg">{card.content}</span>
                    ) : (
                      card.content
                    )
                  ) : (
                    "?"
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-2xl p-12 text-center text-white animate-bounce">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-5xl font-bold mb-4">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-3xl mb-4">
              {lang === "el" ? `Βαθμολογία: ${score}/${TARGET_LEVELS * 10}` : `Score: ${score}/${TARGET_LEVELS * 10}`}
            </p>
            <p className="text-2xl">
              {lang === "el" ? "Έχεις εξαιρετική μνήμη!" : "You have an amazing memory!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
