// src/components/games/exercises_4_5/NumberRecognition.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function NumberRecognition({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10; // 10 αριθμοί (0-9)

  const greekNumbers = {
    0: "μηδέν",
    1: "ένα",
    2: "δύο",
    3: "τρία",
    4: "τέσσερα",
    5: "πέντε",
    6: "έξι",
    7: "επτά",
    8: "οκτώ",
    9: "εννέα"
  };

  const roundsData = {
    el: [
      { id: 1, targetNumber: 3, emoji: "🍎", label: "μήλα", options: [2, 3, 4] },
      { id: 2, targetNumber: 5, emoji: "⭐", label: "αστέρια", options: [4, 5, 6] },
      { id: 3, targetNumber: 1, emoji: "🌙", label: "φεγγάρι", options: [0, 1, 2] },
      { id: 4, targetNumber: 7, emoji: "🦋", label: "πεταλούδες", options: [6, 7, 8] },
      { id: 5, targetNumber: 4, emoji: "🌸", label: "λουλούδια", options: [3, 4, 5] },
      { id: 6, targetNumber: 2, emoji: "🐱", label: "γάτες", options: [1, 2, 3] },
      { id: 7, targetNumber: 6, emoji: "🍌", label: "μπανάνες", options: [5, 6, 7] },
      { id: 8, targetNumber: 8, emoji: "🎈", label: "μπαλόνια", options: [7, 8, 9] },
      { id: 9, targetNumber: 0, emoji: "🎁", label: "δώρα", options: [0, 1, 2] },
      { id: 10, targetNumber: 9, emoji: "🍒", label: "κεράσια", options: [8, 9, 7] }
    ],
    en: [
      { id: 1, targetNumber: 3, emoji: "🍎", label: "apples", options: [2, 3, 4] },
      { id: 2, targetNumber: 5, emoji: "⭐", label: "stars", options: [4, 5, 6] },
      { id: 3, targetNumber: 1, emoji: "🌙", label: "moon", options: [0, 1, 2] },
      { id: 4, targetNumber: 7, emoji: "🦋", label: "butterflies", options: [6, 7, 8] },
      { id: 5, targetNumber: 4, emoji: "🌸", label: "flowers", options: [3, 4, 5] },
      { id: 6, targetNumber: 2, emoji: "🐱", label: "cats", options: [1, 2, 3] },
      { id: 7, targetNumber: 6, emoji: "🍌", label: "bananas", options: [5, 6, 7] },
      { id: 8, targetNumber: 8, emoji: "🎈", label: "balloons", options: [7, 8, 9] },
      { id: 9, targetNumber: 0, emoji: "🎁", label: "gifts", options: [0, 1, 2] },
      { id: 10, targetNumber: 9, emoji: "🍒", label: "cherries", options: [8, 9, 7] }
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

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "👏"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakNumber = (number) => {
    window.speechSynthesis.cancel();
    const textToSpeak = lang === "el" ? greekNumbers[number] : number.toString();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = lang === "el" ? 0.6 : 0.75;
    utterance.pitch = 1.2;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleNumberSelect = (number) => {
    if (showAnswer) return;

    setSelectedNumber(number);
    setShowAnswer(true);

    // Άκουσε τον αριθμό που επέλεξε
    speakNumber(number);

    const isCorrect = number === round.targetNumber;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Number Recognition",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Number Recognition",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedNumber(null);
          setShowAnswer(false);
        } else {
          // Τελείωσαν όλοι οι γύροι
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedNumber(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Αναγνώριση Αριθμών" : "Number Recognition"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Αριθμός ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Number ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🔢 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? "🔢 Μέτρησε και βρες τον σωστό αριθμό!"
            : "🔢 Count and find the correct number!"}
        </p>
      </div>

      {/* Items Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-orange-300">
          {/* Items Grid */}
          <div className={`grid gap-4 mb-6 ${
            round.targetNumber === 0 ? 'grid-cols-1' :
            round.targetNumber <= 3 ? 'grid-cols-3' :
            round.targetNumber <= 6 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {round.targetNumber === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-8xl mb-4">❌</div>
                <p className="text-2xl font-bold text-slate-600">
                  {lang === "el" ? "Κανένα!" : "None!"}
                </p>
              </div>
            ) : (
              Array.from({ length: round.targetNumber }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center p-4 bg-orange-50 rounded-2xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-7xl">{round.emoji}</div>
                </div>
              ))
            )}
          </div>

          {/* Label */}
          <div className="text-center">
            <div className="inline-block bg-orange-100 rounded-xl px-8 py-3 border-3 border-orange-300">
              <span className="text-2xl font-bold text-orange-700">
                {lang === "el" ? `Πόσα ${round.label};` : `How many ${round.label}?`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Number Options */}
      <div className="max-w-4xl mx-auto">
        <h4 className="text-xl font-bold text-center mb-6 text-slate-700">
          {lang === "el" ? "Επιλογές Αριθμών" : "Number Options"}
        </h4>
        <div className="flex justify-center gap-6">
          {round.options.map((option) => {
            const isSelected = selectedNumber === option;
            const isCorrect = showAnswer && option === round.targetNumber;
            const isWrong = showAnswer && isSelected && option !== round.targetNumber;

            return (
              <button
                key={option}
                onClick={() => handleNumberSelect(option)}
                disabled={showAnswer}
                className={`
                  relative w-32 h-32 flex items-center justify-center rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-110 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option !== round.targetNumber ? "opacity-50" : ""}
                `}
              >
                <div className="text-7xl font-bold text-orange-600">
                  {option}
                </div>
                {isCorrect && (
                  <div className="absolute -top-4 -right-4 text-5xl animate-bounce">
                    ✅
                  </div>
                )}
                {isWrong && (
                  <div className="absolute -top-4 -right-4 text-5xl">
                    ❌
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {showAnswer && (
        <div className="mt-8 text-center animate-fadeIn">
          {selectedNumber === round.targetNumber ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Μπράβο! Σωστός αριθμός!" : "🎉 Great! Correct number!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

