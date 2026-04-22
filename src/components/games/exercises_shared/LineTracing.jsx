// src/components/games/exercises_4_5/LineTracing.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function LineTracing({ lang = "el", onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const correctSoundRef = useRef(null);
  const drawSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_LINES = 4; // 4 τύποι γραμμών

  const linesData = {
    el: [
      {
        id: 1,
        type: "straight",
        title: "Ευθεία Γραμμή",
        icon: "📏",
        description: "Σύρε το δάχτυλο από αριστερά προς τα δεξιά",
        color: "#3B82F6"
      },
      {
        id: 2,
        type: "curve",
        title: "Καμπύλη Γραμμή",
        icon: "🌊",
        description: "Ακολούθησε την καμπύλη",
        color: "#10B981"
      },
      {
        id: 3,
        type: "circle",
        title: "Κύκλος",
        icon: "⭕",
        description: "Σχεδίασε έναν κύκλο",
        color: "#EF4444"
      },
      {
        id: 4,
        type: "zigzag",
        title: "Ζιγκ Ζαγκ",
        icon: "⚡",
        description: "Ακολούθησε το ζιγκ ζαγκ",
        color: "#F59E0B"
      }
    ],
    en: [
      {
        id: 1,
        type: "straight",
        title: "Straight Line",
        icon: "📏",
        description: "Drag your finger from left to right",
        color: "#3B82F6"
      },
      {
        id: 2,
        type: "curve",
        title: "Curved Line",
        icon: "🌊",
        description: "Follow the curve",
        color: "#10B981"
      },
      {
        id: 3,
        type: "circle",
        title: "Circle",
        icon: "⭕",
        description: "Draw a circle",
        color: "#EF4444"
      },
      {
        id: 4,
        type: "zigzag",
        title: "Zig Zag",
        icon: "⚡",
        description: "Follow the zig zag",
        color: "#F59E0B"
      }
    ]
  };

  const lines = linesData[lang];
  const line = lines[currentLine];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    drawSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    drawSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 8;
    contextRef.current = context;

    // Draw guide line
    drawGuideLine();
  }, [currentLine]);

  const drawGuideLine = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw guide with dashed line
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.globalAlpha = 0.3;

    ctx.beginPath();

    const centerY = canvas.height / 2;
    const padding = 50;

    switch (line.type) {
      case "straight":
        ctx.moveTo(padding, centerY);
        ctx.lineTo(canvas.width - padding, centerY);
        break;

      case "curve":
        ctx.moveTo(padding, centerY);
        ctx.quadraticCurveTo(canvas.width / 2, centerY - 100, canvas.width - padding, centerY);
        break;

      case "circle":
        const radius = Math.min(canvas.width, canvas.height) / 3;
        ctx.arc(canvas.width / 2, centerY, radius, 0, Math.PI * 2);
        break;

      case "zigzag":
        const segments = 6;
        const segmentWidth = (canvas.width - padding * 2) / segments;
        ctx.moveTo(padding, centerY);
        for (let i = 1; i <= segments; i++) {
          const x = padding + segmentWidth * i;
          const y = i % 2 === 0 ? centerY : centerY + (i % 4 === 1 ? -60 : 60);
          ctx.lineTo(x, y);
        }
        break;
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✏️", "🎨"][Math.floor(Math.random() * 6)],
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
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 8;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    if (!completed) {
      drawSoundRef.current?.play().catch(() => {});
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = contextRef.current;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Update progress based on drawing - slower increment for better control
    const newProgress = Math.min(progress + 0.5, 100);
    setProgress(newProgress);

    if (newProgress >= 100 && !completed) {
      setCompleted(true);
      handleLineComplete();
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

  const handleLineComplete = () => {
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    // Show +1 score popup
    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    // Ενημέρωση progress
    updateProgress({
      title: "Line Tracing",
      score: newScore,
      total: TARGET_LINES,
      index: currentLine + 1,
    });

    completeQuiz({
      title: "Line Tracing",
      score: 1,
      total: 1,
    });

    setTimeout(() => {
      if (currentLine + 1 < TARGET_LINES) {
        setCurrentLine(prev => prev + 1);
        setProgress(0);
        setCompleted(false);
      } else {
        // Τελείωσαν όλες οι γραμμές
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      }
    }, 1500);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideLine();
    setProgress(0);
    setCompleted(false);
  };

  const progressPercent = Math.round(((currentLine + 1) / TARGET_LINES) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ιχνογράφηση Γραμμών" : "Line Tracing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γραμμή ${currentLine + 1}/${TARGET_LINES}`
                : `Line ${currentLine + 1}/${TARGET_LINES}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-red-600">
            ✏️ {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Current Line Info */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: line.color }}>
          <div className="text-7xl mb-3">{line.icon}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: line.color }}>
            {line.title}
          </h2>
          <p className="text-lg text-slate-600">
            {line.description}
          </p>
        </div>
      </div>

      {/* Canvas Drawing Area */}
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

          {/* Drawing Progress */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: line.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {!completed && progress > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-slate-500 text-white text-lg font-bold rounded-full hover:bg-slate-600 transition-colors shadow-lg"
          >
            🔄 {lang === "el" ? "Καθάρισμα" : "Clear"}
          </button>
        </div>
      )}

      {/* Completion Message */}
      {completed && (
        <div className="text-center animate-fadeIn">
          <div className="inline-block bg-green-100 rounded-2xl p-6 border-4 border-green-400 shadow-xl">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el" ? "🎉 Τέλεια! Συνέχισε!" : "🎉 Perfect! Continue!"}
            </p>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
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

