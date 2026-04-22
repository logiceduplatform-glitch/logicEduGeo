// src/components/games/FirstLetterGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FirstLetterGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 12; // 12 λέξεις

  const wordsData = {
    el: [
      {
        id: 1,
        word: "Αυτοκίνητο",
        emoji: "🚗",
        correct: "Α",
        options: ["Α", "Β", "Τ"],
        color: "#3B82F6"
      },
      {
        id: 2,
        word: "Μήλο",
        emoji: "🍎",
        correct: "Μ",
        options: ["Μ", "Π", "Α"],
        color: "#EF4444"
      },
      {
        id: 3,
        word: "Γάτα",
        emoji: "🐱",
        correct: "Γ",
        options: ["Γ", "Κ", "Λ"],
        color: "#F59E0B"
      },
      {
        id: 4,
        word: "Σπίτι",
        emoji: "🏠",
        correct: "Σ",
        options: ["Σ", "Π", "Τ"],
        color: "#10B981"
      },
      {
        id: 5,
        word: "Δέντρο",
        emoji: "🌳",
        correct: "Δ",
        options: ["Δ", "Τ", "Ν"],
        color: "#14B8A6"
      },
      {
        id: 6,
        word: "Ψάρι",
        emoji: "🐟",
        correct: "Ψ",
        options: ["Ψ", "Π", "Ρ"],
        color: "#06B6D4"
      },
      {
        id: 7,
        word: "Λουλούδι",
        emoji: "🌸",
        correct: "Λ",
        options: ["Λ", "Ρ", "Φ"],
        color: "#EC4899"
      },
      {
        id: 8,
        word: "Βιβλίο",
        emoji: "📚",
        correct: "Β",
        options: ["Β", "Π", "Μ"],
        color: "#8B5CF6"
      },
      {
        id: 9,
        word: "Καρπούζι",
        emoji: "🍉",
        correct: "Κ",
        options: ["Κ", "Γ", "Χ"],
        color: "#22C55E"
      },
      {
        id: 10,
        word: "Ήλιος",
        emoji: "☀️",
        correct: "Η",
        options: ["Η", "Λ", "Ι"],
        color: "#F97316"
      },
      {
        id: 11,
        word: "Ρολόι",
        emoji: "⏰",
        correct: "Ρ",
        options: ["Ρ", "Λ", "Π"],
        color: "#A855F7"
      },
      {
        id: 12,
        word: "Ζώο",
        emoji: "🦁",
        correct: "Ζ",
        options: ["Ζ", "Ξ", "Σ"],
        color: "#EAB308"
      }
    ],
    en: [
      {
        id: 1,
        word: "Apple",
        emoji: "🍎",
        correct: "A",
        options: ["A", "E", "P"],
        color: "#EF4444"
      },
      {
        id: 2,
        word: "Book",
        emoji: "📚",
        correct: "B",
        options: ["B", "P", "D"],
        color: "#8B5CF6"
      },
      {
        id: 3,
        word: "Cat",
        emoji: "🐱",
        correct: "C",
        options: ["C", "K", "S"],
        color: "#F59E0B"
      },
      {
        id: 4,
        word: "Dog",
        emoji: "🐶",
        correct: "D",
        options: ["D", "B", "G"],
        color: "#10B981"
      },
      {
        id: 5,
        word: "Fish",
        emoji: "🐟",
        correct: "F",
        options: ["F", "P", "V"],
        color: "#06B6D4"
      },
      {
        id: 6,
        word: "House",
        emoji: "🏠",
        correct: "H",
        options: ["H", "N", "M"],
        color: "#10B981"
      },
      {
        id: 7,
        word: "Lion",
        emoji: "🦁",
        correct: "L",
        options: ["L", "I", "T"],
        color: "#EAB308"
      },
      {
        id: 8,
        word: "Sun",
        emoji: "☀️",
        correct: "S",
        options: ["S", "C", "Z"],
        color: "#F97316"
      },
      {
        id: 9,
        word: "Tree",
        emoji: "🌳",
        correct: "T",
        options: ["T", "D", "P"],
        color: "#14B8A6"
      },
      {
        id: 10,
        word: "Water",
        emoji: "💧",
        correct: "W",
        options: ["W", "V", "M"],
        color: "#06B6D4"
      },
      {
        id: 11,
        word: "Car",
        emoji: "🚗",
        correct: "C",
        options: ["C", "K", "G"],
        color: "#3B82F6"
      },
      {
        id: 12,
        word: "Flower",
        emoji: "🌸",
        correct: "F",
        options: ["F", "P", "V"],
        color: "#EC4899"
      }
    ]
  };

  const words = wordsData[lang];
  const round = words[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔤", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(round.word);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak word automatically when round changes
    const timer = setTimeout(() => {
      speakWord();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleLetterSelect = (letter) => {
    if (showAnswer) return;

    setSelectedLetter(letter);
    setShowAnswer(true);

    const isCorrect = letter === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "First Letter Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "First Letter Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedLetter(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedLetter(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Πρώτο Γράμμα" : "First Letter"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Word ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            🔤 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-4">{round.emoji}</div>
          <h2 className="text-4xl font-bold mb-4 text-slate-800" style={{ color: round.color }}>
            {round.word}
          </h2>

          <button
            onClick={speakWord}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Ποιο είναι το πρώτο γράμμα;" : "What is the first letter?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-6">
          {round.options.map((letter) => {
            const isSelected = selectedLetter === letter;
            const isCorrect = showAnswer && letter === round.correct;
            const isWrong = showAnswer && isSelected && letter !== round.correct;

            return (
              <button
                key={letter}
                onClick={() => handleLetterSelect(letter)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-emerald-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && letter !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <p className="text-8xl font-bold text-slate-800 mb-2">{letter}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedLetter === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? `🎉 Μπράβο! ${round.word} αρχίζει από ${round.correct}!` : `🎉 Great! ${round.word} starts with ${round.correct}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? `Όχι! ${round.word} αρχίζει από ${round.correct}` : `No! ${round.word} starts with ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-emerald-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔤🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις τα πρώτα γράμματα!" : "Perfect! You know the first letters!"}
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

