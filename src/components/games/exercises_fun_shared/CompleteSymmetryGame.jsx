// src/components/games/CompleteSymmetryGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function CompleteSymmetryGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [drawnPercentage, setDrawnPercentage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPixels, setDrawnPixels] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#1E293B");
  const canvasRef = useRef(null);
  const templateCanvasRef = useRef(null);
  const correctSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;
  const COMPLETION_THRESHOLD = 70; // 70% coverage to complete - faster gameplay, bar can still reach 100%

  const colorPalette = [
    { color: "#1E293B", name: lang === "el" ? "Μαύρο" : "Black" },
    { color: "#EF4444", name: lang === "el" ? "Κόκκινο" : "Red" },
    { color: "#3B82F6", name: lang === "el" ? "Μπλε" : "Blue" },
    { color: "#22C55E", name: lang === "el" ? "Πράσινο" : "Green" },
    { color: "#F59E0B", name: lang === "el" ? "Πορτοκαλί" : "Orange" },
    { color: "#EAB308", name: lang === "el" ? "Κίτρινο" : "Yellow" },
    { color: "#A855F7", name: lang === "el" ? "Μωβ" : "Purple" },
    { color: "#EC4899", name: lang === "el" ? "Ροζ" : "Pink" }
  ];

  const roundsData = {
    el: [
      {
        id: 1,
        objectName: "Καρδιά",
        emoji: "❤️",
        description: "Συμπλήρωσε το δεξί μισό της καρδιάς!",
        color: "#EF4444"
      },
      {
        id: 2,
        objectName: "Πεταλούδα",
        emoji: "🦋",
        description: "Συμπλήρωσε το δεξί μισό της πεταλούδας!",
        color: "#A855F7"
      },
      {
        id: 3,
        objectName: "Αστέρι",
        emoji: "⭐",
        description: "Συμπλήρωσε το δεξί μισό του αστεριού!",
        color: "#EAB308"
      },
      {
        id: 4,
        objectName: "Λουλούδι",
        emoji: "🌸",
        description: "Συμπλήρωσε το δεξί μισό του λουλουδιού!",
        color: "#EC4899"
      },
      {
        id: 5,
        objectName: "Ήλιος",
        emoji: "☀️",
        description: "Συμπλήρωσε το δεξί μισό του ήλιου!",
        color: "#F59E0B"
      },
      {
        id: 6,
        objectName: "Σπίτι",
        emoji: "🏠",
        description: "Συμπλήρωσε το δεξί μισό του σπιτιού!",
        color: "#EF4444"
      },
      {
        id: 7,
        objectName: "Δέντρο",
        emoji: "🌲",
        description: "Συμπλήρωσε το δεξί μισό του δέντρου!",
        color: "#22C55E"
      },
      {
        id: 8,
        objectName: "Αεροπλάνο",
        emoji: "✈️",
        description: "Συμπλήρωσε το δεξί μισό του αεροπλάνου!",
        color: "#3B82F6"
      },
      {
        id: 9,
        objectName: "Σύννεφο",
        emoji: "☁️",
        description: "Συμπλήρωσε το δεξί μισό του σύννεφου!",
        color: "#94A3B8"
      },
      {
        id: 10,
        objectName: "Μπαλόνι",
        emoji: "🎈",
        description: "Συμπλήρωσε το δεξί μισό του μπαλονιού!",
        color: "#EF4444"
      }
    ],
    en: [
      {
        id: 1,
        objectName: "Heart",
        emoji: "❤️",
        description: "Complete the right half of the heart!",
        color: "#EF4444"
      },
      {
        id: 2,
        objectName: "Butterfly",
        emoji: "🦋",
        description: "Complete the right half of the butterfly!",
        color: "#A855F7"
      },
      {
        id: 3,
        objectName: "Star",
        emoji: "⭐",
        description: "Complete the right half of the star!",
        color: "#EAB308"
      },
      {
        id: 4,
        objectName: "Flower",
        emoji: "🌸",
        description: "Complete the right half of the flower!",
        color: "#EC4899"
      },
      {
        id: 5,
        objectName: "Sun",
        emoji: "☀️",
        description: "Complete the right half of the sun!",
        color: "#F59E0B"
      },
      {
        id: 6,
        objectName: "House",
        emoji: "🏠",
        description: "Complete the right half of the house!",
        color: "#EF4444"
      },
      {
        id: 7,
        objectName: "Tree",
        emoji: "🌲",
        description: "Complete the right half of the tree!",
        color: "#22C55E"
      },
      {
        id: 8,
        objectName: "Airplane",
        emoji: "✈️",
        description: "Complete the right half of the airplane!",
        color: "#3B82F6"
      },
      {
        id: 9,
        objectName: "Cloud",
        emoji: "☁️",
        description: "Complete the right half of the cloud!",
        color: "#94A3B8"
      },
      {
        id: 10,
        objectName: "Balloon",
        emoji: "🎈",
        description: "Complete the right half of the balloon!",
        color: "#EF4444"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setDrawnPixels(new Set());
    setDrawnPercentage(0);
    setShowAnswer(false);
    setIsDrawing(false);
    setSelectedColor("#1E293B");

    if (templateCanvasRef.current && canvasRef.current) {
      // Get fresh round data
      const currentRoundData = roundsData[lang][currentRound];

      const templateCanvas = templateCanvasRef.current;
      const templateCtx = templateCanvas.getContext('2d', { willReadFrequently: true });
      templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw left half of emoji on canvas
      ctx.save();
      ctx.font = '180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Clip to show only left half
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width / 2, canvas.height);
      ctx.clip();
      ctx.fillText(currentRoundData.emoji, canvas.width / 2, canvas.height / 2);
      ctx.restore();

      // Draw center line
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw full emoji on template canvas (for tracking)
      templateCtx.font = '180px Arial';
      templateCtx.textAlign = 'center';
      templateCtx.textBaseline = 'middle';
      templateCtx.fillText(currentRoundData.emoji, templateCanvas.width / 2, templateCanvas.height / 2);

      // Draw guide outline on right side
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
      ctx.clip();
      ctx.font = '180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(currentRoundData.emoji, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎨"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = `${round.description}`;

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
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const checkCoverage = (x, y) => {
    const templateCanvas = templateCanvasRef.current;
    if (!templateCanvas) return false;

    const templateCtx = templateCanvas.getContext('2d', { willReadFrequently: true });

    try {
      const imageData = templateCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
      const alpha = imageData.data[3];
      return alpha > 0;
    } catch (e) {
      return false;
    }
  };

  const draw = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only allow drawing on right half
    if (x < canvas.width / 2) return;

    const ctx = canvas.getContext('2d');

    // ALWAYS draw the circle regardless of template check
    ctx.fillStyle = selectedColor;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    const pixelKey = `${Math.floor(x / 5)},${Math.floor(y / 5)}`;
    const isOnTemplate = checkCoverage(x, y);

    if (isOnTemplate && !drawnPixels.has(pixelKey)) {
      const newDrawnPixels = new Set(drawnPixels);
      newDrawnPixels.add(pixelKey);
      setDrawnPixels(newDrawnPixels);

      // Calculate percentage based on 400 blocks for full coverage
      // This allows the bar to reach 100% when fully drawn
      const percentage = Math.min(100, (newDrawnPixels.size / 400) * 100);
      setDrawnPercentage(percentage);

      if (percentage >= COMPLETION_THRESHOLD && !showAnswer) {
        handleComplete();
      }
    }
  };

  const handleMouseDown = (e) => {
    if (showAnswer) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    draw(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || showAnswer) return;
    const { x, y } = getCanvasCoordinates(e);
    draw(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    if (showAnswer) return;
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    draw(x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing || showAnswer) return;
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e);
    draw(x, y);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const handleComplete = () => {
    setShowAnswer(true);
    correctSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Complete Symmetry Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Complete Symmetry Game",
      score: 1,
      total: 1,
    });

    // Show complete emoji
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = '180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(round.emoji, canvas.width / 2, canvas.height / 2);
    }

    setTimeout(() => {
      if (currentRound + 1 < TARGET_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete({ score: newScore, total: TARGET_ROUNDS });
          }
        }, NEXT_DELAY);
      }
    }, NEXT_DELAY);
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Συμπλήρωσε το Συμμετρικό" : "Complete the Symmetry"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎨 {score}
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

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-purple-400">
          <div className="text-7xl mb-3">🪞</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      {/* Drawing Area */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-xl border-4 border-purple-400 p-6">
          <div className="flex items-start gap-6">
            {/* Instructions */}
            <div className="flex-shrink-0 w-48">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 border-4 border-purple-300">
                <p className="text-center text-sm font-bold text-slate-700 mb-3">
                  {lang === "el" ? "Οδηγίες:" : "Instructions:"}
                </p>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>📍 {lang === "el" ? "Δες το αριστερό μισό" : "See the left half"}</p>
                  <p>✏️ {lang === "el" ? "Ζωγράφισε το δεξί" : "Draw the right half"}</p>
                  <p>🪞 {lang === "el" ? "Κάνε το συμμετρικό" : "Make it symmetrical"}</p>
                </div>

                {/* Example */}
                <div className="mt-4 text-center">
                  <p className="text-xs font-bold text-slate-600 mb-2">
                    {lang === "el" ? "Παράδειγμα:" : "Example:"}
                  </p>
                  <div className="text-4xl">
                    {round.emoji}
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1">
              <p className="text-center text-lg font-bold text-slate-700 mb-3">
                {lang === "el" ? "Συμπλήρωσε το δεξί μισό:" : "Complete the right half:"}
              </p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
                      style={{ width: `${drawnPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 min-w-[50px]">
                    {Math.round(drawnPercentage)}%
                  </span>
                </div>
              </div>

              {/* Hidden template canvas */}
              <canvas
                ref={templateCanvasRef}
                width={400}
                height={300}
                className="hidden"
              />

              {/* Drawing canvas */}
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full border-4 border-dashed border-purple-300 rounded-xl cursor-crosshair bg-white"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />

              <p className="text-center text-sm text-slate-500 mt-2">
                {lang === "el"
                  ? "Σύρε στο δεξί μισό για να το συμπληρώσεις"
                  : "Draw on the right half to complete it"}
              </p>

              {/* Color Palette */}
              <div className="mt-4">
                <p className="text-center text-sm font-bold text-slate-700 mb-2">
                  {lang === "el" ? "Διάλεξε Χρώμα:" : "Choose Color:"}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {colorPalette.map((colorOption, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(colorOption.color)}
                      disabled={showAnswer}
                      className={`
                        w-10 h-10 rounded-full border-4 transition-all duration-200
                        ${selectedColor === colorOption.color
                          ? 'border-yellow-400 scale-110 shadow-lg'
                          : 'border-white hover:scale-105'}
                        ${!showAnswer ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                      `}
                      style={{ backgroundColor: colorOption.color }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-1">
                  {colorPalette.find(c => c.color === selectedColor)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Συμπλήρωσες το ${round.objectName}!`
                : `🎉 Perfect! You completed the ${round.objectName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🪞🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να κάνεις συμμετρικά!" : "Perfect! You know how to make symmetry!"}
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

