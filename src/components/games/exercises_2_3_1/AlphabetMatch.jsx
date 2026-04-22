// src/components/games/AlphabetMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function AlphabetMatch({ lang = "el", onComplete }) {
  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [usedLetters, setUsedLetters] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const greekLetters = [
    { id: 1, letter: "Α", word: { el: "Αυτοκίνητο", en: "Car" }, emoji: "🚗" },
    { id: 2, letter: "Β", word: { el: "Βάτραχος", en: "Frog" }, emoji: "🐸" },
    { id: 3, letter: "Γ", word: { el: "Γάτα", en: "Cat" }, emoji: "🐱" },
    { id: 4, letter: "Δ", word: { el: "Δέντρο", en: "Tree" }, emoji: "🌳" },
    { id: 5, letter: "Ε", word: { el: "Ελέφαντας", en: "Elephant" }, emoji: "🐘" },
    { id: 6, letter: "Ζ", word: { el: "Ζέβρα", en: "Zebra" }, emoji: "🦓" },
    { id: 7, letter: "Η", word: { el: "Ήλιος", en: "Sun" }, emoji: "☀️" },
    { id: 8, letter: "Θ", word: { el: "Θάλασσα", en: "Sea" }, emoji: "🌊" },
    { id: 9, letter: "Ι", word: { el: "Ιπποπόταμος", en: "Hippo" }, emoji: "🦛" },
    { id: 10, letter: "Κ", word: { el: "Καρδιά", en: "Heart" }, emoji: "❤️" },
    { id: 11, letter: "Λ", word: { el: "Λιοντάρι", en: "Lion" }, emoji: "🦁" },
    { id: 12, letter: "Μ", word: { el: "Μπανάνα", en: "Banana" }, emoji: "🍌" },
    { id: 13, letter: "Ν", word: { el: "Νερό", en: "Water" }, emoji: "💧" },
    { id: 14, letter: "Ξ", word: { el: "Ξύλο", en: "Wood" }, emoji: "🪵" },
    { id: 15, letter: "Ο", word: { el: "Ομπρέλα", en: "Umbrella" }, emoji: "☂️" },
    { id: 16, letter: "Π", word: { el: "Πουλί", en: "Bird" }, emoji: "🐦" },
    { id: 17, letter: "Ρ", word: { el: "Ρολόι", en: "Clock" }, emoji: "⏰" },
    { id: 18, letter: "Σ", word: { el: "Σκύλος", en: "Dog" }, emoji: "🐶" },
    { id: 19, letter: "Τ", word: { el: "Τρένο", en: "Train" }, emoji: "🚂" },
    { id: 20, letter: "Υ", word: { el: "Υπολογιστής", en: "Computer" }, emoji: "💻" },
    { id: 21, letter: "Φ", word: { el: "Φεγγάρι", en: "Moon" }, emoji: "🌙" },
    { id: 22, letter: "Χ", word: { el: "Χελώνα", en: "Turtle" }, emoji: "🐢" },
    { id: 23, letter: "Ψ", word: { el: "Ψάρι", en: "Fish" }, emoji: "🐠" },
    { id: 24, letter: "Ω", word: { el: "Ωκεανός", en: "Ocean" }, emoji: "🌊" },
  ];

  const englishLetters = [
    { id: 1, letter: "A", word: { el: "Apple", en: "Apple" }, emoji: "🍎" },
    { id: 2, letter: "B", word: { el: "Ball", en: "Ball" }, emoji: "⚽" },
    { id: 3, letter: "C", word: { el: "Cat", en: "Cat" }, emoji: "🐱" },
    { id: 4, letter: "D", word: { el: "Dog", en: "Dog" }, emoji: "🐶" },
    { id: 5, letter: "E", word: { el: "Elephant", en: "Elephant" }, emoji: "🐘" },
    { id: 6, letter: "F", word: { el: "Fish", en: "Fish" }, emoji: "🐠" },
    { id: 7, letter: "G", word: { el: "Grapes", en: "Grapes" }, emoji: "🍇" },
    { id: 8, letter: "H", word: { el: "House", en: "House" }, emoji: "🏠" },
    { id: 9, letter: "I", word: { el: "Ice cream", en: "Ice cream" }, emoji: "🍦" },
    { id: 10, letter: "J", word: { el: "Juice", en: "Juice" }, emoji: "🧃" },
    { id: 11, letter: "K", word: { el: "Kite", en: "Kite" }, emoji: "🪁" },
    { id: 12, letter: "L", word: { el: "Lion", en: "Lion" }, emoji: "🦁" },
    { id: 13, letter: "M", word: { el: "Moon", en: "Moon" }, emoji: "🌙" },
    { id: 14, letter: "N", word: { el: "Nose", en: "Nose" }, emoji: "👃" },
    { id: 15, letter: "O", word: { el: "Orange", en: "Orange" }, emoji: "🍊" },
    { id: 16, letter: "P", word: { el: "Pizza", en: "Pizza" }, emoji: "🍕" },
    { id: 17, letter: "Q", word: { el: "Queen", en: "Queen" }, emoji: "👸" },
    { id: 18, letter: "R", word: { el: "Rainbow", en: "Rainbow" }, emoji: "🌈" },
    { id: 19, letter: "S", word: { el: "Sun", en: "Sun" }, emoji: "☀️" },
    { id: 20, letter: "T", word: { el: "Tree", en: "Tree" }, emoji: "🌳" },
    { id: 21, letter: "U", word: { el: "Umbrella", en: "Umbrella" }, emoji: "☂️" },
    { id: 22, letter: "V", word: { el: "Van", en: "Van" }, emoji: "🚐" },
    { id: 23, letter: "W", word: { el: "Watermelon", en: "Watermelon" }, emoji: "🍉" },
    { id: 24, letter: "X", word: { el: "Xylophone", en: "Xylophone" }, emoji: "🎹" },
    { id: 25, letter: "Y", word: { el: "Yo-yo", en: "Yo-yo" }, emoji: "🪀" },
    { id: 26, letter: "Z", word: { el: "Zebra", en: "Zebra" }, emoji: "🦓" },
  ];

  const letters = lang === "el" ? greekLetters : englishLetters;
  const TARGET_SCORE = 12;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewLetter();
  }, [lang]);

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

  const selectNewLetter = () => {
    const availableLetters = letters.filter(
      (letter) => !usedLetters.includes(letter.id)
    );

    if (availableLetters.length === 0) {
      return;
    }

    const randomLetter =
      availableLetters[Math.floor(Math.random() * availableLetters.length)];
    setCurrentLetter(randomLetter);

    // Δημιουργία επιλογών (η σωστή + 2 λάθος)
    const wrongLetters = letters.filter((l) => l.id !== randomLetter.id);
    const shuffled = wrongLetters.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 2);
    const allOptions = [randomLetter, ...selectedWrong].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);

    setSelectedOption(null);
    setFeedback(null);
  };

  const handleOptionSelect = (option) => {
    if (!currentLetter || feedback !== null) return;

    setSelectedOption(option.id);

    if (option.id === currentLetter.id) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);
      setUsedLetters((prev) => [...prev, currentLetter.id]);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Alphabet Match",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Alphabet Match",
        score: 1,
        total: 1,
      });

      // Επόμενο γράμμα μετά από 1.8 δευτερόλεπτα
      setTimeout(() => {
        selectNewLetter();
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
      emoji: ["🔤", "📚", "⭐", "✨", "🌟", "🎉"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentLetter) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  return (
    <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "🔤 Αλφάβητο" : "🔤 Alphabet"}
            </h3>
            <div className="text-2xl font-bold text-indigo-600">
              📚 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          {lang === "el"
            ? "🤔 Με ποιο γράμμα αρχίζει;"
            : "🤔 Which letter does it start with?"}
        </h2>

        {/* Word Display */}
        <div className="mb-8">
          <div className="inline-block bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-9xl mb-4 filter drop-shadow-lg animate-bounce">
              {currentLetter.emoji}
            </div>
            <p className="text-4xl font-bold text-slate-800 mb-2">
              {currentLetter.word[lang]}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {lang === "el"
                ? "Με ποιο γράμμα αρχίζει;"
                : "What letter does it start with?"}
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

      {/* Letter Options */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.id === currentLetter.id;
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
                border-4 border-indigo-300 dark:border-slate-600
                p-8 rounded-2xl shadow-lg
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl hover:border-indigo-500
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-100 border-green-500" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-100 border-red-500" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-100 border-green-500" : ""}
              `}
            >
              <div className="text-8xl font-bold text-indigo-600 mb-3 filter drop-shadow-md">
                {option.letter}
              </div>
              <div className="text-3xl mb-2">{option.emoji}</div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {option.word[lang]}
              </p>
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
          <p className="text-sm text-slate-600 bg-white/70 inline-block px-6 py-3 rounded-xl shadow">
            💡 {lang === "el"
              ? "Διάλεξε το γράμμα με το οποίο αρχίζει η λέξη!"
              : "Choose the letter that the word starts with!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/90 to-purple-400/90 dark:from-slate-800/95 dark:to-slate-700/95 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔤🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Έμαθες τα γράμματα!"
                : "You learned the letters!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

