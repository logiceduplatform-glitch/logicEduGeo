// src/components/games/WhatDoesItEatGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WhatDoesItEatGame({ lang = "el", difficulty = 3, onComplete }) {
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
        animal: { emoji: "🐶", name: "Σκύλος" },
        correctFood: "bone",
        question: "Τι τρώει ο σκύλος;",
        options: [
          { id: "bone", emoji: "🦴", label: "Κόκαλο" },
          { id: "grass", emoji: "🌿", label: "Χορτάρι" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" }
        ]
      },
      {
        id: 2,
        animal: { emoji: "🐱", name: "Γάτα" },
        correctFood: "fish",
        question: "Τι τρώει η γάτα;",
        options: [
          { id: "carrot", emoji: "🥕", label: "Καρότο" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "grass", emoji: "🌿", label: "Χορτάρι" },
          { id: "seeds", emoji: "🌾", label: "Σπόρους" }
        ]
      },
      {
        id: 3,
        animal: { emoji: "🐰", name: "Λαγός" },
        correctFood: "carrot",
        question: "Τι τρώει ο λαγός;",
        options: [
          { id: "carrot", emoji: "🥕", label: "Καρότο" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "bone", emoji: "🦴", label: "Κόκαλο" }
        ]
      },
      {
        id: 4,
        animal: { emoji: "🐮", name: "Αγελάδα" },
        correctFood: "grass",
        question: "Τι τρώει η αγελάδα;",
        options: [
          { id: "grass", emoji: "🌿", label: "Χορτάρι" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" }
        ]
      },
      {
        id: 5,
        animal: { emoji: "🐻", name: "Αρκούδα" },
        correctFood: "honey",
        question: "Τι τρώει η αρκούδα;",
        options: [
          { id: "honey", emoji: "🍯", label: "Μέλι" },
          { id: "grass", emoji: "🌿", label: "Χορτάρι" },
          { id: "seeds", emoji: "🌾", label: "Σπόρους" },
          { id: "bone", emoji: "🦴", label: "Κόκαλο" }
        ]
      },
      {
        id: 6,
        animal: { emoji: "🐵", name: "Μαϊμού" },
        correctFood: "banana",
        question: "Τι τρώει η μαϊμού;",
        options: [
          { id: "banana", emoji: "🍌", label: "Μπανάνα" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "bone", emoji: "🦴", label: "Κόκαλο" }
        ]
      },
      {
        id: 7,
        animal: { emoji: "🐦", name: "Πουλί" },
        correctFood: "seeds",
        question: "Τι τρώει το πουλί;",
        options: [
          { id: "seeds", emoji: "🌾", label: "Σπόρους" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "grass", emoji: "🌿", label: "Χορτάρι" },
          { id: "honey", emoji: "🍯", label: "Μέλι" }
        ]
      },
      {
        id: 8,
        animal: { emoji: "🐝", name: "Μέλισσα" },
        correctFood: "flower",
        question: "Τι τρώει η μέλισσα;",
        options: [
          { id: "flower", emoji: "🌸", label: "Λουλούδι (Νέκταρ)" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" }
        ]
      },
      {
        id: 9,
        animal: { emoji: "🐘", name: "Ελέφαντας" },
        correctFood: "leaves",
        question: "Τι τρώει ο ελέφαντας;",
        options: [
          { id: "leaves", emoji: "🍃", label: "Φύλλα" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "bone", emoji: "🦴", label: "Κόκαλο" }
        ]
      },
      {
        id: 10,
        animal: { emoji: "🐿️", name: "Σκίουρος" },
        correctFood: "nuts",
        question: "Τι τρώει ο σκίουρος;",
        options: [
          { id: "nuts", emoji: "🌰", label: "Καρύδια" },
          { id: "fish", emoji: "🐟", label: "Ψάρι" },
          { id: "meat", emoji: "🍖", label: "Κρέας" },
          { id: "bone", emoji: "🦴", label: "Κόκαλο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        animal: { emoji: "🐶", name: "Dog" },
        correctFood: "bone",
        question: "What does the dog eat?",
        options: [
          { id: "bone", emoji: "🦴", label: "Bone" },
          { id: "grass", emoji: "🌿", label: "Grass" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "banana", emoji: "🍌", label: "Banana" }
        ]
      },
      {
        id: 2,
        animal: { emoji: "🐱", name: "Cat" },
        correctFood: "fish",
        question: "What does the cat eat?",
        options: [
          { id: "carrot", emoji: "🥕", label: "Carrot" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "grass", emoji: "🌿", label: "Grass" },
          { id: "seeds", emoji: "🌾", label: "Seeds" }
        ]
      },
      {
        id: 3,
        animal: { emoji: "🐰", name: "Rabbit" },
        correctFood: "carrot",
        question: "What does the rabbit eat?",
        options: [
          { id: "carrot", emoji: "🥕", label: "Carrot" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "bone", emoji: "🦴", label: "Bone" }
        ]
      },
      {
        id: 4,
        animal: { emoji: "🐮", name: "Cow" },
        correctFood: "grass",
        question: "What does the cow eat?",
        options: [
          { id: "grass", emoji: "🌿", label: "Grass" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "banana", emoji: "🍌", label: "Banana" }
        ]
      },
      {
        id: 5,
        animal: { emoji: "🐻", name: "Bear" },
        correctFood: "honey",
        question: "What does the bear eat?",
        options: [
          { id: "honey", emoji: "🍯", label: "Honey" },
          { id: "grass", emoji: "🌿", label: "Grass" },
          { id: "seeds", emoji: "🌾", label: "Seeds" },
          { id: "bone", emoji: "🦴", label: "Bone" }
        ]
      },
      {
        id: 6,
        animal: { emoji: "🐵", name: "Monkey" },
        correctFood: "banana",
        question: "What does the monkey eat?",
        options: [
          { id: "banana", emoji: "🍌", label: "Banana" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "bone", emoji: "🦴", label: "Bone" }
        ]
      },
      {
        id: 7,
        animal: { emoji: "🐦", name: "Bird" },
        correctFood: "seeds",
        question: "What does the bird eat?",
        options: [
          { id: "seeds", emoji: "🌾", label: "Seeds" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "grass", emoji: "🌿", label: "Grass" },
          { id: "honey", emoji: "🍯", label: "Honey" }
        ]
      },
      {
        id: 8,
        animal: { emoji: "🐝", name: "Bee" },
        correctFood: "flower",
        question: "What does the bee eat?",
        options: [
          { id: "flower", emoji: "🌸", label: "Flower (Nectar)" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "banana", emoji: "🍌", label: "Banana" }
        ]
      },
      {
        id: 9,
        animal: { emoji: "🐘", name: "Elephant" },
        correctFood: "leaves",
        question: "What does the elephant eat?",
        options: [
          { id: "leaves", emoji: "🍃", label: "Leaves" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "bone", emoji: "🦴", label: "Bone" }
        ]
      },
      {
        id: 10,
        animal: { emoji: "🐿️", name: "Squirrel" },
        correctFood: "nuts",
        question: "What does the squirrel eat?",
        options: [
          { id: "nuts", emoji: "🌰", label: "Nuts" },
          { id: "fish", emoji: "🐟", label: "Fish" },
          { id: "meat", emoji: "🍖", label: "Meat" },
          { id: "bone", emoji: "🦴", label: "Bone" }
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
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🐾"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctFood;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "What Does It Eat Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What Does It Eat Game",
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
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctFood);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Τι Τρώει;" : "What Does It Eat?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🐾 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
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
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🍽️</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          {/* Animal Display */}
          <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-3xl p-10 border-4 border-green-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Animal */}
              <div className="text-9xl animate-bounce">
                {round.animal.emoji}
              </div>

              {/* Animal Name */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-green-300">
                <p className="text-3xl font-bold text-center text-slate-800">
                  {round.animal.name}
                </p>
              </div>
            </div>
          </div>

          {/* Food Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-lime-100 hover:from-green-200 hover:to-lime-200 border-4 border-green-300 hover:border-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer"
                    >
                      <div className="text-8xl mb-3">{option.emoji}</div>
                      <p className="text-lg font-bold text-slate-700 text-center">
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctFood && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{round.animal.emoji}</div>
                  <div className="text-6xl">❤️</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                  <div className="text-6xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Σωστά! Ο ${round.animal.name} τρώει ${correctOption.label}!`
                    : `🎉 Correct! The ${round.animal.name} eats ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctFood && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Τι τρώει;`
                    : `Try again! What does it eat?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-emerald-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🐾🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις τι τρώνε τα ζώα!" : "Perfect! You know what animals eat!"}
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

