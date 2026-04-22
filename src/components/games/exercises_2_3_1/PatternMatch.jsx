// src/components/games/PatternMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function PatternMatch({ lang = "el", onComplete }) {
  const [currentPattern, setCurrentPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const patternTypes = [
    // Απλά χρώματα
    {
      id: 1,
      sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"],
      answer: "🔵",
      wrongOptions: ["🔴", "🟡", "🟢"],
      type: "color",
      difficulty: "easy",
    },
    {
      id: 2,
      sequence: ["🟡", "🟢", "🟡", "🟢", "🟡"],
      answer: "🟢",
      wrongOptions: ["🟡", "🔴", "🔵"],
      type: "color",
      difficulty: "easy",
    },
    {
      id: 3,
      sequence: ["🔵", "🟡", "🔵", "🟡", "🔵"],
      answer: "🟡",
      wrongOptions: ["🔵", "🔴", "🟢"],
      type: "color",
      difficulty: "easy",
    },
    // Σχήματα
    {
      id: 4,
      sequence: ["⭐", "❤️", "⭐", "❤️", "⭐"],
      answer: "❤️",
      wrongOptions: ["⭐", "⬛", "🔷"],
      type: "shape",
      difficulty: "easy",
    },
    {
      id: 5,
      sequence: ["🔷", "🔶", "🔷", "🔶", "🔷"],
      answer: "🔶",
      wrongOptions: ["🔷", "⭐", "❤️"],
      type: "shape",
      difficulty: "easy",
    },
    // Ζώα
    {
      id: 6,
      sequence: ["🐶", "🐱", "🐶", "🐱", "🐶"],
      answer: "🐱",
      wrongOptions: ["🐶", "🐭", "🐰"],
      type: "animal",
      difficulty: "easy",
    },
    {
      id: 7,
      sequence: ["🐸", "🦋", "🐸", "🦋", "🐸"],
      answer: "🦋",
      wrongOptions: ["🐸", "🐝", "🐛"],
      type: "animal",
      difficulty: "easy",
    },
    // Φρούτα
    {
      id: 8,
      sequence: ["🍎", "🍌", "🍎", "🍌", "🍎"],
      answer: "🍌",
      wrongOptions: ["🍎", "🍊", "🍇"],
      type: "fruit",
      difficulty: "easy",
    },
    {
      id: 9,
      sequence: ["🍓", "🍉", "🍓", "🍉", "🍓"],
      answer: "🍉",
      wrongOptions: ["🍓", "🍒", "🍑"],
      type: "fruit",
      difficulty: "easy",
    },
    // Τριπλά patterns (πιο δύσκολα)
    {
      id: 10,
      sequence: ["🔴", "🔵", "🟡", "🔴", "🔵"],
      answer: "🟡",
      wrongOptions: ["🔴", "🔵", "🟢"],
      type: "color",
      difficulty: "medium",
    },
    {
      id: 11,
      sequence: ["⭐", "❤️", "🔷", "⭐", "❤️"],
      answer: "🔷",
      wrongOptions: ["⭐", "❤️", "🔶"],
      type: "shape",
      difficulty: "medium",
    },
    {
      id: 12,
      sequence: ["🐶", "🐱", "🐭", "🐶", "🐱"],
      answer: "🐭",
      wrongOptions: ["🐶", "🐱", "🐰"],
      type: "animal",
      difficulty: "medium",
    },
  ];

  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewPattern();
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [score, showCelebration, onComplete]);

  const selectNewPattern = () => {
    const randomPattern =
      patternTypes[Math.floor(Math.random() * patternTypes.length)];
    setCurrentPattern(randomPattern);

    // Δημιουργία επιλογών (η σωστή + οι λάθος)
    const allOptions = [randomPattern.answer, ...randomPattern.wrongOptions];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    setSelectedOption(null);
    setFeedback(null);
  };

  const handleOptionSelect = (option) => {
    if (!currentPattern || feedback !== null) return;

    setSelectedOption(option);

    if (option === currentPattern.answer) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Pattern Match",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Pattern Match",
        score: 1,
        total: 1,
      });

      // Επόμενο pattern μετά από 1.8 δευτερόλεπτα
      setTimeout(() => {
        selectNewPattern();
      }, 1800);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1000);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎨", "⭐", "✨", "🌟", "🎉", "🔮"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentPattern) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="mb-8">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "🎨 Μοτίβα" : "🎨 Patterns"}
            </h3>
            <div className="text-2xl font-bold text-purple-600">
              🔮 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
          {lang === "el" ? "🤔 Τι έρχεται μετά;" : "🤔 What comes next?"}
        </h2>

        {/* Pattern Display */}
        <div className="mb-8">
          <div className="inline-block bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              {currentPattern.sequence.map((item, index) => (
                <div
                  key={index}
                  className="text-7xl transform transition-all duration-200 hover:scale-110"
                >
                  {item}
                </div>
              ))}
              {/* Question Mark */}
              <div className="text-7xl text-purple-600 font-bold animate-pulse">
                ❓
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
              {lang === "el"
                ? "Ποιο έρχεται μετά στο μοτίβο;"
                : "Which one comes next in the pattern?"}
            </p>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback === "correct" && (
          <div className="text-4xl font-bold text-green-600 animate-bounce mb-6">
            {lang === "el" ? "Μπράβο! Σωστά! ✅" : "Great! Correct! ✅"}
          </div>
        )}
        {feedback === "wrong" && (
          <div className="text-3xl font-bold text-red-600 animate-shake mb-6">
            {lang === "el" ? "Προσπάθησε ξανά! ❌" : "Try again! ❌"}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentPattern.answer;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={feedback !== null}
              className={`
                bg-white dark:bg-slate-800
                border-4 border-slate-300 dark:border-slate-600
                p-8 rounded-2xl shadow-lg
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl hover:border-purple-400
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-100 border-green-500" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-100 border-red-500" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-100 border-green-500" : ""}
              `}
            >
              <div className="text-8xl filter drop-shadow-md">
                {option}
              </div>
              {showCorrectAnswer && (
                <div className="text-3xl mt-3 text-green-700 font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      {score === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 inline-block px-6 py-3 rounded-xl shadow">
            💡 {lang === "el"
              ? "Παρατήρησε το μοτίβο και διάλεξε τι έρχεται μετά!"
              : "Observe the pattern and choose what comes next!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/90 to-pink-400/90 dark:from-slate-800/95 dark:to-slate-700/95 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎨🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Έμαθες τα μοτίβα!"
                : "You learned patterns!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

