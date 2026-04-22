// src/components/games/MazeGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function MazeGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [pathTaken, setPathTaken] = useState([]);
  const mazeRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 30, y1: 20, x2: 30, y2: 80 },
          { x1: 50, y1: 20, x2: 50, y2: 60 },
          { x1: 70, y1: 40, x2: 70, y2: 80 }
        ],
        color: "#EF4444"
      },
      {
        id: 2,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls: [
          { x1: 30, y1: 0, x2: 30, y2: 70 },
          { x1: 50, y1: 30, x2: 50, y2: 100 },
          { x1: 70, y1: 0, x2: 70, y2: 70 }
        ],
        color: "#10B981"
      },
      {
        id: 3,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 30, x2: 60, y2: 30 },
          { x1: 40, y1: 50, x2: 80, y2: 50 },
          { x1: 20, y1: 70, x2: 60, y2: 70 }
        ],
        color: "#3B82F6"
      },
      {
        id: 4,
        start: { x: 10, y: 30 },
        end: { x: 90, y: 70 },
        walls: [
          { x1: 25, y1: 0, x2: 25, y2: 60 },
          { x1: 45, y1: 40, x2: 45, y2: 100 },
          { x1: 65, y1: 0, x2: 65, y2: 60 },
          { x1: 85, y1: 40, x2: 85, y2: 100 }
        ],
        color: "#EAB308"
      },
      {
        id: 5,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 20, y1: 25, x2: 20, y2: 75 },
          { x1: 40, y1: 25, x2: 40, y2: 75 },
          { x1: 60, y1: 25, x2: 60, y2: 75 },
          { x1: 80, y1: 25, x2: 80, y2: 75 }
        ],
        color: "#EC4899"
      },
      {
        id: 6,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls:[
          { x1: 30, y1: 20, x2: 70, y2: 20 },
          { x1: 30, y1: 50, x2: 70, y2: 50 },
          { x1: 30, y1: 80, x2: 70, y2: 80 }
        ],
        color: "#A855F7"
      },
      {
        id: 7,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 25, x2: 80, y2: 25 },
          { x1: 20, y1: 50, x2: 80, y2: 50 },
          { x1: 20, y1: 75, x2: 80, y2: 75 }
        ],
        color: "#14B8A6"
      },
      {
        id: 8,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 25, y1: 20, x2: 25, y2: 80 },
          { x1: 45, y1: 20, x2: 45, y2: 80 },
          { x1: 65, y1: 20, x2: 65, y2: 80 }
        ],
        color: "#F59E0B"
      },
      {
        id: 9,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls: [
          { x1: 30, y1: 0, x2: 30, y2: 50 },
          { x1: 50, y1: 30, x2: 50, y2: 100 },
          { x1: 70, y1: 0, x2: 70, y2: 70 }
        ],
        color: "#06B6D4"
      },
      {
        id: 10,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 30, x2: 80, y2: 30 },
          { x1: 20, y1: 70, x2: 80, y2: 70 }
        ],
        color: "#8B5CF6"
      }
    ],
    en: [
      {
        id: 1,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 30, y1: 20, x2: 30, y2: 80 },
          { x1: 50, y1: 20, x2: 50, y2: 60 },
          { x1: 70, y1: 40, x2: 70, y2: 80 }
        ],
        color: "#EF4444"
      },
      {
        id: 2,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls: [
          { x1: 30, y1: 0, x2: 30, y2: 70 },
          { x1: 50, y1: 30, x2: 50, y2: 100 },
          { x1: 70, y1: 0, x2: 70, y2: 70 }
        ],
        color: "#10B981"
      },
      {
        id: 3,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 30, x2: 60, y2: 30 },
          { x1: 40, y1: 50, x2: 80, y2: 50 },
          { x1: 20, y1: 70, x2: 60, y2: 70 }
        ],
        color: "#3B82F6"
      },
      {
        id: 4,
        start: { x: 10, y: 30 },
        end: { x: 90, y: 70 },
        walls: [
          { x1: 25, y1: 0, x2: 25, y2: 60 },
          { x1: 45, y1: 40, x2: 45, y2: 100 },
          { x1: 65, y1: 0, x2: 65, y2: 60 },
          { x1: 85, y1: 40, x2: 85, y2: 100 }
        ],
        color: "#EAB308"
      },
      {
        id: 5,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 20, y1: 25, x2: 20, y2: 75 },
          { x1: 40, y1: 25, x2: 40, y2: 75 },
          { x1: 60, y1: 25, x2: 60, y2: 75 },
          { x1: 80, y1: 25, x2: 80, y2: 75 }
        ],
        color: "#EC4899"
      },
      {
        id: 6,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls: [
          { x1: 30, y1: 20, x2: 70, y2: 20 },
          { x1: 30, y1: 50, x2: 70, y2: 50 },
          { x1: 30, y1: 80, x2: 70, y2: 80 }
        ],
        color: "#A855F7"
      },
      {
        id: 7,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 25, x2: 80, y2: 25 },
          { x1: 20, y1: 50, x2: 80, y2: 50 },
          { x1: 20, y1: 75, x2: 80, y2: 75 }
        ],
        color: "#14B8A6"
      },
      {
        id: 8,
        start: { x: 10, y: 50 },
        end: { x: 90, y: 50 },
        walls: [
          { x1: 25, y1: 20, x2: 25, y2: 80 },
          { x1: 45, y1: 20, x2: 45, y2: 80 },
          { x1: 65, y1: 20, x2: 65, y2: 80 }
        ],
        color: "#F59E0B"
      },
      {
        id: 9,
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
        walls: [
          { x1: 30, y1: 0, x2: 30, y2: 50 },
          { x1: 50, y1: 30, x2: 50, y2: 100 },
          { x1: 70, y1: 0, x2: 70, y2: 70 }
        ],
        color: "#06B6D4"
      },
      {
        id: 10,
        start: { x: 50, y: 10 },
        end: { x: 50, y: 90 },
        walls: [
          { x1: 20, y1: 30, x2: 80, y2: 30 },
          { x1: 20, y1: 70, x2: 80, y2: 70 }
        ],
        color: "#8B5CF6"
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
    setBallPosition(round.start);
    setPathTaken([round.start]);
    setShowAnswer(false);
    setIsDragging(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎯", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakInstruction = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? 'Σύρε τη μπάλα στο τερματισμό χωρίς να χτυπήσεις τους τοίχους!'
        : 'Drag the ball to the finish without hitting the walls!';

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
    const timer = setTimeout(() => {
      speakInstruction();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const checkCollision = (x, y) => {
    const ballRadius = 2; // 2% radius - smaller for easier gameplay

    for (const wall of round.walls) {
      const isVerticalWall = wall.x1 === wall.x2;
      const isHorizontalWall = wall.y1 === wall.y2;

      if (isVerticalWall) {
        // Vertical wall
        const wallX = wall.x1;
        const minY = Math.min(wall.y1, wall.y2);
        const maxY = Math.max(wall.y1, wall.y2);

        if (Math.abs(x - wallX) < ballRadius && y >= minY && y <= maxY) {
          return true;
        }
      } else if (isHorizontalWall) {
        // Horizontal wall
        const wallY = wall.y1;
        const minX = Math.min(wall.x1, wall.x2);
        const maxX = Math.max(wall.x1, wall.x2);

        if (Math.abs(y - wallY) < ballRadius && x >= minX && x <= maxX) {
          return true;
        }
      }
    }
    return false;
  };

  const checkWin = (x, y) => {
    const distance = Math.sqrt(
      Math.pow(x - round.end.x, 2) + Math.pow(y - round.end.y, 2)
    );
    return distance < 8; // Within 8% of end point
  };

  const handleMouseDown = (e) => {
    if (showAnswer) return;

    const rect = mazeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicking on ball - increased radius for easier grabbing
    const distance = Math.sqrt(
      Math.pow(x - ballPosition.x, 2) + Math.pow(y - ballPosition.y, 2)
    );

    if (distance < 8) { // Increased from 5 to 8 for easier grabbing
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || showAnswer) return;

    const rect = mazeRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp to boundaries
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    // Check collision
    if (checkCollision(x, y)) {
      wrongSoundRef.current?.play().catch(() => {});
      // Reset to start
      setBallPosition(round.start);
      setPathTaken([round.start]);
      setIsDragging(false);
      return;
    }

    setBallPosition({ x, y });
    setPathTaken(prev => [...prev, { x, y }]);

    // Check win
    if (checkWin(x, y)) {
      setIsDragging(false);
      handleWin();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (showAnswer) return;

    const rect = mazeRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(
      Math.pow(x - ballPosition.x, 2) + Math.pow(y - ballPosition.y, 2)
    );

    if (distance < 8) { // Increased from 5 to 8 for easier grabbing
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || showAnswer) return;

    e.preventDefault();
    const rect = mazeRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    let x = ((touch.clientX - rect.left) / rect.width) * 100;
    let y = ((touch.clientY - rect.top) / rect.height) * 100;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    if (checkCollision(x, y)) {
      wrongSoundRef.current?.play().catch(() => {});
      setBallPosition(round.start);
      setPathTaken([round.start]);
      setIsDragging(false);
      return;
    }

    setBallPosition({ x, y });
    setPathTaken(prev => [...prev, { x, y }]);

    if (checkWin(x, y)) {
      setIsDragging(false);
      handleWin();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWin = () => {
    setShowAnswer(true);
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Maze Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Maze Game",
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
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Πέρασε το Λαβύρινθο" : "Pass the Maze"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λαβύρινθος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Maze ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-purple-400">
          <div className="text-7xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">
            {lang === "el"
              ? "Σύρε τη μπάλα στο τερματισμό!"
              : "Drag the ball to the finish!"}
          </h2>

          <button
            onClick={speakInstruction}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-3"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>

          <p className="text-sm text-slate-600">
            {lang === "el"
              ? "⚠️ Αν χτυπήσεις τοίχο, ξαναρχίζεις!"
              : "⚠️ If you hit a wall, you restart!"}
          </p>
        </div>
      </div>

      {/* Maze Canvas */}
      <div className="max-w-4xl mx-auto mb-6">
        <div
          ref={mazeRef}
          className="relative bg-white rounded-3xl shadow-xl border-4 border-purple-400 overflow-hidden"
          style={{
            height: "500px",
            touchAction: "none",
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Path trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {pathTaken.length > 1 && (
              <polyline
                points={pathTaken.map(p => `${p.x}%,${p.y}%`).join(' ')}
                fill="none"
                stroke={round.color}
                strokeWidth="2"
                opacity="0.3"
              />
            )}
          </svg>

          {/* Walls */}
          {round.walls.map((wall, index) => (
            <div
              key={index}
              className="absolute bg-slate-700 rounded"
              style={{
                left: `${Math.min(wall.x1, wall.x2)}%`,
                top: `${Math.min(wall.y1, wall.y2)}%`,
                width: wall.x1 === wall.x2 ? '8px' : `${Math.abs(wall.x2 - wall.x1)}%`,
                height: wall.y1 === wall.y2 ? '8px' : `${Math.abs(wall.y2 - wall.y1)}%`,
                zIndex: 2
              }}
            />
          ))}

          {/* Start marker */}
          <div
            className="absolute flex items-center justify-center text-2xl font-bold animate-pulse"
            style={{
              left: `${round.start.x}%`,
              top: `${round.start.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
              backgroundColor: '#22C55E',
              borderRadius: '50%',
              border: '4px solid white',
              zIndex: 3
            }}
          >
            🏁
          </div>

          {/* End marker */}
          <div
            className="absolute flex items-center justify-center text-3xl animate-bounce"
            style={{
              left: `${round.end.x}%`,
              top: `${round.end.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              border: '4px solid white',
              zIndex: 3
            }}
          >
            🎯
          </div>

          {/* Ball */}
          <div
            className={`absolute transition-all ${isDragging ? 'scale-110' : 'scale-100'}`}
            style={{
              left: `${ballPosition.x}%`,
              top: `${ballPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: round.color,
              boxShadow: `0 0 20px ${round.color}, inset -10px -10px 20px rgba(0,0,0,0.2)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 10
            }}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: round.color }} />
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Πέρασες όλους τους λαβυρίνθους!" : "Perfect! You passed all the mazes!"}
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

