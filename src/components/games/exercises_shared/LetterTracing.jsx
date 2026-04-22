// src/components/games/exercises_4_5/LetterTracing.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function LetterTracing({ lang = "el", onComplete }) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [connectedDots, setConnectedDots] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const correctSoundRef = useRef(null);
  const popSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_LETTERS = 6; // 6 γράμματα

  const lettersData = {
    el: [
      {
        id: 1,
        letter: "Α",
        name: "Άλφα",
        color: "#EF4444",
        dots: [
          { id: 1, x: 50, y: 20, label: "1" },
          { id: 2, x: 35, y: 80, label: "2" },
          { id: 3, x: 50, y: 20, label: "3" },
          { id: 4, x: 65, y: 80, label: "4" },
          { id: 5, x: 42, y: 55, label: "5", lift: true },
          { id: 6, x: 58, y: 55, label: "6" },
        ]
      },
      {
        id: 2,
        letter: "Β",
        name: "Βήτα",
        color: "#3B82F6",
        dots: [
          { id: 1, x: 35, y: 20, label: "1" },
          { id: 2, x: 35, y: 80, label: "2" },
          { id: 3, x: 35, y: 20, label: "3" },
          { id: 4, x: 55, y: 25, label: "4" },
          { id: 5, x: 60, y: 35, label: "5" },
          { id: 6, x: 55, y: 45, label: "6" },
          { id: 7, x: 35, y: 50, label: "7" },
          { id: 8, x: 55, y: 55, label: "8" },
          { id: 9, x: 60, y: 65, label: "9" },
          { id: 10, x: 55, y: 75, label: "10" },
          { id: 11, x: 35, y: 80, label: "11" },
        ]
      },
      {
        id: 3,
        letter: "Ο",
        name: "Όμικρον",
        color: "#F59E0B",
        dots: [
          { id: 1, x: 50, y: 25, label: "1" },
          { id: 2, x: 60, y: 30, label: "2" },
          { id: 3, x: 65, y: 40, label: "3" },
          { id: 4, x: 65, y: 60, label: "4" },
          { id: 5, x: 60, y: 70, label: "5" },
          { id: 6, x: 50, y: 75, label: "6" },
          { id: 7, x: 40, y: 70, label: "7" },
          { id: 8, x: 35, y: 60, label: "8" },
          { id: 9, x: 35, y: 40, label: "9" },
          { id: 10, x: 40, y: 30, label: "10" },
        ]
      },
      {
        id: 4,
        letter: "Ε",
        name: "Έψιλον",
        color: "#10B981",
        dots: [
          { id: 1, x: 60, y: 20, label: "1" },
          { id: 2, x: 35, y: 20, label: "2" },
          { id: 3, x: 35, y: 50, label: "3" },
          { id: 4, x: 55, y: 50, label: "4" },
          { id: 5, x: 35, y: 50, label: "5" },
          { id: 6, x: 35, y: 80, label: "6" },
          { id: 7, x: 60, y: 80, label: "7" },
        ]
      },
      {
        id: 5,
        letter: "Τ",
        name: "Ταυ",
        color: "#8B5CF6",
        dots: [
          { id: 1, x: 30, y: 20, label: "1" },
          { id: 2, x: 70, y: 20, label: "2" },
          { id: 3, x: 50, y: 20, label: "3" },
          { id: 4, x: 50, y: 80, label: "4" },
        ]
      },
      {
        id: 6,
        letter: "Ι",
        name: "Ιώτα",
        color: "#EC4899",
        dots: [
          { id: 1, x: 50, y: 20, label: "1" },
          { id: 2, x: 50, y: 80, label: "2" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        letter: "A",
        name: "Letter A",
        color: "#EF4444",
        dots: [
          { id: 1, x: 50, y: 20, label: "1" },
          { id: 2, x: 35, y: 80, label: "2" },
          { id: 3, x: 50, y: 20, label: "3" },
          { id: 4, x: 65, y: 80, label: "4" },
          { id: 5, x: 42, y: 55, label: "5", lift: true },
          { id: 6, x: 58, y: 55, label: "6" },
        ]
      },
      {
        id: 2,
        letter: "B",
        name: "Letter B",
        color: "#3B82F6",
        dots: [
          { id: 1, x: 35, y: 20, label: "1" },
          { id: 2, x: 35, y: 80, label: "2" },
          { id: 3, x: 35, y: 20, label: "3" },
          { id: 4, x: 55, y: 25, label: "4" },
          { id: 5, x: 60, y: 35, label: "5" },
          { id: 6, x: 55, y: 45, label: "6" },
          { id: 7, x: 35, y: 50, label: "7" },
          { id: 8, x: 55, y: 55, label: "8" },
          { id: 9, x: 60, y: 65, label: "9" },
          { id: 10, x: 55, y: 75, label: "10" },
          { id: 11, x: 35, y: 80, label: "11" },
        ]
      },
      {
        id: 3,
        letter: "O",
        name: "Letter O",
        color: "#F59E0B",
        dots: [
          { id: 1, x: 50, y: 25, label: "1" },
          { id: 2, x: 60, y: 30, label: "2" },
          { id: 3, x: 65, y: 40, label: "3" },
          { id: 4, x: 65, y: 60, label: "4" },
          { id: 5, x: 60, y: 70, label: "5" },
          { id: 6, x: 50, y: 75, label: "6" },
          { id: 7, x: 40, y: 70, label: "7" },
          { id: 8, x: 35, y: 60, label: "8" },
          { id: 9, x: 35, y: 40, label: "9" },
          { id: 10, x: 40, y: 30, label: "10" },
        ]
      },
      {
        id: 4,
        letter: "E",
        name: "Letter E",
        color: "#10B981",
        dots: [
          { id: 1, x: 60, y: 20, label: "1" },
          { id: 2, x: 35, y: 20, label: "2" },
          { id: 3, x: 35, y: 50, label: "3" },
          { id: 4, x: 55, y: 50, label: "4" },
          { id: 5, x: 35, y: 50, label: "5" },
          { id: 6, x: 35, y: 80, label: "6" },
          { id: 7, x: 60, y: 80, label: "7" },
        ]
      },
      {
        id: 5,
        letter: "T",
        name: "Letter T",
        color: "#8B5CF6",
        dots: [
          { id: 1, x: 30, y: 20, label: "1" },
          { id: 2, x: 70, y: 20, label: "2" },
          { id: 3, x: 50, y: 20, label: "3" },
          { id: 4, x: 50, y: 80, label: "4" },
        ]
      },
      {
        id: 6,
        letter: "I",
        name: "Letter I",
        color: "#EC4899",
        dots: [
          { id: 1, x: 50, y: 20, label: "1" },
          { id: 2, x: 50, y: 80, label: "2" },
        ]
      }
    ]
  };

  const letters = lettersData[lang];
  const letter = letters[currentLetter];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    popSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    popSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;

    drawCanvas();
  }, [currentLetter, connectedDots]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connected lines
    if (connectedDots.length > 1) {
      ctx.strokeStyle = letter.color;
      ctx.lineWidth = 8;
      ctx.beginPath();

      connectedDots.forEach((dotId, index) => {
        const dot = letter.dots.find(d => d.id === dotId);
        const x = (dot.x / 100) * canvas.width;
        const y = (dot.y / 100) * canvas.height;

        if (index === 0 || dot.lift) {
          // Start new path if it's the first dot or if lift flag is set
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw dots and numbers
    letter.dots.forEach(dot => {
      const x = (dot.x / 100) * canvas.width;
      const y = (dot.y / 100) * canvas.height;
      const isConnected = connectedDots.includes(dot.id);
      const isNext = connectedDots.length + 1 === dot.id;

      // Draw dot
      ctx.fillStyle = isConnected ? letter.color : (isNext ? "#FCD34D" : "#CBD5E1");
      ctx.beginPath();
      ctx.arc(x, y, isNext ? 18 : 14, 0, Math.PI * 2);
      ctx.fill();

      // Draw white border for next dot
      if (isNext) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Draw number
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dot.label, x, y);
    });
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✏️", "📝"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleDotClick = (dot) => {
    if (completed) return;

    const expectedDotId = connectedDots.length + 1;

    if (dot.id === expectedDotId) {
      popSoundRef.current?.play().catch(() => {});

      const newConnected = [...connectedDots, dot.id];
      setConnectedDots(newConnected);

      // Check if completed
      if (newConnected.length === letter.dots.length) {
        setCompleted(true);
        handleLetterComplete();
      }
    }
  };

  const handleLetterComplete = () => {
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Letter Tracing",
      score: newScore,
      total: TARGET_LETTERS,
      index: currentLetter + 1,
    });

    completeQuiz({
      title: "Letter Tracing",
      score: 1,
      total: 1,
    });

    setTimeout(() => {
      if (currentLetter + 1 < TARGET_LETTERS) {
        setCurrentLetter(prev => prev + 1);
        setConnectedDots([]);
        setCompleted(false);
      } else {
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      }
    }, 2000);
  };

  const handleReset = () => {
    setConnectedDots([]);
    setCompleted(false);
    drawCanvas();
  };

  const progressPercent = Math.round(((currentLetter + 1) / TARGET_LETTERS) * 100);
  const dotsProgress = Math.round((connectedDots.length / letter.dots.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Γράμματα με Ιχνηλάτηση" : "Letter Tracing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γράμμα ${currentLetter + 1}/${TARGET_LETTERS}`
                : `Letter ${currentLetter + 1}/${TARGET_LETTERS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            ✏️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: letter.color }}>
          <div className="text-9xl font-bold mb-3" style={{ color: letter.color }}>
            {letter.letter}
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: letter.color }}>
            {letter.name}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el" ? "Σύνδεσε τις κουκκίδες με τη σειρά!" : "Connect the dots in order!"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-2xl p-4 border-4 border-slate-200">
          <canvas
            ref={canvasRef}
            onClick={(e) => {
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / canvas.width) * 100;
              const y = ((e.clientY - rect.top) / canvas.height) * 100;

              letter.dots.forEach(dot => {
                const distance = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
                if (distance < 8) {
                  handleDotClick(dot);
                }
              });
            }}
            className="w-full h-96 cursor-pointer"
          />

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${dotsProgress}%`,
                    backgroundColor: letter.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {connectedDots.length} / {letter.dots.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!completed && connectedDots.length > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-500 text-white text-lg font-bold rounded-full hover:bg-slate-600 transition-colors shadow-lg"
          >
            🔄 {lang === "el" ? "Επανεκκίνηση" : "Reset"}
          </button>
        </div>
      )}

      {completed && (
        <div className="text-center animate-fadeIn">
          <div className="inline-block bg-green-100 rounded-2xl p-6 border-4 border-green-400 shadow-xl">
            <div className="text-8xl font-bold mb-3" style={{ color: letter.color }}>
              {letter.letter}
            </div>
            <p className="text-3xl font-bold text-green-700">
              {lang === "el" ? "🎉 Τέλεια! Έγραψες το " : "🎉 Perfect! You wrote "}{letter.letter}!
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">✏️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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

