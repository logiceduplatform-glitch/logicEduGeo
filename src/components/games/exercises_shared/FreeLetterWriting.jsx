// src/components/games/exercises_4_5/FreeLetterWriting.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function FreeLetterWriting({ lang = "el", onComplete }) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingProgress, setDrawingProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const correctSoundRef = useRef(null);
  const drawSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_LETTERS = 6; // 6 γράμματα

  const lettersData = {
    el: [
      {
        id: 1,
        letter: "Α",
        name: "Άλφα",
        color: "#EF4444",
        threshold: 800
      },
      {
        id: 2,
        letter: "Ο",
        name: "Όμικρον",
        color: "#F59E0B",
        threshold: 1000
      },
      {
        id: 3,
        letter: "Ε",
        name: "Έψιλον",
        color: "#10B981",
        threshold: 900
      },
      {
        id: 4,
        letter: "Ι",
        name: "Ιώτα",
        color: "#EC4899",
        threshold: 600
      },
      {
        id: 5,
        letter: "Τ",
        name: "Ταυ",
        color: "#8B5CF6",
        threshold: 700
      },
      {
        id: 6,
        letter: "Υ",
        name: "Ύψιλον",
        color: "#06B6D4",
        threshold: 700
      }
    ],
    en: [
      {
        id: 1,
        letter: "A",
        name: "Letter A",
        color: "#EF4444",
        threshold: 800
      },
      {
        id: 2,
        letter: "O",
        name: "Letter O",
        color: "#F59E0B",
        threshold: 1000
      },
      {
        id: 3,
        letter: "E",
        name: "Letter E",
        color: "#10B981",
        threshold: 900
      },
      {
        id: 4,
        letter: "I",
        name: "Letter I",
        color: "#EC4899",
        threshold: 600
      },
      {
        id: 5,
        letter: "T",
        name: "Letter T",
        color: "#8B5CF6",
        threshold: 700
      },
      {
        id: 6,
        letter: "Y",
        name: "Letter Y",
        color: "#06B6D4",
        threshold: 700
      }
    ]
  };

  const letters = lettersData[lang];
  const letter = letters[currentLetter];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    drawSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    drawSoundRef.current.preload = "auto";
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

    drawOutline();
    setDrawingProgress(0);
    setCompleted(false);
  }, [currentLetter]);

  const drawOutline = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw letter outline with dashed line
    ctx.font = "bold 300px Arial";
    ctx.strokeStyle = letter.color;
    ctx.lineWidth = 8;
    ctx.setLineDash([15, 15]);
    ctx.globalAlpha = 0.3;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(letter.letter, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
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

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);

    const ctx = contextRef.current;
    ctx.strokeStyle = letter.color;
    ctx.lineWidth = 15;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    if (!completed) {
      drawSoundRef.current?.play().catch(() => {});
    }
  };

  const draw = (e) => {
    if (!isDrawing || completed) return;

    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = contextRef.current;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Update progress
    const newProgress = Math.min(drawingProgress + 1, letter.threshold);
    setDrawingProgress(newProgress);

    if (newProgress >= letter.threshold && !completed) {
      setCompleted(true);
      handleLetterComplete();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = contextRef.current;
    ctx.closePath();
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
  };

  const handleLetterComplete = () => {
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Free Letter Writing",
      score: newScore,
      total: TARGET_LETTERS,
      index: currentLetter + 1,
    });

    completeQuiz({
      title: "Free Letter Writing",
      score: 1,
      total: 1,
    });

    setTimeout(() => {
      if (currentLetter + 1 < TARGET_LETTERS) {
        setCurrentLetter(prev => prev + 1);
        setDrawingProgress(0);
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

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOutline();
    setDrawingProgress(0);
    setCompleted(false);
  };

  const progressPercent = Math.round(((currentLetter + 1) / TARGET_LETTERS) * 100);
  const letterProgress = Math.round((drawingProgress / letter.threshold) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ελεύθερη Γραφή Γραμμάτων" : "Free Letter Writing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γράμμα ${currentLetter + 1}/${TARGET_LETTERS}`
                : `Letter ${currentLetter + 1}/${TARGET_LETTERS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-rose-600">
            ✏️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-purple-500 transition-all duration-500 ease-out"
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
            {lang === "el" ? "Γράψε το γράμμα ακολουθώντας το περίγραμμα!" : "Write the letter following the outline!"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-2xl p-4 border-4 border-slate-200">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-96 cursor-crosshair touch-none"
            style={{ touchAction: "none" }}
          />

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${letterProgress}%`,
                    backgroundColor: letter.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {letterProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {!completed && drawingProgress > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-slate-500 text-white text-lg font-bold rounded-full hover:bg-slate-600 transition-colors shadow-lg"
          >
            🔄 {lang === "el" ? "Καθάρισμα" : "Clear"}
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
        <div className="absolute inset-0 bg-gradient-to-br from-rose-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
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

