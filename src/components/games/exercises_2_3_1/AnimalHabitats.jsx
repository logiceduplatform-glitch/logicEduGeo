// src/components/games/AnimalHabitats.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function AnimalHabitats({ lang = "el", onComplete }) {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [usedAnimals, setUsedAnimals] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const habitats = [
    {
      id: "sea",
      name: { el: "Θάλασσα", en: "Sea" },
      emoji: "🌊",
      color: "bg-blue-100",
      borderColor: "border-blue-400",
      gradient: "from-blue-200 to-cyan-200",
    },
    {
      id: "land",
      name: { el: "Ξηρά", en: "Land" },
      emoji: "🌳",
      color: "bg-green-100",
      borderColor: "border-green-400",
      gradient: "from-green-200 to-emerald-200",
    },
    {
      id: "sky",
      name: { el: "Ουρανός", en: "Sky" },
      emoji: "☁️",
      color: "bg-sky-100",
      borderColor: "border-sky-400",
      gradient: "from-sky-200 to-blue-200",
    },
  ];

  const animals = [
    // Θάλασσα
    { id: 1, emoji: "🐠", name: { el: "Ψάρι", en: "Fish" }, habitat: "sea" },
    { id: 2, emoji: "🐙", name: { el: "Χταπόδι", en: "Octopus" }, habitat: "sea" },
    { id: 3, emoji: "🐬", name: { el: "Δελφίνι", en: "Dolphin" }, habitat: "sea" },
    { id: 4, emoji: "🦈", name: { el: "Καρχαρίας", en: "Shark" }, habitat: "sea" },
    { id: 5, emoji: "🐳", name: { el: "Φάλαινα", en: "Whale" }, habitat: "sea" },
    { id: 6, emoji: "🦀", name: { el: "Καβούρι", en: "Crab" }, habitat: "sea" },

    // Ξηρά
    { id: 7, emoji: "🐶", name: { el: "Σκύλος", en: "Dog" }, habitat: "land" },
    { id: 8, emoji: "🐱", name: { el: "Γάτα", en: "Cat" }, habitat: "land" },
    { id: 9, emoji: "🐘", name: { el: "Ελέφαντας", en: "Elephant" }, habitat: "land" },
    { id: 10, emoji: "🦁", name: { el: "Λιοντάρι", en: "Lion" }, habitat: "land" },
    { id: 11, emoji: "🐻", name: { el: "Αρκούδα", en: "Bear" }, habitat: "land" },
    { id: 12, emoji: "🐸", name: { el: "Βάτραχος", en: "Frog" }, habitat: "land" },

    // Ουρανός
    { id: 13, emoji: "🐦", name: { el: "Πουλί", en: "Bird" }, habitat: "sky" },
    { id: 14, emoji: "🦅", name: { el: "Αετός", en: "Eagle" }, habitat: "sky" },
    { id: 15, emoji: "🦉", name: { el: "Κουκουβάγια", en: "Owl" }, habitat: "sky" },
    { id: 16, emoji: "🦋", name: { el: "Πεταλούδα", en: "Butterfly" }, habitat: "sky" },
    { id: 17, emoji: "🐝", name: { el: "Μέλισσα", en: "Bee" }, habitat: "sky" },
    { id: 18, emoji: "🦜", name: { el: "Παπαγάλος", en: "Parrot" }, habitat: "sky" },
  ];

  const TARGET_SCORE = 12; // 12 ζώα

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
    const availableAnimals = animals.filter(
      (animal) => !usedAnimals.includes(animal.id)
    );

    if (availableAnimals.length === 0) {
      // Όλα τα ζώα χρησιμοποιήθηκαν
      return;
    }

    const randomAnimal =
      availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
    setCurrentAnimal(randomAnimal);
    setSelectedHabitat(null);
    setFeedback(null);
  };

  const handleHabitatSelect = (habitatId) => {
    if (!currentAnimal || feedback !== null) return;

    setSelectedHabitat(habitatId);

    if (habitatId === currentAnimal.habitat) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);
      setUsedAnimals((prev) => [...prev, currentAnimal.id]);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Animal Habitats",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Animal Habitats",
        score: 1,
        total: 1,
      });

      // Επόμενο ζώο μετά από 1.5 δευτερόλεπτα
      setTimeout(() => {
        selectNewAnimal();
      }, 1500);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
        setSelectedHabitat(null);
      }, 1000);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🌊", "🌳", "☁️", "⭐", "✨", "🌟", "🎉"][
        Math.floor(Math.random() * 7)
      ],
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

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  return (
    <div className="bg-gradient-to-br from-cyan-100 via-green-100 to-blue-100 rounded-xl shadow-lg p-8 relative overflow-hidden">
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
              {lang === "el" ? "🌍 Που Ζει;" : "🌍 Where Does It Live?"}
            </h3>
            <div className="text-2xl font-bold text-green-600">
              🏠 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-green-500 transition-all duration-500 ease-out"
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
          {lang === "el" ? "🤔 Που ζει αυτό το ζώο;" : "🤔 Where does this animal live?"}
        </h2>

        {/* Current Animal Display */}
        <div className="mb-8">
          <div className="inline-block bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="text-9xl mb-4 filter drop-shadow-lg animate-bounce">
              {currentAnimal.emoji}
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {currentAnimal.name[lang]}
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

      {/* Habitat Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {habitats.map((habitat) => {
          const isSelected = selectedHabitat === habitat.id;
          const isCorrect = currentAnimal.habitat === habitat.id;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={habitat.id}
              onClick={() => handleHabitatSelect(habitat.id)}
              disabled={feedback !== null}
              className={`
                ${habitat.color}
                border-4 ${habitat.borderColor}
                p-8 rounded-3xl shadow-xl
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-200" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-200" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-200" : ""}
              `}
            >
              <div className="text-8xl mb-4 filter drop-shadow-md">
                {habitat.emoji}
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-2">
                {habitat.name[lang]}
              </p>
              {showCorrectAnswer && (
                <div className="text-4xl mt-3 text-green-700 font-bold">
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
          <p className="text-sm text-slate-600 bg-white/70 inline-block px-6 py-3 rounded-xl shadow">
            💡 {lang === "el"
              ? "Πάτα το σωστό περιβάλλον όπου ζει το ζώο!"
              : "Tap the correct habitat where the animal lives!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/90 to-green-400/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌍🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Έμαθες που ζουν τα ζώα!"
                : "You learned where animals live!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

