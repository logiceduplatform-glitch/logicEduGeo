// src/components/games/PaintSameObjectsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function PaintSameObjectsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [paintedItems, setPaintedItems] = useState(new Set());
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
        question: "Βάψε όλα τα αστέρια",
        targetEmoji: "⭐",
        targetName: "αστέρια",
        paintColor: "#FFD700",
        items: [
          { id: 1, emoji: "⭐", x: 15, y: 15 },
          { id: 2, emoji: "🌙", x: 45, y: 20 },
          { id: 3, emoji: "⭐", x: 70, y: 15 },
          { id: 4, emoji: "☀️", x: 30, y: 50 },
          { id: 5, emoji: "⭐", x: 55, y: 45 },
          { id: 6, emoji: "🌙", x: 80, y: 55 },
          { id: 7, emoji: "⭐", x: 25, y: 75 },
          { id: 8, emoji: "☀️", x: 60, y: 80 }
        ]
      },
      {
        id: 2,
        question: "Βάψε όλα τα μήλα",
        targetEmoji: "🍎",
        targetName: "μήλα",
        paintColor: "#DC2626",
        items: [
          { id: 1, emoji: "🍎", x: 20, y: 20 },
          { id: 2, emoji: "🍌", x: 50, y: 15 },
          { id: 3, emoji: "🍎", x: 75, y: 25 },
          { id: 4, emoji: "🍊", x: 35, y: 50 },
          { id: 5, emoji: "🍎", x: 60, y: 55 },
          { id: 6, emoji: "🍌", x: 15, y: 70 },
          { id: 7, emoji: "🍎", x: 80, y: 75 }
        ]
      },
      {
        id: 3,
        question: "Βάψε όλες τις καρδιές",
        targetEmoji: "❤️",
        targetName: "καρδιές",
        paintColor: "#EF4444",
        items: [
          { id: 1, emoji: "❤️", x: 18, y: 18 },
          { id: 2, emoji: "💙", x: 45, y: 22 },
          { id: 3, emoji: "❤️", x: 72, y: 18 },
          { id: 4, emoji: "💚", x: 28, y: 48 },
          { id: 5, emoji: "❤️", x: 58, y: 52 },
          { id: 6, emoji: "💙", x: 82, y: 48 },
          { id: 7, emoji: "❤️", x: 22, y: 78 },
          { id: 8, emoji: "💚", x: 65, y: 75 }
        ]
      },
      {
        id: 4,
        question: "Βάψε όλα τα αυτοκίνητα",
        targetEmoji: "🚗",
        targetName: "αυτοκίνητα",
        paintColor: "#3B82F6",
        items: [
          { id: 1, emoji: "🚗", x: 15, y: 20 },
          { id: 2, emoji: "🚌", x: 48, y: 18 },
          { id: 3, emoji: "🚗", x: 75, y: 22 },
          { id: 4, emoji: "✈️", x: 32, y: 52 },
          { id: 5, emoji: "🚗", x: 62, y: 48 },
          { id: 6, emoji: "🚌", x: 20, y: 75 },
          { id: 7, emoji: "🚗", x: 78, y: 72 }
        ]
      },
      {
        id: 5,
        question: "Βάψε όλα τα λουλούδια",
        targetEmoji: "🌸",
        targetName: "λουλούδια",
        paintColor: "#EC4899",
        items: [
          { id: 1, emoji: "🌸", x: 22, y: 15 },
          { id: 2, emoji: "🌻", x: 52, y: 20 },
          { id: 3, emoji: "🌸", x: 78, y: 18 },
          { id: 4, emoji: "🌺", x: 35, y: 48 },
          { id: 5, emoji: "🌸", x: 65, y: 52 },
          { id: 6, emoji: "🌻", x: 18, y: 72 },
          { id: 7, emoji: "🌸", x: 82, y: 78 },
          { id: 8, emoji: "🌺", x: 48, y: 75 }
        ]
      },
      {
        id: 6,
        question: "Βάψε όλες τις μπάλες",
        targetEmoji: "⚽",
        targetName: "μπάλες",
        paintColor: "#10B981",
        items: [
          { id: 1, emoji: "⚽", x: 25, y: 20 },
          { id: 2, emoji: "🏀", x: 55, y: 18 },
          { id: 3, emoji: "⚽", x: 80, y: 25 },
          { id: 4, emoji: "🎾", x: 30, y: 50 },
          { id: 5, emoji: "⚽", x: 65, y: 55 },
          { id: 6, emoji: "🏀", x: 15, y: 75 },
          { id: 7, emoji: "⚽", x: 75, y: 72 }
        ]
      },
      {
        id: 7,
        question: "Βάψε όλα τα δέντρα",
        targetEmoji: "🌲",
        targetName: "δέντρα",
        paintColor: "#22C55E",
        items: [
          { id: 1, emoji: "🌲", x: 20, y: 22 },
          { id: 2, emoji: "🌳", x: 50, y: 18 },
          { id: 3, emoji: "🌲", x: 75, y: 20 },
          { id: 4, emoji: "🌴", x: 35, y: 52 },
          { id: 5, emoji: "🌲", x: 60, y: 48 },
          { id: 6, emoji: "🌳", x: 22, y: 78 },
          { id: 7, emoji: "🌲", x: 80, y: 75 },
          { id: 8, emoji: "🌴", x: 48, y: 72 }
        ]
      },
      {
        id: 8,
        question: "Βάψε όλα τα σπίτια",
        targetEmoji: "🏠",
        targetName: "σπίτια",
        paintColor: "#F59E0B",
        items: [
          { id: 1, emoji: "🏠", x: 18, y: 25 },
          { id: 2, emoji: "🏢", x: 48, y: 20 },
          { id: 3, emoji: "🏠", x: 78, y: 22 },
          { id: 4, emoji: "🏰", x: 32, y: 55 },
          { id: 5, emoji: "🏠", x: 62, y: 50 },
          { id: 6, emoji: "🏢", x: 25, y: 78 },
          { id: 7, emoji: "🏠", x: 72, y: 75 }
        ]
      },
      {
        id: 9,
        question: "Βάψε όλα τα μπαλόνια",
        targetEmoji: "🎈",
        targetName: "μπαλόνια",
        paintColor: "#A855F7",
        items: [
          { id: 1, emoji: "🎈", x: 22, y: 18 },
          { id: 2, emoji: "🎁", x: 52, y: 22 },
          { id: 3, emoji: "🎈", x: 75, y: 18 },
          { id: 4, emoji: "🎉", x: 35, y: 50 },
          { id: 5, emoji: "🎈", x: 65, y: 48 },
          { id: 6, emoji: "🎁", x: 18, y: 75 },
          { id: 7, emoji: "🎈", x: 80, y: 78 },
          { id: 8, emoji: "🎉", x: 48, y: 72 }
        ]
      },
      {
        id: 10,
        question: "Βάψε όλους τους κύκλους",
        targetEmoji: "🔵",
        targetName: "κύκλους",
        paintColor: "#3B82F6",
        items: [
          { id: 1, emoji: "🔵", x: 25, y: 22 },
          { id: 2, emoji: "🔴", x: 55, y: 18 },
          { id: 3, emoji: "🔵", x: 78, y: 25 },
          { id: 4, emoji: "🟢", x: 30, y: 52 },
          { id: 5, emoji: "🔵", x: 60, y: 48 },
          { id: 6, emoji: "🔴", x: 20, y: 78 },
          { id: 7, emoji: "🔵", x: 75, y: 75 }
        ]
      }
    ],
    en: [
      {
        id: 1,
        question: "Paint all the stars",
        targetEmoji: "⭐",
        targetName: "stars",
        paintColor: "#FFD700",
        items: [
          { id: 1, emoji: "⭐", x: 15, y: 15 },
          { id: 2, emoji: "🌙", x: 45, y: 20 },
          { id: 3, emoji: "⭐", x: 70, y: 15 },
          { id: 4, emoji: "☀️", x: 30, y: 50 },
          { id: 5, emoji: "⭐", x: 55, y: 45 },
          { id: 6, emoji: "🌙", x: 80, y: 55 },
          { id: 7, emoji: "⭐", x: 25, y: 75 },
          { id: 8, emoji: "☀️", x: 60, y: 80 }
        ]
      },
      {
        id: 2,
        question: "Paint all the apples",
        targetEmoji: "🍎",
        targetName: "apples",
        paintColor: "#DC2626",
        items: [
          { id: 1, emoji: "🍎", x: 20, y: 20 },
          { id: 2, emoji: "🍌", x: 50, y: 15 },
          { id: 3, emoji: "🍎", x: 75, y: 25 },
          { id: 4, emoji: "🍊", x: 35, y: 50 },
          { id: 5, emoji: "🍎", x: 60, y: 55 },
          { id: 6, emoji: "🍌", x: 15, y: 70 },
          { id: 7, emoji: "🍎", x: 80, y: 75 }
        ]
      },
      {
        id: 3,
        question: "Paint all the hearts",
        targetEmoji: "❤️",
        targetName: "hearts",
        paintColor: "#EF4444",
        items: [
          { id: 1, emoji: "❤️", x: 18, y: 18 },
          { id: 2, emoji: "💙", x: 45, y: 22 },
          { id: 3, emoji: "❤️", x: 72, y: 18 },
          { id: 4, emoji: "💚", x: 28, y: 48 },
          { id: 5, emoji: "❤️", x: 58, y: 52 },
          { id: 6, emoji: "💙", x: 82, y: 48 },
          { id: 7, emoji: "❤️", x: 22, y: 78 },
          { id: 8, emoji: "💚", x: 65, y: 75 }
        ]
      },
      {
        id: 4,
        question: "Paint all the cars",
        targetEmoji: "🚗",
        targetName: "cars",
        paintColor: "#3B82F6",
        items: [
          { id: 1, emoji: "🚗", x: 15, y: 20 },
          { id: 2, emoji: "🚌", x: 48, y: 18 },
          { id: 3, emoji: "🚗", x: 75, y: 22 },
          { id: 4, emoji: "✈️", x: 32, y: 52 },
          { id: 5, emoji: "🚗", x: 62, y: 48 },
          { id: 6, emoji: "🚌", x: 20, y: 75 },
          { id: 7, emoji: "🚗", x: 78, y: 72 }
        ]
      },
      {
        id: 5,
        question: "Paint all the flowers",
        targetEmoji: "🌸",
        targetName: "flowers",
        paintColor: "#EC4899",
        items: [
          { id: 1, emoji: "🌸", x: 22, y: 15 },
          { id: 2, emoji: "🌻", x: 52, y: 20 },
          { id: 3, emoji: "🌸", x: 78, y: 18 },
          { id: 4, emoji: "🌺", x: 35, y: 48 },
          { id: 5, emoji: "🌸", x: 65, y: 52 },
          { id: 6, emoji: "🌻", x: 18, y: 72 },
          { id: 7, emoji: "🌸", x: 82, y: 78 },
          { id: 8, emoji: "🌺", x: 48, y: 75 }
        ]
      },
      {
        id: 6,
        question: "Paint all the balls",
        targetEmoji: "⚽",
        targetName: "balls",
        paintColor: "#10B981",
        items: [
          { id: 1, emoji: "⚽", x: 25, y: 20 },
          { id: 2, emoji: "🏀", x: 55, y: 18 },
          { id: 3, emoji: "⚽", x: 80, y: 25 },
          { id: 4, emoji: "🎾", x: 30, y: 50 },
          { id: 5, emoji: "⚽", x: 65, y: 55 },
          { id: 6, emoji: "🏀", x: 15, y: 75 },
          { id: 7, emoji: "⚽", x: 75, y: 72 }
        ]
      },
      {
        id: 7,
        question: "Paint all the trees",
        targetEmoji: "🌲",
        targetName: "trees",
        paintColor: "#22C55E",
        items: [
          { id: 1, emoji: "🌲", x: 20, y: 22 },
          { id: 2, emoji: "🌳", x: 50, y: 18 },
          { id: 3, emoji: "🌲", x: 75, y: 20 },
          { id: 4, emoji: "🌴", x: 35, y: 52 },
          { id: 5, emoji: "🌲", x: 60, y: 48 },
          { id: 6, emoji: "🌳", x: 22, y: 78 },
          { id: 7, emoji: "🌲", x: 80, y: 75 },
          { id: 8, emoji: "🌴", x: 48, y: 72 }
        ]
      },
      {
        id: 8,
        question: "Paint all the houses",
        targetEmoji: "🏠",
        targetName: "houses",
        paintColor: "#F59E0B",
        items: [
          { id: 1, emoji: "🏠", x: 18, y: 25 },
          { id: 2, emoji: "🏢", x: 48, y: 20 },
          { id: 3, emoji: "🏠", x: 78, y: 22 },
          { id: 4, emoji: "🏰", x: 32, y: 55 },
          { id: 5, emoji: "🏠", x: 62, y: 50 },
          { id: 6, emoji: "🏢", x: 25, y: 78 },
          { id: 7, emoji: "🏠", x: 72, y: 75 }
        ]
      },
      {
        id: 9,
        question: "Paint all the balloons",
        targetEmoji: "🎈",
        targetName: "balloons",
        paintColor: "#A855F7",
        items: [
          { id: 1, emoji: "🎈", x: 22, y: 18 },
          { id: 2, emoji: "🎁", x: 52, y: 22 },
          { id: 3, emoji: "🎈", x: 75, y: 18 },
          { id: 4, emoji: "🎉", x: 35, y: 50 },
          { id: 5, emoji: "🎈", x: 65, y: 48 },
          { id: 6, emoji: "🎁", x: 18, y: 75 },
          { id: 7, emoji: "🎈", x: 80, y: 78 },
          { id: 8, emoji: "🎉", x: 48, y: 72 }
        ]
      },
      {
        id: 10,
        question: "Paint all the circles",
        targetEmoji: "🔵",
        targetName: "circles",
        paintColor: "#3B82F6",
        items: [
          { id: 1, emoji: "🔵", x: 25, y: 22 },
          { id: 2, emoji: "🔴", x: 55, y: 18 },
          { id: 3, emoji: "🔵", x: 78, y: 25 },
          { id: 4, emoji: "🟢", x: 30, y: 52 },
          { id: 5, emoji: "🔵", x: 60, y: 48 },
          { id: 6, emoji: "🔴", x: 20, y: 78 },
          { id: 7, emoji: "🔵", x: 75, y: 75 }
        ]
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
    setPaintedItems(new Set());
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎨", "✅"][Math.floor(Math.random() * 6)],
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

      const utterance = new SpeechSynthesisUtterance(round.question);
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

  const handleItemClick = (item) => {
    if (showAnswer) return;

    const newPainted = new Set(paintedItems);

    if (newPainted.has(item.id)) {
      newPainted.delete(item.id);
    } else {
      newPainted.add(item.id);
    }

    setPaintedItems(newPainted);
  };

  const handleCheckAnswer = () => {
    const targetItems = round.items.filter(item => item.emoji === round.targetEmoji);
    const targetIds = new Set(targetItems.map(item => item.id));

    const isCorrect =
      paintedItems.size === targetIds.size &&
      [...paintedItems].every(id => targetIds.has(id));

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Paint Same Objects Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Paint Same Objects Game",
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
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const targetItems = round.items.filter(item => item.emoji === round.targetEmoji);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βάψε ό,τι είναι Ίδιο" : "Paint What's the Same"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🎨 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">🎨</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">{round.targetEmoji}</span>
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: round.paintColor }}
            />
          </div>

          <button
            onClick={speakQuestion}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>

          <p className="text-sm text-slate-600 mt-3">
            {lang === "el"
              ? `Πάτα στα ${round.targetName} για να τα βάψεις!`
              : `Click on the ${round.targetName} to paint them!`}
          </p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="relative bg-white rounded-3xl shadow-xl border-4 border-orange-400 p-8 paint-canvas" style={{ height: "500px" }}>
          {round.items.map((item) => {
            const isPainted = paintedItems.has(item.id);
            const isTarget = item.emoji === round.targetEmoji;
            const isCorrectPaint = showAnswer && isTarget && isPainted;
            const isWrongPaint = showAnswer && !isTarget && isPainted;
            const isMissed = showAnswer && isTarget && !isPainted;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={showAnswer}
                className={`
                  absolute text-7xl transition-all duration-500 transform
                  ${!showAnswer ? 'cursor-pointer hover:scale-125' : 'cursor-not-allowed'}
                `}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isPainted ? 20 : 10
                }}
              >
                <div className="relative">
                  {/* Paint splash background - only when painted */}
                  {isPainted && !showAnswer && (
                    <>
                      <div
                        className="absolute rounded-full animate-pulse"
                        style={{
                          backgroundColor: round.paintColor,
                          width: '120px',
                          height: '120px',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.4,
                          zIndex: -1,
                          boxShadow: `0 0 30px ${round.paintColor}`
                        }}
                      />
                      <div
                        className="absolute rounded-full"
                        style={{
                          backgroundColor: round.paintColor,
                          width: '90px',
                          height: '90px',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.6,
                          zIndex: -1
                        }}
                      />
                    </>
                  )}

                  {/* The emoji - grayscale when not painted, colored when painted */}
                  <div
                    className={`transition-all duration-500 ${isPainted && !showAnswer ? 'animate-bounce' : ''}`}
                    style={{
                      filter: isPainted
                        ? `brightness(1.2) saturate(1.3) drop-shadow(0 0 8px ${round.paintColor})`
                        : 'grayscale(100%) brightness(0.8) opacity(0.6)',
                      WebkitFilter: isPainted
                        ? `brightness(1.2) saturate(1.3) drop-shadow(0 0 8px ${round.paintColor})`
                        : 'grayscale(100%) brightness(0.8) opacity(0.6)'
                    }}
                  >
                    {item.emoji}
                  </div>

                  {/* Paint brush stroke effect when painting */}
                  {isPainted && !showAnswer && (
                    <div
                      className="absolute animate-ping"
                      style={{
                        left: '80%',
                        top: '20%',
                        fontSize: '2rem',
                        zIndex: 30
                      }}
                    >
                      🖌️
                    </div>
                  )}

                  {isCorrectPaint && (
                    <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrongPaint && (
                    <div className="absolute -top-2 -right-2 text-4xl">
                      ❌
                    </div>
                  )}
                  {isMissed && (
                    <div
                      className="absolute inset-0 rounded-full border-4 border-dashed border-red-500 animate-pulse"
                      style={{ transform: 'scale(1.3)' }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
          <p className="text-lg font-bold text-slate-700">
            {lang === "el"
              ? `Έχεις βάψει: ${paintedItems.size} / ${targetItems.length}`
              : `Painted: ${paintedItems.size} / ${targetItems.length}`}
          </p>
        </div>
      </div>

      {/* Check Button */}
      {!showAnswer && (
        <div className="text-center mb-8">
          <button
            onClick={handleCheckAnswer}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            ✓ {lang === "el" ? "Έλεγχος" : "Check"}
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {paintedItems.size === targetItems.length &&
           [...paintedItems].every(id => targetItems.some(item => item.id === id)) ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Τέλεια! Έβαψες όλα τα ${round.targetName}!`
                  : `🎉 Perfect! You painted all the ${round.targetName}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Προσπάθησε ξανά! Βάψε μόνο τα ${round.targetName}!`
                  : `Try again! Paint only the ${round.targetName}!`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βάφεις τα ίδια αντικείμενα!" : "Perfect! You know how to paint same objects!"}
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

        /* Paint brush cursor */
        .paint-canvas {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="28" font-size="28">🖌️</text></svg>') 16 16, pointer;
        }

        .paint-canvas button {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="28" font-size="28">🖌️</text></svg>') 16 16, pointer !important;
        }

        .paint-canvas button:hover {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="28" font-size="28">🎨</text></svg>') 16 16, pointer !important;
        }
      `}</style>
    </div>
  );
}

