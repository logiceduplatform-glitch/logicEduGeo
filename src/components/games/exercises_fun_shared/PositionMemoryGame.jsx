// src/components/games/PositionMemoryGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function PositionMemoryGame({ lang = "el", difficulty = 3, onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showingAnimal, setShowingAnimal] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const REVEAL_TIME = [3000, 2500, 2000, 1500, 1000][d - 1];
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        animal: "🐶",
        animalName: "Σκύλος",
        position: 0,
        obstacles: ["🪴", "🪴", "🪴"],
        description: "Που πήγε ο σκύλος;"
      },
      {
        id: 2,
        animal: "🐱",
        animalName: "Γάτα",
        position: 1,
        obstacles: ["📦", "📦", "📦"],
        description: "Που πήγε η γάτα;"
      },
      {
        id: 3,
        animal: "🐰",
        animalName: "Λαγός",
        position: 2,
        obstacles: ["🎁", "🎁", "🎁"],
        description: "Που πήγε ο λαγός;"
      },
      {
        id: 4,
        animal: "🐻",
        animalName: "Αρκούδα",
        position: 0,
        obstacles: ["🌳", "🌳", "🌳"],
        description: "Που πήγε η αρκούδα;"
      },
      {
        id: 5,
        animal: "🦊",
        animalName: "Αλεπού",
        position: 2,
        obstacles: ["🪨", "🪨", "🪨"],
        description: "Που πήγε η αλεπού;"
      },
      {
        id: 6,
        animal: "🐸",
        animalName: "Βάτραχος",
        position: 1,
        obstacles: ["🪵", "🪵", "🪵"],
        description: "Που πήγε ο βάτραχος;"
      },
      {
        id: 7,
        animal: "🐦",
        animalName: "Πουλί",
        position: 0,
        obstacles: ["☁️", "☁️", "☁️"],
        description: "Που πήγε το πουλί;"
      },
      {
        id: 8,
        animal: "🐭",
        animalName: "Ποντίκι",
        position: 2,
        obstacles: ["🧱", "🧱", "🧱"],
        description: "Που πήγε το ποντίκι;"
      },
      {
        id: 9,
        animal: "🦋",
        animalName: "Πεταλούδα",
        position: 1,
        obstacles: ["🌺", "🌺", "🌺"],
        description: "Που πήγε η πεταλούδα;"
      },
      {
        id: 10,
        animal: "🐝",
        animalName: "Μέλισσα",
        position: 0,
        obstacles: ["🌻", "🌻", "🌻"],
        description: "Που πήγε η μέλισσα;"
      }
    ],
    en: [
      {
        id: 1,
        animal: "🐶",
        animalName: "Dog",
        position: 0,
        obstacles: ["🪴", "🪴", "🪴"],
        description: "Where did the dog go?"
      },
      {
        id: 2,
        animal: "🐱",
        animalName: "Cat",
        position: 1,
        obstacles: ["📦", "📦", "📦"],
        description: "Where did the cat go?"
      },
      {
        id: 3,
        animal: "🐰",
        animalName: "Rabbit",
        position: 2,
        obstacles: ["🎁", "🎁", "🎁"],
        description: "Where did the rabbit go?"
      },
      {
        id: 4,
        animal: "🐻",
        animalName: "Bear",
        position: 0,
        obstacles: ["🌳", "🌳", "🌳"],
        description: "Where did the bear go?"
      },
      {
        id: 5,
        animal: "🦊",
        animalName: "Fox",
        position: 2,
        obstacles: ["🪨", "🪨", "🪨"],
        description: "Where did the fox go?"
      },
      {
        id: 6,
        animal: "🐸",
        animalName: "Frog",
        position: 1,
        obstacles: ["🪵", "🪵", "🪵"],
        description: "Where did the frog go?"
      },
      {
        id: 7,
        animal: "🐦",
        animalName: "Bird",
        position: 0,
        obstacles: ["☁️", "☁️", "☁️"],
        description: "Where did the bird go?"
      },
      {
        id: 8,
        animal: "🐭",
        animalName: "Mouse",
        position: 2,
        obstacles: ["🧱", "🧱", "🧱"],
        description: "Where did the mouse go?"
      },
      {
        id: 9,
        animal: "🦋",
        animalName: "Butterfly",
        position: 1,
        obstacles: ["🌺", "🌺", "🌺"],
        description: "Where did the butterfly go?"
      },
      {
        id: 10,
        animal: "🐝",
        animalName: "Bee",
        position: 0,
        obstacles: ["🌻", "🌻", "🌻"],
        description: "Where did the bee go?"
      }
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

  useEffect(() => {
    setShowingAnimal(true);
    setSelectedPosition(null);
    setShowAnswer(false);

    // Show animal for REVEAL_TIME, then hide
    const hideTimer = setTimeout(() => {
      setShowingAnimal(false);
    }, REVEAL_TIME);

    return () => clearTimeout(hideTimer);
  }, [currentRound, REVEAL_TIME]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🧠"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? 'Κοίτα που πάει το ζώο και θυμήσου'
        : 'Watch where the animal goes and remember';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const handlePositionClick = (position) => {
    if (showAnswer || showingAnimal) return;

    setSelectedPosition(position);
    setShowAnswer(true);

    const isCorrect = position === round.position;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Position Memory Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Position Memory Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
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
        setSelectedPosition(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Μνήμη Θέσης" : "Position Memory"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🧠</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {showingAnimal
              ? (lang === "el" ? "Κοίτα που πάει!" : "Watch where it goes!")
              : round.description
            }
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto">
        {/* Animal moving to position */}
        {showingAnimal && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-yellow-400">
              <div className="text-9xl animate-bounce">{round.animal}</div>
              <p className="text-2xl font-bold text-slate-700 mt-4">
                {round.animalName}
              </p>
              <p className="text-lg text-slate-600 mt-2 animate-pulse">
                {lang === "el" ? "Κοίτα που πηγαίνει..." : "Watch where it goes..."}
              </p>
            </div>
          </div>
        )}

        {/* Obstacles */}
        <div className="flex justify-center items-center gap-8">
          {round.obstacles.map((obstacle, index) => {
            const isCorrectPosition = index === round.position;
            const isSelected = selectedPosition === index;
            const showAnimalHere = showingAnimal && isCorrectPosition;
            const revealAnimal = showAnswer && isCorrectPosition;

            return (
              <button
                key={index}
                onClick={() => handlePositionClick(index)}
                disabled={showAnswer || showingAnimal}
                className={`
                  relative w-56 h-56 rounded-3xl transition-all duration-500 transform
                  ${showAnswer && isCorrectPosition ? 'bg-green-100 border-green-500 scale-110' : ''}
                  ${showAnswer && isSelected && !isCorrectPosition ? 'bg-red-100 border-red-500 animate-shake' : ''}
                  ${!showAnswer ? 'bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                  ${showingAnimal ? 'cursor-not-allowed' : ''}
                  border-4 border-slate-300 flex flex-col items-center justify-center shadow-lg
                `}
              >
                {/* Obstacle */}
                <div className="text-9xl mb-2">{obstacle}</div>

                {/* Animal moving behind (animation) */}
                {showAnimalHere && (
                  <div className="absolute inset-0 flex items-center justify-center animate-slideIn">
                    <div className="text-8xl opacity-50">{round.animal}</div>
                  </div>
                )}

                {/* Reveal animal */}
                {revealAnimal && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="text-7xl animate-bounce">{round.animal}</div>
                  </div>
                )}

                {/* Position label */}
                <p className="text-lg font-bold text-slate-600 mt-2">
                  {index === 0 ? (lang === "el" ? "Αριστερά" : "Left") :
                   index === 1 ? (lang === "el" ? "Μέση" : "Middle") :
                   (lang === "el" ? "Δεξιά" : "Right")}
                </p>

                {/* Correct mark */}
                {showAnswer && isCorrectPosition && (
                  <div className="absolute -top-6 -right-6 text-7xl animate-bounce">
                    ✅
                  </div>
                )}

                {/* Wrong mark */}
                {showAnswer && isSelected && !isCorrectPosition && (
                  <div className="absolute -top-6 -right-6 text-7xl">
                    ❌
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showingAnimal && (
          <div className="text-center mt-8">
            <div className="inline-block bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
              <p className="text-xl font-bold text-yellow-700 animate-pulse">
                {lang === "el" ? "Θυμήσου που πήγε!" : "Remember where it went!"}
              </p>
            </div>
          </div>
        )}
      </div>

      {showAnswer && selectedPosition === round.position && (
        <div className="text-center mt-8 animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Το ${round.animalName} ήταν εκεί!`
                : `🎉 Correct! The ${round.animalName} was there!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedPosition !== round.position && (
        <div className="text-center mt-8 animate-fadeIn">
          <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
            <p className="text-3xl font-bold text-red-700">
              {lang === "el"
                ? `Προσπάθησε ξανά!`
                : `Try again!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική μνήμη!" : "Perfect! You have excellent memory!"}
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
        @keyframes slideIn {
          0% { transform: translateY(-100%) scale(0.5); opacity: 0; }
          50% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(50%) scale(0.8); opacity: 0.3; }
        }
        .animate-slideIn {
          animation: slideIn 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

