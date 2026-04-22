// src/components/games/exercises_6_1/MiniPuzzleGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function MiniPuzzleGame({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const completeRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const TARGET_ROUNDS = 6;
  const puzzles = [
    {
      id: 1,
      name: { el: "Σπίτι", en: "House" },
      emoji: "🏠",
      pieces: 4,
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
      labels: ["A", "B", "C", "D"]
    },
    {
      id: 2,
      name: { el: "Ήλιος", en: "Sun" },
      emoji: "☀️",
      pieces: 4,
      colors: ["#fbbf24", "#f59e0b", "#f97316", "#fb923c"],
      labels: ["1", "2", "3", "4"]
    },
    {
      id: 3,
      name: { el: "Καρδιά", en: "Heart" },
      emoji: "❤️",
      pieces: 4,
      colors: ["#ef4444", "#dc2626", "#f87171", "#fca5a5"],
      labels: ["♥", "♥", "♥", "♥"]
    },
    {
      id: 4,
      name: { el: "Δέντρο", en: "Tree" },
      emoji: "🌳",
      pieces: 6,
      colors: ["#10b981", "#059669", "#22c55e", "#86efac", "#78350f", "#92400e"],
      labels: ["1", "2", "3", "4", "5", "6"]
    },
    {
      id: 5,
      name: { el: "Αστέρι", en: "Star" },
      emoji: "⭐",
      pieces: 5,
      colors: ["#fbbf24", "#f59e0b", "#f97316", "#fb923c", "#fde047"],
      labels: ["★", "★", "★", "★", "★"]
    },
    {
      id: 6,
      name: { el: "Πεταλούδα", en: "Butterfly" },
      emoji: "🦋",
      pieces: 6,
      colors: ["#8b5cf6", "#a78bfa", "#c084fc", "#e9d5ff", "#f0abfc", "#f5d0fe"],
      labels: ["A", "B", "C", "D", "E", "F"]
    }
  ];
  const currentPuzzle = puzzles[currentRound];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    completeRef.current = new Audio("/sounds/complete.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    completeRef.current.preload = "auto";
  }, []);
  useEffect(() => {
    if (currentPuzzle) {
      const shuffledPieces = Array.from({ length: currentPuzzle.pieces }, (_, i) => ({
        id: i,
        color: currentPuzzle.colors[i],
        label: currentPuzzle.labels[i],
        correctSlot: i
      })).sort(() => Math.random() - 0.5);
      setPieces(shuffledPieces);
      setPlacedPieces(Array(currentPuzzle.pieces).fill(null));
    }
  }, [currentRound]);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧩", "🏆", "✅"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedPiece) return;
    if (draggedPiece.correctSlot === slotIndex) {
      correctSoundRef.current?.play().catch(() => {});
      const newPlacedPieces = [...placedPieces];
      newPlacedPieces[slotIndex] = draggedPiece;
      setPlacedPieces(newPlacedPieces);
      const newPieces = pieces.filter(p => p.id !== draggedPiece.id);
      setPieces(newPieces);
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);
      if (newPlacedPieces.every(p => p !== null)) {
        completeRef.current?.play().catch(() => {});
        const newScore = score + 1;
        setScore(newScore);
        updateProgress({
          title: "Mini Puzzle Game",
          score: newScore,
          total: TARGET_ROUNDS,
          index: currentRound + 1,
        });
        setTimeout(() => {
          if (currentRound + 1 < TARGET_ROUNDS) {
            setCurrentRound(prev => prev + 1);
          } else {
            createCelebrationEmojis();
            setShowCelebration(true);
            completeQuiz({
              title: "Mini Puzzle Game",
              score: newScore,
              total: TARGET_ROUNDS,
            });
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 2500);
          }
        }, 1500);
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
    }
    setDraggedPiece(null);
  };
  const handleTouchStart = (e, piece) => {
    setDraggedPiece(piece);
    const touch = e.touches[0];
    const element = e.currentTarget;
    element.style.opacity = "0.5";
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
  };
  const handleTouchEnd = (e, slotIndex) => {
    if (!draggedPiece) return;
    if (draggedPiece.correctSlot === slotIndex) {
      correctSoundRef.current?.play().catch(() => {});
      const newPlacedPieces = [...placedPieces];
      newPlacedPieces[slotIndex] = draggedPiece;
      setPlacedPieces(newPlacedPieces);
      const newPieces = pieces.filter(p => p.id !== draggedPiece.id);
      setPieces(newPieces);
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);
      if (newPlacedPieces.every(p => p !== null)) {
        completeRef.current?.play().catch(() => {});
        const newScore = score + 1;
        setScore(newScore);
        updateProgress({
          title: "Mini Puzzle Game",
          score: newScore,
          total: TARGET_ROUNDS,
          index: currentRound + 1,
        });
        setTimeout(() => {
          if (currentRound + 1 < TARGET_ROUNDS) {
            setCurrentRound(prev => prev + 1);
          } else {
            createCelebrationEmojis();
            setShowCelebration(true);
            completeQuiz({
              title: "Mini Puzzle Game",
              score: newScore,
              total: TARGET_ROUNDS,
            });
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 2500);
          }
        }, 1500);
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
    }
    setDraggedPiece(null);
  };
  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Mini Παζλ" : "Mini Puzzle"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Παζλ ${currentRound + 1}/${TARGET_ROUNDS} - ${currentPuzzle.name.el} ${currentPuzzle.emoji}`
                : `Puzzle ${currentRound + 1}/${TARGET_ROUNDS} - ${currentPuzzle.name.en} ${currentPuzzle.emoji}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🧩 {score}
          </div>
        </div>
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
      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          <div className="text-center mb-6">
            <div className="text-8xl mb-2">{currentPuzzle.emoji}</div>
            <p className="text-2xl font-bold text-slate-700">
              {lang === "el" 
                ? "Σύρε τα κομμάτια στις σωστές θέσεις!" 
                : "Drag the pieces to the correct spots!"}
            </p>
          </div>
          {/* Puzzle Board */}
          <div className="mb-8">
            <div 
              className="grid gap-3 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-2xl border-4 border-slate-300"
              style={{ 
                gridTemplateColumns: `repeat(${currentPuzzle.pieces === 4 ? 2 : currentPuzzle.pieces === 5 ? 3 : 3}, 1fr)`,
                maxWidth: currentPuzzle.pieces === 4 ? '400px' : '600px'
              }}
            >
              {placedPieces.map((piece, index) => (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                  className={`relative aspect-square rounded-xl border-4 border-dashed transition-all ${
                    piece 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-slate-400 bg-white hover:border-purple-400 hover:bg-purple-50'
                  }`}
                  style={{ minHeight: '100px' }}
                >
                  {piece ? (
                    <div 
                      className="w-full h-full rounded-lg flex items-center justify-center text-4xl font-bold text-white shadow-lg animate-fadeIn"
                      style={{ backgroundColor: piece.color }}
                    >
                      {piece.label}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl text-slate-300">
                      {index + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Available Pieces */}
          {pieces.length > 0 && (
            <div>
              <p className="text-lg font-semibold text-slate-700 mb-4 text-center">
                {lang === "el" ? "Κομμάτια Παζλ:" : "Puzzle Pieces:"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {pieces.map((piece) => (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece)}
                    onTouchStart={(e) => handleTouchStart(e, piece)}
                    onTouchMove={handleTouchMove}
                    className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform border-4 border-white"
                    style={{ backgroundColor: piece.color }}
                  >
                    {piece.label}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Completion Message */}
          {pieces.length === 0 && placedPieces.every(p => p !== null) && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">🎉</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el" 
                    ? `Τέλεια! Ολοκλήρωσες το ${currentPuzzle.name.el}!` 
                    : `Perfect! You completed the ${currentPuzzle.name.en}!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧩🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Είσαι άσος στα παζλ!" : "Bravo! You're a puzzle master!"}
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
