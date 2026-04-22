// src/components/games/exercises_4_5/ColorInBounds.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ColorInBounds({ lang = "el", onComplete }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [coloredArea, setColoredArea] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const correctSoundRef = useRef(null);
  const paintSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_IMAGES = 5; // 5 εικόνες

  const colors = [
    { id: 1, color: "#FF6B6B", name: { el: "Κόκκινο", en: "Red" } },
    { id: 2, color: "#4ECDC4", name: { el: "Τυρκουάζ", en: "Turquoise" } },
    { id: 3, color: "#FFE66D", name: { el: "Κίτρινο", en: "Yellow" } },
    { id: 4, color: "#95E1D3", name: { el: "Πράσινο", en: "Green" } },
    { id: 5, color: "#F38181", name: { el: "Ροζ", en: "Pink" } },
    { id: 6, color: "#AA96DA", name: { el: "Μωβ", en: "Purple" } },
    { id: 7, color: "#FCBAD3", name: { el: "Ανοιχτό Ροζ", en: "Light Pink" } },
    { id: 8, color: "#FFA07A", name: { el: "Πορτοκαλί", en: "Orange" } },
  ];

  const imagesData = {
    el: [
      {
        id: 1,
        name: "Καρδιά",
        emoji: "❤️",
        path: [
          { type: "move", x: 50, y: 40 },
          { type: "bezier", cp1x: 50, cp1y: 30, cp2x: 40, cp2y: 25, x: 35, y: 30 },
          { type: "bezier", cp1x: 30, cp1y: 35, cp2x: 30, cp2y: 45, x: 50, y: 70 },
          { type: "bezier", cp1x: 70, cp1y: 45, cp2x: 70, cp2y: 35, x: 65, y: 30 },
          { type: "bezier", cp1x: 60, cp1y: 25, cp2x: 50, cp2y: 30, x: 50, y: 40 },
        ]
      },
      {
        id: 2,
        name: "Αστέρι",
        emoji: "⭐",
        path: [
          { type: "move", x: 50, y: 20 },
          { type: "line", x: 55, y: 40 },
          { type: "line", x: 75, y: 40 },
          { type: "line", x: 60, y: 55 },
          { type: "line", x: 65, y: 75 },
          { type: "line", x: 50, y: 62 },
          { type: "line", x: 35, y: 75 },
          { type: "line", x: 40, y: 55 },
          { type: "line", x: 25, y: 40 },
          { type: "line", x: 45, y: 40 },
        ]
      },
      {
        id: 3,
        name: "Κύκλος",
        emoji: "⭕",
        path: [
          { type: "arc", x: 50, y: 50, radius: 30 }
        ]
      },
      {
        id: 4,
        name: "Τετράγωνο",
        emoji: "🟦",
        path: [
          { type: "rect", x: 30, y: 30, width: 40, height: 40 }
        ]
      },
      {
        id: 5,
        name: "Τρίγωνο",
        emoji: "🔺",
        path: [
          { type: "move", x: 50, y: 25 },
          { type: "line", x: 75, y: 70 },
          { type: "line", x: 25, y: 70 },
        ]
      }
    ],
    en: [
      {
        id: 1,
        name: "Heart",
        emoji: "❤️",
        path: [
          { type: "move", x: 50, y: 40 },
          { type: "bezier", cp1x: 50, cp1y: 30, cp2x: 40, cp2y: 25, x: 35, y: 30 },
          { type: "bezier", cp1x: 30, cp1y: 35, cp2x: 30, cp2y: 45, x: 50, y: 70 },
          { type: "bezier", cp1x: 70, cp1y: 45, cp2x: 70, cp2y: 35, x: 65, y: 30 },
          { type: "bezier", cp1x: 60, cp1y: 25, cp2x: 50, cp2y: 30, x: 50, y: 40 },
        ]
      },
      {
        id: 2,
        name: "Star",
        emoji: "⭐",
        path: [
          { type: "move", x: 50, y: 20 },
          { type: "line", x: 55, y: 40 },
          { type: "line", x: 75, y: 40 },
          { type: "line", x: 60, y: 55 },
          { type: "line", x: 65, y: 75 },
          { type: "line", x: 50, y: 62 },
          { type: "line", x: 35, y: 75 },
          { type: "line", x: 40, y: 55 },
          { type: "line", x: 25, y: 40 },
          { type: "line", x: 45, y: 40 },
        ]
      },
      {
        id: 3,
        name: "Circle",
        emoji: "⭕",
        path: [
          { type: "arc", x: 50, y: 50, radius: 30 }
        ]
      },
      {
        id: 4,
        name: "Square",
        emoji: "🟦",
        path: [
          { type: "rect", x: 30, y: 30, width: 40, height: 40 }
        ]
      },
      {
        id: 5,
        name: "Triangle",
        emoji: "🔺",
        path: [
          { type: "move", x: 50, y: 25 },
          { type: "line", x: 75, y: 70 },
          { type: "line", x: 25, y: 70 },
        ]
      }
    ]
  };

  const images = imagesData[lang];
  const image = images[currentImage];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    paintSoundRef.current = new Audio("/sounds/pop.mp3");
    correctSoundRef.current.preload = "auto";
    paintSoundRef.current.preload = "auto";
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
    setColoredArea(0);
  }, [currentImage]);

  const drawOutline = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outline
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.fillStyle = "transparent";

    ctx.beginPath();
    image.path.forEach((point, index) => {
      const x = (point.x / 100) * canvas.width;
      const y = (point.y / 100) * canvas.height;

      if (point.type === "move") {
        ctx.moveTo(x, y);
      } else if (point.type === "line") {
        ctx.lineTo(x, y);
      } else if (point.type === "bezier") {
        const cp1x = (point.cp1x / 100) * canvas.width;
        const cp1y = (point.cp1y / 100) * canvas.height;
        const cp2x = (point.cp2x / 100) * canvas.width;
        const cp2y = (point.cp2y / 100) * canvas.height;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      } else if (point.type === "arc") {
        const radius = (point.radius / 100) * Math.min(canvas.width, canvas.height);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      } else if (point.type === "rect") {
        const width = (point.width / 100) * canvas.width;
        const height = (point.height / 100) * canvas.height;
        ctx.rect(x, y, width, height);
      }
    });
    ctx.closePath();
    ctx.stroke();
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎨", "✏️"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    paint(e);
  };

  const paint = (e) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = contextRef.current;

    // Draw
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Update colored area
    const newArea = coloredArea + 1;
    setColoredArea(newArea);

    // Check if should complete (arbitrary threshold) - increased to 600 for more coloring time
    if (newArea >= 600 && newArea % 10 === 0) {
      paintSoundRef.current?.play().catch(() => {});
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
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

  const handleComplete = () => {
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Color In Bounds",
      score: newScore,
      total: TARGET_IMAGES,
      index: currentImage + 1,
    });

    completeQuiz({
      title: "Color In Bounds",
      score: 1,
      total: 1,
    });

    setTimeout(() => {
      if (currentImage + 1 < TARGET_IMAGES) {
        setCurrentImage(prev => prev + 1);
        setColoredArea(0);
      } else {
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
    drawOutline();
    setColoredArea(0);
  };

  const progressPercent = Math.round(((currentImage + 1) / TARGET_IMAGES) * 100);
  const colorProgress = Math.min(Math.round((coloredArea / 600) * 100), 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Χρωμάτισε μέσα στα Όρια" : "Color Within Bounds"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Εικόνα ${currentImage + 1}/${TARGET_IMAGES}`
                : `Image ${currentImage + 1}/${TARGET_IMAGES}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🎨 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-300">
          <div className="text-7xl mb-3">{image.emoji}</div>
          <h2 className="text-3xl font-bold text-orange-700 mb-2">
            {image.name}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el" ? "Χρωμάτισε μέσα στα όρια!" : "Color inside the lines!"}
          </p>
        </div>
      </div>

      {/* Color Palette */}
      <div className="max-w-4xl mx-auto mb-6">
        <h4 className="text-center text-lg font-bold text-slate-700 mb-3">
          {lang === "el" ? "Διάλεξε Χρώμα" : "Choose Color"}
        </h4>
        <div className="flex justify-center gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.color)}
              className={`w-12 h-12 rounded-full border-4 transition-all duration-200 transform hover:scale-110 ${
                selectedColor === color.color ? "border-slate-800 scale-110" : "border-white"
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name[lang]}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-2xl p-4 border-4 border-slate-200">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={paint}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={paint}
            onTouchEnd={stopDrawing}
            className="w-full h-96 cursor-crosshair touch-none"
            style={{ touchAction: "none" }}
          />

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ease-out"
                  style={{ width: `${colorProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {colorProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center flex justify-center gap-4">
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-slate-500 text-white text-lg font-bold rounded-full hover:bg-slate-600 transition-colors shadow-lg"
        >
          🔄 {lang === "el" ? "Καθάρισμα" : "Clear"}
        </button>

        {colorProgress >= 70 && (
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg animate-pulse"
          >
            ✓ {lang === "el" ? "Τέλειωσα!" : "Done!"}
          </button>
        )}
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
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

