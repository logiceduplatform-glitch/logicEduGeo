// src/components/games/exercises_4_5/FindRhyme.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FindRhyme({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8; // 8 ρίμες

  const rhymesData = {
    el: [
      {
        id: 1,
        word: { text: "Γάτα", emoji: "🐱" },
        options: [
          { id: 1, text: "Πατάτα", emoji: "🥔", correct: true },
          { id: 2, text: "Σκύλος", emoji: "🐕", correct: false },
          { id: 3, text: "Μήλο", emoji: "🍎", correct: false },
        ]
      },
      {
        id: 2,
        word: { text: "Ψάρι", emoji: "🐟" },
        options: [
          { id: 1, text: "Αστέρι", emoji: "⭐", correct: true },
          { id: 2, text: "Λουλούδι", emoji: "🌸", correct: false },
          { id: 3, text: "Καρότο", emoji: "🥕", correct: false },
        ]
      },
      {
        id: 3,
        word: { text: "Πόρτα", emoji: "🚪" },
        options: [
          { id: 1, text: "Τούρτα", emoji: "🎂", correct: true },
          { id: 2, text: "Παράθυρο", emoji: "🪟", correct: false },
          { id: 3, text: "Τραπέζι", emoji: "🪑", correct: false },
        ]
      },
      {
        id: 4,
        word: { text: "Φεγγάρι", emoji: "🌙" },
        options: [
          { id: 1, text: "Καλεντάρι", emoji: "📅", correct: true },
          { id: 2, text: "Ήλιος", emoji: "☀️", correct: false },
          { id: 3, text: "Σύννεφο", emoji: "☁️", correct: false },
        ]
      },
      {
        id: 5,
        word: { text: "Καρδιά", emoji: "❤️" },
        options: [
          { id: 1, text: "Αρκούδα", emoji: "🐻", correct: false },
          { id: 2, text: "Παγωτό", emoji: "🍦", correct: false },
          { id: 3, text: "Φωτιά", emoji: "🔥", correct: true },
        ]
      },
      {
        id: 6,
        word: { text: "Λουλούδι", emoji: "🌸" },
        options: [
          { id: 1, text: "Περιστέρι", emoji: "🕊️", correct: false },
          { id: 2, text: "Τραγούδι", emoji: "🎵", correct: true },
          { id: 3, text: "Δέντρο", emoji: "🌳", correct: false },
        ]
      },
      {
        id: 7,
        word: { text: "Μέλισσα", emoji: "🐝" },
        options: [
          { id: 1, text: "Θάλασσα", emoji: "🌊", correct: true },
          { id: 2, text: "Βουνό", emoji: "⛰️", correct: false },
          { id: 3, text: "Πεταλούδα", emoji: "🦋", correct: false },
        ]
      },
      {
        id: 8,
        word: { text: "Κουδούνι", emoji: "🔔" },
        options: [
          { id: 1, text: "Λεμόνι", emoji: "🍋", correct: true },
          { id: 2, text: "Πορτοκάλι", emoji: "🍊", correct: false },
          { id: 3, text: "Μπανάνα", emoji: "🍌", correct: false },
        ]
      }
    ],
    en: [
      {
        id: 1,
        word: { text: "Cat", emoji: "🐱" },
        options: [
          { id: 1, text: "Hat", emoji: "🎩", correct: true },
          { id: 2, text: "Dog", emoji: "🐕", correct: false },
          { id: 3, text: "Fish", emoji: "🐟", correct: false },
        ]
      },
      {
        id: 2,
        word: { text: "Tree", emoji: "🌳" },
        options: [
          { id: 1, text: "Bee", emoji: "🐝", correct: true },
          { id: 2, text: "Flower", emoji: "🌸", correct: false },
          { id: 3, text: "Bird", emoji: "🐦", correct: false },
        ]
      },
      {
        id: 3,
        word: { text: "Star", emoji: "⭐" },
        options: [
          { id: 1, text: "Car", emoji: "🚗", correct: true },
          { id: 2, text: "Moon", emoji: "🌙", correct: false },
          { id: 3, text: "Sun", emoji: "☀️", correct: false },
        ]
      },
      {
        id: 4,
        word: { text: "Mouse", emoji: "🐭" },
        options: [
          { id: 1, text: "House", emoji: "🏠", correct: true },
          { id: 2, text: "Cheese", emoji: "🧀", correct: false },
          { id: 3, text: "Cat", emoji: "🐱", correct: false },
        ]
      },
      {
        id: 5,
        word: { text: "Bear", emoji: "🐻" },
        options: [
          { id: 1, text: "Hair", emoji: "💇", correct: true },
          { id: 2, text: "Fish", emoji: "🐟", correct: false },
          { id: 3, text: "Honey", emoji: "🍯", correct: false },
        ]
      },
      {
        id: 6,
        word: { text: "Cake", emoji: "🎂" },
        options: [
          { id: 1, text: "Snake", emoji: "🐍", correct: true },
          { id: 2, text: "Candle", emoji: "🕯️", correct: false },
          { id: 3, text: "Party", emoji: "🎉", correct: false },
        ]
      },
      {
        id: 7,
        word: { text: "Boat", emoji: "⛵" },
        options: [
          { id: 1, text: "Goat", emoji: "🐐", correct: true },
          { id: 2, text: "Water", emoji: "💧", correct: false },
          { id: 3, text: "Fish", emoji: "🐟", correct: false },
        ]
      },
      {
        id: 8,
        word: { text: "Book", emoji: "📚" },
        options: [
          { id: 1, text: "Cook", emoji: "👨‍🍳", correct: true },
          { id: 2, text: "Pencil", emoji: "✏️", correct: false },
          { id: 3, text: "Paper", emoji: "📄", correct: false },
        ]
      }
    ]
  };

  const rhymes = rhymesData[lang];
  const round = rhymes[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🎵", "🎶"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakWord = (word) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = lang === "el" ? 0.7 : 0.85;
    utterance.pitch = 1.1;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleOptionSelect = (option) => {
    if (showAnswer) return;

    setSelectedOption(option.id);
    setShowAnswer(true);

    // Άκουσε τη λέξη που επέλεξε
    speakWord(option.text);

    if (option.correct) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Find Rhyme",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Find Rhyme",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedOption(null);
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
        setSelectedOption(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βρες τη Ρίμα" : "Find the Rhyme"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ρίμα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Rhyme ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🎵 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
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
            ? "🎶 Ποια λέξη κάνει ρίμα;"
            : "🎶 Which word rhymes?"}
        </p>
      </div>

      {/* Main Word Card */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl shadow-2xl p-8 border-4 border-purple-300">
          <div className="text-center">
            <div className="text-9xl mb-4 animate-bounce">
              {round.word.emoji}
            </div>
            <h2 className="text-5xl font-bold text-purple-700 mb-4">
              {round.word.text}
            </h2>
            <button
              onClick={() => speakWord(round.word.text)}
              className="px-6 py-3 bg-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform text-purple-600"
            >
              🔊 {lang === "el" ? "Άκουσε" : "Listen"}
            </button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {round.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.correct && showAnswer;
          const isWrong = isSelected && !option.correct && showAnswer;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              disabled={showAnswer}
              className={`
                relative p-8 rounded-2xl border-4 transition-all duration-300 transform
                ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                ${!showAnswer ? "bg-white border-purple-300 hover:border-purple-500 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                ${showAnswer && !isSelected && !option.correct ? "opacity-50" : ""}
              `}
            >
              <div className="text-7xl mb-4">{option.emoji}</div>
              <div className="text-2xl font-bold text-slate-700 mb-2">
                {option.text}
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

      {/* Feedback Message */}
      {showAnswer && (
        <div className="mt-8 text-center animate-fadeIn">
          {round.options.find(o => o.id === selectedOption)?.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Μπράβο! Κάνουν ρίμα!" : "🎉 Great! They rhyme!"}
              </p>
            </div>
          ) : (
            <div className="bg-orange-100 rounded-2xl p-6 inline-block border-4 border-orange-400">
              <p className="text-3xl font-bold text-orange-700">
                {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎵🏆</div>
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

