// src/components/games/FoodSorting.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function FoodSorting({ lang = "el", onComplete }) {
  const [currentFood, setCurrentFood] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [usedFoods, setUsedFoods] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const categories = [
    {
      id: "fruit",
      name: { el: "Φρούτο", en: "Fruit" },
      emoji: "🍎",
      color: "bg-red-100",
      borderColor: "border-red-400",
      gradient: "from-red-200 to-orange-200",
    },
    {
      id: "vegetable",
      name: { el: "Λαχανικό", en: "Vegetable" },
      emoji: "🥕",
      color: "bg-green-100",
      borderColor: "border-green-400",
      gradient: "from-green-200 to-emerald-200",
    },
  ];

  const foods = [
    // Φρούτα
    { id: 1, emoji: "🍎", name: { el: "Μήλο", en: "Apple" }, category: "fruit" },
    { id: 2, emoji: "🍌", name: { el: "Μπανάνα", en: "Banana" }, category: "fruit" },
    { id: 3, emoji: "🍊", name: { el: "Πορτοκάλι", en: "Orange" }, category: "fruit" },
    { id: 4, emoji: "🍇", name: { el: "Σταφύλια", en: "Grapes" }, category: "fruit" },
    { id: 5, emoji: "🍓", name: { el: "Φράουλα", en: "Strawberry" }, category: "fruit" },
    { id: 6, emoji: "🍉", name: { el: "Καρπούζι", en: "Watermelon" }, category: "fruit" },
    { id: 7, emoji: "🍒", name: { el: "Κεράσι", en: "Cherry" }, category: "fruit" },
    { id: 8, emoji: "🍑", name: { el: "Ροδάκινο", en: "Peach" }, category: "fruit" },
    { id: 9, emoji: "🍍", name: { el: "Ανανάς", en: "Pineapple" }, category: "fruit" },
    { id: 10, emoji: "🥝", name: { el: "Ακτινίδιο", en: "Kiwi" }, category: "fruit" },

    // Λαχανικά
    { id: 11, emoji: "🥕", name: { el: "Καρότο", en: "Carrot" }, category: "vegetable" },
    { id: 12, emoji: "🥦", name: { el: "Μπρόκολο", en: "Broccoli" }, category: "vegetable" },
    { id: 13, emoji: "🌽", name: { el: "Καλαμπόκι", en: "Corn" }, category: "vegetable" },
    { id: 14, emoji: "🍅", name: { el: "Ντομάτα", en: "Tomato" }, category: "vegetable" },
    { id: 15, emoji: "🥒", name: { el: "Αγγούρι", en: "Cucumber" }, category: "vegetable" },
    { id: 16, emoji: "🥬", name: { el: "Λάχανο", en: "Cabbage" }, category: "vegetable" },
    { id: 17, emoji: "🧅", name: { el: "Κρεμμύδι", en: "Onion" }, category: "vegetable" },
    { id: 18, emoji: "🫑", name: { el: "Πιπεριά", en: "Pepper" }, category: "vegetable" },
    { id: 19, emoji: "🥔", name: { el: "Πατάτα", en: "Potato" }, category: "vegetable" },
    { id: 20, emoji: "🍆", name: { el: "Μελιτζάνα", en: "Eggplant" }, category: "vegetable" },
  ];

  const TARGET_SCORE = 15; // 15 τροφές

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewFood();
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

  const selectNewFood = () => {
    const availableFoods = foods.filter(
      (food) => !usedFoods.includes(food.id)
    );

    if (availableFoods.length === 0) {
      return;
    }

    const randomFood =
      availableFoods[Math.floor(Math.random() * availableFoods.length)];
    setCurrentFood(randomFood);
    setSelectedCategory(null);
    setFeedback(null);
  };

  const handleCategorySelect = (categoryId) => {
    if (!currentFood || feedback !== null) return;

    setSelectedCategory(categoryId);

    if (categoryId === currentFood.category) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);
      setUsedFoods((prev) => [...prev, currentFood.id]);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Food Sorting",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Food Sorting",
        score: 1,
        total: 1,
      });

      // Επόμενη τροφή μετά από 1.5 δευτερόλεπτα
      setTimeout(() => {
        selectNewFood();
      }, 1500);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
        setSelectedCategory(null);
      }, 1000);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🍎", "🥕", "⭐", "✨", "🌟", "🎉"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentFood) {
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
    <div className="bg-gradient-to-br from-red-100 via-orange-100 to-green-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "🍎🥕 Φρούτα ή Λαχανικά;" : "🍎🥕 Fruit or Vegetable?"}
            </h3>
            <div className="text-2xl font-bold text-orange-600">
              ✅ {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-green-500 transition-all duration-500 ease-out"
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
          {lang === "el" ? "🤔 Τι είναι αυτό;" : "🤔 What is this?"}
        </h2>

        {/* Current Food Display */}
        <div className="mb-8">
          <div className="inline-block bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="text-9xl mb-4 filter drop-shadow-lg animate-bounce">
              {currentFood.emoji}
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {currentFood.name[lang]}
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

      {/* Category Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isCorrect = currentFood.category === category.id;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              disabled={feedback !== null}
              className={`
                ${category.color}
                border-4 ${category.borderColor}
                p-10 rounded-3xl shadow-xl
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-200" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-200" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-200" : ""}
              `}
            >
              <div className="text-9xl mb-6 filter drop-shadow-md">
                {category.emoji}
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                {category.name[lang]}
              </p>
              {showCorrectAnswer && (
                <div className="text-4xl mt-4 text-green-700 font-bold">
                  ✓ {lang === "el" ? "Εδώ!" : "Here!"}
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
              ? "Πάτα το σωστό κουμπί: Είναι φρούτο ή λαχανικό;"
              : "Tap the correct button: Is it a fruit or vegetable?"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-300/90 to-green-400/90 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🍎🥕🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Έμαθες τη διαφορά!"
                : "You learned the difference!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

