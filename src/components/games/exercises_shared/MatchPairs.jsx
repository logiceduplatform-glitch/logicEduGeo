// src/components/games/exercises_4_5/MatchPairs.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function MatchPairs({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [wrongMatch, setWrongMatch] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 4; // 4 σετ ζευγαριών

  const roundsData = {
    el: [
      {
        id: 1,
        theme: "Κουζίνα",
        emoji: "🍽️",
        color: "#EF4444",
        pairs: [
          { id: 1, left: { emoji: "🥄", name: "Κουτάλι" }, right: { emoji: "🍽️", name: "Πιάτο" } },
          { id: 2, left: { emoji: "🍴", name: "Πιρούνι" }, right: { emoji: "🔪", name: "Μαχαίρι" } },
          { id: 3, left: { emoji: "☕", name: "Φλιτζάνι" }, right: { emoji: "🫖", name: "Τσαγιέρα" } },
          { id: 4, left: { emoji: "🥛", name: "Γάλα" }, right: { emoji: "🍪", name: "Μπισκότο" } },
        ]
      },
      {
        id: 2,
        theme: "Ρούχα",
        emoji: "👕",
        color: "#F59E0B",
        pairs: [
          { id: 1, left: { emoji: "👞", name: "Παπούτσι" }, right: { emoji: "🧦", name: "Κάλτσα" } },
          { id: 2, left: { emoji: "👕", name: "Μπλουζάκι" }, right: { emoji: "👖", name: "Παντελόνι" } },
          { id: 3, left: { emoji: "🧥", name: "Μπουφάν" }, right: { emoji: "🧣", name: "Κασκόλ" } },
          { id: 4, left: { emoji: "👒", name: "Καπέλο" }, right: { emoji: "🧤", name: "Γάντια" } },
        ]
      },
      {
        id: 3,
        theme: "Ζώα & Τροφή",
        emoji: "🐶",
        color: "#10B981",
        pairs: [
          { id: 1, left: { emoji: "🐶", name: "Σκύλος" }, right: { emoji: "🦴", name: "Κόκαλο" } },
          { id: 2, left: { emoji: "🐱", name: "Γάτα" }, right: { emoji: "🥛", name: "Γάλα" } },
          { id: 3, left: { emoji: "🐝", name: "Μέλισσα" }, right: { emoji: "🍯", name: "Μέλι" } },
          { id: 4, left: { emoji: "🐰", name: "Κουνέλι" }, right: { emoji: "🥕", name: "Καρότο" } },
        ]
      },
      {
        id: 4,
        theme: "Εργαλεία & Χρήση",
        emoji: "🔨",
        color: "#3B82F6",
        pairs: [
          { id: 1, left: { emoji: "🔨", name: "Σφυρί" }, right: { emoji: "🔩", name: "Καρφί" } },
          { id: 2, left: { emoji: "✏️", name: "Μολύβι" }, right: { emoji: "📝", name: "Χαρτί" } },
          { id: 3, left: { emoji: "🖌️", name: "Πινέλο" }, right: { emoji: "🎨", name: "Μπογιές" } },
          { id: 4, left: { emoji: "🔑", name: "Κλειδί" }, right: { emoji: "🚪", name: "Πόρτα" } },
        ]
      }
    ],
    en: [
      {
        id: 1,
        theme: "Kitchen",
        emoji: "🍽️",
        color: "#EF4444",
        pairs: [
          { id: 1, left: { emoji: "🥄", name: "Spoon" }, right: { emoji: "🍽️", name: "Plate" } },
          { id: 2, left: { emoji: "🍴", name: "Fork" }, right: { emoji: "🔪", name: "Knife" } },
          { id: 3, left: { emoji: "☕", name: "Cup" }, right: { emoji: "🫖", name: "Teapot" } },
          { id: 4, left: { emoji: "🥛", name: "Milk" }, right: { emoji: "🍪", name: "Cookie" } },
        ]
      },
      {
        id: 2,
        theme: "Clothes",
        emoji: "👕",
        color: "#F59E0B",
        pairs: [
          { id: 1, left: { emoji: "👞", name: "Shoe" }, right: { emoji: "🧦", name: "Sock" } },
          { id: 2, left: { emoji: "👕", name: "T-shirt" }, right: { emoji: "👖", name: "Pants" } },
          { id: 3, left: { emoji: "🧥", name: "Jacket" }, right: { emoji: "🧣", name: "Scarf" } },
          { id: 4, left: { emoji: "👒", name: "Hat" }, right: { emoji: "🧤", name: "Gloves" } },
        ]
      },
      {
        id: 3,
        theme: "Animals & Food",
        emoji: "🐶",
        color: "#10B981",
        pairs: [
          { id: 1, left: { emoji: "🐶", name: "Dog" }, right: { emoji: "🦴", name: "Bone" } },
          { id: 2, left: { emoji: "🐱", name: "Cat" }, right: { emoji: "🥛", name: "Milk" } },
          { id: 3, left: { emoji: "🐝", name: "Bee" }, right: { emoji: "🍯", name: "Honey" } },
          { id: 4, left: { emoji: "🐰", name: "Rabbit" }, right: { emoji: "🥕", name: "Carrot" } },
        ]
      },
      {
        id: 4,
        theme: "Tools & Use",
        emoji: "🔨",
        color: "#3B82F6",
        pairs: [
          { id: 1, left: { emoji: "🔨", name: "Hammer" }, right: { emoji: "🔩", name: "Nail" } },
          { id: 2, left: { emoji: "✏️", name: "Pencil" }, right: { emoji: "📝", name: "Paper" } },
          { id: 3, left: { emoji: "🖌️", name: "Brush" }, right: { emoji: "🎨", name: "Paint" } },
          { id: 4, left: { emoji: "🔑", name: "Key" }, right: { emoji: "🚪", name: "Door" } },
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
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🧠", "🎯"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleLeftClick = (pair) => {
    if (matchedPairs.includes(pair.id)) return;
    setSelectedLeft(pair);

    // Check if right is already selected
    if (selectedRight) {
      checkMatch(pair, selectedRight);
    }
  };

  const handleRightClick = (pair) => {
    if (matchedPairs.includes(pair.id)) return;
    setSelectedRight(pair);

    // Check if left is already selected
    if (selectedLeft) {
      checkMatch(selectedLeft, pair);
    }
  };

  const checkMatch = (leftPair, rightPair) => {
    // Check if they match
    if (leftPair.id === rightPair.id) {
      // Match!
      correctSoundRef.current?.play().catch(() => {});

      const newMatched = [...matchedPairs, leftPair.id];
      setMatchedPairs(newMatched);

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Update progress
      updateProgress({
        title: "Match Pairs",
        score: newScore,
        total: round.pairs.length * TARGET_ROUNDS,
        index: currentRound * round.pairs.length + newMatched.length,
      });

      completeQuiz({
        title: "Match Pairs",
        score: 1,
        total: 1,
      });

      // Clear selection
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all matched
        if (newMatched.length === round.pairs.length) {
          handleRoundComplete();
        }
      }, 1000);
    } else {
      // No match
      wrongSoundRef.current?.play().catch(() => {});

      setWrongMatch({ left: leftPair.id, right: rightPair.id });

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongMatch(null);
      }, 1000);
    }
  };

  const handleRoundComplete = () => {
    setTimeout(() => {
      if (currentRound + 1 < TARGET_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        // All rounds complete
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const roundProgress = Math.round((matchedPairs.length / round.pairs.length) * 100);

  // Shuffle right items for display
  const shuffledRightItems = [...round.pairs].sort(() => Math.random() - 0.5);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Αντιστοίχιση Ζευγαριών" : "Match Pairs"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σετ ${currentRound + 1}/${TARGET_ROUNDS}: ${round.theme}`
                : `Set ${currentRound + 1}/${TARGET_ROUNDS}: ${round.theme}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-cyan-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-3">{round.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: round.color }}>
            {round.theme}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el" ? "Ταίριαξε τα ζευγάρια!" : "Match the pairs!"}
          </p>
          <div className="mt-3">
            <div className="inline-block bg-slate-100 rounded-xl px-6 py-2">
              <span className="text-lg font-bold text-slate-700">
                {matchedPairs.length} / {round.pairs.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {round.pairs.map((pair) => {
              const isMatched = matchedPairs.includes(pair.id);
              const isSelected = selectedLeft && selectedLeft.id === pair.id;
              const isWrong = wrongMatch && wrongMatch.left === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => handleLeftClick(pair)}
                  disabled={isMatched}
                  className={`
                    relative w-full p-6 rounded-2xl border-4 transition-all duration-300 transform
                    ${isMatched ? "bg-green-100 border-green-500 opacity-50" : ""}
                    ${isSelected ? "bg-blue-100 border-blue-500 scale-105" : ""}
                    ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                    ${!isMatched && !isSelected && !isWrong ? "bg-white border-slate-300 hover:border-indigo-400 hover:scale-105 cursor-pointer" : ""}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-7xl">{pair.left.emoji}</div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-slate-800">{pair.left.name}</p>
                    </div>
                  </div>
                  {isMatched && (
                    <div className="absolute -top-3 -right-3 text-5xl">
                      ✅
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column - Shuffled */}
          <div className="space-y-4">
            {shuffledRightItems.map((pair) => {
              const isMatched = matchedPairs.includes(pair.id);
              const isSelected = selectedRight && selectedRight.id === pair.id;
              const isWrong = wrongMatch && wrongMatch.right === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => handleRightClick(pair)}
                  disabled={isMatched}
                  className={`
                    relative w-full p-6 rounded-2xl border-4 transition-all duration-300 transform
                    ${isMatched ? "bg-green-100 border-green-500 opacity-50" : ""}
                    ${isSelected ? "bg-blue-100 border-blue-500 scale-105" : ""}
                    ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                    ${!isMatched && !isSelected && !isWrong ? "bg-white border-slate-300 hover:border-indigo-400 hover:scale-105 cursor-pointer" : ""}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-7xl">{pair.right.emoji}</div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-slate-800">{pair.right.name}</p>
                    </div>
                  </div>
                  {isMatched && (
                    <div className="absolute -top-3 -right-3 text-5xl">
                      ✅
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${roundProgress}%`,
                  backgroundColor: round.color
                }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {roundProgress}%
            </span>
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-cyan-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια Λογική!" : "Perfect Logic!"}
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

