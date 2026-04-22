// src/components/games/WeatherClothes.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WeatherClothes({ lang = "el", onComplete }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const weatherScenarios = [
    {
      id: 1,
      weather: { el: "Ήλιος", en: "Sunny" },
      emoji: "☀️",
      color: "from-yellow-200 to-orange-200",
      clothing: { id: "summer", emoji: "🩳", name: { el: "Σορτς", en: "Shorts" } },
      wrongOptions: [
        { id: "winter", emoji: "🧥", name: { el: "Μπουφάν", en: "Jacket" } },
        { id: "rain", emoji: "☂️", name: { el: "Ομπρέλα", en: "Umbrella" } },
      ],
    },
    {
      id: 2,
      weather: { el: "Βροχή", en: "Rainy" },
      emoji: "🌧️",
      color: "from-blue-200 to-slate-300",
      clothing: { id: "rain", emoji: "☂️", name: { el: "Ομπρέλα", en: "Umbrella" } },
      wrongOptions: [
        { id: "summer", emoji: "👙", name: { el: "Μαγιό", en: "Swimsuit" } },
        { id: "winter", emoji: "🎿", name: { el: "Σκι", en: "Ski" } },
      ],
    },
    {
      id: 3,
      weather: { el: "Χιόνι", en: "Snowy" },
      emoji: "❄️",
      color: "from-cyan-100 to-blue-100",
      clothing: { id: "winter", emoji: "🧥", name: { el: "Μπουφάν", en: "Jacket" } },
      wrongOptions: [
        { id: "summer", emoji: "🩳", name: { el: "Σορτς", en: "Shorts" } },
        { id: "rain", emoji: "👒", name: { el: "Καπέλο", en: "Hat" } },
      ],
    },
    {
      id: 4,
      weather: { el: "Κρύο", en: "Cold" },
      emoji: "🥶",
      color: "from-blue-200 to-indigo-200",
      clothing: { id: "winter", emoji: "🧣", name: { el: "Κασκόλ", en: "Scarf" } },
      wrongOptions: [
        { id: "summer", emoji: "🕶️", name: { el: "Γυαλιά Ηλίου", en: "Sunglasses" } },
        { id: "rain", emoji: "🩴", name: { el: "Σαγιονάρες", en: "Flip Flops" } },
      ],
    },
    {
      id: 5,
      weather: { el: "Ζέστη", en: "Hot" },
      emoji: "🔥",
      color: "from-red-200 to-orange-200",
      clothing: { id: "summer", emoji: "👕", name: { el: "Μπλουζάκι", en: "T-shirt" } },
      wrongOptions: [
        { id: "winter", emoji: "🧤", name: { el: "Γάντια", en: "Gloves" } },
        { id: "rain", emoji: "🥾", name: { el: "Μπότες", en: "Boots" } },
      ],
    },
    {
      id: 6,
      weather: { el: "Άνεμος", en: "Windy" },
      emoji: "💨",
      color: "from-gray-200 to-slate-200",
      clothing: { id: "wind", emoji: "🧢", name: { el: "Καπέλο", en: "Cap" } },
      wrongOptions: [
        { id: "summer", emoji: "🩱", name: { el: "Μαγιό", en: "Swimsuit" } },
        { id: "winter", emoji: "⛷️", name: { el: "Σκι", en: "Ski" } },
      ],
    },
  ];

  const TARGET_SCORE = 12;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewWeather();
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

  const selectNewWeather = () => {
    const randomWeather =
      weatherScenarios[Math.floor(Math.random() * weatherScenarios.length)];
    setCurrentWeather(randomWeather);

    // Δημιουργία επιλογών (η σωστή + οι λάθος)
    const allOptions = [randomWeather.clothing, ...randomWeather.wrongOptions];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    setSelectedOption(null);
    setFeedback(null);
  };

  const handleOptionSelect = (option) => {
    if (!currentWeather || feedback !== null) return;

    setSelectedOption(option.id);

    if (option.id === currentWeather.clothing.id) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Weather Clothes",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Weather Clothes",
        score: 1,
        total: 1,
      });

      // Επόμενος καιρός μετά από 1.8 δευτερόλεπτα
      setTimeout(() => {
        selectNewWeather();
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
      emoji: ["🌤️", "👕", "⭐", "✨", "🌟", "🎉"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentWeather) {
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
    <div className={`bg-gradient-to-br ${currentWeather.color} dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden transition-all duration-500`}>
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
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "🌤️ Καιρός & Ρούχα" : "🌤️ Weather & Clothes"}
            </h3>
            <div className="text-2xl font-bold text-sky-600">
              👕 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out"
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
          {lang === "el"
            ? "🤔 Τι θα φορέσεις σήμερα;"
            : "🤔 What will you wear today?"}
        </h2>

        {/* Weather Display */}
        <div className="mb-8">
          <div className="inline-block bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
            <div className="text-9xl mb-4 filter drop-shadow-lg animate-pulse">
              {currentWeather.emoji}
            </div>
            <p className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {currentWeather.weather[lang]}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {lang === "el"
                ? "Τι θα φορέσεις;"
                : "What will you wear?"}
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

      {/* Clothing Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.id === currentWeather.clothing.id;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              disabled={feedback !== null}
              className={`
                bg-white dark:bg-slate-800
                border-4 border-sky-300 dark:border-slate-600
                p-10 rounded-3xl shadow-xl
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl hover:border-sky-500
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-100 border-green-500" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-100 border-red-500" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-100 border-green-500" : ""}
              `}
            >
              <div className="text-9xl mb-4 filter drop-shadow-md">
                {option.emoji}
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {option.name[lang]}
              </p>
              {showCorrectAnswer && (
                <div className="text-4xl mt-4 text-green-700 font-bold">
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
              ? "Διάλεξε τα κατάλληλα ρούχα για τον καιρό!"
              : "Choose the right clothes for the weather!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300/90 to-blue-400/90 dark:from-slate-800/95 dark:to-slate-700/95 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌤️🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Ξέρεις τι να φοράς!"
                : "You know what to wear!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

