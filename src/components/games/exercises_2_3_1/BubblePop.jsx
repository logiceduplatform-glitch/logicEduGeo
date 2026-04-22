// src/components/games/BubblePop.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function BubblePop({ lang = "el", onComplete }) {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const bubbleIdCounter = useRef(0);
  const popSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const BUBBLE_COLORS = [
    "bg-pink-400",
    "bg-blue-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-red-400",
    "bg-cyan-400",
    "bg-orange-400",
  ];

  const TARGET_BUBBLES = 20; // Στόχος: 20 φούσκες

  useEffect(() => {
    popSoundRef.current = new Audio("/sounds/pop.mp3");
    popSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎈", "💧", "⭐", "✨", "🌟", "🎉"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  // Δημιουργία νέων φουσκών (3-4 μαζί)
  useEffect(() => {
    const interval = setInterval(() => {
      if (poppedCount >= TARGET_BUBBLES) {
        return; // Σταματάει όταν φτάσουμε τον στόχο
      }

      // Δημιουργία 3-4 φούσκες μαζί
      const bubblesCount = Math.floor(Math.random() * 2) + 3; // 3 ή 4 φούσκες
      const newBubbles = [];

      for (let i = 0; i < bubblesCount; i++) {
        const newBubble = {
          id: bubbleIdCounter.current++,
          x: Math.random() * 80 + 5, // 5-85% από την πλευρά
          size: Math.random() * 40 + 70, // 70-110px (μεγαλύτερες)
          speed: Math.random() * 3 + 3, // 3-6 seconds (πιο αργά)
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          delay: Math.random() * 0.8, // Λίγο πιο διασκορπισμένες
        };

        newBubbles.push(newBubble);

        // Αφαίρεση φούσκας μετά από λίγο (αν δεν σκάσει)
        setTimeout(() => {
          setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
        }, (newBubble.speed + newBubble.delay) * 1000 + 500);
      }

      setBubbles((prev) => [...prev, ...newBubbles]);
    }, 2500); // Νέο group φουσκών κάθε 2.5 δευτερόλεπτα

    return () => clearInterval(interval);
  }, [poppedCount]);

  // Έλεγχος για completion
  useEffect(() => {
    if (poppedCount >= TARGET_BUBBLES && !showCelebration) {
      createCelebrationEmojis();
      setShowCelebration(true);

      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [poppedCount, showCelebration, onComplete]);

  const handleBubblePop = (bubbleId, bubbleX) => {
    // Αφαίρεση φούσκας
    setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));

    // Ενημέρωση σκορ και count
    const newScore = score + 1;
    const newPoppedCount = poppedCount + 1;
    setScore(newScore);
    setPoppedCount(newPoppedCount);

    // Show +1 score popup at bubble position
    const popupId = Date.now() + Math.random();
    setScorePopups((prev) => [...prev, { id: popupId, x: bubbleX }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popupId));
    }, 1000);

    // Ήχος pop
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }

    // Ενημέρωση RightPanel Started
    updateProgress({
      title: "Bubble Pop",
      score: newScore,
      total: TARGET_BUBBLES,
      index: newPoppedCount,
    });

    // 🔥 Ενημέρωση Cup of Month με +1 πόντο ανά φούσκα που σκάει
    completeQuiz({
      title: "Bubble Pop",
      score: 1, // +1 πόντος για αυτή τη φούσκα
      total: 1, // Κάθε φούσκα = 1 πόντος
    });
  };

  const progressPercent = Math.round((poppedCount / TARGET_BUBBLES) * 100);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-blue-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden rounded-xl">
      {/* Celebration Emojis */}
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-40"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Score Popups */}
      {scorePopups.map((popup) => (
        <div
          key={popup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${popup.x}%`,
            bottom: "20%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      ))}

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {lang === "el" ? "Φούσκες που Σκάνε!" : "Bubble Pop!"}
              </h2>
              <div className="text-xl font-bold text-blue-600">
                {lang === "el" ? "Σκορ" : "Score"}: {score}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {poppedCount === 0 && (
        <div className="absolute top-32 left-0 right-0 z-10 text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg shadow-lg p-4 mx-auto max-w-md">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {lang === "el"
                ? "🎈 Πάτα τις φούσκες για να τις σκάσεις!"
                : "🎈 Click the bubbles to pop them!"}
            </p>
          </div>
        </div>
      )}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBubblePop(bubble.id, bubble.x);
          }}
          className={`absolute bottom-0 ${bubble.color} rounded-full cursor-pointer
            shadow-lg border-4 border-white/50 animate-bubble
            hover:scale-110 transition-transform duration-200`}
          style={{
            left: `${bubble.x}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.speed}s`,
            animationDelay: `${bubble.delay}s`,
            opacity: 0.9,
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute top-2 left-2 w-6 h-6 bg-white/60 rounded-full blur-sm"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      ))}

      {/* Celebration Overlay - Covers only the game board */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎈🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
            transform: scale(1);
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0.9;
          }
        }
        .animate-bubble {
          animation: bubble linear forwards;
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: visible;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

