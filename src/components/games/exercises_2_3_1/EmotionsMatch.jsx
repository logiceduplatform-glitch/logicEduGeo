// src/components/games/EmotionsMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function EmotionsMatch({ lang = "el", onComplete }) {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const emotions = [
    {
      id: "happy",
      name: { el: "Χαρούμενος", en: "Happy" },
      emoji: "😊",
      color: "bg-yellow-400",
    },
    {
      id: "sad",
      name: { el: "Λυπημένος", en: "Sad" },
      emoji: "😢",
      color: "bg-blue-400",
    },
    {
      id: "angry",
      name: { el: "Θυμωμένος", en: "Angry" },
      emoji: "😠",
      color: "bg-red-400",
    },
    {
      id: "surprised",
      name: { el: "Έκπληκτος", en: "Surprised" },
      emoji: "😲",
      color: "bg-purple-400",
    },
    {
      id: "scared",
      name: { el: "Φοβισμένος", en: "Scared" },
      emoji: "😨",
      color: "bg-indigo-400",
    },
    {
      id: "love",
      name: { el: "Ερωτευμένος", en: "In Love" },
      emoji: "😍",
      color: "bg-pink-400",
    },
  ];

  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewEmotion();
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

  const selectNewEmotion = () => {
    // Επιλογή τυχαίου συναισθήματος
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);

    // Δημιουργία επιλογών (το σωστό + 2-3 λάθος)
    const wrongEmotions = emotions.filter((e) => e.id !== randomEmotion.id);
    const shuffled = wrongEmotions.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 3);
    const allOptions = [randomEmotion, ...selectedWrong].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
  };

  const handleEmotionSelect = (selectedEmotion) => {
    if (!currentEmotion || feedback !== null) return;

    if (selectedEmotion.id === currentEmotion.id) {
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
        title: "Emotions Match",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Emotions Match",
        score: 1,
        total: 1,
      });

      // Επόμενο συναίσθημα μετά από 1.5 δευτερόλεπτα
      setTimeout(() => {
        setFeedback(null);
        selectNewEmotion();
      }, 1500);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🎊"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentEmotion) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
      {/* Celebration Emojis */}
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none"
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
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </h3>
            <div className="text-2xl font-bold text-purple-600">
              🎭 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
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
          {lang === "el" ? "Πώς Νιώθει;" : "How Does It Feel?"}
        </h2>

        {/* Display Current Emotion to Match */}
        <div className="mb-6">
          <p className="text-xl text-slate-700 mb-4 font-semibold">
            {lang === "el"
              ? "Βρες το συναίσθημα:"
              : "Find the emotion:"}
          </p>
          <div className="inline-block bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-8xl mb-4">{currentEmotion.emoji}</div>
            <p className="text-2xl font-bold text-slate-800">
              {currentEmotion.name[lang]}
            </p>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback === "correct" && (
          <div className="text-4xl font-bold text-green-600 animate-bounce mb-4">
            {lang === "el" ? "Μπράβο! ✅" : "Great! ✅"}
          </div>
        )}
        {feedback === "wrong" && (
          <div className="text-3xl font-bold text-red-600 animate-shake mb-4">
            {lang === "el" ? "Προσπάθησε ξανά! ❌" : "Try again! ❌"}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {options.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleEmotionSelect(emotion)}
            disabled={feedback !== null}
            className={`
              ${emotion.color}
              p-6 rounded-2xl shadow-lg
              transform transition-all duration-200
              hover:scale-110 hover:shadow-2xl
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                feedback === "correct" && emotion.id === currentEmotion.id
                  ? "ring-4 ring-green-500 scale-110"
                  : ""
              }
              ${
                feedback === "wrong" && emotion.id === currentEmotion.id
                  ? "ring-4 ring-green-500"
                  : ""
              }
            `}
          >
            <div className="text-7xl mb-3">{emotion.emoji}</div>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              {emotion.name[lang]}
            </p>
          </button>
        ))}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/90 to-pink-400/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎭✨</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Ολοκλήρωσες το παιχνίδι!"
                : "You completed the game!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

