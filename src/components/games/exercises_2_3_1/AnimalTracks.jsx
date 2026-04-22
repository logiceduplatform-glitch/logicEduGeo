// src/components/games/AnimalTracks.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function AnimalTracks({ lang = "el", onComplete }) {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const animals = [
    {
      id: "dog",
      name: { el: "Σκύλος", en: "Dog" },
      emoji: "🐶",
      trackPattern: ["🐾", "🐾", "🐾", "🐾"],
      trackStyle: "grid grid-cols-2 gap-3",
      trackDesc: { el: "Πατούσες σκύλου", en: "Dog paws" },
      color: "bg-amber-100",
      borderColor: "border-amber-400",
    },
    {
      id: "cat",
      name: { el: "Γάτα", en: "Cat" },
      emoji: "🐱",
      trackPattern: ["🐾", "🐾"],
      trackStyle: "flex gap-4",
      trackDesc: { el: "Πατούσες γάτας", en: "Cat paws" },
      color: "bg-orange-100",
      borderColor: "border-orange-400",
    },
    {
      id: "bird",
      name: { el: "Πουλί", en: "Bird" },
      emoji: "🐦",
      trackPattern: ["🦶", "🦶", "🦶"],
      trackStyle: "flex flex-col gap-2",
      trackDesc: { el: "Ίχνη πουλιού", en: "Bird tracks" },
      color: "bg-sky-100",
      borderColor: "border-sky-400",
    },
    {
      id: "elephant",
      name: { el: "Ελέφαντας", en: "Elephant" },
      emoji: "🐘",
      trackPattern: ["⭕", "⭕"],
      trackStyle: "flex gap-6",
      trackDesc: { el: "Ίχνη ελέφαντα", en: "Elephant tracks" },
      color: "bg-gray-100",
      borderColor: "border-gray-400",
    },
    {
      id: "horse",
      name: { el: "Άλογο", en: "Horse" },
      emoji: "🐴",
      trackPattern: ["🔹", "🔹", "🔹", "🔹"],
      trackStyle: "flex gap-3",
      trackDesc: { el: "Πατούσες αλόγου", en: "Horse hooves" },
      color: "bg-amber-200",
      borderColor: "border-amber-500",
    },
    {
      id: "rabbit",
      name: { el: "Κουνέλι", en: "Rabbit" },
      emoji: "🐰",
      trackPattern: ["🐾", "🐾", "🐾"],
      trackStyle: "flex gap-2",
      trackDesc: { el: "Πατούσες κουνελιού", en: "Rabbit tracks" },
      color: "bg-pink-100",
      borderColor: "border-pink-400",
    },
  ];

  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewAnimal();
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

  const selectNewAnimal = () => {
    // Επιλογή τυχαίου ζώου
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setCurrentAnimal(randomAnimal);

    // Δημιουργία επιλογών (το σωστό + 2 λάθος)
    const wrongAnimals = animals.filter((a) => a.id !== randomAnimal.id);
    const shuffled = wrongAnimals.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 2);
    const allOptions = [randomAnimal, ...selectedWrong].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
    setSelectedOption(null);
  };

  const handleAnimalSelect = (selectedAnimal) => {
    if (!currentAnimal || feedback !== null) return;

    setSelectedOption(selectedAnimal.id);

    if (selectedAnimal.id === currentAnimal.id) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Animal Tracks",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Animal Tracks",
        score: 1,
        total: 1,
      });

      // Επόμενο ζώο μετά από 1.8 δευτερόλεπτα
      setTimeout(() => {
        setFeedback(null);
        selectNewAnimal();
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
      emoji: ["🐾", "⭐", "✨", "🌟", "🎉"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentAnimal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </h3>
            <div className="text-2xl font-bold text-emerald-600">
              🐾 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${(score / TARGET_SCORE) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {Math.round((score / TARGET_SCORE) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          {lang === "el" ? "🐾 Βρες τα Ίχνη!" : "🐾 Find the Tracks!"}
        </h2>

        {/* Display Current Animal's Track */}
        <div className="mb-6">
          <p className="text-xl text-slate-700 mb-4 font-semibold">
            {lang === "el"
              ? "Ποιο ζώο άφησε αυτά τα ίχνη;"
              : "Which animal left these tracks?"}
          </p>
          <div className="inline-block bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
            <div className={`${currentAnimal.trackStyle} justify-center items-center text-7xl filter drop-shadow-lg`}>
              {currentAnimal.trackPattern.map((track, index) => (
                <div key={index} className="transform hover:scale-110 transition-transform">
                  {track}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback === "correct" && (
          <div className="text-4xl font-bold text-green-600 animate-bounce mb-4">
            {lang === "el" ? "Μπράβο! Σωστά! ✅" : "Great! Correct! ✅"}
          </div>
        )}
        {feedback === "wrong" && (
          <div className="text-3xl font-bold text-red-600 animate-shake mb-4">
            {lang === "el" ? "Προσπάθησε ξανά! ❌" : "Try again! ❌"}
          </div>
        )}
      </div>

      {/* Animal Options Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {options.map((animal) => {
          const isSelected = selectedOption === animal.id;
          const isCorrect = animal.id === currentAnimal.id;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={animal.id}
              onClick={() => handleAnimalSelect(animal)}
              disabled={feedback !== null}
              className={`
                ${animal.color}
                border-4 ${animal.borderColor}
                p-6 rounded-2xl shadow-lg
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-200" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-200" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-200" : ""}
              `}
            >
              <div className="text-8xl mb-3 filter drop-shadow-md">
                {animal.emoji}
              </div>
              <p className="text-lg font-bold text-slate-800">
                {animal.name[lang]}
              </p>
              {showCorrectAnswer && (
                <div className="text-2xl mt-2 text-green-700 font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/90 to-teal-400/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🐾🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Βρήκες όλα τα ίχνη!"
                : "You found all the tracks!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

