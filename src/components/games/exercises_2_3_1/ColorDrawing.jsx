// src/components/games/ColorDrawing.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ColorDrawing({ lang = "el", onComplete }) {
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [coloredAreas, setColoredAreas] = useState({});
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const colors = [
    { id: "red", hex: "#FF6B6B", name: { el: "Κόκκινο", en: "Red" } },
    { id: "blue", hex: "#4ECDC4", name: { el: "Μπλε", en: "Blue" } },
    { id: "yellow", hex: "#FFE66D", name: { el: "Κίτρινο", en: "Yellow" } },
    { id: "green", hex: "#95E1D3", name: { el: "Πράσινο", en: "Green" } },
    { id: "orange", hex: "#FFA07A", name: { el: "Πορτοκαλί", en: "Orange" } },
    { id: "purple", hex: "#DDA0DD", name: { el: "Μωβ", en: "Purple" } },
    { id: "pink", hex: "#FFB6C1", name: { el: "Ροζ", en: "Pink" } },
    { id: "brown", hex: "#D2691E", name: { el: "Καφέ", en: "Brown" } },
  ];

  const drawings = [
    {
      id: "flower",
      name: { el: "Λουλούδι", en: "Flower" },
      emoji: "🌸",
      areas: [
        { id: "petal1", label: "1", cx: 150, cy: 80, r: 25 },
        { id: "petal2", label: "2", cx: 200, cy: 100, r: 25 },
        { id: "petal3", label: "3", cx: 200, cy: 160, r: 25 },
        { id: "petal4", label: "4", cx: 150, cy: 180, r: 25 },
        { id: "petal5", label: "5", cx: 100, cy: 160, r: 25 },
        { id: "petal6", label: "6", cx: 100, cy: 100, r: 25 },
        { id: "center", label: "C", cx: 150, cy: 130, r: 30 },
        { id: "stem", label: "S", x: 140, y: 160, width: 20, height: 100, shape: "rect" },
      ],
    },
    {
      id: "house",
      name: { el: "Σπίτι", en: "House" },
      emoji: "🏠",
      areas: [
        { id: "roof", label: "R", points: "150,50 250,120 50,120", shape: "polygon" },
        { id: "wall", label: "W", x: 70, y: 120, width: 160, height: 120, shape: "rect" },
        { id: "door", label: "D", x: 120, y: 170, width: 60, height: 70, shape: "rect" },
        { id: "window1", label: "W1", x: 90, y: 140, width: 40, height: 40, shape: "rect" },
        { id: "window2", label: "W2", x: 170, y: 140, width: 40, height: 40, shape: "rect" },
      ],
    },
    {
      id: "car",
      name: { el: "Αυτοκίνητο", en: "Car" },
      emoji: "🚗",
      areas: [
        { id: "body", label: "B", x: 60, y: 130, width: 180, height: 60, shape: "rect" },
        { id: "roof", label: "R", x: 100, y: 90, width: 100, height: 40, shape: "rect" },
        { id: "wheel1", label: "W1", cx: 100, cy: 200, r: 25 },
        { id: "wheel2", label: "W2", cx: 200, cy: 200, r: 25 },
        { id: "window1", label: "WN1", x: 105, y: 95, width: 40, height: 30, shape: "rect" },
        { id: "window2", label: "WN2", x: 155, y: 95, width: 40, height: 30, shape: "rect" },
      ],
    },
  ];

  const TARGET_DRAWINGS = drawings.length;
  const currentDrawingData = drawings[currentDrawing];
  const totalAreas = currentDrawingData?.areas.length || 0;
  const coloredCount = Object.keys(coloredAreas).length;
  const isCurrentComplete = coloredCount === totalAreas && totalAreas > 0;
  const [hasCompletedCurrent, setHasCompletedCurrent] = useState(false);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
  }, []);

  // Reset completion flag when drawing changes
  useEffect(() => {
    setHasCompletedCurrent(false);
  }, [currentDrawing]);

  useEffect(() => {
    if (isCurrentComplete && !hasCompletedCurrent && !showCelebration) {
      setHasCompletedCurrent(true);

      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + coloredCount;
      setScore(newScore);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Color Drawing",
        score: newScore,
        total: TARGET_DRAWINGS * totalAreas,
        index: (currentDrawing * totalAreas) + coloredCount,
      });

      // Cup of Month - ανά ζωγραφιά
      completeQuiz({
        title: "Color Drawing",
        score: coloredCount,
        total: totalAreas,
      });

      // Έλεγχος αν τελείωσαν όλες οι ζωγραφιές
      if (currentDrawing + 1 >= TARGET_DRAWINGS) {
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      } else {
        // Επόμενη ζωγραφιά
        setTimeout(() => {
          setCurrentDrawing((prev) => prev + 1);
          setColoredAreas({});
        }, 2000);
      }
    }
  }, [isCurrentComplete, hasCompletedCurrent, showCelebration]);

  const handleColorArea = (areaId) => {
    if (coloredAreas[areaId]) return; // Ήδη χρωματισμένο

    correctSoundRef.current?.play().catch(() => {});
    setColoredAreas((prev) => ({
      ...prev,
      [areaId]: selectedColor,
    }));

    // Show +1 score popup
    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎨", "⭐", "✨", "🌟", "🎉", "🖌️"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleReset = () => {
    setColoredAreas({});
  };

  if (!currentDrawingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="mb-8">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                {currentDrawingData.emoji} {currentDrawingData.name[lang]}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {lang === "el" ? "Ζωγραφιά" : "Drawing"} {currentDrawing + 1}/{TARGET_DRAWINGS}
              </p>
            </div>
            <div className="text-2xl font-bold text-pink-600">
              🎨 {coloredCount}/{totalAreas}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${(coloredCount / totalAreas) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {Math.round((coloredCount / totalAreas) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Drawing Canvas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {lang === "el"
                ? "Πάτα τις περιοχές για να τις χρωματίσεις!"
                : "Tap areas to color them!"}
            </h2>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-medium transition-colors"
            >
              🔄 {lang === "el" ? "Ξεκίνα Ξανά" : "Reset"}
            </button>
          </div>

          {/* SVG Drawing */}
          <svg
            viewBox="0 0 300 280"
            className="w-full max-w-md mx-auto border-4 border-slate-200 dark:border-slate-600 rounded-xl"
            style={{ backgroundColor: "#FAFAFA" }}
          >
            {currentDrawingData.areas.map((area) => {
              const fillColor = coloredAreas[area.id] || "#FFFFFF";
              const isColored = !!coloredAreas[area.id];

              if (area.shape === "rect") {
                return (
                  <g key={area.id}>
                    <rect
                      x={area.x}
                      y={area.y}
                      width={area.width}
                      height={area.height}
                      fill={fillColor}
                      stroke="#333"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80 transition-all"
                      onClick={() => handleColorArea(area.id)}
                    />
                    {!isColored && (
                      <text
                        x={area.x + area.width / 2}
                        y={area.y + area.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none text-2xl font-bold fill-slate-400"
                      >
                        {area.label}
                      </text>
                    )}
                  </g>
                );
              } else if (area.shape === "polygon") {
                return (
                  <g key={area.id}>
                    <polygon
                      points={area.points}
                      fill={fillColor}
                      stroke="#333"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80 transition-all"
                      onClick={() => handleColorArea(area.id)}
                    />
                    {!isColored && (
                      <text
                        x={150}
                        y={85}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none text-2xl font-bold fill-slate-400"
                      >
                        {area.label}
                      </text>
                    )}
                  </g>
                );
              } else {
                // Circle
                return (
                  <g key={area.id}>
                    <circle
                      cx={area.cx}
                      cy={area.cy}
                      r={area.r}
                      fill={fillColor}
                      stroke="#333"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80 transition-all"
                      onClick={() => handleColorArea(area.id)}
                    />
                    {!isColored && (
                      <text
                        x={area.cx}
                        y={area.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none text-xl font-bold fill-slate-400"
                      >
                        {area.label}
                      </text>
                    )}
                  </g>
                );
              }
            })}
          </svg>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-center">
            {lang === "el" ? "Διάλεξε Χρώμα" : "Pick a Color"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.hex)}
                className={`
                  p-4 rounded-xl border-4 transition-all duration-200
                  hover:scale-105 active:scale-95
                  ${
                    selectedColor === color.hex
                      ? "border-slate-800 dark:border-white ring-4 ring-slate-300 dark:ring-slate-600 scale-105"
                      : "border-slate-200 dark:border-slate-600"
                  }
                `}
                style={{ backgroundColor: color.hex }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {selectedColor === color.hex ? "✓" : ""}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    {color.name[lang]}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Current Color Display */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
            <p className="text-sm text-slate-600 mb-2">
              {lang === "el" ? "Επιλεγμένο:" : "Selected:"}
            </p>
            <div
              className="w-20 h-20 mx-auto rounded-full border-4 border-slate-300 dark:border-slate-600 shadow-lg"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/90 to-purple-400/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Χρωμάτισες όλες τις ζωγραφιές!"
                : "You colored all the drawings!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

