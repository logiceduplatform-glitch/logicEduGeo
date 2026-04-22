// src/components/games/DrawTheShadowGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function DrawTheShadowGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [drawnPercentage, setDrawnPercentage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPixels, setDrawnPixels] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#1E293B"); // Default dark color
  const canvasRef = useRef(null);
  const shadowCanvasRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;
  const COMPLETION_THRESHOLD = 95; // 95% coverage to complete - bar reaches 95-100%

  // Color palette for children to choose from - more colors!
  const colorPalette = [
    { color: "#1E293B", name: lang === "el" ? "Μαύρο" : "Black" },
    { color: "#EF4444", name: lang === "el" ? "Κόκκινο" : "Red" },
    { color: "#7F1D1D", name: lang === "el" ? "Σκούρο Κόκκινο" : "Dark Red" },
    { color: "#3B82F6", name: lang === "el" ? "Μπλε" : "Blue" },
    { color: "#1E3A8A", name: lang === "el" ? "Σκούρο Μπλε" : "Dark Blue" },
    { color: "#22C55E", name: lang === "el" ? "Πράσινο" : "Green" },
    { color: "#14532D", name: lang === "el" ? "Σκούρο Πράσινο" : "Dark Green" },
    { color: "#F59E0B", name: lang === "el" ? "Πορτοκαλί" : "Orange" },
    { color: "#78350F", name: lang === "el" ? "Καφέ" : "Brown" },
    { color: "#EAB308", name: lang === "el" ? "Κίτρινο" : "Yellow" },
    { color: "#A855F7", name: lang === "el" ? "Μωβ" : "Purple" },
    { color: "#581C87", name: lang === "el" ? "Σκούρο Μωβ" : "Dark Purple" },
    { color: "#EC4899", name: lang === "el" ? "Ροζ" : "Pink" },
    { color: "#831843", name: lang === "el" ? "Ροζ Σκούρο" : "Dark Pink" },
    { color: "#06B6D4", name: lang === "el" ? "Γαλάζιο" : "Cyan" },
    { color: "#713F12", name: lang === "el" ? "Χρυσό" : "Gold" }
  ];

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🌞",
        objectName: "ήλιου",
        color: "#FCD34D",
        shadowColor: "#92400E"
      },
      {
        id: 2,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🍎",
        objectName: "μήλου",
        color: "#EF4444",
        shadowColor: "#7F1D1D"
      },
      {
        id: 3,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🚗",
        objectName: "αυτοκινήτου",
        color: "#3B82F6",
        shadowColor: "#1E3A8A"
      },
      {
        id: 4,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "⭐",
        objectName: "αστεριού",
        color: "#EAB308",
        shadowColor: "#713F12"
      },
      {
        id: 5,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "❤️",
        objectName: "καρδιάς",
        color: "#EF4444",
        shadowColor: "#7F1D1D"
      },
      {
        id: 6,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🌸",
        objectName: "λουλουδιού",
        color: "#EC4899",
        shadowColor: "#831843"
      },
      {
        id: 7,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🎈",
        objectName: "μπαλονιού",
        color: "#A855F7",
        shadowColor: "#581C87"
      },
      {
        id: 8,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🌲",
        objectName: "δέντρου",
        color: "#22C55E",
        shadowColor: "#14532D"
      },
      {
        id: 9,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🏠",
        objectName: "σπιτιού",
        color: "#F59E0B",
        shadowColor: "#78350F"
      },
      {
        id: 10,
        question: "Ζωγράφισε τη σκιά του αντικειμένου",
        object: "🦋",
        objectName: "πεταλούδας",
        color: "#06B6D4",
        shadowColor: "#164E63"
      }
    ],
    en: [
      {
        id: 1,
        question: "Draw the shadow of the object",
        object: "🌞",
        objectName: "sun",
        color: "#FCD34D",
        shadowColor: "#92400E"
      },
      {
        id: 2,
        question: "Draw the shadow of the object",
        object: "🍎",
        objectName: "apple",
        color: "#EF4444",
        shadowColor: "#7F1D1D"
      },
      {
        id: 3,
        question: "Draw the shadow of the object",
        object: "🚗",
        objectName: "car",
        color: "#3B82F6",
        shadowColor: "#1E3A8A"
      },
      {
        id: 4,
        question: "Draw the shadow of the object",
        object: "⭐",
        objectName: "star",
        color: "#EAB308",
        shadowColor: "#713F12"
      },
      {
        id: 5,
        question: "Draw the shadow of the object",
        object: "❤️",
        objectName: "heart",
        color: "#EF4444",
        shadowColor: "#7F1D1D"
      },
      {
        id: 6,
        question: "Draw the shadow of the object",
        object: "🌸",
        objectName: "flower",
        color: "#EC4899",
        shadowColor: "#831843"
      },
      {
        id: 7,
        question: "Draw the shadow of the object",
        object: "🎈",
        objectName: "balloon",
        color: "#A855F7",
        shadowColor: "#581C87"
      },
      {
        id: 8,
        question: "Draw the shadow of the object",
        object: "🌲",
        objectName: "tree",
        color: "#22C55E",
        shadowColor: "#14532D"
      },
      {
        id: 9,
        question: "Draw the shadow of the object",
        object: "🏠",
        objectName: "house",
        color: "#F59E0B",
        shadowColor: "#78350F"
      },
      {
        id: 10,
        question: "Draw the shadow of the object",
        object: "🦋",
        objectName: "butterfly",
        color: "#06B6D4",
        shadowColor: "#164E63"
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
    setDrawnPixels(new Set());
    setDrawnPercentage(0);
    setShowAnswer(false);
    setIsDrawing(false);

    // Initialize shadow canvas
    if (shadowCanvasRef.current && canvasRef.current) {
      // Get fresh round data based on current lang and round
      const currentRoundData = roundsData[lang][currentRound];

      const shadowCanvas = shadowCanvasRef.current;
      const shadowCtx = shadowCanvas.getContext('2d', { willReadFrequently: true });
      shadowCtx.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);

      // Draw shadow template (invisible but trackable)
      shadowCtx.fillStyle = currentRoundData.shadowColor;
      shadowCtx.font = '180px Arial';
      shadowCtx.textAlign = 'center';
      shadowCtx.textBaseline = 'middle';
      shadowCtx.fillText(currentRoundData.object, shadowCanvas.width / 2, shadowCanvas.height / 2);

      // Clear drawing canvas and show guide outline
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw light guide outline
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.font = '180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(currentRoundData.object, canvas.width / 2, canvas.height / 2);
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

      const text = lang === 'el'
        ? `Ζωγράφισε τη σκιά του ${round.objectName}`
        : `Draw the shadow of the ${round.objectName}`;

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

    // Scale coordinates based on canvas actual size vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const checkCoverage = (x, y) => {
    const shadowCanvas = shadowCanvasRef.current;
    if (!shadowCanvas) return false;

    const shadowCtx = shadowCanvas.getContext('2d', { willReadFrequently: true });

    // Check if this point is on the shadow
    try {
      const imageData = shadowCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
      const alpha = imageData.data[3];
      return alpha > 0;
    } catch (e) {
      return false;
    }
  };

  const draw = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Draw filled circle - ALWAYS draw regardless of coverage check
    ctx.fillStyle = selectedColor; // Use selected color from palette
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2); // Smaller brush radius (8px) for finer control
    ctx.fill();

    // Track coverage - use smaller grid for better accuracy
    const pixelKey = `${Math.floor(x / 5)},${Math.floor(y / 5)}`;

    // Check if on shadow template
    const isOnShadow = checkCoverage(x, y);

    if (isOnShadow && !drawnPixels.has(pixelKey)) {
      const newDrawnPixels = new Set(drawnPixels);
      newDrawnPixels.add(pixelKey);
      setDrawnPixels(newDrawnPixels);

      // Calculate percentage based on realistic estimate (400 blocks for full coverage)
      // This allows the bar to smoothly reach 100% when fully drawn
      const percentage = Math.min(100, (newDrawnPixels.size / 400) * 100);
      setDrawnPercentage(percentage);

      // Check completion
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
      title: "Draw The Shadow Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Draw The Shadow Game",
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
            onComplete({ score: newScore, total: TARGET_ROUNDS });
          }
        }, NEXT_DELAY);
      }
    }, NEXT_DELAY);
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

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
              {lang === "el" ? "Ζωγράφισε τη Σκιά" : "Draw the Shadow"}
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-3">✏️</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      {/* Drawing Area */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-xl border-4 border-purple-400 p-6">
          <div className="flex items-start gap-6">
            {/* Object Display */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-yellow-400">
                <p className="text-center text-lg font-bold text-slate-700 mb-3">
                  {lang === "el" ? "Αντικείμενο:" : "Object:"}
                </p>
                <div className="text-9xl text-center" style={{ filter: 'drop-shadow(5px 5px 3px rgba(0,0,0,0.3))' }}>
                  {round.object}
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1">
              <div className="relative">
                <p className="text-center text-lg font-bold text-slate-700 mb-3">
                  {lang === "el" ? "Ζωγράφισε τη σκιά εδώ:" : "Draw the shadow here:"}
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

                {/* Hidden shadow template canvas */}
                <canvas
                  ref={shadowCanvasRef}
                  width={400}
                  height={300}
                  className="hidden"
                />

                {/* Drawing canvas */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="w-full border-4 border-dashed border-slate-300 rounded-xl cursor-crosshair bg-slate-50"
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
                    ? "Σύρε το δάχτυλο ή το ποντίκι για να ζωγραφίσεις"
                    : "Swipe your finger or mouse to draw"}
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
                          w-12 h-12 rounded-full border-4 transition-all duration-200
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
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Ζωγράφισες τη σκιά του ${round.objectName}!`
                : `🎉 Perfect! You drew the shadow of the ${round.objectName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να ζωγραφίζεις σκιές!" : "Perfect! You know how to draw shadows!"}
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

