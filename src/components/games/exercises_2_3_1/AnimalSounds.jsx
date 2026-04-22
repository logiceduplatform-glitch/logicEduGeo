// src/components/games/AnimalSounds.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function AnimalSounds({ lang = "el", onComplete }) {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const animalSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const animals = [
    {
      id: "dog",
      name: { el: "Σκύλος", en: "Dog" },
      emoji: "🐶",
      sound: "woof",
      color: "bg-amber-400",
    },
    {
      id: "cat",
      name: { el: "Γάτα", en: "Cat" },
      emoji: "🐱",
      sound: "meow",
      color: "bg-orange-400",
    },
    {
      id: "cow",
      name: { el: "Αγελάδα", en: "Cow" },
      emoji: "🐮",
      sound: "moo",
      color: "bg-pink-300",
    },
    {
      id: "pig",
      name: { el: "Γουρούνι", en: "Pig" },
      emoji: "🐷",
      sound: "oink",
      color: "bg-rose-300",
    },
  ];

  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    // Αρχικοποίηση
    selectNewAnimal();
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE && !showCelebration) {
      createCelebrationEmojis();
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [score, showCelebration, onComplete]);

  const selectNewAnimal = () => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setCurrentAnimal(randomAnimal);
  };

  const playAnimalSound = () => {
    if (!currentAnimal || isPlayingSound) return;

    setIsPlayingSound(true);

    const utterance = new SpeechSynthesisUtterance(currentAnimal.sound);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlayingSound(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAnimalSelect = (selectedAnimal) => {
    if (!currentAnimal || feedback !== null) return;

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
        title: "Animal Sounds",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Animal Sounds",
        score: 1,
        total: 1,
      });

      // Επόμενο ζώο μετά από 1.5 δευτερόλεπτα
      setTimeout(() => {
        setFeedback(null);
        selectNewAnimal();
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

  const progressPercent = Math.round((score / TARGET_SCORE) * 100);

  if (!currentAnimal) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "Ζώα & Ήχοι!" : "Animal Sounds!"}
            </h2>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              🐾 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {score === 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg shadow-lg p-4 text-center">
            <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300">
              {lang === "el"
                ? "🔊 Πάτα το κουμπί για να ακούσεις το ζώο και μετά βρες το!"
                : "🔊 Tap the button to hear the animal, then find it!"}
            </p>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Sound Button */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-6">
            {lang === "el" ? "Ποιο ζώο κάνει αυτόν τον ήχο;" : "Which animal makes this sound?"}
          </h3>
          <div className="flex justify-center">
            <button
              onClick={playAnimalSound}
              disabled={isPlayingSound}
              className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl
                bg-gradient-to-br from-green-400 to-blue-500
                flex flex-col items-center justify-center gap-4
                transform transition-all duration-300 border-8 border-white
                hover:scale-105 active:scale-95
                ${isPlayingSound ? "scale-110 animate-pulse" : ""}
                disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              <div className="text-7xl sm:text-8xl">
                {isPlayingSound ? "🔊" : "🎵"}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                {lang === "el" ? "Άκου!" : "Listen!"}
              </div>
            </button>
          </div>
          <div className="text-center mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 italic">
            "{currentAnimal.sound}"
          </div>
        </div>

        {/* Animal Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {animals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleAnimalSelect(animal)}
              disabled={feedback !== null}
              className={`h-36 sm:h-44 rounded-3xl shadow-xl transform transition-all duration-200
                hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                flex flex-col items-center justify-center gap-2 border-4 border-white
                ${animal.color}
                ${feedback === "correct" && animal.id === currentAnimal.id ? "scale-110 ring-4 ring-green-400" : ""}
                ${feedback === "wrong" && animal.id === currentAnimal.id ? "animate-shake" : ""}`}
            >
              <div className="text-6xl sm:text-7xl">{animal.emoji}</div>
              <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white drop-shadow">
                {animal.name[lang]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback === "correct" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-9xl animate-bounce">
            ✅
          </div>
        </div>
      )}

      {feedback === "wrong" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-9xl animate-shake">
            ❌
          </div>
        </div>
      )}

      {/* Celebration Emojis */}
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl pointer-events-none z-40"
          style={{
            left: `${emoji.x}%`,
            top: "50%",
            animation: "float-up 2s ease-out forwards",
            animationDelay: `${emoji.delay}s`,
          }}
        >
          {emoji.emoji}
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

      {/* Celebration Overlay - Covers only the game board */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-blue-400/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🐾🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
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

