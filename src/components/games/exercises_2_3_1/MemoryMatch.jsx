// src/components/games/MemoryMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function MemoryMatch({ lang = "el", difficulty = 3, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const allEmojis = [
    { id: 1, emoji: "🐶", name: { el: "Σκύλος", en: "Dog" } },
    { id: 2, emoji: "🐱", name: { el: "Γάτα", en: "Cat" } },
    { id: 3, emoji: "🐻", name: { el: "Αρκούδα", en: "Bear" } },
    { id: 4, emoji: "🦁", name: { el: "Λιοντάρι", en: "Lion" } },
    { id: 5, emoji: "🐸", name: { el: "Βάτραχος", en: "Frog" } },
    { id: 6, emoji: "🦋", name: { el: "Πεταλούδα", en: "Butterfly" } },
    { id: 7, emoji: "🐢", name: { el: "Χελώνα", en: "Turtle" } },
    { id: 8, emoji: "🦊", name: { el: "Αλεπού", en: "Fox" } },
    { id: 9, emoji: "🐰", name: { el: "Κουνέλι", en: "Rabbit" } },
    { id: 10, emoji: "🦄", name: { el: "Μονόκερος", en: "Unicorn" } },
  ];

  const d = Math.max(1, Math.min(5, difficulty));
  const pairCount = [4, 5, 6, 8, 10][d - 1];
  const emojis = allEmojis.slice(0, pairCount);
  const TOTAL_PAIRS = emojis.length;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    initializeGame();
  }, []);

  useEffect(() => {
    if (matchedCards.length === TOTAL_PAIRS * 2 && matchedCards.length > 0 && !showCelebration) {
      correctSoundRef.current?.play().catch(() => {});

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Memory Match",
        score: TOTAL_PAIRS,
        total: TOTAL_PAIRS,
        index: TOTAL_PAIRS,
      });

      // Cup of Month
      completeQuiz({
        title: "Memory Match",
        score: TOTAL_PAIRS,
        total: TOTAL_PAIRS,
      });

      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete({ score: TOTAL_PAIRS, total: TOTAL_PAIRS });
        }
      }, 2500);
    }
  }, [matchedCards.length, showCelebration, onComplete]);

  const initializeGame = () => {
    // Δημιουργία ζευγαριών καρτών
    const cardPairs = emojis.flatMap((emoji) => [
      { ...emoji, uniqueId: `${emoji.id}-a` },
      { ...emoji, uniqueId: `${emoji.id}-b` },
    ]);

    // Ανακάτεμα
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
  };

  const handleCardClick = (uniqueId) => {
    // Αν ελέγχουμε ταίριασμα, μην επιτρέπεις κλικ
    if (isChecking) return;

    // Αν η κάρτα είναι ήδη γυρισμένη ή ταιριασμένη
    if (flippedCards.includes(uniqueId) || matchedCards.includes(uniqueId)) return;

    // Αν έχουμε ήδη 2 γυρισμένες κάρτες
    if (flippedCards.length === 2) return;

    const newFlipped = [...flippedCards, uniqueId];
    setFlippedCards(newFlipped);

    // Αν γυρίσαμε 2 κάρτες
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.uniqueId === firstId);
      const secondCard = cards.find((c) => c.uniqueId === secondId);

      // Έλεγχος αν ταιριάζουν
      if (firstCard.id === secondCard.id) {
        // Ταιριάζουν! 🎉
        correctSoundRef.current?.play().catch(() => {});

        const newScore = score + 1;
        setScore(newScore);
        setMatchedCards((prev) => [...prev, firstId, secondId]);

        // Show +1 score popup
        setScorePopup({ id: Date.now(), x: 50 });
        setTimeout(() => setScorePopup(null), 1000);

        // Ενημέρωση RightPanel με κάθε ταίριασμα
        updateProgress({
          title: "Memory Match",
          score: newScore,
          total: TOTAL_PAIRS,
          index: newScore,
        });

        createCelebrationEmojis();

        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // Δεν ταιριάζουν ❌
        wrongSoundRef.current?.play().catch(() => {});

        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎯", "⭐", "✨", "🌟", "🎉", "🧠"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const progressPercent = Math.round((score / TOTAL_PAIRS) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="mb-8">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {lang === "el" ? "🧠 Μνήμη" : "🧠 Memory"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === "el" ? "Κινήσεις" : "Moves"}: {moves}
              </p>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              🎯 {score}/{TOTAL_PAIRS}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {lang === "el"
            ? "🎯 Βρες τα Ζευγάρια!"
            : "🎯 Find the Pairs!"}
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          {lang === "el"
            ? "Πάτα τις κάρτες για να τις γυρίσεις και βρες τα ίδια!"
            : "Tap cards to flip them and find matching pairs!"}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.uniqueId);
          const isMatched = matchedCards.includes(card.uniqueId);
          const showCard = isFlipped || isMatched;

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(card.uniqueId)}
              disabled={isMatched || isChecking}
              className={`
                aspect-square rounded-2xl border-4 transition-all duration-300
                transform
                ${showCard
                  ? isMatched
                    ? "bg-green-200 border-green-500 scale-105 cursor-default"
                    : "bg-white dark:bg-slate-800 border-blue-400 scale-105"
                  : "bg-gradient-to-br from-purple-400 to-blue-500 border-purple-600 hover:scale-110 cursor-pointer active:scale-95"
                }
                disabled:cursor-not-allowed
                shadow-lg hover:shadow-2xl
              `}
              style={{
                perspective: "1000px",
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {showCard ? (
                  <div className="text-6xl md:text-7xl animate-flip">
                    {card.emoji}
                  </div>
                ) : (
                  <div className="text-5xl md:text-6xl text-white">
                    ❓
                  </div>
                )}
                {isMatched && (
                  <span className="absolute top-2 right-2 text-3xl">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reset Button */}
      <div className="mt-8 text-center">
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-white hover:bg-slate-100 border-2 border-slate-300 rounded-xl text-slate-700 font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          🔄 {lang === "el" ? "Παίξε Ξανά" : "Play Again"}
        </button>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/90 to-cyan-400/90 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια Μνήμη!" : "Perfect Memory!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? `Βρήκες όλα τα ζευγάρια σε ${moves} κινήσεις!`
                : `You found all pairs in ${moves} moves!`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

