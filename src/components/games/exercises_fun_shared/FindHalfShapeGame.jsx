// src/components/games/FindHalfShapeGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FindHalfShapeGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
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
        question: "Βρες το σωστό δεξί μισό",
        shape: "square",
        correctColor: "#EF4444",
        correctAnswer: "#EF4444",
        options: [
          { color: "#EF4444", name: "Κόκκινο" },
          { color: "#3B82F6", name: "Μπλε" },
          { color: "#22C55E", name: "Πράσινο" }
        ],
        shapeName: "τετράγωνο"
      },
      {
        id: 2,
        question: "Βρες το σωστό δεξί μισό",
        shape: "circle",
        correctColor: "#3B82F6",
        correctAnswer: "#3B82F6",
        options: [
          { color: "#EF4444", name: "Κόκκινο" },
          { color: "#3B82F6", name: "Μπλε" },
          { color: "#22C55E", name: "Πράσινο" }
        ],
        shapeName: "κύκλο"
      },
      {
        id: 3,
        question: "Βρες το σωστό δεξί μισό",
        shape: "heart",
        correctColor: "#EC4899",
        correctAnswer: "#EC4899",
        options: [
          { color: "#EC4899", name: "Ροζ" },
          { color: "#EAB308", name: "Κίτρινο" },
          { color: "#A855F7", name: "Μωβ" }
        ],
        shapeName: "καρδιά"
      },
      {
        id: 4,
        question: "Βρες το σωστό δεξί μισό",
        shape: "triangle",
        correctColor: "#22C55E",
        correctAnswer: "#22C55E",
        options: [
          { color: "#EF4444", name: "Κόκκινο" },
          { color: "#22C55E", name: "Πράσινο" },
          { color: "#3B82F6", name: "Μπλε" }
        ],
        shapeName: "τρίγωνο"
      },
      {
        id: 5,
        question: "Βρες το σωστό δεξί μισό",
        shape: "star",
        correctColor: "#EAB308",
        correctAnswer: "#EAB308",
        options: [
          { color: "#EAB308", name: "Κίτρινο" },
          { color: "#EC4899", name: "Ροζ" },
          { color: "#06B6D4", name: "Γαλάζιο" }
        ],
        shapeName: "αστέρι"
      },
      {
        id: 6,
        question: "Βρες το σωστό δεξί μισό",
        shape: "square",
        correctColor: "#F97316",
        correctAnswer: "#F97316",
        options: [
          { color: "#F97316", name: "Πορτοκαλί" },
          { color: "#A855F7", name: "Μωβ" },
          { color: "#14B8A6", name: "Τιρκουάζ" }
        ],
        shapeName: "τετράγωνο"
      },
      {
        id: 7,
        question: "Βρες το σωστό δεξί μισό",
        shape: "circle",
        correctColor: "#A855F7",
        correctAnswer: "#A855F7",
        options: [
          { color: "#EF4444", name: "Κόκκινο" },
          { color: "#A855F7", name: "Μωβ" },
          { color: "#22C55E", name: "Πράσινο" }
        ],
        shapeName: "κύκλο"
      },
      {
        id: 8,
        question: "Βρες το σωστό δεξί μισό",
        shape: "heart",
        correctColor: "#06B6D4",
        correctAnswer: "#06B6D4",
        options: [
          { color: "#06B6D4", name: "Γαλάζιο" },
          { color: "#EAB308", name: "Κίτρινο" },
          { color: "#EF4444", name: "Κόκκινο" }
        ],
        shapeName: "καρδιά"
      },
      {
        id: 9,
        question: "Βρες το σωστό δεξί μισό",
        shape: "triangle",
        correctColor: "#14B8A6",
        correctAnswer: "#14B8A6",
        options: [
          { color: "#EC4899", name: "Ροζ" },
          { color: "#14B8A6", name: "Τιρκουάζ" },
          { color: "#F97316", name: "Πορτοκαλί" }
        ],
        shapeName: "τρίγωνο"
      },
      {
        id: 10,
        question: "Βρες το σωστό δεξί μισό",
        shape: "star",
        correctColor: "#F59E0B",
        correctAnswer: "#F59E0B",
        options: [
          { color: "#3B82F6", name: "Μπλε" },
          { color: "#F59E0B", name: "Χρυσό" },
          { color: "#22C55E", name: "Πράσινο" }
        ],
        shapeName: "αστέρι"
      }
    ],
    en: [
      {
        id: 1,
        question: "Find the correct right half",
        shape: "square",
        correctColor: "#EF4444",
        correctAnswer: "#EF4444",
        options: [
          { color: "#EF4444", name: "Red" },
          { color: "#3B82F6", name: "Blue" },
          { color: "#22C55E", name: "Green" }
        ],
        shapeName: "square"
      },
      {
        id: 2,
        question: "Find the correct right half",
        shape: "circle",
        correctColor: "#3B82F6",
        correctAnswer: "#3B82F6",
        options: [
          { color: "#EF4444", name: "Red" },
          { color: "#3B82F6", name: "Blue" },
          { color: "#22C55E", name: "Green" }
        ],
        shapeName: "circle"
      },
      {
        id: 3,
        question: "Find the correct right half",
        shape: "heart",
        correctColor: "#EC4899",
        correctAnswer: "#EC4899",
        options: [
          { color: "#EC4899", name: "Pink" },
          { color: "#EAB308", name: "Yellow" },
          { color: "#A855F7", name: "Purple" }
        ],
        shapeName: "heart"
      },
      {
        id: 4,
        question: "Find the correct right half",
        shape: "triangle",
        correctColor: "#22C55E",
        correctAnswer: "#22C55E",
        options: [
          { color: "#EF4444", name: "Red" },
          { color: "#22C55E", name: "Green" },
          { color: "#3B82F6", name: "Blue" }
        ],
        shapeName: "triangle"
      },
      {
        id: 5,
        question: "Find the correct right half",
        shape: "star",
        correctColor: "#EAB308",
        correctAnswer: "#EAB308",
        options: [
          { color: "#EAB308", name: "Yellow" },
          { color: "#EC4899", name: "Pink" },
          { color: "#06B6D4", name: "Cyan" }
        ],
        shapeName: "star"
      },
      {
        id: 6,
        question: "Find the correct right half",
        shape: "square",
        correctColor: "#F97316",
        correctAnswer: "#F97316",
        options: [
          { color: "#F97316", name: "Orange" },
          { color: "#A855F7", name: "Purple" },
          { color: "#14B8A6", name: "Teal" }
        ],
        shapeName: "square"
      },
      {
        id: 7,
        question: "Find the correct right half",
        shape: "circle",
        correctColor: "#A855F7",
        correctAnswer: "#A855F7",
        options: [
          { color: "#EF4444", name: "Red" },
          { color: "#A855F7", name: "Purple" },
          { color: "#22C55E", name: "Green" }
        ],
        shapeName: "circle"
      },
      {
        id: 8,
        question: "Find the correct right half",
        shape: "heart",
        correctColor: "#06B6D4",
        correctAnswer: "#06B6D4",
        options: [
          { color: "#06B6D4", name: "Cyan" },
          { color: "#EAB308", name: "Yellow" },
          { color: "#EF4444", name: "Red" }
        ],
        shapeName: "heart"
      },
      {
        id: 9,
        question: "Find the correct right half",
        shape: "triangle",
        correctColor: "#14B8A6",
        correctAnswer: "#14B8A6",
        options: [
          { color: "#EC4899", name: "Pink" },
          { color: "#14B8A6", name: "Teal" },
          { color: "#F97316", name: "Orange" }
        ],
        shapeName: "triangle"
      },
      {
        id: 10,
        question: "Find the correct right half",
        shape: "star",
        correctColor: "#F59E0B",
        correctAnswer: "#F59E0B",
        options: [
          { color: "#3B82F6", name: "Blue" },
          { color: "#F59E0B", name: "Gold" },
          { color: "#22C55E", name: "Green" }
        ],
        shapeName: "star"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  // Helper function to render shape
  const renderShape = (shapeType, color, half = "full", size = 120) => {
    const commonStyle = {
      fill: color,
      stroke: "#1e293b",
      strokeWidth: 3
    };

    const halfSize = size / 2;

    switch (shapeType) {
      case "square":
        if (half === "left") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <rect x="0" y="0" width={halfSize} height={size} {...commonStyle} />
            </svg>
          );
        } else if (half === "right") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <rect x="0" y="0" width={halfSize} height={size} {...commonStyle} />
            </svg>
          );
        }
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect x="5" y="5" width={size - 10} height={size - 10} {...commonStyle} />
          </svg>
        );

      case "circle":
        if (half === "left") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <path d={`M 0 ${halfSize} A ${halfSize} ${halfSize} 0 0 1 0 0 L ${halfSize} 0 L ${halfSize} ${size} L 0 ${size} Z`} {...commonStyle} />
            </svg>
          );
        } else if (half === "right") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <path d={`M 0 0 A ${halfSize} ${halfSize} 0 0 1 0 ${size} L 0 ${size} L 0 0 Z`} {...commonStyle} />
            </svg>
          );
        }
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={halfSize} cy={halfSize} r={halfSize - 5} {...commonStyle} />
          </svg>
        );

      case "triangle":
        if (half === "left") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <polygon points={`${halfSize},10 0,${size - 10} ${halfSize},${size - 10}`} {...commonStyle} />
            </svg>
          );
        } else if (half === "right") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <polygon points={`0,10 ${halfSize},${size - 10} 0,${size - 10}`} {...commonStyle} />
            </svg>
          );
        }
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon points={`${halfSize},10 10,${size - 10} ${size - 10},${size - 10}`} {...commonStyle} />
          </svg>
        );

      case "heart":
        const heartPath = half === "left"
          ? `M ${halfSize},30 L ${halfSize},20 C ${halfSize},10 ${halfSize * 0.7},5 ${halfSize * 0.5},5 C ${halfSize * 0.3},5 0,10 0,25 C 0,40 ${halfSize * 0.3},${size * 0.5} ${halfSize},${size - 10}`
          : half === "right"
          ? `M 0,30 L 0,20 C 0,10 ${halfSize * 0.3},5 ${halfSize * 0.5},5 C ${halfSize * 0.7},5 ${halfSize},10 ${halfSize},25 C ${halfSize},40 ${halfSize * 0.7},${size * 0.5} 0,${size - 10}`
          : `M ${halfSize},${size - 10} C 10,${size * 0.6} 10,40 10,25 C 10,10 20,5 ${halfSize * 0.7},5 C ${halfSize},5 ${halfSize},15 ${halfSize},20 C ${halfSize},15 ${halfSize},5 ${size * 0.7},5 C ${size - 20},5 ${size - 10},10 ${size - 10},25 C ${size - 10},40 ${size - 10},${size * 0.6} ${halfSize},${size - 10}`;

        return (
          <svg width={half === "full" ? size : halfSize} height={size} viewBox={`0 0 ${half === "full" ? size : halfSize} ${size}`}>
            <path d={heartPath} {...commonStyle} />
          </svg>
        );

      case "star":
        const starPoints = (cx, cy, spikes, outerRadius, innerRadius) => {
          let points = [];
          const step = Math.PI / spikes;
          for (let i = 0; i < 2 * spikes; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * step - Math.PI / 2;
            points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
          }
          return points.join(' ');
        };

        if (half === "left") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <defs>
                <clipPath id="leftClip">
                  <rect x="0" y="0" width={halfSize} height={size} />
                </clipPath>
              </defs>
              <polygon points={starPoints(halfSize, halfSize, 5, halfSize - 10, (halfSize - 10) * 0.4)} {...commonStyle} clipPath="url(#leftClip)" />
            </svg>
          );
        } else if (half === "right") {
          return (
            <svg width={halfSize} height={size} viewBox={`0 0 ${halfSize} ${size}`}>
              <defs>
                <clipPath id="rightClip">
                  <rect x="0" y="0" width={halfSize} height={size} />
                </clipPath>
              </defs>
              <polygon points={starPoints(0, halfSize, 5, halfSize - 10, (halfSize - 10) * 0.4)} {...commonStyle} clipPath="url(#rightClip)" />
            </svg>
          );
        }
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon points={starPoints(halfSize, halfSize, 5, halfSize - 10, (halfSize - 10) * 0.4)} {...commonStyle} />
          </svg>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎯"][Math.floor(Math.random() * 6)],
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
        ? `Βρες το σωστό δεξί μισό του ${round.shapeName}`
        : `Find the correct right half of the ${round.shapeName}`;

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
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer.color === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Find Half Shape Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Find Half Shape Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
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
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες το Μισό Σχήμα" : "Find the Half Shape"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🔷 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Left Half Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <p className="text-2xl font-bold text-center text-slate-800 mb-6">
            {lang === "el" ? "Αριστερό Μισό:" : "Left Half:"}
          </p>

          <div className="flex justify-center items-center gap-2">
            {showAnswer && selectedAnswer?.color === round.correctAnswer ? (
              // Show complete shape when correct
              <div className="inline-block animate-fadeIn">
                {renderShape(round.shape, round.correctColor, "full", 160)}
              </div>
            ) : (
              <>
                {/* Left Half */}
                <div className="inline-block">
                  {renderShape(round.shape, round.correctColor, "left", 160)}
                </div>

                {/* Divider line */}
                <div className="w-1 h-40 bg-slate-700 rounded" />

                {/* Right Half - Question mark or selected wrong answer */}
                <div className="inline-flex items-center justify-center" style={{ width: '80px', height: '160px' }}>
                  {showAnswer && selectedAnswer && selectedAnswer.color !== round.correctAnswer ? (
                    // Show wrong selection
                    <div className="opacity-50">
                      {renderShape(round.shape, selectedAnswer.color, "right", 160)}
                    </div>
                  ) : (
                    // Show question mark
                    <div className="text-9xl text-slate-300 font-bold opacity-50">
                      ?
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-5xl mx-auto mb-8">
        <p className="text-2xl font-bold text-center text-slate-800 mb-6">
          {lang === "el" ? "Διάλεξε το σωστό δεξί μισό:" : "Choose the correct right half:"}
        </p>

        <div className="grid grid-cols-3 gap-6">
          {round.options.map((option, index) => {
            const isSelected = selectedAnswer?.color === option.color;
            const isCorrect = showAnswer && option.color === round.correctAnswer;
            const isWrong = showAnswer && isSelected && option.color !== round.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-cyan-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option !== round.correctAnswer ? "opacity-50" : ""}
                `}
              >
                <div className="flex justify-center items-center">
                  {/* Show only right half of the shape */}
                  {renderShape(round.shape, option.color, "right", 140)}

                  {isCorrect && (
                    <div className="text-7xl animate-bounce absolute -top-4 -right-4">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-7xl absolute -top-4 -right-4">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer?.color === round.correctAnswer ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700 mb-4">
                {lang === "el"
                  ? `🎉 Σωστά! Το ${round.shapeName} είναι πλήρες!`
                  : `🎉 Correct! The ${round.shapeName} is complete!`}
              </p>
              {/* Show complete shape */}
              <div className="flex justify-center">
                {renderShape(round.shape, round.correctColor, "full", 140)}
              </div>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? "Προσπάθησε ξανά! Βρες το ίδιο σχήμα."
                  : "Try again! Find the same shape."}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-300/80 to-cyan-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔷🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βρίσκεις το μισό σχήμα!" : "Perfect! You know how to find the half shape!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

