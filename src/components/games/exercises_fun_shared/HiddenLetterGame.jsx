// src/components/games/HiddenLetterGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function HiddenLetterGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [foundLetters, setFoundLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [clickedItems, setClickedItems] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 8; // 8 γράμματα

  const jungleData = {
    el: [
      {
        id: 1,
        targetLetter: "Α",
        targetCount: 3,
        color: "#EF4444",
        jungle: [
          { id: 1, type: "letter", value: "Α", x: 15, y: 20 },
          { id: 2, type: "emoji", value: "🌴", x: 25, y: 30 },
          { id: 3, type: "letter", value: "Β", x: 35, y: 25 },
          { id: 4, type: "emoji", value: "🦁", x: 45, y: 40 },
          { id: 5, type: "letter", value: "Α", x: 55, y: 15 },
          { id: 6, type: "emoji", value: "🐒", x: 65, y: 35 },
          { id: 7, type: "letter", value: "Κ", x: 75, y: 25 },
          { id: 8, type: "letter", value: "Α", x: 85, y: 45 },
          { id: 9, type: "emoji", value: "🌿", x: 20, y: 60 },
          { id: 10, type: "emoji", value: "🦜", x: 70, y: 65 },
        ]
      },
      {
        id: 2,
        targetLetter: "Μ",
        targetCount: 4,
        color: "#8B5CF6",
        jungle: [
          { id: 1, type: "emoji", value: "🌺", x: 10, y: 25 },
          { id: 2, type: "letter", value: "Μ", x: 20, y: 30 },
          { id: 3, type: "letter", value: "Ν", x: 30, y: 20 },
          { id: 4, type: "letter", value: "Μ", x: 40, y: 45 },
          { id: 5, type: "emoji", value: "🐍", x: 50, y: 25 },
          { id: 6, type: "letter", value: "Μ", x: 60, y: 35 },
          { id: 7, type: "emoji", value: "🦋", x: 70, y: 20 },
          { id: 8, type: "letter", value: "Π", x: 80, y: 40 },
          { id: 9, type: "letter", value: "Μ", x: 25, y: 60 },
          { id: 10, type: "emoji", value: "🌴", x: 75, y: 65 },
        ]
      },
      {
        id: 3,
        targetLetter: "Σ",
        targetCount: 3,
        color: "#10B981",
        jungle: [
          { id: 1, type: "letter", value: "Ζ", x: 15, y: 30 },
          { id: 2, type: "emoji", value: "🐆", x: 25, y: 25 },
          { id: 3, type: "letter", value: "Σ", x: 35, y: 40 },
          { id: 4, type: "emoji", value: "🌿", x: 45, y: 20 },
          { id: 5, type: "letter", value: "Σ", x: 55, y: 35 },
          { id: 6, type: "letter", value: "Ξ", x: 65, y: 25 },
          { id: 7, type: "emoji", value: "🦜", x: 75, y: 45 },
          { id: 8, type: "letter", value: "Σ", x: 85, y: 30 },
          { id: 9, type: "emoji", value: "🌺", x: 20, y: 65 },
          { id: 10, type: "emoji", value: "🐒", x: 70, y: 60 },
        ]
      },
      {
        id: 4,
        targetLetter: "Π",
        targetCount: 4,
        color: "#F59E0B",
        jungle: [
          { id: 1, type: "letter", value: "Π", x: 12, y: 28 },
          { id: 2, type: "emoji", value: "🌴", x: 22, y: 35 },
          { id: 3, type: "letter", value: "Ρ", x: 32, y: 22 },
          { id: 4, type: "letter", value: "Π", x: 42, y: 42 },
          { id: 5, type: "emoji", value: "🦁", x: 52, y: 28 },
          { id: 6, type: "letter", value: "Π", x: 62, y: 38 },
          { id: 7, type: "letter", value: "Τ", x: 72, y: 25 },
          { id: 8, type: "emoji", value: "🐍", x: 82, y: 42 },
          { id: 9, type: "letter", value: "Π", x: 28, y: 62 },
          { id: 10, type: "emoji", value: "🦋", x: 68, y: 65 },
        ]
      },
      {
        id: 5,
        targetLetter: "Κ",
        targetCount: 3,
        color: "#06B6D4",
        jungle: [
          { id: 1, type: "emoji", value: "🌺", x: 18, y: 32 },
          { id: 2, type: "letter", value: "Κ", x: 28, y: 27 },
          { id: 3, type: "letter", value: "Χ", x: 38, y: 38 },
          { id: 4, type: "emoji", value: "🦜", x: 48, y: 25 },
          { id: 5, type: "letter", value: "Κ", x: 58, y: 42 },
          { id: 6, type: "letter", value: "Γ", x: 68, y: 28 },
          { id: 7, type: "emoji", value: "🐒", x: 78, y: 38 },
          { id: 8, type: "letter", value: "Κ", x: 88, y: 32 },
          { id: 9, type: "emoji", value: "🌿", x: 22, y: 68 },
          { id: 10, type: "emoji", value: "🌴", x: 72, y: 62 },
        ]
      },
      {
        id: 6,
        targetLetter: "Λ",
        targetCount: 4,
        color: "#EC4899",
        jungle: [
          { id: 1, type: "letter", value: "Λ", x: 14, y: 24 },
          { id: 2, type: "letter", value: "Δ", x: 24, y: 34 },
          { id: 3, type: "emoji", value: "🦋", x: 34, y: 28 },
          { id: 4, type: "letter", value: "Λ", x: 44, y: 44 },
          { id: 5, type: "emoji", value: "🐆", x: 54, y: 24 },
          { id: 6, type: "letter", value: "Λ", x: 64, y: 38 },
          { id: 7, type: "letter", value: "Ι", x: 74, y: 28 },
          { id: 8, type: "emoji", value: "🌺", x: 84, y: 44 },
          { id: 9, type: "letter", value: "Λ", x: 26, y: 64 },
          { id: 10, type: "emoji", value: "🦜", x: 76, y: 68 },
        ]
      },
      {
        id: 7,
        targetLetter: "Ρ",
        targetCount: 3,
        color: "#A855F7",
        jungle: [
          { id: 1, type: "emoji", value: "🌴", x: 16, y: 26 },
          { id: 2, type: "letter", value: "Ρ", x: 26, y: 36 },
          { id: 3, type: "letter", value: "Π", x: 36, y: 26 },
          { id: 4, type: "emoji", value: "🦁", x: 46, y: 42 },
          { id: 5, type: "letter", value: "Ρ", x: 56, y: 32 },
          { id: 6, type: "emoji", value: "🐍", x: 66, y: 26 },
          { id: 7, type: "letter", value: "Β", x: 76, y: 42 },
          { id: 8, type: "letter", value: "Ρ", x: 86, y: 36 },
          { id: 9, type: "emoji", value: "🌿", x: 24, y: 66 },
          { id: 10, type: "emoji", value: "🐒", x: 74, y: 64 },
        ]
      },
      {
        id: 8,
        targetLetter: "Ν",
        targetCount: 4,
        color: "#22C55E",
        jungle: [
          { id: 1, type: "letter", value: "Ν", x: 12, y: 30 },
          { id: 2, type: "emoji", value: "🦜", x: 22, y: 25 },
          { id: 3, type: "letter", value: "Μ", x: 32, y: 40 },
          { id: 4, type: "letter", value: "Ν", x: 42, y: 30 },
          { id: 5, type: "emoji", value: "🌺", x: 52, y: 25 },
          { id: 6, type: "letter", value: "Ν", x: 62, y: 40 },
          { id: 7, type: "letter", value: "Η", x: 72, y: 30 },
          { id: 8, type: "emoji", value: "🦋", x: 82, y: 40 },
          { id: 9, type: "letter", value: "Ν", x: 27, y: 65 },
          { id: 10, type: "emoji", value: "🌴", x: 77, y: 62 },
        ]
      }
    ],
    en: [
      {
        id: 1,
        targetLetter: "A",
        targetCount: 3,
        color: "#EF4444",
        jungle: [
          { id: 1, type: "letter", value: "A", x: 15, y: 20 },
          { id: 2, type: "emoji", value: "🌴", x: 25, y: 30 },
          { id: 3, type: "letter", value: "B", x: 35, y: 25 },
          { id: 4, type: "emoji", value: "🦁", x: 45, y: 40 },
          { id: 5, type: "letter", value: "A", x: 55, y: 15 },
          { id: 6, type: "emoji", value: "🐒", x: 65, y: 35 },
          { id: 7, type: "letter", value: "K", x: 75, y: 25 },
          { id: 8, type: "letter", value: "A", x: 85, y: 45 },
          { id: 9, type: "emoji", value: "🌿", x: 20, y: 60 },
          { id: 10, type: "emoji", value: "🦜", x: 70, y: 65 },
        ]
      },
      {
        id: 2,
        targetLetter: "M",
        targetCount: 4,
        color: "#8B5CF6",
        jungle: [
          { id: 1, type: "emoji", value: "🌺", x: 10, y: 25 },
          { id: 2, type: "letter", value: "M", x: 20, y: 30 },
          { id: 3, type: "letter", value: "N", x: 30, y: 20 },
          { id: 4, type: "letter", value: "M", x: 40, y: 45 },
          { id: 5, type: "emoji", value: "🐍", x: 50, y: 25 },
          { id: 6, type: "letter", value: "M", x: 60, y: 35 },
          { id: 7, type: "emoji", value: "🦋", x: 70, y: 20 },
          { id: 8, type: "letter", value: "P", x: 80, y: 40 },
          { id: 9, type: "letter", value: "M", x: 25, y: 60 },
          { id: 10, type: "emoji", value: "🌴", x: 75, y: 65 },
        ]
      },
      {
        id: 3,
        targetLetter: "S",
        targetCount: 3,
        color: "#10B981",
        jungle: [
          { id: 1, type: "letter", value: "Z", x: 15, y: 30 },
          { id: 2, type: "emoji", value: "🐆", x: 25, y: 25 },
          { id: 3, type: "letter", value: "S", x: 35, y: 40 },
          { id: 4, type: "emoji", value: "🌿", x: 45, y: 20 },
          { id: 5, type: "letter", value: "S", x: 55, y: 35 },
          { id: 6, type: "letter", value: "X", x: 65, y: 25 },
          { id: 7, type: "emoji", value: "🦜", x: 75, y: 45 },
          { id: 8, type: "letter", value: "S", x: 85, y: 30 },
          { id: 9, type: "emoji", value: "🌺", x: 20, y: 65 },
          { id: 10, type: "emoji", value: "🐒", x: 70, y: 60 },
        ]
      },
      {
        id: 4,
        targetLetter: "P",
        targetCount: 4,
        color: "#F59E0B",
        jungle: [
          { id: 1, type: "letter", value: "P", x: 12, y: 28 },
          { id: 2, type: "emoji", value: "🌴", x: 22, y: 35 },
          { id: 3, type: "letter", value: "R", x: 32, y: 22 },
          { id: 4, type: "letter", value: "P", x: 42, y: 42 },
          { id: 5, type: "emoji", value: "🦁", x: 52, y: 28 },
          { id: 6, type: "letter", value: "P", x: 62, y: 38 },
          { id: 7, type: "letter", value: "T", x: 72, y: 25 },
          { id: 8, type: "emoji", value: "🐍", x: 82, y: 42 },
          { id: 9, type: "letter", value: "P", x: 28, y: 62 },
          { id: 10, type: "emoji", value: "🦋", x: 68, y: 65 },
        ]
      },
      {
        id: 5,
        targetLetter: "K",
        targetCount: 3,
        color: "#06B6D4",
        jungle: [
          { id: 1, type: "emoji", value: "🌺", x: 18, y: 32 },
          { id: 2, type: "letter", value: "K", x: 28, y: 27 },
          { id: 3, type: "letter", value: "H", x: 38, y: 38 },
          { id: 4, type: "emoji", value: "🦜", x: 48, y: 25 },
          { id: 5, type: "letter", value: "K", x: 58, y: 42 },
          { id: 6, type: "letter", value: "G", x: 68, y: 28 },
          { id: 7, type: "emoji", value: "🐒", x: 78, y: 38 },
          { id: 8, type: "letter", value: "K", x: 88, y: 32 },
          { id: 9, type: "emoji", value: "🌿", x: 22, y: 68 },
          { id: 10, type: "emoji", value: "🌴", x: 72, y: 62 },
        ]
      },
      {
        id: 6,
        targetLetter: "L",
        targetCount: 4,
        color: "#EC4899",
        jungle: [
          { id: 1, type: "letter", value: "L", x: 14, y: 24 },
          { id: 2, type: "letter", value: "D", x: 24, y: 34 },
          { id: 3, type: "emoji", value: "🦋", x: 34, y: 28 },
          { id: 4, type: "letter", value: "L", x: 44, y: 44 },
          { id: 5, type: "emoji", value: "🐆", x: 54, y: 24 },
          { id: 6, type: "letter", value: "L", x: 64, y: 38 },
          { id: 7, type: "letter", value: "I", x: 74, y: 28 },
          { id: 8, type: "emoji", value: "🌺", x: 84, y: 44 },
          { id: 9, type: "letter", value: "L", x: 26, y: 64 },
          { id: 10, type: "emoji", value: "🦜", x: 76, y: 68 },
        ]
      },
      {
        id: 7,
        targetLetter: "R",
        targetCount: 3,
        color: "#A855F7",
        jungle: [
          { id: 1, type: "emoji", value: "🌴", x: 16, y: 26 },
          { id: 2, type: "letter", value: "R", x: 26, y: 36 },
          { id: 3, type: "letter", value: "P", x: 36, y: 26 },
          { id: 4, type: "emoji", value: "🦁", x: 46, y: 42 },
          { id: 5, type: "letter", value: "R", x: 56, y: 32 },
          { id: 6, type: "emoji", value: "🐍", x: 66, y: 26 },
          { id: 7, type: "letter", value: "B", x: 76, y: 42 },
          { id: 8, type: "letter", value: "R", x: 86, y: 36 },
          { id: 9, type: "emoji", value: "🌿", x: 24, y: 66 },
          { id: 10, type: "emoji", value: "🐒", x: 74, y: 64 },
        ]
      },
      {
        id: 8,
        targetLetter: "N",
        targetCount: 4,
        color: "#22C55E",
        jungle: [
          { id: 1, type: "letter", value: "N", x: 12, y: 30 },
          { id: 2, type: "emoji", value: "🦜", x: 22, y: 25 },
          { id: 3, type: "letter", value: "M", x: 32, y: 40 },
          { id: 4, type: "letter", value: "N", x: 42, y: 30 },
          { id: 5, type: "emoji", value: "🌺", x: 52, y: 25 },
          { id: 6, type: "letter", value: "N", x: 62, y: 40 },
          { id: 7, type: "letter", value: "H", x: 72, y: 30 },
          { id: 8, type: "emoji", value: "🦋", x: 82, y: 40 },
          { id: 9, type: "letter", value: "N", x: 27, y: 65 },
          { id: 10, type: "emoji", value: "🌴", x: 77, y: 62 },
        ]
      }
    ]
  };

  const jungle = jungleData[lang];
  const round = jungle[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    // Reset found letters when round changes
    setFoundLetters([]);
    setClickedItems([]);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔤", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleItemClick = (item) => {
    if (clickedItems.includes(item.id)) return;

    setClickedItems(prev => [...prev, item.id]);

    if (item.type === "letter" && item.value === round.targetLetter) {
      // Correct letter found
      correctSoundRef.current?.play().catch(() => {});

      const newFoundLetters = [...foundLetters, item.id];
      setFoundLetters(newFoundLetters);

      setScorePopup({ id: Date.now(), x: item.x });
      setTimeout(() => setScorePopup(null), 1000);

      // Check if all letters found
      if (newFoundLetters.length === round.targetCount) {
        const newScore = score + 1;
        setScore(newScore);

        updateProgress({
          title: "Hidden Letter Game",
          score: newScore,
          total: TARGET_ROUNDS,
          index: currentRound + 1,
        });

        completeQuiz({
          title: "Hidden Letter Game",
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
      }
    } else {
      // Wrong item clicked
      wrongSoundRef.current?.play().catch(() => {});
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const letterProgress = Math.round((foundLetters.length / round.targetCount) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-200 via-lime-200 to-emerald-200 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Jungle background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="text-9xl absolute top-10 left-10">🌴</div>
        <div className="text-9xl absolute top-20 right-20">🦜</div>
        <div className="text-9xl absolute bottom-20 left-20">🐒</div>
        <div className="text-9xl absolute bottom-10 right-10">🦁</div>
      </div>

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
            top: "30%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Κρυμμένα Γράμματα" : "Hidden Letters"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            🔍 {score}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-slate-700">
            {lang === "el" ? "Βρες το:" : "Find:"} <span style={{ color: round.color }} className="text-3xl">{round.targetLetter}</span>
          </span>
          <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${letterProgress}%`,
                backgroundColor: round.color
              }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {foundLetters.length} / {round.targetCount}
          </span>
        </div>
      </div>

      {/* Jungle Scene */}
      <div className="relative w-full max-w-6xl mx-auto h-[500px] bg-gradient-to-br from-lime-400/40 to-green-500/40 rounded-3xl border-4 border-green-600 shadow-2xl overflow-hidden">
        {/* Title */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg z-10">
          <p className="text-2xl font-bold text-slate-800">
            🌴 {lang === "el" ? "Ζούγκλα Γραμμάτων" : "Letter Jungle"} 🌴
          </p>
        </div>

        {/* Jungle Items */}
        {round.jungle.map((item) => {
          const isFound = foundLetters.includes(item.id);
          const isClicked = clickedItems.includes(item.id);
          const isTargetLetter = item.type === "letter" && item.value === round.targetLetter;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={isFound || isClicked}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                ${isFound ? "scale-125 animate-bounce" : ""}
                ${isClicked && !isFound ? "opacity-30 scale-75" : ""}
                ${!isFound && !isClicked ? "hover:scale-110 cursor-pointer" : "cursor-default"}
              `}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
            >
              {item.type === "emoji" ? (
                <span className="text-6xl">{item.value}</span>
              ) : (
                <div className={`
                  text-7xl font-bold px-4 py-2 rounded-2xl border-4 transition-all
                  ${isFound ? "bg-green-200 border-green-500 text-green-800" : "bg-white/80 border-slate-400 text-slate-800"}
                  ${isClicked && !isFound ? "bg-red-100 border-red-400" : ""}
                `}>
                  {item.value}
                  {isFound && (
                    <span className="absolute -top-2 -right-2 text-3xl">✅</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-xl text-slate-700">
          {lang === "el"
            ? `🔍 Ψάξε στη ζούγκλα και βρες όλα τα ${round.targetLetter}!`
            : `🔍 Search the jungle and find all the ${round.targetLetter}s!`}
        </p>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-emerald-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔍🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Βρήκες όλα τα κρυμμένα γράμματα!" : "Perfect! You found all the hidden letters!"}
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

