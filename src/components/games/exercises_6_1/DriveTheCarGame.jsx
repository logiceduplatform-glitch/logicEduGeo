// src/components/games/exercises_6_1/DriveTheCarGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function DriveTheCarGame({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const completeRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const TARGET_ROUNDS = 8;
  const mazes = [
    {
      id: 1,
      start: { x: 50, y: 50 },
      end: { x: 550, y: 50 },
      obstacles: [
        { x: 150, y: 0, width: 20, height: 150 },
        { x: 300, y: 50, width: 20, height: 150 },
        { x: 450, y: 0, width: 20, height: 150 }
      ],
      description: { el: "Ευθεία γραμμή", en: "Straight line" }
    },
    {
      id: 2,
      start: { x: 50, y: 50 },
      end: { x: 550, y: 250 },
      obstacles: [
        { x: 200, y: 0, width: 20, height: 150 },
        { x: 350, y: 100, width: 20, height: 200 }
      ],
      description: { el: "Ζιγκ-ζαγκ", en: "Zigzag" }
    },
    {
      id: 3,
      start: { x: 50, y: 150 },
      end: { x: 550, y: 150 },
      obstacles: [
        { x: 150, y: 50, width: 20, height: 100 },
        { x: 250, y: 150, width: 20, height: 100 },
        { x: 350, y: 50, width: 20, height: 100 },
        { x: 450, y: 150, width: 20, height: 100 }
      ],
      description: { el: "Τούνελ", en: "Tunnel" }
    },
    {
      id: 4,
      start: { x: 50, y: 50 },
      end: { x: 550, y: 250 },
      obstacles: [
        { x: 150, y: 0, width: 20, height: 180 },
        { x: 300, y: 120, width: 20, height: 180 },
        { x: 450, y: 0, width: 20, height: 180 }
      ],
      description: { el: "Σκαλοπάτια", en: "Steps" }
    },
    {
      id: 5,
      start: { x: 300, y: 50 },
      end: { x: 300, y: 250 },
      obstacles: [
        { x: 200, y: 100, width: 80, height: 20 },
        { x: 320, y: 100, width: 80, height: 20 },
        { x: 200, y: 180, width: 80, height: 20 },
        { x: 320, y: 180, width: 80, height: 20 }
      ],
      description: { el: "Κατακόρυφο", en: "Vertical" }
    },
    {
      id: 6,
      start: { x: 50, y: 150 },
      end: { x: 550, y: 150 },
      obstacles: [
        { x: 180, y: 80, width: 20, height: 80 },
        { x: 180, y: 180, width: 20, height: 80 },
        { x: 320, y: 80, width: 20, height: 80 },
        { x: 320, y: 180, width: 20, height: 80 },
        { x: 460, y: 80, width: 20, height: 80 },
        { x: 460, y: 180, width: 20, height: 80 }
      ],
      description: { el: "Πύλες", en: "Gates" }
    },
    {
      id: 7,
      start: { x: 50, y: 50 },
      end: { x: 550, y: 250 },
      obstacles: [
        { x: 150, y: 0, width: 20, height: 120 },
        { x: 150, y: 180, width: 20, height: 120 },
        { x: 300, y: 50, width: 20, height: 120 },
        { x: 300, y: 230, width: 20, height: 70 },
        { x: 450, y: 0, width: 20, height: 120 },
        { x: 450, y: 180, width: 20, height: 120 }
      ],
      description: { el: "Δύσκολος", en: "Difficult" }
    },
    {
      id: 8,
      start: { x: 300, y: 50 },
      end: { x: 300, y: 250 },
      obstacles: [
        { x: 200, y: 90, width: 80, height: 15 },
        { x: 320, y: 90, width: 80, height: 15 },
        { x: 250, y: 130, width: 40, height: 15 },
        { x: 310, y: 130, width: 40, height: 15 },
        { x: 200, y: 170, width: 80, height: 15 },
        { x: 320, y: 170, width: 80, height: 15 },
        { x: 250, y: 210, width: 40, height: 15 },
        { x: 310, y: 210, width: 40, height: 15 }
      ],
      description: { el: "Μάστερ", en: "Master" }
    }
  ];
  const currentMaze = mazes[currentRound];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    completeRef.current = new Audio("/sounds/complete.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
    completeRef.current.preload = "auto";
  }, []);
  useEffect(() => {
    if (currentMaze) {
      setCarPosition(currentMaze.start);
      setShowAnswer(false);
      setIsDragging(false);
    }
  }, [currentRound]);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🚗", "🏁", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const checkCollision = (x, y) => {
    for (const obstacle of currentMaze.obstacles) {
      if (
        x >= obstacle.x &&
        x <= obstacle.x + obstacle.width &&
        y >= obstacle.y &&
        y <= obstacle.y + obstacle.height
      ) {
        return true;
      }
    }
    return false;
  };
  const checkWin = (x, y) => {
    const distance = Math.sqrt(
      Math.pow(x - currentMaze.end.x, 2) + Math.pow(y - currentMaze.end.y, 2)
    );
    return distance < 40;
  };
  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const carRect = { x: carPosition.x - 20, y: carPosition.y - 20, width: 40, height: 40 };
    if (x >= carRect.x && x <= carRect.x + carRect.width && 
        y >= carRect.y && y <= carRect.y + carRect.height) {
      setIsDragging(true);
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging || showAnswer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(20, Math.min(580, x));
    y = Math.max(20, Math.min(280, y));
    if (checkCollision(x, y)) {
      wrongSoundRef.current?.play().catch(() => {});
      setIsDragging(false);
      setCarPosition(currentMaze.start);
      return;
    }
    setCarPosition({ x, y });
    if (checkWin(x, y)) {
      setIsDragging(false);
      setShowAnswer(true);
      completeRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);
      updateProgress({
        title: "Drive the Car Game",
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
            title: "Drive the Car Game",
            score: newScore,
            total: TARGET_ROUNDS,
          });
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 1500);
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchStart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const carRect = { x: carPosition.x - 20, y: carPosition.y - 20, width: 40, height: 40 };
    if (x >= carRect.x && x <= carRect.x + carRect.width && 
        y >= carRect.y && y <= carRect.y + carRect.height) {
      setIsDragging(true);
    }
  };
  const handleTouchMove = (e) => {
    if (!isDragging || showAnswer) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    x = Math.max(20, Math.min(580, x));
    y = Math.max(20, Math.min(280, y));
    if (checkCollision(x, y)) {
      wrongSoundRef.current?.play().catch(() => {});
      setIsDragging(false);
      setCarPosition(currentMaze.start);
      return;
    }
    setCarPosition({ x, y });
    if (checkWin(x, y)) {
      setIsDragging(false);
      setShowAnswer(true);
      completeRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);
      updateProgress({
        title: "Drive the Car Game",
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
            title: "Drive the Car Game",
            score: newScore,
            total: TARGET_ROUNDS,
          });
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 1500);
    }
  };
  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-cyan-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Οδήγησε το Αυτοκινητάκι" : "Drive the Car"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λαβύρινθος ${currentRound + 1}/${TARGET_ROUNDS} - ${currentMaze.description.el}`
                : `Maze ${currentRound + 1}/${TARGET_ROUNDS} - ${currentMaze.description.en}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🚗 {score}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>
      {/* Game Area */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          <p className="text-2xl font-bold text-slate-700 mb-4 text-center">
            {lang === "el" 
              ? "Σύρε το αυτοκινητάκι μέχρι τη σημαία! Πρόσεχε τα εμπόδια!" 
              : "Drag the car to the flag! Watch out for obstacles!"}
          </p>
          {/* Maze */}
          <div 
            className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-4 border-slate-300 shadow-inner cursor-pointer"
            style={{ width: '600px', height: '300px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Road markings */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-yellow-400"
                  style={{
                    left: `${i * 100 + 50}px`,
                    top: '0',
                    width: '4px',
                    height: '100%'
                  }}
                />
              ))}
            </div>
            {/* Obstacles */}
            {currentMaze.obstacles.map((obstacle, idx) => (
              <div
                key={idx}
                className="absolute bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg border-2 border-red-800"
                style={{
                  left: `${obstacle.x}px`,
                  top: `${obstacle.y}px`,
                  width: `${obstacle.width}px`,
                  height: `${obstacle.height}px`
                }}
              />
            ))}
            {/* Start marker */}
            <div
              className="absolute flex items-center justify-center text-4xl"
              style={{
                left: `${currentMaze.start.x - 25}px`,
                top: `${currentMaze.start.y - 25}px`,
                width: '50px',
                height: '50px'
              }}
            >
              🏁
            </div>
            {/* End marker */}
            <div
              className="absolute flex items-center justify-center text-5xl animate-bounce"
              style={{
                left: `${currentMaze.end.x - 30}px`,
                top: `${currentMaze.end.y - 30}px`,
                width: '60px',
                height: '60px'
              }}
            >
              🏁
            </div>
            {/* Car */}
            <div
              className={`absolute flex items-center justify-center text-4xl transition-transform ${isDragging ? 'scale-110' : 'scale-100'} ${showAnswer ? 'animate-bounce' : ''}`}
              style={{
                left: `${carPosition.x - 20}px`,
                top: `${carPosition.y - 20}px`,
                width: '40px',
                height: '40px',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              🚗
            </div>
          </div>
          {/* Instructions */}
          {!showAnswer && (
            <div className="mt-6 text-center">
              <p className="text-lg text-slate-600">
                {lang === "el" 
                  ? "💡 Πάτησε και σύρε το αυτοκινητάκι!" 
                  : "💡 Click and drag the car!"}
              </p>
            </div>
          )}
          {/* Success message */}
          {showAnswer && (
            <div className="mt-6 text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-6 border-4 border-green-400">
                <div className="text-6xl mb-2">🎉</div>
                <p className="text-2xl font-bold text-green-700">
                  {lang === "el" ? "Τέλεια! Έφτασες στον προορισμό!" : "Perfect! You reached the destination!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-cyan-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🚗🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Φανταστικός οδηγός! Τα πήγες υπέροχα!" : "Amazing driver! You did great!"}
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
