import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

const BODY_PARTS = [
  { id: 1, name: { el: "Μάτια", en: "Eyes" }, emoji: "👀", question: { el: "Που είναι τα μάτια;", en: "Where are the eyes?" } },
  { id: 2, name: { el: "Μύτη", en: "Nose" }, emoji: "👃", question: { el: "Που είναι η μύτη;", en: "Where is the nose?" } },
  { id: 3, name: { el: "Στόμα", en: "Mouth" }, emoji: "👄", question: { el: "Που είναι το στόμα;", en: "Where is the mouth?" } },
  { id: 4, name: { el: "Αυτιά", en: "Ears" }, emoji: "👂", question: { el: "Που είναι τα αυτιά;", en: "Where are the ears?" } },
  { id: 5, name: { el: "Χέρια", en: "Hands" }, emoji: "🙌", question: { el: "Που είναι τα χέρια;", en: "Where are the hands?" } },
  { id: 6, name: { el: "Πόδια", en: "Feet" }, emoji: "🦶", question: { el: "Που είναι τα πόδια;", en: "Where are the feet?" } },
  { id: 7, name: { el: "Κεφάλι", en: "Head" }, emoji: "🗣️", question: { el: "Που είναι το κεφάλι;", en: "Where is the head?" } },
  { id: 8, name: { el: "Δάχτυλα", en: "Fingers" }, emoji: "👆", question: { el: "Που είναι τα δάχτυλα;", en: "Where are the fingers?" } },
  { id: 9, name: { el: "Μαλλιά", en: "Hair" }, emoji: "💇", question: { el: "Που είναι τα μαλλιά;", en: "Where is the hair?" } },
  { id: 10, name: { el: "Πρόσωπο", en: "Face" }, emoji: "😊", question: { el: "Που είναι το πρόσωπο;", en: "Where is the face?" } },
];

const TARGET_SCORE = 10;

export default function BodyParts({ lang = "el", onComplete }) {
  const [currentPart, setCurrentPart] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [usedParts, setUsedParts] = useState([]);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const usedPartsRef = useRef(usedParts);
  const { updateProgress, completeQuiz } = useQuizProgress();

  usedPartsRef.current = usedParts;

  const selectNewPart = useCallback(() => {
    const availableParts = BODY_PARTS.filter(
      (part) => !usedPartsRef.current.includes(part.id)
    );

    if (availableParts.length === 0) {
      return;
    }

    const randomPart =
      availableParts[Math.floor(Math.random() * availableParts.length)];
    setCurrentPart(randomPart);

    const wrongParts = BODY_PARTS.filter((p) => p.id !== randomPart.id);
    const shuffled = [...wrongParts].sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 2);
    const allOptions = [randomPart, ...selectedWrong].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);

    setSelectedOption(null);
    setFeedback(null);
  }, []);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewPart();
  }, [selectNewPart]);

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

  const handleOptionSelect = (option) => {
    if (!currentPart || feedback !== null) return;

    setSelectedOption(option.id);

    if (option.id === currentPart.id) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);
      setUsedParts((prev) => [...prev, currentPart.id]);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      createCelebrationEmojis();

      updateProgress({
        title: "Body Parts",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      completeQuiz({
        title: "Body Parts",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        selectNewPart();
      }, 1800);
    } else {
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
      emoji: ["👶", "👋", "⭐", "✨", "🌟", "🎉"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentPart) {
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
    <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-xl shadow-lg p-8 relative overflow-hidden">
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
              {lang === "el" ? "👶 Μέλη του Σώματος" : "👶 Body Parts"}
            </h3>
            <div className="text-2xl font-bold text-rose-600">
              👋 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-orange-500 transition-all duration-500 ease-out"
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
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8 animate-pulse">
          {currentPart.question[lang]}
        </h2>

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

      {/* Body Part Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.id === currentPart.id;
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
                border-4 border-rose-300 dark:border-slate-600
                p-10 rounded-3xl shadow-xl
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl hover:border-rose-500
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
          <p className="text-sm text-slate-600 bg-white/70 inline-block px-6 py-3 rounded-xl shadow">
            💡 {lang === "el"
              ? "Πάτα το σωστό μέλος του σώματος!"
              : "Tap the correct body part!"}
          </p>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/90 to-orange-400/90 dark:from-slate-800/95 dark:to-slate-700/95 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👶🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Έμαθες τα μέλη του σώματος!"
                : "You learned the body parts!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

