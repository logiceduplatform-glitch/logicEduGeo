// src/components/games/exercises_2_3_1/BalloonCatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

const BALLOON_COLORS = [
  { id: "red", nameEl: "Κόκκινο", nameEn: "Red", bg: "bg-red-500", border: "border-red-400" },
  { id: "blue", nameEl: "Μπλε", nameEn: "Blue", bg: "bg-blue-500", border: "border-blue-400" },
  { id: "green", nameEl: "Πράσινο", nameEn: "Green", bg: "bg-green-500", border: "border-green-400" },
  { id: "yellow", nameEl: "Κίτρινο", nameEn: "Yellow", bg: "bg-yellow-400", border: "border-yellow-300" },
  { id: "pink", nameEl: "Ροζ", nameEn: "Pink", bg: "bg-pink-500", border: "border-pink-400" },
  { id: "orange", nameEl: "Πορτοκαλί", nameEn: "Orange", bg: "bg-orange-500", border: "border-orange-400" },
  { id: "purple", nameEl: "Μωβ", nameEn: "Purple", bg: "bg-purple-500", border: "border-purple-400" },
];

const TARGET_BALLOONS = 15;

export default function BalloonCatch({ lang = "el", onComplete }) {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const balloonIdCounter = useRef(0);
  const popSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  useEffect(() => {
    popSoundRef.current = new Audio("/sounds/pop.mp3");
    popSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎈", "🎉", "⭐", "✨", "🌟", "🏆"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  // Spawn balloons from bottom
  useEffect(() => {
    const interval = setInterval(() => {
      if (caughtCount >= TARGET_BALLOONS) return;

      const count = Math.floor(Math.random() * 2) + 2; // 2–3 balloons at a time
      const newBalloons = [];

      for (let i = 0; i < count; i++) {
        const colorData = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const colorName = lang === "el" ? colorData.nameEl : colorData.nameEn;
        const newBalloon = {
          id: balloonIdCounter.current++,
          x: Math.random() * 75 + 5,
          size: Math.random() * 24 + 72, // 72–96px
          speed: Math.random() * 3 + 4,
          delay: Math.random() * 0.8,
          colorData,
          colorName,
        };
        newBalloons.push(newBalloon);

        setTimeout(() => {
          setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));
        }, (newBalloon.speed + newBalloon.delay) * 1000 + 500);
      }

      setBalloons((prev) => [...prev, ...newBalloons]);
    }, 2200);

    return () => clearInterval(interval);
  }, [caughtCount, lang]);

  useEffect(() => {
    if (caughtCount >= TARGET_BALLOONS && !showCelebration) {
      createCelebrationEmojis();
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);
    }
  }, [caughtCount, showCelebration, onComplete]);

  const handleBalloonCatch = (balloonId, balloonX) => {
    setBalloons((prev) => prev.filter((b) => b.id !== balloonId));
    const newScore = score + 1;
    const newCaughtCount = caughtCount + 1;
    setScore(newScore);
    setCaughtCount(newCaughtCount);

    const popupId = Date.now() + Math.random();
    setScorePopups((prev) => [...prev, { id: popupId, x: balloonX }]);
    setTimeout(() => setScorePopups((prev) => prev.filter((p) => p.id !== popupId)), 1000);

    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }

    updateProgress({
      title: "Balloon Catch",
      score: newScore,
      total: TARGET_BALLOONS,
      index: newCaughtCount,
    });

    completeQuiz({
      title: "Balloon Catch",
      score: 1,
      total: 1,
    });
  };

  const progressPercent = Math.round((caughtCount / TARGET_BALLOONS) * 100);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-300 to-blue-200 dark:from-slate-900 dark:to-slate-800 overflow-hidden rounded-xl">
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
          className="absolute text-4xl font-bold text-green-600 dark:text-green-400 pointer-events-none z-50"
          style={{
            left: `${popup.x}%`,
            bottom: "20%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐
        </div>
      ))}

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {lang === "el" ? "Πιάσε τα Μπαλόνια!" : "Balloon Catch!"}
              </h2>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {lang === "el" ? "Σκορ" : "Score"}: {score}
              </div>
            </div>
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
      {caughtCount === 0 && (
        <div className="absolute top-32 left-0 right-0 z-10 text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg shadow-lg p-4 mx-auto max-w-md">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {lang === "el"
                ? "🎈 Πάτα τα μπαλόνια για να τα πιάσεις!"
                : "🎈 Tap the balloons to catch them!"}
            </p>
          </div>
        </div>
      )}

      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBalloonCatch(balloon.id, balloon.x);
          }}
          className={`absolute bottom-0 ${balloon.colorData.bg} ${balloon.colorData.border} border-2
            rounded-t-[50%] rounded-b-[50%] cursor-pointer shadow-lg
            animate-balloon-float hover:scale-110 transition-transform duration-200
            flex items-center justify-center`}
          style={{
            left: `${balloon.x}%`,
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.2}px`,
            animationDuration: `${balloon.speed}s`,
            animationDelay: `${balloon.delay}s`,
            pointerEvents: "auto",
            userSelect: "none",
          }}
        >
          <span className="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center px-1 text-sm">
            {balloon.colorName}
          </span>
          {/* Balloon knot */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-4 bg-slate-700/60 rounded-b-full"
            style={{ pointerEvents: "none" }}
          />
        </div>
      ))}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/80 to-blue-500/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎈🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes balloon-float {
          0% {
            transform: translateY(0) scale(0.3);
            opacity: 0;
          }
          12% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            transform: translateY(-120vh) scale(1);
            opacity: 1;
          }
        }
        .animate-balloon-float {
          animation: balloon-float linear forwards;
          will-change: transform;
          transform-origin: center bottom;
        }
        @keyframes float-up {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-80px);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
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
