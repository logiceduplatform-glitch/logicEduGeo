// src/components/games/ShapeMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ShapeMatch({ lang = "el", onComplete }) {
  const [draggedShape, setDraggedShape] = useState(null);
  const [matchedShapes, setMatchedShapes] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stars, setStars] = useState([]);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const shapes = [
    {
      id: "circle",
      name: { el: "Κύκλος", en: "Circle" },
      emoji: "🔵",
      color: "bg-blue-500",
      path: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10",
    },
    {
      id: "square",
      name: { el: "Τετράγωνο", en: "Square" },
      emoji: "🟥",
      color: "bg-red-500",
      path: "M 10 10 L 90 10 L 90 90 L 10 90 Z",
    },
    {
      id: "triangle",
      name: { el: "Τρίγωνο", en: "Triangle" },
      emoji: "🔺",
      color: "bg-yellow-500",
      path: "M 50 10 L 90 90 L 10 90 Z",
    },
  ];

  const TARGET_MATCHES = shapes.length; // 3 σχήματα = 3 ταιριάσματα

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    // Reset state όταν το component mount-άρει ξανά
    setShowCelebration(false);
    setMatchedShapes([]);
    setScore(0);
    setStars([]);
    setCelebrationEmojis([]);
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🔷", "🔺", "🔵", "⭐", "✨", "🌟", "🎉"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  useEffect(() => {
    if (matchedShapes.length >= TARGET_MATCHES && matchedShapes.length > 0 && !showCelebration) {
      createCelebrationEmojis();
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [matchedShapes.length, onComplete, showCelebration]);

  const handleDragStart = (e, shapeId) => {
    setDraggedShape(shapeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetShapeId) => {
    e.preventDefault();

    if (draggedShape === targetShapeId) {
      // Σωστό ταίριασμα!
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      const newMatched = [...matchedShapes, draggedShape];
      setScore(newScore);
      setMatchedShapes(newMatched);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Αστεράκια animation
      createStars(e.clientX, e.clientY);

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Shape Match",
        score: newScore,
        total: TARGET_MATCHES,
        index: newMatched.length,
      });

      // Cup of Month
      completeQuiz({
        title: "Shape Match",
        score: 1,
        total: 1,
      });
    } else {
      // Λάθος ταίριασμα
      wrongSoundRef.current?.play().catch(() => {});
    }

    setDraggedShape(null);
  };

  const createStars = (x, y) => {
    const ids = new Set(Array.from({ length: 5 }, (_, i) => Date.now() + i));
    const newStars = [...ids].map((id) => ({
      id,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }));
    setStars((prev) => [...prev, ...newStars]);

    setTimeout(() => {
      setStars((prev) => prev.filter((star) => !ids.has(star.id)));
    }, 1000);
  };

  const availableShapes = shapes.map((shape) => ({
    ...shape,
    count: matchedShapes.filter((id) => id === shape.id).length,
  }));

  const progressPercent = Math.round((matchedShapes.length / TARGET_MATCHES) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold text-slate-800">
              {lang === "el" ? "Ταίριαξε τα Σχήματα!" : "Match the Shapes!"}
            </h2>
            <div className="text-2xl font-bold text-purple-600">
              ⭐ {score}/{TARGET_MATCHES}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {matchedShapes.length === 0 && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg shadow-lg p-4 text-center">
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              {lang === "el"
                ? "🎯 Σύρε κάθε σχήμα στο κενό του!"
                : "🎯 Drag each shape to its hole!"}
            </p>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Drop Zones (Targets) */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-4">
            {lang === "el" ? "Τοποθέτησε εδώ" : "Drop here"}
          </h3>
          {shapes.map((shape) => {
            const isMatched = availableShapes.find((s) => s.id === shape.id)?.count >= 1;

            return (
              <div
                key={shape.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, shape.id)}
                className={`relative h-48 rounded-2xl border-4 transition-all duration-300
                  ${isMatched
                    ? `${shape.color} border-green-500 shadow-2xl`
                    : draggedShape === shape.id
                      ? "border-green-500 bg-green-50 scale-105 border-dashed"
                      : "border-slate-300 bg-white/50 border-dashed"}
                  flex items-center justify-center overflow-hidden`}
              >
                {isMatched ? (
                  // Εμφάνιση του σχήματος όταν έχει ταιριαστεί
                  <>
                    <svg width="140" height="140" viewBox="0 0 100 100">
                      <path d={shape.path} fill="white" opacity="0.9" />
                    </svg>
                    <div className="absolute top-4 text-4xl font-bold text-white">
                      {shape.emoji}
                    </div>
                    <div className="absolute bottom-4 text-2xl font-bold text-white/80">
                      {shape.name[lang]}
                    </div>
                    <div className="absolute top-4 right-4 text-4xl animate-bounce">
                      ✅
                    </div>
                  </>
                ) : (
                  // Εμφάνιση του κενού όταν δεν έχει ταιριαστεί
                  <>
                    <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-20">
                      <path d={shape.path} fill="currentColor" className={shape.color.replace("bg-", "text-")} />
                    </svg>
                    <div className="absolute top-4 left-4 text-2xl font-bold text-slate-600 dark:text-slate-400">
                      {shape.name[lang]}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Draggable Shapes */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
            {lang === "el" ? "Σχήματα" : "Shapes"}
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {shapes.map((shape) => {
              const isCompleted = availableShapes.find((s) => s.id === shape.id)?.count >= 1;

              if (isCompleted) return null;

              return (
                <div
                  key={shape.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, shape.id)}
                  className={`h-48 rounded-2xl ${shape.color} cursor-move
                    hover:scale-105 transition-transform duration-200 shadow-2xl
                    flex items-center justify-center relative overflow-hidden`}
                >
                  <svg width="140" height="140" viewBox="0 0 100 100">
                    <path d={shape.path} fill="white" opacity="0.9" />
                  </svg>
                  <div className="absolute top-4 text-4xl font-bold text-white">
                    {shape.emoji}
                  </div>
                  <div className="absolute bottom-4 text-2xl font-bold text-white/80">
                    {shape.name[lang]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="fixed text-4xl pointer-events-none animate-starFloat"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* Celebration Overlay - Covers the game board */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔷🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes starFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
          }
        }
        .animate-starFloat {
          animation: starFloat 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

